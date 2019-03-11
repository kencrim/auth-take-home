import React, {Component} from 'react';
import ReactDom from 'react-dom';
import Header from './common/Header.js';
import Dashboard from './Dashboard.js';

class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
			loggedIn: false,
			userList: [],
			user: null
		}
		this.onSignIn = this.onSignIn.bind(this);
		this.signOut = this.signOut.bind(this);
		this.responseParser = this.responseParser.bind(this);
		this.authenticateGoogleUser = this.authenticateGoogleUser.bind(this);
		this.authenticatePageUser = this.authenticatePageUser.bind(this);
	}

	onSignIn(googleUser) {
		// Gets auth token from Google User auth object
		let id_token = googleUser.getAuthResponse().id_token;
		this.setState({loggedIn: true});
		this.authenticateGoogleUser(id_token);
	}

	signOut() {
		let auth2 = gapi.auth2.getAuthInstance();
		auth2.signOut()
		.then( () => {
			this.setState({loggedIn: false});
			document.cookie = "token=;expires="+ new Date().toUTCString()+";"; // delete the token cookie on signout
		})
	}

	responseParser(res) {
		// Check for error
		if(!res.ok){
			// If user has not been found in the database, sign them back out and throw error
			this.signOut()
			throw Error(res.statusText);
		} else {
			// Parse response to json
			return res.json();
		}
	}

	authenticateGoogleUser(id_token) {
		// Sends Google token to server, where it can be verified and parsed
		return fetch('http://lvh.me:3000/api/login', {
			method: "POST", 
			mode: "cors",
			cache: "no-cache", 
			credentials: "same-origin",
			headers: {
		    	'Content-Type': 'application/json',
			},
			body: JSON.stringify({id_token}),
		})
		// Parses the response to json, or throws error
		.then(this.responseParser)
		// Sends token back to server, where it is parsed into user info
		.then(this.authenticatePageUser);
	}

	authenticatePageUser(tokenObj) {
		return fetch('http://lvh.me:3000/api/users', {
			method: "POST",
			mode: "cors",
			cache: "no-cache", 
			credentials: "same-origin",
			headers: {
				'Content-Type': 'application/json',
				'authorization': 'Bearer ' + tokenObj.token
			},
		})
		.then(this.responseParser)
		.then(response => {
			console.log(response);
     		this.setState({
        		user: response.user.userData.name
      		});
			let newCookie = "token=" + "Bearer " + tokenObj.token
			if(document.cookie !== newCookie) {
				document.cookie = newCookie;
			}
		});
	}

	componentDidMount() {
		let cookies = decodeURIComponent(document.cookie).split(';');
		if(cookies[2] !== undefined) {
			this.setState({loggedIn: true});
		}
	}

	render() {
		return (
			<div>
				<Header loggedIn={this.state.loggedIn} onSignIn={this.onSignIn} signOut={this.signOut}/>
        <Dashboard loggedIn={this.state.loggedIn} name={this.state.name}/>
			</div>
		)
	}

}

export default App;