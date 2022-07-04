const { Level } = require('level');
const address = require("./../fabricAPI/address.js");
const db = new Level('levelDB', { valueEncoding: 'json' });
const sub = db.sublevel("addressList");
const checkJwtToken = require("./../JWTtoken/checkJwtToken.js");


const updateDB = async (userId, jwtToken) => {
    console.log('enter createDB');
    console.log(db.status);
    console.log(sub.status);
    const Address = await address.address(userId);
    console.log(`address = ${Address}`)

    // subkey is address in address list
    for await (const subkey of sub.keys()) {
        console.log('already have address in address list');
        // 已在address list有紀錄了
        if (subkey === Address && jwtToken === subkey[Address]) {
            const result = await checkJwtToken.checkJwtToken(userId, jwtToken);
            console.log(`checkJWT result = ${result}`);
            if (result === 'delete&create') {
                console.log("jwt expire")
                
                return "expireMessage";
            } else if (result === 'doubleCheck') {
                // 確認state是否是對的
                console.log("enter doubleCheck");
                // 利用address去找key為jwttoken的value
                const step = await db.get(await sub.get(Address));
                console.log(`step['process'] = ${step['process']}`)
                if (step['process'] === "step1") {
                    const JWTobject = {
                        "process": "step1",
                        "address": Address
                    };
                    await db.batch([
                        { type: 'del', key: sub.get(Address) },
                        { type: 'put', key: jwtToken, value: JWTobject, valueEncoding: 'json' }
                    ], { valueEncoding: 'utf8' });
                    return "updateCheckJwtTokenOk"
                    // 若已經在第二步，卻跑回來點第一步，回傳step2handle
                } else if (step['process'] === "step2") {
                    return "step2handle";
                }
            }
        } else {
            continue;
        }

    }
    //如果執行到這代表沒有還未點選過transfer
    return "stepXhandle"
}

module.exports = {
    updateDB: updateDB
}