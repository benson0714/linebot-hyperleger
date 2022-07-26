const replyMessage = require('./../lineAPI/replyMessageAPI.js');
const address_func = require('./../fabricAPI/address.js');
const fs = require('fs');
const path = require("path");

const myWallet = async (userId, lineBotToken, replyToken) => {
    // use promise(.then) type to get the address_func.address function
    const address = await address_func.address(userId).then(async (address) => {
        let flexMessage = fs.readFileSync(path.resolve(__dirname, "./../json/flexExample.json"));
        flexMessage = await JSON.parse(flexMessage);
        console.log(`address in myWallet.js = ${address}`)
        //此為Qrcode的地址
        const contents = {
            "type": "bubble",
            "hero": {
                "type": "image",
                "url": `https://chart.googleapis.com/chart?cht=qr&chs=300x300&cht=qr&chl=${address}`,
                "size": "3xl",
                "aspectRatio": "15:13",
                "aspectMode": "cover"
            },
            "body": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                    {
                        "type": "text",
                        "text": "帳戶資訊",
                        "weight": "bold",
                        "size": "xl",
                        "align": "center"
                    },
                    {
                        "type": "box",
                        "layout": "vertical",
                        "margin": "lg",
                        "spacing": "sm",
                        "contents": [
                            {
                                "type": "box",
                                "layout": "baseline",
                                "spacing": "sm",
                                "contents": [
                                    {
                                        "type": "text",
                                        "text": "地址",
                                        "color": "#aaaaaa",
                                        "size": "sm",
                                        "flex": 1
                                    },
                                    {
                                        "type": "text",
                                        "text": `${address}`,
                                        "wrap": true,
                                        "color": "#666666",
                                        "size": "sm",
                                        "flex": 5
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            "footer": {
                "type": "box",
                "layout": "vertical",
                "spacing": "sm",
                "contents": [
                    {
                        "type": "button",
                        "height": "sm",
                        "style": "secondary",
                        "action": {
                            "type": "postback",
                            "label": "複製地址",
                            "data": `action=show_address&${address}`
                        }
                    },
                    {
                        "type": "spacer",
                        "size": "sm"
                    }
                ],
                "flex": 0
            }
        }
        //concat flexQrcodeMessage into json
        flexMessage['contents'] = contents;
        try {

            let message = await replyMessage.replyMessage([flexMessage], replyToken, lineBotToken);
            return message;
        } catch (err) {
            console.log(`myWallet error : ${err}`);
        }
        return flexMessage;
    })


}

module.exports = {
    myWallet: myWallet
}