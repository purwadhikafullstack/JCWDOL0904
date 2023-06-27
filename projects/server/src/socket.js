const { Server } = require('socket.io');

const initSocket = (server) => {
    const io = new Server(server);

    io.on('connection', (socket) => {
        console.log('A user connected.');

        socket.on('disconnect', () => {
            console.log('A user disconnected.');
        });
    });

    return io;
};

module.exports = initSocket;