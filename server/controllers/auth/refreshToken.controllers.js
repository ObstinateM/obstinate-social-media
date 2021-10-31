const { StatusCodes } = require('http-status-codes');
const {
    generateRefreshToken,
    generateAccessToken,
    addRefreshTokentoDB,
    isRefreshTokenInDB,
    deleteRefreshToken
} = require('../../utils/signJWT');
const jwt = require('jsonwebtoken');
const logRefresh = require('debug')('auth:refreshToken');

const refresh = (req, res) => {
    logRefresh('User is refreshing his token');
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        logRefresh('Rejected: User is not authentificated');
        return res.status(401).json({ message: 'You are not authentificated!' });
    }

    isRefreshTokenInDB(refreshToken, (exist, err) => {
        if (err) {
            logRefresh('Failed: database error');
            return res
                .status(500)
                .cookie('refreshToken', '', {
                    httpOnly: true,
                    maxAge: 0
                })
                .json({ message: 'Internal Server Error' });
        }
        if (!exist) {
            logRefresh('Rejected: Refresh token is not valid');
            return res
                .status(403)
                .cookie('refreshToken', '', {
                    httpOnly: true,
                    maxAge: 0
                })
                .json({ message: 'Refresh token is not valid.' });
        }
        jwt.verify(refreshToken, process.env.SERVER_REFRESH_TOKEN_SECRET, { algorithm: ['HS256'] }, (err, user) => {
            if (err) {
                logRefresh(`Rejected: Token is invalid: %O`, err);
                return res
                    .status(StatusCodes.NOT_ACCEPTABLE)
                    .cookie('refreshToken', '', {
                        httpOnly: true,
                        maxAge: 0
                    })
                    .json({ message: 'Token is invalid' });
            } else {
                deleteRefreshToken(refreshToken, result => {
                    if (result.isValid) {
                        let accessToken = generateAccessToken(user);
                        let refreshToken = generateRefreshToken(user);
                        addRefreshTokentoDB(refreshToken, err => {
                            if (err) {
                                logRefresh('Rejected: Failed to add token to db');
                                return res
                                    .status(StatusCodes.INTERNAL_SERVER_ERROR)
                                    .json({ message: 'An error occurred while refreshing token' });
                            } else {
                                logRefresh('Successfully refreshed token');
                                return res
                                    .cookie('refreshToken', refreshToken, {
                                        httpOnly: true,
                                        expires: new Date(Date.now() + 24 * 3600000) // Cookie removed after 24 hours
                                    })
                                    .status(StatusCodes.ACCEPTED)
                                    .json({
                                        id: user.id,
                                        name: user.name,
                                        email: user.email,
                                        avatar: user.avatar,
                                        bio: user.bio,
                                        accessToken
                                    });
                            }
                        });
                    } else {
                        logRefresh('Rejected: Token not found/deleted in database');
                        return res
                            .status(500)
                            .cookie('refreshToken', '', {
                                httpOnly: true,
                                maxAge: 0
                            })
                            .json({ message: 'Token is invalid.' });
                    }
                });
            }
        });
    });
};

module.exports = refresh;
