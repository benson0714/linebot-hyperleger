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
const check_amount = async (userId, lineBotToken, amount, tokenId) => {
    return await balance.balance(userId, tokenId).then(async (total_amount) => {
        return await uri.uri(tokenId).then(async (uri_tmp) => {
            uri_tmp = JSON.parse(uri_tmp);
            const tokenName = uri_tmp['name'];
            console.log(tokenName);
            console.log(`total_amount = ${total_amount}`);
            console.log(`amount = ${amount}`);
            if (Number(total_amount) < Number(amount)) {
                console.log('enter dont have enough amount');
                replyMessage = [
                    {
                        type:'text',
                        text: `您擁有的資產數量:${total_amount}\n要移轉的資產數量:${amount}` 
                    },
                    {
                        type: 'text',
                        text: '您沒有足夠數量可以移轉資產!'
                    }
                    ];
                const message = pushMessage.pushMessage(replyMessage, userId, lineBotToken);
                return;
            } else {
                console.log("enough amount");
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
                                "text": "請確認交易資訊，如正確請按下方按鈕掃描地址",
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
                                  "type": "uri",
                                  "label": "Tap me",
                                  "uri": `https://liff.line.me/1656864170-pOEXXm7R?amount=${amount}&tokenId=${tokenId}&time=${time}`
                                },
                                "style": "primary",
                                "color": "#0000ff"
                              }
                        ]
                    }
                    
                }
                flexMessage['contents']=flex_template_temp_string;
                console.log(flexMessage);
                replyFlexMessage.postFlexMessage(lineBotToken, userId, flexMessage);
                return flexMessage;
            }
        });

    });

}

module.exports = {
    check_amount: check_amount
}