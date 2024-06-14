import React, { useEffect, useRef } from 'react'
import Avatar from 'react-avatar'
import { useState } from 'react';
import { useGlobalContext } from '../context/GlobalContext';

function ChatBox({messages,socketRef,roomId}) {

    const [input,setInput]=useState([])
    const {userName} = useGlobalContext();
    const messagesEndRef = useRef(null);

    const addListItem = (e) => {
        e.preventDefault();
        if (input) {
            socketRef.current.emit('chat-message', { roomId, message:input, username: userName });
            setInput('');
        }
    };
   

    // Scroll to bottom whenever messages change
    useEffect(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, [messages]);

    return (
        <>
            <aside className={`bg-[#640D6B] border-r rounded-lg border-r-white md:w-[350px] h-full md:flex flex-col justify-between ml-2 mr-2 py-4 px-4 hidden`}>
                <div>
                    <h4 className='font-bold text-xl text-white text-center mt-2'>Chat Box</h4>
                    <div className='border-2 border-b-white mt-2'></div>
                </div>

                <div id='chatbox' className='w-full h-[80vh] scroll-auto overflow-auto  ' >
                    <ul className='text-white font-bold ' >
                        {
                            messages && messages.map((message) => (
                                <li className={`${message.username == userName ? "text-right" : "text-left"}  text-white px-2 my-2 text-md font-thin `}><Avatar name={message.username} size={30} round="10px" className='ml   -2' />{`  ${message.message}`}</li>
                            ))
                        }
                    </ul>
                    <div ref={messagesEndRef} />
                </div>

                <div >
                    <form onSubmit={addListItem} className='flex  gap-2'>
                        <input className=' outline-none rounded-md px-4 py-2 ' type="text" placeholder='chat message' onChange={(e) => setInput(e.target.value)} value={input} />
                        <button className='bg-green-600 px-2 rounded-md text-white font-bold' type='submit'>{">"}</button>
                    </form>
                </div>

            </aside>
        </>
    )
}

export default ChatBox