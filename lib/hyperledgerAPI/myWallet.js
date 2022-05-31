const replyFlexMessage = require('./../lineAPI/replyFlexMessage');
const address_func = require('./../fabricAPI/address.js');

const myWallet = async (userId, lineBotToken) => {
    // use promise(.then) type to get the address_func.address function
    const address = await address_func.address(userId).then((address)=>{
        //此為Qrcode的地址
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
    myWallet: myWallet
}