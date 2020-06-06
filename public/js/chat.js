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
    ol.append($(`<li class="sidebar__user" id='${user.id}'></li>`).text(user.name));
  });
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

// On receive newImage Message
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

$("#send-image-icon").on('click', function(){
  $("#send-image-icon").attr('disabled', true);
  $("#close-image-icon").attr('disabled', true);
  $('#send-image-icon').off('click');
  $('#close-image-icon').off('click');

  socket.emit('createImageMessage', {
    image: $("#image-to-send").attr('src')
  }, function(){
    $("#image-to-send-container > img").attr('src','');
    $("#image-to-send-container").css({"display": "none"});
    $('#send-image-icon').on('click');
    $('#close-image-icon').on('click');
    $("#send-image-icon").attr('disabled', false);
    $("#close-image-icon").attr('disabled', false);
  });
});

$("#close-image-icon").on('click', function(){

  $("#image-to-send-container > img").attr('src','');
  $("#image-to-send-container").css({"display": "none"});
});

socket.on('newImageMessage', function (message) {

  let formattedTime = moment(message.createdAt).format('h:mm a');

  let template = $('#image-message-template').html();
  let html = Mustache.render(template, {
    image: message.image,
    from: message.from,
    createdAt: formattedTime
  });

  $("#messages").append(html);
  $('.materialboxed').materialbox();
  scrollToBottom();


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

// To leave the room
$("#leave-room").click(function(){
  localStorage.clear();
  window.location.href = '/';
});


$("#open-image-modal").on('click', function(){
  $("#image-file").click();
})

$("#image-file").on('change', async function(e){
  filename = this.files[0].name;
  let result = await toBase64(this.files[0]);
  if(result){
    $("#image-to-send-container > img").attr('src',result);
    $("#image-to-send-container").css({"display": "block"});
  }
  
});

const toBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});





// Implementing personal message feature
// $("body").on('click','.sidebar__user', function(e){
//   console.log(e.target.id);
//   socket.emit('personalMessgeBeginRequest',{ to: e.target.id},function(data){
//     console.log(data)
//   });
// });

// Implementing voice feature
// navigator.mediaDevices.getUserMedia(constraints).then(function(mediaStream) {
//     var mediaRecorder = new MediaRecorder(mediaStream);
//     mediaRecorder.onstart = function(e) {
//         this.chunks = [];
//     };
//     mediaRecorder.ondataavailable = function(e) {
//         this.chunks.push(e.data);
//     };
//     mediaRecorder.onstop = function(e) {
//         var blob = new Blob(this.chunks, { 'type' : 'audio/ogg; codecs=opus' });
//         socket.emit('radio', blob);
//     };

//     // Start recording
//     mediaRecorder.start();

//     // Stop recording after 5 seconds and broadcast it to server
//     setTimeout(function() {
//         mediaRecorder.stop()
//     }, 5000);
// });



// When the client receives a voice message it will play the sound
// socket.on('voice', function (arrayBuffer) {
//   var blob = new Blob([arrayBuffer], { 'type': 'audio/ogg; codecs=opus' });
//   var audio = document.createElement('audio');
//   audio.src = window.URL.createObjectURL(blob);
//   audio.play();
// });


// Implementaion for future to handle ow
// socket.on('myNewMessage', function (message) {

//   let formattedTime = moment(message.createdAt).format('h:mm a');

//   let template = $('#message-template').html();
//   let html = Mustache.render(template, {
//     text: message.text,
//     from: message.from,
//     createdAt: formattedTime,
//     class: 'ownMessage'
//   });

//   $("#messages").append(html);
//   scrollToBottom();

// });
