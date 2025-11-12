document.addEventListener('DOMContentLoaded', function() {
    // Dynamic vehicle type functionality
    const tipoVehiculoSelect = document.getElementById('tipo_vehiculo');
    const marcaLabel = document.querySelector('label[for="marca"]');
    const modeloLabel = document.querySelector('label[for="modelo"]');
    const submitButton = document.querySelector('#quote-form button[type="submit"]');

    if (tipoVehiculoSelect && marcaLabel && modeloLabel) {
        tipoVehiculoSelect.addEventListener('change', function() {
            const selectedValue = this.value;
            if (selectedValue === 'coche') {
                marcaLabel.textContent = 'Marca del Coche';
                modeloLabel.textContent = 'Modelo del Coche';
            } else if (selectedValue === 'moto') {
                marcaLabel.textContent = 'Marca de la Moto';
                modeloLabel.textContent = 'Modelo de la Moto';
            } else {
                marcaLabel.textContent = 'Marca del Coche/Moto';
                modeloLabel.textContent = 'Modelo del Coche/Moto';
            }
        });
    }

    // Enhanced submit button functionality
    if (submitButton) {
        submitButton.addEventListener('click', function(e) {
            // Add loading state
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            this.disabled = true;
            this.style.opacity = '0.7';

            // Re-enable after 3 seconds (in case of error)
            setTimeout(() => {
                this.innerHTML = 'Enviar Cotización';
                this.disabled = false;
                this.style.opacity = '1';
            }, 3000);
        });
    }
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

    // Close drawer on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
            closeDrawer();
        }
    });
});