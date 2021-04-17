const express = require('express');
const router = express.Router();
const articles = require('../data/article.json');

// concaString recupere la string contenu dans article.img
// et va supprimer le / a l'index 0 de cette string
// pour pouvoir ecrire dans les fichiers ejs <%=article.img%>
// const concaString = () => {
//     let string;
//     for (let article of articles) {
//         string = article.img.substr(1);
//         console.log(string);  
//     };
// };


router.get('/', (req, res) => {
    res.render('index');
});

module.exports = router;