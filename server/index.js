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
    socket.on("disconnect", () => handleClientDisconnection(socket));
});

const handleClientConnection = socket => {
    try {
        console.log("Client connected");
        clients[socket.id] = socket;
        socket.emit("id", socket.id);
    }
    catch (error) {
        console.error(`Error: ${error.code}`);
    }
};

const handleClientDisconnection = socket => {
    try {
        console.log("Client disconnected");
        delete clients[socket.id];
    }
    catch (error) {
        console.error(`Error: ${error.code}`);
    }
};

const doStuff = socket => {
    try {
        socket.emit("clients", Object.keys(clients).length);
    }
    catch (error) {
        console.error(`Error: ${error.code}`);
    }
};

function Cycle(clients, ...functions) {
    for (let id in clients) {
        if (clients.hasOwnProperty(id)) {
            for (let f in functions) {
                f(clients[id]);
            }
        }
    }
}

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));

let cycles = 0;

setInterval(
    () => {
        cycles++;
        for (let id in clients) {
            if (clients.hasOwnProperty(id)) {
                doStuff(clients[id]);
            }
        }
        io.sockets.emit("message", "refresh n°" + cycles);
    },
    1000
);