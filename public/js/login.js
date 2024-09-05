document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById("loginForm");
    
    loginForm.addEventListener("submit", function(event) {
        const email = document.getElementById("email").value;
        const pass = document.getElementById("password").value;

        if (!email || !pass) {
            event.preventDefault();
            alert("Por favor, rellene todos los campos.");
        }
    });
});
