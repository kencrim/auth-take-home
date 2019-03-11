import React from 'react';

export default props => {
  return ( 
  	<div className='user-input'>
  		{
	  		props.loggedIn ? 
          <form onSubmit={props.handleSubmit}>
            <label>
            New User:
            <input type="text" value={props.emailInput} onChange={props.handleChange} />
            </label>
            <input type="submit" value="Submit" />
          </form>
				:
				  null
  		}
  	</div>
  )
};