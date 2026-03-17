/* ================================================================
 * config.js — Constants, Scaling & DOM References
 * Physics tuning, difficulty curves, reference resolution.
 * All values designed for 420×900 reference, scaled via S factor.
 * ================================================================ */

const LANGS = window.LANGS;

let currentLang = 'de';
try { const sl = localStorage.getItem('gr_lang'); if (sl && LANGS[sl]) currentLang = sl; } catch(e) {}
function T(key) { return LANGS[currentLang][key] || LANGS.de[key] || key; }
function TS(name) { return (LANGS[currentLang].sk && LANGS[currentLang].sk[name]) || name; }
function TA(id) { return (LANGS[currentLang].ach && LANGS[currentLang].ach[id]) || (LANGS.de.ach && LANGS.de.ach[id]) || (LANGS.en.ach && LANGS.en.ach[id]) || id; }
function TAD(id) { return (LANGS[currentLang].achD && LANGS[currentLang].achD[id]) || (LANGS.de.achD && LANGS.de.achD[id]) || (LANGS.en.achD && LANGS.en.achD[id]) || id; }
function saveLang() { try { localStorage.setItem('gr_lang', currentLang); } catch(e) {} }
// All pixel values in the original game were tuned for this size.
// S = scale factor so everything looks identical on any screen.
/* ================================================================
 * SECTION 2: SCALING & PHYSICS CONSTANTS
 * All pixel values are designed for a 420x900 reference resolution.
 * S = scale factor computed at resize, so everything looks the same
 * on any screen size. DPR handles retina/HiDPI sharpness.
 * ================================================================ */
const REF_W = 420;
const REF_H = 900;
let S = 1;          // computed in resize()
let dpr = 1;        // devicePixelRatio
let logW = 420;     // logical canvas width (CSS px)
let logH = 900;     // logical canvas height (CSS px)

// ====== FIXED TIMESTEP (60 physics steps/sec) ======
const PHYSICS_DT = 1000 / 60;   // 16.667ms per tick
let accumulator = 0;
let lastTimestamp = 0;

const BALL_BASE_RADIUS    = 13;
const OBSTACLE_WIDTH      = 28;
const WALL_MARGIN         = 50;
const MAX_VELOCITY        = 20;
const SPEED_SWEEP_THRESH  = 3;
const COLLISION_SUBSTEPS  = 4;
const PU_MAX_ONSCREEN     = 2;
const PU_COLLECT_PADDING  = 8;
const PU_BASE_DURATION    = 8000;
const PU_LEVEL_REDUCTION  = 200;
const PU_MIN_DURATION     = 3000;
const PU_SPAWN_MARGIN     = 50;
const TOAST_DURATION      = 3000;
const STAR_COUNT_DEFAULT  = 50;
const STAR_COUNT_BG_STARS = 100;
const PARTICLE_DECAY_MIN  = 0.015;
const PARTICLE_DECAY_MAX  = 0.04;

/* ================================================================
 * SECTION 3: DOM REFERENCES
 * Cache all DOM elements once at startup for performance.
 * ================================================================ */
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const $ = id => document.getElementById(id);

const startScreen = $('startScreen');
const gameOverScreen = $('gameOverScreen');
const pauseScreen = $('pauseScreen');

const startBtn = $('startBtn');
const restartBtn = $('restartBtn');
const pauseBtn = $('pauseBtn');
const resumeBtn = $('resumeBtn');
const menuBtn = $('menuBtn');
const goMenuBtn = $('goMenuBtn');

const scoreSpan = $('score');
const highScoreSpan = $('highScore');
const finalScoreSpan = $('finalScore');
const bestDisplay = $('bestDisplay');
const newHighSpan = $('newHigh');

const readyText = $('readyText');
const levelBadge = $('levelBadge');
const levelUpFlash = $('levelUpFlash');
const levelUpText = $('levelUpText');

const puSlowInd = $('puSlowInd');
const puSlowTimer = $('puSlowTimer');
const puFastInd = $('puFastInd');
const puFastTimer = $('puFastTimer');
const puDblInd = $('puDblInd');
const puDblTimer = $('puDblTimer');

const achGrid = $('achGrid');
const achToast = $('achToast');
const toastIcon = $('toastIcon');
const toastText = $('toastText');
const goLevel = $('goLevel');
const goItems = $('goItems');
const godBadge = $('godBadge');
const goGems = $('goGems');
const fpsBadge = $('fpsBadge');
const gemCountEl = $('gemCount');
const shopScroll = $('shopScroll');
const statsGrid = $('statsGrid');

document.querySelectorAll('.tab-btn').forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(x => x.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(x => x.classList.remove('active'));
    b.classList.add('active'); $('tab-' + b.dataset.tab).classList.add('active');
}));

