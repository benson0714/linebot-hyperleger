const replyFlexMessage = require('./../lineAPI/replyFlexMessage');
const fs = require('fs');
const chaincode = require('./../../fabric.js')
const myWallet = async (userId, lineBotToken) => {
    console.log('enter myWallet function');

    try{
        //此為Qrcode的地址
        // const address = await chaincode.getAddress(userId);
        const address = 'google.com';
        let message = await replyFlexMessage.postFlexMessage(lineBotToken, userId, address);
        return message;
    }catch(err){
        console.log(`myWallet error : ${err}`);
    }
}

module.exports = {
    myWallet: myWallet
}