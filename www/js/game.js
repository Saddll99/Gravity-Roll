/* ================================================================
 * SECTION 11: GAME LIFECYCLE
 * Start, game over, restart, pause, menu navigation.
 * ================================================================ */
function gameOver() {
    gameActive = false;
    gameStarted = false;
    saveHS();
    sfxDie();
    vibDie();

    // Track game duration for ad frequency
    adLastGameDuration = gameStartTime ? Math.floor((Date.now() - gameStartTime) / 1000) : 0;

    stats.totalGames++;
    if (score > stats.bestScore) stats.bestScore = score;
    if (currentLevel > stats.bestLevel) stats.bestLevel = currentLevel;
    if (gameStartTime) stats.totalTimeSec += Math.floor((Date.now() - gameStartTime) / 1000);
    saveStats();
    checkShopAch();

    if (stats.totalGames >= 10)  ulAch('g10');
    if (stats.totalGames >= 50)  ulAch('g50');
    if (stats.totalGames >= 100) ulAch('g100');
    if (stats.totalGames >= 500) ulAch('g500');
    if (stats.totalTimeSec >= 1800) ulAch('tm');
    if (stats.totalTimeSec >= 7200) ulAch('t2h');
    if (stats.totalTimeSec >= 36000) ulAch('t10h');

    goGems.textContent = sessionGems;
    finalScoreSpan.textContent = score;
    bestDisplay.textContent = T('best') + ': ' + highScore;
    newHighSpan.textContent = (score >= highScore && score > 0) ? T('newHigh') : '';
    goLevel.textContent = currentLevel;
    goItems.textContent = itemsCollected;

    // Show extra life button (only once per run, and only if score > 3)
    if (!adExtraLifeUsed && score > 3) {
        extraLifeBtn.style.display = 'flex';
    } else {
        extraLifeBtn.style.display = 'none';
    }

    gameOverScreen.style.display = 'flex';
    readyText.style.display = 'none';
    pauseBtn.style.display = 'none';
    puSlowInd.classList.remove('active');
    puFastInd.classList.remove('active');
    puDblInd.classList.remove('active');

    // Show interstitial ad every 2-3 deaths (after screen is visible)
    if (shouldShowInterstitial()) {
        setTimeout(() => showInterstitialAd(), 600);
    }
}

function startGame() {
    ensureAudio();
    if (musicOn && !musicInterval) startMusic();

    gameActive = true;
    gameStarted = false;
    paused = false;
    score = 0;
    currentLevel = 1;
    lastLevel = 1;
    frameCount = 0;
    scrollOffset = 0;
    itemsCollected = 0;
    noPowerUpRun = true;
    lastPUSpawnDist = 0;
    sessionClicks = 0;
    sessionGems = 0;
    adExtraLifeUsed = false;

    scoreSpan.textContent = '0';
    levelBadge.textContent = T('level').toUpperCase() + ' 1';

    diff = getDiff(1);
    speed = diff.baseSpeed;
    ball.r = BALL_BASE_RADIUS * S;
    ball.grav = diff.gravity;
    ball.y = logH / 2;
    ball.vy = 0;
    ball.gDir = 1;

    obstacles = [];
    particles = [];
    freePUs = [];
    activePU = { slow: { on: false, end: 0 }, fast: { on: false, end: 0 }, dbl: { on: false, end: 0 } };

    genOb();
    obstacles[0].x = logW + diff.firstDelay;

    currentTheme = getTheme(1);
    initDT(currentTheme);
    initStars();

    startScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';
    pauseScreen.style.display = 'none';
    readyText.style.display = 'block';
    pauseBtn.style.display = 'flex';
    gameStartTime = 0;
}

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

/* ================================================================
 * SECTION 13: GAME LOOP
 * Fixed timestep: physics runs exactly 60x/sec regardless of
 * display refresh rate (30Hz, 60Hz, 120Hz, 240Hz all play the same).
 * Rendering happens every frame for smooth visuals.
 * ================================================================ */
function loop(timestamp) {
    if (!lastTimestamp) { lastTimestamp = timestamp; }
    const elapsed = Math.min(timestamp - lastTimestamp, 100); // cap at 100ms to avoid spiral of death
    lastTimestamp = timestamp;

    // Fixed timestep: accumulate time, run physics in fixed 60fps steps
    accumulator += elapsed;
    while (accumulator >= PHYSICS_DT) {
        update();
        accumulator -= PHYSICS_DT;
    }

    // FPS counter (for lowPerfMode detection only)
    fpsAccum += elapsed; fpsCount++;
    if (fpsAccum > 1000) {
        fps = Math.round(fpsCount * 1000 / fpsAccum);
        lowPerfMode = fps < 40;
        fpsAccum = 0; fpsCount = 0;
    }

    draw();
    requestAnimationFrame(loop);
}

function resize() {
    const c = document.getElementById('gameContainer');
    dpr = window.devicePixelRatio || 1;
    logW = c.clientWidth;
    logH = c.clientHeight;
    S = logH / REF_H;
    canvas.width = logW * dpr;
    canvas.height = logH * dpr;
    canvas.style.width = logW + 'px';
    canvas.style.height = logH + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ball.x = logW * 0.22;
    ball.y = logH / 2;
    ball.r = BALL_BASE_RADIUS * S;
    diff = getDiff(currentLevel || 1);
    speed = diff.baseSpeed;
    ball.grav = diff.gravity;
    initStars();
}
window.addEventListener('resize', resize); resize();
highScoreSpan.textContent = highScore;
currentTheme = getTheme(1); initDT(currentTheme);

// Start music on first user interaction (required for AudioContext)
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

requestAnimationFrame(loop);

