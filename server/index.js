// Depedencies
require('dotenv').config();
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const logServer = require('debug')('server');
const { extractJWT, extractJWTfunction } = require('./middleware/extractJWT.middleware');
const { Server } = require('socket.io');
const { Connect, safeQuery } = require('./utils/db');
const { v4: uuidv4 } = require('uuid');

// Routes import
const { authRouter } = require('./routes/auth.routes');
const { userRouter } = require('./routes/user.routes');
const { postsRouter } = require('./routes/posts.routes');
const { commentsRouter } = require('./routes/comments.routes');
const { chatRouter } = require('./routes/chat.routes');

//middleware
app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true
    })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet());
app.use(cookieParser());

// Routes
// Public routes
app.use('/api/auth/', authRouter);
app.use('/api/public/user/', userRouter);

// Private routes
app.use('/api/private/posts/', extractJWT, postsRouter);
app.use('/api/private/comments/', extractJWT, commentsRouter);
app.use('/api/private/chat/', extractJWT, chatRouter);

// Server Start
server.listen(process.env.PORT || 3001, () => {
    logServer(`Server started. Available at http://localhost:${process.env.PORT || 3001}/`);
});

// Socket endpoint
const userRoom = {};

io.on('connection', socket => {
    console.log('New client connected');

    socket.on('room-join', async ({ accessToken, roomId }) => {
        try {
            const user = await extractJWTfunction(accessToken); // Decode le token pour avoir l'user
            const query = roomId
                ? 'SELECT COUNT(*) as canJoin FROM room_user WHERE room_id = ? AND user_id = ?'
                : 'SELECT room_id FROM room_user WHERE user_id = ? LIMIT 1';
            const value = roomId ? [roomId, user.id] : [user.id];
            // Vérife s'il peut join la room avec l'access et la bdd + Load les anciens messages ?
            const connection = await Connect();
            const _query = await safeQuery(connection, query, value);
            if (roomId) {
                if (!_query[0].canJoin) return socket.emit('error', 'You can not join this room');
                if (!userRoom[user.id]) userRoom[user.id] = [];
                userRoom[user.id].push(roomId);
                socket.join(roomId);
                console.log('Room joined');
                socket.emit('room-join', roomId);
            } else {
                // Default room joined if no one is provided
                socket.join(_query[0].room_id);
                if (!userRoom[user.id]) userRoom[user.id] = [];
                userRoom[user.id].push(_query[0].room_id);
                console.log('Default room joined');
                socket.emit('room-join', _query[0].room_id);
            }
        } catch (error) {
            console.log(error);
            socket.emit('error', 'Error in loading the chat');
        }
    });

    socket.on('getAllMessages', async ({ accessToken, roomId }) => {
        try {
            const user = await extractJWTfunction(accessToken); // Decode le token pour avoir l'user
            const query =
                'SELECT messages.*, users.name, users.avatar FROM messages JOIN users ON messages.user_id = users.id WHERE room_id = ?';
            const value = [roomId];
            const connection = await Connect();
            const _query = await safeQuery(connection, query, value);
            socket.emit('getAllMessages', _query);
        } catch (error) {
            console.log(error);
            socket.emit('error', 'Error in loading chat messages');
        }
    });

    socket.on('message', async ({ accessToken, roomId, content }) => {
        // Ajouter le MSG à la BDD et renvoyé le message à tous les membres de la room
        try {
            const user = await extractJWTfunction(accessToken); // Decode le token pour avoir l'user
            if (userRoom[user.id].includes(roomId)) {
                const query = 'INSERT INTO messages (user_id, room_id, content, timestamp) VALUES (?, ?, ?, ?)';
                const timestamp = new Date().toDateString();
                const value = [user.id, roomId, content, timestamp];
                const connection = await Connect();
                const _query = await safeQuery(connection, query, value);
                io.to(roomId).emit('message', {
                    id: uuidv4(),
                    user_id: user.id,
                    name: user.name,
                    avatar: user.avatar,
                    content,
                    timestamp
                });
            } else {
                socket.emit('error', 'You can not send message in this room');
            }
        } catch (error) {
            console.log(error);
            socket.emit('error', 'Failed to send message');
        }
    });

    socket.on('userList', async ({ accessToken, roomId }) => {
        try {
            const user = await extractJWTfunction(accessToken); // Decode le token pour avoir l'user
            if (userRoom[user.id].includes(roomId)) {
                const query =
                    'SELECT users.name FROM users JOIN room_user ON users.id = room_user.user_id WHERE room_id = ?';
                const value = [roomId];
                const connection = await Connect();
                const _query = await safeQuery(connection, query, value);
                socket.emit('userList', _query);
            }
        } catch (error) {
            console.log(error);
            socket.emit('error', 'Cant load chatbox title');
        }
    });

    socket.on('getRooms', async ({ accessToken }) => {
        try {
            const user = await extractJWTfunction(accessToken); // Decode le token pour avoir l'user
            const query =
                'SELECT room_user.room_id, rooms.name FROM room_user JOIN rooms ON room_user.room_id = rooms.id WHERE room_user.user_id = ?';
            const value = [user.id];
            const connection = await Connect();
            const _query = await safeQuery(connection, query, value);
            socket.emit('getRooms', _query);
        } catch (error) {
            console.log(error);
            socket.emit('error', 'Cant load chatbox nav');
        }
    });
});
