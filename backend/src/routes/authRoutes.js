const express = require('express');
const router = express.Router();
const { handleLogin } = require('../controllers/loginController');
const { handleLogout } = require('../controllers/logoutController');
const { handleRefresh } = require('../controllers/refreshTokenController');

router.post('/login', handleLogin);
router.post('/logout', handleLogout);
router.get('/refresh', handleRefresh);

module.exports = router;
