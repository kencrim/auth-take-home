const express = require('express');
const path = require('path');
const bodyParser = require('body-parser')
const authenticateGoogleToken = require('./googleTokenAuthenticator.js');
const jwt = require('jsonwebtoken');
const db = require('../database/index.js');
const PORT = process.env.PORT || '3000';
const http = require('http')
const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '..', 'dist')));
app.use('/dist', express.static(path.join(__dirname, '..', 'dist')));

const routes = require('./routes');

app.use('/', routes);

app.set('port', PORT);

app.post('/api/users', verifyToken, (req, res) => {
	jwt.verify(req.token, 'huddl_takehome_login', (err, data) => {
		if(err) {
			// replace with custom error message
			res.sendStatus(403) // better error handling needed here
		} else {
			// will actually redirect user to main interface
			res.json({
				message: 'Authentication Successful!',
				user: data
			});
		}
	});
});

app.post('/api/login', (req, res) => {
	// Extract Google account token from request body
	let token = req.body.id_token;
	// Authenticate and parse token with OAuth2
	authenticateGoogleToken(token, (googleAcct) => {
		//Check database for email in account 
		db.findUser(googleAcct.email, (err, userData) => {
			if(err) {
				res.status(403).send(); // better error handling needed here
			} else {
				// If the name in the database doesn't match, update it
				if(userData.name !== googleAcct.given_name) {
					userData.name = googleAcct.given_name;
					db.updateUserName(googleAcct.email, googleAcct.given_name) 
				}
				// If email is found, respond with token
				jwt.sign({userData},'huddl_takehome_login', {expiresIn: '2 days'}, (err, token) => {
					res.json({
						token
					})
				});	
			}
		});
	}).catch((err) => console.log(err));
});

app.use(express.static(path.join(__dirname, '../dist')));


const server = http.createServer(app);


server.listen(PORT, () => console.log(`Server Running on port ${PORT}`));

function verifyToken(req, res, next) {
	const bearerHeader = req.headers['authorization'];
	if(typeof bearerHeader !== "undefined") {
		const bearer = bearerHeader.split(' ');
		const token = bearer[1];
		req.token = token;
		next();
	} else {
		res.sendStatus(403); // better error handling needed here
	}
}
