const { Connect, safeQuery } = require('../../../utils/db');

const updateBio = async (req, res) => {
    try {
        const connection = await Connect();
        await safeQuery(connection, 'UPDATE users SET bio = ? WHERE id = ?', [req.body.bio, res.locals.jwt.id]);
        res.status(200).json({ message: 'bio updated.' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error updating bio.' });
    }
};

module.exports = updateBio;
