const rp = require('request-promise');
const flex = require('./flex.js');
let flex_message = flex.flex_message_func();

const postFlexMessage = (lineBotToken, userId) =>{
    let options = {
        method: 'POST',
        uri: 'https://api.line.me/v2/bot/message/push',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${lineBotToken}`
        },
        body: {
            "to": userId,
            "messages": [flex_message] 
        },
        json: true
    };
    rp(options);
    
}

module.exports = {
    postFlexMessage: postFlexMessage
}
