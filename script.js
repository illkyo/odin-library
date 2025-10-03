const body = document.querySelector('body');
const formSidebar = document.querySelector('.form-sidebar');
const booksContainer = document.querySelector('.books-container');

const library = [];

function Book(title, author, pages, readStatus = false) {
  this.id = crypto.randomUUID();
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.readStatus = readStatus;
}

Book.prototype.read = function() {
  this.readStatus = !this.readStatus;
}

function placeAddBookButton() {
  const addBookButton = document.createElement('button');
  addBookButton.setAttribute('title', 'Add Book');
  addBookButton.textContent = '+';
  addBookButton.classList.add('add-book-button');
  addBookButton.addEventListener('click', (e) => {
    body.classList.toggle('sidebar-visible');
    formSidebar.classList.toggle('hidden');
    if (body.classList.contains('sidebar-visible')) {
      e.target.textContent = '<';
      addBookButton.setAttribute('title', 'Close Sidebar');
    } else {
      e.target.textContent = '+';
      addBookButton.setAttribute('title', 'Add Book');
    }
  });
  booksContainer.appendChild(addBookButton);
}

function placeOptionButtons(book, bookListing) {
  const optionsContainer = document.createElement('div');
  optionsContainer.classList.add('options-container');

  const readStatusButton = document.createElement('button');
  const removeBookButton = document.createElement('button');
  
  readStatusButton.setAttribute('title', 'Change Read Status');
  readStatusButton.classList.add('read-status-button');
  if (book.readStatus) {
    readStatusButton.classList.add('book-read');
  };
  readStatusButton.addEventListener('click', (e) => {
    book.read();
    readStatusButton.classList.toggle('book-read');
    console.log(book.readStatus);
  });

  removeBookButton.setAttribute('title', 'Remove Book');
  removeBookButton.textContent = '--';
  removeBookButton.classList.add('remove-book-button');
  removeBookButton.addEventListener('click', (e) => {
    library.splice(library.map((item) => {
        return item.id;
      }).indexOf(book.id), 1);
    const libraryBookList = document.querySelector('.books-container ul');
    libraryBookList.removeChild(bookListing);
    console.log(library);
  });
  optionsContainer.appendChild(readStatusButton);
  optionsContainer.appendChild(removeBookButton);

  bookListing.appendChild(optionsContainer);
}

function createLibrary() {
  const libraryBookList = document.createElement('ul');
  booksContainer.appendChild(libraryBookList);
  library.forEach((book) => {
    addBookToList(book, libraryBookList);
  });
  placeAddBookButton();
}

function updateLibrary() {
  const libraryBookList = document.querySelector('.books-container ul');
  if (library.length !== 0) {
    const addedBook = library.slice(-1)[0];
    addBookToList(addedBook, libraryBookList);
  }
}

function addBookToLibrary(title, author, pages, readStatus = false) {
  let bookToAdd = new Book(title, author, pages, readStatus);
  library.push(bookToAdd);
}

function addBookToList(book, list) {
  const bookListing = document.createElement('li');
  const titleAndAuthor = document.createElement('p');
  const pages = document.createElement('p');
  titleAndAuthor.textContent = `${book.title} by ${book.author}`;
  pages.textContent = `${book.pages} pages`;
  bookListing.appendChild(titleAndAuthor);
  bookListing.appendChild(pages);
  placeOptionButtons(book, bookListing);
  list.appendChild(bookListing);
}

addBookToLibrary('The Republic', 'Pluto', 400);
addBookToLibrary('IT', 'Stephen King', 200);
createLibrary();

const addBookForm = document.querySelector('.form-sidebar form');
const addBookFormSubmitButton = document.querySelector('.form-sidebar form button');
addBookForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  let data = {};
	for (let keyValue of formData.entries()) {
		data[keyValue[0]] = keyValue[1];
	}
  console.log(data);
	addBookToLibrary(data.title, data.author, data.pages, !!data.read);
  updateLibrary();
});

const inputFields = document.querySelectorAll('.form-sidebar input:not([type="checkbox"])');
inputFields.forEach((item) => {
  item.addEventListener('input', (e) => {
    const inputFieldsValid = Array.from(inputFields).every(inputField => inputField.checkValidity());
    addBookFormSubmitButton.disabled = !inputFieldsValid;
  });
});
