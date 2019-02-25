Lors du TD précédent, nous avons créé de faux clients pour simuler du trafic sur notre application, et nous avons commencé à mettre en place de la métrologie en créant une instance [Prometheus](https://prometheus.io/) qui collecte des données sur notre Swarm et les enregistre sous forme de séries temporelles.

Aujourd'hui, nous allons continuer notre périple vers le monitoring de notre infrastructure, en cherchant tout d'abord à acquérir plus de métriques, via ... de nouveaux services ! Nous les incorporerons à Prometheus, ce qui nous permettra de les afficher sommairement. Mais ce n'est que quand nous installerons [Grafana](https://grafana.com/) que nous serons récompensés avec de beaux graphiques. C'est une suite de visualisation de données très puissante et belle visuellement.

	 ------------------
	 | Docker Metrics | -
	 ------------------   \    --------------      -----------
             ...            -> | Prometheus | ---> | Grafana |
	 ------------------   /    --------------      -----------
	 | Autres sources | -             |                 |
	 ------------------               |                 |
              |                       |                 |
	(sources de données)        (traitement)       (affichage)


## Partie I - Retour sur notre galerie 

La question ici est : quels sont les goulots d'étranglement de notre application ? En d'autres terme, quelle point du système limite particulièrement les performances globales ? Dans une application distribuée, en plus des ressources habituelles (mémoire, CPU, disque), le goulot d'étranglement peut aussi venir du réseau.

Si vous avez bien réussie la création de clients émulés, vous devriez être en mesure de créer plusieurs utilisateurs qui se connectent de façon concurrentes à votre application. En admettant que vous avez créé un service exécutant vos utilisateurs, vous pouvez augmenter son nombre de répliques en temps réel avec :

	docker service scale MON_SERVICE=NB_REPLIQUES

Vous pouvez commencer par regarder avec des outils Linux comme `htop` quelle ressource a l'air de pâtir le plus de l'augmentation des utilisateurs. Certes, ce n'est pas très pratique.

1. Répondez à la question précédente comme vous le pouvez avec les outils dont vous disposez. Justifiez.

## Partie II - Collecte et affichage de données

Si vous avez pu collecter les métriques fournies par Docker avec Prometheus, vous aurez remarqué qu'elles sont nombreuses, et pas forcément les meilleures (l'évolution du nombre de CPUs dans le temps nous intéresse peu ici). Si vous ne vous en êtes pas encore rendu compte, allez regarder l'onglet "Graph" de Prometheus, et son dropdown bien fourni.

Comprenez bien que l'API Docker fournit toutes ces métriques *à l'instant T*. C'est Prometheus qui les enregistre dans une base de données de séries temporelles (*time series* en anglais). En plus de cela, Prometheus peut déclencher des alertes dont on aura défini [les règles](https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/) dans des fichiers de configuration.

Voici quelques outils de collecte de métriques qui s'interfacent avec Docker :

* [cAdvisor](https://github.com/google/cadvisor/) -- Récupère des infos sur la consommation de ressources du système en général et des conteneurs Docker en particulier.
* [node-exporter](https://github.com/prometheus/node_exporter) Exporte spécifiquement pour Prometheus des données sur les ressources matérielles des hôtes (nodes) d'un swarm Docker.
* [dockerd-exporter](https://github.com/stefanprodan/dockerd-exporter) Exporte spécifiquement pour Prometheus des données sur le serveur Docker.

1. Créez une nouvelle stack Docker nommée "monitor" et contenant [cAdvisor](https://github.com/google/cadvisor) et Prometheus. Faites tourner la stack de la galerie à côté (sans aucun service de monitoring). Récupérez uniquement les données de cAdvisor ([un peu de doc](https://github.com/google/cadvisor/blob/master/docs/storage/prometheus.md)) dans Prometheus et affichez celles qui vous semblent intéressantes dans l'onglet Graph de Prometheus.

2. Ajoutez Grafana à la stack ([un tutoriel correct](https://medium.com/@salohyprivat/prometheus-and-grafana-d59f3b1ded8b), mais il y en a d'autres). Connectez-vous à Grafana, ajoutez Prometheus comme source de données, créez un nouveau dashboard, et ajoutez un graphique. Éditez-le pour qu'il affiche des données issues de Prometheus. Admirez le résultat.

## Partie III - Le bazooka

Marre d'installer des outils à la pelle ! Des gens plus intelligents que nous l'ont déjà fait à notre place : j'ai nommé [SwarmProm](https://github.com/stefanprodan/swarmprom).

1. Arrêtez la stack "monitor", laissez tourner la galerie, et installez SwarmProm en clonant le dépôt et en suivant les instructions données du README. Connectez-vous à Grafana, ouvrez un dashboard, et appréciez le résultat.

2. Quelles sont les sources de données de Grafana ?

3. Quelles sont les sources de données de Prometheus ?

Connectez-vous à Unsee (port 9094). C'est un gestionnaire d'alertes. Il peut être vide si tout va bien dans votre système.

5. Des alertes sont configurées dans Prometheus. Détaillez leur fonctionnement.

Vous avez désormais une vision assez détaillée de votre système pour étudier le fonctionnement de votre système en présence de charge. 

6. Générez du trafic et identifiez les goulots d'étranglement de votre système.