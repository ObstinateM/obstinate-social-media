const { Connect, Query } = require('../../../utils/db');

const getAllUsers = async (req, res) => {
    try {
        let query = `SELECT id, name FROM users`;
        let connection = await Connect();
        let _query = await Query(connection, query);
        res.status(200).json(_query);
    } catch (err) {
        res.status(400).json({ message: 'Error in loading users' });
    }
};

module.exports = getAllUsers;
