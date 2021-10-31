const { Router } = require('express');

// controllers
const createpost = require('../controllers/private/posts/createpost.controllers');
const getAllPosts = require('../controllers/private/posts/getallposts.controllers');
const deletePost = require('../controllers/private/posts/delete.controllers');

// Middleware
const extractJWT = require('../middleware/extractJWT.middleware');
const isPostOwner = require('../middleware/ispostowner.middleware');

const router = Router();

router.post('/createpost', extractJWT, createpost);
router.get('/getallposts', extractJWT, getAllPosts);
router.delete('/delete', extractJWT, isPostOwner, deletePost);

module.exports = {
    postsRouter: router
};
