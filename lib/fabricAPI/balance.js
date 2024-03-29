const rp = require('request-promise');
const address = require('./address.js');
require("dotenv").config();

/**
 * return true or false
 * @param {*} userId enter userId
 */
const balance = async (userId, tokenId) => {
    return address.address(userId).then(async (address_temp)=>{
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
            console.log(body);
            const result = body['response'];
            console.log(result);
            console.log('balance API success');
            return result;
        } catch (err) {
            console.log('err balance API = ', err);
            return err;
        }
    })
    
}

module.exports = {
    balance: balance
}