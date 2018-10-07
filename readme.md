<p align="center">
  <a href="https://act.now.sh">
    <img src="./media/logo.png" height="120" alt="Multi-purpose URI tracker"/>
  </a>
</p>
<p align="center">
  <!-- License - MIT -->
  <a href="https://github.com/simonepri/act#license">
    <img src="https://img.shields.io/github/license/simonepri/act.svg" alt="Project license" />
  </a>
</p>
<br />
<p align="center">
  ✏️ Multi-purpose URI tracker.
</p>
<p align="center">
  <sub>
    Coded with ❤️ by <a href="#authors">Simone Primarosa</a>.
  </sub>
</p>
<br/>

## Synopsis
Act is an API service that allows you to track user actions. An action is either a page/email view or a click on a link.  
Each time a request is made to act, it automatically collects the timestamp, the operating system, the browser, the city, the region, and the country from where the request comes and then the data are written to the cloud storage of your choice and no data is stored on our side.  
Currently, the only storage type supported is Google Sheets!

## Google Sheets

### Setup
<img width="400" src="./media/gs.gif" />

1 - Open [Google Sheets][storage:gs].<br/>
2 - Create a new blank document.<br/>
3 - Share the document with [access@act-uri-tracker.iam.gserviceaccount.com][storage:gs-email].<br/>
4 - Copy the spreadsheet id from the URL bar.<br/>
5 - Use the spreadsheet id to make requests to act as shown below.<br/>

### Track views
Insert this image inside the page you want to track substituting `<SpreadsheetId>` and `<PageName>` with the appropriate values.
```bash
<img src="https://act.now.sh/gs/<SpreadsheetId>?a=<PageName>" />
```
**Example:**<br/>
Each time you [see this image](https://act.now.sh/gs/1gBD3pJ9LeJdZM1SyvRD7v077pkItVHl4laWhGeW93sE?a=Example 1) a new row is added at the end of [this spreadsheet](https://docs.google.com/spreadsheets/d/1gBD3pJ9LeJdZM1SyvRD7v077pkItVHl4laWhGeW93sE).

### Track clicks
Insert this inside the page substituting `<SpreadsheetId>`, `<ActionName>`, and `<LinkToTrack>` with the appropriate values.
```bash
<a href="https://act.now.sh/gs/<SpreadsheetId>?a=<ActionName>&r=<LinkToTrack>" />
```

**Example:**<br/>
Each time you [click here](https://act.now.sh/gs/1gBD3pJ9LeJdZM1SyvRD7v077pkItVHl4laWhGeW93sE?a=Example 2&r=https://github.com/simonepri/act) a new row is added at the end of [this spreadsheet](https://docs.google.com/spreadsheets/d/1gBD3pJ9LeJdZM1SyvRD7v077pkItVHl4laWhGeW93sE).

### API

METHOD | URL | RESPONSE | BEHAVIOUR
-------|-----|----------|----------
GET | `https://act.now.sh/gs/<SpreadsheetId>` | A 1x1 transparent png image. | A new line is appended to the spreadsheet.
GET | `https://act.now.sh/gs/<SpreadsheetId>?a=<data>` | A 1x1 transparent png image. | A new line is appended to the spreadsheet.
GET | `https://act.now.sh/gs/<SpreadsheetId>?r=<uri>` | A 302 redirect to the uri. | A new line is appended to the spreadsheet.
GET | `https://act.now.sh/gs/<SpreadsheetId>?a=<data>&r=<uri>` | A 302 redirect to the uri. | A new line is appended to the spreadsheet.

## Other storage
Currently, act supports only Google Sheets, but contributions to extend its capabilities are welcome.

## Development
If you want to run it locally, you need to run the following commands.

```bash
git clone https://github.com/simonepri/act.git
cd act

npm i
npm start
```

## Authors
- **Simone Primarosa** - *Github* ([@simonepri][github:simonepri]) • *Twitter* ([@simoneprimarosa][twitter:simoneprimarosa])

See also the list of [contributors][contributors] who participated in this project.

## License
This project is licensed under the MIT License - see the [license][license] file for details.


<!-- Links -->
[contributors]: https://github.com/simonepri/act/contributors

[license]: https://github.com/simonepri/act/tree/master/license
[contributing]: https://github.com/simonepri/act/tree/master/.github/contributing.md

[github:simonepri]: https://github.com/simonepri
[twitter:simoneprimarosa]: http://twitter.com/intent/user?screen_name=simoneprimarosa

[storage:gs]: https://docs.google.com/spreadsheets/
[storage:gs-email]: mailto:access@act-uri-tracker.iam.gserviceaccount.com
