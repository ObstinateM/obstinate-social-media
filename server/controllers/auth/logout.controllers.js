const { StatusCodes } = require('http-status-codes');
const { isRefreshTokenInDB, deleteRefreshToken } = require('../../utils/signJWT');
const logLogout = require('debug')('auth:logout');

const logout = (req, res) => {
    logLogout('User is trying to log out');
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        logLogout('User wasnt authentificated');
        res.status(401).json({ message: 'You are not authentificated!' }).cookie('refreshToken', {
            httpOnly: true,
            maxAge: 0
        });
    } else {
        isRefreshTokenInDB(refreshToken, (exist, err) => {
            if (err) {
                logLogout('Failed: database error');
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Please retry to logout' });
            }
            if (exist) {
                deleteRefreshToken(refreshToken, (isValid, err) => {
                    if (err || !isValid) {
                        logLogout('Refresh token was invalid or expired and has been deleted');
                        res.cookie('refreshToken', '', {
                            httpOnly: true,
                            maxAge: 0
                        })
                            .status(StatusCodes.NOT_ACCEPTABLE)
                            .json({ message: 'Refresh token is invalid.' });
                    } else {
                        logLogout('User successfully logged out');
                        res.cookie('refreshToken', '', {
                            httpOnly: true,
                            maxAge: 0
                        })
                            .status(StatusCodes.ACCEPTED)
                            .json({ message: 'You are now logged out.' });
                    }
                });
            } else {
                logLogout('Token is invalid: not in database');
                res.status(StatusCodes.NOT_ACCEPTABLE).json({ message: 'Token is invalid' });
            }
        });
    }
};

module.exports = logout;
