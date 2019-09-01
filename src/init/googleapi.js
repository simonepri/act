const {google} = require('googleapis');

module.exports = async options => {
  const scopes = ['https://www.googleapis.com/auth/spreadsheets'];
  const jwtClient = new google.auth.JWT(
    options.email,
    null,
    options.key,
    scopes
  );

  try {
    await jwtClient.authorize();
  } catch (error) {
    throw error;
  }

  return jwtClient;
};
