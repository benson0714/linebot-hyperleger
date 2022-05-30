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
    console.log(`request ${process.env.FABRIC_API_ADDRESS}address/`);
    rp(options)
        .then((body) => {
            const address = JSON.parse(body);
            console.log('address API sucess');
            return address.response;
        })
        .catch((err) => {
            console.log('err address API = ', err);

            return err;
        });
}

module.exports = {
    address: address
}