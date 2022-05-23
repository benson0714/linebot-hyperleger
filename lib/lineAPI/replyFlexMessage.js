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
    let options_test = await {
        method: 'GET',
        uri: 'https://line-sdk-test.herokuapp.com/',
    };
    await rp(options_test)
        .then((body) => {
            return 'get ip sucess';
        }) 
        .catch((err) => {
            return err;
        })



    try{
        let flexMessage = fs.readFileSync(path.resolve(__dirname, "./../json/flexExample.json"));
        flexMessage = await JSON.parse(flexMessage);
        let flexMessageJson = JSON.stringify(flexMessage, (k, v) => {
            if(k=='url'){
                const value = v.concat(flexQrcodeMessage);
                console.log(`value = ${value}`);
                return value;
            }
        });
        console.log(flexMessageJson);
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
