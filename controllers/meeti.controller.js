const Group = require('../models/Group');
const Meeti = require('../models/Meeti');
const moment = require('moment');


module.exports = {
    create_meeti_get: async (req, res) => {
        const groups = await Group.find({}).sort('name');
        res.render('new_meeti', {
            pagename: 'Crea un nuevo meeti',
            groups
        });
    },

    create_meeti_post: async (req, res, next) => {
        try {
            const body = req.body;
            const meeti = new Meeti(body);
            const date = new Date(`${body.date} ${body.hora}`);
            const location = {
                type: 'Point',
                coordinates: [parseFloat(body.lng), parseFloat(body.lat)]
            };

            meeti.date = date;
            meeti.location = location;
            meeti.user = req.user._id;

            await meeti.save();
            req.flash('exito', 'Se ha creado el Meeti Correctamente');
            res.redirect('/user/admin');
        } catch (error) {
            console.log({ error })
            req.flash('error', error);
            res.redirect('/user/new-meeti');
        }
    },

    edit_meeti_get: async (req, res, next) => {
        try {
            const _id = req.params.id;

            /* cuando tenemos multiples consultas y son independientes entre ellas, lo mejos es usar un Promise.all() */
            const queries = [];
            queries.push(Group.find({ user: req.user._id }));
            queries.push(Meeti.findOne({ _id, user: req.user._id }));

            /* array destructuring; promise all con await */
            const [groups, meeti] = await Promise.all(queries);

            if (!groups || !meeti) {
                req.flash('error', 'Operación no permitida');
                res.redirect('/user/admin');
                return next();
            }

            res.render('edit_meeti', {
                pagename: `Editar Meeti: ${meeti.name}`,
                groups,
                meeti,
                moment
            })
        } catch (error) {
            console.log({ error })
        }
    },

    edit_meeti_post: async (req, res, next) => {
        try {
            const _id = req.params.id;
            const body = req.body;
            const meeti = await Meeti.findOne({ _id, user: req.user._id });
            const date = new Date(`${body.date} ${body.hora}`);
            const location = {
                type: 'Point',
                coordinates: [parseFloat(body.lng), parseFloat(body.lat)]
            };

            if (!meeti) {
                req.flash('error', 'Operación no permitida');
                res.redirect('/user/admin');
                return next();
            }

            meeti.group = body.group;
            meeti.name = body.name;
            meeti.guest = body.guest;
            meeti.date = date;
            meeti.quota = body.quota;
            meeti.description = body.description;
            meeti.address = body.address;
            meeti.city = body.city;
            meeti.state = body.state;
            meeti.country = body.country;
            meeti.location = location;

            await meeti.save();
            req.flash('exito', 'Meeti actualizado correctamente');
            res.redirect('/user/admin');

        } catch (error) {
            console.log({ error })
            req.flash('error', error);
            res.redirect('/user/edit-meeti');
        }
    },

    delete_meeti_delete: async (req, res, next) => {
        try {
            const _id = req.params.id;
            const meeti = await Meeti.findOneAndDelete({ _id, user: req.user._id });

            if (!meeti) {
                res.status(403).send('No se pudó realizar la tarea solicitada!');
                return next();
            }

            res.status(200).send(`El meeti "${meeti.name}" ha sido eliminado correctamente`);
        } catch (error) {
            console.log({ error })
        }
    },
}