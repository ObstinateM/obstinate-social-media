const multer = require('multer');
const path = require('path');
const { Connect, safeQuery } = require('../utils/db');
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/images'));
    },
    filename: async (req, file, cb) => {
        const filename = uuidv4() + path.extname(file.originalname);
        console.log(filename);
        try {
            const connection = await Connect();
            await safeQuery(connection, 'UPDATE users SET avatar = ? WHERE id = ?', [
                String(`${process.env.API_URL}/images/` + filename),
                req.jwt.id
            ]);
            cb(null, filename);
        } catch (err) {
            console.log(err);
            cb(new Error('Server Error'), null);
        }
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        // This is a very basic check, watch out in production
        if (file.mimetype.startsWith('image')) {
            cb(null, true);
        } else {
            cb(new Error('This is not an image.'));
        }
    }
});

module.exports = { upload };
