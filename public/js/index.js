var socket = io();

socket.on('connect', function () {
  console.log('Connected to server');
});



socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

// function generateFromAndTimeSpan(){
//   <span></span>
// }

socket.on('newMessage', function (message) {
  
  let formattedTime  = moment(message.createdAt).format('h:mm a');

  let li = $('<li></li>');
  li.html(`<span style="font-weight: bolder">${message.from}</span> ${formattedTime}: ${message.text}`);
  $("#messages").append(li);

});

$("#message-form").submit(function (e) {
  e.preventDefault();

  var messageTextBox = $('[name=message]');
  socket.emit('createMessage', {
    text: messageTextBox.val(),
    from: 'Nikhil'
  }, function (messageFromServer) {
    messageTextBox.val('');
  });
})

socket.on('newLocationMessage', function (message) {
  let formattedTime  = moment(message.createdAt).format('h:mm a');

  let li = $('<li></li>');
  let a = $('<a target="_blank"> My Current Location</a>')
  li.html(`<span style="font-weight: bolder">${message.from}</span> ${formattedTime}: ${message.text}`);
  a.attr("href", message.url);
  li.append(a);
  $("#messages").append(li);
});

$("#send-location").on('click', function () {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser');
  }

  let locationButton = $("#send-location");
  locationButton.attr('disabled', 'disabled').text('Sending Location...');

  navigator.geolocation.getCurrentPosition(function (position) {
    locationButton.removeAttr('disabled').text('Send Location');
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    })
  }, function () {
    locationButton.removeAttr('disabled').text('Send Location');
  });

})

