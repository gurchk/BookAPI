window.addEventListener('load', function (event) {

/* EventListeners */

/* User panel Button EVENTLISTENER*/
document.getElementById('userPanelBtn').addEventListener('click', function(){
  document.getElementsByClassName('userPanel')[0].style.display = 'block';
});

let userModal1 = document.getElementsByClassName('userModal')[0];
let userModal2 = document.getElementsByClassName('userModal')[1];

/* Create User Button EVENTLISTENER*/
document.getElementById('createUserBtn').addEventListener('click', function(){
  userModal1.style.display = 'block';
  userModal2.style.display = 'none';
});

/* Retrieve User Button EVENTLISTENER*/
document.getElementById('retrieveUserBtn').addEventListener('click', function(){
  userModal1.style.display = 'none';
  userModal2.style.display = 'block';
});

let apiBtn1 = document.getElementsByClassName('apiBtn')[0];
let apiBtn2 = document.getElementsByClassName('apiBtn')[1];

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
    verifyKey(key);
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

    retrieveUser(0, name);

    console.log('Retrieving user!');
    parent.children[0].value = "";
    parent.children[1].value = "";
  }
});

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

/* Function to retrieve a user */
function retrieveUser(counter, name, id){

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

            /* If the API returns error */
            if(responseData.status == "error"){
              /* Try to retrieve user again, plus one to counter */
              return retrieveUser(counter+1, name, id);

              /* Print errormessage */
              console.log(responseData.message);
              increaseFailed();
            } else {
              /* THE REQUEST IS SUCCESSFUL, WE HAVE RETRIEVED THE DATA */

              /* Iterate through JavaScript object with for loop */
              let userCount = 0;
              let found = false;

              for(let i = 0; i < responseData.data.length; i++){
                /* If the JavaScript data is a . Ignore it! */
                if(responseData.data[i].title != 'user'){
                } else {

                  /* If the data is a user! */
                  /* Convert userData to JavaScript object */

                  let userObject = JSON.parse(responseData.data[i].author);
                  let nameStr = userObject.name;
                  
                  /* Check if the user is found! */
                  if(nameStr.toLowerCase() == name.toLowerCase()){
                    found = true;
                  }
                  console.log(userObject.name);
                  userCount++;
                }
              }

              if(found) {
                printMsg('User found!', 'success');
              } else {
                printMsg('User not found.', 'error');
              }
              console.log('Number of users in the api:' + userCount);
              console.log(retrieveUserRequest.status);
              increaseSuccess();
              printMsg('Successfully retrieved ' + userCount + ' users on the '+(counter+1)+'th try.', 'success');

              if(userCount == 0){
                printMsg('No users found!', 'warning');
              }
            }
        }
    }

    retrieveUserRequest.open('GET', `https://www.forverkliga.se/JavaScript/api/crud.php?op=select&key=${retrieveDatabaseKey()}`);
    retrieveUserRequest.send();
  }
}
