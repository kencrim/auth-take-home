const mysql = require('mysql');
const options = require('./db_config.js');

const connection = mysql.createConnection(options);
 
connection.connect();

const findUser = (email, callback) => {
	connection.query(`SELECT * FROM \`users\` WHERE \`email\` = "${email}"`, (err, results) => {
		if(err) {
			callback(err, null);
		} else {
			callback(null, results);
		}
	})
}

