const { StatusCodes } = require('http-status-codes');
const { Connect, Query } = require('../utils/db');
require('dotenv').config();

const isPostOwner = (req, res, next) => {
    console.log('BODY : ', req.body);
    const { post_id } = req.body;
    const user = res.locals.jwt;
    let query = `SELECT id_user FROM posts WHERE id = ${post_id};`;
    Connect()
        .then(connection => {
            Query(connection, query)
                .then(result => {
                    console.log(user.name, result[0].id_user, user.id, result[0].id_user === user.id);
                    if (result[0].id_user === user.id) {
                        next();
                    } else {
                        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'This is not your post' });
                    }
                })
                .catch(error => {
                    console.log(error);
                    return res
                        .status(StatusCodes.INTERNAL_SERVER_ERROR)
                        .json({ message: 'Server error. Please retry.' });
                });
        })
        .catch(error => {
            console.log(error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server error. Please retry.' });
        });
};

module.exports = isPostOwner;
