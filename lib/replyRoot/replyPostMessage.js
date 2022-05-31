const pushMessage = require('./../lineAPI/pushMessageAPI.js');
const replyTemplateMessage = require('./../lineAPI/replyTemplateMessage.js');
const register = require('./../hyperledgerAPI/register.js');
const history = require('./../hyperledgerAPI/history.js');
const balanceFunc = require('./../hyperledgerAPI/balance.js');
const getAddress = require('./../hyperledgerAPI/getAddress.js');
const myWallet = require('./../hyperledgerAPI/myWallet.js')

// wait for index.js("/") call this function
const replyPostback = async (events, lineBotToken) => {
    let userId = await events[0].source.userId;
    let string = await events[0].postback.data;
    // eg.action=???&answer=1, string split action=???
    string = string.split('&');
    // eg. action=????, action split ????
    let action = string[0].split('=');
    console.log(action[1]);
    if (action[1] === 'template') {
        console.log('sucess enter template');
        let message = await replyTemplateMessage.postTemplateMessage(lineBotToken, userId, action[1]);
        return message;
    } else if(action[1] === 'show_address'){ 
        // get show_address postback action, send address to user
        replyMessage = [{
            type: 'text',
            text: string[1]
        }];
        let message = await pushMessage.pushMessage(replyMessage, userId, lineBotToken);
        replyMessage = [{
            type: 'text',
            text: '長按上方地址複製'
        }];
        message = await pushMessage.pushMessage(replyMessage, userId, lineBotToken);
        return message;
    }else if (action[1] === 'register') {
        console.log('sucess enter register');
        let message = await register.register(userId, lineBotToken);
        return message;
    } else if (action[1] === 'myWallet') {
        let message = await myWallet.myWallet(userId, lineBotToken);
        return message;
    } else if (action[1] === 'balance') {
        let message = await balanceFunc.balance(userId, lineBotToken);
        return message;
    } else if(action[1]=== 'history'){
        let message = await history.history(userId, lineBotToken);
        return message;
    } else if (string[1].split('=')[1] === 'sendAddress') {
        console.log('user enter sendAddress');
        // open LIFF let user enter address
        // return message;
    } else if (string[1].split('=')[1] === 'recieveQrcode') {
        // flex message
        console.log('user enter recieveOptions');
        let message = await myWallet.myWallet(lineBotToken, userId);
        return message;
    } else if (string[1].split('=')[1] === 'recieveAddress') {
        console.log('user enter recieveAddress');
        // get address of user and print on line
        let message = await getAddress.getAddress(userId, lineBotToken);
        return message;
    }
}

module.exports = {
    replyPostback: replyPostback,
}