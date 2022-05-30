const rp = require('request-promise');

/**
 * return true or false
 * @param {*} userId enter userId
 */
const address = async (userId) => {
    let rp_body = {
        "user": userId
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
    let result= "";
    rp(options)
        .then((body) => {
            body = JSON.stringify(body);
            console.log(JSON.stringify(body))
            result = JSON.parse(body).response;
            console.log(`address = ${result}`);
            console.log(`address type = ${typeof(result)}`);
            console.log('address API success');
            return result;
        })
        .catch((err) => {
            console.log('err address API = ');

            return err;
        });
}

module.exports = {
    address: address
}