const express = require('express');
const path = require('path');
const bodyParser = require('body-parser')
const authenticateGoogleToken = require('./googleTokenAuthenticator.js');
const jwt = require('jsonwebtoken');
const db = require('../database/index.js');
const PORT = process.env.PORT || '3000';
const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post('/api/auth', (req, res) => {
	// Extract Google account token from request body
	let token = req.body.id_token;
	// Authenticate and parse token with OAuth2
	authenticateGoogleToken(token, (googleAcct) => {
		//Check database for email in account 
		db.findUser(googleAcct.email, (err, userData) => {
			if(err) {
				res.sendStatus(403); // better error handling needed here
			} else {
				// If the user's info isn't in the database, update it
				if(userData.name === null) {
					userData.name = googleAcct.given_name;
					userData.picture_url = googleAcct.picture;
					db.updateUserInfo(googleAcct.email, googleAcct.given_name, googleAcct.picture); 
				}
				// If email is found, respond with token
				jwt.sign({userData},'huddl_takehome_login', {expiresIn: '2 days'}, (err, token) => {
					res.json({
						token
					});
				});	
			}
		});
	}).catch((err) => console.log(err));
});

app.post('/api/login', verifyToken, (req, res) => {
	// verifies token from request header
	jwt.verify(req.token, 'huddl_takehome_login', (err, data) => {
		if(err) {
			res.sendStatus(403);
		} else {
			// returns account info to be displayed on page
			res.json({
				user: data
			});
		}
	});
});

app.post('/api/adduser', verifyToken, (req, res) => {
	jwt.verify(req.token, 'huddl_takehome_login', (err, data) => {
		if(err) {
			res.sendStatus(403);
		} else {
			// trim email string and set all chars to lowercase
			let email = req.body.email.trim().toLowerCase();
			// make sure that the inserted string is an actual email
			if(validateEmail(email)) {
				db.addUser(email, (err, result) => {
					if(err) {
						res.sendStatus(500);
					} else {
						res.sendStatus(200);
					}
				});
			} else {
				res.sendStatus(403);	
			}
		}
	});
});

app.get('/api/users', verifyToken, (req, res) => {
	jwt.verify(req.token, 'huddl_takehome_login', (err) => {
		if(err) {
			res.sendStatus(403);
		} else {
			db.getAllEmails((err, emails) => {
				if(err) {
					res.sendStatus(500);
				} else {
					res.json({emails});
				}
			});
		}
	});	
});


app.use(express.static(path.join(__dirname, '../dist')));

app.listen(PORT, () => console.log(`Server Running on port ${PORT}`));

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

function validateEmail(email) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
