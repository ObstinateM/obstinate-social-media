const { StatusCodes } = require('http-status-codes');
const bcrypt = require('bcrypt');
const signJWT = require('../../utils/signJWT');
const { Connect, Query } = require('../../utils/db');

const validateToken = (req, res, next) => {
    res.status(StatusCodes.ACCEPTED).json({
        message: 'Token accepted'
    });
};

const register = (req, res, next) => {
    console.log(req.body);
    let { name, email, password } = req.body;

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message, error: err });

        let query = `INSERT INTO users(name, email, password) VALUES ("${name}", "${email}", "${hash}");`;

        Connect()
            .then(connection => {
                Query(connection, query)
                    .then(result => {
                        console.log(`User with id ${result.insertId} inserted.`);
                        return res.status(StatusCodes.CREATED).json(result);
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
    });
};

const login = (req, res, next) => {
    let { email, password } = req.body;
    let query = `SELECT * FROM users WHERE email='${email}'`;
    console.log('Login passed');
    Connect()
        .then(connection => {
            console.log('Connected');
            Query(connection, query)
                .then(users => {
                    console.log('bcrypt compare');
                    bcrypt.compare(password, users[0].password, (error, result) => {
                        console.log('bcrypt passed', error, result);
                        if (error) {
                            return res.status(StatusCodes.UNAUTHORIZED).json({ message: error.message, error });
                        } else if (result) {
                            signJWT(users[0], (_error, token) => {
                                if (_error) {
                                    res.status(StatusCodes.UNAUTHORIZED).json({
                                        message: _error.message,
                                        error: _error
                                    });
                                } else if (token) {
                                    res.status(StatusCodes.ACCEPTED).json({
                                        message: 'Auth successful',
                                        token,
                                        user: {
                                            name: users[0].name,
                                            email: users[0].email,
                                            avatar: users[0].avatar,
                                            bio: users[0].bio
                                        }
                                    });
                                }
                            });
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

const getAllUsers = (req, res, next) => {
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

module.exports = {
    validateToken,
    login,
    register,
    getAllUsers
};
