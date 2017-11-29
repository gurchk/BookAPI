window.addEventListener('load', function (event) {
    const bookApiInput = document.getElementById('bookApiInput');
    const bookApiBtn = document.getElementById('bookApiBtn');
    const bookReq = new XMLHttpRequest();
    const bookLog = document.getElementById('bookLog');
    const bookApi = document.getElementById('bookApi');
    const topBookLog = document.getElementById('topBookLog');
    const docLog = document.getElementById('docLog')

    bookApiBtn.addEventListener('click', function (event) {
        if (bookApiInput.value != "") {
            var value = bookApiInput.value;
            value = insertPlus(value);
            refreshSearch();
        } else {
            bookApi.innerHTML += "<strong>Please enter a string</strong>";
        }
        bookReq.onreadystatechange = function (event) {
            if (bookReq.readyState = 4) {
                const ans = JSON.parse(bookReq.responseText);
                const num_found = ans.num_found;
                let headerElement = document.createElement("li");
                headerElement.innerHTML = `<span>Title</span><span>Author</span><span>Date</span>`
                docLog.appendChild(headerElement);

                for (let i = 0; i < 12; i++) {
                    let newElement = document.createElement("li");
                    console.log(ans);

                    /* If the book has a subtitle, display it aswell! */
                    let bookTitle = ans.docs[i].title;
                    if(ans.docs[i].subtitle != undefined){
                      bookTitle += (' - ' + ans.docs[i].subtitle);
                    }

                    newElement.innerHTML = `<span>${bookTitle}</span><span>${ans.docs[i].author_name[0]}</span><span>${ans.docs[i].first_publish_year}</span><button addbooker="true" class="addFromLibrary animateBtn" ></button>`

                    /* Append the search result */
                    docLog.appendChild(newElement);

                    /* Add EventListeners to the result */
                    for (let item of docLog.children) {
                        btnAddEventListeners(item);
                    }
                }

            }
        }
        bookReq.open('GET', `https://openlibrary.org/search.json?q=${value}`);
        bookReq.send();
    })

})

// Functions


function refreshSearch() {
    const docLog = document.getElementById('docLog')
    docLog.innerHTML = null;
}

function insertPlus(aString) {
    return aString.split(" ").join("+");
}

function addToTop(title, author, uniqueID) {
    const libraryDiv = document.getElementById('library');

    const topElement = document.createElement("div");
    topElement.innerHTML = '<span class="spanID"><i class="fa fa-refresh fa-spin fa-2x"></i></span> <hr> <span>' + title + '</span> <hr> <span>' + author + '</span> <hr> <button pen="true" class="libraryRemoveBtn hoverGold"><i class="fa fa-pencil" aria-hidden="true"></i></button><button expand="true" class="hoverGrey libraryRemoveBtn"><i class="fa fa-expand" aria-hidden="true"></i></button><button rmvBtn="true" class="libraryRemoveBtn"><i class="fa fa-times" aria-hidden="true"></i></button>';
    libraryDiv.insertBefore(topElement, libraryDiv.children[1]);
    btnAddEventListeners(libraryDiv.children[1]);
    libraryDiv.children[1].setAttribute('class', "newIn")
    libraryDiv.children[1].setAttribute('uniqueID', uniqueID);

    for (let book of libraryDiv.children) {
        if (book.getAttribute('uniqueID') == uniqueID) {
            setTimeout(function () {
                book.removeAttribute('class', 'newIn')
            }, 2500);
        } else {
            console.log('Pfft, almost removed another msgDiv than original!');
        }
    }
}

function bookAdd(event) {
    let author = event.target.previousSibling.previousSibling.innerText;
    let title = event.target.previousSibling.previousSibling.previousSibling.innerText;
    let target = event.target;
    let uniqueID = guid();
    target.setAttribute('class', 'onclic animateBtn addFromLibrary');
    setTimeout(function () {
        target.removeAttribute('class', "onclic");
        target.setAttribute('class', 'afterClick');
        addBook(0, title, author);
        addToTop(title, author, uniqueID);
    }, 1500)
}


function getPicUrl(isbn) {
    return `http://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`
}
let getBookInfo = function (event) {
    let listItem = event.target.parentNode;

    if (event.target.nodeName == 'I') {
        listItem = listItem.parentNode;
    }

    let title = listItem.children[2].innerText



    /* End of settings */

    fetch(`http://openlibrary.org/search.json?title=${title}&jscmd=details`)
        .then((response) => {
            let resp = response.json();
            console.log(resp);
            return resp;
        }).then(function (response) {
            response = response.docs[0];
            console.log(response);
            let bookUrl = getPicUrl(response.isbn[0])
            let bookObj = {
                bookUrl: bookUrl,
                theme: response.subject != undefined ? response.subject[0] : 'Not found',
                first_sentance: response.first_sentence != undefined ? response.first_sentence[0] : 'Not found',
                title: response.title,
                author: response.author_name[0] ,
                excerpt: response.first_publish_year,
                pages: response.text.length,
                isbn: response.isbn[1],
                year: response.first_publish_year,
                lang: response.language != undefined ? response.language : 'Not found',
                find: false,
            };

            expandBookInfo(event, bookObj);
            /* Settings */
            // let myHeaders = new Headers();
            // myHeaders.append('Accept', 'application/json');
            //
            // var fetchSettings = { method: 'GET',
            //                headers: myHeaders,
            //                mode: 'cors',
            //                cache: 'default' };
            //                console.log(bookObj.isbn);
            // fetch('https://reststop.randomhouse.com/resources/titles/' + 9781400079148 ,fetchSettings)
            // .then((respo) => {
            //   let resp = respo.json();
            //   return resp;
            // })
            // .then(function (response) {
            //   if (bookUrl != 'undefined') {
            //       bookObj.find = true;
            //       expandBookInfo(event, bookObj);
            //   } else {
            //       expandBookInfo(event, bookObj);
            //   }
            // });


        });
}
