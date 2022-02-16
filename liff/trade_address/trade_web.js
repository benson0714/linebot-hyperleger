window.onload = function() {
    const useNodeJS = true;   // if you are not using a node server, set this value to false
    const defaultLiffId = "";   // change the default LIFF value if you are not using a node server

    // DO NOT CHANGE THIS
    let myLiffId = "";

    // if node is used, fetch the environment variable and pass it to the LIFF method
    // otherwise, pass defaultLiffId
    if (useNodeJS) {
        fetch('/trade_address')
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
            registerButtonHandlers();
        })
        .catch((err) => {
            alert(err);
        });
}


/**
* Register event handlers for the buttons displayed in the app
*/
function registerButtonHandlers() {
    // // openWindow call
    // document.getElementById('openWindowButton').addEventListener('click', function() {
    //     liff.openWindow({
    //         url: 'https://line.me',
    //         external: true
    //     });
    // });

    // // closeWindow call
    // document.getElementById('closeWindowButton').addEventListener('click', function() {
    //     if (!liff.isInClient()) {
    //         sendAlertIfNotInClient();
    //     } else {
    //         liff.closeWindow();
    //     }
    // });

    // // sendMessages call
    // document.getElementById('sendMessageButton').addEventListener('click', function() {
    //     if (!liff.isInClient()) {
    //         sendAlertIfNotInClient();
    //     } else {
    //         liff.sendMessages([{
    //             'type': 'text',
    //             'text': "You've successfully sent a message! Hooray!"
    //         }]).then(function() {
    //             window.alert('Message sent');
    //         }).catch(function(error) {
    //             window.alert('Error sending message: ' + error);
    //         });
    //     }
    // });

}
