const rp = require('request-promise');

/**
 * return address of user
 * @param {*} userId enter userId
 */

const address = (userId) => {
    let rp_body = {
        "user": userId,
    };
    let options = {
        method: 'POST',
        url: `${process.env.FABRIC_API_ADDRESS}address/`,
        json: true,
        body: rp_body,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    let address_temp = ""
    console.log(`request ${process.env.FABRIC_API_ADDRESS}address/`);
    rp(options)
        .then((body) => {
            body = JSON.stringify(body);
            address_temp = JSON.parse(body).response;
            console.log('address API sucess');
            return address_temp;
        })
        .catch((err) => {
            console.log('err address API = ');

            return err;
        });
        return address_temp;
}

module.exports = {
    address: address
}