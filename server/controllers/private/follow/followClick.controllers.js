const { Connect, MultipleQuery, EndConnection } = require('../../../utils/db');

const followClick = async (req, res) => {
    try {
        const { follow } = req.body;
        const user = res.locals.jwt;
        const connection = await Connect();
        const isFollowing = await MultipleQuery(
            connection,
            `SELECT COUNT(*) FROM follow WHERE follower = ? AND following = ?`,
            [user.id, follow]
        );
        if (isFollowing[0]['COUNT(*)'] === 0) {
            await MultipleQuery(connection, `INSERT INTO follow (follower, following) VALUES (?, ?)`, [
                user.id,
                follow
            ]);
        } else {
            await MultipleQuery(connection, `DELETE FROM follow WHERE follower = ? AND following = ?`, [
                user.id,
                follow
            ]);
        }
        EndConnection(connection);
        res.status(200).json({ message: 'Done.' });
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: 'Error when followClick' });
    }
};

module.exports = followClick;
