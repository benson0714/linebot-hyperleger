const rp = require('request-promise');
const richMenu = require('./richMenu.js');


module.exports = {
    replyMessage : (events, lineBotToken, resObject) => {
        // print replytoken & message
        let replyToken = events[0].replyToken
        console.log(`replyToken = ${replyToken}`);
        let message = events[0].message.text
        console.log(`messge : ${message}`);
        let replyMessage = [];

        // while received a specific message reply some special message
        if(resObject[message] === undefined) {
            replyMessage = [{
                type: 'text',
                text: message
            }]
        } else {
            replyMessage = [{
                type: 'text',
                text: message
            },
            {
                type: 'text',
                text: resObject[message]
            }]
        };
        //while message = listRichMenu, GET list rich menu from line server
        if(message === 'listRichMenu')  {
            let richMenuObj = richMenu.listRichMenu(lineBotToken);
            console.log(richMenuObj);
            let richMenuList = richMenuObj.richmenus;
            // console.log(richMenuList);
            let replyRichMenu = [];

            for (let i = 0; i < richMenuList.length; i++) {
                replyRichMenu.push(richMenuList[i].richMenuId);
            }
            replyMessage = [{
                type: 'text',
                text: message
            },
            {
                type: 'text',
                text: replyRichMenu.join('-')
            }]
        };
    
        let rp_body = {
            replyToken: replyToken,
            messages: replyMessage
            };
        let options = {
            method: 'POST',
            url: 'https://api.line.me/v2/bot/message/reply',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${lineBotToken}`
            },
            json: true,
            body: rp_body
        };
        rp(options)
        .then((body) => {
            console.log('sucess');
        })
        .catch((err) => {
            console.log('err');
        });
    }
}
