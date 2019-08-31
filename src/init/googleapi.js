const pify = require('pify');
const {google} = require('googleapis');

module.exports = async options => {
  const jwtClient = new google.auth.JWT(
    options.email,
    null,
    options.key,
    ['https://www.googleapis.com/auth/spreadsheets']
  );

  try {
    await pify(jwtClient.authorize);
  } catch (error) {
    throw error;
  }

  return jwtClient;
};
