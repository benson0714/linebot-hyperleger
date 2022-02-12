const rp = require('request-promise');

const replyPostback = async (events) => {
    let userId = events[0].source.userId;
    let action = events[0].postback.data;
    console.log(action);
    if (action === 'action=replyFlexMessage') {
        console.log('sucess enter replyFlexMessage')
        let options = {
            method: 'POST',
            uri: 'https://line-sdk-test.herokuapp.com/flexMessage',
            body: {
                "userId": userId,
            },
            json: true
        };
        rp(options)
            .then((body) => {
                return body;
            })
            .catch((err) => {
                return err;
            })
    }
}

module.exports = {
    replyPostback: replyPostback,
}