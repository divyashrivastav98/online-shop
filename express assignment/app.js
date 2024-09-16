const express = require('express');

const app = express();

app.use('/users', (req, res, next) => {
    res.send("you are on users page");
});

app.use('/', (req, res, next) => {
    res.send("you are on homepage");
});

app.listen(3000);