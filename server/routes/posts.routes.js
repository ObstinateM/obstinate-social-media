const { Router } = require('express');

// controllers
const createpost = require('../controllers/private/posts/createpost.controllers');
const getAllPosts = require('../controllers/private/posts/getallposts.controllers');

// Middleware
const extractJWT = require('../middleware/extractJWT.middleware');

const router = Router();

router.get('/createpost', extractJWT, createpost);
router.get('/getallposts', extractJWT, getAllPosts);

module.exports = {
    postsRouter: router
};
