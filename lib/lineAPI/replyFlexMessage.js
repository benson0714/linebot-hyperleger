const rp = require('request-promise');
const fs = require('fs');
const path = require("path");

/**
 * 
 * @param {*} lineBotToken 
 * @param {*} userId 
 * @param {*} address enter address of account
 */
const postFlexMessage = async (lineBotToken, userId, address) =>{

    try{
        let flexMessage = fs.readFileSync(path.resolve(__dirname, "./../json/flexExample.json"));
        flexMessage = await JSON.parse(flexMessage);

        //concat flexQrcodeMessage into json
        flexMessage['contents']['hero']['url'] = flexMessage['contents']['hero']['url'].concat(address);
        flexMessage['contents']['body']['contents'][2]['contents'][0]['contents'][1]['text'] = address;
        flexMessage['contents']['footer']['contents'][0]['action']['data'] = flexMessage['contents']['footer']['contents'][0]['action']['data'].concat(address)
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
    }catch(err){
        console.log(`replyFlexMessage.js postFlexMessage function fail : ${err}`)
        return err;
    }
    
}

module.exports = {
    postFlexMessage: postFlexMessage
}
