const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

const signJWT = (user, callback) => {
    let timeSinceEpoch = new Date().getTime();
    let expirationTime = timeSinceEpoch + process.env.SERVER_TOKEN_EXPIRETIME * 100000;
    let expirationTimeInSecondes = Math.floor(expirationTime / 1000);

    console.log(`Attempting to sign token for ${user.name}`);

    try {
        jwt.sign(
            {
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                bio: user.bio
            },
            process.env.SERVER_TOKEN_SECRET,
            {
                issuer: process.env.SERVER_TOKEN_ISSUER,
                algorithm: 'HS256',
                expiresIn: expirationTimeInSecondes
            },
            (error, token) => {
                if (error) callback(error, null);
                if (token) callback(null, token);
            }
        );
    } catch (error) {
        console.log('Error in auth.controllers.js :\n', error.message, error);
        callback(error, null);
    }
};

module.exports = signJWT;
