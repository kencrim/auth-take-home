import React from 'react';
import EmailList from './EmailList.js';

export default props => {
  return ( 
  	<div className='dashboard'>
  		{
	  		props.loggedIn ? 
        <div>
				  <h3>{props.name ? props.name + '\'s': 'Your'} Dashboard: </h3>
          <EmailList emails={props.emails} />
        </div>		
				:
				<h3>Welcome to the site! Log in to continue.</h3>
  		}
  	</div>
  )
};