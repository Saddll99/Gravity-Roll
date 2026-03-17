/* ================================================================
 * SECTION 5: SHOP SYSTEM
 * Ball skins, wall skins, and background styles.
 * All cosmetic items stored in localStorage.
 * ================================================================ */
let gems=0, sessionGems=0, ownedSkins=['default'], ownedWalls=['default'], ownedBgs=['default'], eqSkin='default', eqWall='default', eqBg='default';
try { const sd=localStorage.getItem('gr_shop_v2'); if(sd){ const d=JSON.parse(sd); gems=d.g||0; ownedSkins=d.s||['default']; ownedWalls=d.w||['default']; ownedBgs=d.b||['default']; eqSkin=d.es||'default'; eqWall=d.ew||'default'; eqBg=d.eb||'default' } } catch(e){}
function saveShop(){ try{localStorage.setItem('gr_shop_v2',JSON.stringify({g:gems,s:ownedSkins,w:ownedWalls,b:ownedBgs,es:eqSkin,ew:eqWall,eb:eqBg}))}catch(e){} }
function updateGemDisplay(){ gemCountEl.textContent=gems }
// [moved to 99-init.js] updateGemDisplay();
function addGems(n){ gems+=n; sessionGems+=n; saveShop(); updateGemDisplay() }

const BALL_SKINS=[
    /* === GRATIS === */
    {id:'default',name:'Gold',price:0,c1:[255,216,102],c2:[212,155,42],glow:[255,216,102]},
    /* === GÜNSTIG (5-10) === */
    {id:'ice',name:'Eis',price:5,c1:[180,230,255],c2:[80,160,220],glow:[140,210,255]},
    {id:'fire',name:'Feuer',price:5,c1:[255,130,30],c2:[200,40,10],glow:[255,100,20]},
    {id:'neon',name:'Neon',price:5,c1:[50,255,130],c2:[10,180,60],glow:[60,255,110]},
    {id:'toxic',name:'Toxisch',price:8,c1:[160,255,50],c2:[60,180,10],glow:[120,255,30]},
    {id:'ocean',name:'Ozean',price:8,c1:[40,180,220],c2:[10,80,160],glow:[50,160,220]},
    {id:'rose',name:'Rose',price:8,c1:[255,120,170],c2:[180,40,80],glow:[255,100,150]},
    {id:'amber',name:'Bernstein',price:10,c1:[255,190,60],c2:[180,110,20],glow:[255,170,40]},
    /* === MITTEL (12-20) === */
    {id:'sunset',name:'Sunset',price:12,c1:[255,180,80],c2:[200,60,80],glow:[255,140,60]},
    {id:'shadow',name:'Schatten',price:12,c1:[140,100,200],c2:[60,30,120],glow:[120,80,180]},
    {id:'chrome',name:'Chrom',price:15,c1:[230,230,240],c2:[150,150,170],glow:[210,210,230]},
    {id:'arctic',name:'Arktis',price:15,c1:[220,240,255],c2:[160,200,240],glow:[200,230,255]},
    {id:'ruby',name:'Rubin',price:18,c1:[220,40,80],c2:[140,10,40],glow:[255,50,80]},
    {id:'emerald',name:'Smaragd',price:18,c1:[40,200,100],c2:[10,120,50],glow:[60,230,110]},
    {id:'magma',name:'Magma',price:20,c1:[255,80,20],c2:[120,20,0],glow:[255,60,10]},
    /* === TEUER (25-35) === */
    {id:'billiard',name:'Billard',price:25,c1:[20,20,20],c2:[60,60,60],glow:[100,100,255],motif:'billiard'},
    {id:'smiley',name:'Smiley',price:25,c1:[255,220,50],c2:[240,180,20],glow:[255,230,80],motif:'smiley'},
    /* === SELTEN (50) === */
    {id:'rainbow',name:'Regenbogen',price:50,c1:[255,100,100],c2:[100,100,255],glow:[255,200,100],rainbow:true}
];
const WALL_SKINS=[
    /* === GRATIS === */
    {id:'default',name:'Standard',price:0,c:[80,140,200],g:[100,170,255]},
    /* === GÜNSTIG (5-8) === */
    {id:'frost',name:'Frost',price:5,c:[100,180,220],g:[140,220,255]},
    {id:'sand',name:'Sand',price:5,c:[190,160,100],g:[220,190,130]},
    {id:'lava',name:'Lava',price:8,c:[220,80,40],g:[255,120,60]},
    {id:'toxic',name:'Toxisch',price:8,c:[60,200,80],g:[80,255,100]},
    /* === MITTEL (12-18) === */
    {id:'gold',name:'Gold',price:12,c:[220,180,60],g:[255,216,80]},
    {id:'coral',name:'Koralle',price:12,c:[220,100,120],g:[255,140,150]},
    {id:'jade',name:'Jade',price:15,c:[60,160,120],g:[80,200,150]},
    {id:'blood',name:'Blut',price:15,c:[180,30,30],g:[220,50,50]},
    {id:'plasma',name:'Plasma',price:18,c:[180,60,220],g:[220,100,255]},
    {id:'white',name:'Kristall',price:18,c:[220,220,230],g:[255,255,255]},
    /* === TEUER (25-40) === */
    {id:'obsidian',name:'Obsidian',price:25,c:[40,40,50],g:[80,80,100]},
    {id:'rainbow',name:'Regenbogen',price:40,c:[255,100,100],g:[100,255,100],rainbow:true}
];
const BG_STYLES=[
    /* === GRATIS === */
    {id:'default',name:'Standard',price:0},
    {id:'stars',name:'Sternenmeer',price:0},
    /* === GÜNSTIG (5-8) === */
    {id:'ember',name:'Glut',price:5},
    {id:'void',name:'Void',price:5},
    {id:'sunset',name:'Horizont',price:8},
    /* === MITTEL (12-18) === */
    {id:'aurora',name:'Aurora',price:12},
    {id:'matrix',name:'Matrix',price:12},
    {id:'desert',name:'Wüste',price:15},
    {id:'beach',name:'Strand',price:15},
    {id:'pixel',name:'Pixel World',price:18},
    /* === TEUER (22-35) === */
    {id:'space',name:'Galaxie',price:22},
    {id:'underwater',name:'Unterwasser',price:25},
    {id:'castle',name:'Berge',price:25},
    {id:'arctic',name:'Eiswelt',price:30},
    {id:'jungle',name:'Dschungel',price:35}
];
const bgPrev={
    default:'linear-gradient(135deg,#0d1929,#060c16)',
    stars:'linear-gradient(135deg,#0a1628,#0f1f3a)',
    ember:'linear-gradient(135deg,#2a1008,#180806)',
    void:'linear-gradient(135deg,#060608,#020204)',
    aurora:'linear-gradient(135deg,#0a1a2a,#0f1228)',
    matrix:'linear-gradient(135deg,#000a00,#001200)',
    sunset:'linear-gradient(135deg,#1a0a2a,#2a1505)',
    pixel:'linear-gradient(135deg,#5080f0,#40a040)',
    beach:'linear-gradient(135deg,#1a6090,#d4a050)',
    space:'linear-gradient(135deg,#05001a,#100028)',
    underwater:'linear-gradient(135deg,#042040,#0a3060)',
    castle:'linear-gradient(135deg,#1a1830,#2a2040)',
    desert:'linear-gradient(135deg,#4a3010,#2a1a05)',
    arctic:'linear-gradient(135deg,#1a2a3a,#2a3a4a)',
    jungle:'linear-gradient(135deg,#0a2010,#1a3820)'
};

function renderShop(){
    function priceTxt(eq,ow,price) { return eq ? T('active') : ow ? T('select') : price===0 ? T('free') : '💎 '+price; }
    let h='<div class="shop-section-title">'+T('ballSkins')+'</div><div class="shop-grid">';
    for(const s of BALL_SKINS){ const ow=ownedSkins.includes(s.id),eq=eqSkin===s.id;
        h+=`<div class="shop-item${ow?' owned':''}${eq?' equipped':''}" data-t="s" data-id="${s.id}"><div class="shop-preview" style="background:radial-gradient(circle at 35% 35%,rgb(${s.c1}),rgb(${s.c2}));box-shadow:0 0 10px rgba(${s.glow},0.4)"></div><div class="shop-name">${TS(s.name)}</div><div class="shop-price ${s.price===0?'free':ow?'owned':''}">${priceTxt(eq,ow,s.price)}</div></div>` }
    h+='</div><div class="shop-section-title">'+T('wallSkins')+'</div><div class="shop-grid">';
    for(const w of WALL_SKINS){ const ow=ownedWalls.includes(w.id),eq=eqWall===w.id;
        h+=`<div class="shop-item${ow?' owned':''}${eq?' equipped':''}" data-t="w" data-id="${w.id}"><div class="shop-wall-preview"><div class="shop-wall-bar" style="background:rgb(${w.c});box-shadow:0 0 6px rgba(${w.g},0.5)"></div><div class="shop-wall-bar" style="background:rgb(${w.c});box-shadow:0 0 6px rgba(${w.g},0.5)"></div><div class="shop-wall-bar" style="background:rgb(${w.c});box-shadow:0 0 6px rgba(${w.g},0.5)"></div></div><div class="shop-name">${TS(w.name)}</div><div class="shop-price ${w.price===0?'free':ow?'owned':''}">${priceTxt(eq,ow,w.price)}</div></div>` }
    h+='</div><div class="shop-section-title">'+T('backgrounds')+'</div><div class="shop-grid">';
    for(const b of BG_STYLES){ const ow=ownedBgs.includes(b.id),eq=eqBg===b.id;
        h+=`<div class="shop-item${ow?' owned':''}${eq?' equipped':''}" data-t="b" data-id="${b.id}"><div class="shop-bg-preview" style="background:${bgPrev[b.id]}"></div><div class="shop-name">${TS(b.name)}</div><div class="shop-price ${b.price===0?'free':ow?'owned':''}">${priceTxt(eq,ow,b.price)}</div></div>` }
    h+='</div>'; shopScroll.innerHTML=h;
    shopScroll.querySelectorAll('.shop-item').forEach(el => el.addEventListener('click', () => {
        const t=el.dataset.t, id=el.dataset.id;
        function tryBuy(arr, list, eqKey, price) {
            const owned = list.includes(id);
            if (!owned) { if (price === 0 || gems >= price) { if(price>0) gems -= price; list.push(id); eqKey(id); saveShop(); updateGemDisplay(); sfxBuy(); renderShop(); checkShopAch() } }
            else { eqKey(id); saveShop(); renderShop() }
        }
        if(t==='s'){ const s=BALL_SKINS.find(x=>x.id===id); if(s) tryBuy(BALL_SKINS, ownedSkins, v=>{eqSkin=v}, s.price) }
        else if(t==='w'){ const w=WALL_SKINS.find(x=>x.id===id); if(w) tryBuy(WALL_SKINS, ownedWalls, v=>{eqWall=v}, w.price) }
        else { const b=BG_STYLES.find(x=>x.id===id); if(b) tryBuy(BG_STYLES, ownedBgs, v=>{eqBg=v}, b.price) }
    }));
}
// [moved to 99-init.js] renderShop();

function getSkinColors() {
    const s = BALL_SKINS.find(x => x.id === eqSkin) || BALL_SKINS[0];
    if (s.rainbow) { const t = frameCount * 0.02; return { c1:[Math.sin(t)*127+128, Math.sin(t+2)*127+128, Math.sin(t+4)*127+128], c2:[Math.sin(t+1)*127+128, Math.sin(t+3)*127+128, Math.sin(t+5)*127+128], glow:[Math.sin(t)*127+128, Math.sin(t+2.5)*127+128, Math.sin(t+5)*127+128] } }
    return { c1:s.c1, c2:s.c2, glow:s.glow };
}
function getWC() {
    const w = WALL_SKINS.find(x => x.id === eqWall) || WALL_SKINS[0];
    if (w.rainbow) {
        const t = frameCount * 0.015;
        return {
            c: [Math.sin(t)*127+128|0, Math.sin(t+2)*127+128|0, Math.sin(t+4)*127+128|0],
            g: [Math.sin(t+1)*127+128|0, Math.sin(t+3)*127+128|0, Math.sin(t+5)*127+128|0]
        };
    }
    return w;
}
function getBgO() {
    switch(eqBg) {
        case 'ember': return {t:[42,16,8],b:[24,8,4],a:.6};
        case 'void': return {t:[6,6,10],b:[2,2,5],a:.8};
        case 'aurora': return {t:[10,26,42],b:[15,12,35],a:.5};
        case 'matrix': return {t:[0,12,0],b:[0,6,0],a:.7};
        case 'sunset': return {t:[30,10,45],b:[40,18,8],a:.55};
        case 'pixel': return {t:[70,120,230],b:[50,140,60],a:.85};
        case 'beach': return {t:[30,100,160],b:[190,150,70],a:.8};
        case 'space': return {t:[5,0,25],b:[15,0,35],a:.75};
        case 'underwater': return {t:[5,30,60],b:[2,15,40],a:.7};
        case 'castle': return {t:[20,18,35],b:[10,8,20],a:.6};
        case 'desert': return {t:[60,40,15],b:[35,22,8],a:.75};
        case 'arctic': return {t:[25,40,55],b:[40,55,70],a:.7};
        case 'jungle': return {t:[8,30,12],b:[5,20,8],a:.65};
        default: return null;
    }
}

