const { StatusCodes } = require('http-status-codes');
const { isRefreshTokenInDB, deleteRefreshToken } = require('../../utils/signJWT');

const logout = (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        res.status(401).json({ message: 'You are not authentificated!' }).cookie('refreshToken', {
            httpOnly: true,
            maxAge: 0
        });
    } else {
        isRefreshTokenInDB(refreshToken, (exist, err) => {
            if (err) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Please retry to logout' });
            if (exist) {
                deleteRefreshToken(refreshToken, (isValid, err) => {
                    if (err || !isValid) {
                        res.cookie('refreshToken', '', {
                            httpOnly: true,
                            maxAge: 0
                        })
                            .status(StatusCodes.NOT_ACCEPTABLE)
                            .json({ message: 'Refresh token is invalid.' });
                    } else {
                        res.cookie('refreshToken', '', {
                            httpOnly: true,
                            maxAge: 0
                        })
                            .status(StatusCodes.ACCEPTED)
                            .json({ message: 'You are now logged out.' });
                    }
                });
            }
        });
    }
};

module.exports = logout;
