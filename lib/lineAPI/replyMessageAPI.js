const rp = require('request-promise');

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

module.exports = {
    postMessage: postMessage
}