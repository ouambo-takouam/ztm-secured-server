require('dotenv').config();

const fs = require('fs');
const https = require('https');

const app = require('./app');

const PORT = 3000;

const server = https.createServer(
	{
		key: fs.readFileSync('key.pem'),
		cert: fs.readFileSync('cert.pem'),
	},
	app
);

server.listen(PORT, () => {
	console.log(`Listening to port ${PORT}...`);
});
