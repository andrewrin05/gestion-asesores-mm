const path = require('path');
const fs = require('fs');
const assert = require('assert/strict');
const { JSDOM } = require('jsdom');

async function runCheck() {
    const html = `<!DOCTYPE html>
<html lang="es">
<head></head>
<body>
    <div class="services-detailed-grid">
        <div class="service-detailed-card">
            <div class="service-header"><h3>Seguro de Vida</h3></div>
            <a href="cotizar.html" class="service-btn">Cotizar Vida</a>
        </div>
        <div class="service-detailed-card">
            <div class="service-header"><h3>Servicio de Hipoteca</h3></div>
            <a href="cotizar.html" class="service-btn">Cotizar Hipoteca</a>
        </div>
    </div>
    <nav>
        <a href="pages/cotizar.html" id="navCotizar">Cotiza tu coche o moto</a>
    </nav>
    <script data-base-path="../"></script>
</body>
</html>`;

    const dom = new JSDOM(html, {
        url: 'https://gestionyasesoresmm.com/pages/services.html',
        runScripts: 'dangerously',
        pretendToBeVisual: true
    });

    const { window } = dom;

    window.matchMedia = (query) => ({
        matches: true,
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {}
    });

    window.gtag = () => {};

    if (typeof window.String.prototype.normalize === 'function') {
        window.String.prototype.normalize = undefined;
    }

    const scriptPath = path.join(__dirname, '..', 'src', 'scripts', 'main.js');
    const scriptContent = fs.readFileSync(scriptPath, 'utf8');
    window.eval(scriptContent);

    window.document.dispatchEvent(new window.Event('DOMContentLoaded', { bubbles: true }));

    await new Promise((resolve) => setTimeout(resolve, 0));

    const allServiceButtons = [...window.document.querySelectorAll('.service-btn')];
    const whatsappButtons = allServiceButtons.filter((btn) => btn.classList.contains('service-btn--whatsapp'));
    const contactButtons = allServiceButtons.filter((btn) => !btn.classList.contains('service-btn--whatsapp'));
    const navCotizar = window.document.getElementById('navCotizar');

    assert.equal(contactButtons.length, 2, 'Se esperaban dos botones internos de servicio en la maqueta');
    assert.equal(whatsappButtons.length, 2, 'Cada servicio debería generar un botón de WhatsApp');

    contactButtons.forEach((btn) => {
        assert.ok(!btn.href.includes('wa.me'), 'El botón principal no debería apuntar a dominios externos');
        assert.ok(btn.href.endsWith('/pages/contact.html'), 'El botón principal debería enlazar con contact.html');
        assert.equal(btn.getAttribute('target'), null, 'El botón principal no debería forzar apertura en otra pestaña');
        assert.equal(btn.getAttribute('rel'), null, 'El botón principal no debería añadir atributos rel especiales');
    });

    whatsappButtons.forEach((btn) => {
        assert.ok(btn.href.startsWith('https://wa.me/34620916063'), 'El botón de WhatsApp debe apuntar al número configurado');
        assert.ok(btn.href.includes('text='), 'El botón de WhatsApp debe incluir un mensaje predefinido');
        assert.equal(btn.getAttribute('target'), '_blank', 'El botón de WhatsApp debería abrirse en una pestaña nueva');
    });

    assert.ok(navCotizar.href.endsWith('/pages/cotizar.html'), 'El enlace general de cotización debería conservar su ruta');
    assert.ok(!navCotizar.href.includes('wa.me'), 'El enlace general de cotización no debería apuntar a dominios externos');

    console.log('✅ Verificación móvil: botones internos intactos y botones de WhatsApp generados correctamente.');
}

runCheck().catch((error) => {
    console.error('❌ La verificación falló:', error.message);
    process.exitCode = 1;
});
