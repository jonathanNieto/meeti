const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})
    .then(db => console.log('DB is connected'))
    .catch((err) => console.error(err));

/* importar los modelos */
require('../models/User');
require('../models/Category');
require('../models/Group');
require('../models/Meeti');
require('../models/Comment');