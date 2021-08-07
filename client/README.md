# TX_CHAT - Client

## Lancer le projet

Avant toute chose, il faut s'assurer d'avoir installer node.js et npm : [Lien pour télécharger node.js et npm](https://nodejs.org/fr/download/)

Pour lancer le projet il suffit d'installer yarn avec npm : ``npm install yarn -g``.

Ensuite il faut **se déplacer dans le dossier client** du projet et lancer la commande : ``yarn`` pour installer les dépendances.

Une fois cela effectué, il suffit de lancer la commande : ``yarn start``.

## Version de production

Pour obtenir la version de production, il suffit de lancer la commande : ``yarn run build`` dans le dossier client. Un dossier build va se créer avec la version de production de notre application.

***Avant de build la version de production, s'assurer que l'adresse du serveur de l'API est bien renseignée dans le fichier ``.env`` et décommenter l'import du script app.js dans le fichier index.html.***

## Créer une image docker

Pour déployer l'application sous forme de conteneur docker, un ``Dockerfile.prod`` a été créé afin de créer une image docker.

Pour cela, s'assurer d'avoir [installé docker](https://docs.docker.com/get-docker/).

Lancer la commande : ``docker build -t nomDeMonImage:tagDeMonImage ./Dockerfile.prod`` dans le dossier client. Cette commande permet de créer une image Docker.

Pour lancer le conteneur il suffit de lancer la commande : ``docker run -d -p numeroDePortSouhaitee:5000 nomDeMonImage:tagDeMonImage``

***Avant de build la version de production, s'assurer que l'adresse du serveur de l'API est bien renseignée dans le fichier ``.env`` et décommenter l'import du script app.js dans le fichier index.html.***

## Crédits

Icône conçue par [Freepik](https://www.freepik.com) from [www.flaticon.com](https://www.flaticon.com/fr/)

Images conçues par pch.vector sur [Freepik](https://www.freepik.com)

Icon file download : [Crédits](https://icon-library.com/icon/icon-file-downloads-11.html)