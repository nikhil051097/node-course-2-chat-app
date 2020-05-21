var socket = io();

socket.on('connect', function () {
  console.log('Connected to server');
});



socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
  console.log('newMessage', message);
  let li = $('<li></li>');
  li.text(`${message.from}: ${message.text}`);
  $("#messages").append(li);

});


// socket.emit('createMessage', {
//   from: 'Nikhil',
//   text: 'Yup, that works!'
// }, function (messageFromServer) {
//   console.log('got it', messageFromServer);
// });

$("#message-form").submit(function (e) {
  e.preventDefault();
  socket.emit('createMessage', {
    text: $('[name=message]').val(),
    from: 'Nikhil'
  }, function (messageFromServer) {
    // 
  });
})  