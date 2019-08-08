const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;


const groupSchema = new Schema({
    name: { type: String, required: [true, 'El nombre del grupo es requerido'], trim: true },
    description: { type: String, required: [true, 'La descripción del grupo es requerida'], trim: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: [true, 'La categoría del grupo es requerida'] },
    image: String,
    websiteUrl: { type: String, trim: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Group', groupSchema);