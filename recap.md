# Recap de la saison 3 : Express et Node

### Avant toute chose, la base:

    * npm init
        * Initialise notre projet
        * Créer un package.json
    * Créer un `.gitignore`
        * pour y mettre le dossier node_modules/
        * permet de dire à git d'ignorer les dossiers / fichiers qui s'y trouvent


### Pour express

    *`npm install --save express ejs`

**Express:**

Pour créer un serveur, et réagir à des routes

**EJS:**

Moteur de views, qui permet de rendre du HTML dynamiquement.
Cela va aussi nous permettre de modulariser notre code HTML, pour faciliter sa réutilisation

### Pour utiliser Express et avoir la base d'un serveur

dans index.js OU app.js.

```javascript
    const express = require('express');
    // Pour récupérer un router (router.js)
    const router = require('./router');
    // Je crée mon serveur à l'aide d'express
    const app = express();
    // Et je défini un port
    const port = 3000;


    // Je dis à mon serveur d'utiliser EJS
    app.set('view engine', 'ejs');
    // Je lui dis où trouver les views
    app.set('views', 'views');

    // Je dis à Express où trouver nos assets
    // Les fichiers qu'on veut renvoyer en statique
    app.use(express.static('public')); // Ou assets

    // Pour utiliser un router créé dans router.js
    app.use(router);

    // Pour rendre par exemple l'objet title disponible à toute mes vues
    app.locals.title = 'GameHub';

    // Je demande au serveur d'écouter sur le port en question
    app.listen(port, () => {
        console.log('Server listening on port' + port);
    });
```

### Pour demander à notre serveur de réagir à des routes

dans router.js

```javascript
    // Require d'express pour créé le router
    const express = require('express');
    // Grâce à la méthode .Router
    const router = express.Router();

    // Pour créer notre route Racine et servir la view 'index'
    // MW
    router.get('/', (req, res, next) => {
        res.render('index', {
            title: 'Gamehub',
        }); // Pour passer un paramètre par exemple le titre de la page (==> Gamehub)
            // On le passera en deuxieme argument ... 
    });
    /* L'objet que je donne en deuxième paramètre, Express va le rendre disponible à ma view
        en le mettant dans l'objet res.locals
        res.locals est un objet dont la durée de vie est limitée à la durée de ma requête et sera 
        automatiquement rendu disponible dans ma view.
    */
   // Dans ma view je pourrai donc acceder à mes datas de deux façons :
   // * <%= title %> FACON 1
   // * <%=locals.title%> FACON 2

   // Avec EJS, si j'essaie d'accéder à title, alors qu'il ne fait pas partis des datas envoyées
   // on obtiendra une erreur qui casse le code (avec façon 1).
   // Avec la façon 2, l'objet locals existe toujours et systématiquement car il est donné à la view 
   // par Express justement pour qu'elle puisse récuperer des datas.
   // L'objet locals est donc toujours accessible par me views, au pire il ne contient pas la propriété
   // qui m'interesse (title par exemple) dans ce cas, title sera undefined, mais je ne casse pas mon 
   // code et la view fonctionnera sans générer d'erreur


    // Si jamais je suis dans le cas ou la data que je veux dois etre disponible dans TOUTES mes views 
    // pendant toute la durée de mon app, alors je peux rajouter ma data à l'objet locals fournit non 
    // par ma réponse mais directement par mon application.
    
    // Donc dans index.js, (la où existe mon objet app) je rajoute à app.locals.title ma DATA 
    // CF (index.js) ^

    // En synthèse :
    // Tout ce qui doit être accessible partout et tout le temps dans mon app ==> app.locals
    // Tout ce qui dépend d'une vue en particulier (par exemple le contenu d'un article) je vais
    // plutot utiliser la locals de ma response res.locals


    // On oublie pas d'exporter
    module.exports = router;
```

### Gérer des URLs dynamiques (paramètres d'URLs)

Exemples d'URLs dynamiques:
    * "/articles/:id"
    * "/author/:authorName"
    * "/game/:nomDuJeu"
    * "/articles/:id/comments/:commentID

Toutes ces routes contiennent un paramètre d'URL
C'est à dire un tronçon que je veux pouvoir récupérer coté serveur pour le consulter
Dans le dernier exemple, la route contient deux paramètres qui me seront nécessaires
pour savoir quoi afficher
    * id
    * commentID
Ces deux paramètres contiendront ce qui ce trouve dans l'URL à ces emplacements là.
Je pourrais donc chercher dans cet exemple les datas d'un article en particulier, et / ou les datas d'un commentaire lié a cet article
Pour accéder aux valeurs de ce parametre je peux utiliser mon objet requête (req)
Par exemple 

```javascript
    console.log(req.params.id);
    console.log(req.params.commentID);
```

### Gérer des query params

Les query params permettent d'obtenir des informations, ou des paramètres, sur une meme route par exemple :

* /search?cible=voiture
* /search?cible=ordinateur
* /search?cible=pouetpoeut
* /search?toto=tata&masoeur=1

Toutes ces URLs seront traitées par ma route '/search'

```javascript
    router.get('/search', (req, res) => {
        // Comment je peux récuperer ces différents paramètres ??
        // Ils sont tous dans ==> req.query
        // req.query === un objet qui contient autant de propriétés que de query params.
    });
```

### Gérer les requêtes avec une méthode (ou un verbe) POST (ou PUT, PATCH, GET) ...

Dans notre application express, on peut pour un même chemin faire des actions différentes en fonction de la méthode de la requête, par exmeple pour la route '/signin' je veux à la fois pouvoir renvoyer le formulaire de connection tout comme je veux pouvoir récupérer l'info de signin de l'user pour vérifier si il existe bien dans ma BDD.

```javascript
    router.get('/signin', (req, res) => {
        res.render('signin');
    });
    router.post('/signin', (req, res) => {
        // Comment récupérer ces données ?
        // Pour povoir récupérer ces données je vais povoir utiliser req.body qui est un objet
        // qui contiendra tout ce que ma page a renvoyé.
        // Exemple : {
        //     userName: 'Victor',
        //     password: 'afefrfur',
        // }
    });
```

> ATTENTION :
> req.body par défaut ne CONTIENT RIEN. On a besoin d'un middleware qui va se charger pour nous de 
> rendre ces infos disponible en tant qu'objet prêt à l'emploi, dans req.body.

```javascript
// Ce middleware sera utilisé sur toutes les routes et en cas de data dans le body d'une requête POST 
// (initialement c'est une string qui arrive par morceaux) il récupera toutes les infos, lira la 
// string (parser) pour en faire un objet et rendra cet objet dispo dans res.body
    app.use(express.urlencoded( { extended: true, }))
```