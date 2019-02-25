var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var methodOverride = require('method-override');
var redis = require("redis");
var album1;
var album2;


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images',express.static('/images'));

// methodOverride
app.use(methodOverride('_method'));

app.use('/', indexRouter);
app.use('/users', usersRouter);

var client = redis.createClient("http://redis");

client.on('connect', function(){
  console.log("connected to redis..");
});

client.hmset('album_mer', ['Titre','Isle Album','Description','The most beautiful islands on earth','photo1','/images/île/île1.jpg' ,'photo2','/images/île/île2.jpg','photo3', '/images/île/île3.jpg','photo4','/images/île/île4.jpg'], function(err, reply){});
client.hmset('album_montagne', ['Titre','Moutain Album','Description','The most beautiful mountains on earth','photo1','/images/montagne/montagne1.jpg' ,'photo2','/images/montagne/montagne2.jpg','photo3', '/images/montagne/montagne3.jpg','photo4','/images/montagne/montagne4.jpg'], function(err, reply){});
  /*add('album1','Isle Album');
  add('album2','Mountain Album');

 function add(key, value){
   client.set(key,value, function(err, reply){
     console.log(reply);
   });
 }

  client.get('album1', function(err, res){
    if(err){
      console.log(err);
    } else{
      album1 = res;
      console.log('get result album1 : '+ res);
      };
   });

   client.get('album2', function(err, res){
     if(err){
       console.log(err);
     } else{
       album2 = res;
       console.log('get result album2 : '+ res);
       };
    });

       app.get('/', function(req, res, next){
         res.render('index', {album1:album1, album2:album2});
       });
    */

    // Search Page
    app.get('/', function(req, res, next){
      res.render('index');
    });

    //Search processing
    app.post('/album/search', function(req, res, next){
      console.log(req.body);
      var id = req.body.id;
      client.hgetall(id, function(err, obj){
        if(!obj){
          res.render('index', {
            error: 'Album does not exist'
          });
        } else {
          obj.id = id;
          res.render('album', {
            album: obj
          });
        }
      });
    });

    // Add Album Page
    app.get('/album/add', function(req, res, next){
      res.render('addalbum');
    });

    // Process Add Album Page
    app.post('/album/add', function(req, res, next){
      let id = req.body.id;
      let Titre = req.body.Titre;
      let Description = req.body.Description;
      let photo1 = req.body.photo1;
      let photo2 = req.body.photo2;
      let photo3 = req.body.photo3;
      let photo4 = req.body.photo4;

      client.hmset(id, [
        'Titre', Titre,
        'Description', Description,
        'photo1', photo1,
        'photo2', photo2,
        'photo3', photo3,
        'photo4', photo4
      ], function(err, reply){
        if(err){
          console.log(err);
        }
        console.log(reply);
        res.redirect('/');
      });
    });

    // Delete Album
    app.delete('/album/delete/:id', function(req, res, next){
      console.log("ok");
      client.del(req.params.id);
      res.redirect('/');
    });

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
