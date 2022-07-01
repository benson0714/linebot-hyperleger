const { Level } = require('level');
const createJwt = require('./../JWTtoken/jwtCreate.js');
const address = require("./../fabricAPI/address.js");



const createDB = async (userId) => {
    // Create a database
    const db = new Level('levelDB', { valueEncoding: 'json' });
    const Address = await address.address(userId);
    const JWTtoken = createJwt.jwtCreate(Address);
    console.log(`jwtToken = ${JWTtoken}`)

    const sub = db.sublevel("levelDB");

    const JWTobject = {
        "state": "0",
        "process": "step1",
        "address": Address
    };
    console.log(db.status)
    await db.batch([
        { type: 'put', key: JWTtoken, value: JWTobject, valueEncoding: 'json' }
    ], { valueEncoding: 'utf8' })

    await sub.put(Address, JWTtoken);
    // Get all at once. Setting a limit is recommended.
    const values = await db.values({ gte: 'a', limit: 10 }).all()
    console.log(values);
    // Iterate lazily
    // for await (const value of db.values()) {
    //     console.log(value)
    // }
    // for await (const value of sub.values()) {
    //     console.log(value)
    // }
    console.log(`jwtToken = ${JWTtoken}`)
    return JWTtoken;
}

module.exports = {
    createDB: createDB
}