const express = require('express');
const router = express.Router();
const { handleRegister, handleGetProfile, handleUpdateProfile, handleChangePassword } = require('../controllers/userController');
const verifyJwt = require('../middlewares/verifyJwt');

router.post('/register', handleRegister);

router.use(verifyJwt);
router.get('/profile', handleGetProfile);
router.put('/profile', handleUpdateProfile);
router.put('/change-password', handleChangePassword);

module.exports = router;
