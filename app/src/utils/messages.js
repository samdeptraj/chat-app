
let listMessages = [

];
const getListMesages = () => {
  console.log('listMessages: ', listMessages);
  return listMessages;
}
const createMessage = (messageInfo) => {
  listMessages = [...listMessages, messageInfo];
  return listMessages;
}
const renderAllMessages = ({ username, roomname }) => {
  listMessages = listMessages.filter(item => item.roomname === roomname);
  let messageHtml = '';
  listMessages.map(item => {
    const checkUserSend = username === item.username;
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
  return messageHtml;
}
const renderListMesages = ({ roomname, listMessages, currentUser }) => {
  console.log('currentUser: ', currentUser);
  listMessages = listMessages.filter(item => item.roomname === roomname);
  let messageHtml = '';
  listMessages.map(item => {
    const checkUserSend = currentUser === item.username;
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
  return messageHtml;

}
const removeMesage = (username) => {
  listMessages = listMessages.filter(item => item.username !== username);
  return listMessages;
}
module.exports = {
  getListMesages,
  createMessage,
  renderListMesages,
  removeMesage,
  renderAllMessages
};
