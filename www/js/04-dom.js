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

