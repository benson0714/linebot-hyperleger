const rp = require('request-promise');


/**
 * 
 * @param {*} lineBotToken 
 * @param {*} userId 
 * @param {*} flexMessage enter flexMessage of account
 */
const postFlexMessage = async (lineBotToken, userId, flexMessage) =>{

    try{

        let options = {
            method: 'POST',
            uri: 'https://api.line.me/v2/bot/message/push',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${lineBotToken}`
            },
            body: {
                "to": userId,
                "messages": [flexMessage]
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
    }catch(err){
        console.log(`replyFlexMessage.js postFlexMessage function fail : ${err}`)
        return err;
    }
    
}

module.exports = {
    postFlexMessage: postFlexMessage
}
