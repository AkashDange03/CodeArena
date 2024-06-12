import express from "express"
import { createServer } from "node:http";
import { Server } from "socket.io";
import { ACTIONS } from "./src/helpers/SocketActions.js";
import path from "node:path";
import { fileURLToPath } from 'url';

const app = express();
const server = createServer(app);
const io = new Server(server,{ cors: {
    origin: "*",  // You can restrict this to your frontend domain
    methods: ["GET", "POST"]
}});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(express.static(path.join(__dirname, './dist')));
// Fallback to index.html for single-page applications
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './dist/index.html'));
});

app.get("/", (req, res) => {
    res.send("<h1>hello worldd</h1>");
})


const userSocketMap = {}

//to get all the users connected to room

function getAllConnectedClients(roomId) {
    // Map
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
        (socketId) => {
            return {
                socketId,
                username: userSocketMap[socketId],
            };
        }
    );
}

io.on("connection", (socket) => {
    console.log("connected" + socket.id);

    //listening on join event
    socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
        // console.log("room id: " + roomId);
        userSocketMap[socket.id] = username;
        // console.log(userSocketMap)
        socket.join(roomId);
        const clients = getAllConnectedClients(roomId);
        // console.log(clients)

        clients.forEach(({ socketId }) => {

            //sending data to client
            io.to(socketId).emit(ACTIONS.JOINED, {
                clients,
                username,
                socketId: socket.id,
            });
        });
    })

    socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
        socket.to(roomId).emit(ACTIONS.CODE_CHANGE, {
            code
        })
    });

    socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
        io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
    });


    socket.on("disconnecting", () => {
        const rooms = [...socket.rooms]; // getting all rooms to which client is connected
        rooms.forEach((roomId) => {
            socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
                socketId: socket.id,
                username: userSocketMap[socket.id]
            })
        })
        delete userSocketMap[socket.id]; // deleting user from  map
        socket.leave();
    })
})

server.listen(5000, () => {
    console.log("server running on port 5000")
})