const { Router } = require('express');

// controllers
const updateBio = require('../controllers/private/user/bio.controllers');
const uploadImage = require('../controllers/private/user/avatar.controllers');

const router = Router();

router.post('/bio', updateBio);
router.post('/avatar', uploadImage);

module.exports = {
    userPrivateRouter: router
};
