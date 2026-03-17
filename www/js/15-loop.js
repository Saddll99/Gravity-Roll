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
// [moved to 99-init.js] highScoreSpan.textContent = highScore;
// [moved to 99-init.js] currentTheme = getTheme(1); initDT(currentTheme);

// Start music on first user interaction (required for AudioContext)
