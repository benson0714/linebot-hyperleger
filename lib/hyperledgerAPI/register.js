const pushMessage = require('./../lineAPI/pushMessageAPI.js');
const signup = require('./../fabricAPI/signup.js');

const register = async (userId, lineBotToken) => {
    console.log('enter register function');
    try{
        //傳送給Hyperledger
        signup.signup(userId).then((address)=>{
            replyMessage = [{
                type: 'text',
                text: address
            }];
            pushMessage.pushMessage(replyMessage, userId, lineBotToken);
        });

    } catch(error){
        replyMessage = [{
            type: 'text',
            text: `fail :${error}`
        }];
        pushMessage.pushMessage(replyMessage, userId, lineBotToken);
    }

}

module.exports = {
    register: register
}