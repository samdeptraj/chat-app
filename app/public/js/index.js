import { renderListMessages2 } from './getItem.js';
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
  const backgroundInput = document.getElementById('background-input');
  const backgroundContainer = document.getElementById('background-container');
  const emojiBtn = document.getElementById('emoji-btn');
  const emojiPicker = document.getElementById('emoji-picker');
  const inputUploadAvatar = document.getElementById('file-input');

  const queryString = location.search;
  const params = Qs.parse(queryString, {
    ignoreQueryPrefix: true
  });
  const { username, roomname } = params;
  socket.emit("join room client to server", { username, roomname });
  btnSend.addEventListener('click', () => {
    emojiPicker.style.display = 'none';
  })
  form.addEventListener("submit", (e) => {
    console.log("user gui tin");
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    if (input.value) {
      socket.emit("chat message", input.value, { currentUser: user.username });
      input.value = "";
    }
  });
  // const currentUser = JSON.parse(localStorage.getItem('user'));
  // socket.emit('render all messages cts', { currentUser });
  // socket.on('render all messages stc', (data) => {
  //   messages.innerHTML = data;
  //   messages.scrollTop = messages.scrollHeight;
  // });
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
  socket.on("message", ({ roomname, messageText, listMessages }, location) => {
    console.log("nahn tin");
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const rendersHTMl = renderListMessages2({ username, roomname, messageText, listMessages, location, currentUser });
    // console.log('Tin nhắn: ', { username, messageText });
    messages.innerHTML = rendersHTMl;
    messages.scrollTop = messages.scrollHeight;
  });


  socket.on("send user list from server to client", ({ listUser, username, roomname }) => {
    const currentUser = localStorage.getItem('user');
    if (!currentUser) {
      localStorage.setItem('user', JSON.stringify({ username, roomname, avatarUrl: '/images/avatars/avatar.png' }));
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
    // window.location.href = process.env.BASE_URL;
    window.location.href = 'http://localhost:8000/';
  })
  //chat typing
  inputChat.addEventListener('focus', () => {
    const botName = 'ADMIN';
    const user = JSON.parse(localStorage.getItem('user'));
    console.log('userfocus: ', user);
    const messageTyping = `<span>${user.username} đang nhập tin nhắn </span> <img src="https://cdn.pixabay.com/animation/2022/07/29/03/42/03-42-07-846_512.gif" style="width:25px;" alt=""/> `;
    socket.emit('typing', { botName, messageTyping, currentUser: user })
  })
  input.addEventListener('blur', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    socket.emit('stop typing', { currentUser: user.username })
  })
  socket.on('display typing', ({ roomname, listMessages }) => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const rendersHTMl = renderListMessages2({ roomname, listMessages, currentUser });
    messages.innerHTML = rendersHTMl;
    messages.scrollTop = messages.scrollHeight;
  })
  socket.on('remove chatBot', (listMessages) => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const rendersHTMl = renderListMessages2({ roomname, listMessages, currentUser });
    messages.innerHTML = rendersHTMl;
    messages.scrollTop = messages.scrollHeight;
  })
  //changer background
  backgroundInput.addEventListener('change', e => {
    const file = e.target.files[0];
    //check type img
    const allowType = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowType.includes(file.type)) {
      const messageText = 'File không đúng định dạng, yêu cầu "jpg", "png", "gif"';
      alert(messageText);
      backgroundInput.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = e => {
      const backgroundUrl = e.target.result;
      backgroundContainer.style.background = `url(${backgroundUrl})`;
      socket.emit('change background', { roomname, backgroundUrl });
    }
    reader.readAsDataURL(file); // onload goi sau khi readasdataurl doc file xong
  })
  socket.on('change background stc', ({ backgroundUrl }) => {
    backgroundContainer.style.background = `url(${backgroundUrl})`;
  })
  //set emoji
  emojiBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (emojiPicker.style.display === 'none') {
      emojiPicker.style.display = 'block';
    } else {
      emojiPicker.style.display = 'none';
    }
  })
  emojiPicker.addEventListener('emoji-click', e => {
    inputChat.value += e.detail.unicode;
  })
  //upload avatar 
  inputUploadAvatar.addEventListener('change', async (e) => {
    const formData = new FormData(form);
    formData.append('username', username);

    await fetch('/upload-avatar', {
      method: 'POST',
      body: formData
    }).then(res => res.json())
      .then(data => {
        console.log('data: ', data);
        const user = JSON.parse(localStorage.getItem('user'));
        localStorage.setItem('user', JSON.stringify({ username: user.username, roomname: user.roomname, avatarUrl: data.avatarUrl }));
        const currentUser = JSON.parse(localStorage.getItem('user'));
        socket.emit('render all messages cts', { currentUser });
        socket.on('render all messages stc', (data) => {
          messages.innerHTML = data;
          messages.scrollTop = messages.scrollHeight;
        });

        alert("Cập nhập avatar thành công");
      }).catch(error => {
        console.log('error: ', error);
      })
  })
});
