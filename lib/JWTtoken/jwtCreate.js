const jwt = require('jsonwebtoken');
const secret = process.env.BENSONJWTSECRET;
/**
 * return jwtToken with payload address
 * @param {*} address 
 * @returns 
 */
const jwtCreate = async (address) =>{
    const JWTtoken = jwt.sign({
        address: address
      }, secret, { expiresIn: '30s' });
      return JWTtoken;
}

module.exports = {jwtCreate:jwtCreate}