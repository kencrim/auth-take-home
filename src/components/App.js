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
			user: null,
			emailInput: '',
		}
		this.onSignIn = this.onSignIn.bind(this);
		this.signOut = this.signOut.bind(this);
		this.responseHandler = this.responseHandler.bind(this);
		this.authenticateGoogleUser = this.authenticateGoogleUser.bind(this);
		this.authenticatePageUser = this.authenticatePageUser.bind(this);
		this.getUserEmails = this.getUserEmails.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
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
		.then((res) => {return this.responseHandler(res, 'Failed: either your email isn\'t registered, \
			or you submitted an invalid Google token.')})
		// Sends token back to server, where it is parsed into user info
		.then((json) => { 
			console.log(json.token);
			this.authenticatePageUser(json.token);
		})
		.catch();
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
		.then((res) => {return this.responseHandler(res, 'Failed: you submitted an expired or invalid token')})
		// Once validated and parsed, update state with info from response
		.then(json => {
		 		this.setState({
     			loggedIn: true,
        		user: json.user.userData.name
      		});
      		// Save new token cookie for two days
      		let date = new Date;
      		date.setDate(date.getDate() + 2);
			let cookie = "token=" + token + ';' + 'expires=' + date.toUTCString() + ';';
			document.cookie = cookie;
      // Bind token to window for the session
      window.token = token;
			this.getUserEmails(token);
		})
		.catch();
	}

	addUser(email, token) {
    return fetch('http://lvh.me:3000/api/adduser', {
      method: "POST",
      mode: "cors",
      cache: "default", 
      credentials: "same-origin",
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + token
      },
      body: JSON.stringify({email})
    }) 
    .then((res) => {
    	if(!res.ok){
    		alert('Failed: email is either invalid or already in use.');
    	} else {
    		this.setState({emailInput: ''});
    		this.getUserEmails(window.token);
    	}
		})
    .catch();
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
		.then((res) => {
			if(!res.ok) {
				throw Error(res.statusText);
			} else {
				return res.json();
			}
		})
		.then((json) => {
			this.setState({emails:json.emails});
		})
		.catch();
	}

		responseHandler(res, errorMessage) {
		// Check for error
		if(!res.ok) {
			alert(errorMessage)
			throw Error(res.statusText);
		} else {
			// Parse response to json
			return res.json();
		}
	}

	handleChange(event) {
    	this.setState({emailInput: event.target.value});
  	}

  	handleSubmit(event) {
    	event.preventDefault();
    	this.addUser(this.state.emailInput, window.token);
  	}

	componentDidMount() {
		// Get cookies array
		let cookies = decodeURIComponent(document.cookie).split(';');
		// token cookie will be cookies[2], so if it exists, we want to authenticate the user on page load
		if(cookies[2] !== undefined) {
			let token = cookies[2].split('=')[1]
			console.log(token);
			this.authenticatePageUser(token);
		}
	}

	render() {
		return (
			<div>
        <Header 
          loggedIn={this.state.loggedIn} 
          onSignIn={this.onSignIn} 
          signOut={this.signOut}
        />
        <Dashboard  
          loggedIn={this.state.loggedIn} 
          name={this.state.user} 
          emails={this.state.emails}
          emailInput={this.state.emailInput}
          handleChange={this.handleChange}
          handleSubmit={this.handleSubmit}
        />
			</div>
		)
	}

}

export default App;