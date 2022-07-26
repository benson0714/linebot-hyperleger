const replyMessage = require('./../lineAPI/replyMessageAPI.js');
const register = require('./../hyperledgerAPI/register.js');
const history = require('./../hyperledgerAPI/history.js');
const balanceFunc = require('./../hyperledgerAPI/balance.js');
const myWallet = require('./../hyperledgerAPI/myWallet.js');
const transfer = require('./../hyperledgerAPI/transfer.js');
const details = require('./../hyperledgerAPI/detalis.js');

// wait for index.js("/") call this function
const replyPostback = async (events, lineBotToken) => {
    const userId = await events[0].source.userId;
    let string = await events[0].postback.data;
    const replyToken = await events[0].replyToken;
    console.log(`replyToken=${replyToken}`);
    // eg.action=???&answer=1, string split action=??? & answer=1
    string = string.split('&');
    // eg. action=????, action split ????
    let action = string[0].split('=');
    console.log(action[1]);
    if(action[1] === 'show_address'){ 
        // get show_address postback action, send address to user
        replyMessage = [
        {
            type: 'text',
            text: '長按下方地址複製'
        },
        {
            type: 'text',
            text: string[1]
        }];
        const message = replyMessage.replyMessage(replyMessage, replyToken, lineBotToken);
        return message;
    }else if (action[1] === 'register') {
        console.log('sucess enter register');
        const message = await register.register(userId, lineBotToken, replyToken);
        return message;
    } else if (action[1] === 'myWallet') {
        const message = await myWallet.myWallet(lineBotToken, replyToken);
        return message;
    } else if (action[1] === 'transfer_balance') {
        const message = await balanceFunc.balance(userId, lineBotToken);
        return message;
    } else if(action[1]=== 'history'){
        const message = await history.history(userId, lineBotToken);
        return message;
    } else if(action[1] === 'carousel_history') {
        const tokenId = string[1].split('=')[1];
        console.log(`tokenId = ${tokenId}`);
        const tokenName = string[2].split('=')[1];
        const message = history.history(userId, tokenId, tokenName, lineBotToken);
        return message;
    } else if(action[1] === 'tf') {
        const address = string[1].split('=')[1];
        const tokenId = string[2].split('=')[1];
        const amount = string[3].split('=')[1];
        const jwtToken = string[4].split('=')[1];
        const message = transfer.transfer(userId, lineBotToken, address, tokenId, amount, jwtToken);
        return message;
    } else if(action[1] === "details") {
        const tokenId = string[1].split('=')[1];
        console.log(`tokenId = ${tokenId}`);
        const tokenName = string[2].split('=')[1];
        const balance = string[3].split('=')[1];
        const message = details.details(userId, tokenId, tokenName, balance, lineBotToken);
    }
}

module.exports = {
    replyPostback: replyPostback,
}