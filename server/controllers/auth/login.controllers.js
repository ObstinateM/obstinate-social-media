const { StatusCodes } = require('http-status-codes');
const bcrypt = require('bcrypt');
const { generateRefreshToken, generateAccessToken, addRefreshTokentoDB } = require('../../utils/signJWT');
const { Connect, Query } = require('../../utils/db');
const logLogin = require('debug')('auth:login');

const login = (req, res) => {
    const { email, password } = req.body;
    logLogin(`${email} is trying to login`);
    let query = `SELECT * FROM users WHERE email='${email}'`;
    Connect()
        .then(connection => {
            Query(connection, query)
                .then(users => {
                    bcrypt.compare(password, users[0].password, (error, result) => {
                        if (error) {
                            logLogin(`Failed to login : ${error.message}`);
                            return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Wrong credentials.' });
                        }

                        if (result) {
                            let accessToken = generateAccessToken(users[0]);
                            let refreshToken = generateRefreshToken(users[0]);
                            addRefreshTokentoDB(refreshToken, () => {
                                logLogin(
                                    `Successfully login for ${users[0].id} : ${users[0].name} (${users[0].email})`
                                );
                                res.cookie('refreshToken', refreshToken, {
                                    httpOnly: true,
                                    expires: new Date(Date.now() + 30 * 24 * 59 * 60 * 1000) // Cookie removed after 24 hours
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
                            logLogin('Failed to login : Wrong credentials');
                            res.status(StatusCodes.NOT_ACCEPTABLE).json({ message: 'Wrong credentials.' });
                        }
                    });
                })
                .catch(error => {
                    logLogin(`Failed to login : ${error.message}`);
                    return res
                        .status(StatusCodes.INTERNAL_SERVER_ERROR)
                        .json({ message: 'Server Error : please retry' });
                });
        })
        .catch(error => {
            logLogin(`Failed to login : ${error.message}`);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server Error : please retry' });
        });
};

module.exports = login;
