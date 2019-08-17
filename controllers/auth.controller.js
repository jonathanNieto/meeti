const { validationResult } = require('express-validator');
const User = require('../models/User');
const passport = require('passport');
const multer = require('multer');
const shortid = require('shortid');
const path = require('path');
const fs = require('fs');

const upload = multer({
    limits: { fileSize: 100000 },
    storage: fileStorage = multer.diskStorage({
        destination: (req, res, next) => {
            next(null, __dirname + '/../public/uploads/profiles/')
        },
        filename: (req, file, next) => {
            try {
                const extension = path.extname(file.originalname);
                /* o esta opción también es valida: const extension = file.mimetype.split('/')[1]; */
                next(null, `${shortid.generate()}${extension}`);
            } catch (error) {
                console.log({ error })
            }
        },
    }),
    fileFilter(req, file, next) {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            /* el formato es valido */
            next(null, true);
        } else {
            next(new Error('Formato de imagen no válido'), false);
        }
    }
}).single('image');

module.exports = {
    formLogin: (req, res) => {
        res.render('login', { pagename: 'Iniciar sesión' });
    },

    login: passport.authenticate('local', {
        successRedirect: '/user/admin',
        failureRedirect: '/login',
        failureFlash: true,
        badRequestMessage: 'Ambos campos son requeridos'
    }),

    logout: (req, res, next) => {
        req.logout();
        req.flash('correcto', 'Cerraste sesión correctamente!!');
        res.redirect('/login');
        next();
    },

    accountConfirmation: async (req, res, next) => {
        /* verify user */
        const user = await User.findOne({ email: req.params.email });

        if (!user) {
            req.flash('error', 'No existe la cuenta, puedes registrarte si lo deseas para obtener una.');
            res.redirect('/user/create-account');
            return next();
        } else {
            user.enabled = true;
            await user.save();
            req.flash('exito', 'La cuenta se ha confirmado, puedes iniciar sesión');
            res.redirect('/login');
        }
    },

    isAuthenticated: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/login');
    },

    edit_profile_get: async (req, res, next) => {
        try {
            const _id = req.user._id;
            const user = await User.findOne({ _id });

            res.render('edit_profile', {
                pagename: `Editar perfil: ${user.name}`,
                user
            });

        } catch (error) {

        }
    },

    edit_profile_post: async (req, res, next) => {
        try {
            const _id = req.user._id;
            const body = req.body;

            const user = await User.findOne({ _id });

            if (!user) {
                req.flash('error', 'No existe la cuenta, puedes registrarte si lo deseas para obtener una.');
                res.redirect('/user/create-account');
                return next();
            }

            user.name = body.name;
            user.description = body.description;
            user.email = body.email;

            await user.save();
            req.flash('exito', 'La cuenta se ha actualizado correctamente');
            res.redirect('/user/admin');

        } catch (error) {

        }
    },

    change_password_get: async (req, res) => {
        res.render('change_password', {
            pagename: 'Cambiar la contraseña'
        })
    },

    change_password_post: async (req, res, next) => {
        try {
            const _id = req.user._id;
            const body = req.body;

            const user = await User.findOne({ _id });

            if (!user) {
                req.flash('error', 'No existe la cuenta, puedes registrarte si lo deseas para obtener una.');
                res.redirect('/user/create-account');
                return next();
            }

            /* verificar que el password actual sea correcto */
            if (!user.comparePassword(body.password)) {
                req.flash('error', 'Contraseña incorrecta');
                res.redirect('/user/admin');
                return next();
            }

            const expressErrors = validationResult(req);
            if (!expressErrors.isEmpty()) {
                expressErrors.errors.map(err => req.flash('error', err.msg));
                return res.redirect('/change-password');
            }

            user.password = await user.encryptPassword(body.passwordnew);
            await user.save();
            req.logout();
            req.flash('exito', 'La contraseña se ha actualizado correctamente, vuelve a iniciar sesión');
            res.redirect('/login');

        } catch (error) {
            console.log({ error });
        }
    },

    edit_image_profile_get: async (req, res, next) => {
        try {
            const _id = req.user._id;
            const user = await User.findOne({ _id });

            res.render('image_profile', {
                pagename: 'Subir imagen de perfil',
                user
            })
        } catch (error) {
            console.log({ error })
        }
    },
    
    edit_image_profile_post: async (req, res, next) => {
        try {
            const _id = req.user._id;
            const user = await User.findOne({ _id });

            if (!user) {
                req.flash('error', 'No se pudó realizar la tarea solicitada');
                res.redirect('/user/admin');
                return next();
            }

            /* verificar que el archivo es valido */
            if (req.file && user.image) {
                const oldImagePath = __dirname + `/../public/uploads/profiles/${user.image}`;
                fs.unlink(oldImagePath, (error) => {
                    if (error) {
                        console.log({ error })
                    }
                    return;
                });
            }
            if (req.file) {
                user.image = req.file.filename;
            }
            user.save();
            req.flash('exito', 'Imagen actualizada correctamente.');
            return res.redirect('/user/admin');
        } catch (error) {
            console.log({ error })
        }
    },

    upload_image_profile_post: (req, res, next) => {
        upload(req, res, function (error) {
            if (error) {
                // TODO: manejar errorres
                if (error instanceof multer.MulterError) {
                    if (error.code = 'LIMIT_FILE_SIZE') {
                        req.flash('error', 'El archivo es muy grande. Por favor elija una imagen de máximo 100 kb')
                    } else {
                        req.flash('error', error.message);
                    }
                } else if (error.hasOwnProperty('message')) {
                    req.flash('error', error.message);
                }
                return res.redirect('back');
            } else {
                next();
            }
        });
    },
}