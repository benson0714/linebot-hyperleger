const rp = require('request-promise');
const richMenu = require('./richMenu.js');


module.exports = {
    replyMessage : async (events, lineBotToken, resObject) => {
        // print replytoken & message
        let replyToken = events[0].replyToken
        console.log(`replyToken = ${replyToken}`);
        let message = events[0].message.text
        console.log(`message : ${message}`);
        let replyMessage = [];

        let replyMsgFunc = () => {
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
        }

        let replyRichFunc = () => {
            //while message = listRichMenu, GET list rich menu from line server
            if(message === 'listRichMenu')  {
                let richMenuObj = await richMenu.listRichMenu(lineBotToken);
                console.log('1111111')
                console.log("22222222",lineBotToken)
                console.log("3333333333",richMenuObj);
                console.log("444444444")
            };
        }
        await replyMsgFunc();
        await replyRichFunc();
    
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
