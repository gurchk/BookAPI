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
    })
    
})
