function initControlPrestamos() {
    const registerLoanBtn = document.getElementById('register-loan-btn');
    const fetchLoansBtn = document.getElementById('fetch-loans-btn');
    const saveReturnsBtn = document.getElementById('save-returns-btn');

    if (registerLoanBtn) {
        registerLoanBtn.addEventListener('click', () => {
            const bookId = document.getElementById('loan-book-id').value.trim();
            const userId = document.getElementById('loan-user-id').value.trim();

            if (!bookId || !userId) {
                alert('Por favor, complete todos los campos.');
                return;
            }

            fetch('http://localhost:3000/api/loans/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookId, userId }),
            })
            .then(response => {
                if (response.ok) {
                    alert('Préstamo registrado exitosamente');
                } else {
                    alert('Error al registrar el préstamo');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al conectar con el servidor');
            });
        });
    }

    if (fetchLoansBtn) {
        fetchLoansBtn.addEventListener('click', () => {
            const userId = document.getElementById('return-user-id').value.trim();

            if (!userId) {
                alert('Por favor, ingrese el ID del usuario.');
                return;
            }

            fetch(`http://localhost:3000/api/loans/user/${userId}`)
                .then(response => response.json())
                .then(data => {
                    const loanedBooksList = document.getElementById('loaned-books-list');
                    const loanedBooksTable = document.getElementById('loaned-books-table');
                    loanedBooksList.innerHTML = '';
                    loanedBooksTable.innerHTML = '';

                    if (data.length === 0) {
                        loanedBooksList.innerHTML = '<p>No hay libros prestados para este usuario.</p>';
                        return;
                    }

                    const table = document.createElement('table');
                    table.className = 'table';
                    table.innerHTML = `
                        <thead>
                            <tr>
                                <th>ID del Libro</th>
                                <th>Título</th>
                                <th>Fecha de Préstamo</th>
                                <th>Seleccionar</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.map(book => `
                                <tr>
                                    <td>${book.bookId}</td>
                                    <td>${book.title}</td>
                                    <td>${book.loanDate}</td>
                                    <td><input type="checkbox" data-book-id="${book.bookId}"></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    `;
                    loanedBooksTable.appendChild(table);
                    saveReturnsBtn.style.display = 'block';
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Error al obtener los libros prestados');
                });
        });
    }

    if (saveReturnsBtn) {
        saveReturnsBtn.addEventListener('click', () => {
            const selectedBooks = Array.from(document.querySelectorAll('#loaned-books-table input[type="checkbox"]:checked'))
                .map(checkbox => checkbox.getAttribute('data-book-id'));

            if (selectedBooks.length === 0) {
                alert('Por favor, seleccione al menos un libro para devolver.');
                return;
            }

            fetch('http://localhost:3000/api/loans/return', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookIds: selectedBooks }),
            })
            .then(response => {
                if (response.ok) {
                    alert('Devoluciones registradas exitosamente');
                    document.getElementById('loaned-books-table').innerHTML = '';
                    saveReturnsBtn.style.display = 'none';
                } else {
                    alert('Error al registrar las devoluciones');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al conectar con el servidor');
            });
        });
    }
}