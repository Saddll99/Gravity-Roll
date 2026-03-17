/* ================================================================
 * 99-init.js — Initialization
 * Runs AFTER all other scripts are loaded.
 * All function definitions are available at this point.
 * ================================================================ */

// Apply language (also updates all UI text)
applyLang();

// Initialize shop display
updateGemDisplay();
renderShop();

// Initialize statistics & achievements
renderStats();
renderAch();

// Initialize ads
initAdMob();

highScoreSpan.textContent = highScore;
currentTheme = getTheme(1); initDT(currentTheme);

// Start the game loop
requestAnimationFrame(loop);

// Start menu music on first user interaction
let menuMusicStarted = false;
function startMenuMusic() {
    if (menuMusicStarted) return;
    menuMusicStarted = true;
    if (musicOn) { ensureAudio(); startMusic(); }
    document.removeEventListener('click', startMenuMusic);
    document.removeEventListener('touchstart', startMenuMusic);
}
document.addEventListener('click', startMenuMusic);
document.addEventListener('touchstart', startMenuMusic);
