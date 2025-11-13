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
        url: 'https://gestion-asesores-mm.vercel.app/pages/services.html',
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

    const serviceButtons = [...window.document.querySelectorAll('.service-btn')];
    const navCotizar = window.document.getElementById('navCotizar');

    assert.equal(serviceButtons.length, 2, 'Se esperaban dos botones de servicio en la maqueta');

    serviceButtons.forEach((btn) => {
        assert.ok(!btn.href.includes('wa.me'), 'El botón de servicio no debería apuntar a dominios externos');
        assert.ok(btn.href.endsWith('/pages/contact.html'), 'El botón de servicio debería enlazar con contact.html');
        assert.equal(btn.getAttribute('target'), null, 'El botón de servicio no debería forzar apertura en otra pestaña');
        assert.equal(btn.getAttribute('rel'), null, 'El botón de servicio no debería añadir atributos rel especiales');
    });

    assert.ok(navCotizar.href.endsWith('/pages/cotizar.html'), 'El enlace general de cotización debería conservar su ruta');
    assert.ok(!navCotizar.href.includes('wa.me'), 'El enlace general de cotización no debería apuntar a dominios externos');

    console.log('✅ Verificación móvil: los botones mantienen enlaces internos sin referencias externas.');
}

runCheck().catch((error) => {
    console.error('❌ La verificación falló:', error.message);
    process.exitCode = 1;
});
