const replyMessageAPI = require('./../lineAPI/replyMessageAPI.js');
const record = require('./../fabricAPI/record.js');
const fs = require('fs');
const path = require("path");

/**
 * return record and push to user
 * @param {*} userId enter userId
 * @param {*} tokenId enter tokenId
 * @param {*} tokenName enter tokenName
 * @param {*} lineBotToken enter lineBotToken
 */
const history = async (userId, tokenId, tokenName, lineBotToken, replyToken) => {
  const value = await record.record(userId, tokenId);
  const recordJson = value[0];
  const address = value[1];
  console.log('enter history function');
  const flex_template_example = fs.readFileSync(path.resolve(__dirname, "./../json/flexCarouselExample.json"));
  let flex_template = JSON.parse(flex_template_example);
  console.log(`flex_template = ${JSON.stringify(flex_template)}`)
  // use carousel template
  for (const i in recordJson) {
    if (i == 10) {
      console.log('number>=10');
      // number of balance >= 10, last carousel print see more
      console.log(typeof(tokenName));
      console.log(tokenName)
      const flex_template_temp_string = {
        "type": "bubble",
        "header": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "text",
              "text": "查看更多",
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
                      "type": "uri",
                      "label": "查看更多",
                      "uri": `https://liff.line.me/1656864170-VNoRRqa0?tokenId=${tokenId}&tokenName=${tokenName.replace(" ","-")}`
                  },
                  "style": "primary",
                  "color": "#0000ff"
              }
          ]
      }
      };
      flex_template['contents']['contents'].push(flex_template_temp_string);
      break;
    } else {
      console.log(`recordJson from = ${recordJson[i]['from']}`)
      const timestamp = recordJson[i]['timestamp']['seconds']['low'];
      const date = new Date(timestamp * 1000);
      console.log(date)
      const human_date = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + ("0" + date.getDate()).slice(-2) + " " + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + ":" + ("0" + date.getSeconds()).slice(-2);
      let transfer_option = "";
      let transfer_address = "";
      if (recordJson[i]['from'] === address) {
        // from 自己就是轉出
        transfer_option = "轉出";
        transfer_address = recordJson[i]['to'];
      } else {
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
  try {
    let message = await replyMessageAPI.replyMessage([flex_template], replyToken, lineBotToken);
    return message;
  } catch (err) {
    return err;
  }
}

module.exports = {
  history: history
}