const rp = require('request-promise');

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
        }
        resolve(rp(options));
        reject('login err')
    })
}

module.exports = {
    login: login
}