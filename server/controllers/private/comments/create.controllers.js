const { StatusCodes } = require('http-status-codes');
const { Connect, safeQuery } = require('../../../utils/db');
const logCreate = require('debug')('comment:create');

const createComment = (req, res) => {
    const user = res.locals.jwt;
    const { post_id, content } = req.body;
    logCreate(`${user.id} : ${user.name} is trying to create a new comment`);
    let query = `INSERT INTO comments SET ?;`;
    let values = {
        user_id: user.id,
        post_id,
        content
    };
    Connect()
        .then(connection => {
            safeQuery(connection, query, values)
                .then(result => {
                    logCreate('Success: Comment created');
                    res.status(StatusCodes.CREATED).json({ message: 'Post created.', result });
                })
                .catch(err => {
                    logCreate(`Failed: ${err.message}`);
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Cant create the comment', err });
                });
        })
        .catch(err => {
            logCreate(`Failed: ${err.message}`);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Cant create the comment', err });
        });
};

module.exports = createComment;
