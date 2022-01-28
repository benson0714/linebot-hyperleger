const response = require('koa/lib/response');
const rp = require('request-promise');

let lineBotToken = 'sjLgjafLSBVaw6piUzrf+7NT8iLHhU+O8qFxvmwN2FUs4h0+as3kcyTJMvwLQ4bfzMAkbNWt7iLDhIOfk2qhlq3iwDQlsdQH6WZa5k/WTIpVWzdIaO/wOpCCxe+6DYk4D5IB+srXWtd0IfhVJ6niWwdB04t89/1O/w1cDnyilFU='
var _include_headers = function(body, response, resolveWithFullResponse) {
    return {'headers': response.headers, 'data': body};
  };
let listRichMenu = (lineBotToken) => {
    let options = {
        uri: 'https://line-sdk-test.herokuapp.com/listRichMenu',
        transform: _include_headers,
        headers: {
            'Authorization': `Bearer ${lineBotToken}`,
        },

    };
    rp(options)
    .then((response) =>　{
        console.log(response.data)
    });
}
listRichMenu(lineBotToken);