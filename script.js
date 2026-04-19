/* ============================================================
   MonOpSy v3 — script.js
   ============================================================ */

// ─── STATE ────────────────────────────────────────────────
const S = {
  windows: [],
  winCount: 0,
  activeWin: null,
  dragging: false,
  dragWin: null,
  dragOff: {x:0,y:0},
  resizing: false,
  locked: false,
  pin: '',
  pinInput: '',
  volume: true,
};
const KEYS = {
  SETTINGS: 'mop3_settings',
  TODO: 'mop3_todo',
  NOTES: 'mop3_notes',
  EDITOR: 'mop3_editor',
  PIN: 'mop3_pin',
  FILES: 'mop3_files',
};
function cfg() { return JSON.parse(localStorage.getItem(KEYS.SETTINGS)||'{}'); }
function saveCfg(obj) { localStorage.setItem(KEYS.SETTINGS, JSON.stringify({...cfg(),...obj})); }

// ─── APP REGISTRY ─────────────────────────────────────────
const APPS = {
  calculator:   { name:'Calculator',    icon:'fa-calculator',    bg:'linear-gradient(135deg,#4a6cf7,#7a9cf7)', build: buildCalculator },
  textEditor:   { name:'Text Editor',   icon:'fa-file-alt',      bg:'linear-gradient(135deg,#f76a4a,#f7a44a)', build: buildTextEditor },
  browser:      { name:'Browser',       icon:'fa-globe',         bg:'linear-gradient(135deg,#4af76a,#4af7c4)', build: buildBrowser },
  fileExplorer: { name:'Files',         icon:'fa-folder',        bg:'linear-gradient(135deg,#f7c44a,#f7f04a)', build: buildFiles },
  terminal:     { name:'Terminal',      icon:'fa-terminal',      bg:'linear-gradient(135deg,#1e1e2e,#2e2e4e)', build: buildTerminal },
  settings:     { name:'Settings',      icon:'fa-cog',           bg:'linear-gradient(135deg,#6a6a7a,#9a9ab0)', build: buildSettings },
  todo:         { name:'To-Do',         icon:'fa-check-square',  bg:'linear-gradient(135deg,#c44af7,#f74ac4)', build: buildTodo },
  notes:        { name:'Notes',         icon:'fa-sticky-note',   bg:'linear-gradient(135deg,#f7e44a,#f7b84a)', build: buildNotes },
  calendar:     { name:'Calendar',      icon:'fa-calendar',      bg:'linear-gradient(135deg,#4af7e4,#4a9cf7)', build: buildCalendar },
  music:        { name:'Music',         icon:'fa-music',         bg:'linear-gradient(135deg,#f74a6a,#f74aaa)', build: buildMusic },
  imageViewer:  { name:'Viewer',        icon:'fa-image',         bg:'linear-gradient(135deg,#4af7aa,#4af76a)', build: buildImageViewer },
  weather:      { name:'Weather',       icon:'fa-cloud-sun',     bg:'linear-gradient(135deg,#4ac4f7,#4a6cf7)', build: buildWeather },
  clock:        { name:'Clock',         icon:'fa-clock',         bg:'linear-gradient(135deg,#2e2e2e,#4e4e6e)', build: buildClock },
  paint:        { name:'Paint',         icon:'fa-paint-brush',   bg:'linear-gradient(135deg,#f74aaa,#f7aa4a)', build: buildPaint },
  pomodoro:     { name:'Pomodoro',      icon:'fa-hourglass-half',bg:'linear-gradient(135deg,#f74a4a,#f7804a)', build: buildPomodoro },
  colorpicker:  { name:'Colors',        icon:'fa-eye-dropper',   bg:'linear-gradient(135deg,#aa4af7,#4af7f7)', build: buildColorPicker },
  markdown:     { name:'Markdown',      icon:'fab fa-markdown',  bg:'linear-gradient(135deg,#4a4af7,#4acaf7)', build: buildMarkdown },
  typingtest:   { name:'Typing',        icon:'fa-keyboard',      bg:'linear-gradient(135deg,#f7c44a,#4af7c4)', build: buildTypingTest },
  systemMonitor:{ name:'Monitor',       icon:'fa-chart-line',    bg:'linear-gradient(135deg,#4af74a,#c4f74a)', build: buildSysmon },
  snake:        { name:'Snake',         icon:'fa-gamepad',       bg:'linear-gradient(135deg,#2e4e2e,#4e8e4e)', build: buildSnake },
  memory:       { name:'Memory',        icon:'fa-brain',         bg:'linear-gradient(135deg,#6e2e8e,#ae4ef7)', build: buildMemory },
  puzzle:       { name:'Puzzle',        icon:'fa-puzzle-piece',  bg:'linear-gradient(135deg,#8e6e2e,#f7c44a)', build: buildPuzzle },
  tetris:       { name:'Tetris',        icon:'fa-th-large',      bg:'linear-gradient(135deg,#2e2e8e,#4a6cf7)', build: buildTetris },
  tictactoe:    { name:'TicTacToe',     icon:'fa-hashtag',       bg:'linear-gradient(135deg,#8e2e2e,#f74a4a)', build: buildTicTacToe },
};

// ─── BOOT ──────────────────────────────────────────────────
const BOOT_MSGS = [
  'Initializing kernel...','Loading system modules...','Mounting file system...',
  'Starting window manager...','Applying user preferences...','Ready.'
];
function boot() {
  const bar = document.getElementById('bootBar');
  const status = document.getElementById('bootStatus');
  let i = 0;
  const tick = () => {
    if(i >= BOOT_MSGS.length) {
      setTimeout(() => {
        document.getElementById('bootScreen').classList.add('out');
        setTimeout(() => document.getElementById('bootScreen').remove(), 700);
        applySettings();
        startClock();
        buildStartMenu();
        S.pin = localStorage.getItem(KEYS.PIN) || '1234';
        showNotification('Welcome','MonOpSy v3 is ready','fa-check-circle');
      }, 400);
      return;
    }
    status.textContent = BOOT_MSGS[i];
    bar.style.width = ((i+1)/BOOT_MSGS.length*100)+'%';
    i++; setTimeout(tick, 280);
  };
  setTimeout(tick, 200);
}
document.addEventListener('DOMContentLoaded', boot);

// ─── SETTINGS APPLY ────────────────────────────────────────
function applySettings() {
  const c = cfg();
  if(c.theme === 'light') document.documentElement.setAttribute('data-theme','light');
  if(c.wallpaper) document.body.style.backgroundImage = c.wallpaper;
}

// ─── CLOCK ─────────────────────────────────────────────────
function startClock() {
  const el = document.getElementById('tbClock');
  const tick = () => {
    const n = new Date();
    const h = String(n.getHours()).padStart(2,'0');
    const m = String(n.getMinutes()).padStart(2,'0');
    el.textContent = h+':'+m;
  };
  tick(); setInterval(tick, 30000);
}

// ─── NOTIFICATIONS ─────────────────────────────────────────
function showNotification(title, msg, icon='fa-bell') {
  const stack = document.getElementById('notifStack');
  const el = document.createElement('div');
  el.className = 'notif';
  el.innerHTML = `<div class="notif-icon"><i class="fas ${icon}"></i></div>
    <div class="notif-body"><div class="notif-title">${title}</div><div class="notif-msg">${msg}</div></div>`;
  stack.appendChild(el);
  setTimeout(() => { el.classList.add('out'); setTimeout(()=>el.remove(),300); }, 3000);
}

// ─── LOCK SCREEN ───────────────────────────────────────────
function lockScreen() {
  S.pinInput = '';
  updatePinDisplay();
  document.getElementById('lockErr').textContent = '';
  document.getElementById('lockScreen').classList.add('show');
  updateLockTime();
  S._lockClockInt = setInterval(updateLockTime, 1000);
}
function updateLockTime() {
  const n = new Date();
  const h = String(n.getHours()).padStart(2,'0');
  const m = String(n.getMinutes()).padStart(2,'0');
  document.getElementById('lockTime').textContent = h+':'+m;
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  document.getElementById('lockDate').textContent = `${days[n.getDay()]}, ${months[n.getMonth()]} ${n.getDate()}`;
}
function updatePinDisplay() {
  for(let i=0;i<4;i++) {
    const d = document.getElementById('pd'+i);
    d.classList.toggle('filled', i < S.pinInput.length);
  }
}
document.querySelectorAll('.pin-key').forEach(btn => {
  btn.addEventListener('click', () => {
    const v = btn.dataset.val;
    if(v==='clear') { S.pinInput=''; updatePinDisplay(); document.getElementById('lockErr').textContent=''; return; }
    if(v==='del') { S.pinInput=S.pinInput.slice(0,-1); updatePinDisplay(); return; }
    if(S.pinInput.length >= 4) return;
    S.pinInput += v;
    updatePinDisplay();
    if(S.pinInput.length === 4) {
      setTimeout(() => {
        if(S.pinInput === S.pin) {
          document.getElementById('lockScreen').classList.remove('show');
          clearInterval(S._lockClockInt);
          showNotification('Unlocked','Welcome back!','fa-lock-open');
        } else {
          document.getElementById('lockErr').textContent = 'Incorrect PIN. Try again.';
          S.pinInput = '';
          updatePinDisplay();
          document.getElementById('lockScreen').style.animation='shake .4s ease';
          setTimeout(()=>document.getElementById('lockScreen').style.animation='',500);
        }
      }, 200);
    }
  });
});

// ─── CONTEXT MENU ──────────────────────────────────────────
function showCtxMenu(e) {
  e.preventDefault();
  const m = document.getElementById('ctxMenu');
  m.style.left = Math.min(e.clientX, window.innerWidth-200)+'px';
  m.style.top = Math.min(e.clientY, window.innerHeight-200)+'px';
  m.classList.add('show');
}
function ctxAction(a) {
  hideCtxMenu();
  if(a==='refresh') { showNotification('Desktop','Refreshed','fa-sync'); }
  if(a==='lock') lockScreen();
  if(a==='settings') openApp('settings');
  if(a==='about') openAbout();
  if(a==='wallpaper') openApp('settings');
}
function hideCtxMenu() { document.getElementById('ctxMenu').classList.remove('show'); }
document.addEventListener('click', hideCtxMenu);

function openAbout() {
  createWindow('about','About MonOpSy','fa-info-circle','linear-gradient(135deg,#4a6cf7,#c44af7)',320,400,`
    <div class="about-wrap">
      <div class="about-logo">
        <svg width="48" height="48" viewBox="0 0 56 56" fill="none">
          <path d="M12 40L22 16L28 32L34 22L44 40" stroke="white" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="28" cy="28" r="3" fill="white"/>
        </svg>
      </div>
      <div style="font-family:var(--font-ui);font-weight:800;font-size:1.6rem">MonOpSy</div>
      <div class="about-version">Version 3.0.0</div>
      <div class="about-desc">A minimalist web-based operating system. Built with vanilla HTML, CSS, and JavaScript. Open-source under the MIT license.</div>
      <div style="font-size:.85rem">Made by <a href="https://github.com/Muhammednajah/MonOpSy" class="about-link" target="_blank">NajahCreates</a></div>
      <div style="font-size:.75rem;color:var(--text3);font-family:var(--font-mono)">@najah.creates · github.com/Muhammednajah</div>
      <a href="https://github.com/Muhammednajah/MonOpSy" target="_blank" class="app-btn" style="text-decoration:none"><i class="fab fa-github"></i> View on GitHub</a>
    </div>
  `);
}

// ─── WINDOW MANAGER ────────────────────────────────────────
let zBase = 100;
function createWindow(id, title, icon, iconBg, w, h, bodyHTML, onReady) {
  const wid = 'w'+(S.winCount++);
  const existing = S.windows.find(x=>x.appId===id);
  if(existing) { focusWindow(existing.wid); return; }

  const el = document.createElement('div');
  el.className = 'win';
  el.id = wid;
  const ox = 80 + (S.winCount*28)%320;
  const oy = 60 + (S.winCount*22)%200;
  el.style.cssText = `left:${ox}px;top:${oy}px;width:${w}px;height:${h}px;z-index:${++zBase}`;

  el.innerHTML = `
    <div class="win-header" id="wh_${wid}">
      <div class="win-title">
        <div class="app-icon-sm" style="background:${iconBg}"><i class="fas ${icon}" style="font-size:11px"></i></div>
        <span>${title}</span>
      </div>
      <div class="win-controls">
        <button class="win-ctrl min" title="Minimize"></button>
        <button class="win-ctrl max" title="Maximize"></button>
        <button class="win-ctrl close" title="Close"></button>
      </div>
    </div>
    <div class="win-body" id="wb_${wid}">${bodyHTML}</div>
  `;
  document.getElementById('desktop').appendChild(el);
  S.windows.push({wid, appId:id, minimized:false, maximized:false});

  el.querySelector('.win-ctrl.close').onclick  = ()=>closeWindow(wid);
  el.querySelector('.win-ctrl.min').onclick    = ()=>minimizeWindow(wid);
  el.querySelector('.win-ctrl.max').onclick    = ()=>toggleMaxWindow(wid);
  el.querySelector('.win-header').addEventListener('mousedown', e=>startDrag(e,wid));
  el.addEventListener('mousedown', ()=>focusWindow(wid));

  focusWindow(wid);
  updateTaskbar();
  if(onReady) setTimeout(onReady, 50);
  return wid;
}
function openApp(appId) {
  const app = APPS[appId];
  if(!app) return;
  const w = app.width||600, h = app.height||440;
  const wid = createWindow(appId, app.name, app.icon.replace('fab ',''), app.bg, w, h, '', ()=>{
    const body = document.getElementById('wb_'+wid);
    if(body && app.build) app.build(body, wid);
  });
  // icon style fix for fab
  setTimeout(()=>{
    const icons = document.querySelectorAll(`#wh_${wid} .app-icon-sm i`);
    icons.forEach(i=>{ if(app.icon.startsWith('fab ')) { i.className=''; i.classList.add('fab', app.icon.split(' ')[1]); } });
  },0);
}
function focusWindow(wid) {
  S.activeWin = wid;
  S.windows.forEach(w=>{
    const el = document.getElementById(w.wid);
    if(el) el.classList.toggle('active', w.wid===wid);
  });
  const el = document.getElementById(wid);
  if(el) el.style.zIndex = ++zBase;
  updateTaskbar();
}
function closeWindow(wid) {
  const el = document.getElementById(wid);
  if(el) { el.style.animation='winClose .2s ease forwards'; setTimeout(()=>el.remove(),200); }
  S.windows = S.windows.filter(w=>w.wid!==wid);
  updateTaskbar();
}
function minimizeWindow(wid) {
  const w = S.windows.find(x=>x.wid===wid);
  const el = document.getElementById(wid);
  if(w&&el) { w.minimized=true; el.classList.add('minimized'); }
  updateTaskbar();
}
function toggleMaxWindow(wid) {
  const w = S.windows.find(x=>x.wid===wid);
  const el = document.getElementById(wid);
  if(!w||!el) return;
  w.maximized = !w.maximized;
  el.classList.toggle('maximized', w.maximized);
}
function updateTaskbar() {
  const bar = document.getElementById('tbApps');
  bar.innerHTML = '';
  S.windows.forEach(w=>{
    const app = APPS[w.appId] || {name:w.appId, icon:'fa-window-maximize', bg:'#333'};
    const btn = document.createElement('button');
    btn.className = 'tb-app' + (w.wid===S.activeWin?' active':'');
    btn.innerHTML = `<span class="tb-app-icon"><i class="fas ${app.icon.replace('fab ','')}"></i></span><span class="tb-app-name">${app.name}</span>`;
    btn.title = app.name;
    btn.onclick = ()=>{
      const el = document.getElementById(w.wid);
      if(!el) return;
      if(w.minimized) { w.minimized=false; el.classList.remove('minimized'); focusWindow(w.wid); }
      else if(w.wid===S.activeWin) minimizeWindow(w.wid);
      else focusWindow(w.wid);
    };
    bar.appendChild(btn);
  });
}

// ─── DRAGGING ──────────────────────────────────────────────
function startDrag(e, wid) {
  if(e.target.classList.contains('win-ctrl')) return;
  const w = S.windows.find(x=>x.wid===wid);
  if(w?.maximized) return;
  S.dragging=true; S.dragWin=wid;
  const el = document.getElementById(wid);
  const r = el.getBoundingClientRect();
  S.dragOff = {x: e.clientX-r.left, y: e.clientY-r.top};
}
document.addEventListener('mousemove', e=>{
  if(!S.dragging||!S.dragWin) return;
  const el = document.getElementById(S.dragWin);
  if(!el) return;
  const maxY = window.innerHeight - 52 - el.offsetHeight;
  const x = Math.max(0, Math.min(e.clientX-S.dragOff.x, window.innerWidth-el.offsetWidth));
  const y = Math.max(0, Math.min(e.clientY-S.dragOff.y, maxY));
  el.style.left=x+'px'; el.style.top=y+'px';
});
document.addEventListener('mouseup', ()=>{ S.dragging=false; S.dragWin=null; });

// ─── START MENU ────────────────────────────────────────────
function buildStartMenu() {
  const grid = document.getElementById('smGrid');
  grid.innerHTML = '';
  Object.entries(APPS).forEach(([id,app])=>{
    const el = document.createElement('div');
    el.className = 'sm-app'; el.dataset.name=app.name.toLowerCase();
    el.innerHTML = `
      <div class="sm-app-icon" style="background:${app.bg}">
        <i class="${app.icon.startsWith('fab')?app.icon:'fas '+app.icon}"></i>
      </div>
      <div class="sm-app-name">${app.name}</div>
    `;
    el.onclick = ()=>{ openApp(id); toggleStartMenu(); };
    grid.appendChild(el);
  });
}
function toggleStartMenu() {
  document.getElementById('startMenu').classList.toggle('show');
}
function filterStartApps(q) {
  document.querySelectorAll('.sm-app').forEach(el=>{
    el.style.display = el.dataset.name.includes(q.toLowerCase()) ? '' : 'none';
  });
}
document.addEventListener('click', e=>{
  const sm = document.getElementById('startMenu');
  const btn = document.getElementById('tbStart');
  if(!sm.contains(e.target)&&!btn.contains(e.target)) sm.classList.remove('show');
});

function toggleVolume() {
  S.volume = !S.volume;
  document.getElementById('volIcon').className = S.volume ? 'fas fa-volume-up' : 'fas fa-volume-mute';
}

// =============================================================
//  APP BUILDERS
// =============================================================

// ─── CALCULATOR ────────────────────────────────────────────
function buildCalculator(body) {
  body.innerHTML = `
    <div class="calc-wrap">
      <div class="calc-disp" id="calcDisp">0</div>
      <div class="calc-btns">
        <button class="calc-btn clr" onclick="calcClear()">C</button>
        <button class="calc-btn op" onclick="calcInput('/')">/</button>
        <button class="calc-btn op" onclick="calcInput('*')">×</button>
        <button class="calc-btn op" onclick="calcDel()">⌫</button>
        ${['7','8','9','-','4','5','6','+','1','2','3','.','0','00'].map(n=>`<button class="calc-btn ${isNaN(n)&&n!='.'?'op':''}" onclick="calcInput('${n}')">${n==='*'?'×':n}</button>`).join('')}
        <button class="calc-btn eq" onclick="calcEval()">=</button>
      </div>
    </div>`;
  window._calcVal = '0'; window._calcNew = true;
}
function calcInput(v) {
  const d = document.getElementById('calcDisp'); if(!d) return;
  if(window._calcNew&&!isNaN(v)) { window._calcVal=v; window._calcNew=false; }
  else { if(window._calcVal==='0'&&!isNaN(v)) window._calcVal=v; else window._calcVal+=v; }
  d.textContent = window._calcVal;
}
function calcClear() { window._calcVal='0'; window._calcNew=true; const d=document.getElementById('calcDisp'); if(d) d.textContent='0'; }
function calcDel() { window._calcVal=window._calcVal.length>1?window._calcVal.slice(0,-1):'0'; const d=document.getElementById('calcDisp'); if(d) d.textContent=window._calcVal; }
function calcEval() {
  try { window._calcVal=String(eval(window._calcVal.replace(/×/g,'*'))); window._calcNew=true; }
  catch { window._calcVal='Error'; window._calcNew=true; }
  const d=document.getElementById('calcDisp'); if(d) d.textContent=window._calcVal;
}

// ─── TEXT EDITOR ───────────────────────────────────────────
function buildTextEditor(body) {
  const saved = localStorage.getItem(KEYS.EDITOR)||'';
  body.innerHTML = `
    <div class="app-content">
      <div class="app-toolbar">
        <button class="app-btn" onclick="document.execCommand('bold')"><i class="fas fa-bold"></i></button>
        <button class="app-btn" onclick="document.execCommand('italic')"><i class="fas fa-italic"></i></button>
        <button class="app-btn" onclick="document.execCommand('underline')"><i class="fas fa-underline"></i></button>
        <button class="app-btn" onclick="document.execCommand('strikeThrough')"><i class="fas fa-strikethrough"></i></button>
        <button class="app-btn" onclick="document.execCommand('justifyLeft')"><i class="fas fa-align-left"></i></button>
        <button class="app-btn" onclick="document.execCommand('justifyCenter')"><i class="fas fa-align-center"></i></button>
        <button class="app-btn" onclick="document.execCommand('justifyRight')"><i class="fas fa-align-right"></i></button>
        <button class="app-btn" onclick="saveEditorContent()"><i class="fas fa-save"></i> Save</button>
        <button class="app-btn" onclick="downloadEditor()"><i class="fas fa-download"></i> Export</button>
        <button class="app-btn danger" onclick="if(confirm('Clear?')){document.getElementById('editorArea').innerHTML=''}"><i class="fas fa-trash"></i></button>
      </div>
      <div class="editor-area" id="editorArea" contenteditable="true">${saved}</div>
    </div>`;
  setInterval(()=>{ const a=document.getElementById('editorArea'); if(a) localStorage.setItem(KEYS.EDITOR,a.innerHTML); },5000);
}
function saveEditorContent() { const a=document.getElementById('editorArea'); if(a) { localStorage.setItem(KEYS.EDITOR,a.innerHTML); showNotification('Saved','Editor content saved','fa-save'); } }
function downloadEditor() { const a=document.getElementById('editorArea'); if(!a) return; const b=new Blob([a.innerHTML],{type:'text/html'}); const u=URL.createObjectURL(b); const l=document.createElement('a'); l.href=u; l.download='document.html'; l.click(); }

// ─── BROWSER ───────────────────────────────────────────────
function buildBrowser(body) {
  body.innerHTML = `
    <div class="browser-wrap">
      <div class="browser-url-bar">
        <button class="app-btn" onclick="browserNav('back')"><i class="fas fa-arrow-left"></i></button>
        <button class="app-btn" onclick="browserNav('fwd')"><i class="fas fa-arrow-right"></i></button>
        <button class="app-btn" onclick="browserNav('refresh')"><i class="fas fa-sync"></i></button>
        <input class="app-input" id="browserUrl" style="flex:1" value="https://najahcreates.netlify.app" onkeydown="if(event.key==='Enter')loadBrowser()">
        <button class="app-btn" onclick="loadBrowser()"><i class="fas fa-arrow-right"></i></button>
      </div>
      <div class="browser-frame-wrap">
        <div class="browser-loader" id="browserLoader"><i class="fas fa-spinner fa-spin"></i> Loading...</div>
        <iframe class="browser-iframe" id="browserIframe" src="https://najahcreates.netlify.app" onload="document.getElementById('browserLoader').classList.add('hidden')"></iframe>
      </div>
    </div>`;
}
function loadBrowser() {
  const u = document.getElementById('browserUrl');
  const f = document.getElementById('browserIframe');
  const l = document.getElementById('browserLoader');
  if(!u||!f) return;
  let url = u.value.trim();
  if(!url.startsWith('http')) url='https://'+url;
  l.classList.remove('hidden');
  f.src = url;
  f.onload = ()=>l.classList.add('hidden');
}
function browserNav(dir) {
  const f=document.getElementById('browserIframe'); if(!f) return;
  if(dir==='back') try{f.contentWindow.history.back()}catch(e){}
  if(dir==='fwd') try{f.contentWindow.history.forward()}catch(e){}
  if(dir==='refresh') { f.src=f.src; document.getElementById('browserLoader').classList.remove('hidden'); }
}

// ─── FILES ─────────────────────────────────────────────────
let uploadedFiles = JSON.parse(localStorage.getItem(KEYS.FILES)||'[]');
function buildFiles(body) {
  body.innerHTML = `
    <div class="app-content">
      <div class="files-path">
        <span>/home/user/Files</span>
        <span>
          <input type="file" id="fileIn" style="display:none" multiple onchange="handleUpload(event)">
          <button class="app-btn" onclick="document.getElementById('fileIn').click()"><i class="fas fa-upload"></i> Upload</button>
        </span>
      </div>
      <div class="files-grid" id="filesGrid"></div>
    </div>`;
  renderFiles();
}
function renderFiles() {
  const g = document.getElementById('filesGrid'); if(!g) return;
  g.innerHTML = '';
  if(!uploadedFiles.length) { g.innerHTML='<div style="color:var(--text3);font-size:.85rem;padding:20px">No files yet. Click Upload to add files.</div>'; return; }
  uploadedFiles.forEach(f=>{
    const icons = {image:'fa-image',video:'fa-video',audio:'fa-music',pdf:'fa-file-pdf',text:'fa-file-alt'};
    let ico = 'fa-file';
    for(const [k,v] of Object.entries(icons)) if(f.type.includes(k)) { ico=v; break; }
    const tile = document.createElement('div');
    tile.className='file-tile';
    tile.innerHTML=`<i class="fas ${ico} file-tile-icon"></i><div class="file-tile-name">${f.name}</div><button class="file-tile-del" onclick="deleteFile(${f.id},event)"><i class="fas fa-times"></i></button>`;
    tile.onclick = ()=>openFile(f);
    g.appendChild(tile);
  });
}
function handleUpload(e) {
  Array.from(e.target.files).forEach(file=>{
    const reader = new FileReader();
    reader.onload = ev=>{
      uploadedFiles.push({id:Date.now()+Math.random(), name:file.name, type:file.type, data:ev.target.result});
      localStorage.setItem(KEYS.FILES, JSON.stringify(uploadedFiles));
      renderFiles();
      showNotification('Uploaded',file.name,'fa-upload');
    };
    reader.readAsDataURL(file);
  });
}
function deleteFile(id,e) { e.stopPropagation(); uploadedFiles=uploadedFiles.filter(f=>f.id!==id); localStorage.setItem(KEYS.FILES,JSON.stringify(uploadedFiles)); renderFiles(); }
function openFile(f) {
  if(f.type.startsWith('image/')) { openApp('imageViewer'); setTimeout(()=>{ const i=document.getElementById('imgViewImg'); if(i){i.src=f.data;} },300); }
  else { const a=document.createElement('a'); a.href=f.data; a.download=f.name; a.click(); }
}

// ─── TERMINAL ──────────────────────────────────────────────
function buildTerminal(body) {
  body.innerHTML = `
    <div class="terminal-wrap" id="termWrap">
      <div class="terminal-output-area" id="termOut">
        <div class="term-out">MonOpSy Terminal v3.0 — type <span style="color:var(--accent)">help</span> for commands</div>
      </div>
      <div class="term-input-wrap">
        <span class="term-prompt-fixed">user@monopsy:~$</span>
        <input class="term-input-field" id="termIn" autofocus placeholder=" " onkeydown="termKey(event)">
      </div>
    </div>`;
}
const TERM_CMDS = {
  help: ()=>'Available commands:\n  help · clear · date · whoami · echo [text]\n  apps · sysinfo · ls · cat [file] · neofetch\n  github · version · easteregg',
  clear: 'CLEAR',
  date: ()=>new Date().toString(),
  whoami: 'user',
  apps: ()=>Object.keys(APPS).join('  '),
  version: 'MonOpSy v3.0.0',
  github: 'https://github.com/Muhammednajah/MonOpSy',
  ls: 'Documents/  Downloads/  Pictures/  Music/  Projects/',
  sysinfo: ()=>`OS: MonOpSy Web v3.0\nBrowser: ${navigator.userAgent.split(')')[0].split('(')[1]}\nPlatform: ${navigator.platform}\nLanguage: ${navigator.language}\nOnline: ${navigator.onLine}`,
  neofetch: ()=>`
    ███╗   ███╗ ██████╗ ██████╗ 
    ████╗ ████║██╔═══██╗██╔══██╗
    ██╔████╔██║██║   ██║██████╔╝
    ██║╚██╔╝██║██║   ██║██╔═══╝ 
    ██║ ╚═╝ ██║╚██████╔╝██║     
    ╚═╝     ╚═╝ ╚═════╝ ╚═╝     
    OS: MonOpSy Web v3.0 · Made by NajahCreates`,
  easteregg: '🥚 You found it! Check out: https://regiochess.netlify.app — free chess!',
};
function termKey(e) {
  if(e.key!=='Enter') return;
  const input = document.getElementById('termIn');
  const out = document.getElementById('termOut');
  if(!input||!out) return;
  const cmd = input.value.trim();
  input.value='';
  if(!cmd) return;
  // echo cmd
  const line = document.createElement('div');
  line.className='term-line';
  line.innerHTML=`<span class="term-prompt">user@monopsy:~$</span><span class="term-cmd">${escapeHtml(cmd)}</span>`;
  out.appendChild(line);
  // process
  let res = '';
  const parts = cmd.split(' ');
  const base = parts[0].toLowerCase();
  if(base==='clear') { out.innerHTML=''; return; }
  if(base==='echo') res = parts.slice(1).join(' ');
  else if(base==='cat') res = parts[1] ? `cat: ${parts[1]}: No such file or directory` : 'Usage: cat [file]';
  else if(TERM_CMDS[base]) res = typeof TERM_CMDS[base]==='function' ? TERM_CMDS[base]() : TERM_CMDS[base];
  else res = `command not found: ${base}`;
  const oLine = document.createElement('div');
  oLine.className='term-out';
  oLine.style.whiteSpace='pre';
  oLine.textContent=res;
  out.appendChild(oLine);
  out.scrollTop=out.scrollHeight;
}
function escapeHtml(t) { return t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

// ─── TODO ──────────────────────────────────────────────────
let todos = JSON.parse(localStorage.getItem(KEYS.TODO)||'[]');
function buildTodo(body) {
  body.innerHTML = `
    <div class="app-content">
      <div class="todo-add">
        <input class="app-input" id="todoIn" placeholder="Add a task..." onkeydown="if(event.key==='Enter')addTodo()" style="flex:1">
        <button class="app-btn" onclick="addTodo()"><i class="fas fa-plus"></i> Add</button>
      </div>
      <div class="todo-list" id="todoList"></div>
    </div>`;
  renderTodos();
}
function addTodo() { const i=document.getElementById('todoIn'); if(!i||!i.value.trim()) return; todos.push({id:Date.now(),text:i.value.trim(),done:false}); i.value=''; saveTodos(); renderTodos(); }
function toggleTodo(id) { const t=todos.find(x=>x.id===id); if(t) t.done=!t.done; saveTodos(); renderTodos(); }
function deleteTodo(id) { todos=todos.filter(x=>x.id!==id); saveTodos(); renderTodos(); }
function saveTodos() { localStorage.setItem(KEYS.TODO, JSON.stringify(todos)); }
function renderTodos() {
  const l=document.getElementById('todoList'); if(!l) return;
  l.innerHTML='';
  todos.forEach(t=>{
    const el=document.createElement('div');
    el.className='todo-item'+(t.done?' done':'');
    el.innerHTML=`<input type="checkbox" class="todo-cb" ${t.done?'checked':''} onchange="toggleTodo(${t.id})"><span class="todo-text">${escapeHtml(t.text)}</span><button class="todo-del" onclick="deleteTodo(${t.id})"><i class="fas fa-trash"></i></button>`;
    l.appendChild(el);
  });
  if(!todos.length) l.innerHTML='<div style="color:var(--text3);font-size:.85rem;padding:10px">No tasks yet. Add one above!</div>';
}

// ─── NOTES ─────────────────────────────────────────────────
let notes = JSON.parse(localStorage.getItem(KEYS.NOTES)||'[]');
function buildNotes(body) {
  body.innerHTML = `
    <div class="app-content">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <span style="font-family:var(--font-ui);font-weight:700;font-size:1.1rem">My Notes</span>
        <button class="app-btn" onclick="createNote()"><i class="fas fa-plus"></i> New Note</button>
      </div>
      <div class="notes-grid" id="notesGrid"></div>
    </div>`;
  renderNotes();
}
function renderNotes() {
  const g=document.getElementById('notesGrid'); if(!g) return;
  g.innerHTML='';
  if(!notes.length) { g.innerHTML='<div style="color:var(--text3);font-size:.85rem;padding:10px">No notes yet. Click New Note!</div>'; return; }
  notes.forEach(n=>{
    const el=document.createElement('div');
    el.className='note-card';
    el.innerHTML=`<div class="note-card-title">${escapeHtml(n.title)}</div><div class="note-card-preview">${n.content||'Empty note'}</div><div class="note-card-date">${new Date(n.date).toLocaleDateString()}</div><button class="note-del-btn" onclick="deleteNote(${n.id},event)"><i class="fas fa-times"></i></button>`;
    el.onclick=(e)=>{ if(!e.target.closest('.note-del-btn')) openNoteEditor(n.id); };
    g.appendChild(el);
  });
}
function createNote() {
  const title = prompt('Note title:'); if(!title) return;
  const n={id:Date.now(),title,content:'',date:new Date().toISOString()};
  notes.push(n); saveNotes(); renderNotes(); openNoteEditor(n.id);
}
function deleteNote(id,e) { e.stopPropagation(); if(confirm('Delete note?')) { notes=notes.filter(n=>n.id!==id); saveNotes(); renderNotes(); } }
function openNoteEditor(id) {
  const n=notes.find(x=>x.id===id); if(!n) return;
  createWindow('note_'+id,'Note: '+n.title,'fa-sticky-note','linear-gradient(135deg,#f7e44a,#f7b84a)',500,400,`
    <div class="app-content">
      <div class="app-toolbar">
        <button class="app-btn" onclick="saveNote(${id})"><i class="fas fa-save"></i> Save</button>
      </div>
      <textarea class="app-input editor-area" id="noteEdit_${id}" style="flex:1;resize:none;font-family:var(--font-body)">${n.content}</textarea>
    </div>`,
    ()=>{}
  );
}
function saveNote(id) { const a=document.getElementById('noteEdit_'+id); const n=notes.find(x=>x.id===id); if(a&&n) { n.content=a.value; n.date=new Date().toISOString(); saveNotes(); renderNotes(); showNotification('Saved','Note saved','fa-save'); } }
function saveNotes() { localStorage.setItem(KEYS.NOTES, JSON.stringify(notes)); }

// ─── CALENDAR ──────────────────────────────────────────────
let calYear=new Date().getFullYear(), calMonth=new Date().getMonth();
const MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
function buildCalendar(body) {
  body.innerHTML=`
    <div class="app-content">
      <div class="cal-header">
        <button class="cal-nav-btn" onclick="calNav(-1)"><i class="fas fa-chevron-left"></i></button>
        <div class="cal-month-name" id="calTitle"></div>
        <button class="cal-nav-btn" onclick="calNav(1)"><i class="fas fa-chevron-right"></i></button>
      </div>
      <div class="cal-grid" id="calGrid"></div>
    </div>`;
  renderCalendar();
}
function calNav(d) { calMonth+=d; if(calMonth<0){calMonth=11;calYear--;} if(calMonth>11){calMonth=0;calYear++;} renderCalendar(); }
function renderCalendar() {
  const g=document.getElementById('calGrid'); const t=document.getElementById('calTitle'); if(!g||!t) return;
  t.textContent=MONTHS[calMonth]+' '+calYear;
  g.innerHTML=DAYS.map(d=>`<div class="cal-day-hdr">${d}</div>`).join('');
  const first=new Date(calYear,calMonth,1).getDay();
  const days=new Date(calYear,calMonth+1,0).getDate();
  const prev=new Date(calYear,calMonth,0).getDate();
  const today=new Date();
  for(let i=first-1;i>=0;i--) g.innerHTML+=`<div class="cal-day other">${prev-i}</div>`;
  for(let i=1;i<=days;i++) {
    const isToday=calYear===today.getFullYear()&&calMonth===today.getMonth()&&i===today.getDate();
    g.innerHTML+=`<div class="cal-day${isToday?' today':''}">${i}</div>`;
  }
  const total=first+days; const rem=(7-total%7)%7;
  for(let i=1;i<=rem;i++) g.innerHTML+=`<div class="cal-day other">${i}</div>`;
}

// ─── SETTINGS ──────────────────────────────────────────────
function buildSettings(body) {
  const c=cfg();
  body.innerHTML=`
    <div class="settings-sections">
      <div class="settings-card">
        <h3>Appearance</h3>
        <div class="setting-row"><span class="setting-label">Light Theme</span><div class="toggle ${c.theme==='light'?'on':''}" id="toggleTheme" onclick="toggleThemeSetting()"></div></div>
      </div>
      <div class="settings-card">
        <h3>Wallpaper</h3>
        <div style="display:flex;flex-direction:column;gap:8px">
          ${[
            {label:'Dark Space',val:'linear-gradient(135deg,#0c0c14 0%,#0e1030 50%,#14082a 100%)'},
            {label:'Purple Nebula',val:'radial-gradient(ellipse at 30% 30%,#1a0a2e,#0c0c24)'},
            {label:'Deep Ocean',val:'linear-gradient(135deg,#0a1628,#001440)'},
            {label:'Forest Night',val:'linear-gradient(135deg,#0a140a,#0a2814)'},
            {label:'Sunset',val:'linear-gradient(135deg,#2a0a0a,#2a1400,#1a0a2a)'},
          ].map(w=>`<button class="app-btn" onclick="setWallpaper('${w.val}')">${w.label}</button>`).join('')}
        </div>
      </div>
      <div class="settings-card">
        <h3>Security — Change PIN</h3>
        <div class="pin-setup">
          <div class="pin-setup-row">
            <input class="app-input" id="newPin" type="password" maxlength="4" placeholder="New 4-digit PIN" style="flex:1">
            <button class="app-btn" onclick="changePin()"><i class="fas fa-key"></i> Update PIN</button>
          </div>
          <div style="font-size:.72rem;color:var(--text3);font-family:var(--font-mono)">Current PIN is used on lock screen</div>
        </div>
      </div>
      <div class="settings-card">
        <h3>Data</h3>
        <div class="setting-row">
          <span class="setting-label">Clear all app data</span>
          <button class="app-btn danger" onclick="if(confirm('Wipe all data?')){localStorage.clear();location.reload()}"><i class="fas fa-trash"></i> Wipe</button>
        </div>
      </div>
      <div class="settings-card">
        <h3>About MonOpSy</h3>
        <div style="font-size:.85rem;color:var(--text2);line-height:1.7">
          Version 3.0.0 · Made by <a href="https://github.com/Muhammednajah/MonOpSy" target="_blank" style="color:var(--accent)">NajahCreates</a><br>
          Open source · MIT License
        </div>
      </div>
    </div>`;
}
function toggleThemeSetting() {
  const c=cfg(); const isLight=c.theme==='light';
  const newTheme = isLight?'dark':'light';
  saveCfg({theme:newTheme});
  if(newTheme==='light') document.documentElement.setAttribute('data-theme','light');
  else document.documentElement.removeAttribute('data-theme');
  document.getElementById('toggleTheme')?.classList.toggle('on',newTheme==='light');
  showNotification('Theme','Switched to '+newTheme+' mode','fa-palette');
}
function setWallpaper(val) {
  document.body.style.backgroundImage=val; saveCfg({wallpaper:val});
  showNotification('Wallpaper','Updated!','fa-image');
}
function changePin() {
  const input=document.getElementById('newPin'); if(!input) return;
  const p=input.value.trim();
  if(!/^\d{4}$/.test(p)) { showNotification('Error','PIN must be exactly 4 digits','fa-exclamation-circle'); return; }
  S.pin=p; localStorage.setItem(KEYS.PIN,p); input.value='';
  showNotification('PIN Changed','New PIN saved securely','fa-key');
}

// ─── WEATHER ───────────────────────────────────────────────
const WEATHERS=[
  {icon:'fa-sun',desc:'Sunny',temp:28,feels:30,humidity:45,wind:12,col:'#f7c44a'},
  {icon:'fa-cloud-sun',desc:'Partly Cloudy',temp:24,feels:26,humidity:55,wind:8,col:'#aaccff'},
  {icon:'fa-cloud',desc:'Cloudy',temp:20,feels:19,humidity:65,wind:6,col:'#9999aa'},
  {icon:'fa-cloud-rain',desc:'Rainy',temp:18,feels:16,humidity:85,wind:14,col:'#4a8cf7'},
  {icon:'fa-bolt',desc:'Thunderstorm',temp:16,feels:14,humidity:90,wind:22,col:'#c44af7'},
];
function buildWeather(body) {
  const w=WEATHERS[Math.floor(Math.random()*WEATHERS.length)];
  body.innerHTML=`
    <div class="app-content">
      <div class="weather-hero">
        <div class="weather-loc"><i class="fas fa-map-marker-alt"></i> Tirur, Kerala</div>
        <div class="weather-icon-big"><i class="fas ${w.icon}" style="color:${w.col}"></i></div>
        <div class="weather-big-temp" style="color:${w.col}">${w.temp}°C</div>
        <div class="weather-desc">${w.desc}</div>
      </div>
      <div class="weather-details-grid">
        <div class="weather-detail-card"><div class="weather-detail-label">Feels Like</div><div class="weather-detail-val">${w.feels}°C</div></div>
        <div class="weather-detail-card"><div class="weather-detail-label">Humidity</div><div class="weather-detail-val">${w.humidity}%</div></div>
        <div class="weather-detail-card"><div class="weather-detail-label">Wind</div><div class="weather-detail-val">${w.wind} km/h</div></div>
      </div>
      <div style="font-size:.68rem;color:var(--text3);text-align:center;font-family:var(--font-mono);margin-top:6px">Simulated data · live weather coming soon</div>
    </div>`;
}

// ─── CLOCK APP ─────────────────────────────────────────────
function buildClock(body) {
  body.innerHTML=`
    <div class="clock-app-wrap">
      <div class="analog-face" id="clockFace">
        <div class="clock-dot"></div>
        <div class="clock-hand hr-hand" id="hrHand"></div>
        <div class="clock-hand min-hand" id="minHand"></div>
        <div class="clock-hand sec-hand" id="secHand"></div>
        <div class="clock-nums">
          ${[12,3,6,9].map((n,i)=>{const a=(i*90-90)*Math.PI/180;const r=88;const x=100+r*Math.cos(a);const y=100+r*Math.sin(a);return `<div class="clock-num" style="left:${x-8}px;top:${y-8}px">${n}</div>`}).join('')}
        </div>
      </div>
      <div class="digital-time" id="digTime">00:00:00</div>
      <div class="digital-date" id="digDate"></div>
    </div>`;
  function tick() {
    const n=new Date();
    const h=n.getHours(),m=n.getMinutes(),s=n.getSeconds();
    const hd=document.getElementById('hrHand'), md=document.getElementById('minHand'), sd=document.getElementById('secHand');
    if(hd) hd.style.transform=`rotate(${h%12*30+m*0.5}deg)`;
    if(md) md.style.transform=`rotate(${m*6+s*0.1}deg)`;
    if(sd) sd.style.transform=`rotate(${s*6}deg)`;
    const dt=document.getElementById('digTime');
    const dd=document.getElementById('digDate');
    if(dt) dt.textContent=`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    if(dd) { const days=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']; dd.textContent=`${days[n.getDay()]}, ${MONTHS[n.getMonth()]} ${n.getDate()}, ${n.getFullYear()}`; }
    if(document.getElementById('hrHand')) requestAnimationFrame(tick);
  }
  tick();
}

// ─── MUSIC PLAYER ──────────────────────────────────────────
const tracks=[{title:'Kaayi',artist:'Baby Jean',dur:225},{title:'Blinding Lights',artist:'The Weeknd',dur:200},{title:'Starboy',artist:'The Weeknd',dur:230}];
let mTrack=0, mPlaying=false, mProgress=0, mInterval=null;
function buildMusic(body) {
  body.innerHTML=`
    <div class="music-wrap">
      <div class="music-album"><i class="fas fa-music"></i></div>
      <div class="music-track"><div class="music-title" id="musicTitle">${tracks[0].title}</div><div class="music-artist" id="musicArtist">${tracks[0].artist}</div></div>
      <div class="music-controls">
        <button class="music-btn" onclick="musicPrev()"><i class="fas fa-step-backward"></i></button>
        <button class="music-btn play" id="musicPlayBtn" onclick="musicToggle()"><i class="fas fa-play"></i></button>
        <button class="music-btn" onclick="musicNext()"><i class="fas fa-step-forward"></i></button>
      </div>
      <div class="music-progress-wrap">
        <div class="music-prog-bar" onclick="musicSeek(event)"><div class="music-prog-fill" id="musicFill"></div></div>
        <div class="music-times"><span id="musicCur">0:00</span><span id="musicTot">${fmtTime(tracks[0].dur)}</span></div>
      </div>
    </div>`;
}
function musicToggle() {
  mPlaying=!mPlaying;
  const btn=document.getElementById('musicPlayBtn');
  if(btn) btn.innerHTML=`<i class="fas fa-${mPlaying?'pause':'play'}"></i>`;
  if(mPlaying) { mInterval=setInterval(musicTick,1000); showNotification('Playing',tracks[mTrack].title,'fa-music'); }
  else clearInterval(mInterval);
}
function musicTick() {
  mProgress++; if(mProgress>tracks[mTrack].dur){mProgress=0;musicNext();return;}
  const f=document.getElementById('musicFill'); const c=document.getElementById('musicCur');
  if(f) f.style.width=(mProgress/tracks[mTrack].dur*100)+'%';
  if(c) c.textContent=fmtTime(mProgress);
}
function musicPrev() { clearInterval(mInterval); mPlaying=false; mProgress=0; mTrack=(mTrack-1+tracks.length)%tracks.length; updateMusicUI(); }
function musicNext() { clearInterval(mInterval); mPlaying=false; mProgress=0; mTrack=(mTrack+1)%tracks.length; updateMusicUI(); }
function musicSeek(e) { const b=e.currentTarget.getBoundingClientRect(); mProgress=Math.floor((e.clientX-b.left)/b.width*tracks[mTrack].dur); musicTick(); }
function updateMusicUI() {
  const t=document.getElementById('musicTitle'), a=document.getElementById('musicArtist');
  const tot=document.getElementById('musicTot'), btn=document.getElementById('musicPlayBtn');
  const fill=document.getElementById('musicFill'), cur=document.getElementById('musicCur');
  if(t) t.textContent=tracks[mTrack].title;
  if(a) a.textContent=tracks[mTrack].artist;
  if(tot) tot.textContent=fmtTime(tracks[mTrack].dur);
  if(btn) btn.innerHTML='<i class="fas fa-play"></i>';
  if(fill) fill.style.width='0%';
  if(cur) cur.textContent='0:00';
}
function fmtTime(s) { return Math.floor(s/60)+':'+(s%60).toString().padStart(2,'0'); }

// ─── IMAGE VIEWER ──────────────────────────────────────────
let imgZoom=1, imgRot=0;
function buildImageViewer(body) {
  body.innerHTML=`
    <div class="imgv-wrap">
      <div class="app-toolbar">
        <button class="app-btn" onclick="imgZoomIn()"><i class="fas fa-search-plus"></i></button>
        <button class="app-btn" onclick="imgZoomOut()"><i class="fas fa-search-minus"></i></button>
        <button class="app-btn" onclick="imgRotate()"><i class="fas fa-sync"></i></button>
        <button class="app-btn" onclick="imgReset()"><i class="fas fa-expand"></i></button>
        <input type="file" id="imgFileIn" style="display:none" accept="image/*" onchange="loadImg(event)">
        <button class="app-btn" onclick="document.getElementById('imgFileIn').click()"><i class="fas fa-folder-open"></i> Open</button>
      </div>
      <div class="imgv-canvas">
        <img class="imgv-img" id="imgViewImg" src="https://picsum.photos/seed/monopsy/800/600" alt="Image">
        <div class="imgv-info"><span id="imgName">sample.jpg</span><span id="imgSize"></span></div>
      </div>
    </div>`;
}
function imgZoomIn() { imgZoom=Math.min(imgZoom*1.2,4); applyImgTransform(); }
function imgZoomOut() { imgZoom=Math.max(imgZoom/1.2,0.3); applyImgTransform(); }
function imgRotate() { imgRot=(imgRot+90)%360; applyImgTransform(); }
function imgReset() { imgZoom=1; imgRot=0; applyImgTransform(); }
function applyImgTransform() { const i=document.getElementById('imgViewImg'); if(i) i.style.transform=`scale(${imgZoom}) rotate(${imgRot}deg)`; }
function loadImg(e) {
  const f=e.target.files[0]; if(!f) return;
  const r=new FileReader();
  r.onload=ev=>{ const i=document.getElementById('imgViewImg'); if(i){i.src=ev.target.result; imgReset();} const n=document.getElementById('imgName'); if(n)n.textContent=f.name; };
  r.readAsDataURL(f);
}

// ─── SYSTEM MONITOR ────────────────────────────────────────
function buildSysmon(body) {
  body.innerHTML=`
    <div class="app-content">
      <div class="sysmon-grid">
        ${['CPU','Memory','Disk','Network'].map(n=>`
          <div class="sysmon-card">
            <div class="sysmon-header"><span class="sysmon-name">${n}</span><span class="sysmon-val" id="sm${n}Val">--</span></div>
            <div class="sysmon-bar-bg"><div class="sysmon-bar" id="sm${n}Bar" style="width:0%"></div></div>
            <div class="sysmon-sub" id="sm${n}Sub"><span></span><span></span></div>
          </div>`).join('')}
      </div>
    </div>`;
  function updateSysmon() {
    const data=[
      {name:'CPU', pct:()=>30+Math.random()*35, sub:['Processes: 42','Threads: 156']},
      {name:'Memory', pct:()=>55+Math.random()*15, sub:['Used: 4.5 GB','Total: 8 GB']},
      {name:'Disk', pct:()=>38+Math.random()*5, sub:['Used: 114 GB','Total: 300 GB']},
      {name:'Network', pct:()=>Math.random()*60, sub:['DL: 2.1 MB/s','UL: 0.5 MB/s']},
    ];
    data.forEach(d=>{
      const p=d.pct();
      const v=document.getElementById('sm'+d.name+'Val'); const b=document.getElementById('sm'+d.name+'Bar'); const s=document.getElementById('sm'+d.name+'Sub');
      if(v) v.textContent=d.name==='Network'?(p/10).toFixed(1)+' MB/s':Math.round(p)+'%';
      if(b) b.style.width=p+'%';
      if(s) { s.children[0].textContent=d.sub[0]; s.children[1].textContent=d.sub[1]; }
    });
    if(document.getElementById('smCPUBar')) setTimeout(updateSysmon,2000);
  }
  setTimeout(updateSysmon,100);
}

// ─── PAINT ─────────────────────────────────────────────────
function buildPaint(body, wid) {
  const colors=['#ffffff','#f74a6a','#f7c44a','#4af74a','#4a6cf7','#c44af7','#4af7f7','#f79a4a','#000000','#888888'];
  body.innerHTML=`
    <div class="paint-wrap">
      <div class="paint-tools">
        <div class="paint-colors">${colors.map(c=>`<div class="paint-swatch" style="background:${c}" data-color="${c}" onclick="setPaintColor('${c}')"></div>`).join('')}</div>
        <label style="font-size:.75rem;color:var(--text2);display:flex;align-items:center;gap:4px">Size:<input type="range" id="brushSize" min="1" max="40" value="5" style="width:80px;accent-color:var(--accent)"></label>
        <button class="app-btn" id="eraserBtn" onclick="toggleEraser()"><i class="fas fa-eraser"></i> Eraser</button>
        <button class="app-btn" onclick="clearCanvas()"><i class="fas fa-trash"></i> Clear</button>
        <button class="app-btn" onclick="downloadCanvas()"><i class="fas fa-download"></i> Save</button>
      </div>
      <div class="paint-canvas-wrap" id="paintCanvasWrap_${wid}">
        <canvas id="paintCanvas"></canvas>
      </div>
    </div>`;
  // init canvas
  requestAnimationFrame(()=>{
    const wrap = document.getElementById('paintCanvasWrap_'+wid);
    const canvas = document.getElementById('paintCanvas');
    if(!canvas||!wrap) return;
    canvas.width=wrap.clientWidth||560;
    canvas.height=wrap.clientHeight||340;
    canvas.style.cssText='display:block;cursor:crosshair;';
    const ctx=canvas.getContext('2d');
    ctx.fillStyle='#111118'; ctx.fillRect(0,0,canvas.width,canvas.height);
    let painting=false, erasing=false, color='#ffffff';
    canvas.addEventListener('mousedown',e=>{painting=true;draw(e,true);});
    canvas.addEventListener('mousemove',e=>{if(painting)draw(e,false);});
    canvas.addEventListener('mouseup',()=>painting=false);
    canvas.addEventListener('mouseleave',()=>painting=false);
    function draw(e,start) {
      const r=canvas.getBoundingClientRect();
      const x=e.clientX-r.left, y=e.clientY-r.top;
      const size=parseInt(document.getElementById('brushSize').value)||5;
      ctx.lineWidth=size; ctx.lineCap='round'; ctx.lineJoin='round';
      ctx.strokeStyle=erasing?'#111118':color;
      if(start){ctx.beginPath();ctx.moveTo(x,y);}
      else{ctx.lineTo(x,y);ctx.stroke();}
    }
    window._paintCtx=ctx; window._paintCanvas=canvas;
    window.setPaintColor=c=>{ color=c; erasing=false; document.getElementById('eraserBtn').classList.remove('active'); };
    window.toggleEraser=()=>{ erasing=!erasing; document.getElementById('eraserBtn').classList.toggle('active',erasing); };
    window.clearCanvas=()=>{ ctx.fillStyle='#111118'; ctx.fillRect(0,0,canvas.width,canvas.height); };
    window.downloadCanvas=()=>{ const a=document.createElement('a'); a.download='monopsy-paint.png'; a.href=canvas.toDataURL(); a.click(); };
  });
}

// ─── POMODORO ──────────────────────────────────────────────
let pomoDur={focus:25*60,short:5*60,long:15*60};
let pomoState={mode:'focus',remaining:25*60,running:false,rounds:0};
let pomoInterval=null;
function buildPomodoro(body) {
  body.innerHTML=`
    <div class="pomo-wrap">
      <div class="pomo-mode-tabs">
        <button class="pomo-tab active" id="pomoTabFocus" onclick="setPomoMode('focus')">Focus</button>
        <button class="pomo-tab" id="pomoTabShort" onclick="setPomoMode('short')">Short Break</button>
        <button class="pomo-tab" id="pomoTabLong" onclick="setPomoMode('long')">Long Break</button>
      </div>
      <div class="pomo-ring" id="pomoRing">
        <div class="pomo-time-text" id="pomoTime">25:00</div>
      </div>
      <div class="pomo-label" id="pomoLabel">Focus Time</div>
      <div class="pomo-rounds" id="pomoRounds">Round 0</div>
      <div class="app-toolbar" style="justify-content:center">
        <button class="app-btn" onclick="togglePomo()" id="pomoBtnPlay"><i class="fas fa-play"></i> Start</button>
        <button class="app-btn" onclick="resetPomo()"><i class="fas fa-undo"></i> Reset</button>
      </div>
    </div>`;
  updatePomoDisplay();
}
function setPomoMode(m) {
  clearInterval(pomoInterval); pomoState.running=false;
  pomoState.mode=m; pomoState.remaining=pomoDur[m];
  ['focus','short','long'].forEach(x=>document.getElementById('pomoTab'+x[0].toUpperCase()+x.slice(1))?.classList.toggle('active',x===m));
  document.getElementById('pomoBtnPlay').innerHTML='<i class="fas fa-play"></i> Start';
  updatePomoDisplay();
}
function togglePomo() {
  pomoState.running=!pomoState.running;
  const btn=document.getElementById('pomoBtnPlay');
  if(btn) btn.innerHTML=`<i class="fas fa-${pomoState.running?'pause':'play'}"></i> ${pomoState.running?'Pause':'Start'}`;
  if(pomoState.running) { pomoInterval=setInterval(pomoTick,1000); }
  else clearInterval(pomoInterval);
}
function pomoTick() {
  pomoState.remaining--;
  if(pomoState.remaining<=0) {
    clearInterval(pomoInterval); pomoState.running=false;
    pomoState.rounds++;
    showNotification('Pomodoro','Time\'s up!','fa-bell');
    if(pomoState.mode==='focus') setPomoMode('short'); else setPomoMode('focus');
    return;
  }
  updatePomoDisplay();
}
function resetPomo() { clearInterval(pomoInterval); pomoState.running=false; pomoState.remaining=pomoDur[pomoState.mode]; document.getElementById('pomoBtnPlay').innerHTML='<i class="fas fa-play"></i> Start'; updatePomoDisplay(); }
function updatePomoDisplay() {
  const total=pomoDur[pomoState.mode]; const rem=pomoState.remaining;
  const t=document.getElementById('pomoTime'); const r=document.getElementById('pomoRounds'); const l=document.getElementById('pomoLabel'); const ring=document.getElementById('pomoRing');
  if(t) t.textContent=`${String(Math.floor(rem/60)).padStart(2,'0')}:${String(rem%60).padStart(2,'0')}`;
  if(r) r.textContent=`Round ${pomoState.rounds}`;
  if(l) l.textContent={focus:'Focus Time',short:'Short Break',long:'Long Break'}[pomoState.mode];
  if(ring) { const pct=((total-rem)/total)*360; ring.style.background=`conic-gradient(var(--accent) ${pct}deg, rgba(255,255,255,0.07) ${pct}deg)`; }
}

// ─── COLOR PICKER ──────────────────────────────────────────
function buildColorPicker(body) {
  body.innerHTML=`
    <div class="colorpicker-wrap">
      <div class="cp-preview" id="cpPreview" style="background:#4a6cf7"></div>
      <div class="cp-hex" id="cpHex">#4a6cf7</div>
      <div class="cp-sliders">
        ${['R','G','B'].map((ch,i)=>`
          <div class="cp-row">
            <span class="cp-label" style="color:${['#f74a4a','#4af74a','#4a6cf7'][i]}">${ch}</span>
            <input type="range" class="cp-slider" id="cp${ch}" min="0" max="255" value="${[74,108,247][i]}" oninput="updateCp()">
            <span class="cp-val" id="cp${ch}Val">${[74,108,247][i]}</span>
          </div>`).join('')}
      </div>
      <div class="cp-formats">
        <div class="cp-fmt-box"><div class="cp-fmt-label">HEX</div><div class="cp-fmt-val" id="cpFmtHex">#4a6cf7</div></div>
        <div class="cp-fmt-box"><div class="cp-fmt-label">RGB</div><div class="cp-fmt-val" id="cpFmtRgb">rgb(74,108,247)</div></div>
        <div class="cp-fmt-box"><div class="cp-fmt-label">HSL</div><div class="cp-fmt-val" id="cpFmtHsl">hsl(229,91%,63%)</div></div>
        <div class="cp-fmt-box"><div class="cp-fmt-label">CSS var</div><div class="cp-fmt-val" id="cpFmtCss">--color: #4a6cf7</div></div>
      </div>
    </div>`;
}
function updateCp() {
  const r=parseInt(document.getElementById('cpR').value), g=parseInt(document.getElementById('cpG').value), b=parseInt(document.getElementById('cpB').value);
  ['R','G','B'].forEach((c,i)=>{ const v=document.getElementById('cp'+c+'Val'); if(v) v.textContent=[r,g,b][i]; });
  const hex='#'+[r,g,b].map(x=>x.toString(16).padStart(2,'0')).join('');
  const prev=document.getElementById('cpPreview'); if(prev) prev.style.background=hex;
  const hx=document.getElementById('cpHex'); if(hx) hx.textContent=hex;
  const fh=document.getElementById('cpFmtHex'); if(fh) fh.textContent=hex;
  const fr=document.getElementById('cpFmtRgb'); if(fr) fr.textContent=`rgb(${r},${g},${b})`;
  const fc=document.getElementById('cpFmtCss'); if(fc) fc.textContent=`--color: ${hex}`;
  // HSL
  const rn=r/255,gn=g/255,bn=b/255;
  const max=Math.max(rn,gn,bn),min=Math.min(rn,gn,bn);
  let h=0,s=0,l=(max+min)/2;
  if(max!==min) { const d=max-min; s=l>0.5?d/(2-max-min):d/(max+min); if(max===rn) h=(gn-bn)/d+(gn<bn?6:0); else if(max===gn) h=(bn-rn)/d+2; else h=(rn-gn)/d+4; h/=6; }
  const fhsl=document.getElementById('cpFmtHsl'); if(fhsl) fhsl.textContent=`hsl(${Math.round(h*360)},${Math.round(s*100)}%,${Math.round(l*100)}%)`;
}

// ─── MARKDOWN ──────────────────────────────────────────────
function buildMarkdown(body) {
  body.innerHTML=`
    <div class="app-content">
      <div class="app-toolbar"><span style="font-size:.75rem;color:var(--text2)">Markdown Editor — Live Preview</span></div>
      <div class="md-split">
        <textarea class="app-input md-input" id="mdSrc" oninput="renderMd()" placeholder="Type Markdown here...
# Hello World
**Bold** *Italic*
- Item 1
- Item 2
\`code\`">
# MonOpSy
Welcome to the **Markdown** editor!

- Write *formatted* text
- See it **live**
- Even add \`code\`

> Blockquotes work too!
        </textarea>
        <div class="md-preview" id="mdPreview"></div>
      </div>
    </div>`;
  renderMd();
}
function renderMd() {
  const src=document.getElementById('mdSrc')?.value||'';
  const prev=document.getElementById('mdPreview'); if(!prev) return;
  // basic markdown renderer
  let html=src
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/^### (.+)$/gm,'<h3>$1</h3>')
    .replace(/^## (.+)$/gm,'<h2>$1</h2>')
    .replace(/^# (.+)$/gm,'<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,'<em>$1</em>')
    .replace(/`(.+?)`/g,'<code>$1</code>')
    .replace(/^> (.+)$/gm,'<blockquote>$1</blockquote>')
    .replace(/^- (.+)$/gm,'<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g,'<ul>$&</ul>')
    .replace(/^\d+\. (.+)$/gm,'<li>$1</li>')
    .replace(/---/g,'<hr>')
    .replace(/\[(.+?)\]\((.+?)\)/g,'<a href="$2" target="_blank">$1</a>')
    .replace(/\n\n/g,'<br><br>');
  prev.innerHTML=html;
}

// ─── TYPING TEST ───────────────────────────────────────────
const typingPassages=[
  'The quick brown fox jumps over the lazy dog near the riverbank on a sunny afternoon.',
  'Coding is the closest thing to superpowers that humans have ever created in this world.',
  'MonOpSy is a minimalist web operating system built with pure HTML CSS and JavaScript.',
  'Design is not just what it looks like and feels like design is how it works well.',
];
let typingState={passage:'',input:'',started:false,startTime:null,wpm:0,accuracy:100};
function buildTypingTest(body) {
  body.innerHTML=`
    <div class="typing-wrap">
      <div class="typing-stats">
        <div class="typing-stat-box"><div class="typing-stat-val" id="typWpm">0</div><div class="typing-stat-label">WPM</div></div>
        <div class="typing-stat-box"><div class="typing-stat-val" id="typAcc">100%</div><div class="typing-stat-label">Accuracy</div></div>
        <div class="typing-stat-box"><div class="typing-stat-val" id="typTime">0s</div><div class="typing-stat-label">Time</div></div>
      </div>
      <div class="typing-passage" id="typPassage"></div>
      <input class="typing-input-hidden" id="typIn" oninput="typingInput(event)" autocomplete="off" autocorrect="off" spellcheck="false">
      <div class="app-toolbar"><button class="app-btn" onclick="typingReset()"><i class="fas fa-redo"></i> New Text</button><span style="font-size:.75rem;color:var(--text3)">Click passage to start</span></div>
    </div>`;
  typingReset();
  document.getElementById('typPassage').onclick = ()=>document.getElementById('typIn').focus();
}
function typingReset() {
  typingState={passage:typingPassages[Math.floor(Math.random()*typingPassages.length)],input:'',started:false,startTime:null,wpm:0,accuracy:100};
  const inp=document.getElementById('typIn'); if(inp) inp.value='';
  renderTyping();
}
function typingInput(e) {
  const val=e.target.value;
  if(!typingState.started) { typingState.started=true; typingState.startTime=Date.now(); }
  typingState.input=val;
  const elapsed=(Date.now()-typingState.startTime)/1000;
  const words=val.trim().split(/\s+/).length;
  typingState.wpm=elapsed>0?Math.round((words/elapsed)*60):0;
  let correct=0; for(let i=0;i<val.length;i++) if(val[i]===typingState.passage[i]) correct++;
  typingState.accuracy=val.length?Math.round((correct/val.length)*100):100;
  const wpmEl=document.getElementById('typWpm'); if(wpmEl) wpmEl.textContent=typingState.wpm;
  const accEl=document.getElementById('typAcc'); if(accEl) accEl.textContent=typingState.accuracy+'%';
  const timeEl=document.getElementById('typTime'); if(timeEl) timeEl.textContent=Math.round(elapsed)+'s';
  renderTyping();
  if(val===typingState.passage) showNotification('Test Complete!',`${typingState.wpm} WPM · ${typingState.accuracy}% accuracy`,'fa-trophy');
}
function renderTyping() {
  const el=document.getElementById('typPassage'); if(!el) return;
  const p=typingState.passage, inp=typingState.input;
  let html='';
  for(let i=0;i<p.length;i++) {
    if(i<inp.length) { html+=`<span class="${inp[i]===p[i]?'correct':'wrong'}">${p[i]}</span>`; }
    else if(i===inp.length) { html+=`<span class="cursor">${p[i]}</span>`; }
    else { html+=`<span>${p[i]}</span>`; }
  }
  el.innerHTML=html;
}

// ─── SNAKE ─────────────────────────────────────────────────
let snakeState=null;
function buildSnake(body) {
  body.innerHTML=`
    <div class="snake-wrap">
      <div style="display:flex;justify-content:space-between;width:350px;margin-bottom:6px">
        <span style="font-family:var(--font-ui);font-weight:700">Score: <span id="snakeScore">0</span></span>
        <div style="display:flex;gap:6px">
          <button class="app-btn" onclick="startSnake()"><i class="fas fa-play"></i></button>
          <button class="app-btn" onclick="stopSnake()"><i class="fas fa-pause"></i></button>
          <button class="app-btn" onclick="buildSnake(document.getElementById('wb_${body.closest('[id]').id.replace('wb_','')}'),null);initSnake()"><i class="fas fa-redo"></i></button>
        </div>
      </div>
      <div class="snake-board" id="snakeBoard" style="display:grid;grid-template-columns:repeat(25,1fr);width:350px;height:350px;border:1px solid var(--border)"></div>
      <div style="font-size:.72rem;color:var(--text3);margin-top:4px">Arrow keys to move</div>
    </div>`;
  initSnake();
}
function initSnake() {
  snakeState={snake:[312,311,310],dir:1,food:null,score:0,running:false,interval:null,size:25};
  placeSnakeFood();
  renderSnake();
}
function placeSnakeFood() {
  do { snakeState.food=Math.floor(Math.random()*625); } while(snakeState.snake.includes(snakeState.food));
}
function startSnake() {
  if(snakeState.running) return;
  snakeState.running=true;
  snakeState.interval=setInterval(snakeTick,120);
}
function stopSnake() { snakeState.running=false; clearInterval(snakeState.interval); }
function snakeTick() {
  const {snake,dir,size}=snakeState;
  const head=snake[snake.length-1];
  let next;
  if(dir===1) next=(head%size===size-1)?head-size+1:head+1;
  else if(dir===-1) next=(head%size===0)?head+size-1:head-1;
  else if(dir===size) next=(head+size>=size*size)?head%size:head+size;
  else next=(head-size<0)?head+(size-1)*size:head-size;
  if(snake.includes(next)) { stopSnake(); showNotification('Game Over','Score: '+snakeState.score,'fa-gamepad'); return; }
  snake.push(next);
  if(next===snakeState.food) { snakeState.score+=10; placeSnakeFood(); } else snake.shift();
  const s=document.getElementById('snakeScore'); if(s) s.textContent=snakeState.score;
  renderSnake();
}
function renderSnake() {
  const board=document.getElementById('snakeBoard'); if(!board) return;
  board.innerHTML='';
  for(let i=0;i<625;i++) {
    const cell=document.createElement('div');
    const idx=snakeState.snake.indexOf(i);
    if(idx===snakeState.snake.length-1) cell.className='s-cell s-head';
    else if(idx>-1) cell.className='s-cell s-body';
    else if(i===snakeState.food) cell.className='s-cell s-food';
    board.appendChild(cell);
  }
}
document.addEventListener('keydown',e=>{
  if(!snakeState||!snakeState.running) return;
  const {dir,size}=snakeState;
  if(e.key==='ArrowRight'&&dir!==-1) snakeState.dir=1;
  else if(e.key==='ArrowLeft'&&dir!==1) snakeState.dir=-1;
  else if(e.key==='ArrowDown'&&dir!==-size) snakeState.dir=size;
  else if(e.key==='ArrowUp'&&dir!==size) snakeState.dir=-size;
  if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) e.preventDefault();
});

// ─── TETRIS ────────────────────────────────────────────────
const TETROMINOES={I:[[1,1,1,1]],O:[[1,1],[1,1]],T:[[0,1,0],[1,1,1]],S:[[0,1,1],[1,1,0]],Z:[[1,1,0],[0,1,1]],J:[[1,0,0],[1,1,1]],L:[[0,0,1],[1,1,1]]};
const T_COLORS={I:'#4af7f7',O:'#f7f04a',T:'#c44af7',S:'#4af74a',Z:'#f74a4a',J:'#4a6cf7',L:'#f7a44a'};
let tetState=null;
function buildTetris(body) {
  body.innerHTML=`
    <div class="tetris-wrap">
      <canvas id="tetCanvas" width="200" height="400" style="border:1px solid var(--border);border-radius:8px;display:block"></canvas>
      <div class="tetris-side">
        <div class="tetris-info-box"><div class="tetris-info-label">Score</div><div class="tetris-info-val" id="tetScore">0</div></div>
        <div class="tetris-info-box"><div class="tetris-info-label">Lines</div><div class="tetris-info-val" id="tetLines">0</div></div>
        <div class="tetris-info-box"><div class="tetris-info-label">Level</div><div class="tetris-info-val" id="tetLevel">1</div></div>
        <button class="app-btn" onclick="startTetris()" id="tetStartBtn"><i class="fas fa-play"></i> Start</button>
        <div style="font-size:.68rem;color:var(--text3);font-family:var(--font-mono)">← → move<br>↑ rotate<br>↓ drop</div>
      </div>
    </div>`;
  initTetris();
}
function initTetris() {
  const canvas=document.getElementById('tetCanvas'); if(!canvas) return;
  const ctx=canvas.getContext('2d');
  const cols=10, rows=20, sz=20;
  const board=Array(rows).fill(null).map(()=>Array(cols).fill(0));
  tetState={ctx,board,cols,rows,sz,cur:null,score:0,lines:0,level:1,running:false,interval:null};
  drawTetBoard();
}
function tetNewPiece() {
  const keys=Object.keys(TETROMINOES);
  const key=keys[Math.floor(Math.random()*keys.length)];
  const shape=TETROMINOES[key];
  tetState.cur={shape,color:T_COLORS[key],x:Math.floor((tetState.cols-shape[0].length)/2),y:0};
}
function startTetris() {
  initTetris(); tetNewPiece(); tetState.running=true;
  tetState.interval=setInterval(tetDrop,500);
  document.getElementById('tetStartBtn').innerHTML='<i class="fas fa-redo"></i> Restart';
}
function tetDrop() {
  if(!tetState||!tetState.running) return;
  tetState.cur.y++;
  if(tetCollides()) { tetState.cur.y--; tetLock(); tetNewPiece(); if(tetCollides()){stopTetris(); return;} }
  drawTetBoard();
}
function tetCollides(dx=0,dy=0,shape=null) {
  const s=shape||tetState.cur.shape;
  for(let r=0;r<s.length;r++) for(let c=0;c<s[r].length;c++) {
    if(!s[r][c]) continue;
    const nx=tetState.cur.x+c+dx, ny=tetState.cur.y+r+dy;
    if(nx<0||nx>=tetState.cols||ny>=tetState.rows) return true;
    if(ny>=0&&tetState.board[ny][nx]) return true;
  }
  return false;
}
function tetLock() {
  const {cur,board}=tetState;
  cur.shape.forEach((row,r)=>row.forEach((c,cc)=>{ if(c&&cur.y+r>=0) board[cur.y+r][cur.x+cc]=cur.color; }));
  let cleared=0;
  for(let r=tetState.rows-1;r>=0;r--) { if(board[r].every(c=>c)) { board.splice(r,1); board.unshift(Array(tetState.cols).fill(0)); cleared++; r++; } }
  tetState.lines+=cleared; tetState.score+=cleared*100*tetState.level;
  tetState.level=Math.floor(tetState.lines/10)+1;
  clearInterval(tetState.interval); tetState.interval=setInterval(tetDrop,Math.max(100,500-tetState.level*40));
  const sc=document.getElementById('tetScore'); if(sc) sc.textContent=tetState.score;
  const ln=document.getElementById('tetLines'); if(ln) ln.textContent=tetState.lines;
  const lv=document.getElementById('tetLevel'); if(lv) lv.textContent=tetState.level;
}
function stopTetris() { tetState.running=false; clearInterval(tetState.interval); showNotification('Game Over','Score: '+tetState.score,'fa-gamepad'); }
function drawTetBoard() {
  const {ctx,board,sz,rows,cols,cur}=tetState; if(!ctx) return;
  ctx.fillStyle='#0a0a0f'; ctx.fillRect(0,0,cols*sz,rows*sz);
  // grid
  ctx.strokeStyle='rgba(255,255,255,0.04)';
  for(let r=0;r<rows;r++) for(let c=0;c<cols;c++) { ctx.strokeRect(c*sz,r*sz,sz,sz); }
  // board
  board.forEach((row,r)=>row.forEach((color,c)=>{ if(color){ctx.fillStyle=color;ctx.fillRect(c*sz+1,r*sz+1,sz-2,sz-2);} }));
  // current piece
  if(cur) { cur.shape.forEach((row,r)=>row.forEach((c,cc)=>{ if(c){ctx.fillStyle=cur.color;ctx.fillRect((cur.x+cc)*sz+1,(cur.y+r)*sz+1,sz-2,sz-2);} })); }
}
document.addEventListener('keydown',e=>{
  if(!tetState||!tetState.running||!tetState.cur) return;
  if(e.key==='ArrowLeft'&&!tetCollides(-1,0)){tetState.cur.x--;drawTetBoard();}
  if(e.key==='ArrowRight'&&!tetCollides(1,0)){tetState.cur.x++;drawTetBoard();}
  if(e.key==='ArrowDown'){tetDrop();}
  if(e.key==='ArrowUp'){
    const rot=tetState.cur.shape[0].map((_,i)=>tetState.cur.shape.map(r=>r[i]).reverse());
    if(!tetCollides(0,0,rot)){tetState.cur.shape=rot;drawTetBoard();}
  }
});

// ─── TIC TAC TOE ───────────────────────────────────────────
let tttBoard=Array(9).fill(null), tttTurn='X', tttOver=false;
function buildTicTacToe(body) {
  body.innerHTML=`
    <div class="ttt-wrap">
      <div class="ttt-status" id="tttStatus">Player X's Turn</div>
      <div class="ttt-board" id="tttBoard">
        ${Array(9).fill(0).map((_,i)=>`<div class="ttt-cell" id="tttCell${i}" onclick="tttMove(${i})"></div>`).join('')}
      </div>
      <button class="app-btn" onclick="tttReset()"><i class="fas fa-redo"></i> New Game</button>
    </div>`;
  tttReset();
}
function tttMove(i) {
  if(tttOver||tttBoard[i]) return;
  tttBoard[i]=tttTurn;
  const cell=document.getElementById('tttCell'+i);
  if(cell){cell.textContent=tttTurn;cell.classList.add(tttTurn.toLowerCase());}
  const winner=tttCheck();
  if(winner){
    tttOver=true;
    document.getElementById('tttStatus').textContent=winner==='Draw'?`It's a Draw!`:`Player ${winner} Wins! 🎉`;
    if(winner!=='Draw') showNotification('TicTacToe','Player '+winner+' wins!','fa-trophy');
    return;
  }
  tttTurn=tttTurn==='X'?'O':'X';
  document.getElementById('tttStatus').textContent=`Player ${tttTurn}'s Turn`;
}
function tttCheck() {
  const wins=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for(const [a,b,c] of wins) {
    if(tttBoard[a]&&tttBoard[a]===tttBoard[b]&&tttBoard[b]===tttBoard[c]){
      [a,b,c].forEach(i=>document.getElementById('tttCell'+i)?.classList.add('win'));
      return tttBoard[a];
    }
  }
  return tttBoard.every(x=>x)?'Draw':null;
}
function tttReset() {
  tttBoard=Array(9).fill(null); tttTurn='X'; tttOver=false;
  for(let i=0;i<9;i++){const c=document.getElementById('tttCell'+i);if(c){c.textContent='';c.className='ttt-cell';}}
  const s=document.getElementById('tttStatus'); if(s) s.textContent='Player X\'s Turn';
}

// ─── MEMORY GAME ───────────────────────────────────────────
const MEM_SYMBOLS=['🎯','⚡','🎸','🔥','🌊','🍄','🎃','🦄'];
let memCards=[], memFlipped=[], memMatched=0, memScore=0, memCan=true;
function buildMemory(body) {
  body.innerHTML=`
    <div class="memory-wrap">
      <div style="display:flex;justify-content:space-between;width:320px">
        <span style="font-family:var(--font-ui);font-weight:700">Score: <span id="memScore">0</span></span>
        <button class="app-btn" onclick="memReset()"><i class="fas fa-redo"></i> New</button>
      </div>
      <div class="mem-board" id="memBoard"></div>
    </div>`;
  memReset();
}
function memReset() {
  memCards=[...MEM_SYMBOLS,...MEM_SYMBOLS].sort(()=>Math.random()-.5);
  memFlipped=[]; memMatched=0; memScore=0; memCan=true;
  const s=document.getElementById('memScore'); if(s) s.textContent=0;
  renderMemory();
}
function renderMemory() {
  const b=document.getElementById('memBoard'); if(!b) return;
  b.innerHTML='';
  memCards.forEach((sym,i)=>{
    const el=document.createElement('div');
    el.className='mem-card'; el.dataset.idx=i; el.dataset.sym=sym;
    el.innerHTML=`<div class="mem-front"><i class="fas fa-question"></i></div><div class="mem-back">${sym}</div>`;
    el.onclick=()=>memFlip(i);
    b.appendChild(el);
  });
}
function memFlip(i) {
  if(!memCan) return;
  const card=document.querySelector(`.mem-card[data-idx="${i}"]`);
  if(!card||card.classList.contains('flipped')||card.classList.contains('matched')) return;
  card.classList.add('flipped'); memFlipped.push(i);
  if(memFlipped.length===2) {
    memCan=false;
    const [a,b]=memFlipped;
    const ca=document.querySelector(`.mem-card[data-idx="${a}"]`);
    const cb=document.querySelector(`.mem-card[data-idx="${b}"]`);
    if(ca.dataset.sym===cb.dataset.sym) {
      ca.classList.add('matched'); cb.classList.add('matched');
      memMatched++; memScore+=10; memFlipped=[]; memCan=true;
      const s=document.getElementById('memScore'); if(s) s.textContent=memScore;
      if(memMatched===MEM_SYMBOLS.length) showNotification('Memory Game','You won! Score: '+memScore,'fa-trophy');
    } else {
      setTimeout(()=>{ ca.classList.remove('flipped'); cb.classList.remove('flipped'); memFlipped=[]; memCan=true; },1000);
    }
  }
}

// ─── PUZZLE ────────────────────────────────────────────────
let puzzleState=[], puzzleEmpty=15, puzzleMoves=0;
function buildPuzzle(body) {
  body.innerHTML=`
    <div class="app-content" style="align-items:center">
      <div style="display:flex;justify-content:space-between;width:320px">
        <span style="font-family:var(--font-ui);font-weight:700">Moves: <span id="puzzleMoves">0</span></span>
        <div style="display:flex;gap:6px">
          <button class="app-btn" onclick="shufflePuzzle()"><i class="fas fa-random"></i></button>
          <button class="app-btn" onclick="resetPuzzle()"><i class="fas fa-redo"></i></button>
        </div>
      </div>
      <div class="puzzle-board" id="puzzleBoard"></div>
    </div>`;
  resetPuzzle();
}
function resetPuzzle() { puzzleState=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,0]; puzzleEmpty=15; puzzleMoves=0; renderPuzzle(); }
function shufflePuzzle() { for(let i=0;i<200;i++){const m=validPuzzleMoves();const r=m[Math.floor(Math.random()*m.length)];swapPuzzle(r,false);} puzzleMoves=0; renderPuzzle(); showNotification('Puzzle','Shuffled! Good luck!','fa-puzzle-piece'); }
function validPuzzleMoves() {
  const r=Math.floor(puzzleEmpty/4), c=puzzleEmpty%4, m=[];
  if(r>0) m.push(puzzleEmpty-4); if(r<3) m.push(puzzleEmpty+4);
  if(c>0) m.push(puzzleEmpty-1); if(c<3) m.push(puzzleEmpty+1);
  return m;
}
function swapPuzzle(pos,count=true) {
  [puzzleState[pos],puzzleState[puzzleEmpty]]=[puzzleState[puzzleEmpty],puzzleState[pos]];
  puzzleEmpty=pos; if(count) puzzleMoves++;
}
function renderPuzzle() {
  const b=document.getElementById('puzzleBoard'); if(!b) return;
  const mv=document.getElementById('puzzleMoves'); if(mv) mv.textContent=puzzleMoves;
  b.innerHTML='';
  puzzleState.forEach((v,i)=>{
    const t=document.createElement('div');
    t.className='puzzle-tile'+(v===0?' empty':'');
    if(v!==0) { t.textContent=v; t.onclick=()=>{if(validPuzzleMoves().includes(i)){swapPuzzle(i);renderPuzzle();checkPuzzleWin();}}; }
    b.appendChild(t);
  });
}
function checkPuzzleWin() {
  if(puzzleState.slice(0,15).every((v,i)=>v===i+1)&&puzzleState[15]===0) showNotification('Puzzle Solved!','In '+puzzleMoves+' moves!','fa-trophy');
}

// ─── KEYBOARD SHORTCUTS ────────────────────────────────────
document.addEventListener('keydown',e=>{
  if(e.key==='Escape') { document.getElementById('startMenu').classList.remove('show'); hideCtxMenu(); }
  if(e.altKey&&e.key==='Tab') { e.preventDefault(); const open=S.windows.filter(w=>!w.minimized); if(open.length>1){const i=open.findIndex(w=>w.wid===S.activeWin); focusWindow(open[(i+1)%open.length].wid);} }
  if((e.ctrlKey||e.metaKey)&&e.key==='l') { e.preventDefault(); lockScreen(); }
});

// ─── WINDOW CLOSE ANIMATION ────────────────────────────────
const style=document.createElement('style');
style.textContent=`
@keyframes winClose{to{opacity:0;transform:scale(0.9)}}
@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-8px)}75%{transform:translateX(8px)}}
`;
document.head.appendChild(style);
