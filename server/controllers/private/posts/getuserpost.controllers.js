const { StatusCodes } = require('http-status-codes');
const { Connect, Query } = require('../../../utils/db');
const logGetUser = require('debug')('post:getUser');

const getuserpost = (req, res) => {
    let { user_id } = req.body;
    logGetUser(`User is trying to get all posts from an user (${user_id})`);
    let query = `SELECT posts.*, users.name as author, users.avatar as avatar FROM posts JOIN users ON users.id = posts.id_user WHERE posts.id_user = ${user_id} ORDER BY posts.id DESC LIMIT 30`;
    Connect()
        .then(connection => {
            Query(connection, query)
                .then(result => {
                    logGetUser('Success: All posts have been returned');
                    res.status(StatusCodes.CREATED).json({ message: 'Ok.', posts: result });
                })
                .catch(err => {
                    logGetUser(`Failed: ${err.message}`);
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error', err });
                });
        })
        .catch(err => {
            logGetUser(`Failed: ${err.message}`);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error', err });
        });
};

module.exports = getuserpost;
