window.addEventListener('load', function (event) {
  const libraryDiv = document.getElementById('library');


  /* Adding eventListener to all listItems */
  for(let listItem of libraryDiv.children){
    btnAddEventListeners(listItem);
  }

  document.getElementById('fetchBooks').addEventListener('click', retrieveBooks);
  retrieveBooks();


  statsEdit(4,2,2);

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
      }
    }
  }
}
/* Add fetchBooks eventListener */


/* Function to retrieve books */
function retrieveBooks(event){
  const retrieveBooks = new XMLHttpRequest();

  retrieveBooks.onreadystatechange = function(event) {
      if (retrieveBooks.readyState === 4 && retrieveBooks.status === 200) {

          /*JavaScript object from JSON data */
          let responseData = JSON.parse(retrieveBooks.responseText);
          if(retrieveBooks.status == 'error'){
            /* Print errormessage */
            console.log(retrieveBooks.message);

          } else {

            /* Iterate through JavaScript object with for loop */
            for(let i = 1; i < responseData.data.length; i++){
              displayBooks(responseData.data[i].id,responseData.data[i].title,responseData.data[i].author,responseData.data[i].updated);
            }
            console.log(retrieveBooks.status);
          }
      }
  }

  retrieveBooks.open('GET', `https://www.forverkliga.se/JavaScript/api/crud.php?op=select&key=${retrieveKey()}`);
  retrieveBooks.send();

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
    console.log('This book already exists!');
  }
}

/* Function to edit a book */
function editBook(event){

}

/* Function to remove a book */
function removeBook(event){

  let parent = event.target.parentNode;
  let bookID = parent.children[0].innerText;
  parent.parentNode.removeChild(parent);


  /* Function to remove from api */
  const removeBookRequest = new XMLHttpRequest();
  let responseText = null;

  removeBookRequest.onreadystatechange = function(event) {
      if (removeBookRequest.readyState === 4 && removeBookRequest.status === 200) {
          responseText = JSON.parse(removeBookRequest.responseText);
          if(responseText.status == 'error'){
            console.log(responseText.message);
          } else console.log(responseText.status);
      }
  }

  removeBookRequest.open('GET', `https://www.forverkliga.se/JavaScript/api/crud.php?op=delete&key=${retrieveKey()}&id=${bookID}`);
  removeBookRequest.send();

}


/* Statistics functions */
