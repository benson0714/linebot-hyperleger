const { Level } = require('level');
const address = require("./../fabricAPI/address.js");

const checkJwtToken = require("./../JWTtoken/checkJwtToken.js");


const updateDB = async (userId, jwtToken) => {
    const db = new Level('levelDB', { valueEncoding: 'json' });
    const sub = db.sublevel("addressList");
    if(db.status==="closed" || sub.status ==="closed"){
        db.open([{passive:true}])
        sub.open([{passive:true}])
    }
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
                await db.close();
                await sub.close();
                return "expireMessage";
            } else if (result === 'doubleCheck') {
                // 確認state是否是對的
                console.log("enter doubleCheck");
                // 利用address去找key為jwttoken的value
                const step = await db.get(await sub.get(Address));
                console.log(`step['process'] = ${step['process']}`)
                if (step['process'] === "step1") {
                    const JWTobject = {
                        "process": "step2",
                        "address": Address
                    };
                    await db.batch([
                        { type: 'del', key: sub.get(Address) },
                        { type: 'put', key: jwtToken, value: JWTobject, valueEncoding: 'json' }
                    ], { valueEncoding: 'utf8' });
                    await db.close();
                    await sub.close();
                    return "updateCheckJwtTokenOk"
                    // 若已經在第二步，卻跑回來點第一步，回傳step2handle
                } else if (step['process'] === "step2") {
                    await db.close();
                    await sub.close();
                    return "step2handle";
                } else if (step['process'] === "step3") {
                    await db.close();
                    await sub.close();
                    return "step3handle";
                } else if (step['process'] === "step4") {
                    await db.close();
                    await sub.close();
                    return "step4handle";
                } 
            }
        } else {
            continue;
        }

    }
    //如果執行到這代表沒有還未點選過transfer
    await db.close();
    return "stepXhandle"
}

module.exports = {
    updateDB: updateDB
}