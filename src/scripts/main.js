// This file contains JavaScript code for any interactive features on the website, such as form validation or dynamic content loading.

document.addEventListener('DOMContentLoaded', function() {
    // Form validation for the contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !message) {
                event.preventDefault();
                alert('Por favor, completa todos los campos obligatorios.');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                event.preventDefault();
                alert('Por favor, ingresa un correo electrónico válido.');
                return;
            }

            // Formspree will handle the submission
        });
    }

    // Form validation for the quote form
    const quoteForm = document.getElementById('quote-form');
    if (quoteForm) {
        quoteForm.addEventListener('submit', function(event) {
            const nombre = document.getElementById('nombre').value.trim();
            const apellidos = document.getElementById('apellidos').value.trim();
            const dni = document.getElementById('dni').value.trim();
            const matricula = document.getElementById('matricula').value.trim();
            const fechaNacimiento = document.getElementById('fecha_nacimiento').value;
            const fechaCarnet = document.getElementById('fecha_carnet').value;
            const codigoPostal = document.getElementById('codigo_postal').value.trim();
            const marca = document.getElementById('marca').value.trim();
            const modelo = document.getElementById('modelo').value.trim();

            if (!nombre || !apellidos || !dni || !matricula || !fechaNacimiento || !fechaCarnet || !codigoPostal || !marca || !modelo) {
                event.preventDefault();
                alert('Por favor, completa todos los campos.');
                return;
            }

            // Basic DNI/NIE validation (Spanish format)
            const dniNieRegex = /^(\d{8}[A-Z]|[XYZ]\d{7}[A-Z])$/i;
            if (!dniNieRegex.test(dni.toUpperCase())) {
                event.preventDefault();
                alert('Por favor, ingresa un DNI (8 dígitos + letra) o NIE (X/Y/Z + 7 dígitos + letra) válido.');
                return;
            }

            // Basic matricula validation (Spanish format)
            const matriculaRegex = /^\d{4}[A-Z]{3}$/;
            if (!matriculaRegex.test(matricula.toUpperCase())) {
                event.preventDefault();
                alert('Por favor, ingresa una matrícula válida (4 dígitos + 3 letras).');
                return;
            }

            // Formspree will handle the submission
        });
    }
});