import React, { useEffect, useRef, useState } from 'react'
import AppTitle from '../component/AppTitle'
import Client from '../component/Client'
import EditorComponent from '../component/EditorComponent'
import { initSocket } from '../helpers/socket';
import { ACTIONS } from '../helpers/SocketActions.js';
import { useGlobalContext } from '../context/GlobalContext';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
function Editor() {
    const socketRef = useRef(null);
    const codeRef = useRef(null);
    const dataContext = useGlobalContext();
    const navigate = useNavigate();
    const {roomId} = useParams()
    const [clients, setClients] = useState([
        {
            socketId: 1,
            username: "akash dange"
        },
        {
            socketId: 2,
            username: "Jhone doe"
        },
        {
            socketId: 3,
            username: "Tukaram Dange"
        },
       

    ])


    useEffect(()=>{
        const init = async()=>{
            socketRef.current =  await initSocket();
            socketRef.current.on('connect_error', (err) => handleErrors(err));
            socketRef.current.on('connect_failed', (err) => handleErrors(err));

            function handleErrors(e) {
                console.log('socket error', e);
                toast.error('Socket connection failed, try again later.');
                navigate('/');
            }

            socketRef.current.emit(ACTIONS.JOIN,{
                roomId,
                username:dataContext.userName
            })

            //listening to joined event 
            socketRef.current.on(ACTIONS.JOINED,({clients,username,socketId})=>{
                setClients(clients);
                console.log(username);
                if (username !== dataContext.userName) {
                    toast.success(`${username} joined the room.`);
                    console.log(`${username} joined`);
                }

                socketRef.current.emit(ACTIONS.SYNC_CODE,{
                    socketId,
                    code:codeRef.current
                })
                
            })


            //listening for diconnecting
            socketRef.current.on(ACTIONS.DISCONNECTED,({socketId,username})=>{
                toast.success(`${username} left the room`);
                setClients((prev)=>{
                    return prev.filter((client)=>client.socketId!==socketId)
                })
            })
        }

        init()

        return ()=>{
            socketRef.current.disconnect();
            socketRef.current.off(ACTIONS.JOINED);
            socketRef.current.off(ACTIONS.DISCONNECTED);
        }

    },[])

    const copyRoomId= async()=>{
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success('Room ID has been copied to your clipboard');
        } catch (err) {
            toast.error('Could not copy the Room ID');
            console.error(err);
        }
    }

    const leave = ()=>{
        navigate("/");
    }

    return (
        <>
            {/* wrapper */}
            <div className='flex w-full h-[100vh]'>
                {/*left side container */}
                <aside className=' bg-[#640D6B] w-[300px] h-full flex flex-col justify-between py-4 px-4'>
                    <div>
                        <AppTitle />
                        <div className='text-white mt-2'>
                            <div className='border-2 border-b-white '></div>
                            <h2 className='font-bold my-4'>connected</h2>
                            {/* connected clients */}
                            <div className='flex flex-wrap'>
                                {
                                    clients.map((client) => (
                                        <Client key={client.socketId} username={client.username} />
                                    ))
                                }
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-col gap-2'>
                        <button className='bg-white text-black px-10 py-2 rounded-md' onClick={copyRoomId}>Copy Room Id</button>
                        <button className='bg-green-500 px-10 py-2 rounded-md' onClick={leave}>Leave</button>
                    </div>

                </aside>

                {/* Right side container */}
                <aside className='w-[80%] mx-auto'>
                    <EditorComponent socketRef={socketRef} roomId={roomId} onCodeChange={(code)=>codeRef.current=code} />
                </aside>            

            </div>

        </>
    )   
}

export default Editor