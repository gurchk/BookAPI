window.addEventListener('load', function (event) {

    const requestAPIbtn = document.getElementById('requestAPI');

    requestAPIbtn.addEventListener('click', function (event) {
        const requestedAPI = new XMLHttpRequest();
        const log = document.getElementById('apiKEY');
        let ourNiceKey = null;

        requestedAPI.onreadystatechange = function(event) {
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

      /* Testing addBook */
      addBook('hi', 'bye');

});

/* Functions */

function saveKey(){

  /* Declare constant apiVariable */
  const apiKeyValue = document.getElementById('apiKEY').innerText;

  /* Save the key to local storage */
  localStorage.setItem('apiKey', apiKeyValue);


}

function retrieveKey(){

  /* Retrieve apiKey */
  return localStorage.getItem('apiKey');
}

function addBook(title, author){

      const addBookRequest = new XMLHttpRequest();
      let responseText = null;
      addBookRequest.onreadystatechange = function(event) {
          if (addBookRequest.readyState === 4) {
              responseText = JSON.parse(addBookRequest.responseText);
              console.log(responseText.status);
              console.log(responseText.id);
          }
      }
      
      addBookRequest.open('GET', `https://www.forverkliga.se/JavaScript/api/crud.php?op=insert&key=${retrieveKey()}&title=${title}&author=${author}`);
      addBookRequest.send();
}
