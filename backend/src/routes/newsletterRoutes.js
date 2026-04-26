const express = require('express');
const router = express.Router();
const { handleSubscribe, handleUnsubscribe, handleGetAllSubscribers } = require('../controllers/newsletterController');
const verifyJwt = require('../middlewares/verifyJwt');
const verifyRoles = require('../middlewares/verifyRoles');

// Public
router.post('/subscribe', handleSubscribe);
router.post('/unsubscribe', handleUnsubscribe);

// Admin only
router.get('/', verifyJwt, verifyRoles('Admin', 'superadmin', 'manager'), handleGetAllSubscribers);

module.exports = router;
