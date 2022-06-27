const pushMessage = require('./../lineAPI/pushMessageAPI.js');
const transfer_func = require('./../fabricAPI/transfer.js');
const fs = require('fs');
const path = require("path");
const replyFlexMessage = require("./../lineAPI/replyFlexMessage.js");

/**
 * 
 * @param {*} userId 
 * @param {*} lineBotToken 
 * @param {*} recipient 
 * @param {*} tokenId 
 * @param {*} amount 
 */

const transfer = async (userId, lineBotToken, recipient, tokenId, amount) => {
    await transfer_func.transfer(userId, recipient, tokenId, amount).then(async (status)=>{
        console.log(`status = ${status}`);
        if(!status){
            // return no balance to user
            const message = [{
                "type":"text",
                "text":"移轉失敗"
            }]
            pushMessage.pushMessage(message, userId, lineBotToken);
        } else {
            // get the example template
            let flexMessage = fs.readFileSync(path.resolve(__dirname, "./../json/flexExample.json"));
            flexMessage = await JSON.parse(flexMessage);
            // input data into json
            const flex_template_temp_string = {
                "type": "bubble",
                "header": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                        {
                            "type": "text",
                            "text": "交易明細",
                            "size": "xl",
                            "weight": "bold",
                            "wrap": true
                        }
                    ]
                },
                "body": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                        {
                            "type": "text",
                            "text": `資產名稱:${tokenName}`,
                            "wrap": true
                        },
                        {
                            "type": "text",
                            "text": `交易數量:${amount}`
                        },
                        {
                            "type": "text",
                            "text": `交易對象\n${recipient}`,
                            "wrap": true
                        }
                    ]
                }
                
            }
            flexMessage['contents'] = flex_template_temp_string;
            console.log(flexMessage);
            replyFlexMessage.postFlexMessage(lineBotToken, userId, flexMessage);
            return flexMessage;
        }
    })
}
 
module.exports = {
    transfer: transfer
}