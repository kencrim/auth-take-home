const mysql = require('mysql');
const config = require('./db_config.js');

/* The connection string is used to circumvent the NodeJS MySQL library's compatibility issue introduced
 by MySQL version 8.0+'s use of SHA2 instead of SHA256 */  
const connString = `mysql://${config.options.user}:${config.options.password}@${config.options.host}/${config.options.db}?charset=utf8_general_ci&timezone=-0700`;
const db = mysql.createConnection(connString);

module.exports.findUser = (email, callback) => {
	db.query(`SELECT * FROM users WHERE email = '${email}' limit 1`, (err, results) => {
		if(err || results.length == 0) {
			callback(Error(), null);
		} else {
			userRecord = results[0];
			callback(null, {email: userRecord.email, name: userRecord.name})
		}
	})
}

module.exports.updateUserName = (email, name) => {
	db.query(`UPDATE users SET name='${name}' WHERE email = '${email}'`, (err) => {
		if(err) {
			console.log(err);
		} 
	});
}

module.exports.getAllEmails = (callback) => {
	db.query(`SELECT email FROM users`, (err, results) => {
		if(err) {
			callback(err, null);
		} else {
			results.forEach((result, index) => {
				results[index] = result.email;
			});
			callback(null, results);
		}
	});
}



