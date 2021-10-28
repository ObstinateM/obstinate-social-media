const database = require('./db');
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
