/* ================================================================
 * SECTION 9: PHYSICS
 * Ball gravity, wall movement, collision detection.
 * All values pre-scaled by S (reference resolution factor).
 * ================================================================ */
function updateBallPhysics(pf) {
    const steps = (Math.abs(ball.vy) > SPEED_SWEEP_THRESH * S) ? COLLISION_SUBSTEPS : 1;
    const dyStep = (ball.grav * ball.gDir * pf) / steps;

    for (let s = 0; s < steps; s++) {
        ball.vy += dyStep;
        ball.vy = Math.max(-maxVel(), Math.min(maxVel(), ball.vy));
        ball.y += ball.vy / steps;

        if (ball.y - ball.r < 0 || ball.y + ball.r > logH) {
            if (godMode) { ball.y = ball.y-ball.r<0 ? ball.r : logH-ball.r; ball.vy *= -0.5 }
            else { const sk=getSkinColors(); spawnP(ball.x,ball.y,20,sk.c1); gameOver(); return false }
        }
    }
    return true;
}

function updateWalls(pf) {
    // Smooth ramp: movement begins gently at level 5 instead of jumping
    const rawAmp = currentLevel >= 5 ? Math.min((currentLevel-5)*1.8+10, 50) : 0;
    const rampFactor = currentLevel >= 5 ? Math.min((currentLevel - 4) * 0.25, 1) : 0;
    const mAmp = rawAmp * rampFactor * S;
    const mSpd = currentLevel >= 5 ? (0.01 + Math.min((currentLevel-5)*0.0007, 0.018)) * rampFactor : 0;
    const wc = getWC();

    for (let i = obstacles.length-1; i >= 0; i--) {
        const ob = obstacles[i];
        ob.x -= speed;
        if (ob.x + ob.w < -40 * S) { obstacles.splice(i,1); continue }

        if (mAmp > 0 && ob.mvType < 3) {
            ob.mp += mSpd;
            const maxY = logH - ob.gS - WALL_MARGIN * S;
            const minY = WALL_MARGIN * S;
            let ny;
            if (ob.mvType === 0) ny = ob.bY + Math.sin(ob.mp) * mAmp;
            else if (ob.mvType === 1) { const p=((ob.mp%(Math.PI*2))/(Math.PI*2)); const tri=p<.5?p*2-.5:(.5-p)*2+.5; ny=ob.bY+tri*mAmp*2 }
            else { const p=Math.abs(Math.sin(ob.mp*.7)); ny=ob.bY+(p-.5)*mAmp*2 }
            ob.gY = Math.max(minY, Math.min(maxY, ny));
        }

        if (hitTest(ob)) { spawnP(ball.x,ball.y,25,wc.c); gameOver(); return false }

        if (!ob.counted && ob.x + ob.w < ball.x - ball.r) {
            ob.counted = true;
            const pts = activePU.dbl.on ? 2 : 1;
            score += pts; scoreSpan.textContent = score; sfxScore(); vibScore();
            stats.wallsPassed++; stats.totalPoints += pts;
            currentLevel = Math.floor(score/10) + 1;

            if (currentLevel !== lastLevel) {
                lastLevel = currentLevel; diff = getDiff(currentLevel);
                ball.grav = diff.gravity; showLvl(currentLevel);
                levelBadge.textContent = T('level').toUpperCase() + ' ' + currentLevel;
                if (currentLevel % 5 === 0) { addGems(1); } checkShopAch();
            }
            spawnP(ob.x, ob.gY+ob.gS/2, 6, wc.g);
            checkScoreAch(score);
            checkLevelAch(currentLevel);
            if (noPowerUpRun && score >= 30) ulAch('pu');
            if (noPowerUpRun && score >= 50) ulAch('pu50');
            checkStatAch();
        }
    }

    const lo = obstacles[obstacles.length-1];
    if (!lo || lo.x < logW - diff.spawnDist) genOb();
    return true;
}

function updateFreePUs() {
    maybeSpawnPU();
    for (let i = freePUs.length-1; i >= 0; i--) {
        const pu = freePUs[i];
        pu.x -= speed; pu.bob += 0.06; pu.gl = (pu.gl + 0.05) % (Math.PI*2);
        if (!pu.soundPlayed && pu.x <= logW + pu.r) { pu.soundPlayed = true; sfxPuSpawn() }
        if (pu.x < -30 * S) { freePUs.splice(i,1); continue }
        if (!pu.collected) {
            const py = pu.y + Math.sin(pu.bob) * 8 * S;
            if (Math.sqrt((ball.x-pu.x)**2 + (ball.y-py)**2) < ball.r + pu.r + PU_COLLECT_PADDING * S) {
                collectPU(pu);
                for(let j=0;j<15;j++) particles.push({x:pu.x,y:py,vx:(Math.random()-.5)*4*S,vy:(Math.random()-.5)*4*S,life:1,decay:PARTICLE_DECAY_MIN+Math.random()*(PARTICLE_DECAY_MAX-PARTICLE_DECAY_MIN),sz:(2+Math.random()*3)*S,c:pu.type.color});
                freePUs.splice(i,1);
            }
        }
    }
}

function updateParticles() {
    for (let i=particles.length-1; i>=0; i--) {
        const p = particles[i]; p.x+=p.vx; p.y+=p.vy; p.life-=p.decay; p.vy+=0.02*S;
        if (p.life <= 0) particles.splice(i,1);
    }
}

function updateStars() {
    for (const s of stars) {
        s.x -= s.sp * (speed / diff.baseSpeed);
        if (s.x < 0) { s.x = logW; s.y = Math.random()*logH }
        s.tw += 0.03;
    }
}

function update() {
    if (!gameActive || paused) return;
    frameCount++;

    currentTheme = getTheme(currentLevel);
    if (!displayTheme.bgTop) initDT(currentTheme);
    lerpDT(currentTheme, 0.03);

    if (!gameStarted) {
        floatOffset += 0.04; ball.y = logH/2 + Math.sin(floatOffset)*12*S;
        for(const s of stars){ s.x-=s.sp*.3; if(s.x<0){s.x=logW;s.y=Math.random()*logH} s.tw+=.02 }
        scrollOffset += 0.15 * S; return;
    }

    updatePowerupTimers();
    const pf = getSpeedFactor();

    if (!updateBallPhysics(pf)) return;
    if (!updateWalls(pf)) return;
    updateFreePUs();

    speed = (diff.baseSpeed + Math.floor(score%10) * diff.spdRate * 0.12) * pf;

    updateParticles();
    updateStars();
    scrollOffset += speed * 0.5;

    if (gameStartTime && Date.now() - gameStartTime >= 120000) ulAch('sv');
    if (gameStartTime && Date.now() - gameStartTime >= 300000) ulAch('sv5');
}

