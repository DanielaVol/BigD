document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const errorMessage = document.getElementById('error-message');

    // Mapeo de usuarios válidos
    const validUsers = {
        'ana.torres@fiuba.edu.ar': {
            role: 'estudiante',
            name: 'Ana Torres',
            redirect: 'estudiante.html'
        },
        'mariana.lopez@fiuba.edu.ar': {
            role: 'docente',
            name: 'Mariana López',
            redirect: 'docente.html'
        }
    };

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Evitar el envío real del formulario

        const email = emailInput.value.trim().toLowerCase();

        // Resetear mensaje de error
        errorMessage.style.display = 'none';
        errorMessage.textContent = '';

        // Validar usuario
        if (validUsers[email]) {
            const user = validUsers[email];

            // Guardar datos en localStorage para mantener sesión en la demo
            localStorage.setItem('juntos_user_role', user.role);
            localStorage.setItem('juntos_user_email', email);
            localStorage.setItem('juntos_user_name', user.name);

            // Redirigir a la vista correspondiente
            window.location.href = user.redirect;
        } else {
            // Mostrar error si no es un usuario válido para la demo
            errorMessage.textContent = 'Usuario no reconocido en la demo';
            errorMessage.style.display = 'block';
        }
    });
});
