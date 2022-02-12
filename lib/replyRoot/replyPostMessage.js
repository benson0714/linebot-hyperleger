const rp = require('request-promise');
const replyTemplateMessage = require('./../requestServer/replyTemplateMessage.js');
const replyFlexMessage = require('./lib/requestServer/replyFlexMessage.js');

const replyPostback = async (events, lineBotToken) => {
    let userId = await events[0].source.userId;
    let string = await events[0].postback.data;
    string = string.split('&');
    let action = string[0].split('=');

    console.log(action[1]);
    if (action[1] === 'replyFlexMessage') {
        console.log('sucess enter replyFlexMessage');
        await replyFlexMessage.postFlexMessage(lineBotToken, userId);
    } else if(action[1] === 'template') {
        console.log('sucess enter template');
        await replyTemplateMessage.postTemplateMessage(lineBotToken, userId);

    } else if (action[1] === 'confirm') {
        //if answer === yes
        if(string[1].split('=')[1] === 'yes') {
            console.log('user enter yes');

        } else if(string[1].split('=')[1] === 'no') {
            console.log('user enter no');
        }
    }
}

module.exports = {
    replyPostback: replyPostback,
}