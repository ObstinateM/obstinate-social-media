const { Connect, Query } = require('./db');
const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateAccessToken = user => {
    return jwt.sign(
        {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            bio: user.bio
        },
        process.env.SERVER_TOKEN_SECRET,
        {
            issuer: process.env.SERVER_TOKEN_ISSUER,
            algorithm: 'HS256',
            expiresIn: '15m'
        }
    );
};

const generateRefreshToken = user => {
    return jwt.sign(
        {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            bio: user.bio
        },
        process.env.SERVER_REFRESH_TOKEN_SECRET,
        {
            issuer: process.env.SERVER_TOKEN_ISSUER,
            algorithm: 'HS256',
            expiresIn: '7d'
        }
    );
};

const addRefreshTokentoDB = (token, callback) => {
    Connect()
        .then(connection => {
            Query(connection, `INSERT INTO refreshToken(refreshToken) VALUES('${token}')`)
                .then(_ => {
                    callback(null);
                })
                .catch(err => callback(err));
        })
        .catch(err => callback(err));
};

const isRefreshTokenInDB = (token, callback) => {
    Connect()
        .then(connection => {
            Query(connection, `SELECT COUNT(*) as exist FROM refreshToken WHERE refreshToken = '${token}'`)
                .then(result => {
                    callback(result[0].exist, null);
                })
                .catch(err => callback(null, err));
        })
        .catch(err => callback(null, err));
};

const deleteRefreshToken = (token, callback) => {
    Connect()
        .then(connection => {
            Query(connection, `DELETE FROM refreshToken WHERE refreshToken = '${token}'`)
                .then(_ => {
                    console.log('Successfully deleted token : ', token);
                    callback({ isValid: true, err: null });
                })
                .catch(err => callback({ isValid: false, err }));
        })
        .catch(err => callback({ isValid: false, err }));
};

module.exports = {
    generateRefreshToken,
    generateAccessToken,
    addRefreshTokentoDB,
    isRefreshTokenInDB,
    deleteRefreshToken
};
