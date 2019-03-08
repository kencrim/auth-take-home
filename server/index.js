const express = require('express');
const app = express();
const PORT = 3000;

app.get('/auth',(req, res) => {
	res.json({
		message: 'Hello world!'
	});
});

app.listen(PORT, () => {
	console.log('Now listening on port ' + PORT);
});