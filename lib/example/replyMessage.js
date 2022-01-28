const rp = require('request-promise');
module.exports = {
    replyMessage : (events, lineBotToken, resObject) => {
        // print replytoken & message
        let replyToken = events[0].replyToken
        console.log(`replyToken = ${replyToken}`);
        let message = events[0].message.text
        console.log(`messge : ${message}`);
        let replyMessage = [];

        // while received a specific message reply some special message
        if(resObject[message] === undefined) {
            replyMessage = [{
                type: 'text',
                text: message
            }]
        } else {
            replyMessage = [{
                type: 'text',
                text: message
            },
            {
                type: 'text',
                text: resObject[message]
            }]
        };
        //while message = listRichMenu, GET list menu on line developement
        if(message === 'listRichMenu') {
            let options = {
                method: 'GET',
                url: 'https://api.line.me/v2/bot/richmenu/list',
                headers: {
                    'Authorization':　`Bearer ${lineBotToken}`
                },
                json: true
            };

            rp(options)
            .then((body) => {
                console.log('list Rich Menu sucess');
            })
            .catch((err) => {
                console.log('list Rich Menu err');
            });
        } 
    
        let rp_body = {
            replyToken: replyToken,
            messages: replyMessage
            };
        let options = {
            method: 'POST',
            url: 'https://api.line.me/v2/bot/message/reply',
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
            console.log('err');
        });
    }
}
