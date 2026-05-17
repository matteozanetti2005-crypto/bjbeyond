<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Phoenix Simulator — BJ Beyond</title>
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Share+Tech+Mono&display=swap" rel="stylesheet">
<style>
:root { --cyan: #00e5ff; --red: #ff4d4d; --green: #39ff14; --amber: #ffaa00; --purple: #bf80ff; --bg: #0a0a14; --card: #0d0d1f; --border: #1e1e3a; --text: #e0e0e0; --muted: #555; }
* { box-sizing:border-box; margin:0; padding:0; }
body { background:var(--bg); color:var(--text); font-family:'Share Tech Mono', monospace; min-height:100vh; }
.container { max-width:540px; margin:0 auto; padding:28px 16px 48px; }
.header { text-align:center; margin-bottom:32px; }
.header-eyebrow { font-family:'Orbitron', monospace; font-size:9px; letter-spacing:5px; color:var(--cyan); margin-bottom:10px; opacity:0.7; }
.header-title { font-family:'Orbitron', monospace; font-size:clamp(22px,6vw,32px); font-weight:900; background:linear-gradient(90deg, var(--cyan), var(--red)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; letter-spacing:3px; line-height:1.1; margin-bottom:10px; }
.header-sub { font-size:10px; color:var(--muted); line-height:1.6; }
.header-sub a { color:rgba(0,229,255,0.5); text-decoration:none; }
.badge { display:inline-flex; align-items:center; gap:6px; background:rgba(0,229,255,0.06); border:1px solid rgba(0,229,255,0.2); border-radius:20px; padding:4px 12px; margin-top:10px; font-size:9px; color:rgba(0,229,255,0.7); letter-spacing:2px; font-family:'Orbitron', monospace; }
.badge-dot { width:6px; height:6px; border-radius:50%; background:var(--cyan); animation:blink 2s infinite; }
@keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0.3;} }
.card { background:var(--card); border:1px solid var(--border); border-radius:10px; padding:18px; margin-bottom:14px; }
.card-label { font-size:9px; color:var(--muted); letter-spacing:3px; margin-bottom:12px; font-family:'Orbitron', monospace; }
.url-input { width:100%; background:transparent; border:none; outline:none; color:var(--cyan); font-size:13px; font-family:'Share Tech Mono', monospace; line-height:1.6; caret-color:var(--cyan); padding:4px 0; border-bottom:1px solid var(--border); }
.url-input::placeholder { color:#2a2a3a; }
.divider { display:flex; align-items:center; gap:12px; margin:14px 0; font-size:9px; color:var(--muted); letter-spacing:3px; }
.divider::before, .divider::after { content:''; flex:1; height:1px; background:var(--border); }
textarea { width:100%; min-height:80px; background:transparent; border:none; outline:none; resize:none; color:var(--text); font-size:14px; font-family:'Share Tech Mono', monospace; line-height:1.6; caret-color:var(--cyan); }
textarea::placeholder { color:#2a2a3a; }
.input-footer { display:flex; justify-content:space-between; align-items:center; margin-top:10px; padding-top:10px; border-top:1px solid var(--border); }
.char-count { font-size:10px; color:var(--muted); }
.char-count.warn { color:var(--red); }
.btn-run { background:transparent; border:1px solid var(--cyan); color:var(--cyan); padding:9px 22px; border-radius:6px; cursor:pointer; font-size:11px; font-family:'Orbitron', monospace; letter-spacing:2px; transition:all 0.2s; }
.btn-run:hover:not(:disabled) { background:rgba(0,229,255,0.08); box-shadow:0 0 16px rgba(0,229,255,0.2); }
.btn-run:disabled { border-color:#333; color:#444; cursor:default; }
.extracted-text { font-size:11px; color:#888; line-height:1.6; padding:10px; background:rgba(0,229,255,0.03); border-left:2px solid rgba(0,229,255,0.2); border-radius:0 6px 6px 0; margin-bottom:14px; font-style:italic; }
.step { display:flex; align-items:center; gap:12px; padding:8px 0; transition:opacity 0.4s; }
.step.inactive { opacity:0.25; }
.step-num { width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0; font-family:'Orbitron', monospace; font-size:10px; font-weight:700; transition:all 0.3s; }
.step-num.done { background:rgba(0,229,255,0.1); border:1px solid var(--cyan); color:var(--cyan); }
.step-num.active { background:rgba(255,77,77,0.1); border:1px solid var(--red); color:var(--red); animation:pulse 0.8s infinite; }
.step-num.idle { background:#111; border:1px solid #2a2a3a; color:#444; }
@keyframes pulse { 0%,100%{box-shadow:0 0 0 0 rgba(255,77,77,0.3);} 50%{box-shadow:0 0 0 5px rgba(255,77,77,0);} }
.step-text { font-size:12px; }
.step-text.done{color:#aaa;} .step-text.active{color:#fff;} .step-text.idle{color:#444;}
.score-row { display:flex; align-items:center; gap:20px; }
.score-info { flex:1; }
.score-verdict { font-family:'Orbitron', monospace; font-size:13px; font-weight:700; margin-bottom:8px; letter-spacing:1px; }
.score-stats { font-size:10px; color:#555; line-height:1.8; }
.bar-row { margin-bottom:11px; }
.bar-meta { display:flex; justify-content:space-between; margin-bottom:5px; }
.bar-label { font-size:11px; color:#888; }
.bar-val { font-size:11px; font-family:'Orbitron', monospace; font-weight:700; }
.bar-track { height:5px; background:#111; border-radius:3px; overflow:hidden; }
.bar-fill { height:100%; border-radius:3px; transition:width 1s cubic-bezier(.4,0,.2,1); }
.signal { display:flex; align-items:center; gap:10px; padding:6px 0; border-bottom:1px solid #0f0f1e; font-size:11px; }
.signal:last-child { border-bottom:none; }
.error-box { background:rgba(255,77,77,0.05); border:1px solid rgba(255,77,77,0.3); border-radius:8px; padding:14px; font-size:11px; color:#ff7070; line-height:1.6; }
.btn-share { width:100%; padding:12px; background:rgba(0,229,255,0.06); border:1px solid rgba(0,229,255,0.3); border-radius:8px; color:var(--cyan); font-family:'Orbitron', monospace; font-size:11px; letter-spacing:2px; cursor:pointer; transition:all 0.2s; margin-bottom:14px; }
.btn-share:hover { background:rgba(0,229,255,0.12); box-shadow:0 0 20px rgba(0,229,255,0.15); }
.disclaimer { font-size:9px; color:#383848; line-height:1.7; padding:10px 14px; background:#07070f; border:1px solid var(--border); border-radius:8px; }
.footer { text-align:center; margin-top:28px; font-size:10px; color:#333; }
.footer a { color:rgba(0,229,255,0.4); text-decoration:none; }
.fade-in { animation:fadeIn 0.5s ease forwards; }
@keyframes fadeIn { from{opacity:0;transform:translateY(8px);} to{opacity:1;transform:none;} }
.hidden { display:none; }
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
    <div class="badge"><div class="badge-dot"></div>POWERED BY GROQ</div>
  </div>

  <div class="card">
    <div class="card-label">PASTE X POST URL</div>
    <input type="url" id="postUrl" class="url-input" placeholder="https://x.com/username/status/...">
    <div class="divider">OR</div>
    <div class="card-label">PASTE POST TEXT</div>
    <textarea id="postText" maxlength="280" placeholder="Write or paste your X post text here..."></textarea>
    <div class="input-footer">
      <span class="char-count" id="charCount">0/280</span>
      <button class="btn-run" id="btnRun" onclick="runPipeline()">▶ ANALYZE WITH AI</button>
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
// =============================================
//  IMPORTANT: Replace with your own Groq API key
// =============================================
const GROQ_KEY = 'YOUR_GROQ_API_KEY_HERE';   // <--- REPLACE THIS
// =============================================

async function analyzeWithGroq(postText) {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${GROQ_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama-3.1-70b-versatile",
      messages: [
        {
          role: "system",
          content: "Return ONLY valid JSON: {\"finalScore\": number (15-96), \"verdict\": \"HIGH RANKING POTENTIAL\" or \"MODERATE SIGNAL\" or \"LOW REACH PREDICTED\", \"verdictColor\": \"#00e5ff\" or \"#ffaa00\" or \"#ff4d4d\", \"insight\": \"short explanation\", \"p_like\": number, \"p_reply\": number, \"p_repost\": number, \"p_dwell\": number}"
        },
        {
          role: "user",
          content: postText
        }
      ],
      temperature: 0.3,
      max_tokens: 300
    })
  });

  if (!res.ok) throw new Error("Groq API error");
  const data = await res.json();
  let resultText = data.choices[0].message.content;
  resultText = resultText.replace(/```json/g, "").replace(/```/g, "").trim();
  return JSON.parse(resultText);
}

const STEP_LABELS = ["Query hydration","Fetching post","Grox safety check","AI analysis","Phoenix score computed"];

const urlInput = document.getElementById('postUrl');
const textarea = document.getElementById('postText');
const btnRun = document.getElementById('btnRun');
const charCount = document.getElementById('charCount');

textarea.addEventListener('input', () => {
  const n = textarea.value.length;
  charCount.textContent = n + '/280';
  charCount.className = 'char-count' + (n > 250 ? ' warn' : '');
});

let currentResult = null;

async function runPipeline() {
  const url = urlInput.value.trim();
  let text = textarea.value.trim();

  if (!url && !text) {
    alert('Paste a URL or post text first.');
    return;
  }

  btnRun.disabled = true;
  btnRun.textContent = 'ANALYZING...';
  document.getElementById('results').classList.add('hidden');
  document.getElementById('results').innerHTML = '';

  const pc = document.getElementById('pipelineCard');
  pc.classList.remove('hidden');
  const stepsEl = document.getElementById('steps');
  stepsEl.innerHTML = STEP_LABELS.map((s, i) => `<div class="step inactive" id="step${i}"><div class="step-num idle" id="stepnum${i}">${i + 1}</div><div class="step-text idle" id="steptext${i}">${s}</div></div>`).join('');

  let s = 0;
  const animateStep = () => {
    if (s > 0) {
      document.getElementById('stepnum' + (s - 1)).className = 'step-num done';
      document.getElementById('stepnum' + (s - 1)).textContent = '✓';
      document.getElementById('steptext' + (s - 1)).className = 'step-text done';
    }
    document.getElementById('step' + s).className = 'step';
    document.getElementById('stepnum' + s).className = 'step-num active';
    document.getElementById('steptext' + s).className = 'step-text active';
    s++;
  };

  try {
    for (let i = 0; i < 2; i++) { await new Promise(r => setTimeout(r, 450)); animateStep(); }

    if (url) {
      await new Promise(r => setTimeout(r, 450)); animateStep();
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl);
      const html = await response.text();
      let extracted = '';
      let match = html.match(/<meta property="og:description" content="([^"]+)"/i);
      if (match && match[1]) extracted = match[1];
      if (!extracted || extracted.length < 15) {
        match = html.match(/<title>([^<]+)<\/title>/i);
        if (match && match[1]) extracted = match[1].replace(/ \| X| on X/gi, '');
      }
      if (extracted.length > 15) {
        textarea.value = extracted;
        charCount.textContent = extracted.length + '/280';
        text = extracted;
      }
    } else {
      await new Promise(r => setTimeout(r, 450)); animateStep();
    }

    await new Promise(r => setTimeout(r, 450)); animateStep();

    const result = await analyzeWithGroq(text);

    await new Promise(r => setTimeout(r, 400)); animateStep();

    for (let i = 0; i < STEP_LABELS.length; i++) {
      document.getElementById('stepnum' + i).className = 'step-num done';
      document.getElementById('stepnum' + i).textContent = '✓';
      document.getElementById('steptext' + i).className = 'step-text done';
    }

    currentResult = result;
    showResults(result);

  } catch (err) {
    document.getElementById('stepnum' + (s - 1)).className = 'step-num active';
    document.getElementById('stepnum' + (s - 1)).textContent = '✗';
    document.getElementById('stepnum' + (s - 1)).style.borderColor = '#ff4d4d';
    document.getElementById('stepnum' + (s - 1)).style.color = '#ff4d4d';

    const el = document.getElementById('results');
    el.innerHTML = `<div class="error-box fade-in">⚠ ${err.message}</div>`;
    el.classList.remove('hidden');
  }

  btnRun.disabled = false;
  btnRun.textContent = '▶ ANALYZE WITH AI';
}

function showResults(r) {
  const el = document.getElementById('results');
  el.innerHTML = `
    <div class="card fade-in">
      <div class="card-label">FOR YOU RANKING SIGNAL</div>
      <div class="score-row">
        <div id="radialContainer">${radialSVG(r.finalScore || 50)}</div>
        <div class="score-info">
          <div class="score-verdict" style="color:${r.verdictColor || '#ffaa00'}">${r.verdict || 'MODERATE SIGNAL'}</div>
          <div class="score-stats">${r.insight || ''}</div>
        </div>
      </div>
    </div>
    <button class="btn-share fade-in" onclick="shareOnX()">↗ SHARE YOUR RESULT ON X</button>
    <div class="disclaimer fade-in">⚠ Powered by Groq (Llama 3.1 70B)</div>
  `;
  el.classList.remove('hidden');
}

function radialSVG(score) {
  const r = 44, circ = 2 * Math.PI * r, dash = (score / 100) * circ;
  const color = score >= 70 ? '#00e5ff' : score >= 45 ? '#ffaa00' : '#ff4d4d';
  return `<svg width="110" height="110" viewBox="0 0 100 100"><circle cx="50" cy="50" r="${r}" fill="none" stroke="#1a1a2e" stroke-width="8"/><circle cx="50" cy="50" r="${r}" fill="none" stroke="${color}" stroke-width="8" stroke-dasharray="${dash} ${circ}" stroke-linecap="round" transform="rotate(-90 50 50)"/><text x="50" y="46" text-anchor="middle" fill="${color}" style="font-size:20px;font-family:Orbitron,monospace;font-weight:700">${score}</text><text x="50" y="60" text-anchor="middle" fill="#888" style="font-size:9px;font-family:monospace">/100</text></svg>`;
}

function shareOnX() {
  if (!currentResult) return;
  const score = currentResult.finalScore || 50;
  const v = score >= 75 ? 'HIGH RANKING POTENTIAL 🔥' : score >= 50 ? 'MODERATE SIGNAL ⚡' : 'LOW REACH PREDICTED';
  window.open('https://x.com/intent/tweet?text=' + encodeURIComponent('I just ran my post through the Phoenix AI simulator.\n\nScore: ' + score + '/100 — ' + v + '\n\nTest yours 👇\nbjbeyond.it/Phoenix\n\n@bj_beyond #XAlgorithm #Phoenix'), '_blank');
}
</script>
</body>
</html>