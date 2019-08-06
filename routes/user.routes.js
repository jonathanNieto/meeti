const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const userController = require('../controllers/user.controller');

/* router */
router.get('/create-account', userController.formCreateAccount);
router.post('/create-account', [
    check('email', 'El email no es valido').isEmail(),
    /* check('confirm', 'Debes confirmar la contraseña min:1').isLength({ min: 1 }), */
    check('confirm', 'Debes confirmar la contraseña').not().isEmpty(),
    check('confirm', 'Las contraseñas son diferentes')
        .exists()
        .custom((value, { req }) => value === req.body.password)
], userController.createAccount);

module.exports = router;