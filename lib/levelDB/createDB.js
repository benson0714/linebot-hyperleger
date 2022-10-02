const { Level } = require('level');
const createJwt = require('./../JWTtoken/jwtCreate.js');
const address = require("./../fabricAPI/address.js");
const checkJwtToken = require("./../JWTtoken/checkJwtToken.js");

const del_create = async (Address, db, sub) => {
    const JWTtoken = await createJwt.jwtCreate(Address);
    console.log(`del_create jwt result = ${JWTtoken}`)
    const JWTobject = {
        "process": "step1",
        "address": Address
    };
    await db.batch([
        { type: 'del', key: await sub.get(Address) },
        { type: 'put', key: JWTtoken, value: JWTobject, valueEncoding: 'json' }
    ], { valueEncoding: 'utf8' });
    // update address list
    await sub.batch([
        { type: 'del', key: Address },
        { type: 'put', key: Address, value: JWTtoken}
    ], { valueEncoding: 'utf8' });
}

const createDB = async (userId) => {
    const db = new Level('levelDB', { valueEncoding: 'json' });
    const sub = db.sublevel("addressList");
    
    if (db.status === "closed" || sub.status === "closed") {
        db.open([{ passive: true }])
        sub.open([{ passive: true }])
    }
    console.log('enter createDB');
    // 找地址
    const Address = await address.address(userId);

    // subkey is address in address list
    for await (const subkey of sub.keys()) {
        // 已在address list有紀錄了
        if (subkey === Address) {
            console.log('already have address in address list');
            const JWTtoken = await createJwt.jwtCreate(Address);
            const result = await checkJwtToken.checkJwtToken(Address, JWTtoken);
            console.log(`checkJWT result = ${result}`);
            if (result === 'delete&create') {
                console.log("enter delete&create")
                await del_create(Address, db, sub);
                const keys = await db.keys().all();
                console.log("db key value");
                console.log(keys);
                const values = await sub.values().all();
                console.log("sub values value");
                console.log(values);
                await db.close();
                await sub.close();
                return [JWTtoken, "step1Ok"];
            } else if (result === 'doubleCheck') {
                console.log("enter doubleCheck");
                const keys = await db.keys().all();
                console.log("db key value");
                console.log(keys);
                const values = await sub.values().all();
                console.log("sub values value");
                console.log(values);
                // 利用address去找key為jwttoken的value
                const temp = await sub.get(Address);
                console.log(temp)
                console.log(typeof(temp))
                const step = await db.get(temp);

                console.log(`step['process'] = ${step['process']}`)
                if (step['process'] === "step1" || step['process'] === "step4") {
                    console.log("enter createDB step1");
                    await del_create(Address, db, sub);
                    const keys = await db.keys().all();
                    console.log("db key value");
                    console.log(keys);
                    const values = await sub.values().all();
                    console.log("sub values value");
                    console.log(values);
                    await db.close();
                    await sub.close();
                    return [JWTtoken, "step1Ok"];
                    // 若已經在第二步，卻跑回來點第一步，回傳step2handle
                // } else if (step['process'] === "step2") {
                //     console.log("enter createDB step2");
                //     const keys = await db.keys().all();
                //     console.log("db key value");
                //     console.log(keys);
                //     const values = await sub.values().all();
                //     console.log("sub values value");
                //     console.log(values);
                //     await db.close();
                //     await sub.close();
                //     return [JWTtoken, "step2handle"];
                // } else if (step['process'] === "step3") {
                //     console.log("enter createDB step3");
                //     const keys = await db.keys().all();
                //     console.log("db key value");
                //     console.log(keys);
                //     const values = await sub.values().all();
                //     console.log("sub values value");
                //     console.log(values);
                //     await db.close();
                //     await sub.close();
                //     return [JWTtoken, "step3handle"];
                } else {
                    console.log("enter createDB step4");
                    const keys = await db.keys().all();
                    console.log("db key value");
                    console.log(keys);
                    const values = await sub.values().all();
                    console.log("sub values value");
                    console.log(values);
                    await del_create(Address, db, sub);

                    await db.close();
                    await sub.close();

                    return [JWTtoken, "step1Ok"];
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
    const keys = await db.keys().all();
    console.log("db key value");
    console.log(keys);
    const values = await sub.values().all();
    console.log("sub values value");
    console.log(values);
    await sub.close();
    await db.close();
    return [JWTtoken, "step1Ok"];
    // console.log(db.status)


}

module.exports = {
    createDB: createDB
}