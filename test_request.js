const rp = require('request-promise');

let lineBotToken = 'sjLgjafLSBVaw6piUzrf+7NT8iLHhU+O8qFxvmwN2FUs4h0+as3kcyTJMvwLQ4bfzMAkbNWt7iLDhIOfk2qhlq3iwDQlsdQH6WZa5k/WTIpVWzdIaO/wOpCCxe+6DYk4D5IB+srXWtd0IfhVJ6niWwdB04t89/1O/w1cDnyilFU='
let listRichMenu = (lineBotToken) => {
    let options = {
        uri: 'https://api.line.me/v2/bot/richmenu/list',
        headers: {
            'Authorization': `Bearer ${lineBotToken}`
        },
    };
    rp(options)
    .then((body) => {
        console.log(body);
    })
    .catch((err) => {
        console.log('err ')
    });
}
listRichMenu(lineBotToken);