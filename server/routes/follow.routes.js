const { Router } = require('express');

// controllers
const followClick = require('../controllers/private/follow/followClick.controllers');
const isFollowing = require('../controllers/private/follow/isFollowing.controllers');

const router = Router();

router.get('/follow', isFollowing);
router.post('/follow', followClick);

module.exports = {
    followRouter: router
};
