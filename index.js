// load the applications environment
require('dotenv').load();

var express = require('express'),
  app = express(),
  path = require('path'),
  config = require('./server/config')(process.env.NODE_ENV),
  // favicon = require('serve-favicon'),
  morgan = require('morgan'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  session = require('express-session'),
  MongoStore = require('connect-mongo')(session),
  models = require('./server/models'),
  routes = require('./server/routes');

app.set('superSecret', config.webTokenSecret);
app.set('models', models);

// view engine setup
app.set('views', path.join(__dirname, 'server/views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// uncomment if you want to debug/log
// app.use(morgan('combined', {
//   skip: function(req, res) {
//     return res.statusCode < 400;
//   }
// }));
// app.use(morgan('dev'));
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
  maxAge: new Date(Date.now() + 3600000),
  proxy: true,
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({
    mongooseConnection: models.mongoose.connection
  })
}));

// CORS Support in my Node.js web app written with Express
// http://stackoverflow.com/questions/7067966/how-to-allow-cors-in-express-nodejs
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-Access-Token");
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD');
//   next();
// });

// handle OPTIONS requests from the browser
app.options("*", function(req, res) {
  res.send(200).json({
    message: 'Hello client!'
  });
});

// get an instance of the router for api routes
var api = express.Router();
app.use('/api', routes(api));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  // get the error stack
  var stack = err.stack.split(/\n/).map(function(err, index) {
    return err.replace(/\s{2,}/g, ' ').trim();
  });
  res.json({
    api: err,
    url: req.originalUrl,
    error: err.message,
    stack: stack
  });
});

var server = app.listen(process.env.PORT || 3000, function() {
  console.log('Express server listening on %d, in %s' +
    ' mode', server.address().port, app.get('env'));
});

//expose app
exports = module.exports = app;
