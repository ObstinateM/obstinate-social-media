const { generateAccessToken } = require('./utils/signJWT');

const user = {
    id: 5,
    name: 'Robot',
    email: 'z@z',
    avatar: 'https://yt3.ggpht.com/ytc/AKedOLTcIl6kKt3lEPJEySUf_hpHiKDKiFeo9eWPReLysQ=s176-c-k-c0x00ffffff-no-rj',
    bio: "Hey I'm a super cool Robot!"
};

console.log(generateAccessToken(user, process.argv[2]));
