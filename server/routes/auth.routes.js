const { Router } = require('express');
const { validateToken, getAllUsers } = require('../controllers/auth/auth.controllers');
const login = require('../controllers/auth/login.controllers');
const register = require('../controllers/auth/register.controllers');
const refresh = require('../controllers/auth/refreshToken.controllers');
const logout = require('../controllers/auth/logout.controllers');
const { extractJWT } = require('../middleware/extractJWT.middleware');

const router = Router();

router.get('/validate-token', extractJWT, validateToken);
router.post('/login', login);
router.post('/register', register);
router.get('/getallusers', getAllUsers);
router.get('/refresh', refresh);
router.get('/logout', logout);

module.exports = {
    authRouter: router
};
