function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    
    
    // Aquí puedes agregar la lógica de autenticación, por ejemplo, una llamada a un API

    if (email === "test@gmail.com" && password === "password") {
        window.location.href = "/vista admin/main.html";
    } else {
        document.getElementById('errorlogin').innerText = "Credenciales incorrectas";
    }

    if (email === "fake@gmail.com" && password === "password") {
        window.location.href = "/vista usuario/index.html";
    } else {
        document.getElementById('errorlogin').innerText = "Credenciales incorrectas";
    }
}

