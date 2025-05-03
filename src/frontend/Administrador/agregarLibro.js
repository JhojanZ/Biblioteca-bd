function initAgregarLibro() {
    document.getElementById('add-book-btn').addEventListener('click', function () {
        const title = document.getElementById('book-title').value.trim();
        const author = document.getElementById('book-author').value.trim();
        const publisher = document.getElementById('book-publisher').value.trim();
        const pages = document.getElementById('book-pages').value.trim();
        const publicationDate = document.getElementById('book-date').value.trim();
        const isbn = document.getElementById('book-isbn').value.trim();
        const isbn13 = document.getElementById('book-isbn13').value.trim();
        const language = document.getElementById('book-language-code').value.trim();
        const cant = document.getElementById('book-quantity').value.trim();

        if (!title || !author || !publisher || !pages || !publicationDate || !(isbn || isbn13) || !language || !cant) {
            alert('Please fill in all fields.');
            return;
        }

        fetch('http://localhost:3000/api/books/nuevo_libro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, author, publisher, pages, publicationDate, isbn, isbn13, language, cant })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add book');
            }
            return response.json();
        })
        .then(data => {
            alert(data.message);
            document.getElementById('book-title').value = '';
            document.getElementById('book-author').value = '';
            document.getElementById('book-publisher').value = '';
            document.getElementById('book-pages').value = '';
            document.getElementById('book-date').value = '';
            document.getElementById('book-isbn').value = '';
            document.getElementById('book-isbn13').value = '';
            document.getElementById('book-language-code').value = '';
            document.getElementById('book-quantity').value = '';
        })
        .catch(error => alert(error.message));
    });
}