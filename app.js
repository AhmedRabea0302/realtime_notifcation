const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors')

const app = express();
const server = http.createServer(app);

const io = socketIO(server, {
    cors: {
      origin: "*",
    }
});

app.use(express.static(__dirname + '/public'));
app.use(cors())

// Middleware 
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
})

io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Send a member joining request
app.post('/api/v1/send-join-meeting-request', function (req, res) {    
  io.emit('receive-join-chanel', req.body);
  res.end();

  console.log('Received join request');
})  

// Start a meeting
app.post('/api/v1/start-meeting-request', function (req, res) {    
  io.emit('start-meeting-chanel', req.body);
  res.end();

  console.log('Received Start Meeting request');
}); 

// Join a meeting
app.post('/api/v1/join-meeting', function (req, res) {    
  io.emit('join-meeting-chanel', req.body);
  res.end();
  
  console.log('Received join Meeting');
});


const PORT = process.env.PORT || 3006;

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
