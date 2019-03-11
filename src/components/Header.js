import React from 'react';
import { GoogleLogin, GoogleLogout} from 'react-google-login';

export default props => {
  return ( 
  	<div className='nav'>
  	{
  		props.loggedIn ? 
			<GoogleLogout
            className="google-button"
      			buttonText="Logout"
      			onLogoutSuccess={props.signOut}
   			/>
			:
			<GoogleLogin
          className="google-button"
    			buttonText="Login with Google"
    			onSuccess={props.onSignIn}
    			onFailure={props.onSignIn}
  			/>	
  	}
  	</div>
  )
};