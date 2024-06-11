import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { v4 as uuid } from 'uuid'
import { useGlobalContext } from '../context/GlobalContext';
import AppTitle from '../component/AppTitle';


function Home() {
    const navigate = useNavigate();
    const {userName,setUserName} = useGlobalContext();
    const[roomId , setroomId]=useState("");


    //creating room id
    const createRoomId =()=>{
        const id = uuid();
        // console.log(id);
        setroomId(id);
        toast.success("Room id created succefully")
    }


    const joinRoom = ()=>{
        if(!roomId || !userName){
            // console.log(userName);
            toast.error("Roomid an username required");
            return;
        }

        navigate(`/editor/${roomId}`)
    }

    return (
        <>
            {/* main container */}
            <div className='w-full h-[100vh] flex flex-col justify-center items-center'>

                {/* input container */}
                <div className='flex flex-col justify-center items-center w-[400px] h-auto bg-[#640D6B] text-white p-6 gap-4 rounded-md'>

                    {/* logo and app name */}
                    <AppTitle/>
                    <h4>Paste invitation room id below !</h4>

                    {/* input group */}
                    <div className='flex flex-col justify-center items-center w-full  gap-4'>

                        <input
                            className='w-full px-4 py-2 rounded-md text-black '
                            type="text"
                            placeholder='Enter room id'
                            onChange={(e)=>setroomId(e.target.value)}
                            value={roomId}
                        />

                        <input
                            className='w-full px-4 py-2 rounded-md text-black '
                            type="text"
                            placeholder='Enter username'
                            onChange={(e)=>setUserName(e.target.value)}
                            value={userName}
                        />

                        <div className='w-full flex justify-end'>
                            <button className='bg-green-500 px-10 py-2 rounded-md' onClick={joinRoom}>Join</button>
                        </div>

                        <span className='text-sm'>If you dont't have an invite please create <a className='underline underline-offset-1 text-green-400 ' href="#" onClick={createRoomId}>new room</a> </span>
                    </div>

                </div>

                <footer className=' mt-16 '>
                    <h4 className='text-white'>Made by <a href=""> Akash Dange ❤️</a></h4>
                </footer>

            </div>
        </>
    )
}

export default Home