const multer = require('multer');
const uploadConfig = require('../config/uploadConfig');

const upload = multer(uploadConfig);

module.exports = upload;