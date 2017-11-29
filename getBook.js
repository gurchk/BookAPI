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
                    newElement.innerHTML = `<span>${ans.docs[i].title}</span><span>${ans.docs[i].author_name[0]}</span><span>${ans.docs[i].publish_year[0]}</span><button addbooker="true" class="addFromLibrary animateBtn" ></button>`
                    docLog.appendChild(newElement);

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


function getPicUrl(olid) {
    return `http://covers.openlibrary.org/b/olid/${olid}-L.jpg`
}
let getBookInfo = function (event) {
    let listItem = event.target.parentNode;
    /* Chrome on click I fix. */
    if (event.target.nodeName == 'I') {
        listItem = listItem.parentNode;
    }
    let title = listItem.children[2].innerText

    fetch(`https://openlibrary.org/search.json?q=${title}`)
        .then((response) => {
            let resp = response.json();
            return resp;
        }).then(function (svaret) {
            let bookUrl = getPicUrl(svaret.docs[0].edition_key[0])
            let bookObj = {
                bookUrl: bookUrl,
                lang: svaret.docs[0].language,
                year: svaret.docs[0].first_publish_year
            };
            expandBookInfo(event, bookObj);
        });
}
