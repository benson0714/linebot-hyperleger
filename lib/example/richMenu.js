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
            "chatBarText": "選單",
            "areas": [
              {
                "bounds": {
                  "x": 1668,
                  "y": 0,
                  "width": 833,
                  "height": 843
                },
                "action": 
                {
                  "type": "postback",
                  "data":"action=buy&itemid=111",
                  "text":"帳戶資訊"
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

// request list object
const listRichMenu = (lineBotToken) => {
    return new Promise((resolve, reject) => {
            let options = {
                method: 'GET',
                uri: 'https://api.line.me/v2/bot/richmenu/list',
                headers: {
                    'Authorization': `Bearer ${lineBotToken}`
                },
                body: {},
                json: true
            };
            resolve(rp(options));
    })  
}
    async function getListId(lineBotToken) {
        let result = await listRichMenu(lineBotToken);
        result = await result.richmenus;
        console.log(result.length)
        console.log(`result :========${result}`);
        result_ary = []
        for(let i = 0; i < result.length; i++) {
            result_ary.push(result[i].richMenuId);
        }
        console.log(result_ary);
        return result_ary;
    } 

    // delete all list for add a new richMenu later
    async function deleteList(lineBotToken) {
        let result = await listRichMenu(lineBotToken);
        result = result.richmenus;
        console.log(`list number : ${result}`)
        if(result.length !== 0) {
            for(let i = 0; i < result.length; i++) {
                let richMenuId = result[i].richMenuId;
                options = {
                    method: 'DELETE',
                    uri: `https://api.line.me/v2/bot/richmenu/${richMenuId}`,
                    headers: {
                        'Authorization': `Bearer ${lineBotToken}`
                    }
                };
                rp(options)
            }
        }
    }

module.exports = {
    createRichMenu: createRichMenu,
    uploadRichMenuImage: uploadRichMenuImage,
    setDefaultRichMenu: setDefaultRichMenu,
    listRichMenu: getListId,
    deleteList: deleteList,  
}