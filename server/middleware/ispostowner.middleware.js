require('dotenv').config();
const { StatusCodes } = require('http-status-codes');
const { Connect, Query } = require('../utils/db');
const logIsOwner = require('debug')('post:isOwner');

const isPostOwner = (req, res, next) => {
    const { post_id } = req.body;
    const user = res.locals.jwt;
    logIsOwner(`Is ${user.id} : ${user.name} author of the post (${post_id})`);
    let query = `SELECT id_user FROM posts WHERE id = ${post_id};`;
    Connect()
        .then(connection => {
            Query(connection, query)
                .then(result => {
                    if (result[0].id_user === user.id) {
                        logIsOwner(`${user.id}:${user.name} is the author of the post (${post_id}`);
                        next();
                    } else {
                        logIsOwner(`Rejected: ${user.id} : ${user.name} is not the author of the post (${post_id}`);
                        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'This is not your post' });
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

module.exports = isPostOwner;
