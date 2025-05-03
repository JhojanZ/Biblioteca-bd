document.addEventListener('DOMContentLoaded', () => {
    // Cargar el archivo HTML principal
    fetch('Administrador.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo cargar el archivo HTML');
            }
            return response.text();
        })
        .then(html => {
            document.body.innerHTML = html;

            // Inicializar eventos y funciones
            initEventListeners();
        })
        .catch(error => console.error('Error al cargar el archivo HTML:', error));
});

function initEventListeners() {
    // Lógica para manejar las secciones
    document.querySelectorAll('[onclick^="showSection"]').forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault();
            const sectionId = link.getAttribute('onclick').match(/'([^']+)'/)[1];
            showSection(sectionId);
        });
    });

    // Inicializar las funciones específicas
    initAgregarLibro();
    initAgregarUsuario();
    initControlPrestamos();
    initConsultarUsuariosYPrestamos();
}

function showSection(sectionId) {
    // Ocultar todas las secciones
    document.querySelectorAll('.container > div').forEach(section => {
        section.style.display = 'none';
    });

    // Mostrar la sección seleccionada
    const section = document.getElementById(sectionId);
    if (section) {
        section.style.display = 'block';
    }
}

// Función para agregar libros
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

// Función para agregar usuarios
function initAgregarUsuario() {
    const form = document.getElementById('add-user-form');
    if (!form) return; // Verificar que el formulario exista

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const userData = {
            id_usuario: document.getElementById('user-code').value,
            name: document.getElementById('user-name').value,
            lastname: document.getElementById('user-lastname').value,
            email: document.getElementById('user-email').value,
            gender: document.getElementById('user-gender').value,
            age: document.getElementById('user-age').value,
            phone: document.getElementById('user-phone').value,
            address: document.getElementById('user-address').value,
            occupation: document.getElementById('user-occupation').value,
        };
        console.log("data: ", userData);

        fetch('http://localhost:3000/api/nuevoUsuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        })
        .then(response => {
            if (response.ok) {
                alert('Usuario agregado exitosamente');
                form.reset();
            } else {
                alert('Error al agregar el usuario');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al conectar con el servidor');
        });
    });
}

// Función para control de préstamos
function initControlPrestamos() {
    const registerLoanBtn = document.getElementById('register-loan-btn');
    const fetchLoansBtn = document.getElementById('fetch-loans-btn');
    const saveReturnsBtn = document.getElementById('save-returns-btn');
    console.log("registro: ", registerLoanBtn);

    if (registerLoanBtn) {
        console.log("registerLoanBtn: ", registerLoanBtn);
        registerLoanBtn.addEventListener('click', () => {
            const bookId = document.getElementById('loan-book-id').value.trim();
            const userId = document.getElementById('loan-user-id').value.trim();

            if (!bookId || !userId) {
                alert('Por favor, complete todos los campos.');
                return;
            }

            fetch('http://localhost:3000/api/prestamos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookId, userId }),
            })
            .then(response => response.json())
            .then(data => {
                console.log("data: ", data);
                if (data.error) {
                    alert('Error al registrar el préstamo');
                } else {
                    alert(`Préstamo registrado exitosamente.\nFecha de devolución: ${data.endDate}`);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al conectar con el servidor');
            });
        });
    }

    if (fetchLoansBtn) {
        console.log("fetchLoansBtn: ", fetchLoansBtn);
        fetchLoansBtn.addEventListener('click', () => {
            const userId = document.getElementById('return-user-id').value.trim();

            if (!userId) {
                alert('Por favor, ingrese el ID del usuario.');
                return;
            }

            fetch(`http://localhost:3000/api/prestamos/${userId}`)
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
                    console.log("data: ", data);

                    const table = document.createElement('table');
                    table.className = 'table';
                    table.innerHTML = `
                        <thead>
                            <tr>
                                <th>ID del Libro</th>
                                <th>Título</th>
                                <th>Fecha Inicial</th>
                                <th>Fecha Final</th>
                                <th>Días Restantes</th>
                                <th>Seleccionar Entrega</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.map(book => {
                                const loanDate = new Date(book.Fecha_prestamo);
                                const returnDate = new Date(book.Fecha_devolucion);
                                const currentDate = new Date();
                                const daysRemaining = Math.floor((returnDate - currentDate) / (1000 * 60 * 60 * 24));
                                console.log("book: ", book);

                                return `
                                    <tr>
                                        <td>${book.bookID}</td>
                                        <td>${book.title}</td>
                                        <td>${loanDate.toLocaleDateString()}</td>
                                        <td>${returnDate.toLocaleDateString()}</td>
                                        <td style="color: ${daysRemaining < 0 ? 'red' : 'inherit'};">${daysRemaining} días</td>
                                        <td><input type="checkbox" data-book-id="${book.bookID}"></td>
                                    </tr>
                                `;
                            }).join('')}
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
        console.log("saveReturnsBtn: ", saveReturnsBtn);
        saveReturnsBtn.addEventListener('click', () => {
            const selectedBooks = Array.from(document.querySelectorAll('#loaned-books-table input[type="checkbox"]:checked'))
                .map(checkbox => checkbox.getAttribute('data-book-id'));

            if (selectedBooks.length === 0) {
                alert('Por favor, seleccione al menos un libro para devolver.');
                return;
            }
            console.log("selectedBooks: ", selectedBooks);

            fetch('http://localhost:3000/api/prestamos/devoluciones', {
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


function initConsultarUsuariosYPrestamos() {
    const executeQueryBtn = document.getElementById('execute-query-btn');
    const queryTypeSelect = document.getElementById('query-type');
    const rowsPerPageInput = document.getElementById('rows-per-page');
    const queryResultsDiv = document.getElementById('query-results');

    if (!executeQueryBtn || !queryTypeSelect || !rowsPerPageInput || !queryResultsDiv) return;

    executeQueryBtn.addEventListener('click', () => {
        const queryType = queryTypeSelect.value;
        const rowsPerPage = rowsPerPageInput.value;

        if (!queryType) {
            alert('Por favor, seleccione una consulta.');
            return;
        }
        console.log("queryType: ", queryType);
        console.log("rowsPerPage: ", rowsPerPage);

        fetch(`http://localhost:3000/api/consultas?type=${queryType}&limit=${rowsPerPage}`)
            .then(response => {
                console.log('Response status:', response.status);
                console.log('Response headers:', response.headers);
                return response.text(); // Cambiar a .text() para inspeccionar el contenido
            })
            .then(text => {
                //console.log('Response body:', text);
                return JSON.parse(text); // Intenta convertirlo a JSON manualmente
            })
            .then(data => {
                queryResultsDiv.innerHTML = ''; // Limpiar resultados previos

                if (data.length === 0) {
                    queryResultsDiv.innerHTML = '<p>No se encontraron resultados.</p>';
                    return;
                }

                // Crear tabla para mostrar los resultados
                const table = document.createElement('table');
                table.className = 'table table-striped';

                // Crear encabezados de la tabla
                const thead = document.createElement('thead');
                const headerRow = document.createElement('tr');
                Object.keys(data[0]).forEach(key => {
                    const th = document.createElement('th');
                    th.textContent = key;
                    headerRow.appendChild(th);
                });
                thead.appendChild(headerRow);
                table.appendChild(thead);

                // Crear cuerpo de la tabla
                const tbody = document.createElement('tbody');
                data.forEach(row => {
                    const tr = document.createElement('tr');
                    Object.values(row).forEach(value => {
                        const td = document.createElement('td');
                        td.textContent = value;
                        tr.appendChild(td);
                    });
                    tbody.appendChild(tr);
                });
                table.appendChild(tbody);

                queryResultsDiv.appendChild(table);
            })
            .catch(error => {
                console.error('Error al realizar la consulta:', error);
                queryResultsDiv.innerHTML = '<p>Error al realizar la consulta.</p>';
            });
    });
}
