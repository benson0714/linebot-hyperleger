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
    const request = require('request')
    const fixieRequest = request.defaults({'proxy': process.env.FIXIE_URL});
    
    fixieRequest('https://line-sdk-test.herokuapp.com/', (err, res, body) => {
      console.log(`Got response: ${res.statusCode}`);
    });

    try{
        let flexMessage = fs.readFileSync(path.resolve(__dirname, "./../json/flexExample.json"));
        flexMessage = await JSON.parse(flexMessage);

        //concat flexQrcodeMessage into json
        let flexMessageJson = JSON.stringify(flexMessage, (k, v) => {
            if(k=='url'){
                const value = v.concat(flexQrcodeMessage);
                return value;
            } else{
                return v;
            }
        });
        flexMessage = await JSON.parse(flexMessageJson);        
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
