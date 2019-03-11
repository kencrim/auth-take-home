import React from 'react';
import EmailList from './EmailList.js';
import UserInput from './UserInput.js'

export default props => {
  return ( 
  	<div className='dashboard'>
  		{
	  		props.loggedIn ? 
        <div>
          <UserInput
            loggedIn = {props.loggedIn}
            emailInput={props.emailInput}
            handleChange={props.handleChange}
            handleSubmit={props.handleSubmit}
          />
				  <h3 className='dash-message'>{props.name ? props.name + '\'s': 'Your'} Dashboard: </h3>
          <EmailList emails={props.emails} />
        </div>		
				:
				<h3 className='welcome-message'>Welcome to the site! Log in to get started.</h3>
  		}
  	</div>
  )
};