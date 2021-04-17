const express = require('express');
const port = 3000;
const app = express();
const router = require('./modules/router');
const articles = require('./data/article.json');

// Récupération des articles depuis la data.json
app.locals.articles = articles;


app.use(express.static('public'));
app.use(router);

app.set('view engine', 'ejs');
app.set('views', 'views');


app.listen(port, (req, res) => {
    console.log(`Server listening on port ${port}`);
});