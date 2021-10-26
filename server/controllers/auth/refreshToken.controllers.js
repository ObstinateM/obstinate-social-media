const { StatusCodes } = require('http-status-codes');
const {
    generateRefreshToken,
    generateAccessToken,
    addRefreshTokentoDB,
    isRefreshTokenInDB,
    deleteRefreshToken
} = require('../../utils/signJWT');
const jwt = require('jsonwebtoken');

const refresh = (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) return res.status(401).json({ message: 'You are not authentificated!' });

    isRefreshTokenInDB(refreshToken, (exist, err) => {
        if (err) return res.status(500).json({ message: 'Internal Server Error err' });
        if (!exist) return res.status(403).json({ message: 'Refresh token is not valid.' });
        jwt.verify(refreshToken, process.env.SERVER_REFRESH_TOKEN_SECRET, { algorithm: ['HS256'] }, (err, user) => {
            if (err) console.log(err);
            deleteRefreshToken(refreshToken, result => {
                if (result.isValid) {
                    let accessToken = generateAccessToken(user);
                    let refreshToken = generateRefreshToken(user);
                    addRefreshTokentoDB(refreshToken, err => {
                        if (err) console.log(err);
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
                                accessToken,
                                refreshToken // For debug purposes only, DELETE AFTER
                            });
                    });
                } else {
                    return res.status(500).json({ message: 'Internal Server Error' });
                }
            });
        });
    });
};

module.exports = refresh;
