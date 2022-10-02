const rp = require('request-promise');
const richMenu = require('./richMenu.js');
const replyMessageAPI = require('./../lineAPI/replyMessageAPI.js');

// enter message by yourself
const replyMessage = async (events, lineBotToken) => {
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
        console.log('create rich menu');
        // delete old rich menu
        let deleteRichMenu = await richMenu.deleteList(lineBotToken)
        //create rich menu
        let createDefaultRichMenu = await richMenu.createRichMenu(lineBotToken);
        let richMenuId = createDefaultRichMenu.richMenuId;
        console.log(richMenuId);
        // upload rich menu image
        let uploadRichMenuImageData = await richMenu.uploadRichMenuImage(richMenuId, `Benson.jpg`, lineBotToken);
        // Set default rich menu
        let setDefaultRichMenuData = await richMenu.setDefaultRichMenu(richMenuId, lineBotToken);
    }
};





module.exports = {
    replyMessage: replyMessage,
}
