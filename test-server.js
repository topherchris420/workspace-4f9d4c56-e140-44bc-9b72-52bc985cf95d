const { createServer } = require('http');
const { Server } = require('socket.io');

const httpServer = createServer();
const io = new Server(httpServer, {
  path: '/api/socketio',
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.emit('message', 'welcome');

  const emitTime = () => {
    console.log('Emitting time');
    socket.broadcast.emit('time', new Date().toISOString());
    setTimeout(emitTime, 2000);
  }

  emitTime();
});

httpServer.listen(3000, () => {
  console.log('Test server listening on port 3000');
});
