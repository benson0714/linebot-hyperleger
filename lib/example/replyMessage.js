const rp = require('request-promise');
module.exports = {
    replyMessage : (events, lineBotToken, resObject) => {
        // print replytoken & message
        replyToken = events[0].replyToken
        console.log(`replyToken = ${replyToken}`);
        message = events[0].message.text
        console.log(`messge : ${message}`);
        let replyMessage = {};

        // if received a specific message reply some special message
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
        }
    
        let rp_body = {
            replyToken: replyToken,
            messages: replyMessage;
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
