<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Phoenix Simulator — BJ Beyond</title>
<meta name="description" content="Simulate how X's Phoenix algorithm would rank your post. Based on xai-org/x-algorithm.">
<meta property="og:title" content="Phoenix Simulator — BJ Beyond">
<meta property="og:description" content="How would X's Phoenix algorithm rank your post? Find out in seconds.">
<meta property="og:url" content="https://bjbeyond.it/Phoenix">
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Share+Tech+Mono&display=swap" rel="stylesheet">
<style>
:root {
  --cyan: #00e5ff; --red: #ff4d4d; --green: #39ff14;
  --amber: #ffaa00; --purple: #bf80ff;
  --bg: #0a0a14; --card: #0d0d1f; --border: #1e1e3a;
  --text: #e0e0e0; --muted: #555;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: var(--bg); color: var(--text); font-family: 'Share Tech Mono', monospace; min-height: 100vh; }
body::before {
  content: ''; position: fixed; inset: 0;
  background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,229,255,0.012) 2px, rgba(0,229,255,0.012) 4px);
  pointer-events: none; z-index: 1000;
}
.container { max-width: 540px; margin: 0 auto; padding: 28px 16px 48px; }
.header { text-align: center; margin-bottom: 32px; }
.header-eyebrow { font-family: 'Orbitron', monospace; font-size: 9px; letter-spacing: 5px; color: var(--cyan); margin-bottom: 10px; opacity: 0.7; }
.header-title {
  font-family: 'Orbitron', monospace; font-size: clamp(22px,6vw,32px); font-weight: 900;
  background: linear-gradient(90deg, var(--cyan), var(--red));
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  letter-spacing: 3px; line-height: 1.1; margin-bottom: 10px;
}
.header-sub { font-size: 10px; color: var(--muted); line-height: 1.6; }
.header-sub a { color: rgba(0,229,255,0.5); text-decoration: none; }
.badge {
  display: inline-flex; align-items: center; gap: 6px;
  background: rgba(0,229,255,0.06); border: 1px solid rgba(0,229,255,0.2);
  border-radius: 20px; padding: 4px 12px; margin-top: 10px;
  font-size: 9px; color: rgba(0,229,255,0.7); letter-spacing: 2px;
  font-family: 'Orbitron', monospace;
}
.badge-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--cyan); animation: blink 2s infinite; }
@keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0.3;} }
.card { background: var(--card); border: 1px solid var(--border); border-radius: 10px; padding: 18px; margin-bottom: 14px; }
.card-label { font-size: 9px; color: var(--muted); letter-spacing: 3px; margin-bottom: 12px; font-family: 'Orbitron', monospace; }
textarea { width: 100%; min-height: 100px; background: transparent; border: none; outline: none; resize: none; color: var(--text); font-size: 14px; font-family: 'Share Tech Mono', monospace; line-height: 1.6; caret-color: var(--cyan); }
textarea::placeholder { color: #2a2a3a; }
.input-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--border); }
.char-count { font-size: 10px; color: var(--muted); }
.char-count.warn { color: var(--red); }
.btn-run { background: transparent; border: 1px solid var(--cyan); color: var(--cyan); padding: 9px 22px; border-radius: 6px; cursor: pointer; font-size: 11px; font-family: 'Orbitron', monospace; letter-spacing: 2px; transition: all 0.2s; }
.btn-run:hover:not(:disabled) { background: rgba(0,229,255,0.08); box-shadow: 0 0 16px rgba(0,229,255,0.2); }
.btn-run:disabled { border-color: #333; color: #444; cursor: default; }
.step { display: flex; align-items: center; gap: 12px; padding: 8px 0; transition: opacity 0.4s; }
.step.inactive { opacity: 0.25; }
.step-num { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-family: 'Orbitron', monospace; font-size: 10px; font-weight: 700; transition: all 0.3s; }
.step-num.done { background: rgba(0,229,255,0.1); border: 1px solid var(--cyan); color: var(--cyan); }
.step-num.active { background: rgba(255,77,77,0.1); border: 1px solid var(--red); color: var(--red); animation: pulse 0.8s infinite; }
.step-num.idle { background: #111; border: 1px solid #2a2a3a; color: #444; }
@keyframes pulse { 0%,100%{box-shadow:0 0 0 0 rgba(255,77,77,0.3);} 50%{box-shadow:0 0 0 5px rgba(255,77,77,0);} }
.step-text { font-size: 12px; }
.step-text.done{color:#aaa;} .step-text.active{color:#fff;} .step-text.idle{color:#444;}
.score-row { display: flex; align-items: center; gap: 20px; }
.score-info { flex: 1; }
.score-verdict { font-family: 'Orbitron', monospace; font-size: 13px; font-weight: 700; margin-bottom: 8px; letter-spacing: 1px; }
.score-stats { font-size: 10px; color: #555; line-height: 1.8; }
.bar-row { margin-bottom: 11px; }
.bar-meta { display: flex; justify-content: space-between; margin-bottom: 5px; }
.bar-label { font-size: 11px; color: #888; }
.bar-val { font-size: 11px; font-family: 'Orbitron', monospace; font-weight: 700; }
.bar-track { height: 5px; background: #111; border-radius: 3px; overflow: hidden; }
.bar-fill { height: 100%; border-radius: 3px; transition: width 1s cubic-bezier(.4,0,.2,1); }
.signal { display: flex; align-items: center; gap: 10px; padding: 6px 0; border-bottom: 1px solid #0f0f1e; font-size: 11px; }
.signal:last-child { border-bottom: none; }
.btn-share { width: 100%; padding: 12px; background: rgba(0,229,255,0.06); border: 1px solid rgba(0,229,255,0.3); border-radius: 8px; color: var(--cyan); font-family: 'Orbitron', monospace; font-size: 11px; letter-spacing: 2px; cursor: pointer; transition: all 0.2s; margin-bottom: 14px; }
.btn-share:hover { background: rgba(0,229,255,0.12); box-shadow: 0 0 20px rgba(0,229,255,0.15); }
.disclaimer { font-size: 9px; color: #383848; line-height: 1.7; padding: 10px 14px; background: #07070f; border: 1px solid var(--border); border-radius: 8px; }
.footer { text-align: center; margin-top: 28px; font-size: 10px; color: #333; }
.footer a { color: rgba(0,229,255,0.4); text-decoration: none; }
.fade-in { animation: fadeIn 0.5s ease forwards; }
@keyframes fadeIn { from{opacity:0;transform:translateY(8px);} to{opacity:1;transform:none;} }
.hidden { display: none; }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <div class="header-eyebrow">BJ BEYOND x X ALGORITHM</div>
    <div class="header-title">PHOENIX<br>SIMULATOR</div>
    <div class="header-sub">
      Based on <a href="https://github.com/xai-org/x-algorithm" target="_blank">xai-org/x-algorithm</a> · May 15 2026 · <a href="https://bjbeyond.it">bjbeyond.it</a>
    </div>
    <div class="badge"><div class="badge-dot"></div>OPEN SOURCE ALGORITHM</div>
  </div>

  <div class="card">
    <div class="card-label">ENTER YOUR POST TEXT</div>
    <textarea id="postText" maxlength="280" placeholder="Write or paste your X post here..."></textarea>
    <div class="input-footer">
      <span class="char-count" id="charCount">0/280</span>
      <button class="btn-run" id="btnRun" disabled onclick="runPipeline()">&#9654; RUN PIPELINE</button>
    </div>
  </div>

  <div class="card hidden" id="pipelineCard">
    <div class="card-label">PIPELINE</div>
    <div id="steps"></div>
  </div>

  <div id="results" class="hidden"></div>

  <div class="footer">
    <a href="https://bjbeyond.it">bjbeyond.it</a> · <a href="https://x.com/bj_beyond">@bj_beyond</a>
  </div>
</div>

<script>
const STEP_LABELS = ["Query hydration","Candidate sourcing","Grox safety check","Phoenix Transformer ranking","Score computed"];
const METRICS = {
  favorite:{ label:"Like probability",     icon:"&#9825;", color:"#00e5ff" },
  reply:   { label:"Reply probability",    icon:"&#8617;", color:"#ff4d4d" },
  repost:  { label:"Repost probability",   icon:"&#8635;", color:"#39ff14" },
  dwell:   { label:"Dwell time score",     icon:"&#9201;", color:"#ffaa00" },
  oon:     { label:"Out-of-network reach", icon:"&#128225;", color:"#bf80ff" },
  spam:    { label:"Spam signal",          icon:"&#9888;", color:"#ff4444" }
};

const textarea=document.getElementById('postText');
const btnRun=document.getElementById('btnRun');
const charCount=document.getElementById('charCount');

textarea.addEventListener('input',()=>{
  const n=textarea.value.length;
  charCount.textContent=n+'/280';
  charCount.className='char-count'+(n>250?' warn':'');
  btnRun.disabled=textarea.value.trim().length<5;
});

function analyzePost(text){
  const words=text.trim().split(/\s+/),chars=text.length;
  const sentences=text.split(/[.!?]+/).filter(Boolean).length;
  const hook=words.slice(0,8).join(' ');
  const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
  const hasQ=/\?/.test(text),hasN=/\d+/.test(text),hasHash=/#\w+/.test(text);
  const hasEmoji=/\p{Emoji}/u.test(text),hasThread=/\uD83E\uDDF5|thread|1\//i.test(text);
  const hasUrg=/breaking|just|now|today/i.test(text);
  const hasList=/\u2192|\u2022|\d\.|step/i.test(text);
  const hasContra=/wrong|nobody|everyone|actually|myth/i.test(text);
  const hasProof=/million|billion|study|research|data|report/i.test(text);
  const caps=(text.match(/[A-Z]/g)||[]).length/Math.max(chars,1);
  const spam=/buy now|click here|follow back|dm me|free money/i.test(text);
  const hookStr=[/\?/.test(hook),/\d+/.test(hook),hasUrg,/^(if|why|how|what|here|nobody|most)/i.test(hook),hasEmoji].filter(Boolean).length;
  const pFav=clamp(0.05+hookStr*0.06+(hasN?.05:0)+(hasProof?.04:0)+(chars>100?.03:0));
  const pRep=clamp(0.02+(hasQ?.08:0)+(hasContra?.05:0)+(hasThread?.03:0));
  const pRet=clamp(0.02+(hasProof?.06:0)+(hasList?.04:0)+(hasN?.03:0));
  const pDwl=clamp(0.3+(Math.min(chars,280)/280)*0.3+(hasList?.1:0)+(sentences>2?.05:0));
  const pShr=clamp(0.01+(hasProof?.04:0)+(hasContra?.03:0));
  const pOon=clamp((hasHash?.05:0)+(hasProof?.04:0)+(hasN?.03:0)+hookStr*0.02);
  const spamS=spam?0.7:caps>0.3?0.3:0.02,blockP=spam?0.5:caps>0.4?0.25:0.03;
  const raw=pFav*0.5+pRep*1.0+pRet*0.4+pDwl*0.8+pShr*0.6+pOon*0.15+spamS*(-3.0)+blockP*(-2.5);
  const finalScore=Math.round(clamp((raw+1)/1.8)*100);
  const signals=[];
  if(hasUrg)      signals.push({t:"Urgency signal detected",pos:true});
  if(hookStr>=3)  signals.push({t:"Strong hook (first 8 words)",pos:true});
  if(hasQ)        signals.push({t:"Question \u2192 reply trigger",pos:true});
  if(hasN)        signals.push({t:"Numbers \u2192 credibility boost",pos:true});
  if(hasProof)    signals.push({t:"Social proof / data detected",pos:true});
  if(hasList)     signals.push({t:"List/steps \u2192 dwell time \u2191",pos:true});
  if(hasThread)   signals.push({t:"Thread format detected",pos:true});
  if(hasHash)     signals.push({t:"Hashtags \u2192 OON discovery",pos:true});
  if(spam)        signals.push({t:"Spam language detected",pos:false});
  if(caps>0.3)    signals.push({t:"Excessive CAPS \u2192 spam signal",pos:false});
  if(blockP>0.15) signals.push({t:"Block prediction elevated",pos:false});
  if(chars<50)    signals.push({t:"Too short \u2192 low dwell time",pos:false});
  if(!hasEmoji&&!hasN&&!hasQ) signals.push({t:"No hook triggers detected",pos:false});
  return{scores:{favorite:Math.round(pFav*100),reply:Math.round(pRep*100),repost:Math.round(pRet*100),dwell:Math.round(pDwl*100),oon:Math.round(pOon*100),spam:Math.round(spamS*100)},finalScore,signals,stats:{words:words.length,chars,hookStr}};
}

function radialSVG(score){
  const r=44,circ=2*Math.PI*r,dash=(score/100)*circ;
  const color=score>=70?'#00e5ff':score>=45?'#ffaa00':'#ff4d4d';
  return'<svg width="110" height="110" viewBox="0 0 100 100"><circle cx="50" cy="50" r="'+r+'" fill="none" stroke="#1a1a2e" stroke-width="8"/><circle cx="50" cy="50" r="'+r+'" fill="none" stroke="'+color+'" stroke-width="8" stroke-dasharray="'+dash+' '+circ+'" stroke-linecap="round" transform="rotate(-90 50 50)" style="transition:stroke-dasharray 1.2s cubic-bezier(.4,0,.2,1)"/><text x="50" y="46" text-anchor="middle" fill="'+color+'" style="font-size:20px;font-family:Orbitron,monospace;font-weight:700">'+score+'</text><text x="50" y="60" text-anchor="middle" fill="#888" style="font-size:9px;font-family:monospace">/100</text></svg>';
}

let currentResult=null;

function runPipeline(){
  const text=textarea.value.trim();
  if(!text)return;
  btnRun.disabled=true;
  btnRun.textContent='RUNNING...';
  document.getElementById('results').classList.add('hidden');
  document.getElementById('results').innerHTML='';
  const pc=document.getElementById('pipelineCard');
  pc.classList.remove('hidden');
  const stepsEl=document.getElementById('steps');
  stepsEl.innerHTML=STEP_LABELS.map((s,i)=>'<div class="step inactive" id="step'+i+'"><div class="step-num idle" id="stepnum'+i+'">'+( i+1)+'</div><div class="step-text idle" id="steptext'+i+'">'+s+'</div></div>').join('');
  let s=0;
  const iv=setInterval(()=>{
    if(s>0){
      document.getElementById('stepnum'+(s-1)).className='step-num done';
      document.getElementById('stepnum'+(s-1)).textContent='\u2713';
      document.getElementById('steptext'+(s-1)).className='step-text done';
    }
    if(s<STEP_LABELS.length){
      document.getElementById('step'+s).className='step';
      document.getElementById('stepnum'+s).className='step-num active';
      document.getElementById('steptext'+s).className='step-text active';
      s++;
    } else {
      clearInterval(iv);
      const last=STEP_LABELS.length-1;
      document.getElementById('stepnum'+last).className='step-num done';
      document.getElementById('stepnum'+last).textContent='\u2713';
      document.getElementById('steptext'+last).className='step-text done';
      currentResult=analyzePost(text);
      showResults(currentResult);
      btnRun.disabled=false;
      btnRun.textContent='\u25B6 RUN PIPELINE';
    }
  },430);
}

function showResults(r){
  const v=r.finalScore>=75?{text:'HIGH RANKING POTENTIAL',color:'#00e5ff'}:r.finalScore>=50?{text:'MODERATE SIGNAL',color:'#ffaa00'}:{text:'LOW REACH PREDICTED',color:'#ff4d4d'};
  const barsHTML=Object.entries(r.scores).map(([k,val])=>{
    const m=METRICS[k];
    return'<div class="bar-row"><div class="bar-meta"><span class="bar-label">'+m.icon+' '+m.label+'</span><span class="bar-val" style="color:'+m.color+'">'+val+'%</span></div><div class="bar-track"><div class="bar-fill" id="bar_'+k+'" style="width:0%;background:'+m.color+';box-shadow:0 0 8px '+m.color+'55"></div></div></div>';
  }).join('');
  const sigHTML=r.signals.length?r.signals.map(s=>'<div class="signal"><span style="color:'+(s.pos?'#39ff14':'#ff4d4d')+';font-size:13px">'+(s.pos?'+':'\u2212')+'</span><span style="color:'+(s.pos?'#aaa':'#ff7070')+'">'+s.t+'</span></div>').join(''):'<div style="font-size:11px;color:#555">No signals detected.</div>';
  const el=document.getElementById('results');
  el.innerHTML='<div class="card fade-in"><div class="card-label">FOR YOU RANKING SIGNAL</div><div class="score-row"><div id="radialContainer">'+radialSVG(0)+'</div><div class="score-info"><div class="score-verdict" style="color:'+v.color+'">'+v.text+'</div><div class="score-stats">'+r.stats.words+' words &middot; '+r.stats.chars+' chars<br>Hook strength: '+r.stats.hookStr+'/5</div></div></div></div><div class="card fade-in" style="animation-delay:0.1s"><div class="card-label">PREDICTED ENGAGEMENT</div>'+barsHTML+'</div><div class="card fade-in" style="animation-delay:0.2s"><div class="card-label">SIGNAL ANALYSIS</div>'+sigHTML+'</div><button class="btn-share fade-in" style="animation-delay:0.3s" onclick="shareOnX()">\u2197 SHARE YOUR RESULT ON X</button><div class="disclaimer fade-in" style="animation-delay:0.35s">\u26A0 SIMULATION &mdash; Based on the public architecture of xai-org/x-algorithm (May 15 2026). The real model uses embeddings trained on billions of interactions. These scores are educational approximations, not output from X\'s production system.</div>';
  el.classList.remove('hidden');
  setTimeout(()=>{
    document.getElementById('radialContainer').innerHTML=radialSVG(r.finalScore);
    Object.keys(r.scores).forEach(k=>{const b=document.getElementById('bar_'+k);if(b)setTimeout(()=>b.style.width=r.scores[k]+'%',50);});
  },80);
}

function shareOnX(){
  if(!currentResult)return;
  const score=currentResult.finalScore;
  const v=score>=75?'HIGH RANKING POTENTIAL \uD83D\uDD25':score>=50?'MODERATE SIGNAL \u26A1':'LOW REACH PREDICTED';
  window.open('https://x.com/intent/tweet?text='+encodeURIComponent('I just ran my post through the Phoenix algorithm simulator.\n\nScore: '+score+'/100 \u2014 '+v+'\n\nTest yours \uD83D\uDC47\nbjbeyond.it/Phoenix\n\n@bj_beyond #XAlgorithm #Phoenix'),'_blank');
}
</script>
</body>
</html>
