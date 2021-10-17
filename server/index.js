// Depedencies
const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const helmet = require('helmet');

// Routes import
const { exampleRouter } = require('./routes/example.routes');
const { authRouter } = require('./routes/auth.routes');

//middleware
app.use(
    cors({
        origin: 'localhost:3000'
    })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet());

// Routes
app.use('/api/auth/', authRouter);

// Server Start
app.listen(process.env.PORT || 3001, () => {
    console.log('Server started...');
});
