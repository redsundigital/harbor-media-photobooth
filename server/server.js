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
  // On remote app loaded:
  socket.on('remote-connected', (id) => {
    // Send message to kiosks with the remote id
    socket.broadcast.emit('remote-connected', id);
  });

  socket.on('take-snapshot', (id) => {
    socket.broadcast.emit('take-snapshot', id);
  });

  socket.on('snapshot-taken', (data) => {
    socket.broadcast.emit('snapshot-taken', data);
  });
});

// Start
server.listen(PORT, () => console.log('server listening on port ' + PORT));
