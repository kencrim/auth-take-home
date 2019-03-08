const express = require('express');
const jwt = require('jsonwebtoken');
const path = require('path');

const PORT = 3000;
const app = express();

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.post('/api/users', verifyToken, (req, res) => {
	jwt.verify(req.token, 'key', (err, data) => {
		if(err) {
			res.sendStatus(403)
		} else {
			res.json({
				message: 'post created',
				data
			});
		}
	});
});

app.post('/api/login', (req, res) => {
	const user = {
		id: 1,
		email: 'kencrim@gmail.com',
		firstName: 'Ken',
		lastName: 'Crimmins'
	}
	jwt.sign({user},'key', (err, token) => {
		res.json({
			token
		});
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