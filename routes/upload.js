const express = require('express');
const router = express.Router();
const connection = require('../libs/database');
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/music')
    },
    filename: function (req, file, cb) {
        console.log('file - ',file);
        cb(null, file.originalname);
    }
});
var uploadFile = multer({ storage: storage });

router.get('/', function(req, res, next) {
    console.log(req.query);
    res.render('upload', {title: 'Крутой музон - загрузка'});
});
router.post('/', uploadFile.single('file') ,(req, res) => {
    const genre = req.body.genre;
    const filename = req.body.filename;
    const query = 'insert into music (genre, name, url, user_id) values(?,?,?,?)';
    connection.query(query, [genre, filename, req.file.filename, req.user.id], (err, result) => {
        console.log('Результат инсерта',err,result);
        res.end();
    });
});
module.exports = router;

