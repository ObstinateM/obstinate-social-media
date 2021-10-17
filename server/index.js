// Depedencies
const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const helmet = require('helmet');

// Routes
const { exampleRouter } = require('./routes/example.routes');

app.use(
    cors({
        origin: 'localhost:3000'
    })
);
app.use(helmet());
// Local example
app.use('/api/example', exampleRouter);

// Server Start
app.listen(process.env.PORT || 3001, () => {
    console.log('Server started...');
});
