document.addEventListener('DOMContentLoaded',()=>{
    console.log('rooms js Online');
    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    // When connected, configure buttons
    socket.on('connect', () => {
        document.querySelector('#btn-add-room').onclick=()=>{
            let val = document.querySelector('#in-room-name').value;
            console.log(val);
            console.log('data emitted')
            socket.emit('createRoom',{"rname":val})
            return false; //stop the form from being submitted
        }
    });

    socket.on("roomresponse",data=>{
        console.log('data received')
        if (data.success){
            const li = document.createElement('li');
            li.innerHTML = data.rname;
            document.querySelector('#id-room-list').append(li);
        }


    });
});