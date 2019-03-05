"use strict";
document.addEventListener('DOMContentLoaded', () => {
    //configure HandleBars
    const template = Handlebars.compile(document.querySelector('#chat-template').innerHTML); //chat message
    
    const user_id = localStorage.getItem('user_id'); // store user id info
    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    //define room click actions
    function setLinkClickProperty(room_identifier) {
        console.log('before if:' + localStorage.getItem('currentRoom'));
        if (!localStorage.getItem('currentRoom')) {
            localStorage.setItem('currentRoom', room_identifier);
            const room = document.getElementById(room_identifier); // grab the room link
            room.classList.add('is-active');   
            const roomHeader = document.getElementById('room-header').innerHTML=room.innerHTML;  
        }
        else {
            socket.emit('leave', { 'user_id': user_id, 'rname': localStorage.getItem('currentRoom') });
            const previouRoom = document.getElementById(localStorage.getItem('currentRoom')); // grab the room link
            previouRoom.classList.remove('is-active'); 
            socket.emit('join', { 'user_id': user_id, 'rname': room_identifier });
            const room = document.getElementById(room_identifier); // grab the room link
            room.classList.add('is-active'); 
            const roomHeader = document.getElementById('room-header').innerHTML=room.innerHTML;
            localStorage.setItem('currentRoom', room_identifier);
        }

        const cArea = document.querySelector("#chatArea");
        cArea.innerHTML = "";
        

        socket.on('room_details', data => {
            console.log('returned Data:' + data);
            console.log('data length:' + data.length);
            const chat_area = document.querySelector("#chatArea");
            chat_area.innerHTML=''; //empties the contents inside the div
            for (let i = 0; i < data.length; i++) {
                const user =data[i][0];
                const msg = data[i][1];
                const timestamp=data[i][2];
                const content = template({ 'user_name': user, 'msg': msg, 'timestamp': timestamp });
                chat_area.innerHTML += content;
            }
            chat_area.scrollTop=chat_area.scrollHeight; //scroll to the bottom
        });
    }
    // When connected, configure buttons

    const request = new XMLHttpRequest();
    request.open('POST', '/getRooms');
    request.send();
    request.onload = function () {
        const data = JSON.parse(request.responseText);
        for (let i = 0; i < data.length; i++) {
            console.log('data:' + data[i]);
            const li = document.createElement('li');
            const room_identifier = data[i].split(' ').join('_');
            li.innerHTML = '<a href="#" style="color: white;" id="' + room_identifier + '" data-room ="' + room_identifier + '">' + data[i] + '</a>';
            document.querySelector('#id-room-list').append(li);
            const r_id = "#" + room_identifier;
            document.querySelector(r_id).onclick = function () {
                setLinkClickProperty(room_identifier);
            };

        }
    };

    socket.on('connect', () => {
        // add a list of existing rooms
        document.querySelector('#btn-add-room').onclick = () => {
            let val = document.querySelector('#in-room-name').value;
            console.log(val);
            console.log('data emitted')
            document.querySelector('#in-room-name').value = '';
            socket.emit('createRoom', { "rname": val })
            return false; //stop the form from being submitted
        }
    });

    socket.on("roomresponse", data => {
        console.log('data received')
        if (data.success) {
            const li = document.createElement('li');
            const room_identifier = data.rname.split(' ').join('_');
            li.innerHTML = '<a href="#" style="color: white;" id="' + room_identifier + '" data-room ="' + room_identifier + '">' + data.rname + '</a>';
            document.querySelector('#id-room-list').append(li);
            const r_id = "#" + room_identifier;
            document.querySelector(r_id).onclick = function () {
                setLinkClickProperty(room_identifier);
            };
        }
        else {
            alert('room name exists')
        }
    });

    const form = document.querySelector('#chatMsg');
    form.onclick = function () {
        const text = document.querySelector('#ta-chat').value;
        document.querySelector('#ta-chat').value = '';
        const date = new Date();
        const dtStr = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
        socket.emit('message', { 'msg': text, 'rname': localStorage.getItem('currentRoom'), 'user_id': localStorage.getItem('user_id'),'timestamp':dtStr });

    }

    socket.on('message', data => {
        console.log(data);
        const date = new Date();
        const dtStr = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
        const content = template({ 'user_name': data.user, 'msg': data.msg, 'timestamp': dtStr });
        console.log(content);

        const chat_area = document.querySelector("#chatArea");
        chat_area.innerHTML += content;
        chat_area.scrollTop=chat_area.scrollHeight; //scroll to the bottom
    });
    // form.onsubm


});