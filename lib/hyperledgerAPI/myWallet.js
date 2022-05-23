const replyFlexMessage = require('./../lineAPI/replyFlexMessage');
const fs = require('fs');
const chaincode = require('./../../fabric.js')
const myWallet = async (userId, lineBotToken) => {
    console.log('enter myWallet function');
    //此為Qrcode的訊息
    let flexQrcodeMessage = 'google.com'
    try{
        const result = await chaincode.getAddress(userID);
    }catch(err){
        console.log(`myWallet error : ${err}`);
    }
    let message = await replyFlexMessage.postFlexMessage(lineBotToken, userId, flexQrcodeMessage);
    return message;
}

module.exports = {
    myWallet: myWallet
}