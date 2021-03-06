  window.addEventListener('load', function (event) {
      const libraryDiv = document.getElementById('library');

      console.log('Total requests so far: ' + totalRequests());
      /* Adding eventListener to all listItems */
      for (let listItem of libraryDiv.children) {
          btnAddEventListeners(listItem);
      }

      document.getElementById('fetchBooks').addEventListener('click', function () {
          removeBooksFromLibrary();
          retrieveBooks(0);
      });
      //Uncomment to retrieve books on load.
      //retrieveBooks(0);

      /* End of callback */
      //createStatsObject();
  });


  /* Adding eventListeners to the buttons */
  function btnAddEventListeners(listItem) {
      for (let element of listItem.children) {
          if (element.nodeName == 'BUTTON') {
              if (element.getAttribute('pen') != undefined) {

                  /* Add eventListener for function editBook*/
                  element.addEventListener('click', editBookInputFields);

              } else if (element.getAttribute('rmvBtn') != undefined) {

                  /* Add eventListener for function removeBook*/
                  element.addEventListener('click', removeBook);

              } else if (element.getAttribute('refresh') != undefined) {

                  /* Add eventListener for function refreshStats*/
                  element.addEventListener('click', displayStats);
              } else if (element.getAttribute('expand') != undefined) {

                  /* Add eventListener for function refreshStats*/
                  element.addEventListener('click', getBookInfo);
              } else if (element.getAttribute('addbooker') != undefined) {

                  /* Add eventListener for function refreshStats*/
                  element.addEventListener('click', bookAdd);
              } else if (element.getAttribute('upload') != undefined) {

                  /* Kolla om den är true/false */
                  if (element.getAttribute('upload') == 'true') {
                      /* Add eventListener for function uploadKey*/
                      element.addEventListener('click', userUploadKey);
                  } else {
                      /* Add eventListener for function refreshStats*/
                      element.addEventListener('click', unlockProtected);
                  }

              }
          } else if (element.className == 'userKey') {
              if (element.children[0] != undefined) {

                  /* Means it contains a button */
                  element.children[0].addEventListener('click', unlockProtected);

                  /* Add mouseEnter event and mouseLeave */
                  element.children[0].addEventListener('mouseenter', changeUnlockIcon);
                  element.children[0].addEventListener('mouseleave', changeUnlockIcon);
              }
          } else if (element.nodeName == 'SPAN' && localStorage.getItem('editWhenPressed') == 'true'){
              if(element.children[0] != undefined){
                element.children[0].addEventListener('click', function(event){
                  editBookInputFields(event, true);
                });
              }
          }
      }
  }

  function editBookInputFields(event, onText) {
      let listItem = event.target.parentNode;
      let target = event.target;

      if(listItem == null){
        return;
      }
      /* If you click the I or OnText, Fix */
      if(event.target.nodeName == 'I') {
        listItem = event.target.parentNode.parentNode;
        target = target.parentNode;
      } else if(onText){

          listItem = listItem.parentNode;
          console.log('ListItem after change is now: '+listItem.innerHTML);
          console.log('Target after change is now: '+target.innerHTML);
      }



      /* Title Variables */
      let titleSpan = listItem.children[2];
      let titleText = titleSpan.innerText;

      /* Author variables */
      let authorSpan = listItem.children[4];
      let authorText = authorSpan.innerText;

      /* True / False variable */
      let changedTitle = true;
      if(onText){
        /* Figure out which text was clicked. */
        console.log('is this true?'+event.target.innerHTML);
        /* Change correct field to input Field */
        if(titleSpan.innerHTML == '<p>'+event.target.innerText+'</p>'){
          titleSpan.innerHTML = '<input class="inputPassword" type="text" value="' + titleText + '" placeholder="Enter a title..">';
          titleSpan.children[0].focus();

        } else {
          authorSpan.innerHTML = '<input class="inputPassword" type="text" value="' + authorText + '" placeholder="Enter an authors name..">';
          authorSpan.children[0].focus();
          changedTitle = false;
        }
      } else {
        titleSpan.innerHTML = '<input class="inputPassword" type="text" value="' + titleText + '" placeholder="Enter a title..">';
        titleSpan.children[0].focus();

        authorSpan.innerHTML = '<input class="inputPassword" type="text" value="' + authorText + '" placeholder="Enter an authors name..">';
      }
      /* Change title to input field */




      /* Change the icon to a save icon */
      console.log('So faR soo good? '+authorText,titleText);
      if(!onText){
        target.innerHTML = '<i save="true" class="fa fa-floppy-o" aria-hidden="true"></i>';
      }



      // This will always only be one or two. Two in this case.
      let inputFields = document.getElementsByClassName('inputPassword');

      /* Verify inputs before saving / Add eventListener to correct input field.*/
      if(onText){
        inputFields[0].addEventListener('keyup', verifyInput);
      } else {
        inputFields[0].addEventListener('keyup', verifyInput);
        inputFields[1].addEventListener('keyup', verifyInput);
      }



      /* Remove old eventListener and add a new one. */
      console.log('Inner html of target is: ' + target.innerHTML);


      target.removeEventListener('click', editBookInputFields);


      function onTextTemp(event){
                    /* Create the actual values from inside the listItem */
                    let bookID = listItem.children[0].innerText;
                    let title = inputFields[0].value;
                    let author = listItem.children[4].innerText;

                    console.log('author shit '+ title, author, bookID);

                      editBook(bookID, title, author);
                      /* Change the eventListener back aswell! */
                      console.log('Target is: ' + target.innerHTML);
                      target.addEventListener('click', editBookInputFields);
                      /* And remove the old one */
                      target.removeEventListener('click', onTextTemp);

                      inputFields[0].parentNode.innerHTML = '<p>'+inputFields[0].value+'</p>';
                      //inputFields[0].parentNode.innerHTML = '<p>'+inputFields[0].value+'</p>';

                      btnAddEventListeners(listItem);

      }
      /* SAVE ICON EVENT LISTENER BELOW */
      /* SAVE ICON EVENT LISTENER BELOW */
      /* SAVE ICON EVENT LISTENER BELOW */

      /* Save the input, and modify the old book data */
      if(onText){

        inputFields[0].addEventListener('change', onTextTemp);
        //inputFields[1].addEventListener('change', onTextTemp);

      } else {
      target.addEventListener('click', function tempFunction(event) {


          /* Create the actual values from inside the listItem */
          let bookID = listItem.children[0].innerText;
          let title = inputFields[0].value;
          let author = inputFields[1].value;




          /* Making some checks to the values */
          let change = true;

          if (titleText == title && authorText == author) {
              /* No change check */
              printMsg('No change was made!', 'warning');
              change = false;
              /* Verify the inputs with a function. The function prints messages. */
          } else {
              editBook(bookID, title, author);
          }
          // } else if(verifyInput(inputFields[1]) && verifyInput(inputFields[0])){
          //   printMsg('Saving','success');

          //   accepted = true;
          // }

          if (change) {
              inputFields[0].parentNode.innerHTML = inputFields[0].value;
              inputFields[0].parentNode.innerHTML = inputFields[0].value;
          } else {
              inputFields[0].parentNode.innerHTML = titleText;
              inputFields[0].parentNode.innerHTML = authorText;
          }


          /* Remove input fields, set back to the value */

          /* If we change [0] first the [1] is now actually [0]

          This would actually work: (lmfao).

          inputFields[0].parentNode.innerHTML = inputFields[0].value;
          inputFields[0].parentNode.innerHTML = inputFields[0].value;

          */


          /* Change the icon back to a pencil icon */

          /* If you click the I fix icon.*/
          let target = event.target;
          if(event.target.nodeName == 'I'){
            target = target.parentNode;
          }

            target.innerHTML = '<i class="fa fa-pencil" aria-hidden="true"></i>';
            /* Change the eventListener back aswell! */
            target.addEventListener('click', editBookInputFields);
            /* And remove the old one */
            target.removeEventListener('click', tempFunction);
      });

    }

  }

  /* Advanced check for input field. This takes a HTML object as parameter.*/
  function verifyInput(event, minLength = 3, maxLength = 32, notEvent) {
      if (notEvent) {
          console.log('This ran outside an event.');
      }


      /* Make some checks. */

      if (event.target.value.length < minLength) {

      /* Field less than 3 characters */
      setInputMessage(event.target, 'Input too short', 'error');

      } else if (event.target.value.length > maxLength) {

      /* Field longer than 3 characters */
      setInputMessage(event.target, 'Input too long', 'error');

      } else {

      /* Field is good! */
      setInputMessage(event.target, 'Input is good!', 'success');
      }
  }



  function setInputMessage(inputObj, message, type){
    let messageObj = document.createElement('span');
    let parent = inputObj.parentNode;
    let typeClass = 'inputError';
    let icon = 'fa-times';

    if(type == 'success'){
      typeClass = 'inputSuccess';
      icon = 'fa-check';
      messageObj.setAttribute('success', 'true');
    } else if(type == 'error'){
      typeClass = 'inputError';
      icon = 'fa-times';
      messageObj.setAttribute('error', 'true');
    } else if(type == 'info'){
      typeClass = 'inputInfo';
      icon = 'fa-info';
      messageObj.setAttribute('info', 'true');
    }

    messageObj.innerHTML = '<span class="'+typeClass+'"><i class="fa '+icon+'"></i><span class="hoverText">'+message+'</span></span>';

    /* Check if last object is error, or succes. Then remove it and append new message */
    if(parent.lastChild.getAttribute('success') != undefined || parent.lastChild.getAttribute('error') != undefined || parent.lastChild.getAttribute('info') != undefined){
      parent.removeChild(parent.lastChild);
      parent.appendChild(messageObj);

      /* Else if, last object is event.target, we append anyway! */
    } else if(parent.lastChild == inputObj){
      parent.appendChild(messageObj);
      console.log('WE ARE THE LAST OBJECT');
    }
  }

  /* Add fetchBooks eventListener Searchid: 42D*/
  function expandBookInfo(event, bookObj) {

      let listItem = event.target.parentNode;
      /* Chrome on click I fix. */
      if(event.target.nodeName == 'I'){
        listItem = listItem.parentNode;
      }
      let bookID = listItem.children[0].innerText;
      let title = listItem.children[2].innerText;
      let author = listItem.children[4].innerText;


      /* Check inputs */
      if(bookObj.lang == undefined){
        bookObj.lang = 'Not found';
      }
      if(bookObj.year == undefined){
        bookObj.year = 'Not found';
      }
      if(bookObj.bookUrl == undefined){
        bookObj.bookUrl = 'Not found';
      }

      let oldListItem = listItem.innerHTML;

      /* Limit text, this should be based on screenWidth! */
      let bookDescription = bookObj.description;

      listItem.innerHTML =
      '<div class="expandedObject">'+
        '<div>'+
          '<img src="'+bookObj.bookUrl+'"></img>'+
          '<div><div class="bookDescription"><p>'+bookDescription+'</p></div>'+
          '<span class="readMore">... read more</span></div>'+ // First div.
        '</div>'+
        '<hr>'+ // Divider
        '<div>'+
          '<h3><strong>Written by:</strong> '+bookObj.author+'</h3>'+ // Second div.
          '<h3><strong>Title:</strong> '+bookObj.title+'</h3>'+ // Second div.
          '<h3><strong>Published:</strong> '+bookObj.year+'</h3>'+
          '<h3><strong>Pages:</strong> '+bookObj.pages+'</h3>'+ // Second div.
        '</div>'+
        '<hr>'+ // Divider
        '<div>'+
          '<div>'+ // Third div.
            '<h3><strong>Language:</strong> '+bookObj.lang+'</h3>'+
            '<h3><strong>BookID:</strong> '+bookID+'</h3>'+
            '<h3><strong>Isbn:</strong> '+bookObj.isbn+'</h3>'+
          '</div>'+
          '<div>'+
            '<button minimize="true" class="hoverGold"><i class="fa fa-window-minimize"></i></button>'+ // Minimize button
            '<button class="trashcan"><i class="fa fa-trash fa-lg"></i></button>'+ // Remove Button
          '</div>'+
        '</div>'+
      '</div>';


      let buttonDiv = listItem.children[0].lastChild.lastChild // This is the buttonDiv

      /* This also adds eventListeners to readMore! */
      addButtonDivEventListeners(buttonDiv, listItem, oldListItem, bookID, bookObj);
      addReadMoreListeners(bookObj, bookID, oldListItem);
  }

function addButtonDivEventListeners(buttonDiv, listItem, oldListItem, bookID, bookObj){
  for(let button of buttonDiv.children){
    if(button.getAttribute('minimize') != undefined){

      /* Add eventListener */
      button.addEventListener('click',function(){
        listItem.innerHTML = oldListItem;

        btnAddEventListeners(listItem);

        if(bookObj != undefined){
          addReadMoreListeners(bookObj, bookID);
        }
      });

    } else {
      /* Add eventListener */
      button.addEventListener('click', function(event){
        /* PROMT the user. You're about to remove a book. */
        promptRemoveBook(event, listItem, oldListItem, bookID);
      });
    }
  }
}


function addReadMoreListeners(bookObj, bookID, veryOldListItem){

  for(let readMore of document.getElementsByClassName('readMore')){

    readMore.addEventListener('click', function(event){
      let bookDescription = event.target.previousSibling.innerText;
      let listItem = event.target.parentNode.parentNode.parentNode;
      let oldHtml = listItem.innerHTML;

      listItem.innerHTML =
      '<div class="expandedObject">'+
        '<div>'+
          '<div class="inlineImage"><img src="'+bookObj.bookUrl+'"></img>'+
          '<p class="increasedPadding">'+bookDescription+
          '<span class="readLess">Read less</span></p>'+
          '</div>'+// First div.
        '</div>'+
        '<hr>'+ // Divider
        '<div class="expandedAside">'+
          '<div>'+ // Third div.
            '<h3><strong>Written by:</strong> '+bookObj.author+'</h3>'+ // Second div.
            '<h3><strong>Title:</strong> '+bookObj.title+'</h3>'+ // Second div.
            '<h3><strong>Published:</strong> '+bookObj.year+'</h3>'+
            '<h3><strong>Pages:</strong> '+bookObj.pages+'</h3>'+ // Second div.
            '<hr>'+
            '<h3><strong>Language:</strong> '+bookObj.lang+'</h3>'+
            '<h3><strong>BookID:</strong> '+bookID+'</h3>'+
            '<h3><strong>Isbn:</strong> '+bookObj.isbn+'</h3>'+
          '</div>'+
          '<div>'+
            '<button minimize="true" class="hoverGold"><i class="fa fa-window-minimize"></i></button>'+ // Minimize button
            '<button class="trashcan"><i class="fa fa-trash fa-lg"></i></button>'+ // Remove Button
          '</div>'+
        '</div>'+
      '</div>';

      let buttonDiv = listItem.firstChild.lastChild.lastChild;
      /* Takes params: buttonDiv, listItem, oldListItem, bookID, bookObj */
      addButtonDivEventListeners(buttonDiv, listItem, oldHtml, bookID, bookObj);
      addReadLessListeners(oldHtml, bookID, bookObj);
    });
  }
}

  function addReadLessListeners(oldHtml, bookID, bookObj){

  for(let readLess of document.getElementsByClassName('readLess')){

    readLess.addEventListener('click', function(event){
      let listItem = event.target.parentNode.parentNode.parentNode.parentNode.parentNode;
      console.log('FIND THIS:'+listItem.innerHTML);
      listItem.innerHTML = oldHtml;

      let buttonDiv = listItem.parentNode.firstChild.lastChild.lastChild;
      console.log('FIND THIS:' + buttonDiv.innerHTML);
      /* Takes params: buttonDiv, listItem, oldListItem, bookID, bookObj */
      //addButtonDivEventListeners(buttonDiv, listItem, oldHtml, bookID);
      addReadMoreListeners(bookObj, bookID);

      let listItemHtml = '<span class="spanID">' + bookID + '</span> <hr> <span><p>' + bookObj.title + '</p></span> <hr> <span><p>' + bookObj.author + '</p></span> <hr> <button pen="true" class="libraryRemoveBtn hoverGold"><i class="fa fa-pencil" aria-hidden="true"></i></button><button expand="true" class="hoverGrey libraryRemoveBtn"><i class="fa fa-expand" aria-hidden="true"></i></button><button rmvBtn="true" class="libraryRemoveBtn"><i class="fa fa-times" aria-hidden="true"></i></button>';

      addButtonDivEventListeners(buttonDiv, listItem.parentNode, listItemHtml, bookID);

    });
  }
}

  function promptRemoveBook(event, listItem, oldListItem, bookID = 1337){
  /* Chrome fix... */
  let parent = event.target.parentNode;

  if(event.target.nodeName == 'I'){
    parent = parent.parentNode;
  }


  /* Save old innerHtml to return to. */
  let oldHTML = parent.innerHTML;
  parent.innerHTML = '<h3 class="removeBook">Remove this book?</h3><button class="hoverRed">Yes</button> <button class="hoverGold">No</button>';
  parent.lastChild.style.margin = '0';
  /* Add some eventListeners */
  parent.children[1].addEventListener('click', function(){
    removeBookFromApi(bookID);

    /* Function to remove Listitem from view */
    removeListItem(listItem);
  });

  parent.lastChild.addEventListener('click', function(){
    parent.innerHTML = oldHTML;
    addButtonDivEventListeners(parent, listItem, oldListItem);
  });
}
  /* unlockProtected function */

  function removeListItem(listItem){
    shakeElement(listItem);
    setTimeout(function(){
      listItem.parentNode.removeChild(listItem);
    }, 600);
  }

  function unlockProtected(event) {
      let listItem = event.target.parentNode;


      if (event.target.getAttribute('unlock') != undefined) {
          listItem = event.target.parentNode.parentNode;
      }
      let protect = listItem.children[4];
      console.log(listItem.children[4].innerText);


      let inputField = document.createElement('input');
      //inputField.setAttribute('type', 'text');
      protect.innerHTML = '<input class="inputPassword" type="password" placeholder="Enter password..">';
      //listItem.insertBefore(inputField,listItem.children[4]);
      // listItem.removeChild(listItem.children[5].children[0]);
      protect.children[0].focus();
      protectEventListener(protect);
  }

  function verifyHash(passwordValue, listItem) {
      let hashedPassword = md5(passwordValue);
      let listItemHash = listItem.parentNode.children[0].getAttribute('hp');
      return hashedPassword == listItemHash;
  }

  function changeUnlockIcon(event) {
      let i = event.target.children[0];
      if (i.className == 'fa fa-lock') {
          i.className = 'fa fa-unlock';
          i.parentNode.className = 'unlockBtn'
      } else {
          i.className = 'fa fa-lock';
          i.parentNode.className = 'lockBtn'
      }
  }

  /* Function to retrieve books */
  function retrieveBooks(counter = 0) {
      console.log('COUNTER IS NOW: ' + counter);

      /* Change the headers */
      changeLibraryHeader('ID', 'Title', 'Author');

      if (counter > 10) {
          printMsg('Failed after 10 retries.', 'error');
          return;
      } else {

          const retrieveBooksRequest = new XMLHttpRequest();

          retrieveBooksRequest.onreadystatechange = function (event) {
              console.log(retrieveBooksRequest.readyState);
              console.log(retrieveBooksRequest.status);
              console.log(retrieveBooksRequest.responseText);
              if (retrieveBooksRequest.readyState === 4 && retrieveBooksRequest.status === 200) {

                  /* Failed after 20 retries */
                  let responseData = JSON.parse(retrieveBooksRequest.responseText);
                  if (responseData.status == "error") {
                      /* Try to retrieve books again, plus one to counter */
                      retrieveBooks(counter + 1);

                      /* Print errormessage */
                      console.log(responseData.message);
                      increaseFailed();
                      increaseStat('failed', responseData.message);
                  } else {

                      /* THE REQUEST IS SUCCESSFUL, WE HAVE RETRIEVED THE DATA */
                      /* If the status is success, create JavaScript object */
                      let responseData = JSON.parse(retrieveBooksRequest.responseText);

                      /* Iterate through JavaScript object with for loop */
                      let userCount = 0;
                      let bookCount = 0;
                      for (let i = 0; i < responseData.data.length; i++) {

                          /* If the JavaScript data is a user. Ignore it! */
                          if (responseData.data[i].title != 'user') {
                              displayBooks(responseData.data[i].id, responseData.data[i].title, responseData.data[i].author, responseData.data[i].updated);
                              bookCount++;
                          } else {
                              userCount++;
                          }
                      }
                      console.log(retrieveBooksRequest.status);
                      increaseSuccess();
                      increaseStat('success', 'Retrieved books');
                      printMsg('Successfully retrieved ' + bookCount + ' book(s) on the ' + (counter + 1) + 'th try.', 'success');

                      if (bookCount == 0) {
                          printMsg('No books found!', 'warning');
                      }
                      removeStats();
                  }
              }
          }

          retrieveBooksRequest.open('GET', `https://www.forverkliga.se/JavaScript/api/crud.php?op=select&key=${retrieveKey()}`);
          retrieveBooksRequest.send();
      }
  }

  /* Add books to DOM */
  function displayBooks(id, title, author, updated) {
      const libraryDiv = document.getElementById('library');

      /* Check if stats are active, if so, remove it */
      let listItem1 = libraryDiv.children[1];
      removeStats();

      let listItem = document.createElement('div');

      listItem.innerHTML = '<span class="spanID">' + id + '</span> <hr> <span><p>' + title + '</p></span> <hr> <span><p>' + author + '</p></span> <hr> <button pen="true" class="libraryRemoveBtn hoverGold"><i class="fa fa-pencil" aria-hidden="true"></i></button><button expand="true" class="hoverGrey libraryRemoveBtn"><i class="fa fa-expand" aria-hidden="true"></i></button><button rmvBtn="true" class="libraryRemoveBtn"><i class="fa fa-times" aria-hidden="true"></i></button>';



      let exists = false;
      for (let listItem of libraryDiv.children) {
          if (id == listItem.children[0].innerText) {
              exists = true;
          }
      }
      if (!exists) {
          libraryDiv.appendChild(listItem);

          for (let listItem of libraryDiv.children) {
              btnAddEventListeners(listItem);
          }
      } else {
          printMsg('The book already exists!', 'warning');
          console.log('This book already exists');
      }
  }
  /* Function to remove the stats */
  function removeStats() {
      let libraryDiv = document.getElementById('library');
      let listItem = libraryDiv.children[1];

      if (listItem != null) {
          /* There is a listItem under the header, look after stats attribute*/
          if (listItem.children[0].getAttribute('stats') != undefined) {
              libraryDiv.removeChild(libraryDiv.children[1]);
          } else {
            /* There is something else here. */

          }
      }
  }

  function editBook(bookID, title, author, counter) {

      if (counter > 10) {
          return;
      } else {

          /* Make the request to the API */
          let xhr = new XMLHttpRequest();

          xhr.onreadystatechange = function () {

              /* We've got a response! */
              if (xhr.readyState === 4 && xhr.status === 200) {

                  /* Convert JSON to JavaScript object. Save it in responseData */
                  let responseData = JSON.parse(xhr.responseText);

                  if (responseData.status == 'error') {
                      increaseFailed();
                      increaseStat('failed', responseData.message);
                      return editBook(bookID, title, author, counter + 1);
                  } else {
                      increaseSuccess();
                      increaseStat('success', 'Edited book');
                      /* The request was successful! */
                      printMsg('Edit book request was successful', 'success');
                  }
              }
          }

          xhr.open('GET', `https://www.forverkliga.se/JavaScript/api/crud.php?op=update&key=${retrieveKey()}&id=${bookID}&title=${title}&author=${author}`);
          xhr.send();
      }
  }

  /* Function to remove a book */
  function removeBook(event) {

      let parent = event.target.parentNode;
      let libraryDiv = document.getElementById('library');

      /* Parent should always be the listItem */
      if (event.target.nodeName == 'I') {
          parent = event.target.parentNode.parentNode;
      }

      let bookID = parent.children[0];


      libraryDiv.removeChild(parent);


      /* REMOVE THE BOOK FROM THE API, unless it is a statsListItem.  */

      if (bookID.getAttribute('stats') == undefined) {
          if (bookID.getAttribute('user') == undefined) {
              removeBookFromApi(bookID.innerText, 0);
              console.log('Removed book with ID: ' + bookID.innerText);
          } else {
              removeBookFromApi(bookID.innerText, 0, true);
              console.log('Removed user with ID: ' + bookID.innerText);
          }
      } else {
          console.log('Did not remove stats from the api.');
      }

  }

  /* Function to remove the book from the api */
  function removeBookFromApi(bookID, counter, user) {
      if (counter >= 10) {
        if(user){
          printMsg('Failed to remove user after 10 retries.', 'error');
        } else {
          printMsg('Failed to remove book after 10 retries.', 'error');
        }

      } else {

          /* REMOVE THE BOOK FROM THE API */
          const removeBookRequest = new XMLHttpRequest();

          removeBookRequest.onreadystatechange = function (event) {
              if (removeBookRequest.readyState === 4 && removeBookRequest.status === 200) {
                  responseData = JSON.parse(removeBookRequest.responseText);

                  if (responseData.status == 'error') {
                    increaseStat('failed', responseData.message);
                      console.log(responseData.message);
                      return removeBookFromApi(bookID, counter + 1, user);

                  } else {
                    increaseStat('success', 'Removed book from the api');
                      if (user) {
                          printMsg('User removed from the database', 'success');
                      } else {
                          printMsg('Book removed from the database', 'success');
                      }

                      console.log(responseData.status);
                  }
              }
          }

          removeBookRequest.open('GET', `https://www.forverkliga.se/JavaScript/api/crud.php?op=delete&key=${retrieveKey()}&id=${bookID}`);
          removeBookRequest.send();

      }
  }

  /* Statistics functions for API-requests. */

  function increaseSuccess(message, time) {
      let storageRequests = localStorage.getItem('successRequests');

      if (storageRequests == undefined || isNaN(storageRequests)) {
          localStorage.setItem('successRequests', 1);
      } else {
          localStorage.setItem('successRequests', parseInt(storageRequests) + 1);
      }

      if(retrieveStatsKey() != undefined){
        if(message != undefined || time != undefined){
          /* Add stats to api-database */
          addStat(message, time, 'success');
        }
      }
  }

  function increaseFailed(message, time) {
      let storageRequests = localStorage.getItem('failedRequests');
      if (storageRequests == undefined || isNaN(storageRequests)) {
          localStorage.setItem('failedRequests', 1);
      } else {
          localStorage.setItem('failedRequests', parseInt(storageRequests) + 1);
      }

      if(retrieveStatsKey() != undefined){
        if(message != undefined || time != undefined){
          /* Add stats to api-database */
          addStat(message, time, 'failed');
        }
      }
  }

  function createStatsObject(){

    let statsObject = {
      failed: 0,
      successful: 0,
    }

    let strObj = JSON.stringify(statsObject);

    recursiveFetch('https://www.forverkliga.se/JavaScript/api/crud.php?op=insert&key='+retrieveStatsKey()+'&title=stats&author='+strObj)
    .then(response => {
      increaseStat('success', 'Created statsObject in the API');
      printMsg('Stats added to database');
    })
    .catch(responseError => {
      increaseStat('failed', response.message);
      console.log(response.message);
    })
  }

  function totalRequests() {
      let failedRequests = localStorage.getItem('failedRequests');
      let successRequests = localStorage.getItem('successRequests');

      console.log(successRequests, failedRequests);

      if (failedRequests == undefined || isNaN(failedRequests)) {
          localStorage.setItem('failedRequests', 0);
      }
      if (successRequests == undefined || isNaN(successRequests)) {
          localStorage.setItem('successRequests', 0);
      }
      return (failedRequests - 0) + (successRequests - 0);
  }

  /* Guid function */
  function guid() {
      function s4() {
          return Math.floor((1 + Math.random()) * 0x10000)
              .toString(16)
              .substring(1);
      }
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
          s4() + '-' + s4() + s4() + s4();
  }
