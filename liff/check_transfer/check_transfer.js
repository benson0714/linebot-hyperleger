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

window.onload = function () {
  const useNodeJS = true;   // if you are not using a node server, set this value to false
  const defaultLiffId = "";   // change the default LIFF value if you are not using a node server

  // DO NOT CHANGE THIS
  let myLiffId = "";

  // if node is used, fetch the environment variable and pass it to the LIFF method
  // otherwise, pass defaultLiffId
  if (useNodeJS) {
    fetch('/send-transfer')
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
            "address": getAllUrlParams().address,
            "jwtToken": getAllUrlParams().jwtToken,
            "amount": getAllUrlParams().amount,
            "tokenId": getAllUrlParams().tokenId
          }
          $.ajax({
            url: '/check_transfer',
            type: "POST",
            data: message,
            async: false,
            dataType: "json",
            success: function (data) {
              console.log(typeof(data.flexMessage));
              console.log(JSON.stringify(data.flexMessage));
              console.log(data.state);
              if (data.state === '200') {
                liff
                  .sendMessages(data.flexMessage)
                  .then(() => {
                    console.log("message sent");
                    liff.closeWindow();
                  })
                  .catch((err) => {
                    console.log("error", err);
                    liff.closeWindow();
                  });
              } else if (data.state === '404') {
                liff
                  .sendMessages(data.flexMessage)
                  .then(() => {
                    console.log("error message sent");
                    liff.closeWindow();
                  })
                  .catch((err) => {
                    console.log("error", err);
                    liff.closeWindow();
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
            }, error: function (data) {
              console.log('無法送出');
            }
          })
        })
    })
}


$(window).load(function () { // 確認整個頁面讀取完畢再將這三個div隱藏起來
  $("#status").delay(300).fadeOut(700); //delay --> 延遲幾秒才fadeOut
  $("#preloader").delay(300).fadeOut(700);
})