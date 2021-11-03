const { StatusCodes } = require('http-status-codes');
const { Connect, safeQuery } = require('../../../utils/db');
const logDelete = require('debug')('comment:delete');

const createcomment = (req, res) => {
    const { comment_id } = req.body;
    const user = res.locals.jwt;
    logDelete(`${user.name} is trying to delete a comment (${comment_id})`);
    let query = `DELETE FROM comments WHERE user_id = ? AND id = ?`;
    let values = [user.id, comment_id];
    Connect()
        .then(connection => {
            safeQuery(connection, query, values)
                .then(result => {
                    logDelete('Success: comment has been deleted');
                    res.status(StatusCodes.ACCEPTED).json({ message: 'comment deleted.', result });
                })
                .catch(err => {
                    logDelete(`Failed: ${err.message}`);
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Cant create the comment', err });
                });
        })
        .catch(err => {
            logDelete(`Failed: ${err.message}`);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Cant create the comment', err });
        });
};

module.exports = createcomment;
