require('dotenv').config();
const { StatusCodes } = require('http-status-codes');
const { Connect, safeQuery } = require('../utils/db');
const logIsOwner = require('debug')('comment:isOwner');

const isCommentOwner = (req, res, next) => {
    const { comment_id } = req.body;
    const user = res.locals.jwt;
    logIsOwner(`Is ${user.id} : ${user.name} author of the comment (${comment_id})`);
    let query = `SELECT user_id FROM comments WHERE ?;`;
    let values = { id: comment_id };
    Connect()
        .then(connection => {
            safeQuery(connection, query, values)
                .then(result => {
                    if (result[0].user_id === user.id) {
                        logIsOwner(`${user.id}:${user.name} is the author of the comment (${comment_id}`);
                        next();
                    } else {
                        logIsOwner(
                            `Rejected: ${user.id} : ${user.name} is not the author of the comment (${comment_id}`
                        );
                        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'This is not your comment' });
                    }
                })
                .catch(error => {
                    logIsOwner(`Failed: ${error.message}`);
                    return res
                        .status(StatusCodes.INTERNAL_SERVER_ERROR)
                        .json({ message: 'Server error. Please retry.' });
                });
        })
        .catch(error => {
            logIsOwner(`Failed: ${error.message}`);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server error. Please retry.' });
        });
};

module.exports = isCommentOwner;
