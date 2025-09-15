import {google} from 'googleapis';

const initGoogleAPI = async (options) => {
  const scopes = ['https://www.googleapis.com/auth/spreadsheets'];
  const jwtClient = new google.auth.JWT(
    options.email,
    null,
    options.key,
    scopes,
  );

  await jwtClient.authorize();

  return jwtClient;
};

export default initGoogleAPI;
