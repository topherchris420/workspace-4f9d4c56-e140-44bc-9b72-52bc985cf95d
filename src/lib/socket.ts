import { Server } from 'socket.io';

// Application state
let currentApparatus: 'biefeld-brown' | 'flux-capacitor' | 'zinsser' | 'electrokinetic-saucer' = 'biefeld-brown';
let isPlaying = true;
let phase: 'construction' | 'simulation' | 'deconstruction' = 'construction';

const apparatusSequence = [
  'biefeld-brown',
  'flux-capacitor',
  'zinsser',
  'electrokinetic-saucer'
] as const;

let phaseTimer: NodeJS.Timeout | null = null;
let apparatusTimer: NodeJS.Timeout | null = null;

const phaseDuration = 8000;
const apparatusInterval = phaseDuration * 3;

const stopAnimationLoop = () => {
  if (phaseTimer) {
    clearInterval(phaseTimer);
    phaseTimer = null;
  }
  if (apparatusTimer) {
    clearInterval(apparatusTimer);
    apparatusTimer = null;
  }
}

const startAnimationLoop = (io: Server) => {
  console.log('Starting animation loop...');
  stopAnimationLoop();

  if (isPlaying) {
    console.log('Animation loop is playing.');
    phaseTimer = setInterval(() => {
      phase = phase === 'construction' ? 'simulation' : phase === 'simulation' ? 'deconstruction' : 'construction';
      console.log('Emitting newPhase:', phase);
      io.emit('newPhase', phase);
    }, phaseDuration);

    apparatusTimer = setInterval(() => {
      const currentIndex = apparatusSequence.indexOf(currentApparatus);
      const nextIndex = (currentIndex + 1) % apparatusSequence.length;
      currentApparatus = apparatusSequence[nextIndex];
      phase = 'construction';
      console.log('Emitting newState:', { currentApparatus, phase });
      io.emit('newState', { currentApparatus, phase });
    }, apparatusInterval);
  } else {
    console.log('Animation loop is paused.');
  }
};

export const setupSocket = (io: Server) => {
  startAnimationLoop(io);

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Send the current state to the new client
    console.log('Sending initial state to', socket.id);
    socket.emit('initialState', { currentApparatus, isPlaying, phase });
    console.log('Initial state sent to', socket.id);

    // Listen for apparatus changes and broadcast them
    socket.on('apparatusChange', (newApparatus: 'biefeld-brown' | 'flux-capacitor' | 'zinsser' | 'electrokinetic-saucer') => {
      currentApparatus = newApparatus;
      phase = 'construction';
      io.emit('newState', { currentApparatus, phase });
      startAnimationLoop(io); // restart the loop
    });

    // Listen for play/pause state changes and broadcast them
    socket.on('playPause', (newIsPlaying: boolean) => {
      isPlaying = newIsPlaying;
      io.emit('newPlayState', isPlaying);
      startAnimationLoop(io);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};