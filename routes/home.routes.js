const express = require('express');
const path = require('path');
const router = express.Router();

const homeController = require('../controllers/home.controller');

/* router */
router.get('/', homeController.home);

module.exports = router;