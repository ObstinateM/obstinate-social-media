require('dotenv').config();
const mysql = require('mysql');
const log = require('debug')('database');
const logConnect = log.extend('connect');
const logQuery = log.extend('query');

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
    logConnect('Trying to connect to database...');
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection(option);

        connection.connect(error => {
            if (error) {
                logConnect('Failed to connect to database');
                reject(error);
                return;
            }
            logConnect('Successfully connected to database');
            resolve(connection);
        });
    });
};

const Query = async (connection, query) => {
    logQuery('Trying to query %o', query);
    return new Promise((resolve, reject) => {
        connection.query(query, connection, (error, result) => {
            if (error) {
                logQuery('ERROR: %s', error);
                reject(error);
                return;
            }
            logQuery('Successfully queried "%O"', result);
            resolve(result);
            connection.end();
        });
    });
};

const safeQuery = async (connection, query, values) => {
    logQuery('Trying to query %o', query);
    return new Promise((resolve, reject) => {
        connection.query(query, values, (error, result) => {
            if (error) {
                logQuery('ERROR: %s', error);
                reject(error);
                return;
            }
            logQuery('Successfully queried "%O"', result);
            resolve(result);
            connection.end();
        });
    });
};

module.exports = { Connect, Query, safeQuery };
