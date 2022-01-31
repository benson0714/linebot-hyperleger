const rp = require('request-promise');
const richMenu = require('./richMenu.js');


module.exports = {
    replyMessage : async (events, lineBotToken, resObject) => {
        // print replytoken & message
        let replyToken = events[0].replyToken
        console.log(`replyToken = ${replyToken}`);
        console.log(events[0].message);
        let message;
        if(events[0].message !== undefined) {
             message = events[0].message.text;
        } else {
            message = events[2];
        }


        console.log(`message : ${message}`);
        let replyMessage = [];

        // while received a specific message reply some special message
        if(resObject[message] !== undefined) {
            replyMessage = [{
                type: 'text',
                text: message
            },
            {
                type: 'text',
                text: resObject[message]
            
            }]
        } else {
            //while message = listRichMenu, GET list rich menu from line server
            if(message === 'listRichMenu')  {
                async function getRichMenu(richMenu, lineBotToken) {
                    result_list = await richMenu.listRichMenu(lineBotToken);
                    console.log(result_list.join('-'));
                    return result_list.join('-');
                }
                let result = await getRichMenu(richMenu, lineBotToken)
                replyMessage = [{
                    type: 'text',
                    text: result
                }]
                //create new rich menu(update a rich menu)
            } else if(message === 'createRichMenu') {
                let options = {
                    method: 'GET',
                    uri: 'https://line-sdk-test.herokuapp.com/create',
                }
                rp(options);
            } else {
                replyMessage = [{
                    type: 'text',
                    text: message
                }]
            }
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
            console.log('err replyMessage = ', replyMessage);
        });
    }
}
