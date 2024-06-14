import React, { useEffect, useRef, useState } from 'react'
import AppTitle from '../component/AppTitle'
import Client from '../component/Client'
import EditorComponent from '../component/EditorComponent'
import { initSocket } from '../helpers/socket';
import { ACTIONS } from '../helpers/SocketActions.js';
import { useGlobalContext } from '../context/GlobalContext';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { executeCode } from '../helpers/api.js';
import Avatar from 'react-avatar'
import ChatBox from '../component/ChatBox';

function Editor() {

    const socketRef = useRef(null);
    const codeRef = useRef(null);
    const outPutRef = useRef(null);
    const dataContext = useGlobalContext();//getting context values
    const navigate = useNavigate();
    const { roomId } = useParams();
    const [messages,setMessages]=useState([]);

    const [clients, setClients] = useState([{
        socketId: 1,
        username: "akash"
    }])

    const phoneStyle = "absolute w-full top-[50px]  z-10 block";
    const [menu, setMenu] = useState(false);

    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();
            socketRef.current.on('connect_error', (err) => handleErrors(err));
            socketRef.current.on('connect_failed', (err) => handleErrors(err));

            function handleErrors(e) {
                console.log('socket error', e);
                toast.error('Socket connection failed, try again later.');
                navigate('/');
            }

            socketRef.current.emit(ACTIONS.JOIN, {
                roomId,
                username: dataContext.userName
            })

            //listening to joined event 
            socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
                setClients(clients);
                console.log(username);

                if (username !== dataContext.userName) {
                    toast.success(`${username} joined the room.`);
                    console.log(`${username} joined`);
                }

                socketRef.current.emit(ACTIONS.SYNC_CODE, {
                    socketId,
                    code: codeRef.current
                })

                //listening to output_code
                socketRef.current.on(ACTIONS.OUTPUT_CODE, ({ output }) => {
                    if (output) {
                        outPutRef.current.value = output;
                    }
                })

            })

            socketRef.current.on('chat-message', ({ username, message }) => {
                setMessages((prev)=>{ return [...prev,{username,message}]});
            });


            //listening for diconnecting
            socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
                toast.success(`${username} left the room`);
                setClients((prev) => {
                    return prev.filter((client) => client.socketId !== socketId)
                })
            })
        }

        init()

        return () => {
            socketRef.current.disconnect();
            socketRef.current.off(ACTIONS.JOINED);
            socketRef.current.off(ACTIONS.DISCONNECTED);
            socketRef.current.off('chat-message');
        }

    }, [])

    const RunCode = async () => {
        try {
            const code = codeRef.current;
            const data = await executeCode(code);
            // console.log(data);
            outPutRef.current.value = data.run.output;

            //emmiting output to server
            socketRef.current.emit(ACTIONS.OUTPUT_CODE, {
                roomId,
                output: outPutRef.current.value
            })

        } catch (err) {
            console.error("Error running code:", err);
        }
    };

    const copyRoomId = async () => {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success('Room ID has been copied to your clipboard');
        } catch (err) {
            toast.error('Could not copy the Room ID');
            console.error(err);
        }
    }

    const leave = () => {
        navigate("/");
    }

   


    return (
        <>
            {/* wrapper */}
            <div className='flex w-full h-[100vh]'>
                {/*left side container */}
                <aside className='text-white pl-2 pt-2 md:hidden'>
                    <button className='font-bold text-xl border rounded-md px-2 pb-1 transition-all' onClick={() => setMenu(!menu)}>{menu ? "X" : "="}</button>
                </aside>
                <aside className={`bg-[#640D6B] border-r rounded-lg border-r-white md:w-[300px] h-full md:flex flex-col justify-between mr-2 py-4 px-4 ${menu ? phoneStyle : 'hidden'}`}>
                    <div>
                        <AppTitle />
                        <div className='text-white mt-2'>
                            <div className='border-2 border-b-white '></div>
                            <h2 className='font-bold my-4'>connected</h2>
                            {/* connected clients */}
                            <div className='flex flex-wrap'>
                                {
                                    clients && clients.map((client) => (
                                        <Client key={client.socketId} username={client.username} />
                                    ))
                                }
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-col gap-2'>
                        <button className='bg-white text-black px-10 py-2 rounded-md' onClick={copyRoomId}>Copy Room Id</button>
                        <button className='bg-green-600 px-10 py-2 rounded-md text-white font-bold' onClick={leave}>Leave</button>
                    </div>

                </aside>

                {/* Right side container */}
                <aside className='w-[80%] flex flex-col'>
                    <div className='flex justify-center'>
                        <button className='bg-green-600 px-10 py-2 rounded-md my-2 text-white font-bold' onClick={RunCode}>Run</button>
                    </div>
                    <EditorComponent socketRef={socketRef} roomId={roomId} onCodeChange={(code) => codeRef.current = code} />
                    <textarea className='h-[40vh] w-full bg-slate-900 text-white outline-none  px-6' placeholder='output:' id="OutputBox" ref={outPutRef}>
                    </textarea>
                </aside>

                {/* chat window */}
                <ChatBox messages={messages} socketRef={socketRef} roomId={roomId} />

            </div>

        </>
    )
}

export default Editor