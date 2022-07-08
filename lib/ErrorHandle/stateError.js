const pushMessage = require('./../lineAPI/pushMessageAPI.js');

/**
 * 沒有執行正確state時要傳送訊息給使用者
 * @param {*} userId 
 * @param {*} lineBotToken 
 * @param {*} state 使用者目前的state
 * @param {*} currentState 使用者錯誤使用的state
 */

const stateError = async (userId, lineBotToken, state, currentState) => {
    if (state === 'step2handle') {
        const message = [{
            "type": "text",
            "text": "錯誤操作，請點選Tap me開啟相機繼續您的交易並在5分鐘內完成整筆交易"
        }]
        pushMessage.pushMessage(message, userId, lineBotToken);
    } else if (state === 'step1handle') {

        const message = [{
            "type": "text",
            "text": "錯誤操作，請點選transfert重新開始交易"
        }]
        pushMessage.pushMessage(message, userId, lineBotToken);

    } else if (state === "expireMessage") {
        const message = [{
            "type": "text",
            "text": "此筆交易已超過5分鐘，請重新開始交易"
        }]
        pushMessage.pushMessage(message, userId, lineBotToken);

    } else if (state === "stepXhandle") {
        const message = [{
            "type": "text",
            "text": "未知錯誤，請重新開始交易"
        }]
        pushMessage.pushMessage(message, userId, lineBotToken);
    } else if(state === "noAddress") {
        const message = [{
            "type": "text",
            "text": "未輸入地址"
        }]
        pushMessage.pushMessage(message, userId, lineBotToken);
    } else if(state === "step3handle") {
        const message = [{
            "type": "text",
            "text": "請點選移轉繼續交易"
        }]
        pushMessage.pushMessage(message, userId, lineBotToken);
    } else if(state === "step4handle") {
        const message = [{
            "type": "text",
            "text": "已完成交易，請重新開始交易"
        }]
        pushMessage.pushMessage(message, userId, lineBotToken);
    } 
}

module.exports = {
    stateError: stateError
}