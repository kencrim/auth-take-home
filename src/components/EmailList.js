import React from 'react';
import EmailListItem from './EmailListItem.js';

export default props => {
  return ( 
    <div className='email-list'>
      {props.emails.length > 0 ?
      	<table>
          <thead>
            <tr>
        	     <th className="list-header">Registered Users</th>
            </tr>
          </thead>
          <tbody>
        		{props.emails.map((item) => {
        			return <EmailListItem item={item}/>
     				})}
          </tbody>
      	</table>
        :
        <p className='loading-message'>Loading user list...</p>
    }
    </div>
  )
}