const { validationResult } = require('express-validator');
const handlerEmail = require('../handler/emails');
const User = require('../models/User');
const Group = require('../models/Group');

module.exports = {
    formCreateAccount: (req, res) => {
        res.render('create_account', { pagename: 'Crea tu cuenta' });
    },

    /* method POST */
    createAccount: async (req, res) => {
        const body = req.body;
        const user = User(body);

        const expressErrors = validationResult(req);
        if (!expressErrors.isEmpty()) {
            expressErrors.errors.map(err => req.flash('error', err.msg));
        }
        try {
            await user.save();

            const url = `http://${req.headers.host}/account-confirmation/${user.email}`;

            /* enviar email de confirmación */
            await handlerEmail.enviarEmail({
                user,
                url,
                subject: "Confirma tu cuenta de email", // Subject line
                file: "account_confirmation", // plain text body
            }).catch(console.error);

            req.flash('exito', `Hemos senviado un email   "${user.email}",   verifica tu cuenta`);
            res.redirect('/login');
        } catch (error) {
            if (error.errors) {
                Object.values(error.errors).map(err => {
                    req.flash('error', err.message);
                    return err.message;
                });
            } else {
                req.flash('error', error);
            }

            res.redirect('/user/create-account');
        }
    },

    userAdmin: async (req, res) => {
        const groups = await Group.find();
        res.render('user_admin', {
            pagename: 'Administra tu cuenta',
            groups
        });
    },
}