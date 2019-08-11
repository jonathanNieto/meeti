const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const slug = require('slug');
const shortid = require('shortid');



const meetiSchema = new Schema({
    name: { type: String, required: [true, 'Nombre es requerido'], trim: true },
    guest: { type: String, trim: true },
    description: { type: String, required: [true, 'La descripción es requerida'], trim: true },
    quota: { type: Number, default: 0 },
    date: { type: Date, default: Date.now, required: [true, 'La fecha es requerida'] },
    address: { type: String, required: [true, 'La dirección es requerida'], trim: true },
    city: { type: String, required: [true, 'La ciudad es requerida'], trim: true },
    state: { type: String, required: [true, 'El estado es requerido'], trim: true },
    country: { type: String, required: [true, 'El país es requerido'], trim: true },
    location: {
        type: { type: String, default: 'Point', trim: true },
        coordinates: { type: [Number], required: true }
    },
    attendees: { type: [Schema.Types.ObjectId], ref: 'User' },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    group: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
    slug: String
});

/* general una url */ /* el callback no funciona con un arrow function, esto es porque se pierde el scope de this */
meetiSchema.pre('save', async function (next) {
    const url = slug(this.name).toLowerCase();
    this.slug = `${url}-${shortid.generate()}`;
    next();
});

module.exports = mongoose.model('Meeti', meetiSchema);