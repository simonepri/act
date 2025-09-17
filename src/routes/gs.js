import {Buffer} from 'node:buffer';
import {google} from 'googleapis';
import validURL from 'valid-url';
import {UAParser} from 'ua-parser-js';
import init from '../init/index.js';

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
  const ua = new UAParser(request.headers['user-agent']).getResult();
  values.de = ua.device.type || 'desktop';
  values.os = ua.os.name;
  values.br = ua.browser.name;
  values.ct = request.headers['x-vercel-ip-city'];
  values.rn = request.headers['x-vercel-ip-country-region'];
  values.co = request.headers['x-vercel-ip-country'];

  const row = ['ts', 'de', 'os', 'br', 'ct', 'rn', 'co', 'ac', 're'].map(
    (col) => values[col],
  );

  const sheets = google.sheets({version: 'v4', auth: configs.auths.googleapi});
  try {
    const options = {
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
