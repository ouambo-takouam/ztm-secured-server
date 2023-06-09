const path = require('path');
const helmet = require('helmet');
const express = require('express');
const passport = require('passport');
const cookieSession = require('cookie-session');
const { Strategy } = require('passport-google-oauth20');

const app = express();

const config = {
	CLIENT_ID: process.env.CLIENT_ID,
	CLIENT_SECRET: process.env.CLIENT_SECRET,
	COOKIE_KEY_1: process.env.COOKIE_KEY_1,
	COOKIE_KEY_2: process.env.COOKIE_KEY_2,
};

const AUTH_OPTIONS = {
	callbackURL: '/auth/google/callback',
	clientID: config.CLIENT_ID,
	clientSecret: config.CLIENT_SECRET,
};

function middleware(req, res, next) {
	const isLogged = req.isAuthenticated() && req.user;

	if (!isLogged) {
		return res.status(401).json({
			error: 'Should authenticate first',
		});
	}

	next();
}

function verifyCallback(accessToken, refreshToken, profile, done) {
	console.log('Google profile', profile);
	done(null, profile);
}

passport.use(new Strategy(AUTH_OPTIONS, verifyCallback));

// save the session to cookie
passport.serializeUser((user, done) => {
	done(null, user.id);
});

// read the session from cookie
passport.deserializeUser((id, done) => {
	done(null, id);
});

app.use(helmet());

app.use(
	cookieSession({
		name: 'session',
		keys: [config.COOKIE_KEY_1, config.COOKIE_KEY_2],

		// Cookie Options
		maxAge: 24 * 60 * 60 * 1000, // 24 hours
	})
);

app.use(passport.initialize());
app.use(passport.session());

app.get(
	'/auth/google',
	passport.authenticate('google', {
		scope: ['email', 'profile'],
	})
);

app.get(
	'/auth/google/callback',
	passport.authenticate('google', {
		failureRedirect: '/failure',
		successRedirect: '/',
		session: true,
	}),
	(req, res) => {
		console.log('Google called us back');
	}
);

app.get('/auth/logout', (req, res) => {
	req.logout(); // removes req.user and clears any logged in session
	return res.redirect('/');
});

app.get('/', (req, res) => {
	return res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.get('/secret', middleware, (req, res) => {
	return res.status(200).send('Secret data');
});

app.get('/failure', (req, res) => {
	return res.send('Failed to log in!');
});

module.exports = app;
