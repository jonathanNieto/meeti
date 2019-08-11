const express = require('express');
const router = express.Router();
const { check, sanitizeBody } = require('express-validator');

const authController = require('../controllers/auth.controller');

/* router */
router.get('/login', authController.formLogin);
router.post('/login', authController.login);

/* logout */
router.get('/logout', authController.logout);

router.get('/account-confirmation/:email', authController.accountConfirmation);

/* edit profile */
router.get('/edit-profile', authController.edit_profile_get);
router.post('/edit-profile', authController.edit_profile_post);

/* update password */
router.get('/change-password', authController.isAuthenticated, authController.change_password_get);
router.post('/change-password', [
    check('passwordnew', 'La contraseña nueva no puede ser igual a la actual')
        .exists()
        .custom((value, { req }) => {
            console.log({value})
            console.log(req.body.password)
            return value !== req.body.password;
        }),
    check('passwordnew', 'Debes escribir una nueva contraseña').not().isEmpty(),
    check('confirm', 'Debes confirmar la nueva contraseña').not().isEmpty(),
    check('confirm', 'La contraseña nueva y su confirmación son diferentes')
        .exists()
        .custom((value, { req }) => value === req.body.passwordnew)
],
    authController.isAuthenticated,
    authController.change_password_post
);

/* profile */
router.get('/image-profile', authController.isAuthenticated, authController.edit_image_profile_get);
router.post('/image-profile',
    authController.isAuthenticated,
    authController.upload_image_profile_post,
    authController.edit_image_profile_post
);

module.exports = router;