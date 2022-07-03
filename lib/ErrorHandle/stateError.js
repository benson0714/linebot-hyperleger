const pushMessage = require('./../lineAPI/pushMessageAPI.js');

/**
 * 沒有執行正確state時要傳送訊息給使用者
 * @param {*} userId 
 * @param {*} lineBotToken 
 * @param {*} state 使用者目前的state
 * @param {*} currentState 使用者錯誤使用的state
 */

const stateError = async (userId, lineBotToken, state, currentState) => {
    if(state === 'step2handle'){
        const message = [{
            "type":"text",
            "text":"錯誤操作，請點選Tap me開啟相機繼續您的交易並在5分鐘內完成整筆交易"
        }]
        pushMessage.pushMessage(message, userId, lineBotToken);
    }

}
 
module.exports = {
    stateError: stateError
}