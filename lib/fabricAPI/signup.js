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
        body: rp_body,
        headers: {
            'Content-Type': 'application/json'
        }
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
            console.log('err signup API = ');
            const result = issignup.issignup(userId);
            if(result == true){
                console.log('issignup true');
                return `您已註冊 您的地址是: ${result}`;
            } else{
                console.log('issignup false');
                return err;
            }
        });
}

module.exports = {
    signup: signup
}