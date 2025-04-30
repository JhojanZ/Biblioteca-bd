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
