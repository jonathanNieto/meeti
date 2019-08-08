const User = require('../models/User');
const passport = require('passport');

module.exports = {
    formLogin:  (req, res) => {
        res.render('login', { pagename: 'Iniciar sesión' });
    },
    
    login: passport.authenticate('local', {
        successRedirect: '/user/admin',
        failureRedirect: '/login',
        failureFlash: true,
        badRequestMessage: 'Ambos campos son requeridos'
    }),
    
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
    
}