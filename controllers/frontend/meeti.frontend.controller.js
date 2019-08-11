const Meeti = require('../../models/Meeti');
const Group = require('../../models/Group');
const User = require('../../models/User');
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

            res.render('show_meeti', {
                pagename: meeti.name,
                meeti,
                moment
            });
        } catch (error) {
            console.log({error})
        }
    },

    confirm_assistance_meeti_post: async (req, res, next) => {
        try {
          console.log('confirmando asistencia');
          res.send('confirmando asistencia')
      } catch (error) {
          console.log(object)
      }  
    },
}