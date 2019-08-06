const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const routes = require('./routes/index.routes');
require('dotenv').config({ path: 'variables.env' });

/* Initializations */
require('./config/config');
require('./config/database');
const app = express();

/* settings */
app.set('port', process.env.PORT);

// Body parser, leer formularios
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* habilitar EJS como template engine */
app.use(expressLayouts);
app.set('view engine', 'ejs');

/* ubicacion vistas */
app.set('views', path.join(__dirname, './views'));

/* archivos estaticos */
app.use(express.static('public'));

/* habilitar cookie parser */
app.use(cookieParser());

/* crear la sesion */
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: true,
    saveUninitialized: true,
}));

/* agrega flash messages */
app.use(flash());

/* middlewares */
app.use((req, res, next) => {
    /* res.locals.mensajes = req.flash(); */
    res.locals.messages = require('express-messages')(req, res);
    const date = new Date();
    res.locals.year = date.getFullYear();
    next();
});

/* routing */
app.use('/', routes);


app.listen(app.get('port'), () => {
    console.log('Server on port:', app.get('port'));
});