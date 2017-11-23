window.addEventListener('load', function (event) {

    const requestAPIbtn = document.getElementById('requestAPI');
    const logActive = document.getElementById('apiKEY');
    updateSaved();
    updateActive();




    requestAPIbtn.addEventListener('click', function (event) {
        const requestedAPI = new XMLHttpRequest();
        var ourNiceKey = null;
        requestedAPI.onreadystatechange = function (event) {
            if (requestedAPI.readyState === 4) {
                ourNiceKey = JSON.parse(requestedAPI.responseText);
                logActive.innerHTML = ourNiceKey.key;
                saveKey(ourNiceKey.key);
                updateActive();
                // Reloads the window
                window.location.href = window.location.href
            }
        }
        requestedAPI.open('GET', `https://www.forverkliga.se/JavaScript/api/crud.php?requestKey`)
        requestedAPI.send();
    });

    // Add a book
    const addBookBtn = document.getElementById('addBookBtn');
    // Get the button that opens the modal
    const addBookModal = document.getElementById('addBookModal');
    // Get the <span> element that closes the modal
    const span = document.getElementsByClassName("close")[0];
    addBookBtn.addEventListener('click', function (event) {
        addBookModal.style.display = "block";
    })
    span.addEventListener('click', function (event) {
        addBookModal.style.display = "none";
    })
    window.onclick = function (event) {
        if (event.target == addBookModal) {
            addBookModal.style.display = "none";
        }
    }

    const sendBook = document.getElementById('sendBook');
    const title = document.getElementById('title');
    const author = document.getElementById('author');

    sendBook.addEventListener('click', function (event) {
        addBook(title.value, author.value);
        console.log("Added: " + title.value + " " + author.value);
        shake("shakeMe");
    })

    /* adding eventListener to saveActiveKey & retrieveOurKey */
    let saveCurrentBtn = document.getElementById('saveCurrent');
    saveCurrentBtn.addEventListener('click', function (e) {
        saveActiveKey(retrieveKey());
        updateSaved();
    });

    let goBackBtn = document.getElementById('returnKey');
    goBackBtn.addEventListener('click', function (e) {
        saveKey(retrieveOurKey());
        updateActive();
        // Reloads the window
        window.location.href = window.location.href
    });

    // Fetch Key

    const inputFetch = document.getElementById('apiInputKey');
    const fetchKey = document.getElementById('fetchKey');

    fetchKey.addEventListener('click', function (event) {
        saveKey(inputFetch.value)
        logActive.innerHTML = `Active Key: ${inputFetch.value}`;
    })


    /* Declare constant apiVariable */

});


//    if(responseText.status == 'error'){
//        console.log(responseText.message);
//     } else console.log(responseText.status);

/* Functions */

function shake(idToShake) {
    assShake = document.getElementById(idToShake);
    assShake.setAttribute('class', "vibe")
    setTimeout(function () {
        assShake.removeAttribute('class', "vibe");
    }, 1500)
}

function updateActive() {
    apiKEY.innerHTML = `Active Key: ${retrieveKey()}`;
}

function updateSaved() {
    currentSavedKey.innerHTML = `Saved Key: <strong>${retrieveOurKey()}</strong>`;
}

function saveObject(obj) {
    localStorage.setItem('apiObj', obj);
}

function retrieveObject() {
    return localStorage.getItem('apiObj');
}

function saveKey(keyToSave) {


    /* Save the key to local storage */
    localStorage.setItem('apiKey', keyToSave);
}

function saveActiveKey() {
    updateSaved();
    localStorage.setItem('ourApiKey', retrieveActiveKey());
}

function retrieveActiveKey() {
    return localStorage.getItem('apiKey');
}

function retrieveOurKey() {
    /* Sparad apiKey */
    return localStorage.getItem('ourApiKey');

}

function addBook(title, author) {
    const addBookRequest = new XMLHttpRequest();
    let responseText = null;

    addBookRequest.onreadystatechange = function (event) {
        if (addBookRequest.readyState === 4) {
            responseText = JSON.parse(addBookRequest.responseText);
            if (responseText.status == 'error') {
                console.log(responseText.message);
            } else {
                console.log(responseText.status);
            }
            console.log(responseText.id);
        }
    }

    addBookRequest.open('GET', `https://www.forverkliga.se/JavaScript/api/crud.php?op=insert&key=${retrieveKey()}&title=${title}&author=${author}`);
    addBookRequest.send();
}

function retrieveKey() {
    /* Retrieve apiKey */
    return localStorage.getItem('apiKey');
}
