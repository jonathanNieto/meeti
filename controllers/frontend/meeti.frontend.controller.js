const Meeti = require('../../models/Meeti');
const Group = require('../../models/Group');
const User = require('../../models/User');
const Category = require('../../models/Category');
const Comment = require('../../models/Comment');
const moment = require('moment');


module.exports = {
    show_meeti_get: async (req, res, next) => {
        try {
            const slug = req.params.slug;
            const meeti = await Meeti.findOne({ slug })
                .populate('group')
                .populate('user', 'name image');

            if (!meeti) {
                res.redirect('/');
            }
            // consultar sobre meetis cercanos
            const lng = meeti.location.coordinates[0];
            const lat = meeti.location.coordinates[1];
            console.log({ lat });
            console.log({ lng });
            /* Meeti.collection.createIndex({ 'location.coordinates': '2d' }); */
            const nearMeetis = await Meeti.find({
                location: {
                    $near: {
                        $geometry: {
                            type: "Point",
                            coordinates: [lng, lat]
                        },
                        $maxDistance: 1000,
                        $minDistance: 100
                    }
                }
            })
                .populate('group')
                .populate('user', 'name image');;

            console.log({ nearMeetis });
            console.log(nearMeetis.length);
            /* consultar despues de verificar que existe el meeti */
            const comments = await Comment.find({ meeti: meeti._id })
                .populate('user', 'name image');

            res.render('show_meeti', {
                pagename: meeti.name,
                meeti,
                nearMeetis,
                comments,
                moment
            });
        } catch (error) {
            console.log({ error })
        }
    },

    confirm_assistance_meeti_post: async (req, res, next) => {
        try {
            const slug = req.params.slug;
            const meeti = await Meeti.findOne({ slug });
            const { data } = req.body;

            if (!meeti) {
                req.flash('error', 'No existe el meeti solicitado');
                res.redirect('/');
                return next();
            }

            if (data === 'confirmar') {
                meeti.attendees.push(req.user._id);

                await meeti.save();
                return res.send('Has confirmado tu asistencia')
            } else {
                let index = meeti.attendees.indexOf(req.user._id);
                if (index > -1) {
                    meeti.attendees.splice(index, 1);

                    await meeti.save();
                    return res.send('Has cancelado tu asistencia')
                }
            }
        } catch (error) {
            console.log({ error })
        }
    },

    show_attendees_meeti_get: async (req, res, next) => {
        try {
            const slug = req.params.slug;
            const meeti = await Meeti.findOne({ slug }, 'attendees')
                .populate({
                    path: 'attendees',
                    select: 'name image',
                    model: 'User',
                }).exec();

            res.render('attendees_meeti', {
                pagename: 'Asistentes al meeti',
                attendees: meeti.attendees
            })
        } catch (error) {
            console.log({ error });
        }
    },

    show_user_profile_get: async (req, res, next) => {
        try {
            const _id = req.params.id;
            const queries = [];

            queries.push(Group.find({ user: _id }));
            queries.push(User.findOne({ _id }));

            const [groups, user] = await Promise.all(queries);

            if (!user) {
                res.redirect('/');
                return next();
            }
            res.render('show_profile', {
                pagename: 'Perfil del usuario',
                user,
                groups
            });

        } catch (error) {
            console.log({ error });
        }
    },

    show_group_get: async (req, res, next) => {
        try {
            const _id = req.params.id;
            const queries = [];

            queries.push(Group.findOne({ _id }));
            queries.push(
                Meeti.find({
                    date: { $gte: new Date() }
                }, 'name date slug')
                    .sort({ date: 1 })
            );

            const [group, meetis] = await Promise.all(queries);


            if (!group) {
                res.redirect('/');
                return next();
            }
            res.render('show_group', {
                pagename: `Grupo: ${group.name}`,
                group,
                meetis,
                moment
            });
        } catch (error) {
            console.log({ error });
        }
    },

    show_category_get: async (req, res, next) => {
        try {
            const slug = req.params.slug;
            const category = await Category.findOne({ slug }, '_id name');
            const groups = await Group.find({ category: category._id }, '_id');
            const meetis = await Meeti.find({ group: { "$in": groups } })
                .populate('user', '-password -__v -enabled')
                .populate('group', 'name image');

            res.render('category', {
                pagename: `Categoría: ${category.name}`,
                meetis,
                moment
            })
        } catch (error) {
            console.log({ error });
        }
    },

    search_meeti_get: async (req, res, next) => {
        const { category } = req.query;

        const name = new RegExp(`.*${req.query.name}.*`, "i");
        const city = new RegExp(`.*${req.query.city}.*`, 'i');
        const country = new RegExp(`.*${req.query.country}.*`, 'i');

        let group, meetis;
        if (category) {
            group = await Group.find({ category });
        }
        if (group) {
            meetis = await Meeti.find({
                name: { $regex: name },
                city: { $regex: city },
                country: { $regex: country },
                group: { "$in": group }
            })
                .populate('group', 'name image')
                .populate('user', 'name image');
        } else {
            meetis = await Meeti.find({
                name: { $regex: name },
                city: { $regex: city },
                country: { $regex: country }
            })
                .populate('group', 'name image')
                .populate('user', 'name image');
        }
        return res.render('search', {
            pagename: 'Resultados Búsqueda:',
            meetis,
            moment
        })
    },
}