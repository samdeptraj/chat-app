const { format } = require('date-fns');
const createMessages = (message) => {
    return {
        messageText: message,
        created: format(new Date(), 'hh:mm a')
    }
}
module.exports = {
    createMessages
};
