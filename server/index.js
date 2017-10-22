const PORT = 3001;

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const index = require('./routes/index');
app.use(index);

const server = http.createServer(app);
//const io = socketIO.listen(server);
const io = socketIO(server);

const redis = require('redis');

let clients = {};

io.on("connection", socket => {
    handleClientConnection(socket);
    socket.on("disconnect", () => handleClientDisconnection(socket.id));
});

const handleClientConnection = socket => {
    try {
        console.log("Client connected");
        clients[socket.id] = {socket: socket};
        socket.emit("message", "Hello!");
    }
    catch (error) {
        console.error(`Error: ${error.code}`);
    }
};

const handleClientDisconnection = id => {
    try {
        console.log("Client disconnected");
        delete clients[id];
    }
    catch (error) {
        console.error(`Error: ${error.code}`);
    }
};

const doStuff = socket => {
    try {
        socket.emit("clients", clients.count());
    }
    catch (error) {
        console.error(`Error: ${error.code}`);
    }
};

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));

setInterval(
    () => {
        /*clients.forEach(client => {
            doStuff(client);
        });*/
        io.sockets.emit("message", "refresh")
        console.log("refresh");
    },
    5000
);