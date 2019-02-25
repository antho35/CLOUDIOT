Plusieurs problématiques émergent de la solution précédente.
Le serveur délivrant les pages html statiques et les images se
trouvent dans la même image. Une des solutions est d'héberger chaque site
dans son propre conteneur **docker**.

## Partie I - Interconnection de conteneurs

On souhaite créer trois conteneurs que nous allons interconnecter en réseaux.

1. Créer un nouveau projet ayant la structure suivante:

![Alt text](images/dirtree.png?raw=true "Répertoire du projet")

1. Modifier les fichiers **index.html** de façon à différencier les
deux sites.

1.  Lancer les deux conteneurs correspondant aux différents
sites web, chacun sur un port different **8080** et **8081**.

1.  Il ne vous reste plus qu'à configurer les fichiers de
configuration du `proxy` et de créer le conteneur `proxy`. On utilisera en
particulier dans le block server la directive [proxy\_pass](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/) avec
l'adresse **ip** de chaque conteneur.

>Pour obtenir l'adresse `ip` d'un conteneur utiliser la commande
suivante `docker inspect --format '{{
      .NetworkSettings.IPAddress }}' CID}'`, `CID` étant l'identifiant du conteneur.

4.  Créer l'image correspondant au `proxy`, et lancer le
conteneur.

1.  Comme le `proxy` fonctionne en fonction du nom de domaine
saisi dans le navigateur web, modifier votre fichier **/etc/hosts** afin
d'ajouter la résolution de nom de vos sites **site1** et
**site2**. On pourra tester au choix dans un navigateur, ou à
l'aide de la commande `curl`, en faisant un
`curl http://site1` et/ou un  `curl http://site2`

1. Quelles sont les inconvénients de cette solution? Redemarer
les conteneurs correspondant aux **site1** et **site2**. Que
se passe t'il?

## Docker link

Une autre alternative est d'utiliser la possibilité de créer des liens
entre conteneurs. Cela est possible avec l'option [--link](https://docs.docker.com/network/links/) de `docker run`. Par exemple si les conteneurs executant les deux serveurs web
se nomment `site1` et `site2`, et celui contenant le
proxy (appelé `le bénéficiaire`) se nomme `proxy` alors on fera un:
`docker run -d -p80:80 --name proxy --link site1 --link site2 proxy` pour lié le conteneur `proxy` aux deux autres conteneurs.

>La creation d'un lien entre conteneurs se manifeste par la creation de
variables d'environnement et la mise à jour du fichier `/etc/hosts`
du conteneur qui est le bénéficiaire  (par exemple
ici le conteneur `proxy`) des conteneurs liés.

1. Lister les variables d'environnement du conteneur
`proxy` *via* la commande `docker exec CID printenv`.
`CID` étant l'identifiant du conteneur.

>Les variables d'environnement sont de la forme:
`<name>_PORT_<protocol>`. Le champ `<NAME>`
correspondant au nom ou à l'alias du conteneur lié, tandis que le
champ `<PROTOCOL>` peut prendre la valeur `TCP` ou `IP`. On aura alors pour un conteneur bénéficiaire lié a un conteneur ayant comme nom `site1`, un ensemble de variable d'environnement:
```
...
SITE1_PORT_80_TCP_PROTO=tcp
SITE1_PORT_80_TCP_PORT=80
SITE1_PORT_80_TCP_ADDR=172.17.0.1
...
```
>L'existence de ces variables d'environnement est fondamentale, car
dans les fichiers de configuration de votre application (celle qui
s'execute sur votre conteneur bénéficiaire), il sera alors
possible de faire référence à ces variables pour
connaitre l'adresse `IP` des conteneurs liés.

2. Vérifier que le fichier `/etc/hosts` du conteneur
bénéficiaire a bien été mis à jour, et contient bien l'association
`nom/@ip` des conteneurs liés.

>C'est le fichier `etc/hosts` qui va permetre de résoudre
localement (au niveau du conteneur bénéficiaire)
le nom des conteneurs liés et d'obtenir ainsi leurs adresses `IP`.
```
...
127.0.0.1      	localhost
172.17.0.1     	site1 656326bbe1d4 sad_blackwell
...
```
>Ainsi, que l'on utilise le nom dans le conteneur `site1`, `656326bbe1d4` et/ou
`sad_blackwell`, ils seront résolus vers l'adresse `172.17.0.1`.

3. Quelles sont les avantages de la liaison entre conteneurs?
Modifier en conséquence la configuration du serveur `proxy`, en
utilisant les noms des conteneurs au lieu de leurs adresses `IP`.

1. Stopper tous les conteneurs, puis redemarer les. Que se
passe t'il? Pourquoi?

## Partie II - Docker-compose

Pour une composition simple cela peut se révéler
suffisant d'utiliser des liens. Toutefois, la ligne de commande devient rapidement
surchargée. Pour éviter cet inconvénient, on se propose d'utiliser
[docker-compose](https://docs.docker.com/compose/overview/).

1.  Créer un nouveau projet ayant la structure suivante:

![Alt text](images/compose.png?raw=true "Répertoire du projet")


2. En suivant la documentation de référence
[https://docs.docker.com/compose/compose-file/](https://docs.docker.com/compose/compose-file/),
créer un fichier `docker-compose.yml` à la racine de votre projet qui décrit votre composition.

>`docker-compose up` ne reconstruit pas les images si vous avez
modifié les fichiers `Dockerfile`. Pour ce faire, faire un
`docker-compose build`.

3. Lancer votre composition avec la commande `docker-compose up`.

> Vous pouvez lancer votre composition en tâche de fond en utilisant un `-d`

4. Stopper les conteneurs correspondant aux deux sites web dans
l'ordre inverse, puis redemarer les. Que se
passe t’il ? Pourquoi ?
