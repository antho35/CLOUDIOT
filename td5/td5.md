
Nous avons une désormais belle application. Hélas, les milliers de curieux qui se connectent à notre site par seconde nous obligent à **passer à l'échelle**. Pour cela, deux solutions :

* *Scale up* (vertical scaling): Louer un serveur avec plus de RAM et de CPU, ou

* *Scale out* (horizontal scaling): Louer plus de serveurs, qui se répartiront la charge.

1. Lister 3 avantages de chaque solution.

Nous allons nous pencher sur la seconde, *scale out*, en utilisant trois ordinateurs pour distribuer la charge. C'est la solution *de facto* à l'époque du cloud, où louer des machines médiocres ne coûte pas cher, et à l'ère des microservices, qui permettent de segmenter les applications en services logiques indépendants communicant par messages (et souvent développés par des équipes différentes).

> Ne pas oublier que même Twitter commença sur une seule machine. En effet, la gestion d'une infrastructure distribuée est complexe, et on peut débattre de l'intérêt de vouloir distribuer une application trop tôt.

Nous utiliserons Vagrant pour lancer des VMs sur notre machine (qui simuleront un déploiement cloud). Vagrant permet de créer des VMs suivant une configuration précise, donnée par un fichier : le `Vagrantfile`. Pour configurer nos VMs, nous utiliserons ensuite Ansible : c'est un moteur d’automatisation pour l’approvisionnement et la configuration de machines, et pour le déploiement d’applications. Il nous permettra d'installer et paramétrer tout ce qu'il faut pour pouvoir déployer notre galerie d'images sur notre cluster. Enfin, nous réaliserons le déploiement en utilisant Docker Swarm.


## Partie I - Déployer des VMs avec Vagrant

> Tous les étudiants sur Windows peuvent maintenant louer des serveurs à leurs frais ou sortir de la salle...

Nous allons grosso modo suivre le [Getting Started](https://www.vagrantup.com/intro/getting-started/index.html) de Vagrant.

1. Commencez par installer [Vagrant](https://www.vagrantup.com/downloads.html) et [VirtualBox](https://www.virtualbox.org/wiki/Linux_Downloads) sur votre machine **sans passer par votre gestionnaire de dépôts**.

2. Créez un nouveau dossier et exécutez `vagrant init ubuntu/xenial64`. Vous obtiendrez un `Vagrantfile` fort commenté. Lisez-le, ça vous sera utile.

	On utilisera toujours `ubuntu/xenial64`. Pour votre information, le `Vagrantfile` utilise une syntaxe Ruby. 

3. Comment lancer et se connecter à la VM que l'on a initialisée ?

4. Comment partager des fichiers entre l'hôte et la VM ?

5. Comment arrêter la VM ? Comment la détruire ?

6. Que fait ce `Vagrantfile` ?

		Vagrant.configure(2) do |config|
			# Define box `m0'
			config.vm.define "m0" do |m0|
				m0.vm.hostname = "m0"
				m0.vm.box = "ubuntu/xenial64"
			end
		 
			# Define boxes `m1' and `m2' with a for-loop
			(1..2).each do |i|
				config.vm.define "m#{i}" do |machine|
					machine.vm.hostname = "m#{i}"
					machine.vm.box = "ubuntu/xenial64"
				end 
			end 
		end

7. Nous aurons besoin d'un sous-réseau virtuel et d'IPs fixes pour nos VMs. Quelles lignes faut-il ajouter à votre `Vagrantfile` pour ce faire ?

## Partie II - Ansible ou l'automatisation de tâches distantes

Le rôle de Vagrant s'arrête à l'installation des VMs. Nous sommes encore loin d'avoir notre galerie déployée et fonctionnelle. Vagrant délègue cette tâche au "provisioner" ("provisionneur" en fançais : on utilisera l'anglais) de notre choix. Nous en utiliserons un particulièrement puissant et casse-pieds : Ansible.

1. Commencez par [installer Ansible](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html).

Ansible exécute des *playbooks* sur les machines de notre choix. On va commencer par installer Docker sur **une seule machine** démarrée avec Vagrant (vu la durée des scripts...). Ils sont écrits en YAML, et sont constitués de "tâches" : une pléthore de [modules](https://docs.ansible.com/ansible/latest/modules/modules_by_category.html)  permet de réaliser des actions complexes en très peu de lignes.

Voici [la doc d'Ansible sur Vagrant](https://docs.ansible.com/ansible/latest/scenario_guides/guide_vagrant.html?highlight=vagrant), et [la doc de Vagrant sur Ansible](https://www.vagrantup.com/docs/provisioning/ansible.html).

2. Créez un Vagrantfile qui crée un VM `ubuntu/xenial64` et qui lance un playbook, par exemple : 

		---
		- hosts: all
		  # *Become* root
		  become: true
		  # Speeds up the script 
		  gather_facts: false

		  tasks:
		    # Include the Docker installation Ansible play file (empty for now)
		    # - include: install_docker.yml

		    - name: Print some dummy thing
		      shell: echo "It works!"

	`/bin/sh: 1: /usr/bin/python: not found` ? C'est normal ! (Je vous ai dit que c'était casse-pieds.) Une solution est d'obliger Ansible à utiliser Python3 en ajoutant cette ligne dans le `Vagrantfile` au bon endroit :

		ansible.extra_vars = {
          ansible_python_interpreter: "/usr/bin/python3"
        }
    	# Profitez-en pour mettre plus de "verbose" :
    	ansible.verbose = "vvv"

3. Remplissez le fichier `install_docker.yml` et importez-le dans votre play pour installer Docker sur votre VM. (La command `shell:` c'est tricher, utilisez les modules d'Ansible).

4. Avec Vagrant, créez 3 VMs (`manager`, `worker-1` et `worker-2`) sur le même sous-réseau en fixant leurs IPs. Provisionnez le manager avec `manager_playbook.yml` et les workers avec `worker_playbook.yml` en passant l'IP du manager aux workers.

5. Sans surprise, remplissez `manager_playbook.yml` et `worker_playbook.yml` pour initialiser Docker Swarm. 

6. Connectez-vous au manager en SSH, et lancez `docker node ls`. Vous devriez voir les trois VMs actives dans le swarm.

## Partie III - Déploiement de la galerie d'images

Nous souhaitons désormais déployer notre galerie dans le swarm. Pour ce faire, nous utiliserons [docker-stack](https://docs.docker.com/engine/reference/commandline/stack/). Nous ajouterons un serveur web Nginx qui s'occupera de la répartition de charge: recevra les requêtes et les routera vers une des répliques du *service* Node, qui lui-même communiquera avec le *service* Redis et servira les photos.

> Schéma de déploiement au tableau.


1. Sachant que notre app est déployée sur trois machine, comment stocker/servir les images ? Proposez une solution.

2. Créez plusieurs répliques du service Node. Configurez Nginx pour qu'il route judicieusement les requêtes alternativement sur chaque réplique Node. Quel est l'algorithme employé par nginx ?

3. Créez plusieurs répliques du service Redis, et configurer Redis pour qu'il tourne en [mode cluster](https://redis.io/topics/cluster-spec).



## Si vous avez miraculeusement de l'avance 

* Si vous n'avez pas implémenté l'ajout/suppression des photos lors du TD4, faites-le. Ces fonctionnalités sont nécessaires pour la suite.

* Lors du TD6, nous émulerons du trafic sur votre app en utilisant un "navigateur sans tête" (*headless browser*).