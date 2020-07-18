var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var jwt = require('jsonwebtoken')
const connection = require('./libs/database');

var loginRouter =  require('./routes/login');
var uploadRouter = require('./routes/upload');
var musicRouter = require('./routes/music');
var mymusicRouter = require('./routes/mymusic');
var app = express();
process.env.JWTSECRET = 'IIoIIo4ka'
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const auth = (req,res,next) => {
  const token = req.cookies.user;
  if (token) {
    const decoded = jwt.verify(token, process.env.JWTSECRET);
    console.log(decoded.id);
    connection.query('select * from users where id = ?', [decoded.id], (err, result) => {
      if (err) {
        res.render('error',{message: 'ERROR'})
        return;
      }
      if (result && result[0]) {
        req.user = result[0];
        next();
      } else{
        res.redirect('/login');
      }
    })
    } else {
    res.redirect('/login')
  }
}

app.use('/' , musicRouter);
app.use('/login', loginRouter);
app.use('/upload', auth,  uploadRouter);
app.use('/music', auth, musicRouter);
app.use('/mymusic', auth, mymusicRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;