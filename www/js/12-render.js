/* ================================================================
 * SECTION 10: RENDERING
 * Draws background, stars, walls, power-ups, ball, particles.
 * Uses logical coordinates (CSS px) - DPR scaling handled by canvas transform.
 * ================================================================ */
function draw() {
    const W=logW, H=logH, T=displayTheme;
    if (!T.bgTop) return;

    const distPhase = (scrollOffset * 0.0003) % (Math.PI*2);
    const dH = [Math.sin(distPhase)*15|0, Math.sin(distPhase+2)*10|0, Math.sin(distPhase+4)*15|0];
    const bg = ctx.createLinearGradient(0,0,0,H);
    const bo = getBgO();
    if (bo) {
        const t1=lC(T.bgTop,bo.t,bo.a), b1=lC(T.bgBot,bo.b,bo.a);
        bg.addColorStop(0, rgb([t1[0]+dH[0],t1[1]+dH[1],t1[2]+dH[2]]));
        bg.addColorStop(1, rgb([b1[0]+dH[2],b1[1]+dH[0],b1[2]+dH[1]]));
    } else {
        bg.addColorStop(0, rgb([T.bgTop[0]+dH[0],T.bgTop[1]+dH[1],T.bgTop[2]+dH[2]]));
        bg.addColorStop(1, rgb([T.bgBot[0]+dH[2],T.bgBot[1]+dH[0],T.bgBot[2]+dH[1]]));
    }
    ctx.fillStyle = bg; ctx.fillRect(0,0,W,H);

    const maxBgItems = lowPerfMode ? 8 : 20;
    if(eqBg==='aurora'){const aT=frameCount*.008;for(let i=0;i<3;i++){const ay=H*.2+Math.sin(aT+i*2)*H*.15;const ag=ctx.createLinearGradient(0,ay-40*S,0,ay+40*S);ag.addColorStop(0,'rgba(0,0,0,0)');const cr=i===0?[dH[0],255,180+dH[2]]:i===1?[100+dH[1],150+dH[0],255]:[200+dH[2],100+dH[1],255];ag.addColorStop(.5,`rgba(${cr[0]},${cr[1]},${cr[2]},0.03)`);ag.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=ag;ctx.fillRect(0,ay-40*S,W,80*S)}}
    if(eqBg==='matrix'){ctx.font=Math.round(10*S)+'px monospace';ctx.fillStyle=`rgba(${dH[0]+10},${Math.max(180,255+dH[1])},${60+dH[2]},0.06)`;for(let i=0;i<(lowPerfMode?12:30);i++){const cx=((i*37+frameCount*1.5)%W);const cy=((frameCount*(.8+i*.25)+i*80)%(H+200*S))-100*S;ctx.fillText(String.fromCharCode(0x30A0+(Math.sin(i*7+frameCount*.02)*40|0)),cx,cy);ctx.fillText(String.fromCharCode(0x30A0+(Math.cos(i*5+frameCount*.03)*40|0)),cx,cy+14*S);ctx.fillText(String.fromCharCode(0x30A0+(Math.sin(i*3+frameCount*.015)*40|0)),cx,cy+28*S)}}
    if(eqBg==='sunset'){const sg=ctx.createLinearGradient(0,H*.6,0,H);sg.addColorStop(0,'rgba(255,100,50,0)');sg.addColorStop(.5,`rgba(${255+dH[0]},${70+dH[1]},${60+dH[2]},0.04)`);sg.addColorStop(1,`rgba(${180+dH[1]},${30+dH[2]},${80+dH[0]},0.03)`);ctx.fillStyle=sg;ctx.fillRect(0,0,W,H);const sunY=H*.55+Math.sin(frameCount*.003)*20*S;const sunG=ctx.createRadialGradient(W*.7,sunY,5*S,W*.7,sunY,40*S);sunG.addColorStop(0,`rgba(${255+dH[0]},200,100,0.06)`);sunG.addColorStop(1,'rgba(255,100,50,0)');ctx.fillStyle=sunG;ctx.beginPath();ctx.arc(W*.7,sunY,40*S,0,Math.PI*2);ctx.fill()}
    if(eqBg==='pixel'){const ps=12*S,gy=H-ps*3;
        /* Ground blocks */
        ctx.fillStyle=`rgba(${140+dH[0]},${80+dH[1]},${30+dH[2]},0.12)`;for(let x=0;x<W+ps;x+=ps){const bx=x-((scrollOffset*1.2)%ps);ctx.fillRect(bx,gy,ps-2*S,ps*3)}
        ctx.fillStyle=`rgba(${80+dH[1]},${180+dH[0]},${50+dH[2]},0.1)`;for(let x=0;x<W+ps;x+=ps)ctx.fillRect(x-((scrollOffset*1.2)%ps),gy-ps,ps-2*S,ps-2*S);
        ctx.fillStyle=`rgba(${60+dH[1]},${140+dH[0]},${40+dH[2]},0.06)`;for(let x=0;x<W+ps;x+=ps)ctx.fillRect(x-((scrollOffset*1.2)%ps),gy-ps*2,ps-2*S,ps-2*S);
        /* Mario-style pipes - green */
        if(!lowPerfMode){
            for(let p=0;p<3;p++){
                const pipeX=((p*200*S-scrollOffset*.3+p*80*S)%(W+300*S))-80*S;
                const pipeH=(4+p)*ps;const pipeW=ps*2;const pipeY=gy-pipeH;
                /* Pipe body */
                ctx.fillStyle=`rgba(${40+dH[0]},${160+dH[1]},${40+dH[2]},0.1)`;
                ctx.fillRect(pipeX+2*S,pipeY+ps,pipeW-4*S,pipeH-ps);
                /* Pipe top (wider) */
                ctx.fillStyle=`rgba(${50+dH[0]},${190+dH[1]},${50+dH[2]},0.12)`;
                ctx.fillRect(pipeX,pipeY,pipeW,ps);
                /* Pipe highlight */
                ctx.fillStyle=`rgba(${80+dH[0]},${220+dH[1]},${80+dH[2]},0.06)`;
                ctx.fillRect(pipeX+3*S,pipeY+ps,4*S,pipeH-ps);
                /* Pipe shadow */
                ctx.fillStyle=`rgba(${20+dH[0]},${100+dH[1]},${20+dH[2]},0.06)`;
                ctx.fillRect(pipeX+pipeW-7*S,pipeY+ps,4*S,pipeH-ps);
            }
            /* Question mark blocks */
            for(let q=0;q<4;q++){
                const qx=((q*170*S-scrollOffset*.15+q*60*S)%(W+250*S))-50*S;
                const qy=H*.35+Math.sin(q*3)*40*S;
                /* Block body */
                ctx.fillStyle=`rgba(${220+dH[0]},${180+dH[1]},${40+dH[2]},0.1)`;
                ctx.fillRect(qx,qy,ps,ps);
                /* Block border */
                ctx.strokeStyle=`rgba(${180+dH[0]},${140+dH[1]},${20+dH[2]},0.08)`;
                ctx.lineWidth=1.5*S;ctx.strokeRect(qx+1*S,qy+1*S,ps-3*S,ps-3*S);
                /* ? mark */
                ctx.fillStyle=`rgba(255,255,255,0.12)`;
                ctx.font=`bold ${Math.round(ps*.7)}px sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';
                ctx.fillText('?',qx+ps/2,qy+ps/2);
            }
            /* Clouds */
            ctx.fillStyle='rgba(255,255,255,0.08)';for(let c=0;c<5;c++){const cx=(c*160*S-((scrollOffset*.2+c*40*S)%(W+200*S)))+W,cy=30*S+c*40*S;for(let dx=0;dx<6;dx++)ctx.fillRect(cx+dx*ps,cy,ps-2*S,ps-2*S);for(let dx=1;dx<5;dx++)ctx.fillRect(cx+dx*ps,cy-ps,ps-2*S,ps-2*S)}
            /* Coins */
            for(let c=0;c<5;c++){
                const cx=((c*130*S-scrollOffset*.4+c*50*S)%(W+200*S))-30*S;
                const cy=H*.25+c*50*S+Math.sin(frameCount*.04+c*2)*5*S;
                ctx.fillStyle=`rgba(${255},${220+dH[1]},${50+dH[2]},0.1)`;
                ctx.beginPath();ctx.arc(cx,cy,4*S,0,Math.PI*2);ctx.fill();
                ctx.fillStyle=`rgba(255,255,255,0.06)`;
                ctx.beginPath();ctx.arc(cx-1*S,cy-1*S,2*S,0,Math.PI*2);ctx.fill();
            }
        }else{
            ctx.fillStyle='rgba(255,255,255,0.08)';for(let c=0;c<5;c++){const cx=(c*160*S-((scrollOffset*.2+c*40*S)%(W+200*S)))+W,cy=30*S+c*40*S;for(let dx=0;dx<6;dx++)ctx.fillRect(cx+dx*ps,cy,ps-2*S,ps-2*S);for(let dx=1;dx<5;dx++)ctx.fillRect(cx+dx*ps,cy-ps,ps-2*S,ps-2*S)}
        }
    }
    if(eqBg==='beach'){const sandY=H*.72;ctx.fillStyle=`rgba(${210+dH[0]},${180+dH[1]},${100+dH[2]},0.08)`;ctx.fillRect(0,sandY,W,H-sandY);for(let w=0;w<3;w++){const wy=sandY-20*S-w*30*S;ctx.strokeStyle=`rgba(${60+dH[1]},${160+dH[0]},${220+dH[2]},${0.06-w*0.015})`;ctx.lineWidth=3*S;ctx.beginPath();for(let x=0;x<W;x+=4*S)ctx.lineTo(x,wy+Math.sin((x*.015/S)+(frameCount*.02)+w*1.5)*8*S);ctx.stroke()}const sunY2=H*.12;const sg2=ctx.createRadialGradient(W*.75,sunY2,8*S,W*.75,sunY2,35*S);sg2.addColorStop(0,`rgba(255,240,180,0.12)`);sg2.addColorStop(1,'rgba(255,180,80,0)');ctx.fillStyle=sg2;ctx.beginPath();ctx.arc(W*.75,sunY2,35*S,0,Math.PI*2);ctx.fill()}
    if(eqBg==='space'){
        /* Nebula clouds */
        const ncx=W*.4,ncy=H*.35;for(let n=0;n<3;n++){const nr=(60+n*30)*S,na=frameCount*.001+n,nx=ncx+Math.cos(na)*20*S,ny=ncy+Math.sin(na)*15*S;const ng=ctx.createRadialGradient(nx,ny,nr*.2,nx,ny,nr);const nc=n===0?[100+dH[0],50,180+dH[2]]:n===1?[50,80+dH[0],200]:[180+dH[1],50,100];ng.addColorStop(0,`rgba(${nc[0]},${nc[1]},${nc[2]},0.03)`);ng.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=ng;ctx.beginPath();ctx.arc(nx,ny,nr,0,Math.PI*2);ctx.fill()}
        /* Many twinkling stars */
        for(let i=0;i<20;i++){const sx=(i*97+17)%W,sy=(i*61+23)%H;const tw=Math.sin(frameCount*.03+i*2)*.5+.5;ctx.fillStyle=`rgba(255,255,255,${0.04+tw*0.1})`;const ssz=(1+tw*.8)*S;ctx.beginPath();ctx.arc(sx,sy,ssz,0,Math.PI*2);ctx.fill()}
        /* Saturn-like planet with ring */
        const p1x=W*.75,p1y=H*.2;ctx.fillStyle=`rgba(${180+dH[0]},${100+dH[1]},${60+dH[2]},0.06)`;ctx.beginPath();ctx.arc(p1x,p1y,12*S,0,Math.PI*2);ctx.fill();
        ctx.strokeStyle=`rgba(${200+dH[0]},${140+dH[1]},${80+dH[2]},0.04)`;ctx.lineWidth=1.5*S;ctx.beginPath();ctx.ellipse(p1x,p1y,18*S,5*S,.3,0,Math.PI*2);ctx.stroke();
        /* Blue ice planet */
        ctx.fillStyle=`rgba(${80+dH[0]},${160+dH[1]},${200+dH[2]},0.05)`;ctx.beginPath();ctx.arc(W*.2,H*.65,6*S,0,Math.PI*2);ctx.fill();
        /* Red planet (Mars-like) */
        ctx.fillStyle=`rgba(${200+dH[0]},${80+dH[1]},${50+dH[2]},0.05)`;ctx.beginPath();ctx.arc(W*.88,H*.55,8*S,0,Math.PI*2);ctx.fill();
        /* Surface detail */ctx.strokeStyle=`rgba(${160+dH[0]},${60+dH[1]},${30+dH[2]},0.03)`;ctx.lineWidth=1*S;ctx.beginPath();ctx.arc(W*.88-2*S,H*.55-1*S,3*S,0,Math.PI*2);ctx.stroke();
        /* Small green planet */
        ctx.fillStyle=`rgba(${60+dH[0]},${180+dH[1]},${80+dH[2]},0.04)`;ctx.beginPath();ctx.arc(W*.12,H*.3,4*S,0,Math.PI*2);ctx.fill();
        /* Purple gas giant */
        const gjx=W*.5,gjy=H*.78;
        const gjg=ctx.createRadialGradient(gjx-3*S,gjy-3*S,2*S,gjx,gjy,15*S);
        gjg.addColorStop(0,`rgba(${140+dH[0]},${80+dH[1]},${200+dH[2]},0.06)`);
        gjg.addColorStop(1,`rgba(${80+dH[0]},${40+dH[1]},${140+dH[2]},0.03)`);
        ctx.fillStyle=gjg;ctx.beginPath();ctx.arc(gjx,gjy,15*S,0,Math.PI*2);ctx.fill();
        /* Gas giant bands */
        ctx.strokeStyle=`rgba(${170+dH[0]},${100+dH[1]},${220+dH[2]},0.025)`;ctx.lineWidth=1*S;
        for(let b=-2;b<=2;b++){ctx.beginPath();ctx.ellipse(gjx,gjy+b*4*S,14*S,2*S,0,0,Math.PI*2);ctx.stroke()}
        /* Tiny distant moon */
        ctx.fillStyle=`rgba(200,200,210,0.04)`;ctx.beginPath();ctx.arc(W*.42,H*.12,3*S,0,Math.PI*2);ctx.fill();
        /* Shooting stars */
        for(let i=0;i<2;i++){const st=((frameCount*.8+i*400)%800)/800;if(st<.15){const sx=W*(.1+i*.5)+st*W*.4,sy=H*(.1+i*.3)-st*H*.1;ctx.strokeStyle=`rgba(255,255,255,${0.08*(1-st/.15)})`;ctx.lineWidth=1.5*S;ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(sx-25*S,sy+10*S);ctx.stroke()}}
    }

    /* Underwater: fewer light rays, more bubbles, fish, seaweed */
    if(eqBg==='underwater'){
        /* Single subtle light ray */
        const rx=W*.5+Math.sin(frameCount*.003)*40*S;ctx.save();ctx.globalAlpha=0.02;ctx.fillStyle=`rgb(${80+dH[0]},${200+dH[1]},${220+dH[2]})`;ctx.beginPath();ctx.moveTo(rx-15*S,0);ctx.lineTo(rx+15*S,0);ctx.lineTo(rx+35*S,H);ctx.lineTo(rx-35*S,H);ctx.fill();ctx.restore();
        /* Seaweed on bottom */
        for(let i=0;i<6;i++){const sx=W*(.08+i*.16);ctx.strokeStyle=`rgba(${30+dH[0]},${100+dH[1]},${60+dH[2]},0.06)`;ctx.lineWidth=3*S;ctx.beginPath();ctx.moveTo(sx,H);
        for(let y=H;y>H*.65;y-=6*S)ctx.lineTo(sx+Math.sin(y*.04/S+frameCount*.008+i)*12*S,y);ctx.stroke()}
        /* Bubbles */
        for(let i=0;i<12;i++){const bx=(i*47+frameCount*.6)%W;const by=H-((frameCount*(.4+i*.1)+i*90)%(H+60*S));const br=(1.5+Math.sin(i*3)*1)*S;ctx.beginPath();ctx.arc(bx,by,br,0,Math.PI*2);ctx.strokeStyle=`rgba(${150+dH[0]},${230+dH[1]},255,0.07)`;ctx.lineWidth=1*S;ctx.stroke()}
        /* Fish with fins */
        for(let i=0;i<5;i++){const dir=i%2===0?1:-1;const fx=((i*180-scrollOffset*.25*dir+i*100)%(W+120*S))-60*S;const fy=H*(.15+i*.16)+Math.sin(frameCount*.012+i*2.5)*15*S;const fc=i%3===0?[60,140,200]:i%3===1?[200,120,60]:[60,180,100];ctx.fillStyle=`rgba(${fc[0]+dH[0]},${fc[1]+dH[1]},${fc[2]+dH[2]},0.06)`;ctx.beginPath();ctx.ellipse(fx,fy,9*S,4.5*S,0,0,Math.PI*2);ctx.fill();
        /* Tail fin */ctx.beginPath();ctx.moveTo(fx+9*S*dir,fy);ctx.lineTo(fx+16*S*dir,fy-5*S);ctx.lineTo(fx+16*S*dir,fy+5*S);ctx.fill();
        /* Eye */ctx.fillStyle=`rgba(255,255,255,0.08)`;ctx.beginPath();ctx.arc(fx-4*S*dir,fy-1*S,1.5*S,0,Math.PI*2);ctx.fill()}
    }
    /* Castle: Mountain landscape with natural rounded peaks */
    if(eqBg==='castle'){
        /* Individual mountain peaks with snow caps */
        const farMtns=[
            {x:-.02,w:.22,peak:.38,base:.55},
            {x:.16,w:.20,peak:.32,base:.52},
            {x:.32,w:.22,peak:.35,base:.54},
            {x:.50,w:.24,peak:.30,base:.52},
            {x:.70,w:.20,peak:.34,base:.53},
            {x:.84,w:.20,peak:.36,base:.55}
        ];
        for(const m of farMtns){
            const cx=W*(m.x+m.w/2),lx=W*m.x,rx=W*(m.x+m.w),py=H*m.peak,by=H*m.base;
            ctx.fillStyle=`rgba(${80+dH[0]},${95+dH[1]},${130+dH[2]},0.04)`;
            ctx.beginPath();ctx.moveTo(lx,by);ctx.lineTo(cx,py);ctx.lineTo(rx,by);ctx.closePath();ctx.fill();
            const capH=(by-py)*.25;
            ctx.save();ctx.beginPath();ctx.rect(lx-5*S,py,rx-lx+10*S,capH);ctx.clip();
            ctx.fillStyle=`rgba(${235+dH[0]},${242+dH[1]},${250+dH[2]},0.05)`;
            ctx.beginPath();ctx.moveTo(lx,by);ctx.lineTo(cx,py);ctx.lineTo(rx,by);ctx.closePath();ctx.fill();
            ctx.restore();
        }
        /* Mid mountains */
        const midMtns=[
            {x:.02,w:.20,peak:.46,base:.62},
            {x:.18,w:.22,peak:.44,base:.60},
            {x:.38,w:.18,peak:.47,base:.62},
            {x:.52,w:.24,peak:.43,base:.61},
            {x:.72,w:.20,peak:.46,base:.62},
            {x:.88,w:.18,peak:.48,base:.63}
        ];
        for(const m of midMtns){
            const cx=W*(m.x+m.w/2),lx=W*m.x,rx=W*(m.x+m.w),py=H*m.peak,by=H*m.base;
            ctx.fillStyle=`rgba(${55+dH[0]},${75+dH[1]},${105+dH[2]},0.06)`;
            ctx.beginPath();ctx.moveTo(lx,by);ctx.lineTo(cx,py);ctx.lineTo(rx,by);ctx.closePath();ctx.fill();
            const capH=(by-py)*.22;
            ctx.save();ctx.beginPath();ctx.rect(lx-5*S,py,rx-lx+10*S,capH);ctx.clip();
            ctx.fillStyle=`rgba(${230+dH[0]},${238+dH[1]},${246+dH[2]},0.04)`;
            ctx.beginPath();ctx.moveTo(lx,by);ctx.lineTo(cx,py);ctx.lineTo(rx,by);ctx.closePath();ctx.fill();
            ctx.restore();
        }
        /* Green alpine meadows */
        ctx.fillStyle=`rgba(${50+dH[0]},${100+dH[1]},${45+dH[2]},0.06)`;ctx.beginPath();
        ctx.moveTo(0,H*.72);
        for(let x=0;x<=W;x+=12*S)ctx.lineTo(x,H*.7+Math.sin(x*.01/S+1)*H*.02);
        ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.fill();
        /* Pine trees */
        for(let i=0;i<10;i++){const tx=W*(.03+i*.1),tby=H*.69+Math.sin(tx*.01/S+1)*H*.02;const th=(10+Math.sin(i*4)*4)*S;
        ctx.fillStyle=`rgba(${25+dH[0]},${55+dH[1]},${22+dH[2]},0.06)`;
        ctx.beginPath();ctx.moveTo(tx,tby);ctx.lineTo(tx-5*S,tby+th);ctx.lineTo(tx+5*S,tby+th);ctx.fill();
        ctx.beginPath();ctx.moveTo(tx,tby-th*.4);ctx.lineTo(tx-4*S,tby+th*.3);ctx.lineTo(tx+4*S,tby+th*.3);ctx.fill()}
    }
    /* Desert: sand dunes, heat shimmer, distant sun */
    if(eqBg==='desert'){
        const sunY=H*.15+Math.sin(frameCount*.002)*10*S;const sunG=ctx.createRadialGradient(W*.6,sunY,10*S,W*.6,sunY,50*S);sunG.addColorStop(0,`rgba(255,${220+dH[1]},${100+dH[2]},0.1)`);sunG.addColorStop(1,'rgba(255,180,50,0)');ctx.fillStyle=sunG;ctx.beginPath();ctx.arc(W*.6,sunY,50*S,0,Math.PI*2);ctx.fill();
        ctx.fillStyle=`rgba(${200+dH[0]},${160+dH[1]},${80+dH[2]},0.06)`;ctx.beginPath();ctx.moveTo(0,H*.75);
        for(let x=0;x<=W;x+=4*S){ctx.lineTo(x,H*.72+Math.sin((x*.01/S)+scrollOffset*.001)*18*S+Math.sin(x*.025/S)*8*S)}
        ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.fill();
        for(let i=0;i<3;i++){const hy=H*(.4+i*.1);ctx.strokeStyle=`rgba(255,${200+dH[1]},${120+dH[2]},0.02)`;ctx.lineWidth=1*S;ctx.beginPath();for(let x=0;x<W;x+=6*S)ctx.lineTo(x,hy+Math.sin((x*.03/S)+frameCount*.04+i)*3*S);ctx.stroke()}
    }
    /* Arctic: ice landscape, many snowflakes, ice crystals */
    if(eqBg==='arctic'){
        /* Draw individual mountain peaks with matching snow caps */
        const mtns=[
            {x:.0,w:.22,peak:.46,base:.68},
            {x:.15,w:.24,peak:.38,base:.65},
            {x:.35,w:.20,peak:.48,base:.68},
            {x:.48,w:.26,peak:.40,base:.66},
            {x:.70,w:.22,peak:.44,base:.67},
            {x:.85,w:.20,peak:.50,base:.68}
        ];
        for(const m of mtns){
            const cx=W*(m.x+m.w/2),lx=W*m.x,rx=W*(m.x+m.w),py=H*m.peak,by=H*m.base;
            ctx.fillStyle=`rgba(${150+dH[0]},${180+dH[1]},${205+dH[2]},0.05)`;
            ctx.beginPath();ctx.moveTo(lx,by);ctx.lineTo(cx,py);ctx.lineTo(rx,by);ctx.closePath();ctx.fill();
            const capH=(by-py)*.3;
            ctx.save();ctx.beginPath();ctx.rect(lx-5*S,py,rx-lx+10*S,capH);ctx.clip();
            ctx.fillStyle=`rgba(${232+dH[0]},${242+dH[1]},${252+dH[2]},0.06)`;
            ctx.beginPath();ctx.moveTo(lx,by);ctx.lineTo(cx,py);ctx.lineTo(rx,by);ctx.closePath();ctx.fill();
            ctx.restore();
        }
        /* Frozen ground */
        ctx.fillStyle=`rgba(${190+dH[0]},${215+dH[1]},${235+dH[2]},0.05)`;
        ctx.fillRect(0,H*.78,W,H*.22);
        /* Many snowflakes - 25 of them */
        for(let i=0;i<25;i++){const sx=((i*37+frameCount*(.2+i*.03))%W);const sy=((frameCount*(.2+i*.06)+i*70)%(H+40*S))-20*S;const ssz=(1+Math.sin(i*5)*.8)*S;ctx.fillStyle=`rgba(255,255,255,${0.05+Math.sin(i*2+frameCount*.02)*0.02})`;ctx.beginPath();ctx.arc(sx,sy,ssz,0,Math.PI*2);ctx.fill()}
        /* Ice crystals - larger, 4 of them */
        for(let i=0;i<4;i++){const ix=W*(.15+i*.22),iy=H*(.25+i*.14);ctx.strokeStyle=`rgba(${180+dH[0]},${220+dH[1]},255,0.035)`;ctx.lineWidth=1*S;for(let a=0;a<6;a++){const an=a*Math.PI/3+frameCount*.002;const len=(12+Math.sin(a*2+i)*4)*S;ctx.beginPath();ctx.moveTo(ix,iy);ctx.lineTo(ix+Math.cos(an)*len,iy+Math.sin(an)*len);ctx.stroke();
        /* Small branches on crystals */const mx=ix+Math.cos(an)*len*.6,my=iy+Math.sin(an)*len*.6;ctx.beginPath();ctx.moveTo(mx,my);ctx.lineTo(mx+Math.cos(an+.8)*5*S,my+Math.sin(an+.8)*5*S);ctx.stroke();ctx.beginPath();ctx.moveTo(mx,my);ctx.lineTo(mx+Math.cos(an-.8)*5*S,my+Math.sin(an-.8)*5*S);ctx.stroke()}}
    }
    /* Jungle: tropical trees, hanging vines, leaves, dense foliage */
    if(eqBg==='jungle'){
        /* Distant tree silhouettes */
        for(let i=0;i<6;i++){const tx=W*(-.05+i*.2),tby=H*.4+Math.sin(i*3)*H*.08;
        ctx.fillStyle=`rgba(${12+dH[0]},${40+dH[1]},${15+dH[2]},0.05)`;
        /* Trunk */ctx.fillRect(tx-2*S,tby,4*S,(H*.85-tby));
        /* Canopy - layered circles */
        for(let c=0;c<3;c++){const cy=tby-5*S+c*8*S,cr=(18-c*3)*S;ctx.beginPath();ctx.arc(tx+Math.sin(c+i)*4*S,cy,cr,0,Math.PI*2);ctx.fill()}}
        /* Dense canopy top */
        ctx.fillStyle=`rgba(${15+dH[0]},${55+dH[1]},${20+dH[2]},0.06)`;ctx.beginPath();ctx.moveTo(0,0);
        for(let x=0;x<=W;x+=6*S)ctx.lineTo(x,H*.1+Math.sin(x*.025/S+frameCount*.003)*H*.03+Math.abs(Math.sin(x*.06/S))*H*.07);
        ctx.lineTo(W,0);ctx.fill();
        /* Hanging vines with leaves */
        for(let i=0;i<6;i++){const vx=W*(.05+i*.17);ctx.strokeStyle=`rgba(${30+dH[0]},${85+dH[1]},${25+dH[2]},0.05)`;ctx.lineWidth=2*S;ctx.beginPath();ctx.moveTo(vx,0);const vlen=H*(.25+Math.sin(i*2)*.1);
        for(let y=0;y<vlen;y+=6*S){ctx.lineTo(vx+Math.sin(y*.04/S+i+frameCount*.006)*10*S,y)}ctx.stroke();
        /* Leaf at vine end */const vy=vlen,lvx=vx+Math.sin(vlen*.04/S+i+frameCount*.006)*10*S;ctx.fillStyle=`rgba(${40+dH[0]},${100+dH[1]},${30+dH[2]},0.05)`;ctx.beginPath();ctx.ellipse(lvx,vy,5*S,3*S,Math.sin(frameCount*.005+i)*.3,0,Math.PI*2);ctx.fill()}
        /* Ground foliage - denser */
        ctx.fillStyle=`rgba(${20+dH[0]},${65+dH[1]},${15+dH[2]},0.07)`;ctx.beginPath();ctx.moveTo(0,H*.83);
        for(let x=0;x<=W;x+=5*S)ctx.lineTo(x,H*.81+Math.abs(Math.sin(x*.05/S+.5))*H*.05+Math.sin(x*.02/S)*H*.02);
        ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.fill();
        /* Falling leaves */
        for(let i=0;i<4;i++){const lx=((i*120+frameCount*.5)%W);const ly=((frameCount*(.3+i*.1)+i*200)%(H+50*S))-25*S;ctx.fillStyle=`rgba(${50+dH[0]},${120+dH[1]},${30+dH[2]},0.05)`;ctx.save();ctx.translate(lx,ly);ctx.rotate(frameCount*.01+i*2);ctx.beginPath();ctx.ellipse(0,0,4*S,2*S,0,0,Math.PI*2);ctx.fill();ctx.restore()}
    }

    for(const s of stars){ ctx.fillStyle=rgba(T.particleColor,(.3+.3*Math.sin(s.tw))*(eqBg==='stars'?.5:.3)); const sz=s.sz*(eqBg==='stars'?1.3:1); ctx.fillRect(s.x,s.y,sz,sz) }

    /* Shooting stars for Sternenmeer background */
    if(eqBg==='stars' && !lowPerfMode){
        for(let i=0;i<3;i++){
            const cycle=900+i*370;
            const st=((frameCount*.6+i*300)%cycle)/cycle;
            if(st<0.12){
                const t=st/0.12;
                const sx=W*(0.1+i*0.3)+t*W*0.35;
                const sy=H*(0.05+i*0.2)+t*H*0.15;
                const tailLen=30*S*(1-t*0.5);
                const alpha=0.15*(1-t);
                /* Glow */
                const sg=ctx.createRadialGradient(sx,sy,0,sx,sy,6*S);
                sg.addColorStop(0,`rgba(255,255,255,${alpha*1.5})`);
                sg.addColorStop(1,'rgba(255,255,255,0)');
                ctx.fillStyle=sg;ctx.beginPath();ctx.arc(sx,sy,6*S,0,Math.PI*2);ctx.fill();
                /* Trail */
                const grad=ctx.createLinearGradient(sx,sy,sx-tailLen,sy+tailLen*0.4);
                grad.addColorStop(0,`rgba(255,255,255,${alpha})`);
                grad.addColorStop(0.5,`rgba(200,220,255,${alpha*0.4})`);
                grad.addColorStop(1,'rgba(200,220,255,0)');
                ctx.strokeStyle=grad;ctx.lineWidth=2*S;
                ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(sx-tailLen,sy+tailLen*0.4);ctx.stroke();
                /* Head */
                ctx.fillStyle=`rgba(255,255,255,${alpha*2})`;
                ctx.beginPath();ctx.arc(sx,sy,1.5*S,0,Math.PI*2);ctx.fill();
            }
        }
    }

    const wc = getWC();
    for (const ob of obstacles) {
        ctx.fillStyle=rgba(wc.c,.15); ctx.fillRect(ob.x+4*S,0,ob.w,ob.gY); ctx.fillRect(ob.x+4*S,ob.gY+ob.gS,ob.w,H-(ob.gY+ob.gS));
        const wg=ctx.createLinearGradient(ob.x,0,ob.x+ob.w,0); wg.addColorStop(0,rgba(wc.c,.7)); wg.addColorStop(.5,rgba(wc.c,1)); wg.addColorStop(1,rgba(wc.c,.7)); ctx.fillStyle=wg;
        dRR(ctx,ob.x,-4*S,ob.w,ob.gY+4*S,6*S); ctx.fill(); dRR(ctx,ob.x,ob.gY+ob.gS,ob.w,H-(ob.gY+ob.gS)+4*S,6*S); ctx.fill();
        ctx.shadowColor=rgba(wc.g,.5); ctx.shadowBlur=12*S; ctx.fillStyle=rgba(wc.g,.25);
        ctx.fillRect(ob.x,ob.gY-2*S,ob.w,2*S); ctx.fillRect(ob.x,ob.gY+ob.gS,ob.w,2*S); ctx.shadowBlur=0;
    }

    for(const pu of freePUs){ if(pu.collected) continue;
        const px=pu.x, py=pu.y+Math.sin(pu.bob)*8*S, pr=pu.r, pl=1+Math.sin(pu.gl)*.12;
        ctx.save(); ctx.shadowColor=rgba(pu.type.glow,.7); ctx.shadowBlur=25*S;
        ctx.beginPath(); ctx.arc(px,py,pr*pl+4*S,0,Math.PI*2); ctx.strokeStyle=rgba(pu.type.glow,.25); ctx.lineWidth=2*S; ctx.stroke(); ctx.shadowBlur=0;
        const ig=ctx.createRadialGradient(px-pr*.25,py-pr*.25,pr*.15,px,py,pr*pl);
        ig.addColorStop(0,'rgba(255,255,255,.9)'); ig.addColorStop(.4,rgba(pu.type.glow,.8)); ig.addColorStop(1,rgba(pu.type.color,.5));
        ctx.beginPath(); ctx.arc(px,py,pr*pl,0,Math.PI*2); ctx.fillStyle=ig; ctx.fill();
        ctx.strokeStyle='rgba(255,255,255,.9)'; ctx.lineWidth=2*S; ctx.lineCap='round';
        if(pu.type.id==='slow'){ const s=pr*.5; for(let a=0;a<3;a++){const an=a*Math.PI/3;ctx.beginPath();ctx.moveTo(px-Math.cos(an)*s,py-Math.sin(an)*s);ctx.lineTo(px+Math.cos(an)*s,py+Math.sin(an)*s);ctx.stroke()} }
        else if(pu.type.id==='fast'){ ctx.beginPath();ctx.moveTo(px+2*S,py-pr*.55);ctx.lineTo(px-3*S,py+1*S);ctx.lineTo(px+1*S,py+1*S);ctx.lineTo(px-2*S,py+pr*.55);ctx.lineWidth=2.5*S;ctx.stroke() }
        else{
            /* Double points: two concentric rings + centered "2" */
            ctx.save();
            /* Outer ring */
            ctx.beginPath(); ctx.arc(px, py, pr*pl*1.15, 0, Math.PI*2);
            ctx.strokeStyle='rgba(120,255,160,.6)'; ctx.lineWidth=1.5*S; ctx.stroke();
            /* Inner filled circle already drawn above */
            /* Bold "2" inside */
            ctx.fillStyle='rgba(255,255,255,.95)';
            ctx.font='bold '+Math.round(pr*1.1)+'px sans-serif';
            ctx.textAlign='center'; ctx.textBaseline='middle';
            ctx.fillText('2', px, py);
            /* Small "×" above-left */
            ctx.font='bold '+Math.round(pr*0.55)+'px sans-serif';
            ctx.fillText('×', px - pr*0.45, py - pr*0.35);
            ctx.restore();
        }
        ctx.beginPath();ctx.arc(px-pr*.25,py-pr*.3,2.5*S,0,Math.PI*2);ctx.fillStyle='rgba(255,255,255,.5)';ctx.fill();ctx.restore();
    }

    const sk=getSkinColors(); ctx.save();
    if(activePU.slow.on) {ctx.shadowColor='rgba(100,190,255,0.8)';ctx.shadowBlur=35*S}
    else if(activePU.fast.on) {ctx.shadowColor='rgba(255,120,50,0.8)';ctx.shadowBlur=35*S}
    else if(activePU.dbl.on) {ctx.shadowColor='rgba(80,220,120,0.8)';ctx.shadowBlur=35*S}
    else {ctx.shadowColor=rgba(sk.glow,.6);ctx.shadowBlur=25*S}
    ctx.beginPath();ctx.arc(ball.x,ball.y,ball.r,0,Math.PI*2);
    const bG=ctx.createRadialGradient(ball.x-3*S,ball.y-3*S,2*S,ball.x,ball.y,ball.r+2*S);
    bG.addColorStop(0,rgb(sk.c1));bG.addColorStop(1,rgb(sk.c2));ctx.fillStyle=bG;ctx.fill();ctx.shadowBlur=0;
    /* Draw motif patterns on ball */
    const curSkin = BALL_SKINS.find(x => x.id === eqSkin);
    if(curSkin && curSkin.motif){
        const bx=ball.x,by=ball.y,br=ball.r;
        ctx.save();ctx.beginPath();ctx.arc(bx,by,br,0,Math.PI*2);ctx.clip();
        if(curSkin.motif==='billiard'){
            ctx.fillStyle='rgba(255,255,255,.9)';ctx.beginPath();ctx.arc(bx,by,br*.4,0,Math.PI*2);ctx.fill();
            ctx.fillStyle='rgba(0,0,0,.85)';ctx.font='bold '+Math.round(br*.65)+'px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('8',bx,by+1*S);
        }else if(curSkin.motif==='smiley'){
            ctx.fillStyle='rgba(0,0,0,.6)';
            ctx.beginPath();ctx.arc(bx-br*.28,by-br*.15,br*.12,0,Math.PI*2);ctx.fill();
            ctx.beginPath();ctx.arc(bx+br*.28,by-br*.15,br*.12,0,Math.PI*2);ctx.fill();
            ctx.strokeStyle='rgba(0,0,0,.6)';ctx.lineWidth=1.8*S;ctx.lineCap='round';
            ctx.beginPath();ctx.arc(bx,by+br*.05,br*.4,.15,Math.PI-.15);ctx.stroke();
        }
        ctx.restore();
    }
    ctx.beginPath();ctx.arc(ball.x-3*S,ball.y-4*S,4*S,0,Math.PI*2);ctx.fillStyle='rgba(255,255,255,.35)';ctx.fill();
    if(godMode&&gameStarted){ctx.fillStyle='rgba(255,80,80,0.25)';ctx.font='bold '+Math.round(10*S)+'px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('GOD',ball.x,ball.y)}
    ctx.restore();

    if(gameStarted){
        ctx.globalAlpha=.15;ctx.beginPath();ctx.arc(ball.x-speed*1.5,ball.y-ball.vy*.5,ball.r*.7,0,Math.PI*2);ctx.fillStyle=rgba(sk.glow,.3);ctx.fill();
        ctx.globalAlpha=.08;ctx.beginPath();ctx.arc(ball.x-speed*3,ball.y-ball.vy*1,ball.r*.4,0,Math.PI*2);ctx.fillStyle=rgba(sk.glow,.2);ctx.fill();ctx.globalAlpha=1;
    }

    for(const p of particles){ctx.globalAlpha=p.life;ctx.fillStyle=rgb(p.c);ctx.fillRect(p.x-p.sz/2,p.y-p.sz/2,p.sz,p.sz)}ctx.globalAlpha=1;

    if(gameStarted){const dist=32*S;const ay=ball.gDir===1?ball.y+dist:ball.y-dist;ctx.fillStyle=rgba(sk.glow,.4);ctx.font='bold '+Math.round(16*S)+'px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(ball.gDir===1?'▼':'▲',ball.x,ay)}
}

function dRR(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.lineTo(x+w-r,y);c.quadraticCurveTo(x+w,y,x+w,y+r);c.lineTo(x+w,y+h-r);c.quadraticCurveTo(x+w,y+h,x+w-r,y+h);c.lineTo(x+r,y+h);c.quadraticCurveTo(x,y+h,x,y+h-r);c.lineTo(x,y+r);c.quadraticCurveTo(x,y,x+r,y);c.closePath()}

