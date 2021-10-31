const { StatusCodes } = require('http-status-codes');
const { Connect, Query } = require('../../../utils/db');

const createpost = (req, res) => {
    const { post_id } = req.body;
    const user = res.locals.jwt;
    let query = `DELETE FROM posts WHERE id_user = ${user.id} AND id = ${post_id}`;
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
