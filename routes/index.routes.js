/* const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const homeController = require('../controllers/home.controller');
const userController = require('../controllers/user.controller');

module.exports = function () {
    router.get('/', homeController.home);

    router.get('/user/create-account', userController.formCreateAccount);
    router.post('/user/create-account', [
        check('email', 'El email no es valido').isEmail(),
        check('confirm', 'Debes confirmar la contraseña').not().isEmpty(),
        check('confirm', 'Las contraseñas son diferentes')
            .exists()
            .custom((value, { req }) => value === req.body.password)
    ], userController.createAccount);


    return router;
} */
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