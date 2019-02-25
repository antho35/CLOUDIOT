On souhaite créer une galerie d'images que nous déploierons plus tard en suivant une architecture microservices.


## Partie I - "Hello World" Node.js + Express avec Docker 

### Création du "Hello World"

1. Initialiser un projet Node.js dans un nouveau répertoire `gallery` et installer le module Express.

3. Créer un "Hello World" dans `index.js` écoutant le port 3000:

		var express = require('express')
		var app = express()
		var port = 3000

		app.get('/', function (req, res) {
		  console.log('Client requested /')
		  res.send('Hello World!')
		})

		app.listen(port, function () {
		  console.log(`App listening on http://localhost:${port}!`)
		})

	Tester votre app en lançant `node index.js` et en ouvrant `http://localhost:3000` dans votre navigateur.

4. Modifier `package.json` pour pouvoir lancer votre app avec la commande `npm start`.


### Conteneurisation de notre app

Comme lors du TD1, nous allons utiliser l'image Docker [Node.js](https://hub.docker.com/_/node/).

1. Quelle est la taille de l'image `node` que vous avez installée lors du TD1 ? De quelles solutions disposons-nous pour réduire cette taille ?

2. Créer un `Dockerfile` qui génère une image `mynodeimage` qu'on puisse lancer via:

		docker run --rm --name mynodeapp -p 3000:3000 mynodeimage

	On souhaite obtenir le même résultat que précédemment en visitant `http://localhost:3000`.

3. Ne pas empaqueter `node_modules` dans son application est une bonne pratique : certaines dépendences sont spéficiques à une plateforme (Linux, Windows), et il vaut mieux laisser les utilisateurs du projet les installer en utilisant `package.json`.
	
	Si on crée un fichier `.dockerignore` contenant:

		node_modules

	`mynodeimage` ne contiendra pas les modules qu'on a installés sur l'hôte. Comment faire pour que les modules soient installés lors du build de l'image Docker ?

## Partie II - Création d'une galerie d'images statique 

Maintenant que l'on a vu comment déployer un projet Node.js avec ses dépendances, on veut créer une galerie d'images organisées en albums avec une interface web moderne.

Fonctionnalités : La page d'accueil liste des albums, qui contiennent des photos. Une photo n'appartient qu'à un seul album. Chaque photo a un titre. On fait défiler les photos d'un album dans un carrousel au choix.

Au choix : Utilisation d'[express-generator](https://expressjs.com/en/starter/generator.html) pour générer un squelette de projet.

1. Créer une galerie d'images en utilisant au moins Express, un [moteur de templates](https://expressjs.com/en/guide/using-template-engines.html) (Handlebars, Mustache, Pug ou autre), et [Bootstrap](https://getbootstrap.com/).

	Pour organiser les photos, deux solutions :

	* L'arborescence des images dicte leur titre et l'organisation des albums 

	* Les métadonnées sont spécifiées dans un fichier de configuration 

2. Déployer la galerie avec Docker en utilisant un volume contenant les photos (et éventuellement un autre volume pour les fichiers de configuration).

3. Générer des miniatures à partir des photos. Le but est que le client n'ait pas à télécharger plus d'une photo HD par page.

## Pour prendre de l'avance 

Si vous en avez le temps, je vous conseille de commencer à lire le [TD4](../td4/td4.md). Nous rendrons notre galerie dynamique en y ajoutant notamment une base de données. 