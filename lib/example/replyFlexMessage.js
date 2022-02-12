const rp = require('request-promise');
const flex = require('./flex.json');

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
            "messages": [flex] 
        },
        json: true
    };
    rp(options)
        .then((body) => {
            return 'sucess';
        }) 
        .catch((err) => {
            return err;
        })
    
}

module.exports = {
    postFlexMessage: postFlexMessage
}
