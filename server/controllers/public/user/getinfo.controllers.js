const { StatusCodes } = require('http-status-codes');
const { Connect, Query } = require('../../../utils/db');

const getUserInfo = (req, res) => {
    let { user_id } = req.body;
    let query = `SELECT * FROM users WHERE id = ${user_id}`;
    Connect()
        .then(connection => {
            Query(connection, query)
                .then(result => {
                    res.status(StatusCodes.CREATED).json({ message: 'Ok.', user: result[0] });
                })
                .catch(err => {
                    console.log('GET ALL POSTS : Query error', err);
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error', err });
                });
        })
        .catch(err => {
            console.log('GET ALL POSTS : Connect error', err);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error', err });
        });
};

module.exports = getUserInfo;
