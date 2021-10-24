const { Connect, Query } = require('./db');

const doesEmailExist = email => {
    return new Promise((resolve, reject) => {
        let query = `SELECT COUNT(id) as nb FROM users WHERE email = '${email}'`;
        Connect()
            .then(connection => {
                console.log('ttttttt');
                Query(connection, query)
                    .then(result => {
                        if (result[0].nb > 0) {
                            reject();
                        } else {
                            resolve();
                        }
                    })
                    .catch(() => reject());
            })
            .catch(() => reject());
    });
};

const doesNameExist = name => {
    return new Promise((resolve, reject) => {
        let query = `SELECT COUNT(id) as nb FROM users WHERE name = '${name}'`;
        Connect()
            .then(connection => {
                Query(connection, query)
                    .then(result => {
                        if (result[0].nb > 0) {
                            reject();
                        } else {
                            resolve();
                        }
                    })
                    .catch(() => reject());
            })
            .catch(() => reject());
    });
};

const isNameValid = name => {
    return new Promise((resolve, reject) => {
        resolve();
    });
};

module.exports = {
    doesEmailExist,
    doesNameExist,
    isNameValid
};
