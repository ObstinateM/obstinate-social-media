const { StatusCodes } = require('http-status-codes');
const bcrypt = require('bcrypt');
const { Connect, Query } = require('../../utils/db');
const { doesEmailExist, isNameValid, doesNameExist } = require('../../utils/user');
const logRegister = require('debug')('auth:register');

const register = (req, res) => {
    let { name, email, password, password2 } = req.body;
    logRegister(`User is trying to register (${name}:${email})`);

    if (!name && !email && !password && !password2) {
        logRegister('Failed: Invalid inputs');
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Invalid inputs.' });
    }

    if (password !== password2) {
        logRegister('Failed: Password does not match');
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Password does not match.' });
    }

    Promise.all([isNameValid(name), doesNameExist(name), doesEmailExist(email)])
        .then(() => {
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) {
                    logRegister(`Failed: ${err.message}`);
                    return res
                        .status(StatusCodes.INTERNAL_SERVER_ERROR)
                        .json({ message: 'Server Error: Please try again' });
                }

                let query = `INSERT INTO users(name, email, password) VALUES ("${name}", "${email}", "${hash}");`;

                Connect()
                    .then(connection => {
                        Query(connection, query)
                            .then(result => {
                                logRegister(`Success: Account created (${result.insertId})`);
                                return res.status(StatusCodes.CREATED).json({ message: 'Account created' });
                            })
                            .catch(error => {
                                logRegister(`Failed: ${err.message}`);
                                return res
                                    .status(StatusCodes.INTERNAL_SERVER_ERROR)
                                    .json({ message: error.message, error });
                            });
                    })
                    .catch(error => {
                        logRegister(`Failed: ${error.message}`);
                        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message, error });
                    });
            });
        })
        .catch(() => {
            logRegister('Failed: Invalid inputs');
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Invalid inputs.' });
        });
};

module.exports = register;
