document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('add-book-btn').addEventListener('click', function () {
        const title = document.getElementById('book-title').value.trim();
        const author = document.getElementById('book-author').value.trim();
        const publisher = document.getElementById('book-publisher').value.trim();
        const pages = document.getElementById('book-pages').value.trim();
        const publicationDate = document.getElementById('book-date').value.trim();
        const rating = document.getElementById('book-rating').value.trim();

        if (!title || !author || !publisher || !pages || !publicationDate || !rating) {
            alert('Please fill in all fields.');
            return;
        }

        fetch('http://localhost:3000/api/books', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, author, publisher, pages, publicationDate, rating })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add book');
            }
            return response.json();
        })
        .then(data => {
            alert(data.message);
            // Opcional: Limpiar el formulario después de agregar el libro
            document.getElementById('book-title').value = '';
            document.getElementById('book-author').value = '';
            document.getElementById('book-publisher').value = '';
            document.getElementById('book-pages').value = '';
            document.getElementById('book-date').value = '';
            document.getElementById('book-rating').value = '';
        })
        .catch(error => alert(error.message));
    }); 

    // Manejar el registro de préstamos
    document.getElementById('register-loan-btn').addEventListener('click', function () {
        prestamos();
    });
});

function prestamos(){
    const bookID = document.getElementById('loan-book-id').value.trim();
    const userID = document.getElementById('loan-user-id').value.trim();

    if (!bookID || !userID) {
        alert('Please fill in all fields.');
        return;
    }

    fetch('http://localhost:3000/api/prestamos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookID, userID })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to register loan');
        }
        return response.json();
    })
    .then(data => {
        alert(`Loan registered successfully on ${data.loanDate}`);
        // Limpiar el formulario después de registrar el préstamo
        document.getElementById('loan-book-id').value = '';
        document.getElementById('loan-user-id').value = '';
    })
    .catch(error => alert(error.message));
}

