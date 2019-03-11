import React from 'react';
import UserAvatar from 'react-user-avatar';

export default props => {
  return (
    <tr>
      <td><UserAvatar src={props.item.picture} name={props.item.email}/></td>
      <td>{props.item.email}</td>
	 </tr>
  )
}