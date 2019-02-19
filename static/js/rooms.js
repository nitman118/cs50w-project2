document.addEventListener('DOMContentLoaded', () => {
    console.log("local storage" + localStorage.getItem('user_id'));
    console.log('rooms js Online');
    const user_id = localStorage.getItem('user_id'); // store user id info
    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    function setLinkClickProperty(room_identifier){
        console.log('before if:' + localStorage.getItem('currentRoom'));
        if (!localStorage.getItem('currentRoom')) {
            localStorage.setItem('currentRoom', room_identifier);
        }
        else {
            // console.log('else executed');
            console.log('inside else:' + localStorage.getItem('currentRoom'));
            socket.emit('leave', { 'user_id': user_id, 'rname': localStorage.getItem('currentRoom') });
            socket.emit('join', { 'user_id': user_id, 'rname': room_identifier });
            localStorage.setItem('currentRoom', room_identifier);
        }
      

        const li = document.createElement('li');
        li.innerHTML = "";
        li.innerHTML = "Room Joined";
        const ul = document.querySelector("#chatArea");
        ul.innerHTML = "";
        ul.append(li);

        socket.on('room_details', data => {
            console.log('returned Data:'+data);
            console.log('data length:'+data.length);
            const ul = document.querySelector("#chatArea");
            ul.innerHTML="";
            for (let i=0; i<data.length; i++) {
                const li = document.createElement('li');
                li.innerHTML = data[i];
                console.log('list'+li.innerHTML);
                ul.append(li);
            }
        });
    }
    // When connected, configure buttons

    const request = new XMLHttpRequest();
    request.open('POST','/getRooms');
    request.send();
    request.onload=function(){
        const data = JSON.parse(request.responseText);
        console.log('response text:'+data);
        console.log('response text:'+data.length);
        for(let i=0; i<data.length; i++){
            console.log('data:'+data[i]);
            const li = document.createElement('li');
            const room_identifier = data[i].split(' ').join('_');
            li.innerHTML = '<a href="#" id="' + room_identifier + '" data-room ="' + room_identifier + '">' + data[i] + '</a>';
            document.querySelector('#id-room-list').append(li);

        }
    };

    socket.on('connect', () => {
        // add a list of existing rooms
        document.querySelector('#btn-add-room').onclick = () => {
            let val = document.querySelector('#in-room-name').value;
            console.log(val);
            console.log('data emitted')
            socket.emit('createRoom', { "rname": val })
            return false; //stop the form from being submitted
        }
    });

    socket.on("roomresponse", data => {
        console.log('data received')
        if (data.success) {
            const li = document.createElement('li');
            const room_identifier = data.rname.split(' ').join('_');
            li.innerHTML = '<a href="#" id="' + room_identifier + '" data-room ="' + room_identifier + '">' + data.rname + '</a>';
            document.querySelector('#id-room-list').append(li);
            const r_id = "#" + room_identifier;
            document.querySelector(r_id).onclick = setLinkClickProperty(room_identifier);
            }
        else {
            alert('room name exists')
        }
    });

    const form = document.querySelector('#chatForm');
    form.onsubmit = function () {
        const text = document.querySelector('#ta-chat').value;
        socket.emit('message', { 'msg': text, 'rname': localStorage.getItem('currentRoom'), 'user_id': localStorage.getItem('user_id') });
        return false;
    }

    socket.on('message', data => {
        console.log(data);
        const li = document.createElement('li');
        li.innerHTML = data.msg;
        console.log(li);
        const ul = document.querySelector("#chatArea");
        ul.append(li);

    })
    // form.onsubm


});