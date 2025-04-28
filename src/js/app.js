// This file contains JavaScript code for the frontend. It handles fetching book data from the backend and dynamically populating the book list on the webpage.

document.addEventListener('DOMContentLoaded', function() {
    fetchBooks();
});

function fetchBooks() {
    fetch('/api/books')
        .then(response => response.json())
        .then(data => {
            const bookList = document.getElementById('book-list');
            bookList.innerHTML = '';

            data.forEach(book => {
                const listItem = document.createElement('li');
                listItem.className = 'list-group-item';
                listItem.innerHTML = `
                    <h5>${book.title}</h5>
                    <p>Authors: ${book.authors}</p>
                    <p>Average Rating: ${book.average_rating}</p>
                    <p>ISBN: ${book.isbn}</p>
                    <p>Pages: ${book.num_pages}</p>
                    <p>Publisher: ${book.publisher}</p>
                    <p>Publication Date: ${book.publication_date}</p>
                `;
                bookList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error fetching books:', error));
}