const { StatusCodes } = require('http-status-codes');
const { Connect, Query } = require('../../utils/db');

const validateToken = (req, res) => {
    if (res.locals.jwt.name === 'test') {
        res.status(StatusCodes.ACCEPTED).json({ message: "GG t'es test" });
    } else {
        res.status(StatusCodes.ACCEPTED).json({
            message: 'Token accepted'
        });
    }
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

module.exports = {
    validateToken,
    getAllUsers
};
