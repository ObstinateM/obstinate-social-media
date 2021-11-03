// Depedencies
require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const logServer = require('debug')('server');
const extractJWT = require('./middleware/extractJWT.middleware');

// Routes import
const { authRouter } = require('./routes/auth.routes');
const { userRouter } = require('./routes/user.routes');
const { postsRouter } = require('./routes/posts.routes');
const { commentsRouter } = require('./routes/comments.routes');

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

// Server Start
app.listen(process.env.PORT || 3001, () => {
    logServer(`Server started. Available at http://localhost:${process.env.PORT || 3001}/`);
});
