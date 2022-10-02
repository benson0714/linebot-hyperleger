const jwt = require('jsonwebtoken');
require("dotenv").config();

const secret = process.env.BENSONJWTSECRET;
/**
 * return jwtToken with payload address
 * @param {*} address 
 * @returns 
 */
const jwtCreate = async (address) =>{
    const JWTtoken = jwt.sign({
        address: address
      }, secret, { expiresIn: '5m' });
      return JWTtoken;
}

module.exports = {jwtCreate:jwtCreate}