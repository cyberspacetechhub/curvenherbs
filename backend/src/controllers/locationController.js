const { Country, State, City } = require('country-state-city');
const { SUPPORTED_COUNTRY_CODES } = require('../constants/locations');

const getCountries = (req, res) => {
  const countries = SUPPORTED_COUNTRY_CODES.map(code => {
    const country = Country.getCountryByCode(code);
    if (!country) return null;
    return {
      name: country.name,
      code: country.isoCode,
      currency: country.currency,
      phoneCode: country.phonecode,
      flag: country.flag
    };
  }).filter(Boolean);

  res.json({ success: true, data: countries });
};

const getStates = (req, res) => {
  const { countryCode } = req.params;

  if (!SUPPORTED_COUNTRY_CODES.includes(countryCode)) {
    return res.status(400).json({ success: false, message: 'Country not supported' });
  }

  const states = State.getStatesOfCountry(countryCode).map(s => ({
    name: s.name,
    code: s.isoCode
  }));

  res.json({ success: true, data: states });
};

const getCities = (req, res) => {
  const { countryCode, stateCode } = req.params;

  if (!SUPPORTED_COUNTRY_CODES.includes(countryCode)) {
    return res.status(400).json({ success: false, message: 'Country not supported' });
  }

  const cities = City.getCitiesOfState(countryCode, stateCode).map(c => ({
    name: c.name
  }));

  res.json({ success: true, data: cities });
};

module.exports = { getCountries, getStates, getCities };
