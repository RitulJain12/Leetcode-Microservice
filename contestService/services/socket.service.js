let io;

function init(server) {
    io = require('socket.io')(server, {
        cors: {
            origin: "*", 
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log('A user connected to WebSocket:', socket.id);

        socket.on('join-contest', (contestId) => {
            socket.join(`contest_${contestId}`);
            console.log(`Socket ${socket.id} joined room: contest_${contestId}`);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected from WebSocket');
        });
    });

    return io;
}

function getIO() {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
}

function emitToContest(contestId, event, data) {
    if (io) {
        io.to(`contest_${contestId}`).emit(event, data);
    }
}

module.exports = {
    init,
    getIO,
    emitToContest
};
