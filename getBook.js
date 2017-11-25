window.addEventListener('load', function (event) {
    const bookApiInput = document.getElementById('bookApiInput');
    const bookApiBtn = document.getElementById('bookApiBtn');
    const bookReq = new XMLHttpRequest();
    const bookLog = document.getElementById('bookLog');
    const bookApi = document.getElementById('bookApi');
    const topBookLog = document.getElementById('topBookLog');
    const docLog = document.getElementById('docLog')
    let once = false;
    bookApiBtn.addEventListener('click', function (event) {
        if (bookApiInput.value != "") {
            var value = bookApiInput.value;
            value = insertPlus(value);
        } else {
            bookApi.innerHTML += "<strong>Please enter a string</strong>";
        }
        bookReq.onreadystatechange = function (event) {
            if (bookReq.readyState = 4) {
                const ans = JSON.parse(bookReq.responseText);
                const num_found = ans.num_found;
                if (once === false) {
                    let headerElement = document.createElement("li");
                    headerElement.innerHTML = `<span>Title</span><span>Author</span><span>Date</span>`
                    docLog.appendChild(headerElement);
                    once = true;
                }
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
        bookReq.open('GET', `http://openlibrary.org/search.json?q=${value}`);
        bookReq.send();
    })

})

// Functions
/* Adding eventListeners to the buttons */


function insertPlus(aString) {
    return aString.split(" ").join("+");
}

function bookAdd(event) {
    let author = event.target.previousSibling.previousSibling.innerText;
    let title = event.target.previousSibling.previousSibling.previousSibling.innerText;
    let target = event.target;
    addBook(0, title, author);
    removeBooksFromLibrary();
    retrieveBooks(0);
    target.setAttribute('class', 'onclic animateBtn addFromLibrary');
    setTimeout(function () {
        target.removeAttribute('class', "onclic");
        target.setAttribute('class', 'afterClick')
    }, 1500)

}





//https://reststop.randomhouse.com/resources/authors?lastName=Grisham$application/json
