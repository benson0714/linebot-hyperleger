const rp = require('request-promise');

const replyPostback = async (events) => {
    let userId = await events[0].source.userId;
    let action = await events[0].postback.data;
    console.log(action);
    if (action === 'action=replyFlexMessage') {
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
    } else if(action === 'action=template') {
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
    }
}

module.exports = {
    replyPostback: replyPostback,
}