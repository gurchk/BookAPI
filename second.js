  window.addEventListener('load', function (event) {
  const libraryDiv = document.getElementById('library');

console.log('Total requests so far: ' + totalRequests());
  /* Adding eventListener to all listItems */
  for(let listItem of libraryDiv.children){
    btnAddEventListeners(listItem);
  }

  document.getElementById('fetchBooks').addEventListener('click', function(){
    retrieveBooks(0);
  });
  //Uncomment to retrieve books on load.
  //retrieveBooks(0);

/* End of callback */
});

/* Adding eventListeners to the buttons */
function btnAddEventListeners(listItem){
  for(let element of listItem.children){
    if(element.nodeName == 'BUTTON'){
      if(element.getAttribute('pen') != undefined){

        /* Add eventListener for function editBook*/
        element.addEventListener('click', editBook);

      } else if(element.getAttribute('rmvBtn') != undefined) {

        /* Add eventListener for function removeBook*/
        element.addEventListener('click', removeBook);

      } else if(element.getAttribute('refresh') != undefined){
        /* Add eventListener for function refreshStats*/
        element.addEventListener('click', displayStats);
      }
    }
  }
}
/* Add fetchBooks eventListener */


/* Function to retrieve books */
function retrieveBooks(counter){
  console.log('COUNTER IS NOW: '+counter);
  if(counter > 10){
    printMsg('Failed after 10 retries.', 'error');
    return;
  } else {

    const retrieveBooksRequest = new XMLHttpRequest();

    retrieveBooksRequest.onreadystatechange = function(event) {
        console.log(retrieveBooksRequest.readyState);
        console.log(retrieveBooksRequest.status);
        console.log(retrieveBooksRequest.responseText);
        if (retrieveBooksRequest.readyState === 4 && retrieveBooksRequest.status === 200) {

          /* Failed after 20 retries */
            let responseData = JSON.parse(retrieveBooksRequest.responseText);
            if(responseData.status == "error"){
              /* Try to retrieve books again, plus one to counter */

              retrieveBooks(counter+1);

              /* Print errormessage */
              console.log(responseData.message);
              console.log('Error - Log in if');
              increaseFailed();
            } else {
              console.log('Success - Log in else');
              /* If the status is success, create JavaScript object */
              let responseData = JSON.parse(retrieveBooksRequest.responseText);
              console.log('Length of responsedata.length is: '+ responseData.data.length);
              /* Iterate through JavaScript object with for loop */
              for(let i = 0; i < responseData.data.length; i++){
                console.log('Calling displayBooks function for the '+(i+1)+'th time.')
                displayBooks(responseData.data[i].id,responseData.data[i].title,responseData.data[i].author,responseData.data[i].updated);
              }
              console.log(retrieveBooksRequest.status);
              increaseSuccess();
              printMsg('Successfully retrieved the books on the '+(counter+1)+'th try.', 'success');
              if(responseData.data.length == 0){
                printMsg('No books found!', 'warning');
              }
            }
        }
    }

    retrieveBooksRequest.open('GET', `https://www.forverkliga.se/JavaScript/api/crud.php?op=select&key=${retrieveKey()}`);
    retrieveBooksRequest.send();
  }
}

/* Add books to DOM */
function displayBooks(id, title, author, updated){

  let listItem = document.createElement('div');

  listItem.innerHTML = '<span class="spanID">'+id+'</span> <hr> <span>'+title+'</span> <hr> <span>'+author+'</span> <hr> <button rmvBtn="true" class="libraryRemoveBtn"><i class="fa fa-times" aria-hidden="true"></i></button><button pen="true" class="libraryRemoveBtn"><i class="fa fa-pencil" aria-hidden="true"></i></button>'

  const libraryDiv = document.getElementById('library');

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
    printMsg('The book already exists!', 'warning');
    console.log('This book already exists');
  }
}

/* Function to edit a book */
function editBook(event){

}

/* Function to remove a book */
function removeBook(event){

  let parent = event.target.parentNode;
  let libraryDiv = document.getElementById('library');
  /* Parent should always be the listItem */
  if(event.target.nodeName == 'I'){
    parent = event.target.parentNode.parentNode;
  }

  console.log('This is supposed to be bookID: '+ parent.children[0].innerText)
  let bookID = parent.children[0].innerText;
  console.log('BookID is: '+ bookID)

  console.log('UNDEFINED?!?'+parent.parentNode.getAttribute('id'));
  libraryDiv.removeChild(parent);


  /* REMOVE THE BOOK FROM THE API */
  removeBookFromApi(bookID, 0);

}

/* Function to remove the book from the api */
function removeBookFromApi(bookID,counter){
  if(counter >= 10){
    printMsg('Failed to remove book after 10 retries.', 'error');
  } else {

    /* REMOVE THE BOOK FROM THE API */
    const removeBookRequest = new XMLHttpRequest();

    removeBookRequest.onreadystatechange = function(event) {
        if (removeBookRequest.readyState === 4 && removeBookRequest.status === 200) {
            responseData = JSON.parse(removeBookRequest.responseText);

            if(responseData.status == 'error'){
              printMsg('Failed to remove book from the API, trying again.', 'error');
              console.log(responseData.message);

              return removeBookFromApi(bookID,counter+1);

            } else {
              printMsg('Book removed from the API', 'success');
              console.log(responseData.status);
            }
        }
    }

    removeBookRequest.open('GET', `https://www.forverkliga.se/JavaScript/api/crud.php?op=delete&key=${retrieveKey()}&id=${bookID}`);
    removeBookRequest.send();

  }
}

/* Statistics functions for API-requests. */

function increaseSuccess(){
  let storageRequests = localStorage.getItem('successRequests');

  if(storageRequests == undefined || isNaN(storageRequests)){
    localStorage.setItem('successRequests', 1);
  } else {
    localStorage.setItem('successRequests', parseInt(storageRequests)+1);
  }

  console.log(storageRequests);
}

function increaseFailed(){
  let storageRequests = localStorage.getItem('failedRequests');
  if(storageRequests == undefined || isNaN(storageRequests)){
    localStorage.setItem('failedRequests', 1);
  } else {
    localStorage.setItem('failedRequests', parseInt(storageRequests)+1);
  }
}
function totalRequests(){
  let failedRequests = localStorage.getItem('failedRequests');
  let successRequests = localStorage.getItem('successRequests');

  console.log(successRequests, failedRequests);

  if(failedRequests == undefined || isNaN(failedRequests)){
    localStorage.setItem('failedRequests', 0);
  }
  if(successRequests == undefined || isNaN(successRequests)) {
    localStorage.setItem('successRequests', 0);
  }
  return (failedRequests-0) + (successRequests-0);
}
