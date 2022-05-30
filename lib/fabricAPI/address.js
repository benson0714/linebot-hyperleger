const rp = require('request-promise');

/**
 * return address of user
 * @param {*} userId enter userId
 */
const address = (userId) => {
    return new Promise((resolve, reject) => {
        options = {
            method: 'POST',
            uri: `${process.env.FABRIC_API_ADDRESS}address/`,
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                "user": userId
            },
            // it will return string if you forget to add json:true 
            json: true
        }
        resolve(rp(options));
        reject('fabric api address err');
    })
}

module.exports = {
    address: address
}