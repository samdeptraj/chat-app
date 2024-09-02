
//tao yeu cau ket noi
const socket = io();
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#form-messages");
  const input = document.querySelector(".input-chat");
  const messages = document.getElementById("chat-messages");
  const btnShareLocation = document.querySelector('.btn-share-location');
  const container_messages = document.getElementById('app_list_user_container');
  const room_title = document.getElementById('room-title');
  const btnLogout = document.getElementById('logout');
  const inputChat = document.getElementById('input-chat');
  const btnSend = document.getElementById('btn-send');

  const queryString = location.search;
  const params = Qs.parse(queryString, {
    ignoreQueryPrefix: true
  });
  const { username, roomname } = params;
  socket.emit("join room client to server", { username, roomname });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    if (input.value) {
      socket.emit("chat message", input.value, { currentUser: user.username });
      input.value = "";
    }
  });

  btnShareLocation.addEventListener("click", () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      socket.emit("share location from client to server", {
        latitude,
        longitude
      });
    });
  });

  socket.on("welcome", (msg) => {
    console.log('Chào bạn: ', msg);
  });

  socket.on("share location from server to client", (linkLocation) => {
    console.log('Link location: ', linkLocation);
  });

  socket.on("notify", (message) => {
    console.log('Thông báo: ', message);
  });
  socket.on("message", ({ username, roomname, messageText, listMessages }, location) => {
    console.log('Tin nhắn: ', { username, messageText });
    const currentUser = JSON.parse(localStorage.getItem('user'));
    listMessages = listMessages.filter(item => item.roomname === roomname);
    let messageHtml = '';
    listMessages.map(item => {
      const checkUserSend = currentUser.username === item.username;
      const messageClass = checkUserSend ? 'chat-message-right' : 'chat-message-left';
      const spaceChat = checkUserSend ? 'pb-4' : 'mb-4';
      const userShowName = checkUserSend ? 'You' : item.username;
      return messageHtml += `
          <div class="${messageClass} ${spaceChat}">
              <div>
                <img
                  src="https://bootdey.com/img/Content/avatar/avatar1.png"
                  class="rounded-circle mr-1"
                  alt="Chris Wood"
                  width="40"
                  height="40"
                />
                <div class="text-muted small text-nowrap mt-2">
                  ${item.messageText.created}
                </div>
              </div>
              <div class="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">
                <div class="font-weight-bold mb-1">${userShowName}</div>
                  ${item.messageText.messageText ? item.messageText.messageText : location}
              </div>
            </div>
  `;
    })
    messages.innerHTML = messageHtml;
    messages.scrollTop = messages.scrollHeight;
    console.log('Tin nhắn: ', { username, messageText });
  });


  socket.on("send user list from server to client", ({ listUser, username, roomname }) => {
    const currentUser = localStorage.getItem('user');
    if (!currentUser) {
      localStorage.setItem('user', JSON.stringify({ username, roomname }));
    }
    let contentHtml = '';
    // room_title.innerHTML = listUser[0].roomname;
    listUser.map(item => {
      contentHtml += `
                <a
                href="#"
                class="list-group-item list-group-item-action border-0"
              >
                <div class="d-flex align-items-start">
                  <img
                    src="https://bootdey.com/img/Content/avatar/avatar2.png"
                    class="rounded-circle mr-1"
                    alt="William Harris"
                    width="40"
                    height="40"
                  />
                  <div class="flex-grow-1 ml-3">
                   ${item.username}
                    <div class="small">
                      <span class="fas fa-circle chat-online"></span> Online
                    </div>
                  </div>
                </div>
              </a>
            `
    })
    container_messages.innerHTML = contentHtml;

  })
  btnLogout.addEventListener('click', () => {
    localStorage.removeItem('user');
    window.location.href = 'http://localhost:8000/'
  })
  //chat typing
  // inputChat.addEventListener('focus', () => {
  //   const botName = 'ADMIN';
  //   const user = JSON.parse(localStorage.getItem('user'));
  //   const messageTyping = `${user.username} đang nhập tin nhắn ...`;
  //   console.log('user.username: ', user.username);
  //   socket.emit('typing', { botName, messageTyping, currentUser: user.username })
  // })
  // input.addEventListener('blur', () => {
  //   const user = JSON.parse(localStorage.getItem('user'));
  //   socket.emit('stop typing', { currentUser: user.username })
  // })
  // socket.on('display typing', (renderListMesages) => {
  //   messages.innerHTML = renderListMesages;
  //   messages.scrollTop = messages.scrollHeight;
  // })
  // socket.on('remove chatBot', (renderListMesages) => {
  //   messages.innerHTML = renderListMesages;
  //   messages.scrollTop = messages.scrollHeight;
  // })
});
