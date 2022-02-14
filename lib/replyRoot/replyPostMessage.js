const pushMessage = require('./../lineAPI/pushMessageAPI.js');
const replyFlexMessage = require('./../lineAPI/replyFlexMessage.js');
const replyTemplateMessage = require('./../lineAPI/replyTemplateMessage.js');
const register = require('./../hyperledgerAPI/register.js');
const currency = require('./../hyperledgerAPI/currency.js');
const balanceFunc = require('./../hyperledgerAPI/balance.js');
const getAddress = require('./../hyperledgerAPI/getAddress.js');
const replyMessage = require('../example/replyMessage.js');

// wait for index.js("/") call this function
const replyPostback = async (events, lineBotToken) => {
    let userId = await events[0].source.userId;
    let string = await events[0].postback.data;
    string = string.split('&');
    let action = string[0].split('=');

    console.log(action[1]);
    if (action[1] === 'replyFlexMessage') {
        console.log('sucess enter replyFlexMessage');
        let message = await replyFlexMessage.postFlexMessage(lineBotToken, userId);
        return message;

    } else if (action[1] === 'template') {
        console.log('sucess enter template');
        let message = await replyTemplateMessage.postTemplateMessage(lineBotToken, userId, action[1]);
        return message;
    } else if (action[1] === 'confirm') {
        //if answer === yes
        if (string[1].split('=')[1] === 'yes') {
            console.log('user enter yes');

        } else if (string[1].split('=')[1] === 'no') {
            console.log('user enter no');
        }
    } else if (action[1] === 'register') {
        console.log('sucess enter register');
        let message = await register.register(userId, lineBotToken);
        return message;
    } else if (action[1] === 'myWallet') {
        // edit json
        await currency.currency('currency');
        let message = await replyTemplateMessage.postTemplateMessage(lineBotToken, userId, 'currency.json');
        return message;
    } else if (action[1] === 'currency') {
        //if answer === 1
        if (string[1].split('=')[1] === '1') {
            console.log('user enter 1');
            let message = await balanceFunc.balance(userId, lineBotToken, '1');
            return message;
        } else if (string[1].split('=')[1] === '2') {
            console.log('user enter 2');
            let message = await balanceFunc.balance(userId, lineBotToken, '2');
            return message;
        }
    } else if (action[1] === 'tradeOptions') {
        let message = await replyTemplateMessage.postTemplateMessage(lineBotToken, userId, 'tradeOptions.json');
        return message;
    } else if (action[1] === 'tradeOptionsAnswer') {
        //if answer === send
        if (string[1].split('=')[1] === 'send') {
            console.log('user enter send');
            let message = await replyTemplateMessage.postTemplateMessage(lineBotToken, userId, 'sendOptions.json');
            return message;
        } else if (string[1].split('=')[1] === 'recieve') {
            console.log('user enter recieve');
            let message = await replyTemplateMessage.postTemplateMessage(lineBotToken, userId, 'recieveOptions.json');
            return message;
        } else if (string[1].split('=')[1] === 'sendOptions') {
            console.log('user enter sendOptions');
            let message = await replyTemplateMessage.postTemplateMessage(lineBotToken, userId, 'sendOptionsAnswer.json');
            return message;
        } else if (string[1].split('=')[1] === 'recieveOptions') {
            console.log('user enter recieveOptions');
            let message = await replyTemplateMessage.postTemplateMessage(lineBotToken, userId, 'recieveOptionsAnswer.json');
            return message;
        } else if (string[1].split('=')[1] === 'sendQrcode') {
            console.log('user enter sendQrcode');
            let replyMessage = [{type: 'uri', uri: 'https://liff.line.me/1656864170-jApEEyN3'}];
            // open LIFF qrcode
            await pushMessage.pushMessage(replyMessage, userId, lineBotToken);
            // return message;
        } else if (string[1].split('=')[1] === 'sendAddress') {
            console.log('user enter sendAddress');
            // open LIFF let user enter address
            // return message;
        } else if (string[1].split('=')[1] === 'recieveQrcode') {
            // flex message
            console.log('user enter recieveOptions');
            let message = await replyFlexMessage.postFlexMessage(lineBotToken, userId, 'recieveQrcodeFlex.json');
            return message;
        } else if (string[1].split('=')[1] === 'recieveAddress') {
            console.log('user enter recieveAddress');
            // get address of user and print on line
            let message = await getAddress.getAddress(userId, lineBotToken);
            return message;
        }
    }
}

module.exports = {
    replyPostback: replyPostback,
}