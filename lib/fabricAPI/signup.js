const rp = require('request-promise');
const issignup = require('./issignup.js');
const address = require('./address.js');

/**
 * return address of the user
 * @param {*} userId enter userId
 */
const signup = async (userId) => {
    let address_temp = "";
    const result = issignup.issignup(userId);
    console.log(`result = ${result}`);
    console.log(`type = ${typeof(result)}`);
    if(result == true){
        console.log('issignup true');
        address_temp = address.address(userId);
        return `您已註冊 您的地址是: ${address_temp}`;
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
                address_temp = JSON.parse(body).response;
                console.log('signup API sucess');
                return address_temp;
            })
            .catch((err) => {
                console.log('err signup API = ');
            });
    }
    
}

module.exports = {
    signup: signup
}