const rp = require('request-promise');
const issignup = require('./issignup.js');
const address = require('./address.js');

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
    // request fabric server to get signup address
    rp(options)
        .then((body) => {
            const address = JSON.parse(body);
            console.log('signup API sucess');
            return address.response;
        })
        .catch((err) => {
            console.log('err signup API = ', err);
            if(issignup.issignup(userId)){
                return address.address(userId);
            } else{
                return err;
            }
        });
}

module.exports = {
    signup: signup
}