const transfer_func = require('./../fabricAPI/transfer.js');
const fs = require('fs');
const path = require("path");
const step3UpdateDB = require('./../levelDB/step3UpdateDB');
const uri = require("./../fabricAPI/uri.js");

/**
 * 
 * @param {*} userId 
 * @param {*} lineBotToken 
 * @param {*} recipient 
 * @param {*} tokenId 
 * @param {*} amount 
 */

const transfer = async (userId, lineBotToken, recipient, tokenId, amount, jwtToken) => {
    // replyMessage = [
    //     {
    //         type: 'text',
    //         text: `處理中，請稍後`
    //     }
    // ];
    // const message = pushMessage.pushMessage(replyMessage, userId, lineBotToken);
    const updateCheckJwtToken = await step3UpdateDB.step3UpdateDB(userId, jwtToken);
    console.log(`updateCheckJwtToken = ${updateCheckJwtToken}`);
    if (updateCheckJwtToken === "expireMessage") {
        replyMessage = [
            {
                type: 'text',
                text: `此筆交易已超過5分鐘，請重新開始交易`
            }
        ];
        return ["404", replyMessage];
    } else if (updateCheckJwtToken === "step1handle") {
        // 已經在第二步卻跑回去點第一步
        replyMessage = [
            {
                type: 'text',
                text: `請先點選transfer重新執行交易操作`
            }
        ];
        return ["404", replyMessage];
    } else if (updateCheckJwtToken === "step3handle") {
        replyMessage = [
            {
                type: 'text',
                text: `您還未開啟相機掃描qrcode，請先執行此操作`
            }
        ];
        return ["404", replyMessage];
    } else if (updateCheckJwtToken === "stepXhandle") {
        replyMessage = [
            {
                type: 'text',
                text: `請重新開始交易`
            }
        ];
        return ["404", replyMessage];
    } else if (updateCheckJwtToken === "step4handle") {
        replyMessage = [
            {
                type: 'text',
                text: `此筆交易已完成，可以至交易紀錄查詢此筆交易`
            }
        ];
        return ["404", replyMessage];
    } else if (updateCheckJwtToken === "updateCheckJwtTokenOk") {
        tokenId = tokenId.toString();
        amount = amount.toString();
        return await transfer_func.transfer(userId, recipient, tokenId, amount).then(async (status) => {

            console.log(`status = ${status}`);
            if (status === "error") {
                // return no balance to user
                const message = [{
                    "type": "text",
                    "text": "移轉失敗"
                }]
                return ["404", message];
            } else {
                return await uri.uri(tokenId).then(async (uri_tmp) => {
                    uri_tmp = JSON.parse(uri_tmp);
                    tokenName = uri_tmp['name'];
                    console.log(tokenName);
                    // get the example template
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
                                    "text": "交易明細",
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
                                    "text": `交易對象\n${recipient}`,
                                    "wrap": true
                                }
                            ]
                        }

                    }
                    flexMessage['contents'] = flex_template_temp_string;
                    console.log(flexMessage);
                    return ["200", [flexMessage]];
                })

            }
        })
    } else{
        replyMessage = [
            {
                type: 'text',
                text: `請重新開始交易`
            }
        ];
        return ["404", replyMessage];
    }
}

module.exports = {
    transfer: transfer
}