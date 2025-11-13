const path = require('path');
const fs = require('fs');
const assert = require('assert/strict');
const { JSDOM } = require('jsdom');

function createMatchMedia(matches) {
    const mq = () => ({
        matches,
        media: '',
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {}
    });
    mq.matches = matches;
    return mq;
}

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

    window.matchMedia = (query) => {
        const base = {
            matches: true,
            media: query,
            addEventListener: () => {},
            removeEventListener: () => {},
            addListener: () => {},
            removeListener: () => {}
        };
        return base;
    };

    window.gtag = () => {};

    if (typeof window.String.prototype.normalize === 'function') {
        const nativeNormalize = window.String.prototype.normalize;
        window.String.prototype.normalize = function patchedNormalize(form) {
            if (typeof form === 'string') {
                try {
                    return nativeNormalize.call(this, form);
                } catch (error) {
                    return nativeNormalize.call(this, form.toUpperCase());
                }
            }
            return nativeNormalize.call(this, form);
        };
    }

    const scriptPath = path.join(__dirname, '..', 'src', 'scripts', 'main.js');
    const scriptContent = fs.readFileSync(scriptPath, 'utf8');
    window.eval(scriptContent);

    window.document.dispatchEvent(new window.Event('DOMContentLoaded', { bubbles: true }));

    await new Promise(resolve => setTimeout(resolve, 0));

    const serviceButtons = [...window.document.querySelectorAll('.service-btn')];
    const navCotizar = window.document.getElementById('navCotizar');

    assert.equal(serviceButtons.length, 2, 'Se esperaban dos botones de servicio en la maqueta');

    serviceButtons.forEach((btn) => {
        assert.ok(btn.href.startsWith('https://wa.me/34620916063'), 'El botón de servicio no apunta a WhatsApp');
        assert.equal(btn.target, '_blank', 'El botón de servicio debería abrirse en una pestaña nueva en móvil');
    });

    assert.ok(navCotizar.href.startsWith('https://wa.me/34620916063'), 'El enlace general de cotización no apunta a WhatsApp en móvil');

    const decodedMessage = decodeURIComponent(serviceButtons[0].href.split('text=')[1] || '');
    assert.ok(decodedMessage.includes('Hola, me gustaria recibir informacion'), 'El mensaje prellenado no es el esperado');

    console.log('✅ Verificación móvil: todos los botones de servicios y enlaces de cotizar apuntan a WhatsApp.');
}

runCheck().catch((error) => {
    console.error('❌ La verificación falló:', error.message);
    process.exitCode = 1;
});
