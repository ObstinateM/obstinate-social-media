const { StatusCodes } = require('http-status-codes');
const { Connect, Query } = require('../../../utils/db');

const getAllPosts = (req, res) => {
    let query =
        'SELECT posts.*, users.name as author, users.avatar as avatar FROM posts JOIN users ON users.id = posts.id_user ORDER BY posts.id DESC LIMIT 30';
    Connect()
        .then(connection => {
            Query(connection, query)
                .then(result => {
                    res.status(StatusCodes.CREATED).json({ message: 'Ok.', posts: result });
                })
                .catch(err => {
                    console.log('GET ALL POSTS : Query error', err);
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error', err });
                });
        })
        .catch(err => {
            console.log('GET ALL POSTS : Connect error', err);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error', err });
        });
};

module.exports = getAllPosts;
