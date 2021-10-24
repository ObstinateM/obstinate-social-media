const { StatusCodes } = require('http-status-codes');
const bcrypt = require('bcrypt');
const signJWT = require('../../utils/signJWT');
const { Connect, Query } = require('../../utils/db');
const { doesEmailExist, isNameValid, doesNameExist } = require('../../utils/user');

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
                        }

                        if (result) {
                            signJWT(users[0], (_error, token) => {
                                if (_error) {
                                    res.status(StatusCodes.UNAUTHORIZED).json({
                                        message: _error.message,
                                        error: _error
                                    });
                                }

                                if (token) {
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
                        } else
                            res.status(StatusCodes.NOT_ACCEPTABLE).json({ message: 'Email or password is invalid.' });
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

const testEmail = (req, res) => {
    let { email } = req.body;
    doesEmailExist(email)
        .then(() => {
            res.status(StatusCodes.OK).json({ valid: true });
        })
        .catch(() => {
            res.status(StatusCodes.UNAUTHORIZED).json({ valid: false });
        });
};

const testName = (req, res) => {
    let { name } = req.body;
    Promise.all([isNameValid(name), doesNameExist(name)])
        .then(() => {
            res.status(StatusCodes.OK).json({ valid: true });
        })
        .catch(() => {
            res.status(StatusCodes.UNAUTHORIZED).json({ valid: false });
        });
};

const testPassword = (req, res) => {
    let { password } = req.body;
    if (password.length > 8) {
        res.status(StatusCodes.ACCEPTED).json({ valid: true });
    } else {
        res.status(StatusCodes.NOT_ACCEPTABLE).json({ valid: false });
    }
};

module.exports = {
    validateToken,
    login,
    register,
    getAllUsers,
    testEmail,
    testName,
    testPassword
};
