const pushMessage = require('./../lineAPI/pushMessageAPI.js');
const register = require('./../hyperledgerAPI/register.js');
const history = require('./../hyperledgerAPI/history.js');
const balanceFunc = require('./../hyperledgerAPI/balance.js');
const getAddress = require('./../hyperledgerAPI/getAddress.js');
const myWallet = require('./../hyperledgerAPI/myWallet.js');
const record = require('./../fabricAPI/record.js');

// wait for index.js("/") call this function
const replyPostback = async (events, lineBotToken) => {
    let userId = await events[0].source.userId;
    let string = await events[0].postback.data;
    // eg.action=???&answer=1, string split action=??? & answer=1
    string = string.split('&');
    // eg. action=????, action split ????
    let action = string[0].split('=');
    console.log(action[1]);
    if(action[1] === 'show_address'){ 
        // get show_address postback action, send address to user
        replyMessage = [{
            type: 'text',
            text: string[1]
        },
        {
            type: 'text',
            text: '長按上方地址複製'
        }];
        const message = await pushMessage.pushMessage(replyMessage, userId, lineBotToken);
        return message;
    }else if (action[1] === 'register') {
        console.log('sucess enter register');
        const message = await register.register(userId, lineBotToken);
        return message;
    } else if (action[1] === 'myWallet') {
        const message = await myWallet.myWallet(userId, lineBotToken);
        return message;
    } else if (action[1] === 'balance') {
        const message = await balanceFunc.balance(userId, lineBotToken);
        return message;
    } else if(action[1]=== 'history'){
        const message = await history.history(userId, lineBotToken);
        return message;
    } else if (string[1].split('=')[1] === 'sendAddress') {
        console.log('user enter sendAddress');
        // open LIFF let user enter address
        // return message;
    } else if(action[1].split('=')[1] === 'tokenId') {
        const transfer_id = string[1].split('=')[1];
    } else if(action[1].split('=')[1] === 'tokenId') {
        const tokenId = string[1].split('=')[1];
        console.log(`tokenId = ${tokenId}`);
        const message = record.record(userId, tokenId);
        return message;
    }
}

module.exports = {
    replyPostback: replyPostback,
}