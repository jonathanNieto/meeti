const express = require('express');
const path = require('path');
const router = express.Router();

const homeController = require('../controllers/home.controller');
const meetiFrontendController = require('../controllers/frontend/meeti.frontend.controller')

/* router */
router.get('/', homeController.home);

/* show a meeti */
router.get('/meeti/:slug', meetiFrontendController.show_meeti_get);

/* confirm_assistance_meeti */
router.post('/meeti/confirm-assistance/:slug', meetiFrontendController.confirm_assistance_meeti_post);

module.exports = router;