const express = require('express');
const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const config = require('./config');
const app = express();
let googleProfile = {};

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));
passport.use(new googleStrategy({
  clientID: config.GOOGLE_CLIENT_ID,
  clientSecret: config.GOOGLE_CLIENT_SECRECT,
  callbackURL: config.CALLBACK_URL
},
  (accessToken, refreshToken, profile, cb) => {
    googleProfile = {
      id: profile.id,
      displayName: profile.displayName
    };
    cb(null, profile);
  }
));

app.use(express.static('assets'));
app.set('view engine', 'pug');
app.set('views', './views');
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.render('login', { user: req.user });
});
app.get('/logged', (req, res) => {
  res.render('index', { user: googleProfile });
});
app.get('/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);
app.get('/auth/google/callback', passport.authenticate(
  'google', {
    successRedirect: '/logged',
    failureRedirect: '/'
  }));

const server = app.listen(3000, 'localhost', (req, res) => {
  const port = server.address().port;
  const host = server.address().address;
  console.log(`Server is running at http://${host}:${port}`);
});

app.use((req, res, next) => {
  res.status(404).send(`Oops! Resource ${req.url} could not be found.`);
});