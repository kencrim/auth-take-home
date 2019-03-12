DROP DATABASE IF EXISTS whitelist;
CREATE DATABASE whitelist;

USE whitelist;

CREATE TABLE IF NOT EXISTS users (
  `user_id` INTEGER NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(30) NOT NULL UNIQUE,
  `name` VARCHAR(30) NULL DEFAULT NULL,
  `picture` VARCHAR(200) NULL DEFAULT NULL,
  PRIMARY KEY (`user_id`)
);

INSERT INTO users (user_id, email)
VALUES (null, 'kencrim@gmail.com');

/*  Execute this file from the command line by running:
 *    mysql -u root < database/schema.sql
 *  from the root directory to create the database 
 *  and the tables. This command will also be run as part of the 
 *	npm start script */