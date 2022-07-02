const { Level } = require('level');
const createJwt = require('./../JWTtoken/jwtCreate.js');
const address = require("./../fabricAPI/address.js");
const db = new Level('levelDB', { valueEncoding: 'json' });
const checkJwtToken = require("./../JWTtoken/checkJwtToken.js");
const del_create = async (Address) => {
    const JWTtoken = createJwt.jwtCreate(Address);
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
    console.log('enter createDB');
    console.log(db.status);
    const Address = await address.address(userId);

    const sub = db.sublevel("addressList");
    // subkey is address in address list
    for await (const subkey of sub.keys()) {
        console.log('already have address in address list');
        // 已在address list有紀錄了
        if (subkey === Address) {
            const result = await checkJwtToken.checkJwtToken(userId, JWTtoken);
            if (result === 'delete&create') {
                await del_create(Address);
                return [JWTtoken,"step1Ok"];
            } else if (result === 'doubleCheck') {
                const step = await db.get(sub.get(Address));
                if (step['process'] === "step1") {
                    await del_create(Address);
                    return [JWTtoken,"step1Ok"];
                // 若已經在第二步，卻跑回來點第一步，回傳step2handle
                } else if(step['process'] === "step2"){
                    return [JWTtoken,"step2handle"];
                }
            }
        }else{
            console.log('create a new one');
            await db.batch([
                { type: 'put', key: JWTtoken, value: JWTobject, valueEncoding: 'json' }
            ], { valueEncoding: 'utf8' })
        
            await sub.put(Address, JWTtoken);
            return [JWTtoken,"step1Ok"];
        }
    }
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