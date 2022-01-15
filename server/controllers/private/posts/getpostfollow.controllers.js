const { StatusCodes } = require('http-status-codes');
const { Connect, safeQuery } = require('../../../utils/db');

const getAllPosts = (req, res) => {
    let query =
        'SELECT posts.*, users.name AS author, users.avatar AS avatar, ( SELECT COUNT(*) FROM post_like WHERE post_id = posts.id ) AS nbLikes, ( SELECT COUNT(*) FROM post_like WHERE post_id = posts.id AND user_id = ? ) AS isLiked FROM posts LEFT JOIN users ON id_user = users.id WHERE id_user IN ( SELECT following FROM follow WHERE follower = ? ) ORDER BY posts.id DESC LIMIT 30;';
    let values = [res.locals.jwt.id, res.locals.jwt.id];
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
