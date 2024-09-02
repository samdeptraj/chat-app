
const joinRoomForm = document.getElementById('joinRoomForm');
const btnJoinApp = document.getElementById('join_app');
// const socket = io();
joinRoomForm.addEventListener('submit', e => {
    const username = e.target.username.value;
    const roomname = e.target.roomname.value;
    // socket.emit("join room client to server", { username, roomname });
})

btnJoinApp.addEventListener('click', () => {
    localStorage.removeItem('user');

})