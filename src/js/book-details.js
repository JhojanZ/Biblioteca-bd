document.addEventListener('DOMContentLoaded', function () {
    const parametros = new URLSearchParams(window.location.search);
    const bookID = parametros.get('id');

    if (!bookID) {
        document.getElementById('book-details').innerHTML = '<p class="text-danger">Book ID not provided.</p>';
        return;
    }

    fetch(`http://localhost:3000/api/books/${bookID}`)
        .then(response => response.json())
        .then(data => {
            console.log('Book details:', data);
            const libroDetalles = document.getElementById('book-details');
            document.getElementById('book-title').textContent = data.libro.title;

            // <h5>Title: ${data.libro.title}</h5>
            libroDetalles.innerHTML = `
                <p><strong>Código de idioma:</strong> ${data.libro.language_code}</p>
                <p><strong>Descripción:</strong> ${data.libro.descripcion}</p><hr>
                <p><strong>Autores:</strong> ${data.libro.authors}</p>
                <p><strong>Editorial:</strong> ${data.libro.publisher}</p>
                <p><strong>Puntuación promedio:</strong> ${data.libro.average_rating}</p>
                <p><strong>Páginas:</strong> ${data.libro.num_pages}</p>
                <p><strong>ISBN:</strong> ${data.libro.isbn}</p>
                <p><strong>ISBN13:</strong> ${data.libro.isbn13}</p>
                <p><strong>Fecha de publicación:</strong> ${data.libro.publication_date}</p>
                <p><strong>Cantidad disponible:</strong> 
                    <span style="color: ${data.libro.text_reviews_count > 0 ? 'green' : 'red'};">
                        ${data.libro.text_reviews_count}
                    </span>
                </p>
            `;
        })
        .catch(error => {
            console.error('Error fetching book details:', error);
            document.getElementById('book-details').innerHTML = '<p class="text-danger">Error loading book details.</p>';
        });
});