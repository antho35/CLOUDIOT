
Après les vicissitudes du TD précédent, nous sommes prêts à déployer notre galerie d'images sur un cluster de serveurs en utilisant Docker Swarm.

## Partie I - Retour sur les bases de Docker 

Vous l'aurez compris par la pratique, Docker permet de déployer facilement des applications, empaquetées avec leurs dépendances dans des conteneurs qu'on peut lancer sur n'importe quelle machine. Ça ne nous dit pas comment ça marche ! D'ailleurs vous allez me le dire :

1. Citez trois différences entre Machines Virtuelles et conteneurs.

2. Citez les différentes parties du système qui sont isolées par Docker. En d'autres termes, quels éléments du système peuvent être cachés au(x) processus qui s'exécute dans un conteneur ?

3. Je veux utiliser Docker pour empaqueter le Wordpress de ma tante. Est-ce que je devrais tout mettre dans un conteneur ? Pourquoi ?

4. Au travail, je ne suis pas administrateur (pas dans le groupe `sudo`), par contre je suis dans le groupe `docker` (et peux donc exécuter `docker run ...`). Expliquez pourquoi les administrateurs de mon réseau sont des incapables. (Bonus point: fournissez le détail des commandes qui me permettront de devenir administrateur.)

## Partie II - Docker Swarm 

[Docker Swarm](https://docs.docker.com/engine/swarm/) permet d'interconnecter des serveurs Docker (Docker étant constitué d'un serveur (qui lance des conteneurs) et d'un client (qui fournit l'interface)), afin de créer un cluster de machines gérant les mêmes services distribués.

Le serveur qui initialise le swarm en devient le manager (avec `docker swarm init`). On peut ajouter des managers par sécurité, mais dans notre cas (trois machines), on se contentera de workers.

1. [Initialisez le swarm](https://docs.docker.com/engine/swarm/swarm-tutorial/create-swarm/) en utilisant Ansible. On a vu que le manager et les workers exécutaient deux playbooks Ansible différents.

Docker Swarm introduit [de nouveaux concepts](https://docs.docker.com/engine/swarm/key-concepts/), notamment celle des [services](https://docs.docker.com/engine/swarm/how-swarm-mode-works/services/). Ils sont constitués d'une ou plusieurs *répliques* (conteneurs) de la même image, dont le placement sur les machines (les nœuds) est orchestré par le Swarm (en respectant les contraintes fournies par l'utilisateur).

Notre but est de transformer l'architecture de notre application de la façon suivante : 

![Architecture microservices de la galerie dynamique](images/archi.svg)

Node et Redis vont devenir des services, et seront donc répartis sur plusieurs machines. Nous ajouterons un service Nginx (qu'on pourrait aussi répliquer) qui servira les requêtes aux serveurs.

Cette infrastructure, déployée sur trois machines, permettra de servir plus de requêtes qu'avec une seule. De plus, si elle est bien configurée, *l'application continuera de fonctionner même si certaines machines tombent en panne* (high availability) ! 

