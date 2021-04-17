const express = require('express');
const router = express.Router();
const article = require('../data/article.json');

console.log(article);
router.get('/', (req, res) => {
    res.render('index');
});

module.exports = router;