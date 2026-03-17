/* ================================================================
 * SECTION 7: GAME STATE
 * Core game variables, themes, and difficulty scaling.
 * ================================================================ */
let gameActive = false;
let gameStarted = false;
let paused = false;
let score = 0;
let highScore = 0;
let floatOffset = 0;
let frameCount = 0;
let scrollOffset = 0;
let currentLevel = 1;
let lastLevel = 1;
let itemsCollected = 0;
let noPowerUpRun = true;
let gameStartTime = 0;
let sessionClicks = 0;
let activePU = {
    slow: { on: false, end: 0 },
    fast: { on: false, end: 0 },
    dbl:  { on: false, end: 0 }
};

let fps = 60;
let lowPerfMode = false;
let fpsAccum = 0;
let fpsCount = 0;

const themes = [
    {bgTop:[13,25,45],bgBot:[6,12,22],particleColor:[100,170,255]},
    {bgTop:[50,15,35],bgBot:[20,8,18],particleColor:[255,120,160]},
    {bgTop:[10,40,25],bgBot:[5,18,12],particleColor:[80,255,130]},
    {bgTop:[25,15,55],bgBot:[10,8,28],particleColor:[160,120,255]},
    {bgTop:[55,25,5],bgBot:[28,12,3],particleColor:[255,160,50]},
    {bgTop:[5,5,15],bgBot:[2,2,8],particleColor:[180,180,255]}
];
let currentTheme={}, displayTheme={};
function lC(a,b,t) { return [a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t, a[2]+(b[2]-a[2])*t] }
function getTheme(lv) { const i=Math.min(Math.floor((lv-1)/10),themes.length-1), n=Math.min(i+1,themes.length-1), l=(lv-1)%10; let t=0; if(l>=6&&i!==n) t=(l-6)/4; const a=themes[i],b=themes[n],r={}; for(const k of Object.keys(a)) r[k]=Array.isArray(a[k])?lC(a[k],b[k],t):a[k]; return r }
function initDT(t) { displayTheme=JSON.parse(JSON.stringify(t)) }
function lerpDT(tg,s) { for(const k of Object.keys(tg)) { if(Array.isArray(tg[k])) for(let i=0;i<3;i++) displayTheme[k][i]+=(tg[k][i]-displayTheme[k][i])*s } }
function rgb(a) { return `rgb(${a[0]|0},${a[1]|0},${a[2]|0})` }
function rgba(a,al) { return `rgba(${a[0]|0},${a[1]|0},${a[2]|0},${al})` }

function getDiff(lv) {
    const level = Math.min(lv, 100);
    const progress = (level - 1) / 99;
    const curve = Math.pow(progress, 0.7);
    return {
        baseSpeed:  (4.435 + curve * 5.0) * S,
        gapSize:    178 * S,
        spawnDist:  (550 - curve * 150) * S,
        gravity:    (0.423 + curve * 0.32) * S,
        firstDelay: (650 - curve * 350) * S,
        spdRate:    (0.242 + curve * 0.35) * S
    };
}

let ball = { x:0, y:0, r:BALL_BASE_RADIUS, vy:0, grav:0.12, gDir:1 };
let obstacles=[], particles=[], stars=[], freePUs=[];
let diff = getDiff(1), speed = diff.baseSpeed;
let lastPUSpawnDist = 0;
function maxVel() { return MAX_VELOCITY * S; }

function spawnP(x,y,n,c) { for(let i=0;i<n;i++) particles.push({x,y,vx:(Math.random()-.5)*4*S,vy:(Math.random()-.5)*4*S,life:1,decay:PARTICLE_DECAY_MIN+Math.random()*(PARTICLE_DECAY_MAX-PARTICLE_DECAY_MIN),sz:(2+Math.random()*3)*S,c:c||[255,255,255]}) }
function initStars() { stars=[]; const n=eqBg==='stars'?STAR_COUNT_BG_STARS:STAR_COUNT_DEFAULT; for(let i=0;i<n;i++) stars.push({x:Math.random()*logW,y:Math.random()*logH,sz:(.5+Math.random()*1.5)*S,sp:(.2+Math.random()*.6)*S,tw:Math.random()*Math.PI*2}) }

