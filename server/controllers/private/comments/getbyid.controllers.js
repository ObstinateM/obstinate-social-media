const { StatusCodes } = require('http-status-codes');
const { Connect, safeQuery } = require('../../../utils/db');
const logGetComments = require('debug')('comment:getComments');

const getall = (req, res) => {
    let { post_id } = req.body;
    const user = res.locals.jwt;
    logGetComments(`User is trying to get all comments from the post (${post_id})`);
    let query = `SELECT posts.*, users.name as author, users.avatar as avatar, (SELECT COUNT(*) FROM post_like WHERE post_id = posts.id) AS nbLikes, (SELECT COUNT(*) FROM post_like WHERE post_id = posts.id AND user_id = ?) as isLiked FROM posts JOIN users ON users.id = posts.id_user WHERE posts.id = ? UNION SELECT commentsBis.* FROM (SELECT comments.*, users.name as author, users.avatar as avatar, 0 AS nbLikes, 0 AS isLiked FROM comments JOIN users ON users.id = comments.user_id WHERE comments.post_id = ? ORDER BY comments.id DESC ) as commentsBis`;
    let values = [user.id, post_id, post_id];
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
