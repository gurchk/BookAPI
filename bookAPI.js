 window.addEventListener('load', function (event) {

    const requestAPIbtn = document.getElementById('requestAPI');
    const logActive = document.getElementById('apiKEY');
    updateSaved();
    updateActive();


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


    /* Add eventListeners to statsBtn and settingsBtn */
    let statsBtn = document.getElementById('statsBtn');
    statsBtn.addEventListener('click', function (event) {

        /* STATS FUNCTION CALL*/
        displayStats();

    });

    let settingsBtn = document.getElementById('settingsBtn');
    settingsBtn.addEventListener('click', displaySettings);

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
              increaseStat('success');
            } else {
              increaseStat('failed');
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



  /* Test listners */
  /* Remove Messages */
  let removeMessagesBtn = document.getElementById('removeMessagesBtn');
  removeMessagesBtn.style.margin = '10px 6px 8px 15px';
  removeMessagesBtn.addEventListener('click', removeMessages);

  /* Add events for Key settings */
  /* -------------------------- */

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

  /*EventListeners for Saved Key */
  /* adding eventListener to saveActiveKey & retrieveOurKey */
  let saveCurrentBtn = document.getElementById('saveCurrent');
  saveCurrentBtn.addEventListener('click', function (e) {
      saveActiveKey(retrieveKey());
      updateSaved();
  });

  /* Set saved key to current key */
  let useSavedKeyBtn = document.getElementById('useSavedKeyBtn');
  useSavedKeyBtn.addEventListener('click', function () {
      /* verifyKey(key, name, hashed, email, create = false, setKey = false) */
      verifyKey(retrieveOurKey(), undefined, undefined, undefined, undefined, true);
      updateSaved();
  });


  /* Import library from other key */
  let importKeyInput = document.getElementById('importKeyInput');
  let importKeyBtn = document.getElementById('importKeyBtn');

  importKeyBtn.addEventListener('click', function(){

    if(importKeyInput.value != ""){
      importLibrary(importKeyInput.value);
    } else {
      printMsg('Empty field', 'error');
    }

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
      localStorage.setItem('useDetailedStats', 'true');
    } else {
      label.innerHTML = '<i class="fa fa-times"></i>'
      localStorage.setItem('useDetailedStats', 'false');
    }

  });

  /* Import Stats */

  /* Export Local Stats */
  let exportStatsInput = document.getElementById('exportStatsInput');
  let exportStatsBtn = document.getElementById('exportStatsBtn');
  let parent = exportStatsBtn.parentNode;
  parent.style.justifyContent = 'center';
  exportStatsBtn.style.margin = '10px 6px 8px 15px';
  exportStatsBtn.addEventListener('click', function(){

    exportLocalStats();

  });


  /* Add events for User Settings */
  /* ---------------------------- */


  /*EventListener for retrieve all users */
  let retrieveAllUsersBtn = document.getElementById('retrieveAllUsersBtn');
  retrieveAllUsersBtn.addEventListener('click', function(event){
    /* Retrieve ALL USERS & display*/
      removeBooksFromLibrary();
      /* retrieveUser(counter, name, id, all) */
      retrieveUser(0, 'all', undefined, true);
      console.log('Retrieving all users!');
  });

    /* Add eventListener to LoginBtn */
    let settingsLoginBtn = document.getElementById('settingsLoginBtn');
    if(settingsLoginBtn != undefined){
      settingsLoginBtn.addEventListener('click', function(event){

        displayLogin();

        /* Add eventListener to close when clicking outside */
        addOutSideClick();

        addEventListenersForLoginPage();
      });
    }


    /* Add eventListener to changePasswordbtn */
    let changePasswordDiv = document.getElementsByClassName('inputWithButton changePasswordDiv');
    let changePasswordBtn = changePasswordDiv[0];

    if(changePasswordBtn != undefined){
      changePasswordBtn = changePasswordBtn.children[0];
      let parent = changePasswordBtn.parentNode;

      /* Defined input variables. */
      let inputOne = parent.previousSibling.previousSibling.previousSibling.children[0];
      let inputTwo = inputOne.parentNode.nextSibling.children[0];
      let inputThree = inputTwo.parentNode.nextSibling.children[0];



      /* settingsChangePassword */
      inputOne.addEventListener('keyup', function(event){
        loginInputCheck(event, 5, 32, 'settingsChangePassword');
      });
      inputTwo.addEventListener('keyup', function(event){
        loginInputCheck(event, 5, 32, 'settingsChangePassword');
      });
      inputThree.addEventListener('keyup', function(event){
        loginInputCheck(event, 5, 32, 'settingsChangePasswordSame', 'Passwords do not match!');
      });

      /* Add the EventListener */
      changePasswordBtn.addEventListener('click', function(){

        let loggedInUser = localStorage.getItem('loggedInUser');
        console.log('Current user:', loggedInUser);

        /* Parse the user */
        loggedInUser = JSON.parse(loggedInUser);


        /* Make some advanced checks */
        if(inputOne.value == "" || inputTwo.value == "" || inputThree.value == "" ){
          printMsg('Atleast one empty field', 'error');
        } else if(inputTwo.value != inputThree.value){
          printMsg('Password doesn\'t match', 'error');
        } else if(inputTwo.value.length < 5){
          printMsg('New password too short', 'error');
        } else if(md5(inputOne.value) != loggedInUser.password){
          printMsg('Wrong password','error');
        } else if(md5(inputOne.value) == loggedInUser.password){
          loggedInUser.password = md5(inputTwo.value);
          modifyUser(loggedInUser, 'Password changed!', 'Failed to change password');
        }
      });
    }
    /* End of changePasswordbtn */

    /* Add eventListener for setApiKeyBtn */

    let changeApiKeyDiv = document.getElementById('changeApiKeyDiv');

    if(changeApiKeyDiv != undefined){

      let changeApiKeyInput = changeApiKeyDiv.children[0];
      let changeApiKeyBtn = changeApiKeyDiv.children[1];

      changeApiKeyBtn.addEventListener('click', function(){
        let loggedInUser = localStorage.getItem('loggedInUser');

        /* Parse the user */
        loggedInUser = JSON.parse(loggedInUser);

        if(changeApiKeyInput.value == ""){
          printMsg('Empty field.', 'error');
        } else {
          verifyUserKey(changeApiKeyInput.value, loggedInUser);
          changeApiKeyInput.value = "";
        }
      });
    }
}

function verifyUserKey(key, userObj){
  recursiveFetch('https://www.forverkliga.se/JavaScript/api/crud.php?op=select&key='+key)
  .then(response => {
    if(response.status = 'success'){
      userObj.key = key;
      modifyUser(userObj);
      increaseStat('success');
      localStorage.setItem('loggedInUser', JSON.stringify(userObj));

      let changeApiKeyDiv = document.getElementById('changeApiKeyDiv');
      let changeApiKeyInput = changeApiKeyDiv.children[0];
      changeApiKeyInput.setAttribute('placeholder', userObj.key);
    }
  })
  .catch(response => {
    increaseStat('failed');
    printMsg('Bad Api key', 'error');
  })

}

function removeSettingsListeners(){
  let settings = document.getElementById('settingsModalWrapper');
  let oldHTML = settings.innerHTML;

  settings.innerHTML = '';
  settings.innerHTML = oldHTML;


  /* Remove displaying messages */
  removeMessages();
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

function importLibrary(key){

  recursiveFetch('https://www.forverkliga.se/JavaScript/api/crud.php?op=select&key='+key)
  .then(response => {
    if(response.status == 'success'){
      increaseStat('success');
      /* function addBook(counter, title, author, dbApiKey) */
      console.log(response.data);
      let newKey = retrieveKey();
      for(let data of response.data){
        addBook(0, data.title, data.author, newKey, true);
      }

      retrieveBooks();
    }
  })
  .catch(badResponse => {
    increaseStat('failed');
    printMsg('Bad Api key', 'error');
  });
}

function displayStats() {
    /* Change the ID, Author, Title */
    changeLibraryHeader('Total', 'Successful requests', 'Failed requests');
    let successful = localStorage.getItem('successRequests') - 0;
    let failed = localStorage.getItem('failedRequests') - 0;
    let total = successful + failed;
    addStats(total, successful, failed);
}

function removeMessages(){

  /* All messages */
  let messages = document.getElementsByClassName('messageDiv');

  console.log('LENGTH OF MESSAGES IS:'+messages.length);
  for(let i = messages.length-1; i >= 0; i--){
    let currMsg = messages[i];
    let parent = currMsg.parentNode;

    parent.removeChild(currMsg);
  }
}

function printMsg(message, type, location = 'default') {

    /* All messages */
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
          if(messageContainer.children[skip] != undefined){
            if (messageContainer.children[skip].getAttribute('uniqueID') == uniqueID) {
                messageContainer.removeChild(messageContainer.children[skip]);
                console.log('Removed msgDiv where uniqueID was correct.');
            }
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

    } else if (libraryDiv.children[1].children[0].getAttribute('stats') != undefined) {
        removeBooksFromLibrary();
        //libraryDiv.removeChild(libraryDiv.children[1]);
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

    /* IF detailedStats is true, add detailed stats! */
    if(localStorage.getItem('useDetailedStats') == 'true'){
      printMsg('Detailed stats is activated!','success');
      addDetailedStats();
    } else {
      printMsg('Detailed stats is deactivated!','warning');
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
    currentSavedKey.setAttribute('placeholder', `Saved Key: ${retrieveOurKey()}`);
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
  inputNewKey.setAttribute('placeholder', 'Active key: '+retrieveKey());

  /* editWhenPressed & DetailedStats */
  let apiSettingsDiv = document.getElementById('apiSettingsDiv');

  /*editWhenPressed */
  let editWhenPressedLabel = document.getElementById('editWhenPressedLabel');
  let editWhenPressedBox = document.getElementById('editWhenPressed');

  if(localStorage.getItem('editWhenPressed') == 'true'){
    editWhenPressedLabel.innerHTML = '<i class="fa fa-check"></i>';
    editWhenPressedBox.checked = true;
  } else {
    editWhenPressedLabel.innerHTML = '<i class="fa fa-times"></i>';
    editWhenPressedBox.checked = false;
  }

  /* DetailedStats */

  let showDetailedStatsLabel = document.getElementById('showDetailedStatsLabel');
  let showDetailedStatsBox = document.getElementById('showDetailedStats');

  if(localStorage.getItem('useDetailedStats') == 'true'){
    showDetailedStatsLabel.innerHTML = '<i class="fa fa-check"></i>';
    showDetailedStatsBox.checked = true;
  } else {
    showDetailedStatsLabel.innerHTML = '<i class="fa fa-times"></i>';
    showDetailedStatsBox.checked = false;
  }

  /* User logged in stuff */
  let userSettingsDiv = document.getElementById('userSettingsDiv');

  userObj = 'Guest';
  if(localStorage.getItem('loggedInUser') != 'Guest'){
    userObj = JSON.parse(localStorage.getItem('loggedInUser'));
  }

  /* Set Stats Key */
  document.getElementById('setStatsInput').setAttribute('placeholder', retrieveStatsKey());

  /* User logged in? */
  if(loggedIn()){


    let nameElement = document.createElement('H4');
    nameElement.setAttribute('userName', 'true');
    nameElement.innerHTML = 'User: '+userObj.name;
    nameElement.style.margin = '-18px auto 4px';

    /* Check if it already exsists before appending it */
    if(userSettingsDiv.children[1].getAttribute('userName') != undefined){
      console.log('Not appending another child since it is already a message showing');
    } else {
      userSettingsDiv.insertBefore(nameElement, userSettingsDiv.children[1]);
    }

    /* Change margin to the retrieveAllUsersBtn */
    let retrieveAllUsersBtn = document.getElementById('retrieveAllUsersBtn');
    retrieveAllUsersBtn.style.margin = '10px 6px 8px 16px';

    /* Check if passwordDivs exist. If not, append them! */
    if(document.getElementsByClassName('inputWithButton passwordDiv').length == 0){
      let oldPw = document.createElement('DIV');
      oldPw.innerHTML = '<input type="password" placeholder="Old passsword">';
      oldPw.className = 'inputWithButton passwordDiv';

      let newPw1 = document.createElement('DIV');
      newPw1.innerHTML = '<input type="password" placeholder="New passsword">';
      newPw1.className = 'inputWithButton passwordDiv';

      let newPw2 = document.createElement('DIV');
      newPw2.innerHTML = '<input type="password" placeholder="Repeat passsword">';
      newPw2.className = 'inputWithButton passwordDiv';

      userSettingsDiv.appendChild(oldPw);
      userSettingsDiv.appendChild(newPw1);
      userSettingsDiv.appendChild(newPw2);

      /* Add Change Password button */
      let changePasswordDiv = document.createElement('DIV');
      changePasswordDiv.innerHTML = '<button class="fullDivButton">Change Password</button>';
      changePasswordDiv.className = 'inputWithButton changePasswordDiv';
      changePasswordDiv.style.margin = '-8px 3px 0px 10px';
      userSettingsDiv.appendChild(changePasswordDiv);

    }

    /* Remove login Button */
    let settingsLoginBtn = document.getElementById('settingsLoginBtn');
    if(settingsLoginBtn != undefined){
      userSettingsDiv.removeChild(settingsLoginBtn);
    }

    /* Add option to edit your APIKEY only if it doesn't exist.*/
    if(document.getElementById('changeApiKeyDiv') == undefined){
      let changeApiKeyDiv = document.createElement('DIV');
      changeApiKeyDiv.innerHTML = '<input type="text" placeholder="Change ApiKey ('+userObj.key+')"><button>Set key</button>'
      changeApiKeyDiv.className = 'inputWithButton';
      changeApiKeyDiv.setAttribute('id', 'changeApiKeyDiv');

      /* Append it */
      userSettingsDiv.appendChild(changeApiKeyDiv);
    } else {
      /* Update the key */
      let changeApiKeyDiv = document.getElementById('changeApiKeyDiv');
      changeApiKeyDiv.children[0].setAttribute('placeholder', userObj.key);
    }

    /* No user is logged in! */
  } else {

    /* remove userName from Settings */
    if(userSettingsDiv.children[1].getAttribute('userName') != undefined){
      userSettingsDiv.removeChild(userSettingsDiv.children[1]);
    }


    /* Change margin to the retrieveAllUsersBtn */
    let retrieveAllUsersBtn = document.getElementById('retrieveAllUsersBtn');
    retrieveAllUsersBtn.style.margin = '';


    /* remove passwordDivs from Settings */
    let passwordDivs = document.getElementsByClassName('inputWithButton passwordDiv');

    for(let i = passwordDivs.length-1; i >= 0; i--){
      passwordDivs[i].parentNode.removeChild(passwordDivs[i]);
    }


    /* Remove changePasswordDiv */
    if(document.getElementsByClassName('inputWithButton changePasswordDiv').length != 0){
      userSettingsDiv.removeChild(document.getElementsByClassName('inputWithButton changePasswordDiv')[0]);
    }

    /* Remove changeApiKeyDiv */
    if(document.getElementById('changeApiKeyDiv') != undefined){
      userSettingsDiv.removeChild(document.getElementById('changeApiKeyDiv'));
    }

    /* Add a login Button? Only if it doesn't exist! */
    if(document.getElementById('settingsLoginBtn') == undefined){
      let settingsLoginBtn = document.createElement('DIV');
      settingsLoginBtn.innerHTML = '<button class="fullDivButton">Login to view</button>'
      settingsLoginBtn.className = 'inputWithButton';
      settingsLoginBtn.setAttribute('id', 'settingsLoginBtn')
      userSettingsDiv.appendChild(settingsLoginBtn);


    }
  }

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

function addBook(counter, title, author, dbApiKey, silent = false) {
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
                    increaseStat('failed');
                    /* IF ERROR, CALL MYSELF */
                    return addBook((counter + 1), title, author, dbApiKey);

                } else {
                  increaseStat('success');
                    console.log(responseData.status);
                    if (addUser) {
                        console.log('In addbook dbApiKey is: '+dbApiKey);

                        if(!silent) printMsg('User created!', 'success');

                    } else {
                        if(!silent) printMsg('Book added!', 'success');
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
