const rp = require('request-promise');
/**
 * 
 * @param {*} replyMessage enter message you want to push to user
 * @param {*} userId 
 * @param {*} lineBotToken 
 */
const pushMessage = (replyMessage, userId, lineBotToken) => {
    let rp_body = {
        to: userId,
        messages: replyMessage
    };
    let options = {
        method: 'POST',
        url: 'https://api.line.me/v2/bot/message/push',
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
            console.log('err replyMessage = ');
        });
}

module.exports = {
    pushMessage: pushMessage
}