let paginaActual = 1;
let LibrosPorPagina = 10; 
let BusquedaAvanzada = false; 
let lastConsulted = null; 

document.addEventListener('DOMContentLoaded', function() {
    const lastQuery = JSON.parse(localStorage.getItem('lastQuery'));

    document.getElementById('login-btn').addEventListener('click', function() {
        login();
    });

    if (lastQuery) {
        restaureFilters(lastQuery); 
    } else {
        fetchBooks();
    }

    document.getElementById('clear-filters-btn').addEventListener('click', function () {
        clearFilters();
    });

    // Manejar búsqueda simple
    document.getElementById('simple-search-btn').addEventListener('click', function () {
        BusquedaAvanzada = false;
        searchBooks();
    });

    // Mostrar/ocultar formulario de búsqueda avanzada
    document.getElementById('advanced-search-btn').addEventListener('click', function () {
        const form = document.getElementById('advanced-search-form');
        form.style.display = form.style.display === 'none' ? 'block' : 'none';
    });

    // Manejar búsqueda avanzada
    document.getElementById('advanced-search-submit').addEventListener('click', function () {
        BusquedaAvanzada = true;
        searchBooks();
    });

    // Manejar el cambio de número de libros por página
    document.getElementById('books-per-page').addEventListener('change', function (e) {
        LibrosPorPagina = parseInt(e.target.value);
        paginaActual = 1; 
        searchBooks();
    });

    // Manejar el botón "Previous"
    document.getElementById('prev-page').addEventListener('click', function () {
        if (paginaActual > 1) {
            paginaActual--;
            searchBooks();
        }
    });

    // Manejar el botón "Next"
    document.getElementById('next-page').addEventListener('click', function () {
        paginaActual++;
        searchBooks();
    });
});

function login(){
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Invalid credentials');
        }
        return response.json();
    })
    .then(data => {
        alert(data.message);
        window.location.href = 'add-book.html';
    })
    .catch(error => alert(error.message));
}

function searchBooks() {
    const keyword = document.getElementById('simple-search').value.trim();
    console.log(`Searching books with keyword: ${keyword}`);
    if ( BusquedaAvanzada) {
        const author = document.getElementById('author').value.trim();
        const publisher = document.getElementById('publisher').value.trim();
        const pages = document.getElementById('pages').value.trim();
        const publicationDate = document.getElementById('publication-date').value.trim();
        const rating = document.getElementById('rating').value.trim();
        fetchBooks({ title: keyword, author, publisher, pages, publicationDate, rating });
    } else {        
        fetchBooks({ title: keyword });
    }
}

function restaureFilters(lastQuery) {
    // Restaurar los valores de la última consulta
    paginaActual = lastQuery.paginaActual || 1;
    LibrosPorPagina = lastQuery.LibrosPorPagina || 10;

    if (lastQuery.filters) {
        const { title, author, publisher, pages, publicationDate, rating } = lastQuery.filters;

        if (title) document.getElementById('simple-search').value = title;
        if (author) document.getElementById('author').value = author;
        if (publisher) document.getElementById('publisher').value = publisher;
        if (pages) document.getElementById('pages').value = pages;
        if (publicationDate) document.getElementById('publication-date').value = publicationDate;
        if (rating) document.getElementById('rating').value = rating;
    }

    fetchBooks(lastQuery.filters || {});
}

function clearFilters() {
    document.getElementById('author').value = '';
    document.getElementById('publisher').value = '';
    document.getElementById('pages').value = '';
    document.getElementById('publication-date').value = '';
    document.getElementById('rating').value = '';
    document.getElementById('simple-search').value = '';

    BusquedaAvanzada = false;
    paginaActual = 1;

    // Limpiar la última consulta guardada en localStorage
    localStorage.removeItem('lastQuery');
    fetchBooks();
}

function fetchBooks(filters = {}) {
    const params = new URLSearchParams({
        page: paginaActual,
        limit: LibrosPorPagina,
        ...filters
    });
    console.log(`Fetching books with params: ${params.toString()}`);


    localStorage.setItem('lastQuery', JSON.stringify({
        filters,
        paginaActual,
        LibrosPorPagina
    }));



    fetch(`http://localhost:3000/api/books?${params.toString()}`)
        .then(response => response.json())
        .then(data => {
            const bookList = document.getElementById('book-list');
            bookList.innerHTML = '';

            data.libros.forEach(libro => {
                const listItem = document.createElement('div');
                listItem.className = 'col-md-4 mb-4';
                listItem.innerHTML = `
                    <div class="card h-100">
                        <div class="card-body">
                            <h5 class="card-title">${libro.title}</h5>
                            <h6 class="card-subtitle mb-2 text-muted">Publisher: ${libro.publisher}</h6>
                            <p class="card-text">
                                <strong>Rating:</strong> ${libro.average_rating}
                            </p>
                            <a href="book-details.html?id=${libro.bookID}" class="btn btn-primary">View Details</a>
                        </div>
                    </div>
                `;
                bookList.appendChild(listItem);
            });

            // Habilitar o deshabilitar botones de navegación
            document.getElementById('prev-page').disabled = paginaActual === 1;
            document.getElementById('next-page').disabled = data.libros.length < LibrosPorPagina;
        })
        .catch(error => console.error('Error fetching books:', error));
}
