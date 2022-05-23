const replyFlexMessage = require('./../lineAPI/replyFlexMessage');
const fs = require('fs');


let student = JSON.parse(rawdata);
console.log(student);
//此為Qrcode的訊息
let flexQrcodeMessage = 'google.com'
const myWallet = (userId, lineBotToken) => {
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