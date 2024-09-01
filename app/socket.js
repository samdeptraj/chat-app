const { Server } = require('socket.io');
const leoProfanity = require('leo-profanity'); // Import leo-profanity
const { createMessages } = require('./src/utils/create-messages');
const { getUserList, createUserList, removeUserOutRoom } = require('./src/utils/users');
const { createMessage } = require('./src/utils/messages');
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
            createUserList(socket.id, username, roomname);
            //xu ly userlist 
            io.to(roomname).emit("send user list from server to client", {
                listUser: getUserList(roomname),
                username
            });
            socket.broadcast.to(roomname).emit('notify', createMessages(`${username} đã tham gia phòng ${roomname}`));
            // Xử lý tin nhắn
            socket.on('chat message', (msg, callback) => {
                const isProfane = leoProfanity.check(msg);
                if (isProfane) {
                    const messageText = createMessages(socket.username + " không được nói bậy ***!");
                    io.to(socket.roomname).emit("message", {
                        username: socket.username,
                        roomname: socket.roomname,
                        messageText,
                        listMessages: createMessage({ username, roomname, messageText })
                    });
                    return callback("Không được nói bậy ***!");
                }
                const messageText = createMessages(msg);
                io.to(socket.roomname).emit('message', {
                    username: socket.username,
                    roomname: socket.roomname,
                    messageText,
                    listMessages: createMessage({ username, roomname, messageText })
                }); // Gửi tin nhắn đến phòng hiện tại
                callback();
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

        });

        // Xử lý sự kiện disconnect
        socket.on('disconnect', () => {
            removeUserOutRoom(socket.id);
            console.log(`User ${socket.username} disconnected`);
            if (socket.roomname) {
                io.to(socket.roomname).emit("send user list from server to client", {
                    listUser: getUserList(socket.roomname),
                    username: socket.username
                });
                io.to(socket.roomname).emit('notify', createMessages(`${socket.username} đã rời khỏi phòng ${socket.roomname}`));
            }
        });
    });
};


module.exports = {
    initSocket
};

//case 1: open new tab is disable