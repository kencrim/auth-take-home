## OAuth2 Project Readme

Hi! Hopefully everything below will be sufficient to answer your questions and get you up and running! 

## Getting Started

Before you do anything else, open database/schema.sql, and change the email listed in the INSERT command at the bottom to whichever Gmail you'd like to use for your first user. Make sure that it's an email that you have access to.

Assuming you already have docker installed, the easiest way to get up and running is to run docker-compose(https://docs.docker.com/compose/) on the YML file in the root directory. It will build images for the database and app, spin up containers, and connect them. 

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

This will create your database and insert your first user!

From there, just run the installation and start commands:

```bash
npm install
npm start
``` 
And you should be all set to visit http://lvh.me:3000!

## Using the app

If you're interested, here's a link to a youtube video of the app in action:

Using the app is fairly straightforward - sign in with whichever Google account you've inserted into your mySQL database, and a token will be generated on the backend and saved to your cookies for the site for two days. 

For convenience of the purposes of this project, the token is also logged to the console when it's first generated, or if you login with a saved token.

## API

If you'd prefer to send your own requests to the API, just grab a valid token from the site and have at it! 

### Endpoints

```javascript
http://lvh.me:3000/api/login
```

## Dev Tools

If you're interested in the tools I used for building the app, feel free to add the following dev dependencies to the package json

```javascript
  "devDependencies": {
    "@babel/core": "^7.0.0",
    "@babel/plugin-proposal-class-properties": "^7.0.0",
    "@babel/plugin-proposal-export-namespace-from": "^7.0.0",
    "@babel/plugin-proposal-throw-expressions": "^7.0.0",
    "@babel/plugin-syntax-dynamic-import": "^7.0.0",
    "@babel/polyfill": "^7.0.0-beta.51",
    "@babel/preset-env": "^7.0.0-beta.51",
    "@babel/preset-react": "^7.0.0-beta.51",
    "babel-loader": "^8.0.0-beta.0",
    "babel-runtime": "^6.26.0",
    "babel-types": "^6.26.0",
    "copy-webpack-plugin": "^4.5.1",
    "css-loader": "^0.28.11",
    "html-webpack-plugin": "^3.2.0",
    "mini-css-extract-plugin": "^0.4.3",
    "node-sass": "^4.8.3",
    "optimize-css-assets-webpack-plugin": "^4.0.0",
    "sass-loader": "^7.0.3",
    "style-loader": "^0.21.0",
    "uglifyjs-webpack-plugin": "^1.2.5",
    "webpack": "^4.12.0",
    "webpack-cli": "^3.0.8",
    "webpack-dev-server": "^3.1.4",
    "webpack-merge": "^4.1.3",
    "webpack-visualizer-plugin": "^0.1.11"
  }
```
along with this prestart script

```bash
webpack --mode production --config config/webpack.prod.config.js --env.PLATFORM=production --env.VERSION=stag --progress,
```

Thanks for reading! Email kencrim@gmail.com if you have any questions