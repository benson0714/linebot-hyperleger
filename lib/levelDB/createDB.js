const { Level } = require('level');

// Create a database
const db = new Level('levelDB', { valueEncoding: 'json' });

console.log(db.status)
const sub = db.sublevel("levelDB");
const benson = {
  "name":"benson"
};
const tom = {
  "name":"tom"
};
const db_put = async()=>{
  await db.batch([
    { type: 'put', key: 'a', value: tom, valueEncoding: 'json' },
    { type: 'put', key: 'b', value: benson, valueEncoding: 'json' }
  ], { valueEncoding: 'utf8' })

  await sub.put("xxxiii", "jwttoken");
}

const value_iteration = async()=>{
  // Get all at once. Setting a limit is recommended.
  const values = await db.values({ gte: 'a', limit: 10 }).all()
  console.log(values);
  // Iterate lazily
  for await (const value of db.values({ gte: 'a' })) {
  console.log(value['name'])
}
for await (const value of sub.values()) {
  console.log(value)
}

}

const run = async()=>{
  await db_put();
  await value_iteration()
}

module.exports = {
    run:run
}