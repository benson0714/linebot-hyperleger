const rp = require('request-promise');

// GET JWT token after login
const login = (userid, password) => {
    return new Promise((resolve, reject) => {
        options = {
            method: 'POST',
            uri: 'http://140.120.53.218:18086/tku/api/login/',
            headers: {
                'Content-Type': 'application/json',
                'userid': userid,
                'password': password,
            },
            // it will return string if you forget to add json:true 
            json: true
        }
        resolve(rp(options));
        reject('hyperledger_api.js login err')
    })
}

module.exports = {
    login: login,

}