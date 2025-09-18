import process from 'node:process';
import {Buffer} from 'node:buffer';
import {google} from 'googleapis';
import validURL from 'valid-url';
import {UAParser} from 'ua-parser-js';
import {waitUntil} from '@vercel/functions';

const pixel = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNiYAAAAAkAAxkR2eQAAAAASUVORK5CYII=',
  'base64',
);

const auth = new google.auth.GoogleAuth({
  credentials: {
    /* eslint-disable camelcase */
    client_email: process.env.GOOGLEAPI_CLIENT_EMAIL,
    private_key: process.env.GOOGLEAPI_PRIVATE_KEY,
    /* eslint-enable camelcase */
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({version: 'v4', auth});

const gsRoute = (request, response) => {
  const redirectUrl = request.query.r || '';
  const encodedUrl = encodeURI(redirectUrl);

  if (validURL.isUri(encodedUrl)) {
    response.writeHead(302, {Location: encodedUrl}).end();
  } else {
    response.writeHead(200, {'Content-Type': 'image/png'}).end(pixel);
  }

  const ua = new UAParser(request.headers['user-agent']).getResult();

  const row = [
    /* Timestamp */ new Date().toISOString(),
    /* Device */ ua.device.type || 'desktop',
    /* OS */ ua.os.name || '',
    /* Browser */ ua.browser.name || '',
    /* City */ request.headers['x-vercel-ip-city'] || '',
    /* Region */ request.headers['x-vercel-ip-country-region'] || '',
    /* Country */ request.headers['x-vercel-ip-country'] || '',
    /* Action Name */ request.query.a || '',
    /* Redirect URL */ redirectUrl,
  ];
  /* eslint-disable promise/prefer-await-to-then */
  waitUntil(
    sheets.spreadsheets.values
      .append({
        spreadsheetId: request.query.id,
        range: 'A2',
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        resource: {values: [row]},
      })
      .catch((error) => {
        if (!['INVALID_ARGUMENT', 'NOT_FOUND'].includes(error.status)) {
          console.error(error);
        }
      }),
  );
  /* eslint-enable promise/prefer-await-to-then */
};

export default gsRoute;
