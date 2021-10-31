const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const extractJWT = (req, res, next) => {
    let token = req.headers.authorization?.split(' ')[1];
    console.log('Validating a token :\n' + token);
    if (token) {
        jwt.verify(token, process.env.SERVER_TOKEN_SECRET, { algorithm: ['HS256'] }, (error, decoced) => {
            if (error) return res.status(StatusCodes.NOT_FOUND).json({ message: error.message, error });
            else {
                res.locals.jwt = decoced;
                next();
            }
        });
    } else {
        console.log(token);
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' });
    }
};

module.exports = extractJWT;
