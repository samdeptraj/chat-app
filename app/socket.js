const { Server } = require('socket.io');
const leoProfanity = require('leo-profanity'); // Import leo-profanity
const { createMessages } = require('./src/utils/create-messages');
const { getUserList, createUserList, removeUserOutRoom } = require('./src/utils/users');
const { createMessage, renderListMesages, removeMesage, renderAllMessages } = require('./src/utils/messages');
const initSocket = (server) => {
    const io = new Server(server);
    const welcome = "Chào mừng đến với live chat app";
    io.on('connection', (socket) => {
        socket.emit("welcome", welcome);
        // Xử lý sự kiện tham gia phòng
        socket.on('join room client to server', ({ username, roomname }) => {
            socket.join(roomname);
            socket.username = username; // Lưu tên người dùng
            socket.roomname = roomname; // Lưu tên phòng
            // Kiểm tra xem người dùng đã tồn tại trong danh sách hay chưa
            const existingUser = getUserList(roomname).find(user => user.username === username);

            if (!existingUser) {
                createUserList(socket.id, username, roomname);
            }

            io.to(roomname).emit("send user list from server to client", {
                listUser: getUserList(roomname),
                username,
                roomname
            });
            socket.broadcast.to(roomname).emit('notify', createMessages(`${username} đã tham gia phòng ${roomname}`));
            // Xử lý tin nhắn
            socket.on('chat message', (msg, { currentUser }) => {
                const isProfane = leoProfanity.check(msg);
                let messageText = '';
                if (isProfane) {
                    messageText = createMessages(socket.username + " không được nói bậy ***!");
                    // return callback("Không được nói bậy ***!");
                } else {
                    messageText = createMessages(msg);
                }
                io.to(socket.roomname).emit('message', {
                    username: socket.username,
                    roomname: socket.roomname,
                    messageText,
                    listMessages: createMessage({ username, roomname, messageText })
                }); // Gửi tin nhắn đến phòng hiện tại
                // callback();
                removeMesage("ADMIN")
            });
            // Xử lý chia sẻ vị trí
            socket.on("share location from client to server", ({ latitude, longitude }) => {
                const linkLocation = `<a href="https://www.google.com/maps/@${latitude},${longitude},15z" style="text-decoration: underline" target="_blank">Vị trí của tôi</a>`;
                const messageText = createMessages(linkLocation);
                io.to(socket.roomname).emit("message", {
                    username: socket.username,
                    roomname: socket.roomname,
                    messageText,
                    listMessages: createMessage({ username, roomname, messageText })
                });
            });
            socket.on('typing', ({ botName, messageTyping, currentUser }) => {
                const messageText = createMessages(messageTyping);
                io.to(socket.roomname).emit('display typing', renderListMesages(
                    {
                        roomname: socket.roomname,
                        listMessages: createMessage({ username: botName, roomname, messageText }),
                        currentUser
                    }
                ));
            })
            socket.on('stop typing', (currentUser) => {
                removeMesage("ADMIN")
                io.to(socket.roomname).emit('remove chatBot', renderListMesages({ roomname: socket.roomname, listMessages: removeMesage("ADMIN"), currentUser }))
            });

            // Xử lý sự kiện disconnect
            socket.on('disconnecting', () => {
                const userSockets = io.sockets.sockets;
                const isStillConnected = Array.from(userSockets).some(([id, socket]) => socket.username === socket.username);

                if (!isStillConnected) {
                    removeUserOutRoom(socket.id);
                    console.log(`User ${socket.username} disconnected`);
                    if (socket.roomname) {
                        io.to(socket.roomname).emit("send user list from server to client", {
                            listUser: getUserList(socket.roomname),
                            username: socket.username
                        });
                        io.to(socket.roomname).emit('notify', createMessages(`${socket.username} đã rời khỏi phòng ${socket.roomname}`));
                    }
                }
            });

        });
    });
}
module.exports = {
    initSocket
};
// case 1: open new tab is disable