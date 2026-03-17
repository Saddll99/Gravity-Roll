/* ================================================================
 * 16-legal.js — Impressum & Datenschutz Modal Handlers
 * ================================================================ */
(function() {
    var im = document.getElementById('impressumModal');
    var dm = document.getElementById('datenschutzModal');
    var ft = document.getElementById('legalFooter');
    document.getElementById('openImpressum').addEventListener('click', function(e) { e.preventDefault(); im.classList.add('active'); });
    document.getElementById('closeImpressum').addEventListener('click', function() { im.classList.remove('active'); });
    document.getElementById('openDatenschutz').addEventListener('click', function(e) { e.preventDefault(); dm.classList.add('active'); });
    document.getElementById('closeDatenschutz').addEventListener('click', function() { dm.classList.remove('active'); });
    var obs = new MutationObserver(function() {
        var ss = document.getElementById('startScreen');
        ft.style.display = (ss && ss.style.display !== 'none') ? 'block' : 'none';
    });
    var ss = document.getElementById('startScreen');
    if (ss) obs.observe(ss, { attributes: true, attributeFilter: ['style'] });
})();
