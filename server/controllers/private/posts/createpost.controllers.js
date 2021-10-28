const { StatusCodes } = require('http-status-codes');
const { Connect, Query } = require('../../../utils/db');

const createpost = (req, res) => {
    const { content, image } = req.body;
    const user = res.locals.jwt;
    console.log(content, image, user);
    let query = image
        ? `INSERT INTO posts(id_user, content, image) VALUES (${user.id}, '${content}', '${image}');`
        : `INSERT INTO posts(id_user, content) VALUES (${user.id}, '${content}');`;
    Connect()
        .then(connection => {
            Query(connection, query)
                .then(result => {
                    res.status(StatusCodes.CREATED).json({ message: 'Post created.', result });
                })
                .catch(err => {
                    console.log('Query error', err);
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Cant create the post', err });
                });
        })
        .catch(err => {
            console.log('Connect error', err);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Cant create the post', err });
        });
};

module.exports = createpost;
