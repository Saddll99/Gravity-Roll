/* ================================================================
 * SECTION 6: STATISTICS & ACHIEVEMENTS
 * Track lifetime stats and unlock achievements based on milestones.
 * ================================================================ */
let stats = { totalPoints:0, totalGames:0, totalClicks:0, totalItems:0, totalSlows:0, totalFasts:0, bestScore:0, bestLevel:0, totalTimeSec:0, wallsPassed:0 };
try { const s=localStorage.getItem('gr_stats_v1'); if(s) stats={...stats,...JSON.parse(s)} } catch(e) {}
function saveStats() { try { localStorage.setItem('gr_stats_v1', JSON.stringify(stats)) } catch(e) {} }
function fmtT(s) { const m=Math.floor(s/60),sc=s%60; if(m>=60){ const h=Math.floor(m/60); return h+'h '+((m%60)+'').padStart(2,'0')+'m' } return m+'m '+(''+sc).padStart(2,'0')+'s' }
function renderStats() {
    const items = [['🎮',stats.totalGames,T('sGames')],['⭐',stats.totalPoints,T('sTotalPts')],['🏆',stats.bestScore,T('sBest')],['📈',stats.bestLevel,T('sBestLvl')],['💎',gems,T('sGems')],['👆',stats.totalClicks,T('sTaps')],['🧱',stats.wallsPassed,T('sWalls')],['✨',stats.totalItems,T('sItems')],['❄',stats.totalSlows,T('sSlows')],['🔥',stats.totalFasts,T('sBoosts')],['⏱',fmtT(stats.totalTimeSec),T('sTime')]];
    statsGrid.innerHTML=''; for(const[i,v,l] of items){ const e=document.createElement('div'); e.className='stat-card'; e.innerHTML=`<div class="stat-val">${i} ${v}</div><div class="stat-label">${l}</div>`; statsGrid.appendChild(e) }
}
renderStats();

resetBtn.addEventListener('click', () => {
    if (!confirm(T('resetConfirm'))) return;
    ['gr_vol','gr_mute','gr_music','gr_shop_v2','gr_stats_v1','gr_ach_v2','gr_hs_v3'].forEach(k => { try { localStorage.removeItem(k) } catch(e) {} });
    location.reload();
});

const ACH=[
    /* 1. Score milestones (first things player encounters) */
    {id:'fp',i:'⭐',n:'Erster Punkt',d:'1 Punkt'},
    {id:'s10',i:'🔟',n:'Zehn!',d:'10 Punkte'},
    {id:'s25',i:'🎯',n:'Quarter',d:'25 Punkte'},
    {id:'s50',i:'🔥',n:'Fifty!',d:'50 Punkte'},
    {id:'s100',i:'💯',n:'Century',d:'100 Punkte'},
    {id:'s200',i:'👑',n:'Legende',d:'200 Punkte'},
    {id:'s500',i:'🏆',n:'Halbgott',d:'500 Punkte'},
    {id:'s1000',i:'⚜️',n:'Gott',d:'1000 Punkte'},
    /* 2. Level progression */
    {id:'l3',i:'🌱',n:'Anfänger',d:'Level 3'},
    {id:'l5',i:'🚀',n:'Aufsteiger',d:'Level 5'},
    {id:'mv',i:'🌊',n:'Wellenreiter',d:'Level 5'},
    {id:'l10',i:'🌟',n:'Dekade',d:'Level 10'},
    {id:'mv2',i:'🎢',n:'Achterbahn',d:'Level 15'},
    {id:'l20',i:'💫',n:'Veteran',d:'Level 20'},
    {id:'l30',i:'🔱',n:'Meister',d:'Level 30'},
    {id:'l50',i:'⚜️',n:'Unsterblich',d:'Level 50'},
    /* 3. Survival challenges */
    {id:'sv',i:'🛡️',n:'Survivor',d:'2 Min. überleben'},
    {id:'sv5',i:'🗡️',n:'Kämpfer',d:'5 Min. überleben'},
    {id:'pu',i:'🎯',n:'Purist',d:'30 Pkt. ohne Items'},
    {id:'pu50',i:'🏹',n:'Asket',d:'50 Pkt. ohne Items'},
    /* 4. Item collection */
    {id:'fpu',i:'✨',n:'Erster Fund',d:'Item sammeln'},
    {id:'sl',i:'❄',n:'Eiszeit',d:'Slow sammeln'},
    {id:'fa',i:'🔥',n:'Turbo',d:'Boost sammeln'},
    {id:'dbl',i:'×2',n:'Doppelt!',d:'×2 sammeln'},
    {id:'c5',i:'🧲',n:'Sammler',d:'5 Items/Spiel'},
    {id:'c10',i:'💎',n:'Magnet',d:'10 Items/Spiel'},
    {id:'c20',i:'🌀',n:'Staubsauger',d:'20 Items/Spiel'},
    {id:'i25',i:'🎁',n:'Schatzsucher',d:'25 Items ges.'},
    {id:'i100',i:'🏆',n:'Hoarder',d:'100 Items'},
    {id:'i500',i:'🧳',n:'Plünderer',d:'500 Items'},
    /* 5. Walls passed */
    {id:'w100',i:'🧱',n:'Durchbrecher',d:'100 Wände'},
    {id:'w500',i:'🏗️',n:'Mauerbrecher',d:'500 Wände'},
    {id:'w1k',i:'🏰',n:'Festung',d:'1.000 Wände'},
    {id:'w5k',i:'⛩️',n:'Unzerstörbar',d:'5.000 Wände'},
    /* 6. Taps */
    {id:'t100',i:'👆',n:'Tapper',d:'100 Taps'},
    {id:'t500',i:'✌️',n:'Tipper',d:'500 Taps'},
    {id:'t1k',i:'🤙',n:'Klicker',d:'1.000 Taps'},
    {id:'t5k',i:'⚡',n:'Blitzfinger',d:'5.000 Taps'},
    {id:'t10k',i:'💥',n:'Maschine',d:'10.000 Taps'},
    /* 7. Lifetime stats */
    {id:'p500',i:'📊',n:'Punktejäger',d:'500 Pkt. ges.'},
    {id:'p2k',i:'📈',n:'Statistiker',d:'2.000 Pkt.'},
    {id:'p10k',i:'🏅',n:'Großmeister',d:'10.000 Pkt.'},
    {id:'p50k',i:'🎖️',n:'Punktekönig',d:'50.000 Pkt.'},
    {id:'g10',i:'🎮',n:'Stammspieler',d:'10 Spiele'},
    {id:'g50',i:'🕹️',n:'Dauergast',d:'50 Spiele'},
    {id:'g100',i:'🤖',n:'Besessen',d:'100 Spiele'},
    {id:'g500',i:'🧠',n:'Unaufhaltbar',d:'500 Spiele'},
    /* 8. Playtime */
    {id:'tm',i:'⏰',n:'Zeitfresser',d:'30 Min. Spielzeit'},
    {id:'t2h',i:'⌛',n:'Marathon',d:'2 Std. Spielzeit'},
    {id:'t10h',i:'🕰️',n:'Zeitlos',d:'10 Std. Spielzeit'},
    /* 9. Gems & Shop */
    {id:'gm50',i:'💎',n:'Sparer',d:'50 Gems'},
    {id:'gm200',i:'💰',n:'Wohlhabend',d:'200 Gems'},
    {id:'gm500',i:'🤑',n:'Millionär',d:'500 Gems'},
    {id:'sk1',i:'🎨',n:'Styler',d:'Skin kaufen'},
    {id:'sk5',i:'🖌️',n:'Fashionista',d:'5 Skins'},
    {id:'sk10',i:'👗',n:'Trendsetter',d:'10 Skins'},
    {id:'wl1',i:'🧱',n:'Dekorateur',d:'Mauer-Skin'},
    {id:'wl5',i:'🎭',n:'Architekt',d:'5 Mauer-Skins'},
    {id:'bg1',i:'🖼️',n:'Entdecker',d:'Hintergrund wählen'},
    {id:'bg5',i:'🌄',n:'Weltreisender',d:'5 Hintergründe'},
    {id:'all',i:'🌈',n:'Kollektor',d:'Alle Ball-Skins'}
];
let uAch = {}; try { const s=localStorage.getItem('gr_ach_v2'); if(s) uAch=JSON.parse(s) } catch(e) {}
function saveAch() { try { localStorage.setItem('gr_ach_v2', JSON.stringify(uAch)) } catch(e) {} }
let toastQ=[], toastBusy=false;
function ulAch(id) { if(uAch[id]) return; uAch[id]=Date.now(); saveAch(); const a=ACH.find(x=>x.id===id); if(!a) return; toastQ.push(a); if(!toastBusy) nxT(); renderAch() }
function nxT() { if(!toastQ.length){ toastBusy=false; return } toastBusy=true; const a=toastQ.shift(); toastIcon.textContent=a.i; toastText.textContent=TA(a.id); achToast.classList.add('show'); sfxAch(); vibAch(); setTimeout(()=>{ achToast.classList.remove('show'); setTimeout(nxT,300) }, TOAST_DURATION) }
function renderAch() { achGrid.innerHTML=''; for(const a of ACH){ const u=!!uAch[a.id]; const e=document.createElement('div'); e.className='ach-item'+(u?' unlocked':''); e.innerHTML=`<div class="ach-icon">${a.i}</div><div class="ach-info"><div class="ach-name">${TA(a.id)}</div><div class="ach-desc">${TAD(a.id)}</div></div>`; achGrid.appendChild(e) } }
renderAch();
function checkShopAch() { if(ownedSkins.length>1)ulAch('sk1'); if(ownedSkins.length>=5)ulAch('sk5'); if(ownedSkins.length>=10)ulAch('sk10'); if(ownedWalls.length>1)ulAch('wl1'); if(ownedWalls.length>=5)ulAch('wl5'); if(ownedBgs.length>1)ulAch('bg1'); if(ownedBgs.length>=5)ulAch('bg5'); if(ownedSkins.length>=BALL_SKINS.length)ulAch('all'); if(gems>=50)ulAch('gm50'); if(gems>=200)ulAch('gm200'); if(gems>=500)ulAch('gm500') }

const SCORE_THRESHOLDS = [{s:1,id:'fp'},{s:10,id:'s10'},{s:25,id:'s25'},{s:50,id:'s50'},{s:100,id:'s100'},{s:200,id:'s200'},{s:500,id:'s500'},{s:1000,id:'s1000'}];
const LEVEL_THRESHOLDS = [{l:3,id:'l3'},{l:5,id:'l5'},{l:5,id:'mv'},{l:10,id:'l10'},{l:15,id:'mv2'},{l:20,id:'l20'},{l:30,id:'l30'},{l:50,id:'l50'}];
function checkScoreAch(sc) { for(const t of SCORE_THRESHOLDS) if(sc>=t.s) ulAch(t.id) }
function checkLevelAch(lv) { for(const t of LEVEL_THRESHOLDS) if(lv>=t.l) ulAch(t.id) }
function checkStatAch() {
    if(stats.totalPoints>=500) ulAch('p500'); if(stats.totalPoints>=2000) ulAch('p2k'); if(stats.totalPoints>=10000) ulAch('p10k'); if(stats.totalPoints>=50000) ulAch('p50k');
    if(stats.wallsPassed>=100) ulAch('w100'); if(stats.wallsPassed>=500) ulAch('w500'); if(stats.wallsPassed>=1000) ulAch('w1k'); if(stats.wallsPassed>=5000) ulAch('w5k');
}
function checkClickAch() { if(stats.totalClicks>=100) ulAch('t100'); if(stats.totalClicks>=500) ulAch('t500'); if(stats.totalClicks>=1000) ulAch('t1k'); if(stats.totalClicks>=5000) ulAch('t5k'); if(stats.totalClicks>=10000) ulAch('t10k') }

/* ================================================================
