const pushMessage = require('./../lineAPI/pushMessageAPI.js');
const balance = require("./../fabricAPI/balance.js");
/**
 * 查看使用者的餘額是否足夠，如果足夠就跳轉到掃qrcode畫面
 * @param {*} userId 
 * @param {*} lineBotToken 
 * @param {*} amount 
 * @param {*} tokenId 
 */
const check_amount = (userId, lineBotToken, amount, tokenId) => {
    const total_amount = balance.balance(userId, tokenId);
    console.log(total_amount);
}

module.exports = {
    check_amount: check_amount
}