const fs = require('fs');
const path = require("path");
const replyMessageAPI = require('./../lineAPI/replyMessageAPI.js');
const replyFlexMessageAPI = require("./../lineAPI/replyMessageAPI.js");

const details = async (tokenId, tokenName, balance, lineBotToken, replyToken)=>{
    let flexMessage = fs.readFileSync(path.resolve(__dirname, "./../json/flexExample.json"));
    flexMessage = await JSON.parse(flexMessage);
    const time = Date.now();

    // input data into json
    const flex_template_temp_string = {
        "type": "bubble",
        "header": {
            "type": "box",
            "layout": "vertical",
            "contents": [
                {
                    "type": "text",
                    "text": "詳細資料",
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
                    "text": `資產名稱 : ${tokenName}`,
                    "wrap": true
                },
                {
                    "type": "text",
                    "text": `區塊編號 : ${tokenId}`
                },
                {
                    "type": "text",
                    "text": `資產餘額 : ${balance}`
                }
            ]
        },
        "footer": {
            "type": "box",
            "layout": "vertical",
            "contents": [
                {
                    "type": "button",
                    "action": {
                        "type": "postback",
                        "label": "交易紀錄",
                        "data": `action=carousel_history&tokenId=${tokenId}&tokenName=${tokenName}`
                    },
                    "style": "primary",
                    "color": "#0000ff"
                }
            ]
        }
    
    }
    flexMessage['contents'] = flex_template_temp_string;
    console.log(flexMessage);
    replyMessageAPI.replyMessage([flexMessage], replyToken, lineBotToken);
    return flexMessage;
}

module.exports = {
    details: details
}