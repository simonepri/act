import {google} from 'googleapis';

const initGoogleAPI = async (options) => {
  const jwtClient = new google.auth.JWT({
    email: options.email,
    key: options.key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  await jwtClient.authorize();

  return jwtClient;
};

export default initGoogleAPI;
