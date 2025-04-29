document.addEventListener('DOMContentLoaded', function () {

    console.log('Book details page loaded');
    const params = new URLSearchParams(window.location.search);
    const bookID = params.get('id');

    if (!bookID) {
        document.getElementById('book-details').innerHTML = '<p class="text-danger">Book ID not provided.</p>';
        return;
    }
    
    fetch(`http://localhost:3000/api/books/${bookID}`)
        .then(response => response.json())
        .then(book => {
            const bookDetails = document.getElementById('book-details');
            document.getElementById('book-title').textContent = book.title;

            bookDetails.innerHTML = `
                <h5>Title: ${book.title}</h5>
                <p><strong>Authors:</strong> ${book.authors}</p>
                <p><strong>Publisher:</strong> ${book.publisher}</p>
                <p><strong>Average Rating:</strong> ${book.average_rating}</p>
                <p><strong>ISBN:</strong> ${book.isbn}</p>
                <p><strong>Pages:</strong> ${book.num_pages}</p>
                <p><strong>Publication Date:</strong> ${book.publication_date}</p>
                <p><strong>Text Reviews Count:</strong> ${book.text_reviews_count}</p>
            `;
        })
        .catch(error => {
            console.error('Error fetching book details:', error);
            document.getElementById('book-details').innerHTML = '<p class="text-danger">Error loading book details.</p>';
        });
});