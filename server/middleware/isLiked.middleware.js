require('dotenv').config();
const { StatusCodes } = require('http-status-codes');
const { Connect, safeQuery } = require('../utils/db');
const logIsLiked = require('debug')('comment:isLiked');

const isLiked = (req, res, next) => {
    const { post_id } = req.body;
    const user = res.locals.jwt;
    logIsLiked(`Does ${user.id} : ${user.name} have liked the post (${post_id})`);
    let query = `SELECT COUNT(*) as isLiked FROM post_like WHERE post_id = ? AND user_id = ?;`;
    let values = [post_id, user.id];
    Connect()
        .then(connection => {
            safeQuery(connection, query, values)
                .then(result => {
                    res.locals.isLiked = result[0].isLiked;
                    logIsLiked(
                        `${user.id}:${user.name} has ${res.locals.isLiked} liked (or not 0/1) the post (${post_id}`
                    );
                    next();
                })
                .catch(error => {
                    logIsLiked(`Failed: ${error.message}`);
                    return res
                        .status(StatusCodes.INTERNAL_SERVER_ERROR)
                        .json({ message: 'Server error. Please retry.' });
                });
        })
        .catch(error => {
            logIsLiked(`Failed: ${error.message}`);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server error. Please retry.' });
        });
};

module.exports = isLiked;
