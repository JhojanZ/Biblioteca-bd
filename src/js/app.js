// This file contains JavaScript code for the frontend. It handles fetching book data from the backend and dynamically populating the book list on the webpage.
let currentPage = 1; // Página actual
let booksPerPage = 10; // Libros por página
let advancedSearch = false; // Búsqueda avanzada activada

// This function is called when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    fetchBooks();

    // Manejar búsqueda simple
    document.getElementById('simple-search-btn').addEventListener('click', function () {
        advancedSearch = false;
        searchBooks();
    });

    // Mostrar/ocultar formulario de búsqueda avanzada
    document.getElementById('advanced-search-btn').addEventListener('click', function () {
        const form = document.getElementById('advanced-search-form');
        form.style.display = form.style.display === 'none' ? 'block' : 'none';
    });

    // Manejar búsqueda avanzada
    document.getElementById('advanced-search-submit').addEventListener('click', function () {
        advancedSearch = true;
        searchBooks();
    });


    // Manejar el cambio en el selector de libros por página
    document.getElementById('books-per-page').addEventListener('change', function (e) {
        booksPerPage = parseInt(e.target.value);
        currentPage = 1; // TODO: Mejorar la paginación
        searchBooks();
    });

    // Manejar el botón "Previous"
    document.getElementById('prev-page').addEventListener('click', function () {
        if (currentPage > 1) {
            currentPage--;
            searchBooks();
        }
    });

    // Manejar el botón "Next"
    document.getElementById('next-page').addEventListener('click', function () {
        currentPage++;
        searchBooks();
    });
});

function searchBooks() {
    const keyword = document.getElementById('simple-search').value.trim();
    if ( advancedSearch) {
        // Obtener valores de los campos de búsqueda avanzada
        const author = document.getElementById('author').value.trim();
        const publisher = document.getElementById('publisher').value.trim();
        const pages = document.getElementById('pages').value.trim();
        const publicationDate = document.getElementById('publication-date').value.trim();
        const rating = document.getElementById('rating').value.trim();
        fetchBooks({ title: keyword, author, publisher, pages, publicationDate, rating });
    } else {        
        // Realizar búsqueda simple
        fetchBooks({ title: keyword });
    }


}

function fetchBooks(filters = {}) {
    const params = new URLSearchParams({
        page: currentPage,
        limit: booksPerPage,
        ...filters
    });
    console.log(`Fetching books with params: ${params.toString()}`);
    fetch(`http://localhost:3000/api/books?${params.toString()}`)
    .then(response => response.json())
    .then(data => {
        const bookList = document.getElementById('book-list');
        bookList.innerHTML = '';

        data.books.forEach(book => {
            const listItem = document.createElement('div');
            listItem.className = 'col-md-4 mb-4';
            listItem.innerHTML = `
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">${book.title}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">Authors: ${book.authors}</h6>
                        <p class="card-text">
                            <strong>Average Rating:</strong> ${book.average_rating}<br>
                            <strong>ISBN:</strong> ${book.isbn}<br>
                            <strong>Pages:</strong> ${book.num_pages}<br>
                            <strong>Publisher:</strong> ${book.publisher}<br>
                            <strong>Publication Date:</strong> ${book.publication_date}
                        </p>
                    </div>
                </div>
            `;
            bookList.appendChild(listItem);

            // Habilitar o deshabilitar botones de navegación
            document.getElementById('prev-page').disabled = currentPage === 1;
            document.getElementById('next-page').disabled = data.books.length < booksPerPage;
        });
    })
    .catch(error => console.error('Error fetching books:', error));
}