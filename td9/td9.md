> Ce TD est à rendre pour dimanche prochain (10 février 2019), à 23h. Nous y consacrerons les deux dernières séances.

Notre cluster est instrumenté avec des outils de monitoring aussi performants que lourds, et on peut visualiser des données sur tous les aspects techniques de notre swarm.

Il nous manque pourtant un dernier type de statistique pour tout savoir sur l'état de santé de notre application : les données utilisateur ! Combien de pages ne s'affichent pas correctement ? Combien l'utilisateur met-il de temps à accéder aux pages qu'il demande ? 

Pour finir le TD, on va essayer d'assurer une qualité de service spécifiée par un [SLA](https://fr.wikipedia.org/wiki/Service-level_agreement) (*Service-Level Agreement*). On propose le SLA suivant :

* Le temps de réponse doit être inférieur à 200ms ;
* Le taux d'erreurs 50x doit rester inférieur à 1%.

## Partie I - Installation de Traefik 

[Traefik](https://traefik.io/) est un *reverse proxy* et un *load balancer*. Il reçoit toutes les connexions entrantes de notre swarm, les fait suivre au bon service selon l'URL demandée (reverse proxy), et dispatche la charge sur les différentes répliques (load balancer). Enfin, les noms de version de Traefik sont des fromages, raison de plus pour l'utiliser.

C'est Traefik qui va nous donner les métriques comme le temps de réponse et le taux d'erreurs.

1. Comment Traefik collecte-t-il ces métriques ?

2. Choisissez un nom de domaine pour votre galerie. Modifiez le `/etc/hosts` de votre hôte afin de faire pointer le nom de domaine choisi vers votre manager. Vous aurez à modifier le fichier pour *chaque* sous-domaine que vous ajouterez à votre stack (point de wildcard `*` dans `/etc/hosts`).

3. Ajoutez Traefik à votre stack de la galerie. Vous n'avez que votre `docker-stack` à modifier, mais il faut y ajouter pas mal de choses (notamment des *labels* sous l'item `deploy:` des services que vous voulez gérer avec Treafik). Le but est que vous accédiez à votre application via le nom de domaine que vous aurez choisi, sur le port 80.

4. Allez dans l'onglet "Health" de Traefik, et lancez quelques clients. Votre service respecte-t-il le SLA ? Si ce n'est pas le cas, définissez un SLA plus permissif (qui garantisse quand même une bonne navigation dans la mesure du possible).

## Partie II - Incorporation à la stack de monitoring

Nous avons de belles données dans l'onglet "Health" de Traefik, mais on préférerait que toutes les données soient accessibles sur Grafana.

1. Comment exporter les données de Traefik vers Grafana ?

2. Réalisez l'export. Créez un graphique affichant le temps de réponse de la galerie, et un autre affichant les codes HTTP retournés au client.

3. Créez des alertes (accessibles sur le port 9094) qui se déclenchent si votre SLA n'est pas respecté.

## Partie III - Chargez

Observons comment notre système se comporte quand on lui coupe des membres :

1. Ajoutez le service `visualizer` et assurez-vous que certains services sont bien distribués sur les workers. Générez un flux de clients suffisamment faible pour qu'il respecte votre SLA, et éteignez un des workers avec `vagrant halt ...`. Commentez. 

2. Essayez différentes configurations de panne, et commentez le comportement de votre swarm. Qu'arrive-t-il si vous éteignez le manager ? 

3. Reconfigurez votre Swarm pour que tous les noeuds soient des managers (pas besoin de relancer les machines). Revoyez la configuration de votre swarm pour mieux égaliser la charge. Éteignez une, puis deux machines. Comment se compote votre swarm ?

On s'intéresse maintenant aux voies d'amélioration de notre service. Tous les coups sont permis (*tant qu'ils sont justifiés*) pour réussir à accepter plus de connexions concurrentes.

4. Itérativement : déterminez la limite du nombre de clients concurrents avant de ne plus respecter votre SLA ; identifiez le goulot d'étranglement de votre système ; proposez et implémenter une solution. 

	La condition d'arrêt est l'échec : arrêtez-vous quand vous n'arriverez plus à garantir le SLA avec un nombres de clients concurrents supérieur à votre limite précédente.

	N'hésitez pas à commenter les amorces de solutions qui n'ont pas réussi. Savoir ce qui ne marche pas, c'est aussi important !


## Partie facultative - Connexions sécurisées

Nous aurions dû commencer par là : depuis [Let's Encrypt](https://letsencrypt.org/), on n'a plus de bonne raison de ne pas installer SSL sur sa stack web, c'est gratuit.

1. Mettez en place SSL sur votre stack (en priorité sur la galerie, en incluant l'object storage).

Un tutoriel honnête sur [DockerSwarm.Rocks](https://dockerswarm.rocks/traefik/). Il utilise Consul, un key-value store distribué, ce qui ne m'a pas l'air nécessaire pour nous (notamment grâce au répertoire partagé `/vagrant`). N'importe quelle solution fera l'affaire.

2. Générez de la charge, et comparez la performance de votre service sécurisé par rapport à sa version sans SSL. 