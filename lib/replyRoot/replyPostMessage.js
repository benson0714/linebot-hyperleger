const rp = require('request-promise');

const replyPostback = async (events) => {
    let userId = await events[0].source.userId;
    let string = await events[0].postback.data;
    string = string.split('&');
    let action = string[0].split('=');

    console.log(action[1]);
    if (action === 'replyFlexMessage') {
        console.log('sucess enter replyFlexMessage');
        let options = await {
            method: 'POST',
            uri: 'https://line-sdk-test.herokuapp.com/flexMessage',
            body: {
                "userId": userId,
            },
            json: true
        };
        await rp(options);
    } else if(action[1] === 'template') {
        console.log('sucess enter template');
        let options = await {
            method: 'POST',
            uri: 'https://line-sdk-test.herokuapp.com/template',
            body: {
                "userId": userId,
            },
            json: true
        };
        await rp(options);
    } else if (action[1] === 'action=confirm&answer=yes')
}

module.exports = {
    replyPostback: replyPostback,
}