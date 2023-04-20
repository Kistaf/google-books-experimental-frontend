window.onload = () => {
  const input = document.getElementById("searchInput");
  const result = document.getElementById("result");
  const bookList = document.getElementById("book_list");
  input.addEventListener("input", debounce(searchChange, 300));
  result.onclick = (e) => addBookToBooklist(e, bookList);
  bookList.onclick = (e) => removeBookFromBooklistArr(e, bookList);
};

let bookListArr = [];

function removeBookFromBooklistArr(e, bookList) {
  if (
    !e.target ||
    !e.target.classList ||
    !e.target.classList.contains("booklist-book")
  )
    return;
  bookListArr = bookListArr.filter(
    (book) => book.title !== e.target.bookData.title
  );
  updateBookList(e.target.bookData, bookList);
}

function updateBookList(book, bookList) {
  for (let i = 0; i < bookList.children.length; i++) {
    const element = bookList.children[i];
    if (
      element.bookData.title === book.title &&
      element.bookData.authors === book.authors
    ) {
      bookList.removeChild(element);
      return;
    }
  }
}

function addBookToBooklist(e, bookList) {
  if (
    !e.target ||
    e.target === result ||
    !e.target.dataset.bookAuthors ||
    !e.target.dataset.bookTitle
  )
    return;
  const data = {
    title: e.target.dataset.bookTitle,
    authors: e.target.dataset.bookAuthors,
  };
  const newBook = document.createElement("li");
  newBook.innerText = JSON.stringify(data);
  newBook.classList.add("booklist-book");
  newBook.bookData = data;
  bookList.append(newBook);
  bookListArr.push(data);
}

function updateResultDiv(books) {
  document.getElementById("result").innerHTML = books
    .map(
      (book) =>
        `<li style="display: flex; flex-direction: row;"><div>${book.volumeInfo.title} - ${book.volumeInfo.authors}</div><button data-book-title="${book.volumeInfo.title}" data-book-authors="${book.volumeInfo.authors}">Add</button></li>`
    )
    .join("\n");
}

async function searchChange(event) {
  const query = event.target.value;
  if (!query) {
    updateResultDiv([]);
    return;
  }
  const books = await getBooksBySearch(query);
  updateResultDiv(books);
}

function debounce(fn, delay) {
  let timer = null;
  return function (...args) {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(() => {
      fn.apply(this, args);
      timer = null;
    }, delay);
  };
}

async function getBooksBySearch(search) {
  try {
    const res = await fetch(
      "http://localhost:8080/searchByKeyword?query=" + search,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      }
    );
    return await res.json();
  } catch (err) {
    console.log(err);
  }
}
