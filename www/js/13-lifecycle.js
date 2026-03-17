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

