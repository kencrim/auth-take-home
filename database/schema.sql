DROP DATABASE IF EXISTS whitelist;
CREATE DATABASE whitelist;

USE whitelist;

CREATE TABLE IF NOT EXISTS users (
  `user_id` INTEGER NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(30 ) NOT NULL,
  `first_name` VARCHAR(250) NULL DEFAULT NULL,
  `last_name` VARCHAR(30) NULL DEFAULT NULL,
  PRIMARY KEY (`user_id`)
);

INSERT INTO users (user_id, email)
VALUES (null, 'kencrim@gmail.com');

/* The following commands are to prevent the MySQL 8.0+ 
 *  compatibility issue referenced in database/index.js */

DROP USER IF EXISTS nodeuser@'localhost';
CREATE USER nodeuser@'localhost' IDENTIFIED BY 'pw';
GRANT ALL PRIVILEGES ON *.* TO 'nodeuser'@'localhost' WITH GRANT OPTION;

ALTER USER 'nodeuser'@localhost IDENTIFIED WITH mysql_native_password BY 'pw';

/*  Execute this file from the command line by running:
 *    mysql -u root < database/schema.sql
 *  from the root directory to create the database 
 *  and the tables. This command will also be run as part of the 
 *	npm start script */