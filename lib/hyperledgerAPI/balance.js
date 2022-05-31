const pushMessage = require('./../lineAPI/pushMessageAPI.js');
const replyTemplateMessage = require('./../lineAPI/replyTemplateMessage.js');
const fs = require('fs');
const path = require("path");
const allbalance = require('./../fabricAPI/allbalance.js');
const uri = require('./../fabricAPI/uri.js');

/**
 * check user balance(nft or erc20)
 * @param {*} userId 
 * @param {*} lineBotToken 
 */

const balance = async (userId, lineBotToken) => {
    // let user wait a while
    pushMessage.pushMessage("請稍待片刻，您的資產即將出現", userId, lineBotToken);

    // crawl web to get image url and image name then sent a template to user
    await allbalance.allbalance(userId).then(async (allBalance)=>{
        console.log(`typeof allBalance : ${allBalance}`);
        console.log('enter balance.js balance function');
        // get the example template
        const image_carousel_template_example = await fs.readFileSync(path.resolve(__dirname, "./../json/image_carousel_template_example.json"));
        let image_template = JSON.parse(image_carousel_template_example);
        console.log(image_template);
        // get the image url array
        let image_url = [];
        let  tokenName = [];
        for(const i in allBalance){
            console.log(`id = ${allBalance[i]['id']}`)
            await uri.uri(allBalance[i]['id']).then(async (uri_tmp)=>{
                uri_tmp = JSON.parse(uri_tmp);
                image_url.push(uri_tmp['image']);
                tokenName.push(uri_tmp['name']);
                return;
            });
            
        }
        console.log(image_url);
        console.log(tokenName);
        for(const i in allBalance){
            if(allBalance.length==0){
                // return no balance to user
                pushMessage.pushMessage("請先取得資產", userId, lineBotToken);
                return "balance.js don't have balance";
            } else if(i>10){
                // number of balance > 9, last image_carousel print see more
                const image_template_temp_string = {
                    "imageUrl": `xxxx`,
                    "action": {
                      "type": "postback",
                      "label": "查看更多",
                      "data": `action=img_carousel_details&details=${i}`
                    }
                  };
                image_template['template']['columns'].push(image_template_temp_string);
            } else {
                // input some data to json
                const image_template_temp_string = {
                    "imageUrl": `${image_url[i]}`,
                    "action": {
                      "type": "postback",
                      "label": tokenName[i],
                      "data": `action=img_carousel_details&details=${i}`
                    }
                  }
                image_template['template']['columns'].push(image_template_temp_string);
            }
        }
        try{
            replyTemplateMessage.postTemplateMessage(lineBotToken, userId, image_template);
        }catch(err){
            return err;
        }
    })
    
}
module.exports = {
    balance: balance
}