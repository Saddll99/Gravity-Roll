/* ================================================================
 * SECTION 12: INPUT HANDLING
 * Touch, click, and keyboard (Space/Escape) input.
 * ================================================================ */
function handleInput(e) {
    if (e) e.preventDefault();
    if (paused || !gameActive) return;

    if (!gameStarted) {
        gameStarted = true;
        readyText.style.display = 'none';
        gameStartTime = Date.now();
        sfxTap();
        return;
    }

    ball.gDir *= -1;
    ball.vy *= 0.3;

    // Haptic feedback
    vibTap();

    sessionClicks++;
    stats.totalClicks++;
    checkClickAch();

    const sk = getSkinColors();
    spawnP(ball.x, ball.y, 3, sk.c1);
    sfxTap();
}
canvas.addEventListener('click', handleInput);
canvas.addEventListener('touchstart', handleInput, {passive:false});
document.addEventListener('keydown', e => {
    if(e.code==='Space') handleInput(e);
    if(e.code==='Escape' && gameActive && !paused) { paused=true; pauseScreen.style.display='flex'; pauseBtn.style.display='none' }
    else if(e.code==='Escape' && paused) { paused=false; pauseScreen.style.display='none'; pauseBtn.style.display='flex' }
});
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);

