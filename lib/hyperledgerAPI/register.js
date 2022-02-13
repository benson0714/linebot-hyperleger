const rp = require('request-promise');
const replyMessageAPI = require('./../lineAPI/replyMessageAPI');

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
        message = 'fail';
        replyMessage = [{
            type: 'text',
            text: message
        }]
    }
    replyMessageAPI.postMessage(replyMessage, userId, lineBotToken);
}

module.exports = {
    register: register
}