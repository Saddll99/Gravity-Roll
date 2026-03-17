/* ================================================================
 * 01-native.js — Capacitor Bridge, Fullscreen, Status Bar
 * ================================================================ */
(async function initNative() {
    /* ===== Fullscreen for ALL environments ===== */
    // Try Web Fullscreen API (works in some WebViews)
    function tryFullscreen() {
        var el = document.documentElement;
        var rfs = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen;
        if (rfs) rfs.call(el).catch(function(){});
    }
    document.addEventListener('click', function once() {
        tryFullscreen();
        document.removeEventListener('click', once);
    });

    /* ===== Capacitor Native ===== */
    if (!window.Capacitor) return;
    try {
        const { StatusBar, Style } = await import('@capacitor/status-bar');
        const { ScreenOrientation } = await import('@capacitor/screen-orientation');
        const { Haptics, ImpactStyle } = await import('@capacitor/haptics');

        // Hide status bar completely
        await StatusBar.setOverlaysWebView({ overlay: true }).catch(() => {});
        await StatusBar.hide().catch(() => {});
        await StatusBar.setStyle({ style: Style.Dark }).catch(() => {});

        // Lock portrait
        await ScreenOrientation.lock({ orientation: 'portrait' }).catch(() => {});

        // Haptics
        window.nativeHaptic = async () => {
            try { await Haptics.impact({ style: ImpactStyle.Light }); } catch(e) {}
        };

        console.log('[Gravity Roll] Native features initialized');
    } catch(e) {
        console.log('[Gravity Roll] Running in browser mode');
    }
})();
