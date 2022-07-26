const rp = require('request-promise');

/**
 * 
 * @param {*} replyMessage enter message you want to reply to user
 * @param {*} replyToken 
 * @param {*} lineBotToken 
 */
const replyMessage = async (replyMessage, replyToken, lineBotToken) => {
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
    await rp(options)
        .then((body) => {
            console.log('replyMessageAPI sucess');
        })
        .catch((err) => {
            console.log('err replyMessage = ', err);
        });
}

module.exports = {
    replyMessage: replyMessage
}