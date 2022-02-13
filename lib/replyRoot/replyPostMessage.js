const rp = require('request-promise');
const replyFlexMessage = require('./../lineAPI/replyFlexMessage.js');
const replyTemplateMessage = require('./../lineAPI/replyTemplateMessage.js');
const register = require('./../hyperledgerAPI/register.js');
const currencyJSON = require('./../hyperledgerAPI/currencyJSON.js');

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

    } else if(action[1] === 'template') {
        console.log('sucess enter template');
        let message = await replyTemplateMessage.postTemplateMessage(lineBotToken, userId, action[1]);
        return message;
    } else if (action[1] === 'confirm') {
        //if answer === yes
        if(string[1].split('=')[1] === 'yes') {
            console.log('user enter yes');

        } else if(string[1].split('=')[1] === 'no') {
            console.log('user enter no');
        }
    } else if (action[1] === 'register') {
        console.log('sucess enter register');
        let message = await register.register(userId, lineBotToken);
        return message;
    } else if(action[1] === 'myWallet') {
        await currencyJSON.currencyJSON('currency');
        let message = await replyTemplateMessage.postTemplateMessage(lineBotToken, userId, 'currency');
        return message;
    } else if (action[1] === 'currency') {
        //if answer === yes
        if(string[1].split('=')[1] === '1') {
            console.log('user enter 1');

        } else if(string[1].split('=')[1] === '2') {
            console.log('user enter 2');
        }
    }
}

module.exports = {
    replyPostback: replyPostback,
}