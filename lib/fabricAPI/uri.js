const rp = require('request-promise');

/**
 * return uri of token
 * @param {*} token enter String token
 */
const uri = async (token) => {
    let rp_body = {
        "token": token
    };
    let options = {
        method: 'POST',
        url: `${process.env.FABRIC_API_ADDRESS}uri/`,
        json: true,
        body: rp_body,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    console.log(`request ${process.env.FABRIC_API_ADDRESS}uri/`);
    return rp(options)
        .then((body) => {
            body = JSON.stringify(body);
            const result = JSON.parse(body).response;
            console.log(`result = ${result}`);
            console.log(`result type = ${typeof(result)}`);
            console.log('uri API success');
            let options = {
                method: 'GET',
                url: result
            }
            return rp(options)
            .then((body)=>{
                body = JSON.stringify(body);
                console.log(`ipfs body = ${body}`);
                return body;
            })
            .catch((err)=>{
                console.log('err uri API body = ', err);
                return err;
            })
        })
        .catch((err) => {
            console.log('err uri API = ', err);
            return err;
        });
}

module.exports = {
    uri: uri
}