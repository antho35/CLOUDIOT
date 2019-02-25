
On va reprendre notre galerie d'images en y ajoutant un data store. On y stockera l'organisation des photos et une gestion des utilisateurs.

* **Gestion des photos :** On souhaite pouvoir ajouter/supprimer des photos et des albums, changer les photos d'album, pouvoir ajouter des tags aux photos, et afficher les photos par tag. Chaque photo n'appartient toujours qu'à un album. La génération et l'utilisation de miniatures est obligatoire (pas plus d'une photo HD par page).

* **Gestion des utilisateurs :** On veut pouvoir créer des utilisateurs ayant des accès plus ou moins restreints aux albums (lecture et/ou modification). Le ou les administrateur(s) peuvent gérer les utilisateurs. Certains albums peuvent être visibles publiquement.

## Partie I - Redis Datastore

Pour stocker les données de notre projet, nous pourrions utiliser une base de données relationnelle (ou [RDBMS](https://en.wikipedia.org/wiki/Relational_database_management_system)) type MySQL. Le modèle relationnel a de nombreux avantages, et un gros inconvénient : il est difficile de déployer une RDBMS sur plusieurs serveurs. 

C'est pourtant important dans une architecture microservices, où on veut s'assurer que notre application sera toujours disponible en déployant chaque service sur plusieurs machines (au cas où l'une d'elles crashe). C'est pourquoi nous allons nous tourner vers une [base de données clé-valeur](https://en.wikipedia.org/wiki/Key-value_database) qui est faite pour être distribuée sur plusieurs machines : [Redis](https://redis.io/).

### Prise en main

Le fonctionnement général de Redis est expliqué [ici](https://redis.io/topics/data-types-intro). Les exemples utilisent la console Redis ou Command-Line Interface (CLI).

Pour essayer la console Redis par vous-même, le plus simple est d'utiliser Docker. Vous avez besoin de deux conteneurs :

* Un démon contenant la base de données, qu'on peut lancer avec :

		docker run --name redis-datastore -d redis 

* La CLI, qu'on peut démarrer comme ça :

		docker run -it --link redis-datastore:redis-cli --rm redis redis-cli -h redis-datastore

1. Familiarisez-vous avec la CLI en essayant d'ajouter quelques valeurs au datastore.

2. Si vous supprimez le datastore avec `docker rm -f redis-datastore` et le recréez, vos données sont perdues. Comment faire pour conserver les données du datastore quand vous supprimez le conteneur ?

<!-- 2. Commencer par mettre en place une architecture microservices qui isole la base de données du serveur Node.js et des images (avec `docker-compose` par exemple). -->

## Partie II - Architecture 

### Création d'une infrastructure Docker Node + Redis 

1. Avec `docker-compose`, mettez en place un serveur Node.js connecté à un datastore Redis (en vous assurant de la **persistance des données**). Vous pouvez dupliquer le projet du TD3 pour ce faire.

### Import des données 

Désormais, toutes les méta-données de notre galerie seront stockées dans Redis. Il va donc falloir commencer par les importer.

Les key-value stores sont bêtes et méchants (et c'est pourquoi ils sont puissants) : à une clé est associée une valeur, et c'est tout. Pas de tables, de colonnes, de clés étrangères... Pour organiser nos données, on utilise des conventions de nommage pour les clés, par exemple :

	$table_name:$primary_key[:$secondary_key]:$attribute = $value 

Heureusement, on dispose de fonctions puissantes pour itérer sur nos clés : [KEYS](https://redis.io/commands/keys) et [SCAN](https://redis.io/commands/scan) entre autres.

1. Proposer une convention pour organiser les données de votre galerie.

La suite s'effectue via la CLI, ou en utilisant Node.js et le module [redis](http://redis.js.org/).

2. Importer quelques méta-données d'images/albums dans Redis en suivant votre convention.

3. Proposer un code source (ou une commande) permettant d'afficher le nom de chaque album.

4. Proposer un code source (ou une commande) permettant d'afficher l'emplacement disque de chaque photo d'un album.

### Portage du code

3. Porter le code du TD3 pour que les métadonnées des photos soient stockées dans la base de données.

4. Implémenter l'ajout/modification/suppression des images et des albums.

5. Implémenter la gestion des utilisateurs.

6. Permettre aux utilisateurs (autorisés ?) de tagguer les photos et permettre d'afficher des collections d'images partageant le même tag.

## Pour aller plus loin 

Ajoutez des statuts et des commentaires et vous obtenez le réseau social du futur ?