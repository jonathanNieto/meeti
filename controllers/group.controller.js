const Category = require('../models/Category');
const Group = require('../models/Group');
const multer = require('multer');
const shortid = require('shortid');
const path = require('path');
const fs = require('fs');

const upload = multer({
    limits: { fileSize: 100000 },
    storage: fileStorage = multer.diskStorage({
        destination: (req, res, next) => {
            next(null, __dirname + '/../public/uploads/groups/')
        },
        filename: (req, file, next) => {
            try {
                const extension = path.extname(file.originalname);
                /* o esta opción también es valida: const extension = file.mimetype.split('/')[1]; */
                next(null, `${shortid.generate()}${extension}`);
            } catch (error) {
                console.log({ error })
            }
        },
    }),
    fileFilter(req, file, next) {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            /* el formato es valido */
            next(null, true);
        } else {
            next(new Error('Formato de imagen no válido'), false);
        }
    }
}).single('image');


module.exports = {
    create_group_get: async (req, res) => {
        const categories = await Category.find();

        res.render('new_group', {
            pagename: 'Crea un nuevo grupo',
            categories,
        });
    },

    /* it stores a new group into database */
    create_group_post: async (req, res, next) => {
        const body = req.body;
        const group = new Group(body);

        /* get image name */
        if (req.file) {
            group.image = req.file.filename;
            /* req.flash('error', `Por favor elija una imagen para su grupo`);
            return res.redirect('/user/new-group'); */
        }
        try {
            group.user = req.user._id;
            await group.save();
            req.flash('exito', `Se ha creado el grupo   "${group.name}"   correctamente`);
            res.redirect('/user/admin');
        } catch (error) {
            console.log({ error })
            if (error.errors) {
                Object.values(error.errors).map(err => {
                    req.flash('error', err.message);
                    return err.message;
                });
            } else {
                req.flash('error', error);
            }

            res.redirect('/user/new-group');
        }
    },

    upload_image_group_post: (req, res, next) => {
        upload(req, res, function (error) {
            if (error) {
                // TODO: manejar errorres
                if (error instanceof multer.MulterError) {
                    if (error.code = 'LIMIT_FILE_SIZE') {
                        req.flash('error', 'El archivo es muy grande. Por favor elija una imagen de máximo 100 kb')
                    } else {
                        req.flash('error', error.message);
                    }
                } else if (error.hasOwnProperty('message')) {
                    req.flash('error', error.message);
                }
                return res.redirect('back');
            } else {
                next();
            }
        });
    },

    edit_group_get: async (req, res, next) => {
        const _id = req.params.id;

        /* cuando tenemos multiples consultas y son independientes entre ellas, lo mejos es usar un Promise.all() */
        const queries = [];
        queries.push(Group.findOne({ _id, user: req.user._id }));
        queries.push(Category.find());

        /* promise con await */
        const [group, categories] = await Promise.all(queries);

        res.render('edit_group', {
            pagename: `Editar grupo: ${group.name}`,
            group,
            categories
        });
    },

    edit_group_post: async (req, res, next) => {
        try {
            const _id = req.params.id;

            const group = await Group.findOne({ _id, user: req.user._id });

            /* sino existe el grupo o  el usuario no es el dueño */
            if (!group) {
                req.flash('error', 'No se pudó realizar la tarea solicitada');
                res.redirect('/user/admin');
                return next();
            }

            const { name, description, category, websiteUrl } = req.body;
            group.name = name;
            group.description = description;
            group.category = category;
            group.websiteUrl = websiteUrl;

            await group.save();

            req.flash('exito', 'Datos actualizados correctamente.');
            return res.redirect('/user/admin');
        } catch (error) {
            console.log({ error })
        }
    },

    edit_image_group_get: async (req, res, next) => {
        try {
            const _id = req.params.id;
            const group = await Group.findOne({ _id, user: req.user._id });

            res.render('image_group', {
                pagename: `Editar la imagen del grupo: ${group.name}`,
                group
            });
        } catch (error) {

        }
    },

    /* modifica la imagen en la bd y elimina la anterior */
    edit_group_image_post: async (req, res, next) => {
        try {
            const _id = req.params.id;
            const group = await Group.findOne({ _id, user: req.user._id });

            if (!group) {
                req.flash('error', 'No se pudó realizar la tarea solicitada');
                res.redirect('/user/admin');
                return next();
            }

            /* verificar que el archivo es valido */
            if (req.file && group.image) {
                const oldImagePath = __dirname + `/../public/uploads/groups/${group.image}`;
                fs.unlink(oldImagePath, (error) => {
                    if (error) {
                        console.log({ error })
                    }
                    return;
                });
            }
            if (req.file) {
                group.image = req.file.filename;
            }
            group.save();
            req.flash('exito', 'Imagen actualizada correctamente.');
            return res.redirect('/user/admin');
        } catch (error) {
            console.log({ error })
        }
    },

    delete_group_delete: async (req, res, next) => {
        try {
            const _id = req.params.id;
            const group = await Group.findOneAndDelete({ _id, user: req.user._id });

            if (!group) {
                req.flash('error', 'No se pudó realizar la tarea solicitada');
                res.status(403).send('No se pudó realizar la tarea solicitada!');
                /* res.redirect('/user/admin'); */
                return next();
            }

            if (group.image) {
                const oldImagePath = __dirname + `/../public/uploads/groups/${group.image}`;
                fs.unlink(oldImagePath, (error) => {
                    if (error) {
                        console.log({ error })
                    }
                });
            }
            req.flash('exito', `El grupo "${group.name}" ha sido eliminado correctamente`);
            res.status(200).send('Grupo eliminado correctamente!');
            /* return res.redirect('/user/admin'); */
        } catch (error) {
            console.log({ error })
        }
    },
}