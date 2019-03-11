import React from 'react';
import UserAvatar from 'react-user-avatar';

export default props => {
  return (
    <tr className="list-cell">
      <td className="list-icon"><UserAvatar size={23} src={props.item.picture} name={props.item.email}/></td>
      <td className="list-email">{props.item.email}</td>
	 </tr>
  )
}