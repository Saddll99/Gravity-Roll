/* ================================================================
 * SECTION 4: AUDIO SYSTEM
 * Web Audio API for sound effects and procedural music.
 * All sounds are synthesized - no external audio files needed.
 * ================================================================ */
let audioCtx = null, sfxVol = 0.7, musicOn = true, musicGain = null;

function ensureAudio() {
    if (!audioCtx) try { audioCtx = new (window.AudioContext || window.webkitAudioContext)() } catch(e) { return }
    if (audioCtx.state === 'suspended') audioCtx.resume();
}

function tone(f, d, tp, v, r) {
    if (sfxVol <= 0 || !audioCtx) return;
    try {
        const o = audioCtx.createOscillator(), g = audioCtx.createGain();
        o.type = tp || 'sine';
        o.frequency.setValueAtTime(f, audioCtx.currentTime);
        if (r) o.frequency.exponentialRampToValueAtTime(r, audioCtx.currentTime + d);
        g.gain.setValueAtTime((v || 1) * sfxVol * 0.12, audioCtx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + d);
        o.connect(g); g.connect(audioCtx.destination);
        o.start(); o.stop(audioCtx.currentTime + d);
    } catch(e) {}
}

function sfxTap()     { ensureAudio(); tone(600,.08,'sine',.7,800) }
function sfxScore()   { ensureAudio(); tone(880,.1,'sine',.5); setTimeout(()=>tone(1100,.08,'sine',.4),50) }
function sfxLvlUp()   { ensureAudio(); tone(523,.12,'triangle',.6); setTimeout(()=>tone(659,.12,'triangle',.6),90); setTimeout(()=>tone(784,.18,'triangle',.7),180) }
function sfxDie()     { ensureAudio(); tone(300,.3,'sawtooth',.3,80) }
function sfxPuSpawn() { ensureAudio(); tone(1200,.18,'sine',.25,1600) }
function sfxPuGet()   { ensureAudio(); tone(700,.08,'sine',.6); setTimeout(()=>tone(900,.08,'sine',.5),60); setTimeout(()=>tone(1200,.12,'sine',.5),120) }
function sfxAch()     { ensureAudio(); tone(523,.1,'triangle',.7); setTimeout(()=>tone(659,.1,'triangle',.7),70); setTimeout(()=>tone(784,.1,'triangle',.7),140); setTimeout(()=>tone(1047,.2,'triangle',.8),210) }
function sfxBuy()     { ensureAudio(); tone(500,.08,'sine',.5); setTimeout(()=>tone(700,.12,'sine',.6),60) }

let musicInterval = null;
let musicInterval2 = null;

const MELODY_NOTES = [
    261.6, null, 329.6, null, 392.0, null, null, null,
    523.3, null, 440.0, null, null, null, 392.0, null,
    329.6, null, null, 392.0, null, 440.0, null, null,
    392.0, null, 329.6, null, 261.6, null, null, null,
    293.7, null, 392.0, null, null, 329.6, null, null,
    440.0, null, 392.0, null, 329.6, null, null, null
];
const BASS_NOTES = [130.8, 130.8, 130.8, 130.8, 164.8, 164.8, 164.8, 164.8, 146.8, 146.8, 146.8, 146.8, 130.8, 130.8, 130.8, 130.8, 146.8, 146.8, 146.8, 146.8, 164.8, 164.8, 130.8, 130.8];
const PAD_NOTES = [
    [261.6, 329.6, 392.0],
    [293.7, 392.0, 493.9],
    [261.6, 329.6, 440.0],
    [293.7, 392.0, 523.3]
];
let melodyIdx = 0, bassIdx = 0, padIdx = 0, padTimer = 0;

function startMusic() {
    if (!audioCtx || musicInterval) return;
    ensureAudio();
    musicGain = audioCtx.createGain();
    musicGain.gain.setValueAtTime(sfxVol * 0.25, audioCtx.currentTime);
    musicGain.connect(audioCtx.destination);
    melodyIdx = 0; bassIdx = 0; padIdx = 0; padTimer = 0;

    musicInterval = setInterval(() => {
        if (sfxVol <= 0 || !musicOn || !audioCtx) return;
        try {
            const note = MELODY_NOTES[melodyIdx % MELODY_NOTES.length];
            if (note) {
                const o = audioCtx.createOscillator(), g = audioCtx.createGain();
                o.type = 'triangle';
                o.frequency.setValueAtTime(note, audioCtx.currentTime);
                g.gain.setValueAtTime(sfxVol * 0.08, audioCtx.currentTime);
                g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
                o.connect(g); g.connect(musicGain);
                o.start(); o.stop(audioCtx.currentTime + 0.55);
            }
            if (melodyIdx % 2 === 0) {
                const bNote = BASS_NOTES[bassIdx % BASS_NOTES.length];
                const ob = audioCtx.createOscillator(), gb = audioCtx.createGain();
                ob.type = 'sine';
                ob.frequency.setValueAtTime(bNote, audioCtx.currentTime);
                gb.gain.setValueAtTime(sfxVol * 0.04, audioCtx.currentTime);
                gb.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.7);
                ob.connect(gb); gb.connect(musicGain);
                ob.start(); ob.stop(audioCtx.currentTime + 0.75);
                bassIdx++;
            }
            padTimer++;
            if (padTimer >= 16) {
                padTimer = 0;
                const chord = PAD_NOTES[padIdx % PAD_NOTES.length];
                for (const cn of chord) {
                    const op = audioCtx.createOscillator(), gp = audioCtx.createGain();
                    op.type = 'sine';
                    op.frequency.setValueAtTime(cn, audioCtx.currentTime);
                    gp.gain.setValueAtTime(sfxVol * 0.025, audioCtx.currentTime);
                    gp.gain.linearRampToValueAtTime(sfxVol * 0.035, audioCtx.currentTime + 0.8);
                    gp.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 2.8);
                    op.connect(gp); gp.connect(musicGain);
                    op.start(); op.stop(audioCtx.currentTime + 3.0);
                }
                padIdx++;
            }
            melodyIdx++;
        } catch(e) {}
    }, 187);
}
function stopMusic() { if (musicInterval) { clearInterval(musicInterval); musicInterval = null } if (musicInterval2) { clearInterval(musicInterval2); musicInterval2 = null } musicGain = null }
function updateMusicVol() { if (musicGain) try { musicGain.gain.setValueAtTime((!musicOn || sfxVol <= 0) ? 0 : sfxVol * 0.25, audioCtx.currentTime) } catch(e) {} }

/* ===== BACKGROUND / LOCK SCREEN: pause all audio ===== */
let _musicWasPlaying = false;
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        _musicWasPlaying = !!musicInterval;
        stopMusic();
        if (audioCtx && audioCtx.state === 'running') audioCtx.suspend().catch(function(){});
    } else {
        if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume().catch(function(){});
        if (_musicWasPlaying && musicOn) { ensureAudio(); startMusic(); }
    }
});
window.addEventListener('blur', function() {
    _musicWasPlaying = !!musicInterval;
    stopMusic();
    if (audioCtx && audioCtx.state === 'running') audioCtx.suspend().catch(function(){});
});
window.addEventListener('focus', function() {
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume().catch(function(){});
    if (_musicWasPlaying && musicOn) { ensureAudio(); startMusic(); }
});

const volSlider=$('volSlider'), volVal=$('volVal'), godToggle=$('godToggle'), musicToggle=$('musicToggle'), resetBtn=$('resetBtn');
const pauseVol=$('pauseVol'), pauseGod=$('pauseGod');
let godMode = false;

try {
    const v = localStorage.getItem('gr_vol');
    if (v !== null) { sfxVol = parseFloat(v); volSlider.value = Math.round(sfxVol*100); volVal.textContent = Math.round(sfxVol*100)+'%'; pauseVol.value = Math.round(sfxVol*100) }
    
    if (localStorage.getItem('gr_music') === '0') { musicOn = false } else { musicToggle.classList.add('on') }
} catch(e) {}

function setVolume(val) { sfxVol = val / 100; volSlider.value = val; pauseVol.value = val; volVal.textContent = val + '%'; updateMusicVol(); try { localStorage.setItem('gr_vol', String(sfxVol)) } catch(e) {} }
volSlider.addEventListener('input', () => setVolume(parseInt(volSlider.value)));
pauseVol.addEventListener('input', () => setVolume(parseInt(pauseVol.value)));


function toggleGod() { godMode = !godMode; godToggle.classList.toggle('on', godMode); pauseGod.classList.toggle('on', godMode); godBadge.style.display = godMode ? 'block' : 'none' }
godToggle.addEventListener('click', toggleGod);
pauseGod.addEventListener('click', toggleGod);

musicToggle.addEventListener('click', () => { musicOn = !musicOn; musicToggle.classList.toggle('on', musicOn); if (musicOn) { ensureAudio(); startMusic() } else stopMusic(); updateMusicVol(); try { localStorage.setItem('gr_music', musicOn?'1':'0') } catch(e) {} });

// Vibration system
let vibrationOn = true;
const vibToggle = $('vibToggle');
try { if (localStorage.getItem('gr_vib') === '0') { vibrationOn = false; vibToggle.classList.remove('on'); } } catch(e) {}
vibToggle.addEventListener('click', () => { vibrationOn = !vibrationOn; vibToggle.classList.toggle('on', vibrationOn); try { localStorage.setItem('gr_vib', vibrationOn?'1':'0') } catch(e) {} });
function vibrate(pattern) {
    if (!vibrationOn) return;
    if (window.nativeHaptic) { window.nativeHaptic(); return; }
    if (navigator.vibrate) try { navigator.vibrate(pattern); } catch(e) {}
}
function vibTap()     { vibrate(8);  }
function vibScore()   { vibrate(12); }
function vibDie()     { vibrate([30,40,60]); }
function vibLvlUp()   { vibrate([15,30,15,30,25]); }
function vibPuGet()   { vibrate([10,20,15]); }
function vibAch()     { vibrate([20,30,20,30,40]); }

// Language selector - custom dropdown (no native popup on Android)
const langSelect = $('langSelect');
const langBtn = $('langBtn');
const langList = $('langList');
const LANG_ORDER = ['en','de','es','fr','tr','ru','zh','ja','ar'];

function buildLangDropdown() {
    langList.innerHTML = '';
    for (const code of LANG_ORDER) {
        const lang = LANGS[code]; if (!lang) continue;
        // Keep hidden select in sync
        const opt = document.createElement('option');
        opt.value = code; opt.textContent = lang.name;
        if (code === currentLang) opt.selected = true;
        langSelect.appendChild(opt);
        // Build custom list item
        const item = document.createElement('div');
        item.className = 'custom-lang-opt' + (code === currentLang ? ' selected' : '');
        item.textContent = lang.name;
        item.dataset.code = code;
        item.addEventListener('click', (e) => {
            e.preventDefault(); e.stopPropagation();
            currentLang = code;
            langSelect.value = code;
            saveLang(); applyLang(); renderShop(); renderAch(); renderStats();
            langBtn.textContent = lang.name;
            langList.classList.remove('open');
            langBtn.classList.remove('open');
            langList.querySelectorAll('.custom-lang-opt').forEach(o => o.classList.toggle('selected', o.dataset.code === code));
        });
        langList.appendChild(item);
    }
    langBtn.textContent = LANGS[currentLang]?.name || 'Deutsch';
}
buildLangDropdown();

langBtn.addEventListener('click', (e) => {
    e.preventDefault(); e.stopPropagation();
    const isOpen = langList.classList.contains('open');
    langList.classList.toggle('open', !isOpen);
    langBtn.classList.toggle('open', !isOpen);
});
document.addEventListener('click', () => { langList.classList.remove('open'); langBtn.classList.remove('open'); });
langSelect.addEventListener('change', () => { currentLang = langSelect.value; saveLang(); applyLang(); renderShop(); renderAch(); renderStats(); });

function applyLang() {
    $('logoSub').textContent = T('subtitle');
    $('tabPlay').textContent = T('play');
    $('tabShop').textContent = T('shop');
    $('tabAch').textContent = T('achievements');
    $('tabStats').textContent = T('stats');
    $('startBtn').textContent = T('start');
    $('howTo').innerHTML = T('tapInstruct');
    $('readyText').textContent = T('tapToStart');
    $('pauseTitle').textContent = T('pause');
    $('resumeBtn').textContent = T('resume');
    $('menuBtn').textContent = T('mainMenu');
    $('pauseVolLabel').textContent = T('volume');
    $('pauseGodLabel').textContent = T('godMode');
    $('langLabel').textContent = T('language');
    $('volLabel').textContent = T('volume');
    $('musicLabel').textContent = T('music');
    $('vibLabel').textContent = T('vibration');
    $('godLabel').textContent = T('godMode');
    $('godHint').textContent = T('godHint');
    $('resetBtn').textContent = T('resetAll');
    $('settSectionGeneral').textContent = T('settGeneral') || 'ALLGEMEIN';
    $('settSectionAudio').textContent = T('settAudio') || 'AUDIO';
    $('settSectionHaptics').textContent = T('settHaptics') || 'HAPTIK';
    $('settSectionDev').textContent = T('settDev') || 'ENTWICKLER';
    $('goTitle').textContent = T('gameOver');
    $('goScoreLabel').textContent = T('score');
    $('goEarned').textContent = T('earned');
    $('goLevelLabel').textContent = T('level');
    $('goItemsLabel').textContent = T('items');
    $('restartBtn').textContent = T('again');
    $('goMenuBtn').textContent = T('menu');
    $('shareText').textContent = T('shareScore');
    $('elMainText').textContent = T('extraLife');
    $('elSubText').textContent = T('watchAd');
    $('adLoadingText').textContent = T('adLoading');
}
applyLang();

// --- Share Score ---
$('shareBtn').addEventListener('click', () => {
    const text = T('shareText').replace('{score}', score);
    if (navigator.share) {
        navigator.share({ title: 'Gravity Roll', text: text }).catch(() => {});
    } else {
        navigator.clipboard.writeText(text).then(() => {
            $('shareText').textContent = '✓ Kopiert!';
            setTimeout(() => { $('shareText').textContent = T('shareScore'); }, 2000);
        }).catch(() => {});
    }
});

