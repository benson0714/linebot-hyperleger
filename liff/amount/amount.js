let jwtToken = "";
let state = "";
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
    fetch('/send-amount')
      .then(function (reqResponse) {
        return reqResponse.json();
      })
      .then(function (jsonResponse) {
        myLiffId = jsonResponse.id;
        initializeLiffOrDie(myLiffId);
      })

  } else {
    myLiffId = defaultLiffId;
    initializeLiffOrDie(myLiffId);
  }
};

const errorStateHandle = (res, userId) => {
  // 如果已經在step2狀態卻跑回來執行step1
  console.log(`err res = ${res}`)

  console.log('enter step2handle');
  const message = {
    "userId": userId,
    "state": res,
    "currentState": "step1"
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
            "userId": res
          }
          $.ajax({
            url: '/createDB',
            type: "POST",
            data: message,
            async: false,
            dataType: "json",
            success: function (data) {
              jwtToken = data['jwtToken'];
              state = data['state'];
              console.log(state)

            }, error: function (data) {
              console.log('無法送出');
            }
          })
          return [state, res, jwtToken];
        })
        .then((res) => {
          console.log(`res = ${res[0]}`)
          if (res[0] === 'step2handle' || res[0] === 'stepXhandle') {
            jwtToken = res[2];
            errorStateHandle(res[0], res[1]);
          }
        })
    })

}


$(function () {
  $('#btn').on('click', function (e) {

    e.preventDefault();
    liff.getProfile()
      .then((res) => {
        const userId = res['userId'];
        return userId;
      })
      .then((res) => {
        var formData = $('form').serializeArray();
        formData.push({ 'name': "tokenId", 'value': getAllUrlParams().tokenId });
        formData.push({ 'name': 'userId', 'value': res });
        formData.push({ "name": "jwtToken", "value": jwtToken });
        formData.push({ "name": "state", "value": state });

        $.ajax({
          url: '/check_amount',
          type: "POST",
          data: formData,
          dataType: "json",
          success: function () {
            liff.closeWindow();
          }, error: function () {
            console.log('無法送出');
          }
        })
      })

  });
});

