const { Connect, MultipleQuery } = require('../../../utils/db');
const logCreate = require('debug')('chat:createroom');

const createroom = async (req, res) => {
    try {
        const connection = await Connect();
        // TODO_LATER: Verify if the room already exist

        // Create the room
        const user = res.locals.jwt;
        const userList = req.body.users;
        userList.push(user.id);
        logCreate(`${user.id} : ${user.name} is trying to create a new room`);
        const getUsersName = await MultipleQuery(connection, 'SELECT name FROM users WHERE id IN (?)', [userList]);
        const roomName = getUsersName.map(user => user.name).join(', ');
        await MultipleQuery(connection, 'INSERT INTO rooms (name) VALUES (?)', [roomName]);
        const roomId = await MultipleQuery(connection, 'SELECT id FROM rooms WHERE name = ?', [roomName]);
        userList.forEach(async user => {
            await MultipleQuery(connection, 'INSERT INTO room_user (room_id, user_id) VALUES (?, ?)', [
                roomId[0].id,
                user
            ]);
        });
        logCreate(`Room created with id ${roomId[0].id}`);
        res.status(200).json({
            message: 'Room created',
            roomId: roomId[0].id
        });
    } catch (err) {
        logCreate(err);
        res.status(400).json({ message: 'Failed to create room' });
    }
};

module.exports = createroom;
