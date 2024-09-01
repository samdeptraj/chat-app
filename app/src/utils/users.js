let userList = [

]

const getUserList = (roomname) => {
    const userLikeRoom = userList.filter(item => item.roomname === roomname);
    console.log('userLikeRoom: ', userLikeRoom);
    return userLikeRoom;
}
const createUserList = (id, username, roomname) => {
    const checkUserExistsRoom = userList.findIndex(item => item.username === username);
    if (checkUserExistsRoom === -1) {
        userList = [...userList, { id, username, roomname }];
    }
    return userList;
}
const removeUserOutRoom = (id) => {
    const newUserList = userList.filter(item => item.id !== id);
    if (newUserList !== -1) {
        userList = newUserList;
        return newUserList;
    }
}
module.exports = {
    getUserList,
    createUserList,
    removeUserOutRoom
};
