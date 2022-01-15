const { upload } = require('../../../middleware/upload');

const uploadImage = (req, res) => {
    console.log('Image ', req.files);
    upload.single('avatar')(req, res, err => {
        console.log('Upload error: ' + err);
        if (err) res.status(500).json({ message: 'Error uploading file.' });
        else {
            console.log(req.files);
            res.status(200).json({ message: 'image uploaded.' });
        }
    });
};

module.exports = uploadImage;
