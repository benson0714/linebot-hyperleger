const rp = require('request-promise');
const fs = require('fs');
const path = require("path");

/**
 * 
 * @param {*} lineBotToken 
 * @param {*} userId 
 * @param {*} template enter flex_template of account
 */
const pushCarouselFlex = async (lineBotToken, userId, flex_template) =>{

    try{
        console.log(JSON.stringify(flex_template));
        console.log(flex_template);
        let options = await {
            method: 'POST',
            uri: 'https://api.line.me/v2/bot/message/push',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${lineBotToken}`
            },
            body: {
                "to": userId,
                "messages": [flex_template] 
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
    pushCarouselFlex: pushCarouselFlex
}
