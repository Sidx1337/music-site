const express = require('express');
const router = express.Router();
const connection = require('../libs/database');
var jwt = require('jsonwebtoken');

router.get('/', function(req, res, next) {
    const iduser = req.user.id;
    const sql = ' SELECT usermusic.music_id, music.url, music.name FROM usermusic INNER JOIN music ON usermusic.music_id = music.id where usermusic.user_id = ?;';
    connection.query(sql, [iduser], (err, result) => {
        console.log(err);
        res.render('mymusic', {title: 'Моя музыка', playlist: result});
    });
});
router.post('/', (req, res, next) => {
   const iduser = req.user.id;
   const idmusic = req.body.music;
   console.log('iduser = ', iduser,'idmusic = ' , idmusic);
    const sql = 'insert into usermusic (user_id, music_id) values (?,?)';
    connection.query(sql, [iduser, idmusic], (err, result) => {
        console.log('res = ', result, 'err = ', err);
        res.redirect('/music');
    });
});
router.post('/delete', (req, res, next) => {
    const iduser = req.user.id;
    const idmusic = req.body.music;
    console.log('iduser = ', iduser,'idmusic = ' , idmusic);
    let sql = 'delete from usermusic where user_id = ? AND music_id = ?';
    connection.query(sql, [iduser, idmusic], (err) => {
        console.log( 'err = ', err);
        sql = ' SELECT usermusic.music_id, music.url, music.name FROM usermusic INNER JOIN music ON usermusic.music_id = music.id where usermusic.user_id = ?;';
        connection.query(sql, [iduser], (err, result) => {
            res.render('mymusic', {title: 'Моя музыка', playlist: result});
        });
    });
});
module.exports = router;

