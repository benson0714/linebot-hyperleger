const { unlink } = require('node:fs');
const fs = require('node:fs/promises');

const editCurrencyJson = (userId) => {
    try{
        await fs.appendFile(`${userId}.json`,'');
        console.log("open file complete");
    }catch(err){
        console.log(`open file error:${err}`);
    }
    try{
        await fs.writeFile(`${userId}.json`, data)
    }catch(err){
        console.log(`write file error:${err}`);
    }
// 取得幣種並更改json
    const jsonTemp = require(`./../json/${address}`);
    console.log(`address = ${address}`);
    return address;
}

module.exports = {
    editCurrencyJson: editCurrencyJson
}