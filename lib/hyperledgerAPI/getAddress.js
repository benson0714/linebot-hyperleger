const pushMessage = require('./../lineAPI/pushMessageAPI.js');

const getAddress = (userId, lineBotToken) => {
    console.log('enter get Address function');
    let status = true;
    let address = 'dsjfiasdhfdshfhapfio';
    let replyMessage = [];
    if (status === true) {
        message = 'sucess';
        replyMessage = [{
            type: 'text',
            text: '地址 :'
        }, {
            type: 'text',
            text: address
        }]
    } else {
        replyMessage = [{
            type: 'text',
            text: 'fail'
        }]
    }
    pushMessage.pushMessage(replyMessage, userId, lineBotToken);
}

module.export = {
    getAddress: getAddress
}