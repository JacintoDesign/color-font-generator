/* ============================================================
 * Random Aesthetic Generator — v6
 * - Fix: guard favorites without fonts to avoid errors; preview now reliably loads fonts
 * - Fix: checkbox + label stay inline across viewports
 * - Keep all v5 functionality and layout
 * ============================================================ */

const ls = { get(k,f){ try{const v=localStorage.getItem(k); return v?JSON.parse(v):f;}catch{return f;} }, set(k,v){ try{localStorage.setItem(k,JSON.stringify(v));}catch{} } };
const $ = (s, c=document) => c.querySelector(s);
const $$ = (s, c=document) => Array.from(c.querySelectorAll(s));
const live = (m)=>{ const el=$('#live'); if(el) el.textContent=m; };

async function copyToClipboard(text){ try{ await navigator.clipboard.writeText(text); live('Copied to clipboard'); return true;}catch{ const ta=document.createElement('textarea'); ta.value=text; ta.setAttribute('readonly',''); ta.style.position='absolute'; ta.style.left='-9999px'; document.body.appendChild(ta); ta.select(); let ok=false; try{ ok=document.execCommand('copy'); }catch{} document.body.removeChild(ta); live(ok?'Copied to clipboard':'Copy failed'); return ok; } }

// Color math
function hexToRgb(hex){ const s=hex.replace('#',''); const b=s.length===3?s.split('').map(c=>c+c).join(''):s; const n=parseInt(b,16); return {r:(n>>16)&255,g:(n>>8)&255,b:n&255}; }
function rgbToHsl(r,g,b){ r/=255; g/=255; b/=255; const max=Math.max(r,g,b), min=Math.min(r,g,b); let h,s,l=(max+min)/2; if(max===min){ h=s=0; } else { const d=max-min; s=l>0.5? d/(2-max-min): d/(max+min); switch(max){ case r: h=(g-b)/d + (g<b?6:0); break; case g: h=(b-r)/d + 2; break; default: h=(r-g)/d + 4; } h/=6; } return { h: Math.round(h*360), s: Math.round(s*100), l: Math.round(l*100) }; }
function hexToHsl(hex){ const {r,g,b}=hexToRgb(hex); return rgbToHsl(r,g,b); }
function hslToHex(h,s,l){ s/=100; l/=100; const k = n => (n + h/30) % 12; const a = s * Math.min(l, 1 - l); const f = n => l - a * Math.max(-1, Math.min(k(n)-3, Math.min(9-k(n), 1))); const toHex = x => Math.round(255*x).toString(16).padStart(2, '0'); return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`.toUpperCase(); }
function relLuminance({r,g,b}){ const sr=[r,g,b].map(v=>v/255).map(c=>c<=0.03928? c/12.92: Math.pow((c+0.055)/1.055,2.4)); return 0.2126*sr[0]+0.7152*sr[1]+0.0722*sr[2]; }
function contrastRatio(hex1,hex2){ const L1=relLuminance(hexToRgb(hex1)); const L2=relLuminance(hexToRgb(hex2)); const [light,dark]=L1>L2?[L1,L2]:[L2,L1]; return (light+0.05)/(dark+0.05); }
function checkContrast(fg,bg){ const ratio=contrastRatio(fg,bg); return { ratio, passAA: ratio>=4.5 }; }
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));

// Fonts
const KNOWN_PAIRINGS = [
  { heading: 'Playfair Display', body: 'Source Sans 3' },
  { heading: 'Lora', body: 'Inter' },
  { heading: 'Bitter', body: 'DM Sans' },
  { heading: 'Merriweather', body: 'Work Sans' },
  { heading: 'Poppins', body: 'Roboto' },
  { heading: 'Crimson Text', body: 'Rubik' },
  { heading: 'Libre Baskerville', body: 'Karla' },
  { heading: 'Spectral', body: 'DM Sans' },
  { heading: 'Domine', body: 'Inter' },
  { heading: 'Rubik', body: 'Source Sans 3' },
];
function googleFontsHref(h,b){ const enc=(f,w)=>`${encodeURIComponent(f).replace(/%20/g,'+')}:wght@${w}`; return `https://fonts.googleapis.com/css2?family=${enc(h,'600;700')}&family=${enc(b,'400;500;600')}&display=swap`; }
function pickFontPair(){ if(Math.random()<0.7) return structuredClone(KNOWN_PAIRINGS[Math.floor(Math.random()*KNOWN_PAIRINGS.length)]); const serifs=['Lora','Merriweather','Crimson Text','Bitter','Playfair Display','Libre Baskerville','Spectral','Domine']; const sans=['Inter','Source Sans 3','Roboto','Work Sans','Poppins','Rubik','Nunito','DM Sans','Urbanist','Karla','Fira Sans','Quicksand']; return { heading: serifs[Math.floor(Math.random()*serifs.length)], body: sans[Math.floor(Math.random()*sans.length)] }; }
function applyFonts(pair){ const link=$('#gf-dynamic'); link.href=googleFontsHref(pair.heading,pair.body); const p=$('#preview'); p.style.setProperty('--heading-font', `'${pair.heading}', serif`); p.style.setProperty('--body-font', `'${pair.body}', system-ui, sans-serif`); $('#previewTitle').style.fontFamily='var(--heading-font)'; $('#previewText').style.fontFamily='var(--body-font)'; $('#headingName').textContent=pair.heading; $('#bodyName').textContent=pair.body; }

// Defaults
const DEFAULTS = { Minimal: { palette: ['#1F2937','#6B7280','#E5E7EB','#F9FAFB','#111827'], fonts: { heading: 'Inter', body: 'Source Sans 3' } } };

// Palette generator with influencers
function getRandomPalette(opts={}){
  const { baseHex, satBias=0, fixedCount=0, lockFirst=false } = opts;
  const baseHue = baseHex ? hexToHsl(baseHex).h : Math.floor(Math.random()*360);
  const autoCount = 4 + Math.floor(Math.random()*3); // 4–6
  const count = fixedCount || autoCount;
  const colors=[]; const mode = Math.random();
  for(let i=0;i<count;i++){
    let h = (baseHue + (mode<0.5? (i-1)*18 : (i-1)*35) + 360) % 360;
    let s = clamp(45 + (Math.random()*30) + satBias, 20, 95);
    let l = clamp(40 + (i*6) + (Math.random()*10 - 5), 15, 90);
    colors.push(hslToHex(h,s,l));
  }
  if (Math.random()<0.2) colors.splice(1,0, Math.random()<0.5? '#111827':'#F9FAFB');
  if (lockFirst && baseHex) colors[0]=baseHex.toUpperCase();
  return colors.slice(0,6);
}

// Renderers
function renderPalette(colors){ const el=$('#palette'); el.innerHTML=''; colors.forEach((hex,idx)=>{
    const sw=document.createElement('div'); sw.className='swatch fade-in'; sw.tabIndex=0; sw.setAttribute('role','group'); sw.setAttribute('aria-label',`Swatch ${idx+1} ${hex}`);
    const color=document.createElement('div'); color.className='swatch__color'; color.style.background=hex; color.setAttribute('aria-hidden','true');
    const meta=document.createElement('div'); meta.className='swatch__meta';
    const hexBtn=document.createElement('button'); hexBtn.className='copy hex'; hexBtn.textContent=hex; hexBtn.title='Copy HEX'; hexBtn.addEventListener('click',()=>copyToClipboard(hex)); hexBtn.setAttribute('aria-label',`Copy ${hex}`);
    const badges=document.createElement('div'); badges.className='badges';
    const w=checkContrast('#FFFFFF',hex); const b=checkContrast('#000000',hex);
    const badgeW=document.createElement('span'); badgeW.className=`badge ${w.passAA?'pass':'fail'}`; badgeW.innerHTML=`<strong>W</strong> <span aria-hidden="true">${w.passAA?'AA ✓':'AA ✗'}</span>`; badgeW.setAttribute('role','img'); badgeW.setAttribute('aria-label',`White on ${hex} contrast ${w.ratio.toFixed(2)} ${w.passAA?'passes':'fails'} AA`);
    const badgeB=document.createElement('span'); badgeB.className=`badge ${b.passAA?'pass':'fail'}`; badgeB.innerHTML=`<strong>B</strong> <span aria-hidden="true">${b.ratio.toFixed(2)} ${b.passAA?'AA ✓':'AA ✗'}</span>`; badgeB.setAttribute('role','img'); badgeB.setAttribute('aria-label',`Black on ${hex} contrast ${b.ratio.toFixed(2)} ${b.passAA?'passes':'fails'} AA`);
    badges.append(badgeW,badgeB);
    meta.append(hexBtn,badges); sw.append(color,meta); el.append(sw);
  });
}
  function renderPreview(pair){
    applyFonts(pair);
  }

// Export helpers
function exportCSSVars(state){ const lines=[]; state.palette.forEach((hex,i)=>lines.push(`  --color-${i+1}: ${hex};`)); lines.push(`  --font-heading: '${state.fonts.heading}', serif;`); lines.push(`  --font-body: '${state.fonts.body}', system-ui, sans-serif;`); const cssBlock=`:root{\n${lines.join('\n')}\n}`; copyToClipboard(cssBlock); return cssBlock; }
function exportJSON(state){ const obj={ palette: state.palette, fonts: { ...state.fonts } }; const json=JSON.stringify(obj,null,2); const blob=new Blob([json],{type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='aesthetic.json'; document.body.appendChild(a); a.click(); document.body.removeChild(a); copyToClipboard(json); return json; }

// Favorites
function loadFavorites(){ return ls.get('aesthetic.favorites',[]); }
function saveFavorites(list){ ls.set('aesthetic.favorites',list); }
function saveFavorite(state){ const favs=loadFavorites(); const entry={ id: (crypto.randomUUID? crypto.randomUUID(): String(Date.now())), ...state }; favs.unshift(entry); saveFavorites(favs); renderFavorites(); live('Saved to favorites'); }
function renderFavorites(){ const host=$('#favorites'); host.innerHTML=''; const favs=loadFavorites(); if(!favs.length){ host.innerHTML='<p>No favorites yet. Generate and Save combinations.</p>'; return; }
  favs.forEach(f=>{
    const item=document.createElement('div'); item.className='fav-item';
    const meta=document.createElement('div'); meta.className='fav-meta';
    const minis=document.createElement('div'); minis.className='mini-swatches';
    (f.palette||[]).slice(0,6).forEach(h=>{ const m=document.createElement('span'); m.className='mini'; m.style.background=h; minis.append(m); });

    // SAFE label build (avoid innerHTML on possibly incomplete objects)
    const label=document.createElement('div');
    const safeFonts = (f.fonts && typeof f.fonts=== 'object') ? f.fonts : { heading: '—', body: '—' };
    const strong=document.createElement('strong'); strong.textContent = safeFonts.heading || '—';
    label.appendChild(strong); label.append(' / ', safeFonts.body || '—');

    meta.append(minis,label);

    const actions=document.createElement('div'); actions.className='fav-actions';
    const apply=document.createElement('button'); apply.className='btn'; apply.textContent='Apply'; apply.addEventListener('click',()=>applyState({ palette: f.palette || [], fonts: f.fonts || state.fonts || pickFontPair() }));
    const del=document.createElement('button'); del.className='btn btn-ghost'; del.textContent='Delete'; del.addEventListener('click',()=>{ removeFavorite(f.id); });
    actions.append(apply,del);

    item.append(meta,actions); host.append(item);
  });
}
function removeFavorite(id){ const next=loadFavorites().filter(x=>x.id!==id); saveFavorites(next); renderFavorites(); live('Favorite deleted'); }

// State & Apply
const state={ palette: [], fonts: { heading:'', body:'' }, basePalette: [] };
const ui={ baseColor: '#6366f1', satBias: 0, fixedCount: 0, lockFirst:false };

function applyState(next){
  // Defensive: if fonts missing, choose a pair so preview always has valid families
  const nextFonts = (next.fonts && next.fonts.heading && next.fonts.body) ? next.fonts : (state.fonts.heading ? state.fonts : pickFontPair());
  state.palette=[...(next.palette||[])];
  state.fonts={...nextFonts};
  renderPalette(state.palette);
  renderPreview(state.fonts);
  const root=document.documentElement;
  state.palette.forEach((hex,i)=> root.style.setProperty(`--color-${i+1}`,hex));
  root.style.setProperty('--font-heading',`'${state.fonts.heading}', serif`);
  root.style.setProperty('--font-body',`'${state.fonts.body}', system-ui, sans-serif`);
}

function shuffleAll(){
  const next={ palette: getRandomPalette({ baseHex: ui.baseColor, satBias: ui.satBias, fixedCount: ui.fixedCount, lockFirst: ui.lockFirst }), fonts: pickFontPair() };
  // Reset baseline to the newly generated palette so saturation adjustments are relative
  state.basePalette = next.palette.slice(0);
  applyState(next);
  live('Shuffled fonts and colors');
}

// Adjust only saturation using the baseline palette
function applySaturationOnly(){
  if(!state.basePalette.length){ state.basePalette = state.palette.slice(0); }
  const bias = ui.satBias;
  const adjusted = state.basePalette.map(hex=>{
    const {h,s,l}=hexToHsl(hex);
    const s2 = clamp(s + bias, 0, 100);
    return hslToHex(h, s2, l);
  });
  applyState({ palette: adjusted });
}

// Theme (kept minimal here)
function loadTheme(){ return ls.get('aesthetic.settings',{theme:'light'}).theme; }
function saveTheme(theme){ ls.set('aesthetic.settings',{theme}); }
function applyTheme(theme){ const html=document.documentElement; html.classList.toggle('theme-dark', theme==='dark'); html.classList.toggle('theme-light', theme!=='dark'); const tgl=$('#themeToggle'); if(tgl){ tgl.checked=theme==='dark'; $('#themeLabel').textContent = theme==='dark' ? 'Dark mode' : 'Light mode'; tgl.setAttribute('aria-checked', theme==='dark' ? 'true' : 'false'); } }

function bindUI(){
  $('#shuffleBtn').addEventListener('click',shuffleAll);
  $('#saveBtn').addEventListener('click',()=>saveFavorite(state));
  $('#copyCssBtn').addEventListener('click',()=>exportCSSVars(state));
  $('#exportJsonBtn').addEventListener('click',()=>exportJSON(state));
  $('#clearFavsBtn').addEventListener('click',()=>{ saveFavorites([]); renderFavorites(); live('All favorites cleared'); });

  // Influencers (live)
  const baseColor=$('#baseColor'); const sat=$('#satBias'); const countSel=$('#countSelect'); const lockFirst=$('#lockFirst');
  baseColor.addEventListener('input', (e)=>{ ui.baseColor = e.target.value; shuffleAll(); });
  sat.addEventListener('input', (e)=>{ ui.satBias = parseInt(e.target.value,10) || 0; applySaturationOnly(); });
  countSel.addEventListener('change',(e)=>{ ui.fixedCount = parseInt(e.target.value,10) || 0; shuffleAll(); });
  lockFirst.addEventListener('change',(e)=>{ ui.lockFirst = e.target.checked; shuffleAll(); });

  // Theme toggle
  const tgl=$('#themeToggle'); tgl.addEventListener('change',(e)=>{ const theme=e.target.checked ? 'dark' : 'light'; applyTheme(theme); saveTheme(theme); });

  // Keyboard shortcuts
  window.addEventListener('keydown',(e)=>{ if(e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return; if(e.code==='Space'){ e.preventDefault(); shuffleAll(); } if(e.key.toLowerCase()==='s'){ e.preventDefault(); saveFavorite(state); } if(e.key.toLowerCase()==='c'){ e.preventDefault(); exportCSSVars(state); } });
}

(function start(){
  applyTheme(loadTheme());
  bindUI();
  renderFavorites();
  applyState({ ...DEFAULTS.Minimal });
  // Initialize baseline from the starting palette
  state.basePalette = state.palette.slice(0);
})();
