const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');


const userSchema = new Schema({
    email: { type: String, required: [true, 'Email es requerido'], unique: true, lowercase: true, trim: true },
    name: { type: String, required: [true, 'Nombre es requerido'], trim: true },
    password: { type: String, required: [true, 'Contraseña es requerida'], trim: true },
    description: { type: String, default: "Descripcion", trim: true },
    token: String,
    expirationDate: Date,
    image: String,
    enabled: { type: Boolean, default: false }
});

/* cifrar password */ /* el callback no funciona con un arrow function, esto es porque se pierde el scope de this */
userSchema.pre('save', async function (next) {
    /* si el password ya está cifrado */
    if (!this.isModified('password')) {
        return next(); /* deten la ejecución */
    }
    /* sino está cifrado */
    const pass = await bcrypt.hash(this.password, 10);
    this.password = pass;
    next();
});

/* envia alerta cuando un usuario ya está registrado */
userSchema.post('save', async function (err, doc, next) {
    if (err.name === 'MongoError' && err.code === 11000) {
        next('El correo indicado ya está registrado');
    } else {
        next(err);
    }
});

/* autenticar usuarios */
userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compareSync(password, this.password);
}

userSchema.methods.encryptPassword = async function (password) {
    return await bcrypt.hash(password, 10);
}


module.exports = mongoose.model('User', userSchema);