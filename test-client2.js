const { io } = require('socket.io-client');

const socket = io('http://localhost:3000', { path: '/api/socketio' });

socket.on('connect', () => {
  console.log('Connected to server!');
});

socket.on('message', (msg) => {
  console.log('Received message:', msg);
});

socket.on('time', (time) => {
  console.log('Received time:', time);
});

socket.on('disconnect', () => {
  console.log('Disconnected from server.');
});
