const express = require('express');
const router = express.Router();
const connection = require('../libs/database');
var jwt = require('jsonwebtoken')
router.get('/', function(req, res, next) {
    console.log(req.query);
    res.render('login', {title: 'Логин'});
});
router.post('/', (req, res, next) => {
    const login = req.body.login;
    const password = req.body.password;
    const query = 'select * from users where login = ?';
    connection.query(query, [login], (err, result) => {
        console.log(err, result);
        if (err) {
         res.status(400).send('ERROR!!!');
         return;
        } else if (result.length == 0) {
            const query = 'insert into users (login, password) values(?,?)';
            connection.query(query, [login,password], (err, result) => {
                console.log('Результат инсерта',err,result);
            });
        } else {
            if (result[0].password == password) {
                const token = jwt.sign({ id: result[0].id}, process.env.JWTSECRET);
                res.cookie('user', token);
                res.redirect('/music');
            } else {
               res.redirect('/login');
               res.send('Неверный логин или пароль');
            }
        }
    });
});
module.exports = router;

