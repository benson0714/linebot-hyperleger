const pushMessage = require('./../lineAPI/pushMessageAPI.js');
const chaincode = require('./../../fabric.js');

const register = (userId, lineBotToken) => {
    console.log('enter register function');
    try{
        //傳送給Hyperledger
        const result = chaincode.signup(userID);
        logger.info(`result: ${result}`);
        message = 'sucess';
        replyMessage = [{
            type: 'text',
            text: result
        }];
    } catch{
        replyMessage = [{
            type: 'text',
            text: `fail, :${result}`
        }];
    }
    pushMessage.pushMessage(replyMessage, userId, lineBotToken);
}

module.exports = {
    register: register
}