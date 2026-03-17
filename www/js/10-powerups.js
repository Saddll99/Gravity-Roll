/* ================================================================
 * SECTION 8: POWER-UP SYSTEM
 * Three types: Slow (blue), Fast (orange), Double (green)
 * Spawn randomly near wall gaps, collected on contact.
 * ================================================================ */
const PU_TYPES = [
    {id:'slow',  color:[100,190,255], glow:[140,220,255], bonus:2},
    {id:'fast',  color:[255,120,50],  glow:[255,160,80],  bonus:4},
    {id:'double',color:[80,220,120], glow:[120,255,160], bonus:3}
];

function pickPU() {
    const r = Math.random();
    if (currentLevel < 5) return PU_TYPES[2];
    if (currentLevel < 10) {
        return r < 0.5 ? PU_TYPES[2] : PU_TYPES[0];
    }
    if (currentLevel >= 30) {
        if (r < 0.4) return PU_TYPES[0];
        if (r < 0.8) return PU_TYPES[2];
        return PU_TYPES[1];
    }
    return PU_TYPES[Math.floor(Math.random() * 3)];
}

function getPUDuration() { return 4000 }

function maybeSpawnPU() {
    if (freePUs.length >= PU_MAX_ONSCREEN) return;
    const interval = Math.max(550 * S, (950 - currentLevel * 15) * S);
    if (scrollOffset - lastPUSpawnDist < interval) return;
    const spawnChance = currentLevel >= 30 ? 0.08 : 0.12;
    if (Math.random() > spawnChance) return;

    const type = pickPU();
    const puR = ball.r;

    let refOb = null;
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const ob = obstacles[i];
        if (ob.x + ob.w >= logW && ob.gS > puR * 3) {
            refOb = ob;
            break;
        }
    }

    if (!refOb) return;

    const spawnX = logW + 260 * S;
    const pad = puR + 4 * S;
    const safeY = refOb.gY + pad + Math.random() * (refOb.gS - pad * 2);

    freePUs.push({ type, x:spawnX, y:safeY, r:puR, bob:Math.random()*Math.PI*2, gl:0, collected:false, soundPlayed:false });
    lastPUSpawnDist = scrollOffset;
}

function collectPU(pu) {
    pu.collected = true;
    itemsCollected++;
    noPowerUpRun = false;

    score += pu.type.bonus;
    scoreSpan.textContent = score;

    const dur = getPUDuration();
    const now = Date.now();
    if (pu.type.id === 'slow')        { activePU.slow = { on: true, end: now + dur }; stats.totalSlows++; }
    else if (pu.type.id === 'fast')   { activePU.fast = { on: true, end: now + dur }; stats.totalFasts++; }
    else if (pu.type.id === 'double') { activePU.dbl  = { on: true, end: now + dur }; }

    stats.totalItems++;
    sfxPuGet();
    vibPuGet();

    ulAch('fpu');
    if (pu.type.id === 'slow')   ulAch('sl');
    if (pu.type.id === 'fast')   ulAch('fa');
    if (pu.type.id === 'double') ulAch('dbl');
    if (itemsCollected >= 5)     ulAch('c5');
    if (itemsCollected >= 10)    ulAch('c10');
    if (itemsCollected >= 20)    ulAch('c20');
    if (stats.totalItems >= 25)  ulAch('i25');
    if (stats.totalItems >= 100) ulAch('i100');
    if (stats.totalItems >= 500) ulAch('i500');
}

try { const s=localStorage.getItem('gr_hs_v3'); if(s) highScore=parseInt(s)||0; highScoreSpan.textContent=highScore } catch(e) {}
function saveHS() { if(score>highScore){ highScore=score; highScoreSpan.textContent=highScore; try{localStorage.setItem('gr_hs_v3',String(highScore))}catch(e){} } }

function genOb() {
    const gs = diff.gapSize;
    const wm = WALL_MARGIN * S;
    const by = wm + Math.random() * (logH - gs - wm*2);
    obstacles.push({
        x: logW + 10 * S, gY: by, bY: by, gS: gs, w: OBSTACLE_WIDTH * S,
        counted: false, mp: Math.random()*Math.PI*2,
        mvType: Math.floor(Math.random()*5)
    });
}

function hitTest(ob) {
    if (godMode) return false;
    const bL=ball.x-ball.r, bR=ball.x+ball.r, bT=ball.y-ball.r, bB=ball.y+ball.r;
    if (bR > ob.x && bL < ob.x+ob.w) {
        if (bT < ob.gY || bB > ob.gY+ob.gS) return true;
    }
    return false;
}

function showLvl(lv) { levelUpText.textContent=T('level').toUpperCase()+' '+lv; levelUpFlash.style.display='flex'; levelUpText.style.animation='none'; void levelUpText.offsetWidth; levelUpText.style.animation='lvlFlash 1.8s ease-out forwards'; sfxLvlUp(); vibLvlUp(); setTimeout(()=>levelUpFlash.style.display='none',2000) }

pauseBtn.addEventListener('click', e => { e.stopPropagation(); if(!gameActive) return; paused=true; pauseScreen.style.display='flex'; pauseBtn.style.display='none' });
resumeBtn.addEventListener('click', () => { paused=false; pauseScreen.style.display='none'; pauseBtn.style.display='flex' });
function goMenu() {
    paused=false; gameActive=false; gameStarted=false;
    if(gameStartTime) stats.totalTimeSec += Math.floor((Date.now()-gameStartTime)/1000);
    saveStats(); checkShopAch();
    // Keep music playing in menu
    if (musicOn && !musicInterval) { ensureAudio(); startMusic(); }
    pauseScreen.style.display='none'; pauseBtn.style.display='none'; gameOverScreen.style.display='none'; startScreen.style.display='flex';
    puSlowInd.classList.remove('active'); puFastInd.classList.remove('active'); puDblInd.classList.remove('active');
    renderAch(); renderStats(); renderShop(); updateGemDisplay();
}
menuBtn.addEventListener('click', goMenu);
goMenuBtn.addEventListener('click', goMenu);

function updatePowerupTimers() {
    const now = Date.now();

    function tickPU(pu, indicator, timerEl) {
        if (!pu.on) return;
        const left = Math.max(0, pu.end - now);
        indicator.classList.add('active');
        timerEl.textContent = Math.ceil(left / 1000) + 's';
        if (left <= 0) {
            pu.on = false;
            indicator.classList.remove('active');
        }
    }

    tickPU(activePU.slow, puSlowInd, puSlowTimer);
    tickPU(activePU.fast, puFastInd, puFastTimer);
    tickPU(activePU.dbl,  puDblInd,  puDblTimer);
}

function getSpeedFactor() {
    if (activePU.slow.on && activePU.fast.on) return 1;
    if (activePU.slow.on) return 0.6;
    if (activePU.fast.on) return 1.12;
    return 1;
}

