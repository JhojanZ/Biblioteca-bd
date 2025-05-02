function login(){
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    console.log(username, password);

    fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Credenciales inválidas');
        }
        return response.json();
    })
    .then(data => {
        alert(data.message);
        window.location.href = '../Administrador/Administrador.html';
    })
    .catch(error => alert(error.message));
}
