const express = require('express');
const router = express.Router();
const connection = require('../libs/database');

router.get('/', function(req, res, next) {
    const sql = 'select * from music';
    connection.query(sql, [], (err, result) => {
        console.log(err);
        res.render('music', {title: 'Музыка', playlist: result});
    });
});
module.exports = router;

