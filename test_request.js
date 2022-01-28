const response = require('koa/lib/response');
const rp = require('request-promise');
// let lineBotToken = '8Lmkn525OLwO8/pffsNxtN9s0mzOsFIJxoWdP/rsUo7HUW4Pnxqgkm53SBoqhZUGcOIc5Y2H7jFlEGS8bu/xKBP8kfScf9zqDjAHexEUSPD+wLMd/+YR5l/UEgPsCx6Majpg4ih13Q9Ch7RrUubj3wdB04t89/1O/w1cDnyilFU='
let lineBotToken = 'sjLgjafLSBVaw6piUzrf+7NT8iLHhU+O8qFxvmwN2FUs4h0+as3kcyTJMvwLQ4bfzMAkbNWt7iLDhIOfk2qhlq3iwDQlsdQH6WZa5k/WTIpVWzdIaO/wOpCCxe+6DYk4D5IB+srXWtd0IfhVJ6niWwdB04t89/1O/w1cDnyilFU='
var _include_headers = function(body, response, resolveWithFullResponse) {
    return {'headers': response.headers, 'data': body};
  };
let listRichMenu = (lineBotToken) => {
    let options = {
        uri: 'https://api.line.me/v2/bot/richmenu/list',
        transform: _include_headers,
        headers: {
            'Authorization': `Bearer ${lineBotToken}`,
        },
    };
    rp(options, (body)=>{
        console.log(body);
    })
    .then((response) =>　{
        console.log(response.data)
    });
}
listRichMenu(lineBotToken);