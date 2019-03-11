import React, {Component} from 'react';
import ReactDom from 'react-dom';
import Header from './Header.js';
import Dashboard from './Dashboard.js';

class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
			loggedIn: false,
			emails: [],
			user: null
		}
		this.onSignIn = this.onSignIn.bind(this);
		this.signOut = this.signOut.bind(this);
		this.responseParser = this.responseParser.bind(this);
		this.authenticateGoogleUser = this.authenticateGoogleUser.bind(this);
		this.authenticatePageUser = this.authenticatePageUser.bind(this);
		this.getUserEmails = this.getUserEmails.bind(this);
	}

	onSignIn(googleUser) {
		// Gets auth token from Google User auth object
		let id_token = googleUser.getAuthResponse().id_token;
		this.authenticateGoogleUser(id_token);
	}

	signOut() {
		// If google isntance hasn't expired, sign user out of that
		let auth2 = gapi.auth2.getAuthInstance();
		auth2.signOut()
		// Then set login state false and delete token cookie
		.then( () => {
			this.setState({loggedIn: false});
			document.cookie = "token=;expires="+ new Date().toUTCString()+";"; 
		});
	}

	responseParser(res) {
		// Check for error
		if(!res.ok) {
			// If user has not been found in the database, or their token has expired sign them out
			this.signOut();
			throw Error(res.statusText);
		} else {
			// Parse response to json
			return res.json();
		}
	}

	authenticateGoogleUser(id_token) {
		// Sends Google token to server, where it can be verified and parsed
		return fetch('http://lvh.me:3000/api/auth', {
			method: "POST", 
			mode: "cors",
			cache: "default", 
			credentials: "same-origin",
			headers: {
		    	'Content-Type': 'application/json',
			},
			body: JSON.stringify({id_token}),
		})
		// Parses the response to json, or throws error
		.then(this.responseParser)
		// Sends token back to server, where it is parsed into user info
		.then((response) => { 
			this.authenticatePageUser(response.token)
		});
	}

	authenticatePageUser(token) {
		// Send request to server to validate token
		return fetch('http://lvh.me:3000/api/login', {
			method: "POST",
			mode: "cors",
			cache: "default", 
			credentials: "same-origin",
			headers: {
				'Content-Type': 'application/json',
				'authorization': 'Bearer ' + token
			},
		})
		.then(this.responseParser)
		// Once validated and parsed, update state with info from response
		.then(response => {
     		this.setState({
     			loggedIn: true,
        		user: response.user.userData.name
      		});
      		// Save new token cookie for two days
      		let date = new Date;
      		date.setDate(date.getDate() + 2);
			let cookie = "token=" + token + ';' + 'expires=' + date.toUTCString() + ';';
			document.cookie = cookie;
			this.getUserEmails(token);
		});
	}

	getUserEmails(token) {
		return fetch('http://lvh.me:3000/api/users', {
			method: "GET",
			mode: "cors",
			cache: "default",
			credentials: "same-origin",
			headers: {
				'authorization': 'Bearer ' + token
			}
		})
		.then(this.responseParser)
		.then((response) => {
			this.setState({emails:response.emails});
		});
	}

	componentDidMount() {
		// Get cookies array
		let cookies = decodeURIComponent(document.cookie).split(';');
		// token cookie will be cookies[2], so if it exists, we want to authenticate the user on page load
		if(cookies[2] !== undefined) {
			let token = cookies[2].split('=')[1]
			this.authenticatePageUser(token);
		}
	}

	render() {
		return (
			<div>
				<Header loggedIn={this.state.loggedIn} onSignIn={this.onSignIn} signOut={this.signOut}/>
        		<Dashboard loggedIn={this.state.loggedIn} name={this.state.user} emails={this.state.emails}/>
			</div>
		)
	}

}

export default App;