const { io } = require('socket.io-client');

const socket = io('http://localhost:3000', { path: '/api/socketio' });

socket.on('connect', () => {
  console.log('Connected to server!');
});

socket.on('initialState', (state) => {
  console.log('Received initial state:', state);
});

socket.on('newState', (state) => {
  console.log('Received new state:', state);
});

socket.on('newPhase', (phase) => {
  console.log('Received new phase:', phase);
});

socket.on('newPlayState', (isPlaying) => {
  console.log('Received new play state:', isPlaying);
});

socket.on('disconnect', () => {
  console.log('Disconnected from server.');
});
