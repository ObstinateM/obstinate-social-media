const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

const extractJWT = (req, res, next) => {
    console.log('Validating Token');

    let token = req.headers.authorization?.split(' ')[1];
    if (token) {
        jwt.verify(token, process.env.SERVER_TOKEN_SECRET, (error, decoced) => {
            if (error) return res.status(StatusCodes.NOT_FOUND).json({ message: error.message, error });
            res.locals.jwt = decoced;
            next();
        });
    }
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' });
};

module.exports = extractJWT;
