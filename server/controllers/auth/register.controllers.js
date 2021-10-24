const { StatusCodes } = require('http-status-codes');
const bcrypt = require('bcrypt');
const { Connect, Query } = require('../../utils/db');
const { doesEmailExist, isNameValid, doesNameExist } = require('../../utils/user');

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

module.exports = register;
