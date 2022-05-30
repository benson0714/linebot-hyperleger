const pushMessage = require('./../lineAPI/pushMessageAPI.js');
const signup = require('./../fabricAPI/signup.js');

const register = (userId, lineBotToken) => {
    console.log('enter register function');
    try{
        //傳送給Hyperledger
        const address = signup.signup(userId);
        replyMessage = [{
            type: 'text',
            text: address
        },{
            type: 'text',
            text: "上方是您的地址"
        }];
    } catch(error){
        replyMessage = [{
            type: 'text',
            text: `fail :${error}`
        }];
    }
    pushMessage.pushMessage(replyMessage, userId, lineBotToken);
}

module.exports = {
    register: register
}