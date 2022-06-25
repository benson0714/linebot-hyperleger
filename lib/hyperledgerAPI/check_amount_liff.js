const pushMessage = require('./../lineAPI/pushMessageAPI.js');
const balance = require("./../fabricAPI/balance.js");
const uri = require("./../fabricAPI/uri.js");

/**
 * 查看使用者的餘額是否足夠，如果足夠就跳轉到掃qrcode畫面
 * @param {*} userId 
 * @param {*} lineBotToken 
 * @param {*} amount 
 * @param {*} tokenId 
 */
const check_amount =await (userId, lineBotToken, amount, tokenId) => {
    const total_amount = balance.balance(userId, tokenId);
    const uri_tmp = uri.uri(tokenId);
    const uri_parse = JSON.parse(uri_tmp);
    const tokenName = uri_parse['name'];
    console.log(tokenName);
    if(total_amount<amount){
        replyMessage = [
        {
            type: 'text',
            text: '您沒有足夠數量!'
        }];
        const message = pushMessage.pushMessage(replyMessage, userId, lineBotToken);
    } else{
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
                    "type": "button",
                    "action": {
                      "type": "uri",
                      "label": "Tap me",
                      "uri": "https://example.com"
                    },
                    "style": "primary",
                    "color": "#0000ff"
                  }
          }
        flex_template['contents']['contents'].push(flex_template_temp_string);
        //concat flexQrcodeMessage into json
        return flexMessage;
    }
}

module.exports = {
    check_amount: check_amount
}