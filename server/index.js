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

let clients = [];

io.on("connection", socket => {
    handleClientConnection(socket);
    socket.on("disconnect", () => handleClientDisconnection(socket));
});

const handleClientConnection = socket => {
    try {
        console.log("Client connected");
        clients.push(socket);
        socket.emit("message", "Hello!");
    }
    catch (error) {
        console.error(`Error: ${error.code}`);
    }
};

const handleClientDisconnection = socket => {
    try {
        console.log("Client disconnected");
        socket.emit("message", "Goodbye!");
        clients.delete(socket);
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
        clients.forEach(client => {
            doStuff(client);
        })
    },
    10000
);