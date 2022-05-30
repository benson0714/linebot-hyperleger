const rp = require('request-promise');

/**
 * return true or false
 * @param {*} userId enter userId
 */
const issignup = async (userId) => {
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
    let result= true;
    rp(options)
        .then(async (body) => {
            body = JSON.stringify(body);
            result = await JSON.parse(body).response;
            console.log(`result = ${result}`);
            console.log(`result type = ${typeof(result)}`);
            console.log('issignup API sucess');
            return result;
        })
        .catch((err) => {
            console.log('err issignup API = ', err);

            return err;
        });
}

module.exports = {
    issignup: issignup
}