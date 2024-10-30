import { io } from "socket.io-client";
export const initSocket = async () => {
    const options = {
        'force new connection': true,
        reconnectionAttempt: 'Infinity',
        timeout: 10000,
        transports: ['websocket'],
    };
    return io("https://onlinecodeserver.onrender.com", options);
};
//http://localhost:5000/
//https://onlinecodeserver.onrender.com