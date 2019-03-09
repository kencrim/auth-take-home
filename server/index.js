const express = require('express');
const path = require('path');
const bodyParser = require('body-parser')

const authenticateGoogleToken = require('./googleTokenAuthenticator.js');
const jwt = require('jsonwebtoken');

const PORT = 3000;
const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '../client/index.html'));
});


// Incomplete, will redirect to the user console once token is verified 
app.post('/api/users', verifyToken, (req, res) => {
	jwt.verify(req.token, 'key', (err, data) => {
		if(err) {
			// replace with custom error message
			res.sendStatus(403)
		} else {
			// will actually redirect user to main interface
			res.json({
				message: 'Authentication Successful!',
				data
			});
		}
	});
});

app.post('/api/login', (req, res) => {
	//dummy data, will be replaced by a db query
	const user = {
		id: 1,
		email: 'kencrim@gmail.com',
		firstName: 'Ken',
		lastName: 'Crimmins'
	}
	let token = req.body.id_token;
	authenticateGoogleToken(token).catch(console.error);;
	jwt.sign({user},'key', (err, token) => {
		res.json({
			token
		})
	});
});

app.listen(PORT, () => {
	console.log('Now listening on port ' + PORT);
});

function verifyToken(req, res, next) {
	const bearerHeader = req.headers['authorization'];
	if(typeof bearerHeader !== "undefined") {
		const bearer = bearerHeader.split(' ');
		const token = bearer[1];
		req.token = token;
		next();
	} else {
		res.sendStatus(403);
	}
}