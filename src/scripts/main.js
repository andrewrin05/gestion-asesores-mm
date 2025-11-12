const basePath = (() => {
    const scripts = document.getElementsByTagName('script');
    for (const script of scripts) {
        if (script.dataset && typeof script.dataset.basePath !== 'undefined') {
            return script.dataset.basePath;
        }
    }
    return '';
})();

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

    // Mobile menu (drawer) setup
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const desktopNavList = document.querySelector('#nav-menu');

    if (mobileToggle && desktopNavList) {
        const mobileMenu = document.createElement('nav');
        mobileMenu.className = 'mobile-menu';
        mobileMenu.setAttribute('aria-hidden', 'true');

        const menuHeader = document.createElement('div');
        menuHeader.className = 'mobile-menu__header';

        const menuTitle = document.createElement('span');
        menuTitle.className = 'mobile-menu__title';
        menuTitle.textContent = 'Menú';

        const closeButton = document.createElement('button');
        closeButton.className = 'mobile-menu__close';
        closeButton.type = 'button';
        closeButton.setAttribute('aria-label', 'Cerrar menú');
        closeButton.innerHTML = '&times;';

        menuHeader.append(menuTitle, closeButton);

        const mobileList = desktopNavList.cloneNode(true);
        mobileList.removeAttribute('id');
        mobileList.classList.add('mobile-menu__list');

        mobileMenu.append(menuHeader, mobileList);

        const overlay = document.createElement('div');
        overlay.className = 'mobile-menu-overlay';

        document.body.appendChild(overlay);
        document.body.appendChild(mobileMenu);

        const body = document.body;

        function openMenu() {
            mobileMenu.classList.add('open');
            overlay.classList.add('active');
            mobileToggle.classList.add('active');
            mobileToggle.setAttribute('aria-expanded', 'true');
            mobileMenu.setAttribute('aria-hidden', 'false');
            body.classList.add('mobile-menu-open');
        }

        function closeMenu() {
            mobileMenu.classList.remove('open');
            overlay.classList.remove('active');
            mobileToggle.classList.remove('active');
            mobileToggle.setAttribute('aria-expanded', 'false');
            mobileMenu.setAttribute('aria-hidden', 'true');
            body.classList.remove('mobile-menu-open');
        }

        mobileToggle.addEventListener('click', function() {
            if (mobileMenu.classList.contains('open')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        closeButton.addEventListener('click', closeMenu);
        overlay.addEventListener('click', closeMenu);

        mobileList.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && mobileMenu.classList.contains('open')) {
                closeMenu();
            }
        });
    }

    initServicesPreview();
    initPartnersMarquee();
    initCTAEventTracking();
});

function initServicesPreview() {
    const servicesGrid = document.querySelector('[data-services-grid]');
    if (!servicesGrid) {
        return;
    }

    fetch(`${basePath}data/services.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo cargar el listado de servicios');
            }
            return response.json();
        })
        .then(data => {
            const services = Array.isArray(data.services) ? data.services.slice(0, 8) : [];
            if (!services.length) {
                servicesGrid.innerHTML = '<p>No se encontraron servicios disponibles por el momento.</p>';
                return;
            }

            servicesGrid.innerHTML = '';
            services.forEach(service => {
                const card = document.createElement('div');
                card.className = 'service-card';
                card.innerHTML = `
                    <div class="service-card__header">
                        <div class="service-card__icon" aria-hidden="true">•</div>
                        <h3>${service.name}</h3>
                    </div>
                    <p>${service.description}</p>
                    <div class="service-card__meta">
                        <span>${service.coverage}</span>
                        <strong>${service.price}</strong>
                    </div>
                `;
                servicesGrid.appendChild(card);
            });
        })
        .catch(() => {
            servicesGrid.innerHTML = '<p class="service-card__error">No pudimos cargar los servicios. Intenta nuevamente más tarde.</p>';
        });
}

function initPartnersMarquee() {
    const track = document.querySelector('[data-partners-track]');
    if (!track) {
        return;
    }

    const partners = [
        'Mapfre',
        'Allianz',
        'AXA',
        'Generali',
        'Mutua Madrileña',
        'Liberty Seguros',
        'Santalucía',
        'Zurich'
    ];

    const fragment = document.createDocumentFragment();

    partners.concat(partners).forEach((partner, index) => {
        const badge = document.createElement('div');
        badge.className = 'partner-badge';
        badge.textContent = partner;
        badge.setAttribute('aria-label', partner);
        badge.setAttribute('role', 'img');
        badge.dataset.index = index;
        fragment.appendChild(badge);
    });

    track.innerHTML = '';
    track.appendChild(fragment);
}

function initCTAEventTracking() {
    if (typeof window.gtag !== 'function') {
        return;
    }

    const trackedElements = document.querySelectorAll('[data-track-event]');
    trackedElements.forEach(element => {
        element.addEventListener('click', () => {
            const eventName = element.dataset.trackEvent || 'cta_click';
            const eventCategory = element.dataset.trackCategory || 'cta';
            const eventLabel = element.dataset.trackLabel || element.textContent.trim();

            window.gtag('event', eventName, {
                event_category: eventCategory,
                event_label: eventLabel
            });
        });
    });
}