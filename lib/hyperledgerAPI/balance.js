const replyMessageAPI = require('./../lineAPI/replyMessageAPI.js');
const fs = require('fs');
const path = require("path");
const allbalance = require('./../fabricAPI/allbalance.js');
require("dotenv").config();
const metadata = require('./../fabricAPI/metadata.js');

/**
 * check user balance(nft or erc20)
 * @param {*} userId 
 * @param {*} lineBotToken 
 */

const balance = async (userId, lineBotToken, replyToken) => {
    // crawl web to get image url and image name then sent a template to user, allBalance type : JSON object
    await allbalance.allbalance(userId).then(async (allBalance) => {
        if (allBalance.length == 0) {
            // return no balance to user
            const message = [{
                "type": "text",
                "text": "請先取得資產"
            }]
            await replyMessageAPI.replyMessage(message, replyToken, lineBotToken);
            return "balance.js don't have balance";
        } else {
            // get the example template
            const carousel_template_example = fs.readFileSync(path.resolve(__dirname, "./../json/image_carousel_template_example.json"));
            let image_template = JSON.parse(carousel_template_example);
            try {
                console.log(`typeof allBalance : ${allBalance}`);
                console.log('enter balance.js balance function');

                console.log(image_template);
                // get the image url array
                let image_url = [];
                let tokenName = [];
                let balance = [];
                for (const i in allBalance) {
                    console.log(`id = ${allBalance[i]['id']}`);
                    balance.push(allBalance[i]['balance']);
                    await metadata.metadata(allBalance[i]['id']).then(async (metadata_json) => {
                        console.log(`metadata_json = ${JSON.stringify(metadata_json)}`);
                        metadata_json = JSON.stringify(metadata_json);
                        metadata_json = JSON.parse(metadata_json);
                        image_url.push(metadata_json['image']);
                        tokenName.push(metadata_json['name']);
                        return;
                    });
                }
                console.log(image_url);
                console.log(tokenName);
                // change template type to carousel
                image_template['template']['type'] = "carousel";
                for (const i in allBalance) {
                    if (i === 10) {
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
                            "text": `數量:${balance[i]}`,
                            "actions": [
                                {
                                    "type": "postback",
                                    "label": "詳細資料",
                                    "data": `action=details&tokenId=${allBalance[i]['id']}&tokenName=${tokenName[i]}&balance=${balance[i]}`
                                },
                                {
                                    "type": "postback",
                                    "label": "交易紀錄",
                                    "data": `action=carousel_history&tokenId=${allBalance[i]['id']}&tokenName=${tokenName[i]}`
                                },
                                {
                                    "type": "uri",
                                    "label": "移轉資產",
                                    "uri": `https://liff.line.me/${process.env.MY_LIFF_ID_AMOUNT}?tokenId=${allBalance[i]['id']}`
                                }
                            ]
                        }
                        image_template['template']['columns'].push(image_template_temp_string);
                    }
                }
                console.log(image_template);
            } catch (err) {
                console.log(err);
                // return error to user
                const message = [{
                    "type": "text",
                    "text": "系統錯誤，請稍後再試"
                }]
                await replyMessageAPI.replyMessage(message, replyToken, lineBotToken);
                return "balance.js balance error";
            }

            try {
                await replyMessageAPI.replyMessage([image_template], replyToken, lineBotToken);
            } catch (err) {
                console.log(err);
                return err;
            }
        }
    })
}

module.exports = {
    balance: balance
}
