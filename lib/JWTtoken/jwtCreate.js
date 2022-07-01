const jwt = require('jsonwebtoken');
const secret = process.env.SECRET;
/**
 * return jwtToken with payload address
 * @param {*} address 
 * @returns 
 */
const jwtCreate = (address) =>{
    const JWTtoken = jwt.sign({
        address: address
      }, secret, { expiresIn: '5m' });
      return JWTtoken;
}

module.exports = {jwtCreate:jwtCreate}