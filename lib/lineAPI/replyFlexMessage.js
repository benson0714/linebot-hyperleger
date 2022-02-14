const rp = require('request-promise');


const postFlexMessage = async (lineBotToken, userId, flexName) =>{
    const flex = require(`./../json/${flexName}`);
    let options = await {
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
    await rp(options)
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
