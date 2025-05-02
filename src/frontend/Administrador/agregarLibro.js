document.addEventListener('DOMContentLoaded', function () {
    console.log("asdfghjkl)");
    document.getElementById('add-book-btn').addEventListener('click', function () {
        const title = document.getElementById('book-title').value.trim();
        const author = document.getElementById('book-author').value.trim();
        const publisher = document.getElementById('book-publisher').value.trim();
        const pages = document.getElementById('book-pages').value.trim();
        const publicationDate = document.getElementById('book-date').value.trim();
        const isbn = document.getElementById('book-isbn').value.trim();
        const isbn13 = document.getElementById('book-isbn13').value.trim();
        const language = document.getElementById('book-language-code').value.trim();
        const cant = document.getElementById('book-quantity');

        if (!title || !author || !publisher || !pages || !publicationDate ||  !(isbn || isbn13) || !language || !cant) {
            alert('Please fill in all fields.');
            return;
        }

        fetch('http://localhost:3000/api/books/nuevo_libro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, author, publisher, pages, publicationDate, isbn, isbn13, language, cant })
        })
        .then(response => {
            console.log('Response:', response);
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
            document.getElementById('book-isbn').value = '';
            document.getElementById('book-isbn13').value = '';
            document.getElementById('book-language-code').value = '';
            document.getElementById('book-quantity').value = '';
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
            throw new Error('No se pudo registrar el préstamo');
        }
        return response.json();
    })
    .then(data => {
        alert(`Préstamo registrado exitosamente el ${data.loanDate}`);
        // Limpiar el formulario después de registrar el préstamo
        document.getElementById('loan-book-id').value = '';
        document.getElementById('loan-user-id').value = '';
    })
    .catch(error => alert(error.message));
}

document.getElementById('fetch-loans-btn').addEventListener('click', function () {
    const userID = document.getElementById('return-user-id').value.trim();

    if (!userID) {
        alert('Por favor, ingrese el ID del usuario.');
        return;
    }

    fetch(`http://localhost:3000/api/prestamos/${userID}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los préstamos');
            }
            return response.json();
        })
        .then(data => {
            const loanedBooksList = document.getElementById('loaned-books-list');
            loanedBooksList.innerHTML = '';

            if (data.length === 0) {
                loanedBooksList.innerHTML = '<p>No se encontraron préstamos para este usuario.</p>';
                document.getElementById('save-returns-btn').style.display = 'none';
                return;
            }
            console.log('Prestamos data:', data);

            // Crear la tabla
            const table = document.createElement('table');
            table.id = 'loaned-books-table';
            table.className = 'table table-striped';
            table.innerHTML = `
                <thead>
                    <tr>
                        <th>Seleccionar</th>
                        <th>ID del Préstamo</th>
                        <th>Título</th>
                        <th>Fecha de Préstamo</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map(loan => `
                        <tr>
                            <td>
                                <input class="form-check-input" type="checkbox" value="${loan.Id_prestamo}" id="loan-${loan.Id_prestamo}">
                            </td>
                            <td>${loan.Id_prestamo}</td>
                            <td>${loan.title}</td>
                            <td>${loan.Fecha_prestamo}</td>
                        </tr>
                    `).join('')}
                </tbody>
            `;
            loanedBooksList.appendChild(table);


            document.getElementById('save-returns-btn').style.display = 'block';
        })
        .catch(error => alert(error.message));
});

document.getElementById('save-returns-btn').addEventListener('click', function () {
    const checkedLoans = Array.from(document.querySelectorAll('#loaned-books-list .form-check-input:checked'))
        .map(input => input.value);

    if (checkedLoans.length === 0) {
        alert('Por favor, seleccione al menos un libro para registrar la devolución.');
        return;
    }

    fetch('http://localhost:3000/api/prestamos/devoluciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loanIDs: checkedLoans })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al registrar las devoluciones');
            }
            console.log('Response JSON:', response.json());
            return response.json();
        })
        .then(data => {
            alert(data.message);
            document.getElementById('loaned-books-list').innerHTML = '';
            document.getElementById('save-returns-btn').style.display = 'none';
        })
        .catch(error => alert(error.message));
});

