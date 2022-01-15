const { Connect, safeQuery } = require('../../../utils/db');

const isFollowing = async (req, res) => {
    try {
        const { follow } = req.query;
        const user = res.locals.jwt;
        const connection = await Connect();
        const isFollowing = await safeQuery(
            connection,
            `SELECT COUNT(*) FROM follow WHERE follower = ? AND following = ?`,
            [user.id, follow]
        );
        res.status(200).json({ isFollowing: isFollowing[0]['COUNT(*)'] });
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: 'Error when loading isFollowing' });
    }
};

module.exports = isFollowing;
