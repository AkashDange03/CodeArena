import React from 'react'
import Avatar from 'react-avatar'
function Client({username}) {
  return (
    <div className='flex flex-col m-2'>
        <Avatar name={username} size={50} round="14px" />
        <span className=''>{username.split(' ')[0]}</span>
    </div>
  )
}

export default Client