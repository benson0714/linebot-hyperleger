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
const tokenId = getAllUrlParams().tokenId;
window.onload = function () {
  const useNodeJS = true;   // if you are not using a node server, set this value to false
  const defaultLiffId = "";   // change the default LIFF value if you are not using a node server

  // DO NOT CHANGE THIS
  let myLiffId = "";

  // if node is used, fetch the environment variable and pass it to the LIFF method
  // otherwise, pass defaultLiffId
  if (useNodeJS) {
    fetch('/send-record_details')
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
        .then((userId) => {
          const message = {
            "userId": userId,
            "tokenId": tokenId
          }
          $.ajax({
            url: '/liff_record_details',
            type: "POST",
            data: message,
            dataType: "json",
            async: false,
            success: function (data) {
              let html_string = "";
              const record_array = data["record_array"];
              for (const i in record_array) {
                html_string = html_string + `<tr><td data-th="轉出/入">${record_array[i]["transfer_option"]}</td><td data-th="對象">${record_array[i]["transfer_address"]}</td><td data-th="數量">${record_array[i]["amount"]}</td><td data-th="時間">${record_array[i]["human_date"]}</td></tr>`
              }
              $("#record_details_table").append(html_string);
              console.log(html_string);
            }, error: function (err) {
              console.log(err)
            }
          })
        })
        .then(() => {
          /*----產生data-th-----*/
          let $table = $(".table_change");
          let $thRows = $table.find("thead th");
          $thRows.each(function (key, thRow) {
            $table
              .find("tbody tr td:nth-child(" + (key + 1) + ")")
              .attr("data-th", $(thRow).text());
          });
          /*-----------*/
          goPage(1, 8); // 一開始先秀第一頁,以及每一頁最多兩筆資料
        })
    })
}
$("#tokenName").append(`<h3>資產名稱:${getAllUrlParams().tokenName.replace("-", " ")}</h3>`);

$(window).load(function () { // 確認整個頁面讀取完畢再將這三個div隱藏起來
  $("#status").delay(500).fadeOut(300); //delay --> 延遲幾秒才fadeOut
  $("#preloader").delay(700).fadeOut(300);
})

function goPage(currentPage, pageSize) {

  var tr = $(".table_change tbody tr");
  var num = $(".table_change tbody tr").length; //表格所有行數(所有記錄數)
  var totalPage = Math.ceil(num / pageSize); // 表格所有行數/每頁顯示行數 = 總頁數

  $('#numberPage').attr('max', totalPage); // 寫入跳至第幾頁input

  $("#numberPage").off('change').on("change", function () {// 跳至第幾頁
    let numberPage = $("#numberPage").val();
    if (numberPage > totalPage) {
      console.log("頁數超過")
      return
    }
    goPage(numberPage, 8);
  });

  var startRow = (currentPage - 1) * pageSize + 1; //開始顯示的行
  var endRow = currentPage * pageSize; //結束顯示的行
  endRow = (endRow > num) ? num : endRow;


  //遍歷顯示資料實現分頁
  for (var i = 1; i < (num + 1); i++) {
    var trRow = tr[i - 1];
    if (i >= startRow && i <= endRow) {
      trRow.style.display = "";
    } else {
      trRow.style.display = "none";
    }
  }

  var tempStr = "";
  if (currentPage > 1) {
    tempStr += `<a href="javascript:;" onClick="goPage(1,${pageSize})">首頁</a>`;
    tempStr += `<a href="javascript:;" onClick="goPage(${currentPage - 1},${pageSize})">上一頁</a>`;

  } else {
    tempStr += `<a href="javascript:;" class="disabled">首頁</a>`;
    tempStr += `<a href="javascript:;" class="disabled">上一頁</a>`;
  }

  tempStr += `<div><span>第${currentPage}頁</span>/<span>共${totalPage}頁</span></div>`;

  if (currentPage < totalPage) {
    tempStr += `<a href="javascript:;" onClick="goPage(${currentPage + 1},${pageSize})">下一頁</a>`;
    tempStr += `<a href="javascript:;" onClick="goPage(${totalPage},${pageSize})">尾頁</a>`;
  } else {
    tempStr += `<a href="javascript:;" class="disabled">下一頁</a>`;
    tempStr += `<a href="javascript:;" class="disabled">尾頁</a>`;
  }

  $("#pageModule").html(tempStr);
}

