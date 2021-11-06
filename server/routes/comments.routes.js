const { Router } = require('express');

// controllers
const create = require('../controllers/private/comments/create.controllers');
const getall = require('../controllers/private/comments/getbyid.controllers');
const deleteComment = require('../controllers/private/comments/delete.controllers');

// Middleware
const isCommentOwner = require('../middleware/isCommentOwner.middleware');

const router = Router();

router.post('/create', create);
router.post('/getall', getall);
router.delete('/delete', isCommentOwner, deleteComment);

module.exports = {
    commentsRouter: router
};
