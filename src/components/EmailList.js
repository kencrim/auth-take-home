import React from 'react';

export default props => {
  return ( 
    <div className='email-list'>
      {props.emails.length > 0 ?
      	<table>
      		<th>Registered Users</th>
      		{props.emails.map((email) => {
      			return (
      				<tr>
      					<td>{email}</td>
  						</tr>
   					);
   				})}
      	</table>
        :
        <p className='loading-message'>Loading user list...</p>
    }
    </div>
  )
};