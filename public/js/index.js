const socket = io();

socket.on('connect', function () {

    $(".select-room-field").html();

    socket.emit('fetchAllRooms', function (rooms) {

        $(".select-room-field").remove();

        let select = $("<select></select>");
        select.attr('name', 'select-room-field');
        select.attr('class', 'select-room-field');
        

        let option = $("<option></option>");
        option.text('select');
        option.attr('disabled', 'disabled');
        option.attr('selected', 'true');
        select.append(option);


        for (room in rooms) {
            let option = $("<option></option>")
            option.text(room);
            option.attr('val', room);
            select.append(option);
        }

        $('[name=room]').after(select)
    });

});


$("body").on('change', '.select-room-field', function (e) {
    $('[name=room]').val(e.target.value);
});