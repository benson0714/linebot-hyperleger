const rp = require('request-promise');
const address = require('./address');

/**
 * return true or false
 * @param {*} userId enter userId
 */
const allbalance = async (userId) => {
    return address.address(userId).then(async (address_temp)=>{
        console.log(address_temp);
        let rp_body = {
            "address": address_temp
        };
        let options = {
            method: 'POST',
            url: `${process.env.FABRIC_API_ADDRESS}allbalance/`,
            json: true,
            body: rp_body,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        console.log(`request ${process.env.FABRIC_API_ADDRESS}allbalance/`);
        try {
            const body = await rp(options);
            const result = body['response'];
            console.log('allbalance API success');
            return result;
        } catch (err) {
            console.log('err allbalance API = ', err);
            return err;
        }
    })
    
}

module.exports = {
    allbalance: allbalance
}