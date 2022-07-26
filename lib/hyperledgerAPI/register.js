const replyMessageAPI = require('./../lineAPI/replyMessageAPI.js');
const signup = require('./../fabricAPI/signup.js');

const register = async (userId, lineBotToken, replyToken) => {
    console.log('enter register function');
    try{
        //傳送給Hyperledger
        await signup.signup(userId).then((address)=>{
            console.log(`register : ${address}`)
            replyMessage = [{
                type: "text",
                text: "註冊成功，以下為您的地址"
            },{
                type: 'text',
                text: address
            }];
            replyMessageAPI.replyMessage(replyMessage, userId, lineBotToken);
        });

    } catch(error){
        replyMessage = [{
            type: 'text',
            text: `fail :${error}`
        }];
        replyMessageAPI.replyMessage(replyMessage, replyToken, lineBotToken);
    }
}

module.exports = {
    register: register
}