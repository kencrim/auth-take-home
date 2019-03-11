import React from 'react';

export default props => {
  return ( 
  	<div className='dashboard'>
  		{
	  		props.loggedIn ? 
				<h3>{props.name ? props.name + '\'s': 'Your'} Dashboard: </h3>			
				:
				<h3>Welcome to the site! Log in to continue.</h3>
  		}
  	</div>
  )
};