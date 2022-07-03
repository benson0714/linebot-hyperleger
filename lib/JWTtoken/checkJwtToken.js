const address = require("./../fabricAPI/address.js");
const jwt = require('jsonwebtoken');
const secret = process.env.BENSONJWTSECRET;

/**
 * 查看jwtToken是否是使用正確的地址，並檢查token是否expire
 * @param {*} userId 
 * @returns 
 */
const checkJwtToken = async (userId, jwtToken) => {
    const Address = await address.address(userId);
    return jwt.verify(jwtToken, secret, function(err, decoded) {
        if(err){
            // 如果jwt expired就刪除舊的jwt token in level db
            if(err['message']==='jwt expired'){
                return "delete&create";
            } else{
                return "Error";
            }
        } else{
            if(decoded.address===Address){
                return "doubleCheck";
            } else{
                return "Error";
            }
        }
      });
}

module.exports = {
    checkJwtToken:checkJwtToken
}