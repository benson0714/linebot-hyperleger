const pushMessage = require('./../lineAPI/pushMessageAPI.js');
const balance = require("./../fabricAPI/balance.js");
const uri = require("./../fabricAPI/uri.js");
const fs = require('fs');
const path = require("path");
const replyFlexMessage = require("./../lineAPI/replyFlexMessage.js");

/**
 * 查看使用者的餘額是否足夠，如果足夠就跳轉到掃qrcode畫面
 * @param {*} userId 
 * @param {*} lineBotToken 
 * @param {*} amount 
 * @param {*} tokenId 
 */
const check_address = async (userId, lineBotToken, amount, tokenId, address, old_time) => {
    const time = Date.now()
    const total_sec = Number(old_time)-Number(time);
    console.log(`total sec = ${total_sec}`);
    if(total_sec > 180) {
        console.log('time > 3min');
        replyMessage = [
            {
                type: 'text',
                text: '您已超過移轉許可時間，請重新操作!'
            }
            ];
        const message = pushMessage.pushMessage(replyMessage, userId, lineBotToken);
        return;
    } else {
        return await balance.balance(userId, tokenId).then(async (total_amount) => {
            return await uri.uri(tokenId).then(async (uri_tmp) => {
                uri_tmp = JSON.parse(uri_tmp);
                const tokenName = uri_tmp['name'];
                console.log(tokenName);
                console.log(`total_amount = ${total_amount}`);
                console.log(`amount = ${amount}`);
                let flexMessage = fs.readFileSync(path.resolve(__dirname, "./../json/flexExample.json"));
                flexMessage = await JSON.parse(flexMessage);
                const message = {
                    "qrcode_address":address, 
                    "amount":amount, 
                    "time":time, 
                    "userId":userId, 
                    "tokenId":tokenId
                }
                // input data into json
                const flex_template_temp_string = {
                    "type": "bubble",
                    "header": {
                        "type": "box",
                        "layout": "vertical",
                        "contents": [
                            {
                                "type": "text",
                                "text": "請確認交易資訊，請在3分鐘內按下下方移轉",
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
                                "text": `交易對象\n${address}`,
                                "wrap": true
                            }
                        ]
                    },
                    "footer":{
                        "type":"box",
                        "layout":"vertical",
                        "contents":[
                            {
                                "type": "button",
                                "action": {
                                    "type": "postback",
                                    "label": "移轉",
                                    "data": message
                                },
                                "style": "primary",
                                "color": "#0000ff"
                                }
                        ]
                    }
                    
                }
                flexMessage['contents'] = flex_template_temp_string;
                console.log(flexMessage);
                replyFlexMessage.postFlexMessage(lineBotToken, userId, flexMessage);
                return flexMessage;
            });
    
        });
    }
    

}

module.exports = {
    check_address: check_address
}