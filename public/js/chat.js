var socket = io();
const constraints = { audio: true };

function scrollToBottom() {
  // Selectors
  let messages = $("#messages");
  let newMessage = messages.children('li:last-child');

  //Heights 
  let clientHeight = messages.prop('clientHeight');
  let scrollTop = messages.prop('scrollTop');
  let scrollHeight = messages.prop('scrollHeight');

  let newMessageHeight = newMessage.innerHeight();
  let lastMessageHeight = newMessage.prev().innerHeight();


  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }


}

socket.on('connect', function () {
  console.log('Connected to server');
  socket.emit('join', { name: localStorage["name"], room: localStorage["room"] },
    function (err) {
      if (err) {
        alert(err);
        window.location.href = "/";
        localStorage.clear();
      }
    });
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('updateUserListAndRoomName', function (userListAndRoomName) {

  $("#room-name").html(userListAndRoomName.roomName);

  let ol = $("<ol></ol>");
  userListAndRoomName.usersList.forEach(function (user) {
    ol.append($("<li></li>").text(user))
  })
  $("#users").html(ol);
});

// On receive newmessage
socket.on('newMessage', function (message) {

  let formattedTime = moment(message.createdAt).format('h:mm a');

  let template = $('#message-template').html();
  let html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });

  $("#messages").append(html);
  scrollToBottom();

});

// On receive newlocationmessage
socket.on('newLocationMessage', function (message) {

  let formattedTime = moment(message.createdAt).format('h:mm a');

  let template = $('#location-message-template').html();
  let html = Mustache.render(template, {
    url: message.url,
    from: message.from,
    createdAt: formattedTime
  });

  $("#messages").append(html);
  scrollToBottom();

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

});

// Submit message form
$("#message-form").on('submit', function (e) {
  e.preventDefault();

  var messageTextBox = $('[name=message]');
  socket.emit('createMessage', {
    text: messageTextBox.val(),
    from: 'Nikhil'
  }, function () {
    messageTextBox.val('');
  });
});

