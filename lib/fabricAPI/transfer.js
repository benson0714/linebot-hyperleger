const rp = require('request-promise');
const address = require('./address.js');

/**
 * transfer balance to recipient
 * @param {*} userId 
 * @param {*} recipient 
 * @param {*} tokenId 
 * @param {*} amount 
 * @returns 
 */
const transfer = async (userId, recipient, tokenId, amount) => {
    return address.address(userId).then(async (address_temp)=>{
        let rp_body = {
            "user":userId,
            "sender": address_temp,
            "recipient": recipient,
            "token":tokenId,
            "amount": amount
        };
        let options = {
            method: 'POST',
            url: `${process.env.FABRIC_API_ADDRESS}transfer/`,
            json: true,
            body: rp_body,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        console.log(`request ${process.env.FABRIC_API_ADDRESS}transfer/`);
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
    transfer: transfer
}