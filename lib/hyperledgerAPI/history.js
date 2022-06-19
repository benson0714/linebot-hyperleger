const pushMessage = require('./../lineAPI/pushMessageAPI.js');
const record = require('./../fabricAPI/record.js');
const fs = require('fs');
const path = require("path");

/**
 * return record and push to user
 * @param {*} userId enter userId
 * @param {*} tokenId enter tokenId
 * @param {*} lineBotToken enter lineBotToken
 */
const history = async (userId, tokenId, lineBotToken) => {
    const value = await record.record(userId, tokenId, lineBotToken);
    const recordJson = value[0];
    const address = value[1];
    console.log('enter history function');
    const flex_template_example = await fs.readFileSync(path.resolve(__dirname, "./../json/flexCarouselExample.json"));
    let flex_template = JSON.parse(flex_template_example);
    // use carousel template
    flex_template['type'] = "carousel";
    for(const i in recordJson){
        if(i>10){
            // number of balance > 9, last carousel print see more
            const flex_template_temp_string = {
                "imageUrl": `xxxx`,
                "action": {
                "type": "postback",
                "label": "查看更多",
                "data": `action=carousel_details&details=${i}`
                }
            };
            flex_template['columns'].push(flex_template_temp_string);
        } else {
            console.log(`recordJson from = ${recordJson[i]['from']}`)
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
                            "text": transfer_option
                          }
                        ]
                      }, 
                    "body": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": `交易對象:${transfer_address}\n
                          交易數量:${recordJson[i]['amount']}`
                        }
                      ]
                    }
              }
            flex_template['contents'].push(flex_template_temp_string);
        }
    }
    try{
        replyTemplateMessage.postTemplateMessage(lineBotToken, userId, flex_template);
    }catch(err){
        return err;
    }
}

module.exports = {
    history: history
}