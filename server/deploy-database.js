require('dotenv').config();
const mysql = require('mysql');

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

const database = mysql.createConnection(option);

const request = [
    'CREATE TABLE users(id INT PRIMARY KEY, name VARCHAR(25) NOT NULL, email VARCHAR(50) NOT NULL, password VARCHAR(50) NOT NULL, avatar TEXT, bio VARCHAR(255));',
    'CREATE TABLE refreshToken(INT PRIMARY KEY, refreshToken VARCHAR(255));',
    'CREATE TABLE posts(id INT PRIMARY KEY, id_user INT, content TEXT, image TEXT, FOREIGN KEY (id_user) REFERENCES users(id))'
];

request.forEach(element =>
    database.query(element, error => {
        error ? console.log(error) : console.log('Table created');
    })
);

database.end();
