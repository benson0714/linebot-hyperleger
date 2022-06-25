const pushMessage = require('./../lineAPI/pushMessageAPI.js');
const balance = require("./../fabricAPI/balance.js");
const fs = require('fs');
const path = require("path");

/**
 * 查看使用者的餘額是否足夠，如果足夠就跳轉到掃qrcode畫面
 * @param {*} userId 
 * @param {*} lineBotToken 
 * @param {*} amount 
 * @param {*} tokenId 
 */
const check_amount = (userId, lineBotToken, amount, tokenId) => {
    const total_amount = balance.balance(userId, tokenId);
    if(total_amount<amount){
        replyMessage = [
        {
            type: 'text',
            text: '您沒有足夠數量!'
        }];
        const message = pushMessage.pushMessage(replyMessage, userId, lineBotToken);
    } else{
        const flex_template_example = await fs.readFileSync(path.resolve(__dirname, "./../json/flexCarouselExample.json"));
        let flex_template = JSON.parse(flex_template_example);
        console.log(`flex_template = ${JSON.stringify(flex_template)}`)
        // use carousel template
        for(const i in recordJson){
            if(i>10){
                console.log('number>10');
                // number of balance > 9, last carousel print see more
                const flex_template_temp_string = {
                    "imageUrl": `xxxx`,
                    "action": {
                    "type": "postback",
                    "label": "查看更多",
                    "data": `action=carousel_details&details=${i}`
                    }
                };
                flex_template['contents'].push(flex_template_temp_string);
            } else {
                console.log(`recordJson from = ${recordJson[i]['from']}`)
                const timestamp = recordJson[i]['timestamp']['seconds']['low'];
                const date = new Date( timestamp *1000);
                console.log(date)
                const human_date = date.getFullYear()+"/"+(date.getMonth()+1)+"/"+("0"+date.getDate()).slice(-2)+" "+("0"+date.getHours()).slice(-2)+":"+("0"+date.getMinutes()).slice(-2)+":"+("0"+date.getSeconds()).slice(-2);
                let transfer_option = "";
                let transfer_address = "";
                if(recordJson[i]['from'] === address){
                    // from 自己就是轉出
                    transfer_option = "轉出";
                    transfer_address = recordJson[i]['to'];
                } else{
                    // from 不是自己就是轉入
                    transfer_option = "轉入";
                    transfer_address = recordJson[i]['from'];
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
                                "text": transfer_option,
                                "size": "xl",
                                "weight": "bold"
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
                              "text": `交易對象:\n${transfer_address}`,
                              "wrap": true
                            },
                            {
                                "type": "text",
                                "text": `交易數量:${recordJson[i]['amount']}`
                            },
                            {
                                "type": "text",
                                "text": `交易時間:${human_date}`,
                                "wrap": true
                            }
                          ]
                        }
                  }
                flex_template['contents']['contents'].push(flex_template_temp_string);
            }
        }
    }
    console.log(total_amount);
}

module.exports = {
    check_amount: check_amount
}