const pify = require('pify');
const {google} = require('googleapis');

module.exports = async configs => {
  const jwtClient = new google.auth.JWT(
    configs.credentials.googleapi.email,
    null,
    configs.credentials.googleapi.key,
    ['https://www.googleapis.com/auth/spreadsheets']
  );

  try {
    await pify(jwtClient.authorize);
  } catch (error) {
    throw error;
  }

  return jwtClient;
};
