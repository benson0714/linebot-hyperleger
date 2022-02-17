window.onload = function() {
    const useNodeJS = true;   // if you are not using a node server, set this value to false
    const defaultLiffId = "";   // change the default LIFF value if you are not using a node server

    // DO NOT CHANGE THIS
    let myLiffId = "";
    let address = "";
    // if node is used, fetch the environment variable and pass it to the LIFF method
    // otherwise, pass defaultLiffId
    if (useNodeJS) {

        fetch('/trade_qrcode')
            .then(function(reqResponse) {
                return reqResponse.json();
            })
            .then(function(jsonResponse) {
                
                myLiffId = jsonResponse.id;
                console.log(myLiffId);
                address = jsonResponse.address;
                console.log(address);
                initializeLiffOrDie(myLiffId);
            })
            .catch(function(error) {
                console.log(error);
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
        console.log('no myLiffId');
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
    console.log('112121212');

}
