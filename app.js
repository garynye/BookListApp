//book class: represents a book - each book we create will enstatiionate
class Book {
    constructor(title, author, isbn) {
        this.title = title
        this.author = author
        this.isbn = isbn
    }
}

//UI class:  handles UI tasks - when a book displays or removes.  that will all be in UI

class UI {
    //put static so you don't enstantiate the class
    static displayBooks(){

        const books = Store.getBooks()

        books.forEach((book) => UI.addBookToList(book))
    }

    static addBookToList(book) {
        const list = document.querySelector('#book-list')
        const row = document.createElement('tr')
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `
        list.appendChild(row)
    }

    //show alert
    static showAlert(message, className) {
        const newDiv = document.createElement('div')
        newDiv.className = `alert alert-${className}`
        newDiv.innerText = message
        const container = document.querySelector('.container')
        const form = document.querySelector('#book-form')
        container.insertBefore(newDiv,form)
        //vanish in 3 seconds
        setTimeout(() => {
            document.querySelector('.alert').remove()
        }, 3000)
    }

    //clear fields
    static clearFields() {
        document.querySelector('#title').value = ''
        document.querySelector('#author').value = ''
        document.querySelector('#isbn').value = ''
    }

    //delete book
    static deleteBook(e) {
        if(e.classList.contains('delete')) {
            e.parentElement.parentElement.remove()
        }
    }

}


//Store class: storage handling, local this time.  can't store objects in local storage
class Store {
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null) {
            books = []

        } else {
            books = JSON.parse(localStorage.getItem('books'))
        }
        return books
    }

    static addBook(book) {

        const books = Store.getBooks()
        books.push(book)
        localStorage.setItem('books', JSON.stringify(books))
    }

    static removeBook(isbn)   {
        const books = Store.getBooks()
        books.forEach((book, index) => {
            if(book.isbn === isbn) {
                books.splice(index, 1)
            }
        })
        localStorage.setItem('books', JSON.stringify(books))
    }

}


//Event: display books
document.addEventListener('DOMContentLoaded', UI.displayBooks())


//Event: add book
document.querySelector('#book-form').addEventListener('submit', (e) => {
    //prevent actual submit
    e.preventDefault()
    //get form values
    const title = document.querySelector('#title').value
    const author = document.querySelector('#author').value
    const isbn = document.querySelector('#isbn').value

    //validate data
    if(title === '' || author ==='' || isbn ===''){
        UI.showAlert('Please fill all fields', 'danger')
        return
    }

    //instatniate book
    const book = new Book(title, author, isbn)

    //add the book
    UI.addBookToList(book) 
    // add book to store
    Store.addBook(book)

    //show success message
    UI.showAlert('book successfully added', 'success')

    UI.clearFields() 
})


//Event: remove a book

document.querySelector('#book-list').addEventListener('click', (e) => {
    //remove book from UI
    UI.deleteBook(e.target)
    //remove book from store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent)
    UI.showAlert('book successfully removed', 'success')
})