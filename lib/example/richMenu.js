// https://developers.line.biz/en/docs/messaging-api/using-rich-menus/
const crypto = require('crypto');
const rp = require('request-promise');
const fs = require('fs');
const createRichMenu = (lineBotToken) => {
    let options = {
        method: 'POST',
        uri: 'https://api.line.me/v2/bot/richmenu',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${lineBotToken}`
        },
        body: {
            "size": {
              "width": 2500,
              "height": 1670
            },
            "selected": false,
            "name": "richmenu1",
            "chatBarText": "第一頁",
            "areas": [
              {
                "bounds": {
                  "x": 1668,
                  "y": 0,
                  "width": 833,
                  "height": 843
                },
                "action": {
                  "type": "uri",
                  "uri": "https://www.youtube.com/watch?v=C9pnjaQO9Yo"
                  }
              }
            ]
          },
        json: true
    };
    return rp(options);
}

// Image format: JPEG or PNG
// Image size (pixels): 2500x1686, 2500x843, 1200x810, 1200x405, 800x540, 800x270
// Maximum file size: 1 MB
const uploadRichMenuImage = (richMenuId, picturePath, lineBotToken) => {
    let readStream = fs.createReadStream(picturePath);
    let stats = fs.statSync(picturePath);
    console.log(picturePath);
    console.log(stats);
    let options = {
        method: 'POST',
        uri: `https://api-data.line.me/v2/bot/richmenu/${richMenuId}/content`,
        headers: {
            'Authorization': `Bearer ${lineBotToken}`,
            'Content-Type': 'image/jpeg',
        },
        body: readStream,
        encoding: null
    };
    console.log(options);
    return rp(options);
}

const setDefaultRichMenu = (richMenuId, lineBotToken) => {
    let options = {
        method: 'POST',
        uri: `https://api.line.me/v2/bot/user/all/richmenu/${richMenuId}`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${lineBotToken}`
        },
        body: {},
        json: true
    };
    return rp(options);
}

const listRichMenu = (lineBotToken) => {
    let options = {
        method: 'GET',
        uri: `https://api.line.me/v2/bot/richmenu/list`,
        headers: {
            'Authorization': `Bearer ${lineBotToken}`
        },
        json: true
    };
    return  rp(options)
    .then((body) => {
        console.log('GET line server list Rich Menu sucess');
    })
    .catch((err) => {
        console.log('GET line server list Rich Menu err');
    });
}
module.exports = {
    createRichMenu: createRichMenu,
    uploadRichMenuImage: uploadRichMenuImage,
    setDefaultRichMenu: setDefaultRichMenu,
    listRichMenu: listRichMenu,
}