require('dotenv').config();
const express = require('express');
const http = require('http');
const path = require('path');
const api = require('./api');
const socketIO = require('socket.io');

const buildDir = path.join(__dirname, '..', 'client', 'build');
const indexHtml = path.join(buildDir, 'index.html');
const PORT = process.env.PORT || 3001;
const app = express();
const server = http.createServer(app);

// Middleware
app.use(express.urlencoded({ extended: false, limit: '50mb', parameterLimit: 99999 }));
app.use(express.static(buildDir));
app.use(express.json());

// Routing - email
app.post('/email', api.handleEmailPhoto);

// Routing - files
app.get('*', (req, res) => res.sendFile(indexHtml));

// Socket setup
const io = socketIO(server);

io.on('connection', (socket) => {
  socket.on('camera-ready', (data) => {
    const { pairId } = data;
    console.log('camera-ready', data);
  });

  socket.on('remote-ready', (data) => {
    const { pairId } = data;
    console.log('remote-ready', data);

    // Broadcast the pairId to all sockets,
    // the client is listening for its pairId to continue.
    socket.broadcast.emit(pairId, { pairId });
  });

  // TODO: remove once Preview view is done on client-side
  socket.on('preview', () => {
    console.log('test');
  });

  // socket.on('disconnect', () => console.log('client disconnected'));
});

// Start
server.listen(PORT, () => console.log('server listening on port ' + PORT));

console.clear();
