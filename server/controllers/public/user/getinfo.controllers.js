const { StatusCodes } = require('http-status-codes');
const { Connect, Query } = require('../../../utils/db');
const logUser = require('debug')('user:getInfo');

const getUserInfo = (req, res) => {
    let { user_id } = req.body;
    logUser(`User is trying to get info of user (${user_id})`);
    let query = `SELECT * FROM users WHERE id = ${user_id}`;
    Connect()
        .then(connection => {
            Query(connection, query)
                .then(result => {
                    logUser('Success: User info has been returned');
                    res.status(StatusCodes.CREATED).json({ message: 'Ok.', user: result[0] });
                })
                .catch(err => {
                    logUser(`Failed: ${err.message}`);
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error', err });
                });
        })
        .catch(err => {
            logUser(`Failed: ${err.message}`);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error', err });
        });
};

module.exports = getUserInfo;
