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
  console.log('Key is: '+key);
  if(key == ""){
    key = 'saved';
  }
  createUser(name,key);

});

/* Retrieve user eventListener */
apiBtn2.addEventListener('click', function(){
  /* Retrieve user */

});

//createUser('anton', 'fffs');
retrieveUser(0, 'Anton');
/* End of callback */
});

/* Users JavaScript file */


/* Functions */
function createUser(name, key){
  if(key == 'saved'){
    key = retrieveKey();
  }

  let userObject = {
    name: name,
    key: key
  };

  let strObj = JSON.stringify(userObject);

  /* Add the user to the API using the addBook function */
  addBook('user', strObj);
  printMsg('User created with name '+name+' and key '+key,'success');
}

/* Function to retrieve a user */
/* Function to retrieve books */
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
        console.log(retrieveUserRequest.readyState);
        console.log(retrieveUserRequest.status);
        console.log(retrieveUserRequest.responseText);
        if (retrieveUserRequest.readyState === 4 && retrieveUserRequest.status === 200) {

            /* Always parse responseData */
            let responseData = JSON.parse(retrieveUserRequest.responseText);

            /* If the API returns error */
            if(responseData.status == "error"){
              /* Try to retrieve user again, plus one to counter */
              retrieveUser(counter+1);

              /* Print errormessage */
              console.log(responseData.message);
              increaseFailed();
            } else {
              /* THE REQUEST IS SUCCESSFUL, WE HAVE RETRIEVED THE DATA */

              /* Iterate through JavaScript object with for loop */
              let userCount = 0;
              let bookCount = 0;

              for(let i = 0; i < responseData.data.length; i++){

                /* If the JavaScript data is a book. Ignore it! */
                if(responseData.data[i].title != 'user'){
                  bookCount++;
                } else {
                  /* If the data is a user! */
                  /* Convert userData to JavaScript object */
                  let userObject = JSON.parse(responseData.data[i].author);
                  console.log(userObject.key);
                  userCount++;
                }
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

    retrieveUserRequest.open('GET', `https://www.forverkliga.se/JavaScript/api/crud.php?op=select&key=${retrieveKey()}`);
    retrieveUserRequest.send();
  }
}
