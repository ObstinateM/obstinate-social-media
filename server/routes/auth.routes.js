const { Router } = require('express');
const { validateToken, login, register, getAllUsers, refresh } = require('../controllers/auth/auth.controllers');
const extractJWT = require('../middleware/extractJWT.middleware');

const router = Router();

router.get('/validate-token', extractJWT, validateToken);
router.post('/login', login);
router.post('/register', register);
router.get('/getallusers', getAllUsers);
router.get('/refresh', refresh);

module.exports = {
    authRouter: router
};
