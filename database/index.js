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

module.exports.findUser = (email, callback) => {
	db.query(`SELECT * FROM users WHERE email = '${email}' limit 1`, (err, results) => {
		if(err || results.length == 0) {
			callback(true, null);
		} else {
			console.log(results)
			callback(null, results);
		}
	})
}



