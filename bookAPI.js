window.addEventListener('load', function (event) {

    const requestAPIbtn = document.getElementById('requestAPI');

    requestAPIbtn.addEventListener('click', function (event) {
        const requestedAPI = new XMLHttpRequest();
        const log = document.getElementById('apiKEY');
        let ourNiceKey = null;

        requestedAPI.onreadystatechange = function (event) {
            if (requestedAPI.readyState === 4) {
                ourNiceKey = JSON.parse(requestedAPI.responseText);
                log.innerHTML = ourNiceKey.key;
            }
        }
        requestedAPI.open('GET', `https://www.forverkliga.se/JavaScript/api/crud.php?requestKey`)
        requestedAPI.send();
    });

    /* Add eventListener for saveKey button */
    document.getElementById('useApiKey').addEventListener('click', saveKey);

    // Add a book
    const addBookBtn = document.getElementById('addBookBtn');
    // Get the button that opens the modal
    const addBookModal = document.getElementById('addBookModal');
    // Get the <span> element that closes the modal
    const span = document.getElementsByClassName("close")[0];
    addBookBtn.addEventListener('click', function (event) {
        addBookModal.style.display = "block";
        console.log("CLICKED");
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
        console.log("SENT")
        console.log(title.value, author.value);
    })

    /* adding eventListener to saveOurKey & retrieveOurKey */
    let saveCurrentBtn = document.getElementById('saveCurrent');
    saveCurrentBtn.addEventListener('click', function(e){
      saveOurKey(retrieveKey());
    });

    let goBackBtn = document.getElementById('returnKey');
    goBackBtn.addEventListener('click', function(e){
      saveKey(retrieveOurKey());
    });
});


//    if(responseText.status == 'error'){
//        console.log(responseText.message);
//     } else console.log(responseText.status);


/* Functions */

function saveKey() {
    /* Declare constant apiVariable */
    const apiKeyValue = document.getElementById('apiKEY').innerText;

    /* Save the key to local storage */
    localStorage.setItem('apiKey', apiKeyValue);
}

function saveOurKey(apiKeyValue){
  /* Vår apiKey */
  localStorage.setItem('ourApiKey', apiKeyValue);
}
function retrieveOurKey(){
  /* Vår apiKey */
  return localStorage.getItem('ourApiKey');
}

function addBook(title, author) {

    const addBookRequest = new XMLHttpRequest();
    let responseText = null;
    addBookRequest.onreadystatechange = function (event) {
        if (addBookRequest.readyState === 4) {
            responseText = JSON.parse(addBookRequest.responseText);
        }
    }

    addBookRequest.open('GET', `https://www.forverkliga.se/JavaScript/api/crud.php?op=insert&key=${retrieveKey()}&title=${title}&author=${author}`);
    addBookRequest.send();
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
