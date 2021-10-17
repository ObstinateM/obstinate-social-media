const mysql = require('mysql');
const dotenv = require('dotenv').config();

const option = {
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DATABASE,
    port: process.env.SQL_PORT
};

if (!process.env.PRODUCTION) {
    option.socket = '/Applications/MAMP/tmp/mysql/mysql.sock';
}

const Connect = async () => {
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection(option);

        connection.connect(error => {
            if (error) {
                reject(error);
                return;
            }
            resolve(connection);
        });
    });
};

const Query = async (connection, query) => {
    return new Promise((resolve, reject) => {
        connection.query(query, connection, (error, result) => {
            if (error) {
                reject(error);
                return;
            }

            resolve(result);
            connection.end();
        });
    });
};

// const database = createConnection(option);
// database.connect(err => {
//     if (err) console.log(err);
// });

module.exports = { Connect, Query };
