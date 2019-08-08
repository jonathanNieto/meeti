const express = require('express');
const router = express.Router();
const { check, sanitizeBody } = require('express-validator');


const userController = require('../controllers/user.controller');
const authController = require('../controllers/auth.controller');
const groupController = require('../controllers/group.controller');

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

/* panel admin */
router.get('/admin', authController.isAuthenticated, userController.userAdmin);

/* new groups */
router.get('/new-group', authController.isAuthenticated, groupController.create_group_get);
router.post('/new-group',
    [
        sanitizeBody('name'),
        sanitizeBody('websiteUrl')
    ],
    authController.isAuthenticated,
    groupController.upload_image_group_post,
    groupController.create_group_post
);

/* edit groups */
router.get('/edit-group/:id', authController.isAuthenticated, groupController.edit_group_get);
router.post('/edit-group/:id', authController.isAuthenticated, groupController.edit_group_post);

/* edit image group */
router.get('/image-group/:id', authController.isAuthenticated, groupController.edit_image_group_get);
router.post('/image-group/:id',
    authController.isAuthenticated,
    groupController.upload_image_group_post,
    groupController.edit_group_image_post
);

/* delete group */
router.delete('/delete-group/:id', authController.isAuthenticated, groupController.delete_group_delete);

module.exports = router;