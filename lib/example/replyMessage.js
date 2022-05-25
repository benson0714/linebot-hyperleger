const rp = require('request-promise');
const richMenu = require('./richMenu.js');
const replyMessageAPI = require('./../lineAPI/replyMessageAPI.js');
const pushMessage = require('./../lineAPI/pushMessageAPI.js');


// enter message by yourself
const replyMessage = async (events, lineBotToken, resObject) => {
    // print replytoken & message
    console.log(`userId = ${events[0].source.userId}`);


    let replyToken = events[0].replyToken
    console.log(`replyToken = ${replyToken}`);
    let userId = events[0].source.userId;
    console.log(`userId = ${userId}`);
    let message;
    message = events[0].message.text;
    console.log(`message : ${message}`);
    let replyMessage = [];


    // while message = listRichMenu, GET list rich menu from line server
    if (message === 'listRichMenu') {
        async function getRichMenu(richMenu, lineBotToken) {
            result_list = await richMenu.getListId(lineBotToken);
            console.log(result_list.join('-'));
            return result_list.join('-');
        }
        let result = await getRichMenu(richMenu, lineBotToken)
        replyMessage = [{
            type: 'text',
            text: result
        }]
        replyMessageAPI.postMessage(replyMessage, replyToken, lineBotToken);
    // create new rich menu(update a rich menu)
    } else if (message === 'createRichMenu') {
        let options = {
            method: 'GET',
            uri: 'https://line-sdk-test.herokuapp.com/create',
            json: true
        }
        rp(options);
        // flex message
    } else if (message === 'flex') {
        let options = {
            method: 'POST',
            uri: 'https://line-sdk-test.herokuapp.com/flexMessage',
            body: {
                "userId": userId,
            },
            json: true
        };
        rp(options);
    } else if(message === 'template') {
        let options = {
            method: 'POST',
            uri: 'https://line-sdk-test.herokuapp.com/template',
            body: {
                "userId": userId,
            },
            json: true
        };
        rp(options);
    }else {
        replyMessage = [{
            type: 'text',
            text: message
        }]
        replyMessageAPI.postMessage(replyMessage, replyToken, lineBotToken);
    }
};





module.exports = {
    replyMessage: replyMessage,
}
