/*
 * Shopify Embedded App. skeleton.
 *
 * Copyright 2014 Richard Bremner
 * richard@codezuki.com
 */

var bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    cookieSession = require('cookie-session'),
    express = require('express'),
    routes = require('./routes'),
    shopifyAuth = require('./routes/shopify_auth'),
    path = require('path'),
    nconf = require('nconf'),
    morgan = require('morgan');

//load settings from environment config
nconf.argv().env().file({
    file: (process.env.NODE_ENV || 'dev') + '-settings.json'
});
exports.nconf = nconf;

//configure express
var app = express();

//log all requests
app.use(morgan('combined'));

//support json and url encoded requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//setup encrypted session cookies
app.use(cookieParser());
app.use(cookieSession({
    secret: "--express-session-encryption-key--"
}));

//statically serve from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

//use jade templating engine for view rendering
app.set('view engine', 'jade');

//use the environment's port if specified
app.set('port', process.env.PORT || 3000);

var appAuth = new shopifyAuth.AppAuth();

//configure routes
app.get('/', routes.index);
app.get('/auth_app', appAuth.initAuth);
app.get('/escape_iframe', appAuth.escapeIframe);
app.get('/auth_code', appAuth.getCode);
app.get('/auth_token', appAuth.getAccessToken);
app.get('/render_app', routes.renderApp);

app.listen(app.get('port'), function() {
    console.log('Listening on port ' + app.get('port'));
});