/* ================================================================
 * SECTION 4c: AD SYSTEM
 * Interstitial ads every 2-3 deaths, rewarded ads for extra life.
 * Uses @capacitor-community/admob plugin when available,
 * simulates ads in browser for testing.
 * ================================================================ */
let adDeathCount = 0;          // deaths since last interstitial
let adNextThreshold = 2;       // show interstitial after 2 or 3 deaths
let adExtraLifeUsed = false;   // only 1 extra life per run
let adLastGameDuration = 0;    // seconds the last game lasted
let admobReady = false;
const extraLifeBtn = $('extraLifeBtn');
const adLoading = $('adLoading');

// --- AdMob Config (REPLACE WITH YOUR REAL AD UNIT IDS) ---
const AD_CONFIG = {
    // Test IDs — replace with your real AdMob IDs before publishing!
    interstitialId: 'ca-app-pub-3940256099942544/1033173712',   // Google test interstitial
    rewardedId:     'ca-app-pub-3940256099942544/5224354917',   // Google test rewarded
};

// --- Initialize AdMob ---
async function initAdMob() {
    if (!window.Capacitor) { console.log('[Ads] Browser mode — ads simulated'); return; }
    try {
        const { AdMob } = await import('@nicepay/capacitor-admob') // Try community plugin
            .catch(() => import('@nicepay/capacitor-admob'))
            .catch(() => null);
        if (!AdMob) {
            console.log('[Ads] AdMob plugin not available');
            return;
        }
        await AdMob.initialize({ initializeForTesting: true });
        admobReady = true;
        console.log('[Ads] AdMob initialized');
    } catch(e) {
        console.log('[Ads] AdMob init failed:', e.message);
    }
}
// [moved to 99-init.js] initAdMob();

// --- Show Interstitial Ad ---
async function showInterstitialAd() {
    adLoading.classList.add('active');
    if (admobReady) {
        try {
            const { AdMob } = await import('@nicepay/capacitor-admob').catch(() => ({}));
            if (AdMob) {
                await AdMob.prepareInterstitial({ adId: AD_CONFIG.interstitialId });
                await AdMob.showInterstitial();
            }
        } catch(e) { console.log('[Ads] Interstitial error:', e.message); }
    } else {
        // Browser simulation: fake 2 second ad
        await new Promise(r => setTimeout(r, 2000));
    }
    adLoading.classList.remove('active');
}

// --- Show Rewarded Ad (for extra life) ---
async function showRewardedAd() {
    return new Promise(async (resolve) => {
        adLoading.classList.add('active');
        if (admobReady) {
            try {
                const { AdMob } = await import('@nicepay/capacitor-admob').catch(() => ({}));
                if (AdMob) {
                    await AdMob.prepareRewardVideoAd({ adId: AD_CONFIG.rewardedId });
                    AdMob.addListener('onRewardedVideoAdEnded', () => { resolve(true); });
                    AdMob.addListener('onRewardedVideoAdLeftApplication', () => { resolve(false); });
                    await AdMob.showRewardVideoAd();
                    adLoading.classList.remove('active');
                    return;
                }
            } catch(e) { console.log('[Ads] Rewarded error:', e.message); }
        }
        // Browser simulation: fake 3 second "ad"
        await new Promise(r => setTimeout(r, 3000));
        adLoading.classList.remove('active');
        resolve(true);
    });
}

// --- Check if interstitial should show (every 2-3 deaths) ---
function shouldShowInterstitial() {
    adDeathCount++;
    if (adDeathCount >= adNextThreshold) {
        adDeathCount = 0;
        // Short games (< 15 sec) → ad every 3 deaths, longer games → every 2
        adNextThreshold = adLastGameDuration < 15 ? 3 : 2;
        return true;
    }
    return false;
}

// --- Continue Game (after rewarded ad) ---
function continueGame() {
    adExtraLifeUsed = true;
    gameOverScreen.style.display = 'none';
    gameActive = true;
    gameStarted = true;
    readyText.style.display = 'none';
    pauseBtn.style.display = 'flex';

    // Reset ball to safe position
    ball.y = logH / 2;
    ball.vy = 0;
    ball.gDir = 1;

    // Remove nearby obstacles so player doesn't instantly die
    const safeZone = logW * 0.4;
    obstacles = obstacles.filter(ob => ob.x > ball.x + safeZone || ob.x + ob.w < ball.x - 20 * S);

    // Activate SLOW power-up
    activePU.slow.on = true;
    activePU.slow.end = Date.now() + 4000; // 4 seconds slow

    // Activate temporary God Mode (3 seconds)
    godMode = true;
    setTimeout(() => {
        godMode = false;
        godToggle.classList.remove('on');
        pauseGod.classList.remove('on');
        godBadge.style.display = 'none';
    }, 3000);

    gameStartTime = Date.now();
}

// --- Extra Life Button Click ---
extraLifeBtn.addEventListener('click', async () => {
    extraLifeBtn.style.display = 'none';
    const rewarded = await showRewardedAd();
    if (rewarded) {
        continueGame();
    } else {
        // Ad was skipped/cancelled, stay on game over
        gameOverScreen.style.display = 'flex';
    }
});

