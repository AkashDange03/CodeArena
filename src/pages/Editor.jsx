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
    const [messages, setMessages] = useState([]);

    const [clients, setClients] = useState([{
        socketId: 1,
        username: "akash"
    }])

    const phoneStyle = "absolute w-full   z-10 block";
    const [menu, setMenu] = useState(false);
    const [displayChat, setDisplayChat] = useState(false)

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

            socketRef.current.on(ACTIONS.CHAT_MESSAGE, ({ username, message }) => {
                setMessages((prev) => { return [...prev, { username, message }] });
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
            socketRef.current.off(ACTIONS.CHAT_MESSAGE);
        }

    }, [])

    const RunCode = async () => {
        try {
            const code = codeRef.current;
            console.log(code);
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

                <aside className={`bg-PrimaryColor  border-r border-gray-500 mr-1 md:w-[20vw] h-full md:flex flex-col justify-between py-4 px-4 ${menu ? phoneStyle : 'hidden'}`}>
                    <div>
                        <div className='flex'>
                            <AppTitle />
                            <div className='w-[40%] flex justify-end md:hidden  '>
                                <h1 className='rounded-md text-md px-2 my-auto bg-ButtonColor' onClick={() => setMenu((prev) => !prev)}>X</h1>
                            </div>
                        </div>
                        <div className='text-white mt-2 '>
                            <div className='border-2 border-b-white '></div>
                            <h2 className='font-bold my-4'>connected</h2>
                            {/* connected clients */}
                            <div className='flex flex-col gap-2 bg-SecondaryColor h-[60vh] rounded-md overflow-auto'>
                                {
                                    clients && clients.map((client) => (
                                        <Client key={client.socketId} username={client.username} />
                                    ))
                                }
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-col gap-2 mt-2'>
                        <button className='bg-white text-black px-10 py-2 rounded-md' onClick={copyRoomId}>Copy Room Id</button>
                        <button className='bg-ButtonColor shadow hover:shadow-lg hover:bg-blue-600 px-10 py-2 rounded-md text-white font-bold' onClick={leave}>Leave</button>
                    </div>

                </aside>

                {/* editior window */}
                <aside className='flex w-[80vw] flex-col mx-1'>
                    <div className='flex justify-center'>
                        <button className='bg-ButtonColor shadow hover:shadow-lg hover:bg-blue-600 px-10 py-2 rounded-md my-2 text-white font-bold' onClick={RunCode}>{'> Run'}</button>
                    </div>
                    <div className='md:w-[61vw] w-full'>
                        <EditorComponent socketRef={socketRef} roomId={roomId} onCodeChange={(code) => codeRef.current = code} />
                    </div>
                    <div className='bg-PrimaryColor h-[40vh] '>
                        <textarea className='w-full h-[90%] bg-SecondaryColor text-white outline-none rounded-md  px-6 my-2' placeholder='output:' id="OutputBox" ref={outPutRef}>
                        </textarea>
                    </div>

                </aside>
                <div className='absolute top-[89%] right-[5%] md:hidden'>
                    <button className='bg-ButtonColor rounded-full px-4 py-4 ' onClick={()=>setDisplayChat((prev)=>!prev)}><i className="fa-brands fa-rocketchat "></i></button>
                </div>

                {/* chat window */}
                    <ChatBox messages={messages} socketRef={socketRef} roomId={roomId} setDisplayChat={setDisplayChat} displayChat={displayChat} phoneStyle={phoneStyle} />


            </div>

        </>
    )
}

export default Editor