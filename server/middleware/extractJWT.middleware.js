require('dotenv').config();
const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const log = require('debug')('JWT');
const logValidate = log.extend('validate');

const extractJWT = (req, res, next) => {
    let token = req.headers.authorization?.split(' ')[1];
    logValidate('Validating token');
    if (token) {
        jwt.verify(token, process.env.SERVER_TOKEN_SECRET, { algorithm: ['HS256'] }, (error, decoced) => {
            if (error) {
                logValidate(`Token has been invalidated : ${error.message}`);
                return res.status(StatusCodes.NOT_FOUND).json({ message: error.message, error });
            } else {
                logValidate('Token has been validated');
                res.locals.jwt = decoced;
                next();
            }
        });
    } else {
        logValidate('No token found');
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' });
    }
};

module.exports = extractJWT;
