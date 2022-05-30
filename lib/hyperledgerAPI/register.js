const pushMessage = require('./../lineAPI/pushMessageAPI.js');
const signup = require('./../fabricAPI/signup.js');

const register = async (userId, lineBotToken) => {
    console.log('enter register function');
    try{
        //傳送給Hyperledger
        const address = signup.signup(userId);
        replyMessage = address;
        pushMessage.pushMessage(replyMessage, userId, lineBotToken);
    } catch(error){
        replyMessage = `fail :${error}`;
        pushMessage.pushMessage(replyMessage, userId, lineBotToken);
    }

}

module.exports = {
    register: register
}