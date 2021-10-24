const { StatusCodes } = require('http-status-codes');
const bcrypt = require('bcrypt');
const { generateRefreshToken, generateAccessToken, addRefreshTokentoDB } = require('../../utils/signJWT');
const { Connect, Query } = require('../../utils/db');

const login = (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);
    let query = `SELECT * FROM users WHERE email='${email}'`;
    Connect()
        .then(connection => {
            Query(connection, query)
                .then(users => {
                    bcrypt.compare(password, users[0].password, (error, result) => {
                        if (error) {
                            return res.status(StatusCodes.UNAUTHORIZED).json({ message: error.message, error });
                        }

                        if (result) {
                            let accessToken = generateAccessToken(users[0]);
                            let refreshToken = generateRefreshToken(users[0]);
                            console.log(refreshToken);
                            addRefreshTokentoDB(refreshToken, err => {
                                if (err) console.log(err);

                                res.cookie('refreshToken', refreshToken, {
                                    httpOnly: true,
                                    expires: new Date(Date.now() + 24 * 3600000) // Cookie removed after 24 hours
                                });
                                res.status(StatusCodes.ACCEPTED).json({
                                    id: users[0].id,
                                    name: users[0].name,
                                    email: users[0].email,
                                    avatar: users[0].avatar,
                                    bio: users[0].bio,
                                    accessToken
                                });
                            });
                        } else {
                            res.status(StatusCodes.NOT_ACCEPTABLE).json({ message: 'Wrong credentials.' });
                        }
                    });
                })
                .catch(error => {
                    console.log('ERROR in auth.controllers.js :\n' + error.message, error);
                    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message, error });
                });
        })
        .catch(error => {
            console.log('ERROR in auth.controllers.js :\n' + error.message, error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message, error });
        });
};

module.exports = login;
