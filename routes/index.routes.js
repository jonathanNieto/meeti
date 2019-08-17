const express = require('express');

const homeRoutes = require('./home.routes');
const userRoutes = require('./user.routes');
const authRoutes = require('./auth.routes');

/* Initializations */
const appRoutes = express();

/* routes */
appRoutes.use('/', homeRoutes);
appRoutes.use('/user', userRoutes);
appRoutes.use('/', authRoutes);

module.exports = appRoutes;