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
/* Adding eventListeners to the buttons */

function refreshSearch() {
    const docLog = document.getElementById('docLog')
    docLog.innerHTML = null;
}

function insertPlus(aString) {
    return aString.split(" ").join("+");
}

function addToTop(title, author) {
    const libraryDiv = document.getElementById('library');

    const topElement = document.createElement("div");
    topElement.innerHTML = '<span class="spanID"><i class="fa fa-refresh fa-spin fa-2x"></i></span> <hr> <span>' + title + '</span> <hr> <span>' + author + '</span> <hr> <button pen="true" class="libraryRemoveBtn hoverGold"><i class="fa fa-pencil" aria-hidden="true"></i></button><button expand="true" class="hoverGrey libraryRemoveBtn"><i class="fa fa-expand" aria-hidden="true"></i></button><button rmvBtn="true" class="libraryRemoveBtn"><i class="fa fa-times" aria-hidden="true"></i></button>';
    libraryDiv.insertBefore(topElement, libraryDiv.children[1]);
    btnAddEventListeners(libraryDiv.children[1]);
    libraryDiv.children[1].setAttribute('class', "newIn")
}
//        removeBooksFromLibrary();
//    retrieveBooks(0);
function bookAdd(event) {
    let author = event.target.previousSibling.previousSibling.innerText;
    let title = event.target.previousSibling.previousSibling.previousSibling.innerText;
    let target = event.target;
    target.setAttribute('class', 'onclic animateBtn addFromLibrary');
    setTimeout(function () {
        target.removeAttribute('class', "onclic");
        target.setAttribute('class', 'afterClick');
        addBook(0, title, author);
        addToTop(title, author);
    }, 1500)
}
