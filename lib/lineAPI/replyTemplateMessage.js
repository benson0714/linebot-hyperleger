const rp = require('request-promise');

/**
 * 
 * @param {*} lineBotToken input lineBotToken
 * @param {*} userId input userId
 * @param {*} flex input template json file under ./../json
 */
const postTemplateMessage = async (lineBotToken, userId, templateName) => {
    const template = require(`./../json/${templateName}`);
    let options = await {
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
            return 'sucess';
        }) 
        .catch((err) => {
            return err;
        })
    
}

module.exports = {
    postTemplateMessage: postTemplateMessage
}
