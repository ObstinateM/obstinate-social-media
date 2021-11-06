const { Router } = require('express');

// controllers
const createpost = require('../controllers/private/posts/createpost.controllers');
const getAllPosts = require('../controllers/private/posts/getallposts.controllers');
const getuserpost = require('../controllers/private/posts/getuserpost.controllers');
const deletePost = require('../controllers/private/posts/delete.controllers');
const like = require('../controllers/private/posts/likeUnlike.controllers');

// Middleware
const isPostOwner = require('../middleware/ispostowner.middleware');
const isLiked = require('../middleware/isLiked.middleware');

const router = Router();

router.post('/createpost', createpost);
router.post('/getuser', getuserpost);
router.post('/like', isLiked, like);
router.get('/getallposts', getAllPosts);
router.delete('/delete', isPostOwner, deletePost);

module.exports = {
    postsRouter: router
};
