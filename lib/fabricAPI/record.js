const rp = require('request-promise');
const address = require('./address');
require("dotenv").config();

/**
 * return transfer record and address by array [record, address]
 * @param {*} userId enter userId
 * @param {*} tokenId enter tokenId
 */
const record = async (userId, tokenId) => {
    return address.address(userId).then(async (address_temp)=>{
        console.log(address_temp);
        let rp_body = {
            "address": address_temp,
            "token":tokenId
        };
        let options = {
            method: 'POST',
            url: `${process.env.FABRIC_API_ADDRESS}record/`,
            json: true,
            body: rp_body,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        console.log(`request ${process.env.FABRIC_API_ADDRESS}record/`);
        return rp(options)
            .then((body) => {
                body = JSON.stringify(body);
                const result = JSON.parse(body).response;
                console.log(`result = ${JSON.stringify(result)}`);
                console.log(`result type = ${typeof(result)}`);
                console.log('record API success');
                return [result, address_temp];
            })
            .catch((err) => {
                console.log('err record API = ', err);
                return err;
            });
    })
}

module.exports = {
    record: record
}