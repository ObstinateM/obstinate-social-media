const { StatusCodes } = require('http-status-codes');
const { Connect, safeQuery } = require('../../../utils/db');
const logCreate = require('debug')('post:create');

const createpost = (req, res) => {
    const user = res.locals.jwt;
    const { content, image } = req.body;
    logCreate(`${user.id} : ${user.name} is trying to create a new post`);
    let query = image
        ? `INSERT INTO posts(id_user, content, image) VALUES (?, ?, ?);`
        : `INSERT INTO posts(id_user, content) VALUES (?, ?);`;
    let values = image ? [user.id, content, image] : [user.id, content];
    Connect()
        .then(connection => {
            safeQuery(connection, query, values)
                .then(result => {
                    logCreate('Success: Post created');
                    res.status(StatusCodes.CREATED).json({ message: 'Post created.', result });
                })
                .catch(err => {
                    logCreate(`Failed: ${err.message}`);
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Cant create the post', err });
                });
        })
        .catch(err => {
            logCreate(`Failed: ${err.message}`);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Cant create the post', err });
        });
};

module.exports = createpost;
