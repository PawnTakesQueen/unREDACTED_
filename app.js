var bodyParser = require('body-parser'),
    multipart = require('connect-multiparty'),
    express = require('express'),
    mongoose = require('mongoose'),
    sassMiddleware = require('node-sass-middleware'),
    path = require('path');

var index = require('./routes/index'),
    compose = require('./routes/compose'),
    submit = require('./routes/submit'),
    replies = require('./routes/replies'),
    protocol = require('./routes/protocol');

var app = express();
    multipartMiddleware = multipart();

//connect mongodb
app.db = mongoose.connect('mongodb://localhost/unREDACTED');

//get all the database schemas
require('./models')(app, mongoose);

require('./crud/messageEndpoint.js').messageEndpoint(app, module);
require('./crud/replieEndpoint.js').replieEndpoint(app, module);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(sassMiddleware({
  src: path.join(__dirname, 'public/stylesheets/sass'),
  dest: path.join(__dirname, 'public/stylesheets'),
  debug: false,
  indentedSyntax: true,
  outputStyle: 'compressed',
  prefix: '/stylesheets'
}));

app.use(multipartMiddleware);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/compose', compose);
app.use('/submit', submit);
app.use('/replies', replies);
app.use('/protocol', protocol);

module.exports = app;
