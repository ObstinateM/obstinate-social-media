const { StatusCodes } = require('http-status-codes');
const { Connect, safeQuery } = require('../../../utils/db');

const getAllPosts = (req, res) => {
    let query =
        'SELECT posts.*, users.name as author, users.avatar as avatar, (SELECT COUNT(*) FROM post_like WHERE post_id = posts.id) AS nbLikes, (SELECT COUNT(*) FROM post_like WHERE post_id = posts.id AND user_id = ?) as isLiked FROM posts LEFT JOIN users ON id_user = users.id ORDER BY posts.id DESC LIMIT 30;';
    let values = [res.locals.jwt.id];
    Connect()
        .then(connection => {
            safeQuery(connection, query, values)
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
