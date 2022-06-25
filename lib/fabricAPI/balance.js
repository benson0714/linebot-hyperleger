const rp = require('request-promise');
const address = require('./address.js');

/**
 * return true or false
 * @param {*} userId enter userId
 */
const balance = async (userId, tokenId) => {
    return address.address(userId).then(async (address_temp)=>{
        console.log(address_temp);
        let rp_body = {
            "address": address_temp,
            "token":tokenId
        };
        let options = {
            method: 'POST',
            url: `${process.env.FABRIC_API_ADDRESS}balance/`,
            json: true,
            body: rp_body,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        console.log(`request ${process.env.FABRIC_API_ADDRESS}balance/`);
        try {
            const body = await rp(options);
            body = JSON.stringify(body);
            const result = JSON.parse(body).response;
            console.log(`result = ${JSON.stringify(result)}`);
            console.log(`result type = ${typeof (result)}`);
            console.log('allbalance API success');
            return result;
        } catch (err) {
            console.log('err allbalance API = ', err);
            return err;
        }
    })
    
}

module.exports = {
    balance: balance
}