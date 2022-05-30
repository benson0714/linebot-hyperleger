const rp = require('request-promise');
const address = require('./address');

/**
 * return true or false
 * @param {*} userId enter userId
 */
const allbalance = async (userId) => {
    return address.address(userId).then((address_temp)=>{
        console.log(address_temp);
        let rp_body = {
            "address": "0x149a4a01674d9283362e9920748b40b5a6887b60"
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
        let result= true;
        return rp(options)
            .then((body) => {
                body = JSON.stringify(body);
                result = JSON.parse(body).response;
                console.log(`result = ${result}`);
                console.log(`result type = ${typeof(result)}`);
                console.log('allbalance API success');
                return result;
            })
            .catch((err) => {
                console.log('err allbalance API = ', err);
    
                return err;
            });
    })
    
}

module.exports = {
    allbalance: allbalance
}