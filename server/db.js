const { createConnection } = require('mysql');
const dotenv = require('dotenv').config();

const option = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'social',
    port: '8889'
};

if (!process.env.PRODUCTION) {
    option.socket = '/Applications/MAMP/tmp/mysql/mysql.sock';
}

const database = createConnection(option);
database.connect(err => {
    if (err) console.log(err);
});

module.exports = database;
