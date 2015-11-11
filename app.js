var express = require('express');
var path = require('path');
//var logger = require('morgan');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sassMiddleware = require('node-sass-middleware');

var layout = require('./routes/layout');
var index = require('./routes/index');
var compose = require('./routes/compose');
var replies = require('./routes/replies');
var protocol = require('./routes/protocol');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(sassMiddleware({
  src: path.join(__dirname, 'public/stylesheets/sass'),
  dest: path.join(__dirname, 'public/stylesheets'),
  debug: false,
  indentedSyntax: true,
  outputStyle: 'compressed',
  prefix: '/stylesheets'
}));

//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//connect mongodb
app.db = mongoose.connect('mongodb://localhost/unREDACTED');
//get all the database schemas
require('./models')(app, mongoose);

require('./crud/messageEndpoint.js').messageEndpoint(app,module);
require('./crud/replieEndpoint.js').replieEndpoint(app,module);

app.use('/', layout);
app.use('/partials/index', index);
app.use('/partials/compose', compose);
app.use('/partials/replies', replies);
app.use('/partials/protocol', protocol);

module.exports = app;
