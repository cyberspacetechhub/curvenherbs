const express = require('express');
const router = express.Router();
const { handleUploadImage, handleDeleteImage } = require('../controllers/uploadController');
const verifyJwt = require('../middlewares/verifyJwt');
const verifyRoles = require('../middlewares/verifyRoles');
const upload = require('../config/multer');

router.use(verifyJwt, verifyRoles('Admin', 'superadmin', 'manager'));
router.post('/', upload.single('image'), handleUploadImage);
router.delete('/', handleDeleteImage);

module.exports = router;
