
let listMessages = [

];
const getListMesages = () => {
    return listMessages;
}
const createMessage = (messageInfo) => {
    listMessages = [...listMessages, messageInfo];
    return listMessages;
}

module.exports = {
    getListMesages,
    createMessage
};
