const pushMessage = require('./../lineAPI/pushMessageAPI.js');

const register = (userId, lineBotToken) => {
    console.log('enter register function');
    let status = true;
    let message = 'fail';
    let replyMessage = [];
    if (status === true) {
        message = 'sucess';
        replyMessage = [{
            type: 'text',
            text: message
        }]
    } else {
        replyMessage = [{
            type: 'text',
            text: message
        }]
    }
    pushMessage.pushMessage(replyMessage, userId, lineBotToken);
}

module.exports = {
    register: register
}