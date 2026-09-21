const listeners=new Set();
const isIos=/iphone|ipad|ipod/i.test(navigator.userAgent||'');
const isStandalone=()=>window.matchMedia?.('(display-mode: standalone)').matches||window.navigator.standalone===true;

let installPrompt=null;
let started=false;
let updateTimer=null;
let versionTimer=null;

const state={
  installed:isStandalone(),
  canInstall:false,
  iosInstallHint:isIos&&!isStandalone(),
  build:null,
  lastAutoUpdateAt:localStorage.getItem('du_pwa_last_auto_update_at')||'',
  checking:false,
  updating:false,
  offline:!navigator.onLine,
  swReady:false
};

function emit(){
  const snapshot={...state};
  listeners.forEach(fn=>{try{fn(snapshot)}catch{}});
}

export function getPwaState(){return {...state}}
export function subscribePwa(fn){listeners.add(fn);fn({...state});return()=>listeners.delete(fn)}

window.addEventListener('beforeinstallprompt',event=>{
  event.preventDefault();
  installPrompt=event;
  state.canInstall=true;
  state.iosInstallHint=false;
  emit();
});

window.addEventListener('appinstalled',()=>{
  installPrompt=null;
  state.canInstall=false;
  state.installed=true;
  state.iosInstallHint=false;
  emit();
});

window.addEventListener('online',()=>{state.offline=false;emit();checkBuildVersion(false)});
window.addEventListener('offline',()=>{state.offline=true;emit()});

export async function promptPwaInstall(){
  if(!installPrompt)return {available:false,outcome:'unavailable'};
  const p=installPrompt;
  installPrompt=null;
  state.canInstall=false;
  emit();
  await p.prompt();
  const result=await p.userChoice.catch(()=>({outcome:'dismissed'}));
  if(result?.outcome==='accepted'){
    state.installed=true;
    state.iosInstallHint=false;
  }
  emit();
  return {available:true,outcome:result?.outcome||'dismissed'};
}

export function formatPwaTime(value,lang='bn'){
  if(!value)return lang==='en'?'Not available yet':'এখনও পাওয়া যায়নি';
  const d=new Date(value);
  if(Number.isNaN(d.getTime()))return value;
  return new Intl.DateTimeFormat(lang==='en'?'en-GB':'bn-BD',{
    timeZone:'Asia/Dhaka',
    day:'2-digit',month:'long',year:'numeric',
    hour:'2-digit',minute:'2-digit',hour12:true
  }).format(d);
}

async function registerServiceWorker(){
  if(!('serviceWorker' in navigator))return null;
  try{
    const reg=await navigator.serviceWorker.register('/sw.js',{scope:'/',updateViaCache:'none'});
    state.swReady=true;
    emit();

    reg.addEventListener('updatefound',()=>{
      const worker=reg.installing;
      if(!worker)return;
      worker.addEventListener('statechange',()=>{
        if(worker.state==='installed'&&navigator.serviceWorker.controller){
          state.updating=true;
          emit();
          worker.postMessage({type:'SKIP_WAITING'});
        }
      });
    });

    navigator.serviceWorker.addEventListener('controllerchange',()=>{
      if(sessionStorage.getItem('du_pwa_controller_reload')==='1')return;
      sessionStorage.setItem('du_pwa_controller_reload','1');
      window.setTimeout(()=>location.reload(),350);
    });

    window.setTimeout(()=>sessionStorage.removeItem('du_pwa_controller_reload'),4000);
    reg.update().catch(()=>{});
    updateTimer=window.setInterval(()=>reg.update().catch(()=>{}),30*60*1000);
    return reg;
  }catch{
    state.swReady=false;
    emit();
    return null;
  }
}

export async function checkBuildVersion(forceReload=false){
  if(state.checking||!navigator.onLine)return null;
  state.checking=true;
  emit();
  try{
    const res=await fetch('/version.json?ts='+Date.now(),{cache:'no-store',headers:{'Cache-Control':'no-cache'}});
    if(!res.ok)throw new Error('version check failed');
    const remote=await res.json();
    const seen=localStorage.getItem('du_pwa_build_id')||'';
    state.build=remote;

    if(!seen){
      localStorage.setItem('du_pwa_build_id',remote.id||remote.built_at||'initial');
    }else if(remote.id&&remote.id!==seen){
      localStorage.setItem('du_pwa_build_id',remote.id);
      const appliedAt=new Date().toISOString();
      localStorage.setItem('du_pwa_last_auto_update_at',appliedAt);
      state.lastAutoUpdateAt=appliedAt;
      state.updating=true;
      emit();

      if('serviceWorker' in navigator){
        const reg=await navigator.serviceWorker.getRegistration('/').catch(()=>null);
        await reg?.update().catch(()=>{});
      }

      if(forceReload!==false){
        window.setTimeout(()=>location.reload(),900);
      }else{
        window.setTimeout(()=>location.reload(),1200);
      }
    }
    emit();
    return remote;
  }catch{
    return null;
  }finally{
    state.checking=false;
    emit();
  }
}

export async function manualPwaUpdateCheck(){
  const before=state.build?.id||localStorage.getItem('du_pwa_build_id')||'';
  const remote=await checkBuildVersion(false);
  return {changed:!!(remote?.id&&before&&remote.id!==before),remote};
}

export function initPwaRuntime(){
  if(started)return;
  started=true;
  document.documentElement.classList.toggle('pwa-standalone',isStandalone());
  window.matchMedia?.('(display-mode: standalone)').addEventListener?.('change',()=>{
    state.installed=isStandalone();
    document.documentElement.classList.toggle('pwa-standalone',state.installed);
    emit();
  });

  registerServiceWorker();
  checkBuildVersion(false);
  versionTimer=window.setInterval(()=>checkBuildVersion(false),10*60*1000);

  document.addEventListener('visibilitychange',()=>{
    if(document.visibilityState==='visible'){
      navigator.serviceWorker?.getRegistration?.('/').then(reg=>reg?.update?.().catch(()=>{})).catch(()=>{});
      checkBuildVersion(false);
    }
  });
}

export function stopPwaRuntime(){
  if(updateTimer)clearInterval(updateTimer);
  if(versionTimer)clearInterval(versionTimer);
  updateTimer=null;versionTimer=null;
}
