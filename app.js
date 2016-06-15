var bodyParser = require('body-parser'),
    express = require('express'),
    mongoose = require('mongoose'),
    multipart = require('connect-multiparty'),
    path = require('path'),
    sassMiddleware = require('node-sass-middleware');

// Page route information
var index = require('./routes/index'),
    compose = require('./routes/compose'),
    submit = require('./routes/submit'),
    replies = require('./routes/replies'),
    protocol = require('./routes/protocol');

// Start express app and be able to handle multipart/form-data from forms
var app = express();
    multipartMiddleware = multipart();

// Handle multipart/form-data, body form data (in utf-8) and Express
app.use(multipartMiddleware);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

// Connect to mongodb
app.db = mongoose.connect('mongodb://localhost/unREDACTED');

// Get all the database schemas
require('./models')(app, mongoose);

// Database handlers
require('./crud/messageEndpoint.js').messageEndpoint(app, module);
require('./crud/replieEndpoint.js').replieEndpoint(app, module);

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Compile sass to css
app.use(sassMiddleware({
  src: path.join(__dirname, 'public/stylesheets/sass'),
  dest: path.join(__dirname, 'public/stylesheets'),
  debug: false,
  indentedSyntax: true,
  outputStyle: 'compressed',
  prefix: '/stylesheets'
}));

// Handle page requests with routes
app.use('/', index);
app.use('/compose', compose);
app.use('/submit', submit);
app.use('/replies', replies);
app.use('/protocol', protocol);

module.exports = app;
