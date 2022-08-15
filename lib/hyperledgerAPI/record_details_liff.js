const record = require('./../fabricAPI/record.js');

/**
 * return record and push to liff
 * @param {*} userId enter userId
 * @param {*} tokenId enter tokenId
 */
const record_details_liff = async (userId, tokenId) => {
    const value = await record.record(userId, tokenId);
    const recordJson = value[0];
    const address = value[1];
    let record_array = [];
    for (const i in recordJson) {
        let transfer_option = "";
        let transfer_address = "";
        if (recordJson[i]['from'] === address) {
            // from 自己就是轉出
            transfer_option = "轉出";
            transfer_address = recordJson[i]['to'];
        } else {
            // from 不是自己就是轉入
            transfer_option = "轉入";
            transfer_address = recordJson[i]['from'];
        }
        const timestamp = recordJson[i]['timestamp']['seconds']['low'];
        const date = new Date(timestamp * 1000);
        const human_date = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + ("0" + date.getDate()).slice(-2) + " " + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + ":" + ("0" + date.getSeconds()).slice(-2);
        record_array.push({
            transfer_option: transfer_option,
            transfer_address: transfer_address,
            amount: recordJson[i]['amount'],
            human_date:human_date
        })
    }
    return record_array;
}

module.exports = {
    record_details_liff: record_details_liff
}