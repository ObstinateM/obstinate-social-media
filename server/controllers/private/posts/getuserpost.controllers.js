const { StatusCodes } = require('http-status-codes');
const { Connect, safeQuery } = require('../../../utils/db');
const logGetUser = require('debug')('post:getUser');

const getuserpost = (req, res) => {
    let { user_id } = req.body;
    logGetUser(`User is trying to get all posts from an user (${user_id})`);
    let query = `SELECT posts.*, users.name as author, users.avatar as avatar, (SELECT COUNT(*) FROM post_like WHERE post_id = posts.id) AS nbLikes, (SELECT COUNT(*) FROM post_like WHERE post_id = posts.id AND user_id = ?) as isLiked FROM posts JOIN users ON users.id = posts.id_user WHERE posts.id_user = ? ORDER BY posts.id DESC LIMIT 30`;
    let values = [user_id, user_id];
    Connect()
        .then(connection => {
            safeQuery(connection, query, values)
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
