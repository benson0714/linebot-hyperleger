const pushMessage = require('./../lineAPI/pushMessageAPI.js');
const chaincode = require('./../../fabric.js')

/**
 * check user balance(nft or erc20)
 * @param {*} userId 
 * @param {*} lineBotToken 
 */
const balance = async (userId, lineBotToken) => {
    const address = await chaincode.getAddress(userId);
}

module.exports = {
    balance: balance
}