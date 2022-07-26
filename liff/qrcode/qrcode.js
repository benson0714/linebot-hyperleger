// 不能用大寫的網址!!!
function getAllUrlParams(url) {

  // get query string from url (optional) or window
  var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

  // we'll store the parameters here
  var obj = {};

  // if query string exists
  if (queryString) {

    // stuff after # is not part of query string, so get rid of it
    queryString = queryString.split('#')[0];

    // split our query string into its component parts
    var arr = queryString.split('&');

    for (var i = 0; i < arr.length; i++) {
      // separate the keys and the values
      var a = arr[i].split('=');

      // set parameter name and value (use 'true' if empty)
      var paramName = a[0];
      var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

      // // (optional) keep case consistent
      // paramName = paramName.toLowerCase();
      // if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();

      // if the paramName ends with square brackets, e.g. colors[] or colors[2]
      if (paramName.match(/\[(\d+)?\]$/)) {

        // create key if it doesn't exist
        var key = paramName.replace(/\[(\d+)?\]/, '');
        if (!obj[key]) obj[key] = [];

        // if it's an indexed array e.g. colors[2]
        if (paramName.match(/\[\d+\]$/)) {
          // get the index value and add the entry at the appropriate position
          var index = /\[(\d+)\]/.exec(paramName)[1];
          obj[key][index] = paramValue;
        } else {
          // otherwise add the value to the end of the array
          obj[key].push(paramValue);
        }
      } else {
        // we're dealing with a string
        if (!obj[paramName]) {
          // if it doesn't exist, create property
          obj[paramName] = paramValue;
        } else if (obj[paramName] && typeof obj[paramName] === 'string') {
          // if property does exist and it's a string, convert it to an array
          obj[paramName] = [obj[paramName]];
          obj[paramName].push(paramValue);
        } else {
          // otherwise add the property
          obj[paramName].push(paramValue);
        }
      }
    }
  }

  return obj;
}
const amount = getAllUrlParams().amount
const tokenId = getAllUrlParams().tokenId;
const old_time = getAllUrlParams().time;
window.onload = function () {
  const useNodeJS = true;   // if you are not using a node server, set this value to false
  const defaultLiffId = "";   // change the default LIFF value if you are not using a node server

  // DO NOT CHANGE THIS
  let myLiffId = "";

  // if node is used, fetch the environment variable and pass it to the LIFF method
  // otherwise, pass defaultLiffId
  if (useNodeJS) {
    fetch('/send-qrcode')
      .then(function (reqResponse) {
        return reqResponse.json();
      })
      .then(function (jsonResponse) {
        myLiffId = jsonResponse.id;
        initializeLiffOrDie(myLiffId);
      })
      .catch(function (error) {

      })
  } else {
    myLiffId = defaultLiffId;
    initializeLiffOrDie(myLiffId);
  }
};

/**
* Check if myLiffId is null. If null do not initiate liff.
* @param {string} myLiffId The LIFF ID of the selected element
*/
function initializeLiffOrDie(myLiffId) {
  if (!myLiffId) {
    alert('initializeLiff first');
  } else {
    initializeLiff(myLiffId);
  }
}
const errorStateHandle = (res, userId) => {
  // 如果已經在step2狀態卻跑回來執行step1
  console.log(`err res = ${res}`)

  console.log('enter step1handle');
  const message = {
    "userId": userId,
    "state": res,
    "currentState": "step2"
  }
  $.ajax({
    url: '/errorStateHandle',
    type: "POST",
    data: message,
    dataType: "json",
    success: function (data) {
      liff.closeWindow();
    }, error: function (err) {
      liff.closeWindow();
      console.log(`無法送出 ${err}`);
    }
  })

}
/**
* Initialize LIFF
* @param {string} myLiffId The LIFF ID of the selected element
*/
function initializeLiff(myLiffId) {
  liff
    .init({
      liffId: myLiffId
    })
    .then(() => {
      liff.getProfile()
        .then((res) => {
          const userId = res['userId'];
          return userId;
        })
        .then((res) => {
          const message = {
            "userId": res,
            "jwtToken": getAllUrlParams().jwtToken
          }
          $.ajax({
            url: '/step2checkDB',
            type: "POST",
            data: message,
            async: false,
            dataType: "json",
            success: function (data) {
              state = data['state'];
              console.log(state)

            }, error: function (data) {
              console.log('無法送出');
            }
          })
          return [state, res];
        })
        .then((res) => {
          console.log(`res = ${res[0]}`)
          if (res[0] === 'step1handle' || res[0] === "expireMessage" || res[0] === 'stepXhandle') {
            errorStateHandle(res[0], res[1]);
          }
        })
    })
}


/**
* Register event handlers for the buttons displayed in the app
*/
function qrcode() {
  // qrcode 
  liff.scanCodeV2()
    .then(function (res) {
      // address
      return res.value;
    })
    .then(function (res) {
      liff.getProfile()
        .then((profileRes) => {
          const userId = profileRes['userId'];
          return userId;
        })
        .then((userId) => {
          return getData(res, userId);
        })

    })
    .catch(function (error) {
      console.log(error)
    });
};

function getData(qrcode_address, userId) {
  console.log(qrcode_address);
  console.log(getAllUrlParams().jwtToken);
  const message = {
    "qrcode_address": qrcode_address,
    "amount": amount,
    "time": old_time,
    "userId": userId,
    "tokenId": tokenId,
    "jwtToken": getAllUrlParams().jwtToken
  }
  $.ajax({
    url: '/check_address',
    type: "POST",
    async: false,
    data: message,
    dataType: "json",
    success: function (data) {
      console.log(data.flexMessage);
      console.log(data.state);
      if (data.state === '200') {
        const temp = {
          "type": "flex",
          "altText": "This is a Flex Message",
          "contents":
          {
            "type": "bubble",
            "header":
            {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "text",
                  "text": "請確認交易資訊",
                  "size": "xl",
                  "weight": "bold",
                  "wrap": true
                }
              ]
            },
            "body": {
              "type": "box",
              "layout": "vertical",
              "contents":
                [
                  {
                    "type":
                      "text",
                    "text": "資產名稱:Time Coin",
                    "wrap": true
                  },
                  {
                    "type": "text",
                    "text": "交易數量:1"
                  },
                  {
                    "type": "text",
                    "text": "交易對象\n0x1af57c8dda4503843d043b96a12d7e6fa619c219",
                    "wrap": true
                  }
                ]
            },
            "footer":
            {
              "type": "box",
              "layout": "vertical",
              "contents":
                [
                  {
                    "type": "button",
                    "action":
                    {
                      "type": "postback",
                      "label": "移轉",
                      "data": "action=tf&re=0x1af57c8dda4503843d043b96a12d7e6fa619c219&tId=6&amount=1&jwtToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZGRyZXNzIjoiMHhlNzBiNWJhYTc2N2FlYmUwOTMwMzdiNzVkYjgxZTIwZmVlZmNhNzgyIiwiaWF0IjoxNjU4ODM5MTg4LCJleHAiOjE2NTg4Mzk0ODh9.9t5YpRak8GhYUSRZ8xDDwEsZ6fWtA9ZHb1rL_Pt2S78"
                    },
                    "style": "primary",
                    "color": "#0000ff"
                  }
                ]
            }
          }
        }
        liff
          .sendMessages(temp)
          .then(() => {
            console.log("message sent");
            // liff.closeWindow();
          })
          .catch((err) => {
            console.log("error", err);
            // liff.closeWindow();
          });
      } else if (data.state === '404') {
        liff
          .sendMessages(data.flexMessage)
          .then(() => {
            console.log("error message sent");
            // liff.closeWindow();
          })
          .catch((err) => {
            console.log("error", err);
            // liff.closeWindow();
          });
      } else {
        liff
          .sendMessages([
            {
              type: "text",
              text: "未知錯誤，請重新開始",
            },
          ])
          .then(() => {
            console.log("message sent");
            // liff.closeWindow();
          })
          .catch((err) => {
            console.log("error", err);
          });
      }
    }
  })
  return;
}

$(function () {
  $('#btn').on('click', function (e) {
    $("#status").delay().fadeIn(); //delay --> 延遲幾秒才fadeOut
    $("#preloader").delay().fadeIn();
    qrcode();
  })
});

$(window).load(function () { // 確認整個頁面讀取完畢再將這三個div隱藏起來
  $("#status").delay(500).fadeOut(300); //delay --> 延遲幾秒才fadeOut
  $("#preloader").delay(700).fadeOut(300);
})