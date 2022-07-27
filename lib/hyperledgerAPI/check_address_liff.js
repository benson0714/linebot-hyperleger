const balance = require("./../fabricAPI/balance.js");
const uri = require("./../fabricAPI/uri.js");
const fs = require('fs');
const path = require("path");
const step2UpdateDB = require('./../levelDB/step2UpdateDB.js');
const address_func = require('./../fabricAPI/address.js');

/**
 * 確認輸入地址是否正確
 * @param {*} userId 
 * @param {*} lineBotToken 
 * @param {*} amount 
 * @param {*} tokenId 
 * @param {*} address 
 * @param {*} old_time 
 * @returns 
 */
const check_address = async (userId, lineBotToken, amount, tokenId, address, old_time, jwtToken) => {
    const time = Date.now()
    console.log(`time = ${time}`);
    console.log(`old_time = ${old_time}`);
    const Address = await address_func.address(userId);
    if (Address === address) {
        // 輸入相同地址
        replyMessage = [
            {
                type: 'text',
                text: `不可輸入與自己相同的地址，請重新操作開啟相機`
            }
        ];
        return ['404', replyMessage];
    } else if (address === "") {
        // 未掃描就關閉頁面
        replyMessage = [
            {
                type: 'text',
                text: `請重新點選tap me並掃描qrcode地址`
            }
        ];
        return ['404', replyMessage];
    } else {
        return await balance.balance(userId, tokenId).then(async (total_amount) => {
            return await uri.uri(tokenId).then(async (uri_tmp) => {
                if (Number(total_amount) < Number(amount)) {
                    console.log('enter dont have enough amount');
                    replyMessage = [
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
                } else {
                    console.log("enough amount");
                    const updateCheckJwtToken = await step2UpdateDB.step2UpdateDB(userId, jwtToken);
                    console.log(`updateCheckJwtToken = ${updateCheckJwtToken}`);
                    if (updateCheckJwtToken === "expireMessage") {
                        replyMessage = [
                            {
                                type: 'text',
                                text: `此筆交易已超過5分鐘，請重新開始交易`
                            }
                        ];
                        return ['404', replyMessage];
                    } else if (updateCheckJwtToken === "step1handle") {
                        // 已經在第二步卻跑回去點第一步
                        replyMessage = [
                            {
                                type: 'text',
                                text: `請先點選transfer重新執行交易操作`
                            }
                        ];
                        return ['404', replyMessage];
                    } else if (updateCheckJwtToken === "step3handle") {
                        replyMessage = [
                            {
                                type: 'text',
                                text: `您還未開啟相機掃描qrcode，請先執行此操作`
                            }
                        ];
                        return ['404', replyMessage];
                    } else if (updateCheckJwtToken === "stepXhandle") {
                        replyMessage = [
                            {
                                type: 'text',
                                text: `請重新開始交易`
                            }
                        ];
                        return ['404', replyMessage];
                    } else if (updateCheckJwtToken === "updateCheckJwtTokenOk") {
                        uri_tmp = JSON.parse(uri_tmp);
                        const tokenName = uri_tmp['name'];
                        console.log(tokenName);
                        console.log(`total_amount = ${total_amount}`);
                        console.log(`amount = ${amount}`);
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
                                        "text": "請確認交易資訊",
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
                                        "text": `交易對象\n${address}`,
                                        "wrap": true
                                    },
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
                                            "label": "移轉",
                                            "uri": `https://liff.line.me/1656864170-pOEXXm7R?address=${address}&tokenId=${tokenId}&amount=${amount}&jwtToken=${jwtToken}`
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



}

module.exports = {
    check_address: check_address
}