const xxxxxx = require('./../lineAPI/pushMessageAPI.js');

const currencyJSON = (address) => {
// 取得幣種並更改json
    const jsonTemp = require(`./../json/${address}`);
    console.log(`address = ${address}`);
    return address;
}

module.exports = {
    currencyJSON: currencyJSON
}