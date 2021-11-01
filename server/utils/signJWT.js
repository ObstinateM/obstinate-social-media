require('dotenv').config();
const { Connect, Query } = require('./db');
const jwt = require('jsonwebtoken');
const log = require('debug')('JWT');
const logAccessToken = log.extend('accessToken');
const logRefreshToken = log.extend('refreshToken');
const logRefreshTokenPlus = log.extend('refreshToken:+');

const generateAccessToken = user => {
    logAccessToken(`Generating a new access token for ${user.id}:${user.name}`);
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
    logRefreshToken(`Generating a new refresh token for ${user.id}:${user.name}`);
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
            expiresIn: '30d'
        }
    );
};

const addRefreshTokentoDB = (token, callback) => {
    logRefreshTokenPlus('Adding a new refresh token to DB');
    Connect()
        .then(connection => {
            Query(connection, `INSERT INTO refreshToken(refreshToken) VALUES('${token}')`)
                .then(_ => {
                    logRefreshTokenPlus('Token successfully added to DB');
                    callback();
                })
                .catch(err => {
                    logRefreshTokenPlus('Failed to store the refresh token : %O', err);
                    callback();
                });
        })
        .catch(err => callback(err));
};

const isRefreshTokenInDB = (token, callback) => {
    logRefreshTokenPlus('Checking if refresh token is in DB');
    Connect()
        .then(connection => {
            Query(connection, `SELECT COUNT(*) as exist FROM refreshToken WHERE refreshToken = '${token}'`)
                .then(result => {
                    logRefreshTokenPlus('Refresh token is in DB');
                    callback(result[0].exist, null);
                })
                .catch(err => {
                    callback(null, err);
                    logRefreshTokenPlus('Refresh token is not in DB');
                });
        })
        .catch(err => callback(null, err));
};

const deleteRefreshToken = (token, callback) => {
    logRefreshTokenPlus('Deleting a refresh token');
    Connect()
        .then(connection => {
            Query(connection, `DELETE FROM refreshToken WHERE refreshToken = '${token}'`)
                .then(_ => {
                    logRefreshTokenPlus('Refresh token successfully deleted');
                    callback({ isValid: true, err: null });
                })
                .catch(err => {
                    logRefreshTokenPlus('Refresh token delete failed');
                    callback({ isValid: false, err });
                });
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
