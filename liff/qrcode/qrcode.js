window.onload = function() {
    const useNodeJS = true;   // if you are not using a node server, set this value to false
    const defaultLiffId = "";   // change the default LIFF value if you are not using a node server

    // DO NOT CHANGE THIS
    let myLiffId = "";

    // if node is used, fetch the environment variable and pass it to the LIFF method
    // otherwise, pass defaultLiffId
    if (useNodeJS) {
        fetch('/send-qrcode')
            .then(function(reqResponse) {
                return reqResponse.json();
            })
            .then(function(jsonResponse) {
                myLiffId = jsonResponse.id;
                initializeLiffOrDie(myLiffId);
            })
            .catch(function(error) {

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
}


/**
* Register event handlers for the buttons displayed in the app
*/
function qrcode() {
    // qrcode 
    liff.scanCodeV2()
    .then(function(res) {
        alert(res.value);
    })
    .catch(function(error) {
        alert(error);
    });
};



$(async function() {
    $('#btn').on('click', function(e) {
      var qrcode_address = qrcode();
      console.log(qrcode_address);
        
      $.ajax({
        url:'/check_address',
        type : "POST",
        data : qrcode_address,
        dataType: "json",
        success : function(data) 
        {
            liff.closeWindow();
        },error: function(data) 
        {
            console.log('無法送出');
        }
    })
    });
});

