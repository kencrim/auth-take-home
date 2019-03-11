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

module.exports.updateUserInfo = (email, name, pic_url) => {
	db.query(`UPDATE users SET name='${name}', picture='${pic_url}' WHERE email='${email}'`, (err) => {
		if(err) {
			console.log(err);
		} 
	});
}

module.exports.getAllEmails = (callback) => {
	db.query(`SELECT * FROM users`, (err, results) => {
		if(err) {
			callback(err, null);
		} else {
			callback(null, results);
		}
	});
}

module.exports.addUser = (email, callback) => {
	db.query(`INSERT INTO users (user_id,email) VALUES (null,'${email}');`, (err) => {
		if(err) {
			callback(err);
		} else {
			callback(null);
		}
	});
}



