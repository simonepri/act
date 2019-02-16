const {google} = require('googleapis');
const validURL = require('valid-url');
const iplocation = require('iplocation').default;
const uaparser = require('ua-parser-js');
const device = require('device');

const sheets = google.sheets('v4');

const pixel = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNiYAAAAAkAAxkR2eQAAAAASUVORK5CYII=', 'base64');

module.exports = configs => {
  return async (request, reply) => {
    const params = request.params;
    const query = request.query;

    const euri = encodeURI(query.r);
    if (validURL.isUri(euri)) {
      reply.redirect(euri);
    } else {
      reply.code(200).type('image/png').send(pixel);
    }

    const values = {};
    values.ac = query.a;
    values.re = query.r;
    values.ts = new Date().toISOString();
    const ua = uaparser(request.headers['user-agent']);
    values.de = device(request.headers['user-agent']).type;
    values.os = ua.os.name;
    values.br = ua.browser.name;
    try {
      const ip = request.headers['x-real-ip'] || request.headers['x-forwarded-for'] || request.raw.ip;
      request.log.info(ip);
      const res = await iplocation(ip);
      values.ct = res.city;
      values.rn = res.region;
      values.co = res.country_name;
    } catch (error) {
      request.log.error(error);
    }

    const row = ['ts', 'de', 'os', 'br', 'ct', 'rn', 'co', 'ac', 're'].map(col => values[col]);

    try {
      const options = {
        auth: configs.auths.googleapi,
        spreadsheetId: params.id,
        range: 'A2',
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        resource: {values: [row]}
      };
      await new Promise((resolve, reject) => {
        sheets.spreadsheets.values.append(options, (err, res) => err ? reject(err) : resolve(res));
      });
    } catch (error) {
      if (!['INVALID_ARGUMENT', 'NOT_FOUND'].includes(error.status)) {
        request.log.error(error);
      }
    }
  };
};
