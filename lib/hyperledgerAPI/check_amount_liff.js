const pushMessage = require('./../lineAPI/pushMessageAPI.js');
const balance = require("./../fabricAPI/balance.js");
const fs = require('fs');
const path = require("path");

/**
 * 查看使用者的餘額是否足夠，如果足夠就跳轉到掃qrcode畫面
 * @param {*} userId 
 * @param {*} lineBotToken 
 * @param {*} amount 
 * @param {*} tokenId 
 */
const check_amount = async (userId, lineBotToken, amount, tokenId) => {
        // use promise(.then) type to get the address_func.address function
        const address = await address_func.address(userId).then(async (address)=>{
            //此為Qrcode的地址
            let flexMessage = fs.readFileSync(path.resolve(__dirname, "./../json/flexExample.json"));
            flexMessage = await JSON.parse(flexMessage);
            //concat flexQrcodeMessage into json
            flexMessage['contents']['hero']['url'] = flexMessage['contents']['hero']['url'].concat(address);
            flexMessage['contents']['body']['contents'][2]['contents'][0]['contents'][1]['text'] = address;
            flexMessage['contents']['footer']['contents'][0]['action']['data'] = flexMessage['contents']['footer']['contents'][0]['action']['data'].concat(address)
            return address;
        })
    
        try{
    
            let message = await replyFlexMessage.postFlexMessage(lineBotToken, userId, address);
            return message;
        }catch(err){
            console.log(`myWallet error : ${err}`);
        }
    }

module.exports = {
    check_amount: check_amount
}