const rp = require('request-promise');
require("dotenv").config();

/**
 * return metadata json of token
 * @param {*} token enter String token
 * 
 * {
{
 "id": "6",
 "name": "Time Coin",
 "description": "This is ERC20 Token For demo.",
 "image": "https://gateway.pinata.cloud/ipfs/QmNw3HKifuXQ4qNS1a5Wv7nDNnmSCVTfgw4Qiz8G3iymvH/6_timecoin.png"
}
 */
const metadata = async (token) => {
    let rp_body = {
        "token": token
    };
    let options = {
        method: 'POST',
        url: `${process.env.FABRIC_API_ADDRESS}metadata/`,
        json: true,
        body: rp_body,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    console.log(`request ${process.env.FABRIC_API_ADDRESS}metadata/`);
    return rp(options)
        .then(async (body) => {
            body = JSON.stringify(body);
            const result = JSON.parse(body).response;
            console.log(`metadata result = ${result}`);
            console.log('metadata API success');
            return result;
        })
        .catch((err) => {
            console.log('err metadata API');
            return "404"
        });
}

module.exports = {
    metadata: metadata
}