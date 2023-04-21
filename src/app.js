const path = require('path');
const helmet = require('helmet');
const express = require('express');

const app = express();

function middleware(req, res, next) {
	const isLogged = true;

	if (!isLogged) {
		return res.status(401).json({
			error: 'Should authenticate first',
		});
	}

	next();
}

app.use(helmet());

app.get('/auth/google', (req, res) => {});

app.get('/auth/google/callback', (req, res) => {});

app.get('/auth/logout', (req, res) => {});

app.get('/secret', middleware, (req, res) => {
	return res.status(200).send('Secret data');
});

app.get('/', (req, res) => {
	return res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;
