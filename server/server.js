const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');


const { generateMessage, generateLocationMessage, generateImageMessage } = require('./utils/message');
const { isValidString } = require('./utils/validation');
const { Users } = require('./utils/users');


const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('createMessage', (message, callback) => {
    let user = users.getUser(socket.id);

    if (user && isValidString(message.text)) {

      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
      callback();
    }
  });

  socket.on('createImageMessage', (message, callback) => {
    let user = users.getUser(socket.id);
    if(user && isValidString(message.image)){
      io.to(user.room).emit('newImageMessage', generateImageMessage(user.name, message.image));
      callback();
    }
  });


  socket.on('createLocationMessage', (coords) => {
    let user = users.getUser(socket.id);

    if (user) {
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
    }

  });

  socket.on('join', (params, callback) => {

    if (!isValidString(params.name) || !isValidString(params.room)) {
      return callback('Error: Name and Room are required!');
    }

    // If user entered is valid

    // Join him in the room
    socket.join(params.room.toLowerCase());

    // Remove him from users array(in case he is already present in other room)
    users.removeUser(socket.id);

    // Add user to users array
    users.addUser(socket.id, params.name, params.room);

    // Send client list of all users in this room for rendering in sidebar
    io.to(params.room).emit('updateUserListAndRoomName', { usersList: users.getUserList(params.room), roomName: params.room });

    socket.emit('newMessage', generateMessage("Admin", "Welcome to the chat app"));

    socket.broadcast.to(params.room).emit('newMessage', generateMessage("Admin", `${params.name} has Joined`));

    callback();

  });



  socket.on('fetchAllRooms', (callback) => {
    let rooms = users.getRooms();
    callback(rooms);

  });
  // Radio Broadcast implement later
  // socket.on('radio', function (blob) {

  //   let user = users.getUser(socket.id);

  //   if (user) {
  //     socket.broadcast.to(user.room).emit('voice', blob);
  //   }
  // });

  // Future Implementation for personal chat message
  //   socket.on('personalMessgeBeginRequest', (params, callback)=>{

  //     let user1 = socket.id;
  //     let user2 = params.to;
  //     users.createPersonalRoom(user1, user2);

  //     callback(users.getPersonalRoom(user1, user2));
  //   });

  socket.on('disconnect', () => {
    let user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left :(`))
    }
  });
});

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
