const { StatusCodes } = require('http-status-codes');
const { Connect, safeQuery } = require('../../../utils/db');
const logLike = require('debug')('post:like');

const like_post = (req, res) => {
    const user = res.locals.jwt;
    const isLiked = res.locals.isLiked;
    const { post_id } = req.body;
    logLike(`${user.id} : ${user.name} is trying like a post (${post_id})`);
    let query = isLiked
        ? `DELETE FROM post_like WHERE user_id = ? AND post_id = ?`
        : `INSERT INTO post_like (user_id, post_id) VALUES (?, ?)`;
    let values = [user.id, post_id];
    Connect()
        .then(connection => {
            safeQuery(connection, query, values)
                .then(result => {
                    logLike(isLiked ? 'Success: Like deleted' : 'Sucess: Post has been liked.');
                    res.status(StatusCodes.CREATED).json({ message: 'Success.', result });
                })
                .catch(err => {
                    logLike(`Failed: ${err.message}`);
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server error, please retry.' });
                });
        })
        .catch(err => {
            logLike(`Failed: ${err.message}`);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server error, please retry.' });
        });
};

module.exports = like_post;
