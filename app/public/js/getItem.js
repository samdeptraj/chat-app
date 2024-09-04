const renderListMessages2 = ({ username, roomname, messageText, listMessages, location }) => {
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
}

export default renderListMessages2;