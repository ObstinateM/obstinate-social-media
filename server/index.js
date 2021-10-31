// Depedencies
require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

// Routes import
const { authRouter } = require('./routes/auth.routes');
const { postsRouter } = require('./routes/posts.routes');
const { userRouter } = require('./routes/user.routes');

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
app.use('/api/auth/', authRouter);
app.use('/api/private/posts/', postsRouter);
app.use('/api/public/user/', userRouter);

// Server Start
app.listen(process.env.PORT || 3001, () => {
    console.log('Server started...');
});
