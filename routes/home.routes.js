const express = require('express');
const path = require('path');
const router = express.Router();

const homeController = require('../controllers/home.controller');
const meetiFrontendController = require('../controllers/frontend/meeti.frontend.controller')
const commentFrontendController = require('../controllers/frontend/comment.frontend.controller')

/* router */
router.get('/', homeController.home);

/* show a meeti */
router.get('/meeti/:slug', meetiFrontendController.show_meeti_get);

/* confirm_assistance_meeti */
router.post('/meeti/confirm-assistance/:slug', meetiFrontendController.confirm_assistance_meeti_post);

/* show attendees meeti */
router.get('/attendees/:slug', meetiFrontendController.show_attendees_meeti_get);

/* add comment to a meeti */
router.post('/meeti/:id', commentFrontendController.create_comment_post);

/* delete a comment */
router.post('/delete-comment', commentFrontendController.delete_comment_post);

/* search a meeti */
router.get('/search', meetiFrontendController.search_meeti_get);

/* show profile */
router.get('/user-profile/:id', meetiFrontendController.show_user_profile_get);

/* show group */
router.get('/group/:id', meetiFrontendController.show_group_get);

/* show meetis por categorías */
router.get('/category/:slug', meetiFrontendController.show_category_get);


module.exports = router;