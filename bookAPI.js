 window.addEventListener('load', function (event) {

    const requestAPIbtn = document.getElementById('requestAPI');
    const logActive = document.getElementById('apiKEY');
    updateSaved();
    updateActive();


    if(localStorage.getItem('loggedIn') == 'true'){
      let userObj = JSON.parse(localStorage.getItem('loggedInUser'));

      printMsg('Welcome,'+userObj.name, 'success');
    } else {
      printMsg('This is our welcome message!!', 'success');
    }



    requestAPIbtn.addEventListener('click', requestKeyFromApi);


    // Add a book
    const addBookBtn = document.getElementById('addBookBtn');
    // Get the button that opens the modal
    const addBookModal = document.getElementById('addBookModal');
    // Get the <span> element that closes the modal
    const closeBtns = document.getElementsByClassName("close");
    // StatsModal
    const statsModal = document.getElementsByClassName('statsModal')[0];

    addBookBtn.addEventListener('click', function (event) {
        addBookModal.style.display = "block";
    })

    /* Add eventListeners for closeBtns */
    for (let closeBtn of closeBtns) {
        closeBtn.addEventListener('click', function (event) {
            event.target.parentNode.parentNode.parentNode.style.display = 'none';

            if (event.target.parentNode.parentNode.parentNode.className == 'userModal') {
                createUserBtn.className = '';
                retrieveUserBtn.className = '';
                removeUserById.className = '';
            }
        });
    }

    window.onclick = function (event) {
        if (event.target == addBookModal) {
            addBookModal.style.display = "none";
        }
    }

    const sendBook = document.getElementById('sendBook');
    const title = document.getElementById('title');
    const author = document.getElementById('author');

    sendBook.addEventListener('click', function (event) {
        addBook(0, title.value, author.value);
        console.log("Added: " + title.value + " " + author.value);
        shake("shakeMe");
        let uniqueID = guid();
        addToTop(title.value, author.value, uniqueID);
    });

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

    /* Add eventListeners to statsBtn and settingsBtn */
    let statsBtn = document.getElementById('statsBtn');
    statsBtn.addEventListener('click', function (event) {

        /* STATS FUNCTION CALL*/
        displayStats();

    });

    let settingsBtn = document.getElementById('settingsBtn');
    settingsBtn.addEventListener('click', displaySettings);


    // Fetch Key

    const inputFetch = document.getElementById('apiInputKey');
    const fetchKey = document.getElementById('fetchKey');

    fetchKey.addEventListener('click', function (event) {
        saveKey(inputFetch.value);
    });

    localStorage.setItem('settingsOpen', 'false'); // It can't be open when we load the site.
    retrieveBooks();
    //addSettingsListeners(); // This is used when testing settings page.
    //End of callback. Put all DOM-related shit above this!
});

function requestKeyFromApi(){
    const requestedAPI = new XMLHttpRequest();
    var responseData = null;
    requestedAPI.onreadystatechange = function (event) {
        if (requestedAPI.readyState === 4) {
            responseData = JSON.parse(requestedAPI.responseText);
            //logActive.innerHTML = ourNiceKey.key;
            if(responseData != null || responseData != undefined){
              saveKey(responseData.key);
            } else {
              printMsg('Failed to require a API Key','error');
            }
        }
    }
    requestedAPI.open('GET', `https://www.forverkliga.se/JavaScript/api/crud.php?requestKey`)
    requestedAPI.send();
}

//    if(responseText.status == 'error'){
//        console.log(responseText.message);
//     } else console.log(responseText.status);

/* Functions */

function displaySettings(event){
  let smw = document.getElementById('settingsModalWrapper');
  smw.style.display = 'flex';

  /* Add localStorage value */
  localStorage.setItem('settingsOpen', 'true');
  /* Add eventListener for the close btn */
  document.getElementsByClassName('fa fa-window-close fa-lg')[0].addEventListener('click', function(event){
    smw.style.display = 'none';
    localStorage.setItem('settingsOpen', 'false');
    removeSettingsListeners();
  });

  /* Add eventListeners Settings page */
  addSettingsListeners();
}


function addSettingsListeners(){
  let smw = document.getElementById('settingsModalWrapper');

  let keySettingsDiv = document.getElementById('keySettingsDiv');
  let apiSettingsDiv = document.getElementById('apiSettingsDiv');
  let userSettingsDiv = document.getElementById('userSettingsDiv');

  /* Add events for Key settings */
  console.log(keySettingsDiv.innerHTML);
  let inputNewKey = keySettingsDiv.children[1].children[0];
  let btnNewKey = keySettingsDiv.children[1].children[1];

  updateSettings();

  btnNewKey.addEventListener('click', requestKeyFromApi);


  /* EventListener for fetchKey */
  let inputFetchkey = keySettingsDiv.children[2].children[0];
  let btnFetchkey = keySettingsDiv.children[2].children[1];

  btnFetchkey.addEventListener('click', function(){
    /* verifyKey(key, name, hashed, email, create = false, setKey = false) */
    saveKey(inputFetchkey.value);
  });



  /* Add events for API Settings */
  let checkBoxApi1 = document.getElementById('editWhenPressed');
  let checkBoxApi2 = document.getElementById('showDetailedStats');
  let checkBoxApi1Label = document.getElementById('editWhenPressedLabel');
  let checkBoxApi2Label = document.getElementById('showDetailedStatsLabel');


  checkBoxApi1.addEventListener('change', function(event){
    /* Scope variable for easier usage (?) */
    let label = checkBoxApi1Label;

    if(checkBoxApi1.checked){
      label.innerHTML = '<i class="fa fa-check"></i>';
      localStorage.setItem('editWhenPressed', 'true');
    } else {
      label.innerHTML = '<i class="fa fa-times"></i>'
      localStorage.setItem('editWhenPressed', 'false');
    }

  });

  checkBoxApi2.addEventListener('change',function(event){
    /* Scope variable for easier usage (?) */
    let label = checkBoxApi2Label;

    if(checkBoxApi2.checked){
      label.innerHTML = '<i class="fa fa-check"></i>';
    } else {
      label.innerHTML = '<i class="fa fa-times"></i>'
    }

  });

  /* Add events for User Settings */
}

function removeSettingsListeners(){
  let settings = document.getElementById('settingsModalWrapper');
  let oldHTML = settings.innerHTML;

  settings.innerHTML = '';
  settings.innerHTML = oldHTML;
}

function addCloseBtnListener() {
    /*Adding eventListener for the messageCloseButton*/
    const closeBtnList = document.getElementsByClassName('msgCloseBtn');

    for (let btn of closeBtnList) {
        btn.addEventListener('click', function (event) {
            event.target.parentNode.style.display = 'none';
        });
    }
}

function changeLibraryHeader(left, middle, right) {
    const libraryDiv = document.getElementById('library');
    const headerDiv = libraryDiv.children[0];

    head1 = headerDiv.children[0].innerText;
    head2 = headerDiv.children[2].innerText;
    head3 = headerDiv.children[4].innerText;

    if (head1 != left || head2 != middle || head3 != right) {
        headerDiv.children[0].innerText = left;
        headerDiv.children[2].innerText = middle;
        headerDiv.children[4].innerText = right;
        console.log('Changed libraryHeader to: ' + left + ' - ' + middle + ' - ' + right);
    }

}

function displayStats() {
    /* Change the ID, Author, Title */
    changeLibraryHeader('Total', 'Successful requests', 'Failed requests');
    let successful = localStorage.getItem('successRequests') - 0;
    let failed = localStorage.getItem('failedRequests') - 0;
    let total = successful + failed;
    addStats(total, successful, failed);
}

function printMsg(message, type, location = 'default') {

    let messages = document.getElementsByClassName('messageDiv');
    if(localStorage.getItem('settingsOpen') == 'true'){
      location = 'settings';
    }
    /* Set exsists to true and create a new msgDiv*/
    msgDiv = document.createElement('div');

    /* Function to create a unique ID. Attach this to every
    message to only remove that with setTimeout. */
    let uniqueID = guid();
    msgDiv.setAttribute('uniqueID', uniqueID);

    if (type == 'error') {
        msgDiv.className = 'errorMsg messageDiv';
    } else if (type == 'success') {
        msgDiv.className = 'successMsg messageDiv';

    } else if (type == 'warning') {
        msgDiv.className = 'warningMsg messageDiv';
    } else {
        msgDiv.className = 'commonMsg messageDiv';
    }
    msgDiv.style.transition = '1s ease';
    msgDiv.style.display = 'inline-block';
    msgDiv.innerHTML = '<span> ' + message + ' </span><span class="msgCloseBtn"> &times;</span>';

    /* Set the location to display messages */
    let messageContainer = document.getElementsByTagName('main')[0];
    let stopElement = document.getElementsByClassName('apiKeyDisplay')[0];
    let skip = 1;
    let maxMessages = 3;
    if(location == 'default'){
      messageContainer = document.getElementsByTagName('main')[0];
      stopElement = document.getElementsByClassName('apiKeyDisplay')[0];
      skip = 1;
      maxMessages = 3;
    } else if(location == 'settings'){
      messageContainer = document.getElementsByClassName('msgContainer')[0];
      stopElement = messageContainer.lastChild;
      skip = 0;
      maxMessages = 2;
    }

    /* Check how many messages there are showing already. */

    if (messages.length >= maxMessages) {
        if(messageContainer.children[skip] != undefined){
          messageContainer.removeChild(messageContainer.children[skip]);
          messageContainer.insertBefore(msgDiv, stopElement);
        }
    } else {
        messageContainer.insertBefore(msgDiv, stopElement);
    }

    setTimeout(function () {
            if (messageContainer.children[skip].getAttribute('uniqueID') == uniqueID) {
                messageContainer.removeChild(messageContainer.children[skip]);
                console.log('Removed msgDiv where uniqueID was correct.');
            }

    }, 5000);

    /* Finally add a eventListener to the close btn */
    addCloseBtnListener();
}

function addStats(total, successful, failed) {

    let listItem = document.createElement('div');
    listItem.innerHTML = '<span stats="true" class="spanID">' + total + '</span> <hr> <span>' + successful + '</span> <hr> <span>' + failed + '</span> <hr> <button rmvBtn="true"><i class="fa fa-times"></i></button> <button class="hoverGold" refresh="true"><i class="fa fa-refresh"></i></button>'

    const libraryDiv = document.getElementById('library');


    if (libraryDiv.children[1] == null) {
        libraryDiv.appendChild(listItem);
        btnAddEventListeners(listItem);
        console.log('Added stats for the first time.');
    } else if (libraryDiv.children[1].children[0].getAttribute('stats') != undefined) {

        libraryDiv.removeChild(libraryDiv.children[1]);
        libraryDiv.appendChild(listItem);
        btnAddEventListeners(listItem);
        console.log('Stats refreshed.');
        printMsg('Stats refreshed.', 'success');

    } else {
        /* There is a book at this location! */
        /* Remove all books then display stats */
        removeBooksFromLibrary();
        libraryDiv.appendChild(listItem);
        btnAddEventListeners(listItem);
    }
}

function removeBooksFromLibrary() {
    const libraryDiv = document.getElementById('library');
    let length = libraryDiv.children.length;
    console.log('Library Length is: ' + length);
    for (let i = length; i > 0; i--) {
        var currentChild = libraryDiv.children[i - 1];

        if (currentChild != libraryDiv.children[0]) {
            libraryDiv.removeChild(currentChild);
        }
    }
}

function shake(idToShake) {
    assShake = document.getElementById(idToShake);
    assShake.setAttribute('class', "vibe")
    setTimeout(function () {
        assShake.removeAttribute('class', "vibe");
    }, 1500)
}

function shakeElement(element) {
    let oldClass = element.className;

    /* Om det är en knapp, gör den guld när man vibbar */
    if (element.nodeName == 'BUTTON') {
        element.className = 'vibe libraryRemoveBtn hoverGold';
    } else {
        element.className = 'vibe';
    }
    setTimeout(function () {
        element.className = oldClass;
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
    if (keyToSave == undefined) {
        printMsg('Invalid API Key', 'warning');
    } else if (keyToSave == "") {
        printMsg('Invalid API Key', 'warning');
    } else if (keyToSave.length != 5) {
        printMsg('Invalid API Key', 'warning');
    } else {
      /* Verify the key, create user? NO.
      function verifyKey(key, name, email, hashed, create = false, setKey = false)
      */
      verifyKey(keyToSave, undefined, undefined, undefined, false, true);
      return true;
    }
    return false;
}

/* This function will update the settings to the latest values! */
function updateSettings(){

  /* Define some variables first. */
  let keySettingsDiv = document.getElementById('keySettingsDiv');
  let inputNewKey = keySettingsDiv.children[1].children[0];
  /* Set inputValue at key "newKey" to current key! */
  inputNewKey.setAttribute('value', retrieveKey());

  /* editWhenPressed */
  let apiSettingsDiv = document.getElementById('apiSettingsDiv');
  let editWhenPressedLabel = apiSettingsDiv.children[1].children[0].children[1];
  let editWhenPressedBox = apiSettingsDiv.children[1].children[0].children[0];

  if(localStorage.getItem('editWhenPressed') == 'true'){
    editWhenPressedLabel.innerHTML = '<i class="fa fa-check"></i>';
    editWhenPressedBox.checked = true;
  } else {
    editWhenPressedLabel.innerHTML = '<i class="fa fa-times"></i>';
    editWhenPressedBox.checked = false;
  }

  /* User logged in stuff */

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

function addBook(counter, title, author, dbApiKey) {
    if (counter > 10) {
        return printMsg('Failed after 10 retries', 'error');
    } else {

        const addBookRequest = new XMLHttpRequest();
        let responseText = null;
        let addUser = false;

        /* If the dbApiKey is undefined. This is a book being added. */
        console.log(retrieveDatabaseKey());

        if (dbApiKey == retrieveDatabaseKey()) {
            addUser = true;
        } else {
            dbApiKey = retrieveKey();
        }

        addBookRequest.onreadystatechange = function (event) {

            if (addBookRequest.readyState === 4 && addBookRequest.status === 200) {

                /* Parse JSON to JavaScript */
                responseData = JSON.parse(addBookRequest.responseText);

                if (responseData.status == 'error') {
                    /* IF ERROR, CALL MYSELF */
                    return addBook((counter + 1), title, author, dbApiKey);

                } else {
                    console.log(responseData.status);
                    if (addUser) {
                        console.log('In addbook dbApiKey is: '+dbApiKey);
                        printMsg('User created!', 'success');
                    } else {
                        printMsg('Book added!', 'success');
                    }
                }
                console.log(responseData.id);
            }
        }

        addBookRequest.open('GET', `https://www.forverkliga.se/JavaScript/api/crud.php?op=insert&key=${dbApiKey}&title=${title}&author=${author}`);
        addBookRequest.addEventListener('load', alertShit);
        addBookRequest.send();
    }
}

function alertShit(event){
  console.log(event.target.responseText);
}

function retrieveKey() {
    /* Retrieve apiKey */
    return localStorage.getItem('apiKey');
}
