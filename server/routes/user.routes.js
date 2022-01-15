const { Router } = require('express');

// controllers
const getUserInfo = require('../controllers/public/user/getinfo.controllers');
const getAllUsers = require('../controllers/public/user/getall.controllers');

const router = Router();

router.post('/getinfo', getUserInfo);
router.get('/getall', getAllUsers);

module.exports = {
    userRouter: router
};
