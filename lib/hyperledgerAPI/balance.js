const pushMessage = require('./../lineAPI/pushMessageAPI.js');
const chaincode = require('./../../fabric.js');
const replyTemplateMessage = require('./../lineAPI/replyTemplateMessage.js');
const fs = require('fs');
const path = require("path");

/**
 * check user balance(nft or erc20)
 * @param {*} userId 
 * @param {*} lineBotToken 
 */
const balance = async (userId, lineBotToken) => {
    console.log('enter balance.js balance function');
    // const allBalance = await chaincode.getAllBalance(userId);
    const allBalance = [{},{}];
    // get the example template
    const image_carousel_template_example = fs.readFileSync(path.resolve(__dirname, "./../json/image_carousel_template_example.json"));
    let image_template = JSON.parse(image_carousel_template_example);
    // get the image url array
    let image_url = ['https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Gull_portrait_ca_usa.jpg/800px-Gull_portrait_ca_usa.jpg', 'https://miro.medium.com/max/1400/1*mk1-6aYaf_Bes1E3Imhc0A.jpeg'];
    let  tokenName = ['nft1', 'nft2'];
    for(const i in allBalance){
        if(allBalance.length==0){
            // return no balance to user
            pushMessage.pushMessage("請先取得資產", userId, lineBotToken);
            return "balance.js don't have balance";
        } else if(i>10){
            // number of balance > 9, last image_carousel print see more
            image_template['template']['columns'][9]['imageUrl'] = "xxxx";
            image_template['template']['columns'][9]['action']['data'] = "action=img_carousel_details&details=9";
            image_template['template']['columns'][9]['action']['label'] = "see more";
        } else {
            // input some data to json
            image_template['template']['columns'][i] = '{\
                "imageUrl": `${image_url[i]}`,\
                "action": {\
                  "type": "postback",\
                  "label": tokenName,\
                  "data": `action=img_carousel_details&details=${i}`\
                }\
              }'
        }
    }
    console.log(image_template);
    try{
        replyTemplateMessage.postTemplateMessage(lineBotToken, userId, image_template);
    }catch(err){
        return err;
    }

}

module.exports = {
    balance: balance
}