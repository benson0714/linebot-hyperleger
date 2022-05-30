const rp = require('request-promise');

/**
 * return true or false
 * @param {*} userId enter userId
 */
const issignup = (userId) => {
    let rp_body = {
        "user": userId,
        "address": " "
    };
    let options = {
        method: 'POST',
        url: `${process.env.FABRIC_API_ADDRESS}issignup/`,
        json: true,
        body: rp_body,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    console.log(`request ${process.env.FABRIC_API_ADDRESS}issignup/`);
    rp(options)
        .then((body) => {
            console.log(`address = ${JSON.parse(body)}`);
            const address = JSON.parse(body).response;
            console.log('issignup API sucess');
            return address;
        })
        .catch((err) => {
            console.log('err issignup API = ', err);

            return err;
        });
}

module.exports = {
    issignup: issignup
}