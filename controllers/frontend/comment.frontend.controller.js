const Meeti = require('../../models/Meeti');
const Group = require('../../models/Group');
const User = require('../../models/User');
const Category = require('../../models/Category');
const Comment = require('../../models/Comment');
const moment = require('moment');


module.exports = {
    create_comment_post: async (req, res, next) => {
        try {
            const body = req.body;
            const comment = new Comment(body);
            comment.user = req.user._id;
            comment.meeti = req.params.id;

            await comment.save();

            res.redirect('back');
            next();
        } catch (error) {
            console.log({ error });
        }
    },

    delete_comment_post: async (req, res, next) => {
        try {
            const { commentId, meetiId } = req.body;
            const meeti = await Meeti.findOne({ _id: meetiId })
            const comment = await Comment.findOneAndDelete({
                _id: commentId,
                $or: [
                    { user: req.user._id },
                    { meeti: meetiId }
                ]
            });

            if (!comment) {
                res.status(403).send('Acción no permitida');
                return next();
            }
            res.status(200).send('Comentario eliminado correctamente!');
            return next();
        } catch (error) {
            console.log({ error });
        }
    },
}