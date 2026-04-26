const express = require('express');
const router = express.Router();
const { getCountries, getStates, getCities } = require('../controllers/locationController');

router.get('/countries', getCountries);
router.get('/countries/:countryCode/states', getStates);
router.get('/countries/:countryCode/states/:stateCode/cities', getCities);

module.exports = router;
