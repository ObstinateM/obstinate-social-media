const { Router } = require('express');

// controllers
const getUserInfo = require('../controllers/public/user/getinfo.controllers');

const router = Router();

router.post('/getinfo', getUserInfo);

module.exports = {
    userRouter: router
};
