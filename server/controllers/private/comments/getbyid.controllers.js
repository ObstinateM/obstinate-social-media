const { StatusCodes } = require('http-status-codes');
const { Connect, safeQuery } = require('../../../utils/db');
const logGetComments = require('debug')('comment:getComments');

const getall = (req, res) => {
    let { post_id } = req.body;
    logGetComments(`User is trying to get all comments from the post (${post_id})`);
    let query = `SELECT comments.*, users.name as author, users.avatar as avatar FROM comments JOIN users ON users.id = comments.user_id WHERE ? ORDER BY comments.id DESC`;
    let values = { 'comments.post_id': post_id };
    Connect()
        .then(connection => {
            safeQuery(connection, query, values)
                .then(result => {
                    logGetComments('Success: All comments have been returned');
                    res.status(StatusCodes.CREATED).json({ message: 'Ok.', comments: result });
                })
                .catch(err => {
                    logGetComments(`Failed: ${err.message}`);
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error', err });
                });
        })
        .catch(err => {
            logGetComments(`Failed: ${err.message}`);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error', err });
        });
};

module.exports = getall;
