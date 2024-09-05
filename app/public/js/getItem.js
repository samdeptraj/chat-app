export const renderListMessages2 = ({ username, roomname, listMessages, currentUser, location }) => {
  console.log('username: ', username);
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
                 src="${checkUserSend ? 'http://localhost:8000' + currentUser.avatarUrl : (username === "ADMIN" ? 'https://bootdey.com/img/Content/avatar/avatar3.png' : 'https://ss-images.saostar.vn/wp700/pc/1655895094264/saostar-zemx7kpv9n1wnysy.jpg')}"
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
  return messageHtml;
}
