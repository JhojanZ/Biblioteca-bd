document.getElementById('add-user-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const userData = {
        name: document.getElementById('user-name').value,
        lastname: document.getElementById('user-lastname').value,
        email: document.getElementById('user-email').value,
        gender: document.getElementById('user-gender').value,
        age: document.getElementById('user-age').value,
        phone: document.getElementById('user-phone').value,
        address: document.getElementById('user-address').value,
        occupation: document.getElementById('user-occupation').value,
    };
    console.log(userData);

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
            document.getElementById('add-user-form').reset();
        } else {
            alert('Error al agregar el usuario');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al conectar con el servidor');
    });
});