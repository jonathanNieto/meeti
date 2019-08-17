const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    message: { type: String, required: [true, 'El comentario es requerido'], trim: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    meeti: { type: Schema.Types.ObjectId, ref: 'Meeti', required: true },
});

module.exports = mongoose.model('Comment', commentSchema);