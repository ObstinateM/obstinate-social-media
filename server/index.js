const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

app.use(
    cors({
        origin: 'http://localhost:3000'
    })
);

app.get('/', (req, res) => {
    res.json({'test':'test'});
});

// Server Start
app.listen(process.env.PORT || 3001, () => {
    console.log('Server started...');
});