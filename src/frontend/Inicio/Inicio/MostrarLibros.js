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

    localStorage.removeItem('lastQuery');
    fetchBooks();
}

function fetchBooks(filters = {}) {
    const params = new URLSearchParams({
        page: window.paginaActual,
        limit: window.LibrosPorPagina,
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
                            <a href="vistaCompletaLibro/vistaCompletaLibro.html?id=${libro.bookID}" class="btn btn-primary">Mostrar Detalles</a>
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
