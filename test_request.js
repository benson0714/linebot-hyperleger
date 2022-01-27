const rp = require('request-promise');

let lineBotToken = 'sjLgjafLSBVaw6piUzrf+7NT8iLHhU+O8qFxvmwN2FUs4h0+as3kcyTJMvwLQ4bfzMAkbNWt7iLDhIOfk2qhlq3iwDQlsdQH6WZa5k/WTIpVWzdIaO/wOpCCxe+6DYk4D5IB+srXWtd0IfhVJ6niWwdB04t89/1O/w1cDnyilFU='
let rp_body = ({
    messages: [{
            type: 'text',
            text: 'Hello'
        },
        {
            type: 'text',
            text: 'How are you?'
        }]
    });
var options = {
    method: 'POST',
    url: 'https://api.line.me/v2/bot/message/broadcast',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${lineBotToken}`
    },
    json: true,
    body: rp_body
};
rp(options)
    .then((body) => {
        console.log('sucess');
    })
    .catch((err) => {
        console.log(err);
    })