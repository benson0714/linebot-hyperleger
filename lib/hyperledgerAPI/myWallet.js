const replyFlexMessage = require('./../lineAPI/replyFlexMessage');
const fs = require('fs');

const myWallet = async (userId, lineBotToken) => {
    //此為Qrcode的訊息
    let flexQrcodeMessage = 'google.com'
    try{
        const result = await chaincode.getAddress(userID);
    }catch(err){
        console.log(`myWallet error : ${err}`);
    }
    let message = await replyFlexMessage.postFlexMessage(lineBotToken, userId, flexQrcodeMessage);
    console.log('enter myWallet function');

}

module.exports = {
    myWallet: myWallet
}