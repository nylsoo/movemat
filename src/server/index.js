import Express from 'express';
import compression from 'compression';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import forceSsl from 'force-ssl-heroku';
import passport from 'passport';
import path from 'path';
import connectFlash from 'connect-flash';
import expressSession from 'express-session';

import Auth from './passport';
import Api from './api';

const env = process.env.NODE_ENV || 'development';
const publicPath = env === 'development' ? __dirname : path.join(__dirname, '../public');
const app = Express();

const port = parseInt(process.env.PORT || 3000, 10);

require('dotenv').config();

const mongoURL = process.env.MONGODB_URI || 'mongodb://localhost/steps';
mongoose.connect(mongoURL, { useMongoClient: true }, (ignore, connection) => {
  connection.onOpen();
}).then(() => { console.info('connected'); }).catch(console.error);

// Remove annoying Express header addition.
app.disable('x-powered-by');

// Compress (gzip) assets in production.
app.use(compression());

// Add bodyParser for json.
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(bodyParser.json());

app.use(forceSsl);

// Setup passport + session
app.use(expressSession({
  secret: 'StepsIsMooieDingen',
  resave: true,
  saveUninitialized: true,
}));
app.use(connectFlash());
app.use(passport.initialize());
app.use(passport.session());
const auth = new Auth();
auth.initialize();

// Setup the public directory so that we can server static assets.
app.use(Express.static(path.join(process.cwd(), KYT.PUBLIC_DIR)));

// Setup api routes.
app.use('/api', Api);

app.get('*', (req, res) => res.sendFile(`${publicPath}/index.html`));

app.listen(port, () => {
// eslint-disable-next-line no-console
  console.log(`✅  server started on port: ${port}`);
});

