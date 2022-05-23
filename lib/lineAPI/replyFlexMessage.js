const rp = require('request-promise');
const fs = require('fs');
const path = require("path");

/**
 * 
 * @param {*} lineBotToken 
 * @param {*} userId 
 * @param {*} flexQrcodeMessage enter message of qrcode 
 */
const postFlexMessage = async (lineBotToken, userId, flexQrcodeMessage) =>{
    try{
        let flexMessage = fs.readFileSync(path.resolve(__dirname, "./../json/flexExample.json"));
        let flexMessageJson = await JSON.stringify(flexMessage);
        console.log(flexMessageJson)
        console.log(flexMessageJson.contents);
        flexMessageJson.contents.hero.url = flexMessageJson.hero.url+flexQrcodeMessage;
        flexMessage = await JSON.stringify(flexMessageJson);
        console.log(flexMessage);

    }catch(err){
        console.log(`replyFlexMessage.js postFlexMessage function fail : ${err}`)
        return err;
    }

    let options = await {
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
    
}

module.exports = {
    postFlexMessage: postFlexMessage
}
