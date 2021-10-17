const { Router } = require('express');
const { validateToken, login, register, getAllUsers } = require('../controllers/auth/auth.controllers');
const extractJWT = require('../middleware/extractJWT.middleware');

const router = Router();

router.get('/validate-token', extractJWT, validateToken);
router.post('/login', login);
router.post('/register', register);
router.get('/getallusers', getAllUsers);

module.exports = {
    authRouter: router
};
