const rp = require('request-promise');
const richMenu = require('./richMenu.js');

// enter message by yourself
const replyMessage = async (events, lineBotToken, resObject) => {
    // print replytoken & message
    let replyToken = events[0].replyToken
    console.log(`replyToken = ${replyToken}`);
    let userId = events[0].source.userId;
    console.log(`userId = ${userId}`);
    let message;
    message = events[0].message.text;
    console.log(`message : ${message}`);
    let replyMessage = [];

    // while received a specific message reply some special message
    if (resObject[message] !== undefined) {
        replyMessage = [{
            type: 'text',
            text: message
        },
        {
            type: 'text',
            text: resObject[message]

        }]
    } else {
        // while message = listRichMenu, GET list rich menu from line server
        if (message === 'listRichMenu') {
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
            postMessage(replyMessage, replyToken, lineBotToken);
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
        } else {
            replyMessage = [{
                type: 'text',
                text: message
            }]
            postMessage(replyMessage, replyToken, lineBotToken);
        }
    };

}

const postMessage = (replyMessage, replyToken, lineBotToken) => {
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
            console.log('err replyMessage = ', err);
        });
}

const replyPostback = async (events, lineBotToken) => {
    action = events[0].postback.data;
    console.log(action);
    if (action === 'action=replyFlexMessage') {
        console.log('sucess enter replyFlexMessage')
        let options = {
            method: 'POST',
            uri: 'https://line-sdk-test.herokuapp.com/flexMessage',
            body: {
                "userId": userId,
            },
            json: true
        };
        rp(options);
    }
}


module.exports = {
    replyMessage: replyMessage,
    replyPostback: replyPostback,

}
