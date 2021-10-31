const { StatusCodes } = require('http-status-codes');
const { Connect, Query } = require('../../../utils/db');
const logDelete = require('debug')('post:delete');

const createpost = (req, res) => {
    const { post_id } = req.body;
    const user = res.locals.jwt;
    logDelete(`${user.name} is trying to delete a post (${post_id})`);
    let query = `DELETE FROM posts WHERE id_user = ${user.id} AND id = ${post_id}`;
    Connect()
        .then(connection => {
            Query(connection, query)
                .then(result => {
                    logDelete('Success: post has been deleted');
                    res.status(StatusCodes.ACCEPTED).json({ message: 'Post deleted.', result });
                })
                .catch(err => {
                    logDelete(`Failed: ${err.message}`);
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Cant create the post', err });
                });
        })
        .catch(err => {
            logDelete(`Failed: ${err.message}`);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Cant create the post', err });
        });
};

module.exports = createpost;
