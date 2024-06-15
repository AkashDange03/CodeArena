import React from 'react'
import Avatar from 'react-avatar'
function Client({username}) {
  return (
    <div className='flex gap-2 m-2'>
        <Avatar name={username} size={40} round="20px" />
        <span className='mt-2'>{username.split(' ')[0]}</span>
    </div>
  )
}

export default Client