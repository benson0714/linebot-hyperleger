const balance = require("./../fabricAPI/balance.js");
const fs = require('fs');
const path = require("path");
const updateDB = require("./../levelDB/updateDB.js");
const metadata = require('./../fabricAPI/metadata.js');
require("dotenv").config();

/**
 * 查看使用者的餘額是否足夠，如果足夠就跳轉到掃qrcode畫面
 * @param {*} userId 
 * @param {*} lineBotToken 
 * @param {*} amount 
 * @param {*} tokenId 
 */
const check_amount = async (userId, lineBotToken, amount, tokenId, jwtToken) => {
    return await balance.balance(userId, tokenId).then(async (total_amount) => {
        let tokenName = '';
        return await metadata.metadata(tokenId).then(async (metadata_json) => {
            metadata_json = JSON.stringify(metadata_json);
            metadata_json = JSON.parse(metadata_json);
            tokenName = metadata_json['name'];
            console.log(tokenName);
            console.log(`total_amount = ${total_amount}`);
            console.log(`amount = ${amount}`);
            console.log(`amount type = ${typeof(amount)}`)
            if (typeof(amount) === undefined || amount ==="") {
                const replyMessage = [
                    {
                        type: 'text',
                        text: `請輸入數量`
                    }
                ];
                return ['404', replyMessage];
            } else if(Number(total_amount) < Number(amount)){
                console.log('enter dont have enough amount');
                const replyMessage = [
                    {
                        type: 'text',
                        text: `您擁有的資產數量:${total_amount}\n要移轉的資產數量:${amount}`
                    },
                    {
                        type: 'text',
                        text: '您沒有足夠數量可以移轉資產!'
                    }
                ];
                return ['404', replyMessage];
            }else {
                console.log("enough amount");
                const updateCheckJwtToken = await updateDB.updateDB(userId, jwtToken);
                if (updateCheckJwtToken === "expireMessage") {
                    const replyMessage = [
                        {
                            type: 'text',
                            text: `此筆交易已超過5分鐘，請重新開始交易`
                        }
                    ];
                    return ['404', replyMessage];
                } else if (updateCheckJwtToken === "step2handle") {
                    const replyMessage = [
                        {
                            type: 'text',
                            text: `您已輸入數量，數量為${amount}，如果正確請繼續點選tap me開啟相機`
                        }
                    ];
                    return ['404', replyMessage];
                } else if (updateCheckJwtToken === "stepXhandle") {
                    const replyMessage = [
                        {
                            type: 'text',
                            text: `請重新開始交易`
                        }
                    ];
                    return ['404', replyMessage];
                } else if (updateCheckJwtToken === "updateCheckJwtTokenOk") {
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
                                    "text": "掃描交易地址",
                                    "size": "xl",
                                    "weight": "bold",
                                    "wrap": true
                                }
                            ]
                        },
                        // "body": {
                        //     "type": "box",
                        //     "layout": "vertical",
                        //     "contents": [
                        //         {
                        //             "type": "text",
                        //             "text": `資產名稱:${tokenName}`,
                        //             "wrap": true
                        //         },
                        //         {
                        //             "type": "text",
                        //             "text": `交易數量:${amount}`
                        //         }
                        //     ]
                        // },
                        "footer": {
                            "type": "box",
                            "layout": "vertical",
                            "contents": [
                                {
                                    "type": "button",
                                    "action": {
                                        "type": "uri",
                                        "label": "掃描",
                                        "uri": `https://liff.line.me/${process.env.MY_LIFF_ID_QRCODE}?amount=${amount}&tokenId=${tokenId}&time=${time}&jwtToken=${jwtToken}`
                                    },
                                    "style": "primary",
                                    "color": "#0000ff"
                                }
                            ]
                        }

                    }
                    flexMessage['contents'] = flex_template_temp_string;
                    console.log(JSON.stringify(flexMessage));
                    return ['200', [flexMessage]];
                }

            }
        });

    });

}

module.exports = {
    check_amount: check_amount
}