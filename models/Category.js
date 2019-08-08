const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;


const categorySchema = new Schema({
    name: { type: String, required: [true, 'Nombre es requerido'], trim: true },
});

module.exports = mongoose.model('Category', categorySchema);