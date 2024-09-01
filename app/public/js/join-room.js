
const joinRoomForm = document.getElementById('joinRoomForm');
// const socket = io();
joinRoomForm.addEventListener('submit', e => {
    const username = e.target.username.value;
    const roomname = e.target.roomname.value;
    // socket.emit("join room client to server", { username, roomname });

})
