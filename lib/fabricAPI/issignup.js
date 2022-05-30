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
        transform: function (body, response) {
            if (response.headers['content-type'] === 'application/json') {
                response.body = JSON.parse(body);
            }
            return response;
        }
    };
    console.log(`request ${process.env.FABRIC_API_ADDRESS}issignup/`);
    rp(options)
        .then((body) => {
            console.log(`address = ${body}`);
            console.log('issignup API sucess');
            return body.response;
        })
        .catch((err) => {
            console.log('err issignup API = ', err);

            return err;
        });
}

module.exports = {
    issignup: issignup
}