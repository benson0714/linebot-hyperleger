const rp = require('request-promise');
const issignup = require('./issignup.js');
const address = require('./address.js');

/**
 * return address of the user
 * @param {*} userId enter userId
 */
const signup = async (userId) => {
    return issignup.issignup(userId).then((result)=>{
        console.log(result);
        if(result == true){
            console.log('issignup true');
            return address.address(userId).then((address_temp)=>{
                console.log(address_temp);
                return address_temp;
            });
    
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
            return await rp(options)
                .then((body) => {
                    body = JSON.stringify(body);
                    address_temp = JSON.parse(body).response;
                    console.log('signup API sucess');
                    return address_temp;
                })
                .catch((err) => {
                    console.log(`err signup API = ${err}`);
                });
        }
    });
    
    
}

module.exports = {
    signup: signup
}