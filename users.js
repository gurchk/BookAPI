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
document.getElementById('createUserBtn').addEventListener('click', function(){
  userModal1.style.display = 'block';
  userModal2.style.display = 'none';
  userModal3.style.display = 'none';
});

/* Retrieve User Button EVENTLISTENER*/
document.getElementById('retrieveUserBtn').addEventListener('click', function(){
  userModal1.style.display = 'none';
  userModal2.style.display = 'block';
  userModal3.style.display = 'none';
});

document.getElementById('removeUserById').addEventListener('click', function(){
  userModal1.style.display = 'none';
  userModal2.style.display = 'none';
  userModal3.style.display = 'block';
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

  /* If name field is empty */
  if(name == ""){
    printMsg('Empty name field!', 'error');
  } else if(key != ""){
    verifyKey(key, name);
  } else {

    key = retrieveKey();
    console.log('Creating user!');
    parent.children[0].value = "";
    parent.children[1].value = "";
    createUser(name,key);
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

    retrieveUser(0, name, 0);

    console.log('Retrieving user!');
    parent.children[0].value = "";
    parent.children[1].value = "";
  }
});

apiBtn3.addEventListener('click', function(event){
  /* Retrieve ALL USERS & display*/
    removeBooksFromLibrary();
    retrieveUser(0, 1, 0, true);
});

apiBtn4.addEventListener('click', function(event){

    /* Remove user by ID */

    let parent = event.target.parentNode;
    removeBookFromApi(parent.children[0].value, 0);
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

/* Database functions */
function createDatabaseKey(){
  localStorage.setItem('databaseKey', 'NvvhR');
}

function retrieveDatabaseKey(){
  return localStorage.getItem('databaseKey');
}

function createUser(name, key){

  /* Skapar användaren */
  let userObject = {
    name: name,
    key: key
  };

  let strObj = JSON.stringify(userObject);

  /* Set dbApiKey to databaseKey */
  let dbApiKey = retrieveDatabaseKey();

  /* Add the user to the API using the addBook function */
  addBook(0, 'user', strObj, dbApiKey);
}


function verifyKey(key, name){
    const xhr = new XMLHttpRequest();
    var bad = false;

    xhr.onreadystatechange = function(){
      if(xhr.responseText.toString().includes('Bad API key')){
        bad = true;
      }

      if(xhr.readyState === 4 && bad){
        printMsg('Bad API key', 'error');
      } else if(xhr.readyState === 4 && !bad){
        createUser(name, key);
      }
    }


    xhr.open('GET', `https://www.forverkliga.se/JavaScript/api/crud.php?op=select&key=${key}`);
    xhr.send();

}

function userUploadKey(event){
  let listItem = event.target.parentNode;
  if(event.target.nodeName == 'I'){
    listItem = listItem.parentNode;
  }
  let key = listItem.children[4].innerText;
  console.log(key);
  saveKey(key);
  updateActive();
  printMsg('Changed active key to: ' + key, 'success');
}

/* Function to display a user in the table */
function displayUser(id, username, userKey){
  const libraryDiv = document.getElementById('library');

  /* Check if stats are active, if so, remove it */
  removeStats();
  /* Change the headers */
  changeLibraryHeader('UserID', 'Username', 'Personal apikey');

  let listItem = document.createElement('div');

  listItem.innerHTML = '<span user="true" class="spanID">'+id+'</span> <hr> <span>'+username+'</span> <hr> <span>'+userKey+'</span> <hr> <button pen="true" class="libraryRemoveBtn hoverGold"><i class="fa fa-pencil" aria-hidden="true"></i></button><button upload="true" class="hoverGrey libraryRemoveBtn"><i class="fa fa-upload" aria-hidden="true"></i></button><button rmvBtn="true" class="libraryRemoveBtn"><i class="fa fa-user-times" aria-hidden="true"></i></button>';


  let exists = false;
  for(let listItem of libraryDiv.children){
    if(id == listItem.children[0].innerText){
      exists = true;
    }
  }
  if(!exists){
    libraryDiv.appendChild(listItem);

    for(let listItem of libraryDiv.children){
      btnAddEventListeners(listItem);
    }
  } else {
    printMsg('This user already exists!', 'warning');
    console.log('This user already exists');
  }
}


/* Function to retrieve a user */
function retrieveUser(counter, name, id, all){
console.log(all);
console.log('COUNTER IS: ' + counter);
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
                } else {
                  /* If the data has title "user" */

                  /* Convert userData to JavaScript object */
                  let userObj= JSON.parse(responseData.data[i].author);

                  /* If username doesn't exist. This is a corrupt object */
                  if(userObj.name != undefined){

                    /*If all is true, print ALL users to library */
                    if(all){
                      displayUser(responseData.data[i].id,userObj.name,userObj.key);
                    } else {
                      /* Else check for a certain user! */

                      /* Check if the user is found! */

                        if(userObj.name.toLowerCase().includes(name.toLowerCase())){
                          found = true;
                          displayUser(responseData.data[i].id,userObj.name,userObj.key);
                        }
                    }
                  } else {
                    printMsg('Object does not have a name. ID: '+ responseData.data[i].id,'error');
                  }
                  userCount++;
                }
              }

              if(!all && !found){
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
