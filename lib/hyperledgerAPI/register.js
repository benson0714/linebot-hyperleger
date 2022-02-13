const rp = require('request-promise');
const replyMessageAPI = require('./../lineAPI/replyMessageAPI');

const register = (userId, lineBotToken) => {
    console.log('enter register function');
    let status = true;
    if (status === true) {
        let replyMessage = 'sucess';
        replyMessageAPI.postMessage(replyMessage, userId, lineBotToken);
    } else {
        let replyMessage = 'fail';
        replyMessageAPI.postMessage(replyMessage, userId, lineBotToken);
    }
}

module.exports = {
    register: register
}