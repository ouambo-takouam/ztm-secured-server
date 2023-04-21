const path = require('path');
const express = require('express');

const app = express();

app.get('/', (req, res) => {
	return res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;
