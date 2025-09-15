import {Buffer} from 'node:buffer';
import {google} from 'googleapis';
import validURL from 'valid-url';
import iplocation from 'iplocation';
import uaparser from 'ua-parser-js';
import device from 'device';
import init from '../init/index.js';

const sheets = google.sheets('v4');

const pixel = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNiYAAAAAkAAxkR2eQAAAAASUVORK5CYII=',
  'base64',
);

const gsRoute = async (request, response) => {
  const configs = await init();

  const values = {};
  values.ac = request.query.a;
  values.re = request.query.r;
  values.ts = new Date().toISOString();
  const ua = uaparser(request.headers['user-agent']);
  values.de = device(request.headers['user-agent']).type;
  values.os = ua.os.name;
  values.br = ua.browser.name;
  try {
    const ip =
      request.headers['x-real-ip'] ||
      request.headers['x-forwarded-for'] ||
      request.raw.ip;
    const locationData = await iplocation(ip);
    values.ct = locationData.city;
    values.rn = locationData.region;
    values.co = locationData.country;
  } catch (error) {
    console.error(error);
  }

  const row = ['ts', 'de', 'os', 'br', 'ct', 'rn', 'co', 'ac', 're'].map(
    (col) => values[col],
  );

  try {
    const options = {
      auth: configs.auths.googleapi,
      spreadsheetId: request.query.id,
      range: 'A2',
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      resource: {values: [row]},
    };
    await sheets.spreadsheets.values.append(options);
  } catch (error) {
    if (!['INVALID_ARGUMENT', 'NOT_FOUND'].includes(error.status)) {
      console.error(error);
    }
  }

  const euri = encodeURI(request.query.r);
  if (validURL.isUri(euri)) {
    // Redirect
    response.statusCode = 302;
    response.setHeader('Location', euri);
    response.end();
  } else {
    // Show pixel
    response.statusCode = 200;
    response.setHeader('content-type', 'image/png');
    response.end(pixel);
  }
};

export default gsRoute;
