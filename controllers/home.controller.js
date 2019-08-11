const Category = require('../models/Category');
const Meeti = require('../models/Meeti');
const Group = require('../models/Group');
const moment = require('moment');


module.exports = {
    home: async (req, res) => {
        const queries = [];
        queries.push(Category.find());
        queries.push(
            Meeti.find({
                date: { $gte: new Date() }
            }, 'name date slug')
                .sort({ date: 1 })
                .populate('group', 'image name')
                .populate('user', 'image name')
                .limit(3)
                .exec()
        );

        const [categories, meetis] = await Promise.all(queries);

        res.render('home', {
            pagename: 'Inicio',
            categories,
            meetis,
            moment
        });
    }
}