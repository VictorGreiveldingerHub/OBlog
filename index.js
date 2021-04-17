const express = require('express');
const port = 3000;

const app = express();

app.get('/', (req, res) => {
    res.send('Hello debut de projet');
});

app.listen(port, (req, res) => {
    console.log(`Server listening on port ${port}`);
});