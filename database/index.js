const mysql = require('mysql');
const config = require('./db_config.js');

/* The connection string is used to circumvent the NodeJS MySQL library compatibility issue introduced
 by MySQL's version 8.0+ using SHA2_PASSWORD instead of SHA256_PASSWORD */  
const connString = `mysql://${config.options.user}:${config.options.password}@${config.options.host}/${config.options.db}?charset=utf8_general_ci&timezone=-0700`;
const db = mysql.createConnection(connString);
 
db.connect( (err) => {
	if(err) {
		throw(err);
	}
});

const findUser = (email, callback) => {
	db.query(`SELECT * FROM users WHERE email = '${email}'`, (err, results) => {
		if(err) {
			callback(err, null);
		} else {
			callback(null, results);
		}
	})
}
findUser('kencrim@gmail.com', (err, results) => {
	if(err) {
		console.log(err);
	} else {
		console.log(results);
	}
});

