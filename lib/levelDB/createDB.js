const { Level } = require('level');
const createJwt = require('./../JWTtoken/jwtCreate.js');
const address = require("./../fabricAPI/address.js");
const checkJwtToken = require("./../JWTtoken/checkJwtToken.js");

const del_create = async (Address, db, sub) => {
    const JWTtoken = createJwt.jwtCreate(Address);
    console.log(`del_create jwt result = ${JWTtoken}`)
    const JWTobject = {
        "process": "step1",
        "address": Address
    };
    await db.batch([
        { type: 'del', key: sub.get(Address) },
        { type: 'put', key: JWTtoken, value: JWTobject, valueEncoding: 'json' }
    ], { valueEncoding: 'utf8' });
    // update address list
    await sub.batch([
        { type: 'del', key: sub.get(Address) },
        { type: 'put', key: Address, value: JWTtoken, valueEncoding: 'json' }
    ], { valueEncoding: 'utf8' });
}

const createDB = async (userId) => {
    const db = new Level('levelDB', { valueEncoding: 'json' });
    const sub = db.sublevel("addressList");
    if(db.status==="closed" || sub.status ==="closed"){
        db.open([{passive:true}])
        sub.open([{passive:true}])
    }
    console.log('enter createDB');

    const Address = await address.address(userId);
    console.log(`address = ${Address}`)
    console.log(db.status);
    console.log(sub.status);
    // subkey is address in address list
    for await (const subkey of sub.keys()) {
        console.log('already have address in address list');
        // 已在address list有紀錄了
        if (subkey === Address) {
            const JWTtoken = await createJwt.jwtCreate(Address);
            const result = await checkJwtToken.checkJwtToken(Address, JWTtoken);
            console.log(`checkJWT result = ${result}`);
            if (result === 'delete&create') {
                console.log("enter delete&create")
                await del_create(Address, db, sub);
                const values = await db.values().all()
                console.log(values);
                return [JWTtoken, "step1Ok"];
            } else if (result === 'doubleCheck') {
                console.log("enter doubleCheck");
                // 利用address去找key為jwttoken的value
                const step = await db.get(await sub.get(Address));
                console.log(`step['process'] = ${step['process']}`)
                if (step['process'] === "step1") {
                    await del_create(Address, db, sub);
                    return [JWTtoken, "step1Ok"];
                    // 若已經在第二步，卻跑回來點第一步，回傳step2handle
                } else if (step['process'] === "step2") {
                    return [JWTtoken, "step2handle"];
                }
            }
        } else {
            continue;
        }

    }
    const JWTobject = {
        "process": "step1",
        "address": Address
    };
    const JWTtoken = await createJwt.jwtCreate(Address);
    console.log('create a new one1');
    await db.batch([
        { type: 'put', key: JWTtoken, value: JWTobject, valueEncoding: 'json' }
    ], { valueEncoding: 'utf8' })

    await sub.put(Address, JWTtoken);
    return [JWTtoken, "step1Ok"];
    // console.log(db.status)

    // // Get all at once. Setting a limit is recommended.
    // const values = await db.values({ gte: 'a', limit: 10 }).all()
    // console.log(values);
    // console.log(await sub.values({ limit: 10 }).all())
    // console.log(`jwtToken = ${JWTtoken}`);
    // console.log(`type of jwtToken = ${typeof (JWTtoken)}`);

}

module.exports = {
    createDB: createDB
}