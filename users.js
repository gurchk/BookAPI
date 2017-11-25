window.addEventListener('load', function (event) {

/* EventListeners */

/* User panel Button EVENTLISTENER*/
document.getElementById('userPanelBtn').addEventListener('click', function(){
  document.getElementsByClassName('userPanel')[0].style.display = 'block';
});

let userModal1 = document.getElementsByClassName('userModal')[0];
let userModal2 = document.getElementsByClassName('userModal')[1];
let userModal3 = document.getElementsByClassName('userModal')[2];

/* Create User Button EVENTLISTENER*/
let createUserBtn = document.getElementById('createUserBtn');
let retrieveUserBtn = document.getElementById('retrieveUserBtn');
let removeUserBtn = document.getElementById('removeUserById');
createUserBtn.addEventListener('click', function(){
  userModal1.style.display = 'block';
  userModal2.style.display = 'none';
  userModal3.style.display = 'none';

  /* Set active to createUser btn */
  createUserBtn.className = 'userPanelBtnActive';

  /* Remove from the other two */
  removeUserBtn.className = '';
  retrieveUserBtn.className = '';
});

/* Retrieve User Button EVENTLISTENER*/
retrieveUserBtn.addEventListener('click', function(){
  userModal1.style.display = 'none';
  userModal2.style.display = 'block';
  userModal3.style.display = 'none';
  /* Set active to Retrieve btn */
  retrieveUserBtn.className = 'userPanelBtnActive';

  /* Remove from the other two */
  createUserBtn.className = '';
  removeUserBtn.className = '';
});

removeUserBtn.addEventListener('click', function(){
  userModal1.style.display = 'none';
  userModal2.style.display = 'none';
  userModal3.style.display = 'block';
  /* Set active to Remove btn */
  removeUserBtn.className = 'userPanelBtnActive';

  /* Remove from the other two */
  createUserBtn.className = '';
  retrieveUserBtn.className = '';
});

let apiBtn1 = document.getElementsByClassName('apiBtn')[0];
let apiBtn2 = document.getElementsByClassName('apiBtn')[1];
let apiBtn3 = document.getElementsByClassName('apiBtn')[2];
let apiBtn4 = document.getElementsByClassName('apiBtn')[3];

/* Create user eventListener */
apiBtn1.addEventListener('click', function(event){

  /* Create user */
  let parent = event.target.parentNode;
  let name = parent.children[0].value;
  let key = parent.children[1].value;
  let password = parent.children[2].value;
  let hashed;

  if(password != ""){
    hashed = md5(password);
  }


  /* If name field is empty */
  if(name == ""){
    printMsg('Empty name field!', 'error');
  } else if(key != ""){
    verifyKey(key, name, hashed, true);
  } else {

    key = retrieveKey();
    console.log('Creating user!');
    parent.children[0].value = "";
    parent.children[1].value = "";
    parent.children[2].value = "";

    createUser(name, key, hashed);
    console.log('hashed is: '+ hashed);
  }
});

/* Retrieve user eventListener */
apiBtn2.addEventListener('click', function(event){
  /* Retrieve user */
  let parent = event.target.parentNode;
  let name = parent.children[0].value;
  if(name == ""){
    printMsg('Empty field!', 'error');
  } else{

    removeBooksFromLibrary();
    retrieveUser(0, name, undefined, false);
    console.log('Retrieving user!');
    parent.children[0].value = "";
    parent.children[1].value = "";
  }
});

apiBtn3.addEventListener('click', function(event){
  /* Retrieve ALL USERS & display*/
    removeBooksFromLibrary();
    /* retrieveUser(counter, name, id, all) */
    retrieveUser(0, 'all', undefined, true);
    console.log('Retrieving all users!');
});

apiBtn4.addEventListener('click', function(event){

    /* Remove user by ID */

    let parent = event.target.parentNode;
    removeBookFromApi(parent.children[0].value, 0, true);
    parent.children[0].value = "";
});

  /* Testing functions in callback */
  changeLibraryHeader('UserID','Username','Key');
  //removeBookFromApi(10889, 0);
  //retrieveUser(0, 'Anton');
  createDatabaseKey();

  /* End of callback */
});

/* Users JavaScript file */


/* Functions */

/* Style Functions */
function removeActiveBtn(){
  createUserBtn.className = '';
  retrieveUserBtn.className = '';
  removeUserBtn.className = '';
}


/* Database functions */
function createDatabaseKey(){
  localStorage.setItem('databaseKey', 'NvvhR');
}

function retrieveDatabaseKey(){
  return localStorage.getItem('databaseKey');
}


function createUser(name, key, hashed){

  /*Kolla om användaren vill ha lösenord */
  if(hashed == undefined){
    hashed = false;
  }

  /* Skapar användaren */
  let userObject = {
    name: name,
    key: key,
    password: hashed
  };
  console.log('HASHED IN CREATEUSER(name, key, hashed) is now: '+ hashed);

  let strObj = JSON.stringify(userObject);

  /* Set dbApiKey to databaseKey */
  let dbApiKey = retrieveDatabaseKey();

  /* Add the user to the API using the addBook function */
  addBook(0, 'user', strObj, dbApiKey);
}


function verifyKey(key, name, hashed, create = false){
    const xhr = new XMLHttpRequest();
    var bad = false;

    xhr.onreadystatechange = function(){
      if(xhr.responseText.toString().includes('Bad API key')){
        bad = true;
      }

      if(xhr.readyState === 4 && bad){
        printMsg('Bad API key', 'error');
        return false;
      } else if(xhr.readyState === 4 && !bad){
        if(create){
          createUser(name, key, hashed);
        }
        return true;
      }
    }
    xhr.open('GET', `https://www.forverkliga.se/JavaScript/api/crud.php?op=select&key=${key}`, false);
    xhr.send();
}

function userUploadKey(event){
  let listItem = event.target.parentNode;
  if(event.target.nodeName == 'I'){
    listItem = listItem.parentNode;
  }
  let key = listItem.children[4].innerText;
  console.log(key);

  /* Vibe it */
  shakeElement(event.target);

  /* Change saved key */
  saveKey(key);
  updateActive();
  printMsg('Changed active key to: ' + key, 'success');
}

/* Function to display a user in the table */
function displayUser(id, username, userKey, hashedPassword){
  const libraryDiv = document.getElementById('library');

  /* Check if stats are active, if so, remove it */
  removeStats();
  /* Change the headers */
  changeLibraryHeader('UserID', 'Username', 'Personal apikey');

  let listItem = document.createElement('div');
  let upload = true;

  if(userKey.toLowerCase().includes('protected')){
    userKey += ' <button unlock="true" class="lockBtn"><i class="fa fa-lock" aria-hidden="true"></i></button>';
    upload = false;
  }

  listItem.innerHTML = '<span user="true" class="spanID" hp="'+hashedPassword+'">'+id+'</span> <hr> <span>'+username+'</span> <hr> <span class="userKey">'+userKey+'</span> <hr> <button pen="true" class="libraryRemoveBtn hoverGold"><i class="fa fa-pencil" aria-hidden="true"></i></button><button upload="'+upload+'" class="hoverGrey libraryRemoveBtn"><i class="fa fa-upload" aria-hidden="true"></i></button><button rmvBtn="true" class="libraryRemoveBtn"><i class="fa fa-user-times" aria-hidden="true"></i></button>';


  let exists = false;
  for(let listItem of libraryDiv.children){
    if(id == listItem.children[0].innerText){
      exists = true;
    }
  }
  if(!exists){
    libraryDiv.appendChild(listItem);

  } else {
    printMsg('This user already exists!', 'warning');
    console.log('This user already exists');
  }

  for(let listItem of libraryDiv.children){
    btnAddEventListeners(listItem);
  }
}


function protectEventListener(protectHtmlObj){
  protectHtmlObj.addEventListener('change', function(event){
    let listItem = event.target.parentNode;
    let userID = protectHtmlObj.parentNode.children[0].innerText;

    if(verifyHash(event.target.value, listItem)){
      printMsg('Password is correct!', 'success');
      event.target.blur();
      /* Password was correct. Create function here */
      passwordWasCorrect(userID);
      console.log(listItem.innerHTML.parentNode);
    } else {
      /* Bad password! */
      printMsg('Bad password!', 'error');
      event.target.blur();
    }
  });

  protectHtmlObj.children[0].addEventListener('blur', function(event){
    let listItem = event.target.parentNode;

    /* Reset the input box */
    event.target.parentNode.innerHTML = 'Protected <button unlock="true" class="lockBtn"><i class="fa fa-lock" aria-hidden="true"></i></button>';

    btnAddEventListeners(listItem.parentNode);
  });
}

function passwordWasCorrect(userID){
  /* Set active key from the user ID */
  retrieveUser(0, undefined, userID, false);
  console.log('Password was correct. Trying to retrieve user from database with ID.');
}


/* Function to retrieve a user */
function retrieveUser(counter, name, id, all){
  /* Should we use ID to retrieve user? */
  let useID = false;
  if(id != undefined){
    useID = true;
  }

  if(counter > 10){
    printMsg('Failed after 10 retries.', 'error');
    return;
  } else {

    const retrieveUserRequest = new XMLHttpRequest();

    retrieveUserRequest.onreadystatechange = function(event) {
        if (retrieveUserRequest.readyState === 4 && retrieveUserRequest.status === 200) {

            /* Always parse responseData */
            let responseData = JSON.parse(retrieveUserRequest.responseText);
            console.log('COUNTER IS: ' + counter);
            /* If the API returns error */
            if(responseData.status == "error"){

              /* Print errormessage */
              console.log(responseData.message);
              increaseFailed();
              /* Try to retrieve user again, plus one to counter */
              console.log('COUNTER IS: ' + counter);
              return retrieveUser((counter+1), name, id, all);

            } else {
              /* THE REQUEST IS SUCCESSFUL, WE HAVE RETRIEVED THE DATA */

              /* Iterate through JavaScript object with for loop */
              let userCount = 0;
              let found = false;

              for(let i = 0; i < responseData.data.length; i++){
                /* If the JavaScript data is a . Ignore it! */
                if(responseData.data[i].title != 'user'){
                  printMsg('Book found in userDB. ID: '+responseData.data[i].id, 'warning');
                } else {
                  /* If the data has title "user" */

                  /* Convert userData to JavaScript object */
                  let userObj= JSON.parse(responseData.data[i].author);
                  console.log('PASSWORD IS: ' + userObj.password);
                  if(userObj.password){
                    console.log('PASSWORD IS NOT FALSE');
                  } else {
                    console.log('PASSWORD IS FALSE');
                  }
                  /* If username doesn't exist. This is a corrupt object */
                  if(userObj.name != undefined){

                    if(useID){
                      if(id == responseData.data[i].id){

                        /* We found the user by ID! */
                        saveKey(userObj.key);
                        updateActive();
                        removeBooksFromLibrary();
                        retrieveBooks(0);

                      }
                    } else if(all){
                      /*If all is true, print ALL users to library */

                      if(userObj.password){
                        displayUser(responseData.data[i].id,userObj.name,'Protected',userObj.password);
                      } else {
                        displayUser(responseData.data[i].id,userObj.name,userObj.key);
                      }
                    } else {
                      /* Else check for a certain user! */

                      /* Check if the user is found! But only if useid is false*/

                        if(userObj.name.toLowerCase().includes(name.toLowerCase()) && !useID){
                          found = true;
                          if(userObj.password){
                            printMsg('This user is password protected!', 'warning');
                            displayUser(responseData.data[i].id,userObj.name,'Protected',userObj.password);
                          } else {
                            displayUser(responseData.data[i].id,userObj.name,userObj.key);
                          }
                        }
                    }
                  } else {
                    printMsg('Object does not have a name. ID: '+ responseData.data[i].id,'error');
                  }
                  userCount++;
                }
              }

              if(!all && !found && !useID){
                  printMsg('User not found.', 'error');
                //printMsg('User found! Name:' + userObj.name + 'Key: '+userObj.key, 'success');
              } else if (found){
                  printMsg('User found!','success');
              }
              console.log('Number of users in the api:' + userCount);
              console.log(retrieveUserRequest.status);
              increaseSuccess();
              //printMsg('Successfully retrieved ' + userCount + ' users on the '+(counter+1)+'th try.', 'success');

              if(userCount == 0){
                printMsg('No users found!', 'warning');
              } else if(all){
                printMsg('Printing users to library!', 'success');
              }
            }
        }
    }

    retrieveUserRequest.open('GET', `https://www.forverkliga.se/JavaScript/api/crud.php?op=select&key=${retrieveDatabaseKey()}`);
    retrieveUserRequest.send();
  }
}
