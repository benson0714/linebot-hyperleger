const rp = require('request-promise');

/**
 * 
 * @param {*} lineBotToken input lineBotToken
 * @param {*} userId input userId
 * @param {*} template input template format, format details in linebot developer api
 */
const postTemplateMessage = async (lineBotToken, userId, template) => {
    const options = await {
        method: 'POST',
        uri: 'https://api.line.me/v2/bot/message/push',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${lineBotToken}`
        },
        body: {
            "to": userId,
            "messages": [template] 
        },
        json: true
    };
    await rp(options)
        .then((body) => {
            return 'post template sucess';
        }) 
        .catch((err) => {
            return err;
        })
    }
module.exports = {
    postTemplateMessage: postTemplateMessage
}
