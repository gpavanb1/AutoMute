// server/index.js
const http = require('http');
const express = require('express');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const peers = {};

io.on('connection', (socket) => {
    socket.on('join', (roomId) => {
        socket.join(roomId);
        if (!peers[roomId]) {
            peers[roomId] = [];
        }
        peers[roomId].push(socket.id);

        socket.to(roomId).emit('new-peer', socket.id);

        socket.on('signal', ({ peerId, signalData }) => {
            io.to(peerId).emit('signal', { peerId: socket.id, signalData });
        });

        socket.on('disconnect', () => {
            peers[roomId] = peers[roomId].filter((id) => id !== socket.id);
            socket.to(roomId).emit('peer-disconnected', socket.id);
        });
    });
});

server.listen(5000, () => console.log('Server is running on port 5000'));
