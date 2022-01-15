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
const { Connect, safeQuery } = require('../../utils/db');

const refresh = (req, res) => {
    logRefresh('User is refreshing his token');
    const refreshToken = req.cookies.refreshToken;
    const { force } = req.query;
    logRefresh('It is a forced refresh : ', force);

    if (!refreshToken) {
        logRefresh('Rejected: User is not authentificated');
        return res.status(401).json({ message: 'You are not authentificated!' });
    }

    isRefreshTokenInDB(refreshToken, (exist, err) => {
        if (err) {
            logRefresh('Failed: database error');
            return res.status(500).json({ message: 'Internal Server Error' });
        } else if (exist) {
            logRefresh('Le token existe bien dans DB');
            /**
             * On le vérifie avec jwt.verify
             * S'il est invalid on reject et on clear son cookie refreshToken
             * Sinon on vérifie qu'il va pas expirer dans les 5 prochains jours
             * S'il va expirer alors on le refresh
             * Sinon on return juste un accesToken
             */
            // TODO: Add user_id with refresh token to be able to delete them by user id
            // TODO : Add role to tokens
            jwt.verify(refreshToken, process.env.SERVER_REFRESH_TOKEN_SECRET, { algorithm: ['HS256'] }, (err, user) => {
                if (err) {
                    logRefresh(`Failed: token invalid (${err.name})`);
                    return res
                        .status(500)
                        .cookie('refreshToken', '', {
                            httpOnly: true,
                            maxAge: 0
                        })
                        .json({ message: 'Internal Server Error' });
                } else {
                    // Jour * heure * nb minute/heure * nb/seconde * nb ms
                    let expRefresh = Math.floor((Date.now() + 23 * 24 * 60 * 60 * 1000) / 1000);
                    logRefresh(`Le token va expirer ? (${expRefresh}, ${user.exp}, ${expRefresh >= user.exp})`);
                    if (expRefresh >= user.exp || force) {
                        // on doit refresh le token ici
                        refreshUser(user).then(user => {
                            deleteRefreshToken(refreshToken, result => {
                                if (result.isValid) {
                                    let accessToken = generateAccessToken(user);
                                    let refreshToken = generateRefreshToken(user);
                                    addRefreshTokentoDB(refreshToken, err => {
                                        if (err) {
                                            logRefresh('Rejected: Failed to add token to db');
                                            return res
                                                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                                                .cookie('refreshToken', '', {
                                                    httpOnly: true,
                                                    maxAge: 0
                                                })
                                                .json({
                                                    message:
                                                        'An error occurred while refreshing token. Please relogin manually.'
                                                });
                                        } else {
                                            logRefresh('Successfully refreshed token');
                                            return res
                                                .cookie('refreshToken', refreshToken, {
                                                    httpOnly: true,
                                                    expires: new Date(Date.now() + 30 * 24 * 59 * 60 * 1000) // Cookie removed after 24 hours
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
                                    logRefresh('Rejected: Token not deleted in database');
                                    return res
                                        .status(500)
                                        .cookie('refreshToken', '', {
                                            httpOnly: true,
                                            maxAge: 0
                                        })
                                        .json({ message: 'Token is invalid.' });
                                }
                            });
                        });
                    } else {
                        logRefresh('Token is valid and will not expire, successfully refreshed token');
                        let accessToken = generateAccessToken(user);
                        return res.status(StatusCodes.ACCEPTED).json({
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            avatar: user.avatar,
                            bio: user.bio,
                            accessToken
                        });
                    }
                }
            });
        } else {
            logRefresh('Reject: Token is not in database. Deleting cookie...');
            return res
                .status(500)
                .cookie('refreshToken', '', {
                    httpOnly: true,
                    maxAge: 0
                })
                .json({ message: 'Token is invalid.' });
        }
    });
};

const refreshUser = user => {
    return new Promise(async (resolve, reject) => {
        const connection = await Connect();
        const newUser = await safeQuery(connection, 'SELECT * FROM users WHERE id = ?', [user.id]);
        resolve(newUser[0]);
    });
};

module.exports = refresh;
