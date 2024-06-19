import React, { useEffect, useRef } from 'react'
import Avatar from 'react-avatar'
import { useState } from 'react';
import { useGlobalContext } from '../context/GlobalContext';
import { ACTIONS } from '../helpers/SocketActions';

function ChatBox({ messages, socketRef, roomId, displayChat, setDisplayChat, phoneStyle }) {

    const [input, setInput] = useState([])
    const { userName } = useGlobalContext();
    const messagesEndRef = useRef(null);

    const addListItem = (e) => {
        e.preventDefault();
        if (input) {
            socketRef.current.emit(ACTIONS.CHAT_MESSAGE, { roomId, message: input, username: userName });
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
            <aside className={`bg-PrimaryColor border-l border-gray-500  md:w-[450px] h-full md:flex flex-col justify-between  py-4 px-4 ml ${displayChat ? phoneStyle : 'hidden'} `}>
                {/* chatbox title */}
                <div>
                    <div className='flex justify-around'>
                        <h4 className='font-bold text-xl text-white text-center mt-2'>Chat Box</h4>
                        <div className='w-[40%] flex justify-end md:hidden '>
                            <h1 className='bg-ButtonColor text-md px-2 my-auto' onClick={() => setDisplayChat((prev) => !prev)}>X</h1>
                        </div>
                    </div>

                    <div className='border-2 border-b-white mt-2'></div>
                </div>

                <div id='chatbox' className='flex flex-col w-[95%]  h-[80vh] overflow-auto bg-SecondaryColor rounded-lg mt-2 md:m-0 ' >
                    {
                        messages && messages.map((message) => (
                            <div className={`${message.username == userName ? "justify-end" : "justify-Start"} flex gap-4 my-2 mx-2 `}>
                                <Avatar name={message.username} size={30} round="14px" className='ml-2 my-auto' />
                                <div className={`flex flex-col gap-2   text-white px-2 text-md font-thin my-auto  `}>
                                    <p className='text-[10px]  font-thin text-white'>{message.username}</p>
                                    <div className={`${message.username == userName ? "bg-ButtonColor text-white" : "bg-PrimaryColor text-white"}  h-auto  px-4 py-4 rounded-md text-sm  `}>
                                        {`${message.message}`}
                                    </div>
                                </div>
                            </div>
                        ))
                    }

                    <div ref={messagesEndRef} />
                </div>

                <div className='mt-2 w-full'>
                    <form onSubmit={addListItem} className='flex gap-2'>
                        <input className='w-full bg-SecondaryColor outline-none rounded-md px-4 py-2 text-white ' type="text" placeholder='chat message' onChange={(e) => setInput(e.target.value)} value={input} />
                        <button className='bg-green-600 px-4 rounded-full text-white font-bold' type='submit'>{">"}</button>
                    </form>
                </div>

            </aside>
        </>
    )
}

export default ChatBox