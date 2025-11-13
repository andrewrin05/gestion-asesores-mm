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
                sendAnalyticsEvent('form_validation_error', 'form', 'contacto', 'campo_incompleto');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                event.preventDefault();
                alert('Por favor, ingresa un correo electrónico válido.');
                sendAnalyticsEvent('form_validation_error', 'form', 'contacto', 'email_invalido');
                return;
            }

            sendAnalyticsEvent('form_submit', 'form', 'contacto');
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
                sendAnalyticsEvent('form_validation_error', 'form', 'cotizacion', 'campo_incompleto');
                return;
            }

            // Basic DNI/NIE validation (Spanish format)
            const dniNieRegex = /^(\d{8}[A-Z]|[XYZ]\d{7}[A-Z])$/i;
            if (!dniNieRegex.test(dni.toUpperCase())) {
                event.preventDefault();
                alert('Por favor, ingresa un DNI (8 dígitos + letra) o NIE (X/Y/Z + 7 dígitos + letra) válido.');
                sendAnalyticsEvent('form_validation_error', 'form', 'cotizacion', 'dni_invalido');
                return;
            }

            // Basic matricula validation (Spanish format)
            const matriculaRegex = /^\d{4}[A-Z]{3}$/;
            if (!matriculaRegex.test(matricula.toUpperCase())) {
                event.preventDefault();
                alert('Por favor, ingresa una matrícula válida (4 dígitos + 3 letras).');
                sendAnalyticsEvent('form_validation_error', 'form', 'cotizacion', 'matricula_invalida');
                return;
            }

            sendAnalyticsEvent('form_submit', 'form', 'cotizacion');
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

    initPartnersMarquee();
    initCTAEventTracking();
    initFormTracking();
    initServiceMobileRedirect();
    initMobileWhatsappCTA();
    initIntroVideoAutoplay();
});

function sendAnalyticsEvent(eventName, category, label, value) {
    if (typeof window.gtag !== 'function') {
        return;
    }

    const eventPayload = {
        event_category: category,
        event_label: label
    };

    if (typeof value !== 'undefined') {
        eventPayload.value = value;
    }

    window.gtag('event', eventName, eventPayload);
}

function formatWhatsappNumber(rawNumber, options = {}) {
    const { countryCode = '34', fallback } = options;
    const sanitize = (value) => (value || '').replace(/\D/g, '');

    let digits = sanitize(rawNumber);
    if (!digits && fallback) {
        digits = sanitize(fallback);
    }

    if (!digits) {
        return '';
    }

    if (digits.startsWith(countryCode)) {
        return digits;
    }

    return `${countryCode}${digits.replace(/^0+/, '')}`;
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
    const trackedElements = document.querySelectorAll('[data-track-event]');
    trackedElements.forEach(element => {
        element.addEventListener('click', () => {
            const eventName = element.dataset.trackEvent || 'cta_click';
            const eventCategory = element.dataset.trackCategory || 'cta';
            const eventLabel = element.dataset.trackLabel || element.textContent.trim();

            sendAnalyticsEvent(eventName, eventCategory, eventLabel);
        });
    });
}

function initFormTracking() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        setupFormAnalytics(contactForm, 'contacto');
    }

    const quoteForm = document.getElementById('quote-form');
    if (quoteForm) {
        setupFormAnalytics(quoteForm, 'cotizacion');
    }
}

function initServiceMobileRedirect() {
    const serviceButtons = document.querySelectorAll('.service-btn');
    if (!serviceButtons.length) {
        return;
    }

    const defaultWhatsappNumber = '620916063';
    const hipotecaWhatsappNumber = '628449014';
    const mobileQuery = window.matchMedia('(max-width: 768px)');

    const updateButtons = () => {
        serviceButtons.forEach((button) => {
            if (typeof button.dataset.originalHref === 'undefined') {
                button.dataset.originalHref = button.getAttribute('href') || '#';
            }

            if (typeof button.dataset.desktopTarget === 'undefined') {
                button.dataset.desktopTarget = button.getAttribute('target') || '';
            }

            if (typeof button.dataset.desktopRel === 'undefined') {
                button.dataset.desktopRel = button.getAttribute('rel') || '';
            }

            const cardHeading = button.closest('.service-detailed-card')?.querySelector('.service-header h3');
            const serviceName = (cardHeading ? cardHeading.textContent : button.textContent || '').trim();
            if (!serviceName) {
                return;
            }

            const normalizedService = serviceName
                .toLowerCase()
                .normalize('nfd')
                .replace(/[\u0300-\u036f]/g, '');
            const isVehicleQuote = normalizedService.includes('seguro de automovil');
            const isMotoQuote = normalizedService.includes('seguro de moto');
            const usesQuotePage = isVehicleQuote || isMotoQuote;

            const originalHref = button.dataset.originalHref;
            let desktopHref = originalHref;

            if (!usesQuotePage) {
                if (originalHref.includes('cotizar.html')) {
                    desktopHref = originalHref.replace('cotizar.html', 'contact.html');
                } else if (originalHref.includes('cotizar')) {
                    desktopHref = originalHref.replace('cotizar', 'contact');
                } else if (!originalHref.includes('contact')) {
                    desktopHref = 'contact.html';
                }
            }

            button.dataset.desktopHref = desktopHref;

            if (mobileQuery.matches && !usesQuotePage) {
                const whatsappNumber = normalizedService.includes('hipoteca')
                    ? formatWhatsappNumber(hipotecaWhatsappNumber, { fallback: defaultWhatsappNumber })
                    : formatWhatsappNumber(defaultWhatsappNumber);
                const message = `Hola, me gustaria recibir informacion sobre ${serviceName}.`;
                const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

                button.setAttribute('href', whatsappURL);
                button.setAttribute('target', '_blank');
                button.setAttribute('rel', 'noopener noreferrer');
            } else {
                button.setAttribute('href', desktopHref);

                if (button.dataset.desktopTarget) {
                    button.setAttribute('target', button.dataset.desktopTarget);
                } else {
                    button.removeAttribute('target');
                }

                if (button.dataset.desktopRel) {
                    button.setAttribute('rel', button.dataset.desktopRel);
                } else {
                    button.removeAttribute('rel');
                }
            }
        });
    };

    updateButtons();

    if (typeof mobileQuery.addEventListener === 'function') {
        mobileQuery.addEventListener('change', updateButtons);
    } else if (typeof mobileQuery.addListener === 'function') {
        mobileQuery.addListener(updateButtons);
    }
}

function initMobileWhatsappCTA() {
    const whatsappCTAs = document.querySelectorAll('[data-mobile-whatsapp-number]');
    if (!whatsappCTAs.length) {
        return;
    }

    const mobileQuery = window.matchMedia('(max-width: 768px)');

    const updateLinks = () => {
        whatsappCTAs.forEach((cta) => {
            if (!cta.dataset.desktopHref) {
                cta.dataset.desktopHref = cta.getAttribute('href') || '#';
            }

            if (typeof cta.dataset.desktopTarget === 'undefined') {
                cta.dataset.desktopTarget = cta.getAttribute('target') || '';
            }

            if (typeof cta.dataset.desktopRel === 'undefined') {
                cta.dataset.desktopRel = cta.getAttribute('rel') || '';
            }

            if (mobileQuery.matches) {
                const rawNumber = cta.dataset.mobileWhatsappNumber;
                const message = cta.dataset.mobileWhatsappMessage || '';
                const formattedNumber = formatWhatsappNumber(rawNumber, { fallback: rawNumber });
                if (!formattedNumber) {
                    return;
                }

                const whatsappURL = `https://wa.me/${formattedNumber}?text=${encodeURIComponent(message)}`;
                cta.setAttribute('href', whatsappURL);
                cta.setAttribute('target', '_blank');
                cta.setAttribute('rel', 'noopener noreferrer');
            } else {
                cta.setAttribute('href', cta.dataset.desktopHref);

                if (cta.dataset.desktopTarget) {
                    cta.setAttribute('target', cta.dataset.desktopTarget);
                } else {
                    cta.removeAttribute('target');
                }

                if (cta.dataset.desktopRel) {
                    cta.setAttribute('rel', cta.dataset.desktopRel);
                } else {
                    cta.removeAttribute('rel');
                }
            }
        });
    };

    updateLinks();

    if (typeof mobileQuery.addEventListener === 'function') {
        mobileQuery.addEventListener('change', updateLinks);
    } else if (typeof mobileQuery.addListener === 'function') {
        mobileQuery.addListener(updateLinks);
    }
}

function setupFormAnalytics(form, formName) {
    let started = false;

    form.addEventListener('focusin', () => {
        if (!started) {
            sendAnalyticsEvent('form_start', 'form', formName);
            started = true;
        }
    });

    form.addEventListener('click', (event) => {
        const target = event.target;
        if (!target) {
            return;
        }

        if (target.matches('button[type="submit"], input[type="submit"]')) {
            sendAnalyticsEvent('form_cta_click', 'form', formName);
        }
    });
}

function initIntroVideoAutoplay() {
    const introVideo = document.querySelector('.intro-video__ratio video');
    if (!introVideo) {
        return;
    }

    const unmuteButton = document.querySelector('[data-video-unmute]');

    introVideo.setAttribute('muted', '');
    introVideo.setAttribute('autoplay', '');
    introVideo.setAttribute('playsinline', '');
    introVideo.setAttribute('webkit-playsinline', '');
    introVideo.setAttribute('preload', 'auto');
    introVideo.removeAttribute('loop');
    introVideo.defaultMuted = true;
    introVideo.autoplay = true;
    introVideo.muted = true;
    introVideo.volume = 0;
    introVideo.loop = false;
    introVideo.playsInline = true;
    introVideo.preload = 'auto';
    introVideo.load();

    const showUnmuteHint = () => {
        if (!unmuteButton) {
            return;
        }
        const shouldShow = introVideo.muted || introVideo.volume === 0;
        unmuteButton.hidden = !shouldShow;
    };

    if (unmuteButton) {
        unmuteButton.addEventListener('click', () => {
            introVideo.muted = false;
            introVideo.defaultMuted = false;
            introVideo.volume = 1;
            introVideo.removeAttribute('muted');
            introVideo.play().catch(() => {});
            showUnmuteHint();
        });
    }

    introVideo.addEventListener('volumechange', showUnmuteHint);

    introVideo.addEventListener('ended', () => {
        introVideo.autoplay = false;
        introVideo.removeAttribute('autoplay');
        introVideo.loop = false;
        introVideo.removeAttribute('loop');
        introVideo.pause();
        showUnmuteHint();
    }, { once: true });

    let playAttempts = 0;
    const maxAutoRetries = 3;

    const tryPlay = () => {
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            showUnmuteHint();
            return;
        }

        if (playAttempts >= maxAutoRetries) {
            showUnmuteHint();
            return;
        }

        playAttempts += 1;
        const playPromise = introVideo.play();
        if (playPromise && typeof playPromise.then === 'function') {
            playPromise.catch((error) => {
                console.warn('Intro video autoplay blocked', error);
                let cleanup;

                const resumeOnInteraction = () => {
                    const manualPlay = introVideo.play();
                    if (manualPlay && typeof manualPlay.then === 'function') {
                        manualPlay.then(() => {
                            cleanup();
                        }).catch(() => {
                            cleanup();
                        });
                    } else {
                        cleanup();
                    }
                };

                cleanup = () => {
                    window.removeEventListener('scroll', resumeOnInteraction);
                    window.removeEventListener('click', resumeOnInteraction);
                    window.removeEventListener('touchstart', resumeOnInteraction);
                    window.removeEventListener('pointerdown', resumeOnInteraction);
                };

                window.addEventListener('scroll', resumeOnInteraction, { once: true });
                window.addEventListener('click', resumeOnInteraction, { once: true });
                window.addEventListener('touchstart', resumeOnInteraction, { once: true });
                window.addEventListener('pointerdown', resumeOnInteraction, { once: true });

                if (playAttempts < maxAutoRetries) {
                    setTimeout(tryPlay, 400);
                } else {
                    showUnmuteHint();
                }
            });
        }
    };

    if (introVideo.readyState >= 2) {
        tryPlay();
    } else {
        introVideo.addEventListener('loadeddata', tryPlay, { once: true });
    }

    window.addEventListener('load', tryPlay, { once: true });
    introVideo.addEventListener('canplaythrough', tryPlay, { once: true });

    showUnmuteHint();
}



