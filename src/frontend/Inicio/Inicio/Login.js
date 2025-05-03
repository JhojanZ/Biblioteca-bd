function login(){
    const username = document.getElementById('username').value.trim();
    let password = document.getElementById('password').value.trim();
    const encryptedPassword = CryptoJS.SHA256(password).toString();
    console.log(username, encryptedPassword);

    fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, encryptedPassword })
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
