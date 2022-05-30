const rp = require('request-promise');
const issignup = require('./issignup.js');
const address = require('./address.js');

/**
 * return address of the user
 * @param {*} userId enter userId
 */
const signup = (userId) => {
    const result = issignup.issignup(userId);
    if(result == true){
        console.log('issignup true');
        return `您已註冊 您的地址是: ${result}`;
    } else{
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
                body = JSON.stringify(body);
                const address = JSON.parse(body);
                console.log('signup API sucess');
                return address.response;
            })
            .catch((err) => {
                console.log('err signup API = ');
            });
    }

    
}

module.exports = {
    signup: signup
}