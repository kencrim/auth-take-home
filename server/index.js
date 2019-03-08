const express = require('express');
const jwt = require('jsonwebtoken');

const PORT = 3000;
const app = express();

app.post('/api/users', verifyToken, (req, res) => {
	res.json({
		message: 'post created'
	});
});

app.post('/api/login',(req, res) => {
	const user = {
		id: 1,
		username: 'Ken',
		email: 'kencrim@gmail.com'
	}
	jwt.sign({user},'key', (err, token) => {
		res.json({
			token
		})
	});
});

app.listen(PORT, () => {
	console.log('Now listening on port ' + PORT);
});

// Verify Token

function verifyToken(req, res, next) {
	const bearerHeader = req.headers['authorization'];
	if(typeof bearerHeader !== "undefined") {
		res.json({
			message: "Token Verified"
		})
	} else {
		res.sendStatus(403);
	}
}