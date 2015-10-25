var express = require('express'),
  path = require('path'),
  env = process.env.NODE_ENV || 'development',
  config = require('./server/config').getEnvironment(env),
  // favicon = require('serve-favicon'),
  logger = require('morgan'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  session = require('express-session'),
  MongoStore = require('connect-mongo')(session),
  Mongoose = require('./server/config/database'),
  routes = require('./server/routes'),
  app = express(),
  vantage = require('vantage')(),
  request = require('superagent'),
  colors = require('colors');

// view engine setup
app.set('views', path.join(__dirname, 'server/views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// uncomment if you want to debug/log
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
// not using express less
// app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, './public')));
app.use(session({
  secret: config.expressSessionKey,
  proxy: true,
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({
    mongooseConnection: Mongoose.connection
  })
}));

// CORS Support in my Node.js web app written with Express
// http://stackoverflow.com/questions/7067966/how-to-allow-cors-in-express-nodejs
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD');
  next();
});

// handle OPTIONS requests from the browser
app.options("*", function(req, res, next) {
  res.send(200);
});

var apiRouter = express.Router();
app.use('/api', routes(apiRouter, config));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (env === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
    next();
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

var server = app.listen(process.env.PORT || 3000, function() {
  // console.log('Express server listening on %d, in %s mode \n', 3000, app.get('env'));
  var initVantage = require('./cli');
  initVantage(app, vantage, colors, request);
});

module.exports = app;
