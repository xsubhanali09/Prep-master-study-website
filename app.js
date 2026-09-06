let siteSettings={};
function applySettings(){const s=siteSettings; const set=(id,v)=>{const e=document.getElementById(id);if(e&&v!==undefined)e.textContent=v}; const val=(id,v)=>{const e=document.getElementById(id);if(e&&v!==undefined)e.value=v};
set('brandName',s.brandName||'PREP MASTER'); if(s.siteLogo) document.getElementById('siteLogo').src=s.siteLogo; set('heroEyebrow',s.heroEyebrow);set('heroTitle',s.heroTitle);set('heroAccent',s.heroAccent);set('heroSubtitle',s.heroSubtitle);val('search',undefined);document.getElementById('search').placeholder=s.searchPlaceholder||'Search for a platform or feature...';set('appsTabLabel',s.appsTabLabel);set('myAppsTabLabel',s.myAppsTabLabel);set('loginLabel',s.loginLabel);set('footerText',s.footerText);set('footerName',s.footerName);set('popupTitle',s.popupTitle);set('popupText',s.popupText);set('popupButtonText',s.popupButtonText);set('popupContinueText',s.popupContinueText);set('detailLabel',s.detailLabel);set('premiumTitle',s.premiumTitle);document.getElementById('telegramLink').href=s.telegramUrl||'#';set('backBtn',s.backText);document.getElementById('code').placeholder=s.codePlaceholder||'Enter Premium Code';set('redeem',s.verifyText||'VERIFY CODE');}
async function loadSettings(){try{siteSettings=await api('/api/settings');applySettings()}catch(e){console.error(e)}}
const state={apps:[],my:[],selected:null,tab:'apps'};
const $=s=>document.querySelector(s);
const token=()=>localStorage.getItem('pm_token');
async function api(url,opt={}){opt.headers={...(opt.headers||{}),'Content-Type':'application/json'};if(token())opt.headers.Authorization='Bearer '+token();const r=await fetch(url,opt);const d=await r.json().catch(()=>({}));if(!r.ok)throw Error(d.error||'Request failed');return d}
async function loadApps(){state.apps=await api('/api/apps');render()}
function render(){
  const list=$('#platforms');
  const q=($('#search').value||'').toLowerCase();
  const arr=(state.tab==='my'?state.my:state.apps).filter(a=>a.name.toLowerCase().includes(q));
  list.innerHTML=arr.length?arr.map(a=>`<article class="card" data-id="${a._id}">${a.logo?`<img class="logo" src="${a.logo}" alt="">`:`<div class="logo fallback">${a.name.split(' ').map(x=>x[0]).slice(0,2).join('')}</div>`}<div class="info"><h2>${escapeHTML(a.name)}</h2><p>${escapeHTML(a.description||'')}</p></div><div class="arrow">→</div></article>`).join(''):`<div class="empty">${state.tab==='my'?'Abhi koi purchased app nahi hai.':'No apps found.'}</div>`;
  list.querySelectorAll('.card').forEach(c=>c.onclick=()=>select(c.dataset.id));
  $('#appsTab').classList.toggle('active',state.tab==='apps');$('#myTab').classList.toggle('active',state.tab==='my');
}
function showDetail(a){
  $('#homeHero').classList.add('hidden');
  $('#platforms').classList.add('hidden');
  $('#appDetail').classList.remove('hidden');
  $('#detailLogo').src=a.logo||'assets/prep-master.png';
  $('#detailName').textContent=a.name;
  $('#detailDescription').textContent=a.description||'Premium access';
  const price=a.price||100; $('#selected').textContent=(siteSettings.selectedTextTemplate||'{name} selected — Premium ₹{price} required.').replaceAll('{name}',a.name).replaceAll('{price}',price);
  $('#premiumText').textContent=(siteSettings.premiumTextTemplate||'{name} ka premium access — ₹{price}.').replaceAll('{name}',a.name).replaceAll('{price}',price);
  $('#buy').textContent=(siteSettings.buyTextTemplate||'BUY NOW — ₹{price}').replaceAll('{name}',a.name).replaceAll('{price}',price);
  $('#code').value='';
  window.scrollTo({top:0,behavior:'smooth'});
}
async function select(id){const source=state.tab==='my'?state.my:state.apps;const a=source.find(x=>x._id===id);if(!a)return;state.selected=a;showDetail(a)}
function backToApps(){$('#appDetail').classList.add('hidden');$('#homeHero').classList.remove('hidden');$('#platforms').classList.remove('hidden');window.scrollTo({top:0,behavior:'smooth'})}
function openTelegram(){const name=state.selected?.name;if(!name)return;location.href='https://t.me/Subhanali011?text='+encodeURIComponent(`Mujhe ${name} ka premium khareedna hai.`)}
async function myApps(){if(!token()){showAuth();return}try{state.my=await api('/api/my-apps');state.tab='my';render()}catch(e){alert(e.message)}}
function showAuth(){$('#auth').classList.remove('hidden')}
function closeAuth(){$('#auth').classList.add('hidden')}
async function authSubmit(){try{const mode=$('#authMode').value;const d=await api('/api/'+(mode==='login'?'login':'register'),{method:'POST',body:JSON.stringify({username:$('#username').value.trim(),password:$('#password').value})});localStorage.setItem('pm_token',d.token);closeAuth();alert(mode==='login'?'Logged in':'Account created')}catch(e){alert(e.message)}}
async function redeem(){
  if(!token()){showAuth();return}
  if(!state.selected){alert('Pehle app select karo.');return}
  const code=$('#code').value.trim();if(!code){alert('Premium code enter karo.');return}
  try{
    const d=await api('/api/verify-code',{method:'POST',body:JSON.stringify({code,appId:state.selected._id})});
    alert(d.message);$('#code').value='';state.my=await api('/api/my-apps');
    if(d.app?.url) location.href=d.app.url; else {state.tab='my';backToApps();render()}
  }catch(e){alert(e.message)}
}
function escapeHTML(str){return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;')}
$('#appsTab').id='appsTab';$('#myTab').id='myTab'; $('#search').oninput=render; applySettings();
$('#appsTab').onclick=()=>{state.tab='apps';backToApps();render()};
$('#myTab').onclick=()=>{myApps();};
$('#loginBtn').onclick=showAuth;
$('#authSubmit').onclick=authSubmit;
$('#authClose').onclick=closeAuth;
$('#toggleAuth').onclick=()=>{$('#authMode').value=$('#authMode').value==='login'?'register':'login';$('#authSubmit').textContent=$('#authMode').value==='login'?'LOGIN':'CREATE ACCOUNT';$('#toggleAuth').textContent=$('#authMode').value==='login'?'Create account':'Back to login'};
$('#buy').onclick=openTelegram;
$('#redeem').onclick=redeem;
$('#backBtn').onclick=backToApps;
window.addEventListener('load',async()=>{await loadSettings();await loadApps();setTimeout(()=>$('#telegramPopup').classList.remove('hide'),250)});
function closePopup(){$('#telegramPopup').classList.add('hide')}
