window.onload = function () {
    // DO NOT CHANGE THIS
    let myLiffId = "";

    fetch('/send-id')
        .then(function (reqResponse) {
            return reqResponse.json();
        })
        .then(function (jsonResponse) {
            myLiffId = jsonResponse.id;
            initializeLiffOrDie(myLiffId);
        })
        .catch(function (error) {
            console.log(error);
            showErrorMsg("get Liff Id fail");
        });
};

function showErrorMsg(message) {
    document.getElementById("error").textcontent = message;
}

/**
 * Check if myLiffId is null. If null do not initiate liff.
 * @param {string} myLiffId The LIFF ID of the selected element
 */
function initializeLiffOrDie(myLiffId) {
    if (!myLiffId) {
        showErrorMsg("get Liff Id fail");
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
            initializeApp();
        })
        .catch((err) => {
            console.log(err);
            showErrorMsg("initializeLiff fail");
        });
}

/**
 * Initialize the app by calling functions handling individual app components
 */
function initializeApp() {
    if (liff.isLoggedIn() && liff.isInClient()) {
        const user = liff.getDecodedIDToken();
        if (user && user.email) {
            displayUserEmail(user.email)
        } else {
            showErrorMsg("user does not have email");
        }
    } else {
        showErrorMsg("please use line liff open");
    }
}

function displayUserEmail(email) {
    document.getElementById("userEmail").textcontent = email;
}