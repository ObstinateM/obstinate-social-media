const { StatusCodes } = require('http-status-codes');
const bcrypt = require('bcrypt');
const {
    generateRefreshToken,
    generateAccessToken,
    addRefreshTokentoDB,
    isRefreshTokenInDB,
    deleteRefreshToken
} = require('../../utils/signJWT');
const { Connect, Query } = require('../../utils/db');
const { doesEmailExist, isNameValid, doesNameExist } = require('../../utils/user');
const jwt = require('jsonwebtoken');

const validateToken = (req, res) => {
    if (res.locals.jwt.name === 'test') {
        res.status(StatusCodes.ACCEPTED).json({ message: "GG t'es test" });
    } else {
        res.status(StatusCodes.ACCEPTED).json({
            message: 'Token accepted'
        });
    }
};

const register = (req, res) => {
    console.log(req.body);
    let { name, email, password, password2 } = req.body;

    if (!name && !email && !password && !password2) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Invalid inputs.' });
    }

    if (password !== password2) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Password doesnt match.' });
    }

    Promise.all([isNameValid(name), doesNameExist(name), doesEmailExist(email)])
        .then(() => {
            bcrypt.hash(password, 10, (err, hash) => {
                if (err)
                    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message, error: err });

                let query = `INSERT INTO users(name, email, password) VALUES ("${name}", "${email}", "${hash}");`;

                Connect()
                    .then(connection => {
                        Query(connection, query)
                            .then(result => {
                                console.log(`User with id ${result.insertId} inserted.`);
                                return res.status(StatusCodes.CREATED).json({ message: 'Account created' });
                            })
                            .catch(error => {
                                console.log('ERROR in auth.controllers.js :\n' + error.message, error);
                                return res
                                    .status(StatusCodes.INTERNAL_SERVER_ERROR)
                                    .json({ message: error.message, error });
                            });
                    })
                    .catch(error => {
                        console.log('ERROR in auth.controllers.js :\n' + error.message, error);
                        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message, error });
                    });
            });
        })
        .catch(() => {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Invalid inputs.' });
        });
};

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

const getAllUsers = (req, res) => {
    let query = 'SELECT id, name FROM users';
    Connect()
        .then(connection => {
            Query(connection, query)
                .then(users => {
                    return res.status(StatusCodes.ACCEPTED).json({
                        users,
                        count: users.length
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

const refresh = (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ message: 'You are not authentificated!' });
    isRefreshTokenInDB(refreshToken, (exist, err) => {
        console.log(err);
        if (err) return res.status(500).json({ message: 'Internal Server Error err' });
        console.log(exist, err);
        if (!exist) return res.status(403).json({ message: 'Refresh token is not valid.' });
        jwt.verify(refreshToken, process.env.SERVER_REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) console.log(err);
            deleteRefreshToken(refreshToken, result => {
                console.log(result);
                if (result.isValid) {
                    let accessToken = generateAccessToken(user);
                    let refreshToken = generateRefreshToken(user);
                    addRefreshTokentoDB(refreshToken, err => {
                        if (err) console.log(err);
                        console.log('USER FZEEFFZEZEFJZFEJEFZJFZEJFEZJFZEJJFZEJFZEJFZ :', user);
                        console.log(result);
                        res.cookie('refreshToken', refreshToken, {
                            httpOnly: true,
                            expires: new Date(Date.now() + 24 * 3600000) // Cookie removed after 24 hours
                        });
                        res.status(StatusCodes.ACCEPTED).json({
                            name: user.name,
                            email: user.email,
                            avatar: user.avatar,
                            bio: user.bio,
                            accessToken,
                            refreshToken // For debug purposes only, DELETE AFTER
                        });
                    });
                } else {
                    console.log('Error in deleteRefreshToken :', result.err);
                    res.status(500).json({ message: 'Internal Server Error' });
                }
            });
        });
    });
};

module.exports = {
    validateToken,
    login,
    register,
    getAllUsers,
    refresh
};
