const { google } = require('googleapis');
const http = require('http');
const url = require('url');
const opn = require('open');

const CLIENT_ID = 'YOUR_CLIENT_ID';
const CLIENT_SECRET = 'YOUR_CLIENT_SECRET';
const REDIRECT_URI = 'http://localhost:3000/oauthcallback';

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const SCOPES = ['https://www.googleapis.com/auth/calendar'];

const events = [
  {
    summary: 'Manus AI Renewal',
    start: { dateTime: '2026-05-02T00:00:00Z' },
    end: { dateTime: '2026-05-02T23:59:59Z' },
    recurrence: ['RRULE:FREQ=MONTHLY;UNTIL=20261231T235959Z'],
  },
  {
    summary: 'Gemini Pro Renewal',
    start: { dateTime: '2026-05-25T00:00:00Z' },
    end: { dateTime: '2026-05-25T23:59:59Z' },
    recurrence: ['RRULE:FREQ=MONTHLY;UNTIL=20261231T235959Z'],
  },
  {
    summary: 'Perplexity.ai Renewal',
    start: { dateTime: '2026-05-27T00:00:00Z' },
    end: { dateTime: '2026-05-27T23:59:59Z' },
    recurrence: ['RRULE:FREQ=MONTHLY;UNTIL=20261231T235959Z'],
  },
  {
    summary: 'Claude Code Renewal',
    start: { dateTime: '2026-05-28T00:00:00Z' },
    end: { dateTime: '2026-05-28T23:59:59Z' },
    recurrence: ['RRULE:FREQ=MONTHLY;UNTIL=20261231T235959Z'],
  },
  {
    summary: 'Microsoft Word 365 Renewal',
    start: { dateTime: '2027-03-26T00:00:00Z' },
    end: { dateTime: '2027-03-26T23:59:59Z' },
  },
];

async function authenticateAndRun() {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });

  console.log('Authorize this app by visiting this URL:', authUrl);

  const server = http.createServer(async (req, res) => {
    try {
      const parsedUrl = url.parse(req.url, true);
      const code = parsedUrl.query.code;

      if (code) {
        res.end('Authentication successful! You can close this window.');
        server.close();

        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);
        console.log('Tokens acquired successfully.');

        await createEvents(oAuth2Client);
      }
    } catch (err) {
      console.error('Error during authentication callback:', err);
      res.statusCode = 500;
      res.end('Authentication failed.');
    }
  });

  server.listen(3000, () => {
    opn(authUrl, { wait: false });
  });
}

async function createEvents(auth) {
  const calendar = google.calendar({ version: 'v3', auth });
  for (const event of events) {
    try {
      const response = await calendar.events.insert({
        calendarId: 'primary',
        resource: event,
      });
      console.log('Event created: ', response.data.summary);
    } catch (error) {
      console.error('Error creating event: ', error);
    }
  }
}

authenticateAndRun().catch(console.error);
