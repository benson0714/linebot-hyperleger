const pushMessage = require('./../lineAPI/pushMessageAPI.js');

const balance = (userId, lineBotToken, coin) => {
    console.log('enter register function');
    let status = true;
    let message = 'fail';
    let replyMessage = [];
    if (coin === '1') {
        message = 'Coin 1 balance :';
        replyMessage = [{
            type: 'text',
            text: message
        }]
    } else if(coin === '2') {
        message = 'Coin 2 balance :';
        replyMessage = [{
            type: 'text',
            text: message
        }]
    }
    pushMessage.pushMessage(replyMessage, userId, lineBotToken);
}

module.exports = {
    balance: balance
}