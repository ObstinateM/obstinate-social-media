const jwt = require('jsonwebtoken');
const { addRefreshTokentoDB } = require('./utils/signJWT');

const user = {
    id: 5,
    name: 'Robot',
    email: 'z@z',
    avatar: 'https://yt3.ggpht.com/ytc/AKedOLTcIl6kKt3lEPJEySUf_hpHiKDKiFeo9eWPReLysQ=s176-c-k-c0x00ffffff-no-rj',
    bio: "Hey I'm a super cool Robot!"
};

const manualRefreshToken = () => {
    const token = jwt.sign(
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
            expiresIn: '15s'
        }
    );
    addRefreshTokentoDB(token, () => {
        console.log(token);
    });
};

manualRefreshToken();
