const request = require('request-promise');
module.exports = {
    responseText : (events, lineBotToken, resObject) => {
        // print replytoken & message
        replyToken = events.events[0].replyToken
        console.log(`replyToken = ${replyToken}`);
        message = events.events[0].message.text
        console.log(`messge : ${message}`);
    
        let rp_body = {
            replyToken: replyToken,
            messages: [{
                    type: 'text',
                    text: message
                },
                {
                    type: 'text',
                    text: resObject[`選擇性回覆 : ${message}`]
                }]
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
        ctx.body = rp(options)
        .then((body) => {
            console.log('sucess');
        })
        .catch((err) => {
            console.log('err');
        });
    }
}
