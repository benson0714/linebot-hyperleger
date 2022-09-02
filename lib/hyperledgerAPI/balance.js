const replyMessageAPI = require('./../lineAPI/replyMessageAPI.js');
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

const balance = async (userId, lineBotToken, replyToken) => {
    // crawl web to get image url and image name then sent a template to user, allBalance type : JSON object
    await allbalance.allbalance(userId).then(async (allBalance)=>{
        if(allBalance.length==0){
            // return no balance to user
            const message = [{
                "type":"text",
                "text":"請先取得資產"
            }]
            await replyMessageAPI.replyMessage(message, replyToken, lineBotToken);
            return "balance.js don't have balance";
        } else {
            // let user wait a while
            // const message = [{
            //     "type":"text",
            //     "text":"請稍後片刻，您的資產即將出現"
            // }]
            // await replyMessageAPI.replyMessage(message, replyToken, lineBotToken);
            console.log(`typeof allBalance : ${allBalance}`);
            console.log('enter balance.js balance function');
            // get the example template
            const carousel_template_example = fs.readFileSync(path.resolve(__dirname, "./../json/image_carousel_template_example.json"));
            let image_template = JSON.parse(carousel_template_example);
            console.log(image_template);
            // get the image url array
            let image_url = [];
            let  tokenName = [];
            let balance = [];
            for(const i in allBalance){
                console.log(`id = ${allBalance[i]['id']}`);
                balance.push(allBalance[i]['balance']);
                await uri.uri(allBalance[i]['id']).then(async (uri_tmp)=>{
                    console.log(uri_tmp)
                    uri_tmp = JSON.parse(uri_tmp);
                    image_url.push(uri_tmp['image']);
                    tokenName.push(uri_tmp['name']);
                    return;
                });
            
            }
            console.log(image_url);
            console.log(tokenName);
            // change template type to carousel
            image_template['template']['type'] = "carousel";
            for(const i in allBalance){
                if(i==10){
                    // number of balance > 9, last carousel print see more
                    const image_template_temp_string = {
                        "thumbnailImageUrl": `${image_url[i]}`,
                        "imageBackgroundColor": "#000000",
                        "title": `查看更多`,
                        "actions": [ 
                            {
                                "type": "postback",
                                "label": "查看更多",
                                "data": `action=details&tokenId=${allBalance[i]['id']}&tokenName=${tokenName[i]}`
                            }
                        ]
                      }
                    image_template['template']['columns'].push(image_template_temp_string);
                } else {
                    // input data into json
                    const image_template_temp_string = {
                        "thumbnailImageUrl": `${image_url[i]}`,
                        "imageBackgroundColor": "#000000",
                        "title": `${tokenName[i]}`,
                        "text": `Balance:${balance[i]}`,
                        "defaultAction": {
                            "type": "uri",
                            "label": "View detail",
                            "uri": "http://example.com/page/222"
                        },
                        "actions": [ 
                            {
                                "type": "postback",
                                "label": "交易紀錄",
                                "data": `action=carousel_history&tokenId=${allBalance[i]['id']}&tokenName=${tokenName[i]}`
                            },
                            {
                                "type": "uri",
                                "label": "移轉資產",
                                "uri": `https://liff.line.me/1656864170-yJlooY0M?tokenId=${allBalance[i]['id']}`
                            },
                            {
                                "type": "postback",
                                "label": "詳細資料",
                                "data": `action=details&tokenId=${allBalance[i]['id']}&tokenName=${tokenName[i]}&balance=${balance[i]}`
                            }
                        ]
                      }
                    image_template['template']['columns'].push(image_template_temp_string);
                }
            }
            try{
                await replyMessageAPI.replyMessage([image_template], replyToken, lineBotToken);
            }catch(err){
                return err;
            }
        }
    })
}
 
module.exports = {
    balance: balance
}