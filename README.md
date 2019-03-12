## OAuth2 Project Readme

Hi! Hopefully everything below will be sufficient to answer your questions and get you up and running! 

## Getting Started

Before you do anything else, open database/schema.sql, and change the email listed in the INSERT command at the bottom to whichever Gmail you'd like to use for your first user. Make sure that it's an email that you have access to.

Assuming you already have docker installed, the easiest way to get up and running is to run docker-compose(https://docs.docker.com/compose/) on the YML file in the root directory. It will build images for the database and app, and connect them. 

```bash
docker-compose up
```
Once the containers have spun up, visit http://lvh.me:3000 to use the app. Please note that, because of the domain constraints of Google's API, it must be lvh.me, NOT localhost.


If you don't have access to Docker, open database/db_config.js, and change it to the following:

```javascript
module.exports.options = {
	host: 'localhost',
	user: 'root',
	password: pw, // your root password
	database: 'whitelist'
}
```
Then, make sure that your version of MySQL is 5.7 or below (to avoid the auth issue introduced by the switch to SHA2), and run the following command on database/schema.sql:

```bash
mysql -u root -p < schema.sql
```
## Using the app



## API

# Endpoints

```javascript
http://lvh.me:3000/api/login
```


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)