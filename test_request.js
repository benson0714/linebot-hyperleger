const rp = require('request-promise');

let lineBotToken = 'sjLgjafLSBVaw6piUzrf+7NT8iLHhU+O8qFxvmwN2FUs4h0+as3kcyTJMvwLQ4bfzMAkbNWt7iLDhIOfk2qhlq3iwDQlsdQH6WZa5k/WTIpVWzdIaO/wOpCCxe+6DYk4D5IB+srXWtd0IfhVJ6niWwdB04t89/1O/w1cDnyilFU='
let listRichMenu = (lineBotToken) => {
    let options = {
        uri: 'https://line-sdk-test.herokuapp.com/listRichMenu',
        headers: {
            'Authorization': `Bearer ${lineBotToken}`
        },
    };
    console.log(rp(options).data);
}
listRichMenu(lineBotToken);