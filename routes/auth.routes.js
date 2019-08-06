const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');

/* router */
router.get('/login', authController.formLogin);

router.get('/account-confirmation/:email', authController.accountConfirmation);

module.exports = router;