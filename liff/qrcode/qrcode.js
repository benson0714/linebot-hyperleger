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
        .then(() => {
            // start to use LIFF's api
            qrcode();
        })
        .catch((err) => {
            alert(err);
        });
}


/**
* Register event handlers for the buttons displayed in the app
*/
function qrcode() {
    // qrcode 
    liff.scanCodeV2()
    .then(function(res) {
        $('#qrcode_address').val(res.value);
    })
    .catch(function(error) {
        alert(error);
    });
};

$.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

$(function() {
    $('form.login').on('submit', function(e) {
      e.preventDefault();

      var formData = $(this).serializeObject();
      console.log(formData);
      $('.datahere').html(JSON.stringify(formData));

      $.ajax({
        url:'/upload',
        type : "POST",
        data : formData,
        contentType: false,
        cache: false,
        processData: false,
        success : function(data) 
        {
            console.log(data);
        },error: function(data) 
        {
            console.log('無法送出');
        }
      })
    })

});

