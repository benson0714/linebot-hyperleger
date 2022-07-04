const { Level } = require('level');
const address = require("../fabricAPI/address.js");

const checkJwtToken = require("../JWTtoken/checkJwtToken.js");


const step2checkDB = async (userId, jwtToken) => {
    const db = new Level('levelDB', { valueEncoding: 'json' });
    const sub = db.sublevel("addressList");
    console.log('enter createDB');
    console.log(db.status);
    console.log(sub.status);
    const Address = await address.address(userId);
    console.log(`address = ${Address}`)

    // subkey is address in address list
    for await (const subkey of sub.keys()) {
        console.log('already have address in address list');
        console.log(`subkey = ${subkey}`);
        console.log(`jwtToken = ${jwtToken}`)
        console.log(`await sub.get(Address) = ${await sub.get(Address)}`)
        // 已在address list有紀錄了
        if (subkey === Address && jwtToken === await sub.get(Address)) {
            const result = await checkJwtToken.checkJwtToken(Address, jwtToken);
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
                if (step['process'] === "step2") {
                    return "checkDBOk"
                    // 若已經在第二步，卻跑回來點第一步，回傳step2handle
                } else if (step['process'] === "step1") {
                    return "step1handle";
                }
            }
        } else {
            continue;
        }

    }
    // 如果執行到這代表沒有還未點選過transfer，連address list都還沒create
    return "stepXhandle"
}

module.exports = {
    step2checkDB: step2checkDB
}