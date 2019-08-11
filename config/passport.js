const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
},
    async (email, password, next) => {
        /* este código se ejecuta al llenar el formulario */
        const user = await User.findOne({ email: email, enabled: true });

        if (!user) {
            return next(null, false, {
                message: 'Credenciales incorrect@s'
            });
        }
        /* verificar password */
        const verifyPass = user.comparePassword(password);
        if (!verifyPass) {
            return next(null, false, {
                message: 'Credenciales incorrectas'
            });
        }
        /* todo ok */
        return next(null, user);
    }
));

passport.serializeUser(function (user, cb) {
    cb(null, user);
});

passport.deserializeUser(function (user, cb) {
    cb(null, user);
});

module.exports = passport;