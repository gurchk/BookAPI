window.addEventListener('load', function(){
  //addDetailedStats();
});

function increaseStat(type = 'success', message = 'None specified'){

  let reqList = localStorage.getItem('requestsList');
  if(reqList == undefined){
    let obj = {
      id: guid(),
      type: 'First',
      message: 'First input',
      time: Date().toString()
    }
    let list = new Array();

    list.push(obj);

    list = JSON.stringify(list);

    localStorage.setItem('requestsList', list);
  }
  /* Turn it into a JavaScript Object */
  reqList = JSON.parse(reqList);
  console.log('RequestMessages in database: ' + reqList.length);
  console.log(reqList);
  let statsObject = {
    id: guid(),
    type: type,
    message: message,
    time: Date().toString()
  }

  reqList.push(statsObject);

  localStorage.setItem('requestsList', JSON.stringify(reqList));

}

function addDetailedStats() {

    /* Display Detailed Stats Header under total stats */
    let detailedHeaderStats = document.createElement('div');
    detailedHeaderStats.innerHTML = '<h3>Detailed Request Stats</h3>';
    detailedHeaderStats.className = 'detailedHeader';

    let detailedHeader = document.createElement('div');
    detailedHeader.innerHTML = '<span class="spanID">ID</span> <hr> <span>Type</span> <hr> <span>Message</span> <hr> <span>Time</span>';
    detailedHeader.className = 'detailedHeader';

    /* Append it in the Library */
    let libraryDiv = document.getElementById('library');
    libraryDiv.appendChild(detailedHeaderStats);
    libraryDiv.appendChild(detailedHeader);

    /* Add stats */
    addDetailedStatsItems();
}

function addDetailedStatsItems(startIndex = 0, endIndex = 20){
  let libraryDiv = document.getElementById('library');
  let requestList = localStorage.getItem('requestsList')

  requestList = JSON.parse(requestList);

  for(let i = startIndex; i < requestList.length; i++){
    let requestObj = requestList[i];

    let listItem = document.createElement('div');
    listItem.innerHTML = '<span stats="true" class="spanID">' + requestObj.id + '</span> <hr> <span>' + requestObj.type + '</span> <hr> <span>' + requestObj.message +
    '</span> <hr> <span>'+ requestObj.time+ '</span>'
    listItem.setAttribute('detailedStat', 'true');

    libraryDiv.appendChild(listItem);

    if(i > endIndex){
      i = requestList.length;
    }
  }


  /* Add next page */
  if(document.getElementsByClassName('detailedHeader nextPage').length == 0){
    if(endIndex < requestList.length){
      let nextPage = document.createElement('div');
      nextPage.innerHTML = '<h3>Next page</h3>';
      nextPage.className = 'detailedHeader nextPage';
      nextPage.style.cursor = 'pointer';
      /*Append it */
      libraryDiv.appendChild(nextPage);

      /* Add a eventListener*/
      nextPage.addEventListener('click', function(event){
        removeDetailedStats();
        addDetailedStatsItems(startIndex+20, endIndex+20);
      });
    }
  } else {
    /* Remove it to replace it */
    let node = document.getElementsByClassName('detailedHeader nextPage')[0];
    let parent = node.parentNode;
    parent.removeChild(node);
    /* Let's see what to add now! */

    if(endIndex >= requestList.length){

      let nextPage = document.createElement('div');
      nextPage.innerHTML = '<h3>Previous page </h3>';
      nextPage.className = 'detailedHeader nextPage';
      nextPage.children[0].style.cursor = 'pointer';

      /*Append it */
      libraryDiv.appendChild(nextPage);

      let prevPageBtn = nextPage.children[0];
      /* Add eventListeners */
      prevPageBtn.addEventListener('click', function(){
        removeDetailedStats();
        addDetailedStatsItems(startIndex-20, endIndex-20);
      });

   } else if(startIndex > 0) {

      let nextPage = document.createElement('div');
      nextPage.innerHTML = '<h3>Previous page </h3><hr><h3> Next page</h3>';
      nextPage.className = 'detailedHeader nextPage';
      nextPage.children[0].style.cursor = 'pointer';
      nextPage.children[2].style.cursor = 'pointer';
      /*Append it */
      libraryDiv.appendChild(nextPage);

      let prevPageBtn = nextPage.children[0];
      let nextPageBtn = nextPage.children[2];
      /* Add eventListeners */
      prevPageBtn.addEventListener('click', function(){
        removeDetailedStats();
        addDetailedStatsItems(startIndex-20, endIndex-20);
      });
      nextPageBtn.addEventListener('click', function(){
        removeDetailedStats();
        addDetailedStatsItems(startIndex+20, endIndex+20);
      });


    } else if(endIndex < requestList.length){
      let nextPage = document.createElement('div');
      nextPage.innerHTML = '<h3>Next page</h3>';
      nextPage.className = 'detailedHeader nextPage';
      nextPage.style.cursor = 'pointer';
      /*Append it */
      libraryDiv.appendChild(nextPage);

      /* Add a eventListener*/
      nextPage.addEventListener('click', function(event){
        removeDetailedStats();
        addDetailedStatsItems(startIndex+20, endIndex+20);
      });
    }
  }






}

function removeDetailedStats(){
  let libraryDiv = document.getElementById('library');

  for(let i = libraryDiv.children.length-1; i >= 0; --i){
      if(libraryDiv.children[i].getAttribute('detailedStat') != undefined){
        libraryDiv.removeChild(libraryDiv.children[i]);
      }
  }
}

function exportLocalStats(){

  /* Get localStorage object */
  let failedRequests = localStorage.getItem('failedRequests');
  let successRequests = localStorage.getItem('successRequests');

  /* Some checks */
  if (failedRequests == undefined || isNaN(failedRequests)) {
      localStorage.setItem('failedRequests', 3000);

  } else if(successRequests == undefined || isNaN(successRequests)){
      localStorage.setItem('successRequests', 2700);

  }

  /* Start by getting the ID of object [0] */
  recursiveFetch('https://www.forverkliga.se/JavaScript/api/crud.php?op=select&key='+retrieveStatsKey())
  .then(responseData => {
    console.log(responseData);
    /* Return the ID */
    increaseStat('success', 'Exported local stats to API');
    return responseData.data[0];
  }).then(dataObj => {
    let dataID = dataObj.id;

    /* Parse the StatsObject */
    dataObj = JSON.parse(dataObj.author);

    /* Print it to the console */
    console.log('JavaScript OBJECT: ',dataObj);

    /* Modify the stats here */
      dataObj.successful = (dataObj.successful - 0) + (successRequests-0);
      dataObj.failed = (dataObj.failed -0) + (failedRequests-0);
    /* Reset local Stats */
    localStorage.setItem('successRequests', 1);
    localStorage.setItem('failedRequests', 1);

      let inObj = JSON.stringify(dataObj);

      recursiveFetch('https://www.forverkliga.se/JavaScript/api/crud.php?op=update&key='+retrieveStatsKey()+'&id='+dataID+'&title=stats'+'&author='+inObj)
      .then(successMessage => {
        console.log(successMessage);
      }).catch(failedMessage => {
        console.log(failedMessage);
        increaseStat('failed', failedMessage.message);
      });
  });
}
