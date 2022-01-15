const { Router } = require('express');

// controllers
const createroom = require('../controllers/private/chat/createRoom.controllers');

const router = Router();

router.post('/create', createroom);

module.exports = {
    chatRouter: router
};
