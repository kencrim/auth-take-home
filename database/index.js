const mysql = require('mysql');
const config = require('./db_config.js');

/* The connection string is used to circumvent the NodeJS MySQL library's compatibility issue introduced
 by MySQL version 8.0+'s use of SHA2 instead of SHA256 */  
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
			callback(Error(), null);
		} else {
			userRecord = results[0];
			console.log(userRecord);
			callback(null, {email: userRecord.email, })
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



