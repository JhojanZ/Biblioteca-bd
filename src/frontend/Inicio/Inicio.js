window.paginaActual = 1;
window.LibrosPorPagina = 10;
window.BusquedaAvanzada = false;
window.lastConsulted = null;

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
        window.BusquedaAvanzada = false;
        searchBooks();
    });

    // Mostrar/ocultar formulario de búsqueda avanzada
    document.getElementById('advanced-search-btn').addEventListener('click', function () {
        const form = document.getElementById('advanced-search-form');
        form.style.display = form.style.display === 'none' ? 'block' : 'none';
    });

    // Manejar búsqueda avanzada
    document.getElementById('advanced-search-submit').addEventListener('click', function () {
        window.BusquedaAvanzada = true;
        searchBooks();
    });

    // Manejar el cambio de número de libros por página
    document.getElementById('books-per-page').addEventListener('change', function (e) {
        LibrosPorPagina = parseInt(e.target.value);
        window.paginaActual = 1; 
        searchBooks();
    });

    // Manejar el botón "Previous"
    document.getElementById('prev-page').addEventListener('click', function () {
        if (window.paginaActual > 1) {
            window.paginaActual--;
            searchBooks();
        }
    });

    // Manejar el botón "Next"
    document.getElementById('next-page').addEventListener('click', function () {
        window.paginaActual++;
        searchBooks();
    });
});
