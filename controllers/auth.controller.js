const User = require('../models/User');

module.exports = {
    formLogin:  (req, res) => {
        res.render('login', { pagename: 'Iniciar sesión' });
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
    }
    
}