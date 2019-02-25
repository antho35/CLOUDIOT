**Docker** permet de gérer un ensemble de
conteneurs. **Docker** est plus qu'un simple executable, c'est
tout un écosystème doté d'une infrastructure qui permet de gérer de
multiples conteneurs et images. **Docker** peut sembler simple à
première vue, mais son utilisation se complexifie très rapidement dès
lors que l'on souhaite réaliser un véritable déploiement. Il est alors
fondamental de bien maîtriser le B.A.-BA de son fonctionnement.


## Partie I - Initiation

1. Vérifier la présence des éxécutables suivants grâce aux commandes suivantes:
```Shell
docker --version
docker-compose --version
docker-machine --version
```
2. Executer votre premier conteneur grâce à la commande
suivante: `docker run hello-world`. Schématiser l'infrastructure.
3. On souhaite dorénavant lancer un serveur web à l'intérieur d'un conteneur en lieu et place d'un message texte.
```Shell
docker run -d -p 80:80 --name webserver nginx
```
Voir la documentation de la commande [docker run](https://docs.docker.com/engine/reference/run/).
Que c'est-il passé? Expliquer.

4. Vérifier la présence de vos images dans le dépôt local grâce à la commande `docker images`
Voir la documentation de la commande [docker images](https://docs.docker.com/engine/reference/commandline/images/).
D'où proviennent ces images?
1. On souhaite dorénavant utiliser node.js à l'intérieur d'un container. Faites une recherche de l'image officielle grâce à la commande `docker search`.
Voir la documentation de la commande [docker search](https://docs.docker.com/engine/reference/commandline/search/).
1.  Il est possible de voir le détail de l'image officielle
**node.js** déployé sur **Docker Hub** directement dans le navigateur web à l'adresse
suivante: [https://hub.docker.com/\_/node/](https://hub.docker.com/\_/node/).
1. Récupérer dorénavant la dernière version de l'image officielle de **node.js** en version grâce à la commande `docker pull`. Voir la documentation de la commande [docker pull](https://docs.docker.com/engine/reference/commandline/pull/).
1. Lister l'ensemble de vos images locales, vérifier que vous disposez bien de **node.js**
1. Déterminer la liste des conteneurs qui s'éxécutent en tâche de fond avec la commande `docker ps`. Voir la documentation de [docker ps](https://docs.docker.com/engine/reference/commandline/ps/). Votre image **node.js** s'éxécute-t-elle? Si non pourquoi?
1. Arrêter tous vos conteneurs grâce à la commande `docker stop`. 
Voir la documentation de [docker stop(https://docs.docker.com/engine/reference/commandline/stop/)
1. Quelle est la différence entre les commandes `docker rm` et `docker rmi`

## Partie II - Personalisation d'une image

Maintenant que l'on maîtrise les commandes essentielles
pour gérer des images et des conteneurs, il est temps de créer sa
propre image. L'objectif est de mettre en place un serveur de type
**reverse proxy**.

### Montage de volumes

1.  Lancer un conteneur **nginx** officiel ayant comme
version 1.15.5 de façon à ce qu'il soit accessible par le port 80.
1. Vérifier que votre conteneur est bien
lancé *via* la commande suivante: `curl http://localhost:80`
1. On souhaite dorénavant délivrer son propre contenu. Créer un répertoire `docker-nginx/html`, et créer votre propre fichier `index.html`
1.  Il existe plusieurs possibilités pour intégrer cette
nouvelle page dans le conteneur `nginx`. On peut au choix soit modifier le conteneur `Docker`, ou créer un lien entre l'espace de stockage de l'hôte, et celui du conteneur. Nous allons choisir pour
l'instant cette deuxième option. Cela correspond à la notion de volume.
Lire la documentation sur la notion de [volume](https://docs.docker.com/engine/tutorials/dockervolumes/). Nous
  allons donc créer un lien avec le nouveau fichier `index.hml`
  situé dans le répertoire: `~/docker-nginx/html`.
Plus particulièrement, nous allons réaliser un `bind-mount` pour monter un répertoire de la station hôte à l'intérieur du container. Lire la documentation sur la notion de [bind-mount](https://docs.docker.com/storage/bind-mounts/).
1. Pour débugger, vous pouvez utiliser [docker logs](https://docs.docker.com/engine/reference/commandline/logs/)
1.  Vérifier le bon fonctionnement de votre serveur
`nginx` en vous rendant à l'url
[http://localhost:80/index.html](http://localhost:80/index.html). Modifier en temps réel le
fichier `index.html` et vérifier que les modifications sont bien prises
en compte directement dans votre navigateur.
1. On souhaite dorénavant, visualiser (et non pas remplacer) les fichiers de
configuration par défaut du serveur `nginx`. Pourquoi d'après vous, est-il impossible de se connecter
directement au conteneur `nginx`, *via* par example un
`ssh` pour modifier ses fichiers de configuration?

### Création d'une image

8. Une méthode permettant de visualiser les fichiers de
configuration du conteneur `nginx` est de créer sa propre image
`nginx` qui expose le répertoire qui nous interesse. Dans cet objectif, on va utiliser la commande `docker build` qui prend comme argument un fichier
`Dockerfile` qui décrit comment la nouvelle image est crée. Voir la documentation de [Dockerfile](https://docs.docker.com/engine/reference/builder/),
et plus particulièrement la directive [VOLUME](https://docs.docker.com/engine/reference/builder/#volume), ainsi que de la commande [docker build](https://docs.docker.com/engine/reference/commandline/build/).
1. Créer le fichier Dockerfile ci-dessous:
  ```Dockerfile
  FROM nginx
  VOLUME /etc/nginx
  ```
10. Créer  une nouvelle image à l'aide de la commande
`docker build --tag mynginximage .` dans le répertoire
dans lequel se trouve votre fichier Dockerfile. Vérifier la création de votre nouvelle image.

1. Executer votre nouvelle image nommée `nginx2` à partir de votre image nouvellement crée `mynginximage`.
1. Créer un nouveau conteneur `debian` qui partage le volume `/etc/nginx` de votre conteneur `nginx2`, et qui dispose comme processus principal la commande `bash` afin d’avoir une console.
  ```
  docker run -i -t --volumes-from nginx2 --name nginxfiles debian /bin/bash
  ```
13. Expliquer la manoeuvre. Que c'est-il passé? Détaillez.
1. Naviguer dans les répertoires de votre conteneur et en
particulier dans le répertoire `/etc/nginx`. Analyser le contenu du
fichier `nginx.conf`. Ce dernier dépend en particulier d'un
autre fichier `/etc/nginx/conf.d/default.conf` qui définit le
comportement du serveur.
1. Copier/coller son contenu
dans un nouveau fichier `docker-nginx/default.conf` sur votre hôte. Vous pouvez notemment vous aidez
de la commande [docker cp](https://docs.docker.com/engine/reference/commandline/cp/).
> Pour information: le ficher de configuration de `nginx` se décompose en plusieurs
bloques `main`, `http`, `location`.  Les
bloques sont délimités par des accolades \{ et \}. Les bloques qui
inclus d'autres bloques sont appelés des contextes. Les bloques
qui ne sont dans aucun contexte sont par défaut dans le contexte dit
`main`. Ainsi les bloques `events` et `http` sont
définis dans le contexte `main`. Tandis que le contexte
`server` se définit dans le contexte `http` et le
contexte `location` se définit dans un contexte
`server`. En général un serveur web dispose de plusieurs bloques
`server` distingués par des ports et par des noms de serveurs
différents. Une fois que le serveur `nginx` décide quel serveur
doit traiter une requête entrante, le chemin indiqué dans son entête est
ensuite testé avec le motif déclaré dans le bloque `location`.
Pour plus d'information, veuillez lire la documentation de [nginx](http://nginx.org/en/docs/beginners_guide.html).

### Conteneur personalisé

16. A partir de la documentation de [nginx](http://nginx.org/en/docs/beginners_guide.html) modifier le fichier de configuration `default.conf` afin de créer un simple proxy. C’est à dire un serveur `nginx` accessible à partir `http://localhost:80` capable de délivrer des images à partir d’un répertoire local `/usr/share/nginx/image`
 de votre conteneur, et un serveur web qui écoute sur le port 8080 pour toutes les autres requêtes (et qui donc délivre les pages `web` à partir du répertoire local `/usr/share/nginx/html`). Quelle est la ligne de commande? Pour débugger votre conteneur, utilisez la commande [docker log](https://docs.docker.com/engine/reference/commandline/logs/). Utilisez les 2 répertoires [html](html) et [images](images) du dépot `git` comme source.

1. La ligne de commande pour lancer votre nouveau conteneur
devient de plus en plus complexe. Une autre alternative est de copier
le contenu et les fichiers de configuration directement à l'intérieur
de l'image. On souhaite donc dorénavant construire
une nouvelle image qui contient par défaut les fichiers de configuration et les
images. Pour ce faire, créer un nouveau fichier `Dockerfile`,
 et créer votre propre image *via* la
commande `docker build -t nginxcustom .`
