const rp = require('request-promise');

/**
 * return address of the user
 * @param {*} userId enter userId
 */
const signup = (userId) => {
    let rp_body = {
        'user': userId
    };
    let options = {
        method: 'POST',
        url: `${process.env.FABRIC_API_ADDRESS}signup/`,
        json: true,
        body: rp_body
    };
    console.log(`request ${process.env.FABRIC_API_ADDRESS}signup/`);
    rp(options)
        .then((body) => {
            console.log('signup API sucess');
            const address = JSON.parse(body);
            return address.response;
        })
        .catch((err) => {
            console.log('err signup API = ', err);
            return err;
        });
}

module.exports = {
    signup: signup
}