
import React,{useEffect,useMemo,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {
  LayoutDashboard,TrendingUp,WalletCards,Users,ShieldCheck,LogOut,Plus,Search,
  UserRound,Building2,IdCard,Activity,ChevronRight,ChevronDown,ArrowLeft,X,Save,Trash2,RefreshCw,
  Settings,Database,LockKeyhole,Home,BookOpen,Calculator,HelpCircle,Phone,
  Bell,ArrowRight,CalendarDays,CheckCircle2,AlertTriangle,Landmark,FileText,Camera,Briefcase,MapPin,Mail,PhoneCall,MessageCircle,Edit3,UserCircle2,History,ArrowRightLeft,GraduationCap,BadgeDollarSign,Clock3,FileClock,ServerCog,Gauge,UserCog,ScrollText,SlidersHorizontal,ShieldAlert,Link2,Eye,Power,BookUser,NotebookTabs,Milestone,Award,BarChart3,PieChart,LineChart,MonitorCheck,Sparkles,UserCheck,UserX,Boxes,Command,DatabaseZap,ShieldEllipsis,Radio,TrendingDown,ReceiptText,ChartNoAxesCombined,Route,Flag,Target,Share2,Copy,Send,Smartphone,Cloud
} from 'lucide-react';
import './styles.css';
import './auth-phase8.css';
import './admin-premium.css';
import './career-phase9.css';
import './career-dashboard-phase10.css';
import './calculator-phase11.css';
import './dashboard-phase11-1.css';
import './traffic-analytics-phase11-2.css';
import './salary-history-phase12.css';
import './promotion-timeline-phase13.css';
import './leave-phase14.css';
import {KnowledgeCenter,PersonalCareerReports,PrivacyControlCenter,FinalReleaseStatus} from './final-core-phase16-19.jsx';
import PremiumPersonalDashboard from './premium-dashboard-v16-1.jsx';
import './mobile-app-v16-2.css';
import './public-home-v16-3.css';
import './mobile-menu-hotfix-v16-3-1.css';
import './system-control-v16-3-3.css';
import './super-admin-user-control-v16-3-5.css';
import './points-calculator-v16-3-6.css';
import './promotion-forecast-v16-3-7.css';
import './house-allocation-points-v16-3-8.css';
import './automatic-house-points-v16-3-9.css';
import './clean-user-facing-v16-3-10.css';
import './responsive-app-desktop-v16-4.css';
import './smart-registration-v16-5.css';
import './premium-home-navigation-v16-6.css';
import './exact-mockup-v16-7.css';
import './exact-mockup-v16-7-1.css';
import './approved-home-v16-8.css';
import './pay-scale-2026-public.css';
import './mobile-premium-public-v1.css';
import './public-visitor-stats.css';
import './public-report-share.css';
import './october-arrear.css';
import './public-experience-v2.css';
import './public-premium-v2-1.css';
import './du-payroll-v2-2.css';
import './du-experience-v2-3.css';
import './pwa-mobile-v1.css';
import './hisab-brand-v1.css';
import './pwa-home-v2.css';
import './pwa-salary-compact-v1.css';
import './hisab-indigo-aqua-v2.css';
import './desktop-app-shell-v3.css';
import './salary-wizard-v27.css';
import {initPwaRuntime,subscribePwa,getPwaState,promptPwaInstall,formatPwaTime,manualPwaUpdateCheck,consumePwaUpdateNotice} from './pwa-client.js';
import FiscalOfficeCalendar,{LoggedInOfficeCalendar,CalendarDashboardWidget,AdminOfficeCalendarManager} from './calendar-phase15.jsx';
import GuestLocalCenter from './guest-local-v1.jsx';
import {
  PAY2015,PAY2026,PAY_SCALE_2026_META,PROMO_RULES,money,fmtDate,diffYMD,durationBn,addYears,
  annualPromotionCycle,futureRoadmap,serviceExperiencePoints,fixed2026,implementationRate,houseRent2015,salary2026Snapshot,incremented2015Basic,specialBenefit2025
} from './rules';

initPwaRuntime();

const API=import.meta.env.VITE_API_URL||import.meta.env.VITE_API_BASE||'';
async function api(path,opts={}){
  const r=await fetch(API+path,{credentials:'include',headers:{'Content-Type':'application/json',...(opts.headers||{})},...opts});
  const d=await r.json().catch(()=>({}));
  if(!r.ok) throw new Error(d.error||d.detail||'Request failed');
  return d;
}

function guestLocalProfile(){
  try{
    const x=JSON.parse(localStorage.getItem('hisab_guest_workspace_v1')||'null');
    return x?.profile||{};
  }catch{return {}}
}

async function syncGuestWorkspaceToAccount(user){
  let w=null;
  try{w=JSON.parse(localStorage.getItem('hisab_guest_workspace_v1')||'null')}catch{}
  if(!w||typeof w!=='object')return {synced:false,reason:'no-local-data'};
  const hasData=!!(
    Object.values(w.profile||{}).some(v=>String(v||'').trim())||
    (w.education||[]).length||(w.events||[]).length||(w.salary_history||[]).length||(w.leave||[]).length
  );
  if(!hasData)return {synced:false,reason:'empty'};

  const accountKey=String(user?.id||user?.email||user?.employee_reference||'account');
  const mapKey='hisab_guest_sync_map_'+accountKey;
  let map={profileKey:'',education:[],events:[],salary:[],leave:[]};
  try{map={...map,...JSON.parse(localStorage.getItem(mapKey)||'{}')}}catch{}
  const sets={
    education:new Set(map.education||[]),
    events:new Set(map.events||[]),
    salary:new Set(map.salary||[]),
    leave:new Set(map.leave||[])
  };
  let attempted=0,failed=0,succeeded=0;
  const push=async(path,opts)=>{
    attempted++;
    try{await api(path,opts);succeeded++;return true}
    catch{failed++;return false}
  };
  const persistMap=()=>{
    localStorage.setItem(mapKey,JSON.stringify({
      profileKey:map.profileKey||'',
      education:[...sets.education],events:[...sets.events],salary:[...sets.salary],leave:[...sets.leave]
    }));
  };

  const p=w.profile||{};
  const profilePayload={
    first_joining_date:p.first_joining_date||'',
    current_post:p.current_post||'',
    current_grade:p.grade?Number(p.grade):null,
    current_post_joining_date:p.current_post_joining_date||'',
    employment_type:p.category||'',
    office_name:p.office_name||'',
    department_name:p.department_name||'',
    retirement_age:p.retirement_age?Number(p.retirement_age):null,
    notes:'Imported from Hisab Sahayika local PWA'
  };
  const profileHasData=[profilePayload.first_joining_date,profilePayload.current_post,profilePayload.current_grade,profilePayload.current_post_joining_date,profilePayload.office_name,profilePayload.department_name].some(Boolean);
  const profileKey=JSON.stringify(profilePayload);
  if(profileHasData&&map.profileKey!==profileKey){
    if(await push('/api/my-career/profile',{method:'PUT',body:JSON.stringify(profilePayload)})){
      map.profileKey=profileKey;persistMap();
    }
  }

  for(const x of (w.education||[])){
    const id=String(x.id||'');
    if(!x.level||!id||sets.education.has(id))continue;
    if(await push('/api/my-career/education',{method:'POST',body:JSON.stringify({
      level:x.level||'',institution:x.institution||'',subject:x.subject||'',
      passing_year:x.passing_year||'',result:x.result||'',notes:'Imported from local PWA'
    })})){sets.education.add(id);persistMap()}
  }
  for(const x of (w.events||[])){
    const id=String(x.id||'');
    if(!x.event_date||!x.title||!id||sets.events.has(id))continue;
    if(await push('/api/my-career/events',{method:'POST',body:JSON.stringify({
      event_type:x.type||'other',event_date:x.event_date||'',title:x.title||'',
      post_name:x.post_name||'',grade:x.grade||'',office_name:x.office_name||'',
      reference_no:'',notes:'Imported from local PWA'
    })})){sets.events.add(id);persistMap()}
  }
  for(const x of (w.salary_history||[])){
    const id=String(x.id||'');
    if(!x.effective_date||!id||sets.salary.has(id))continue;
    if(await push('/api/my-salary-history',{method:'POST',body:JSON.stringify({
      effective_date:x.effective_date||'',grade:Number(x.grade||p.grade||13),stage_2015:0,
      basic_2015:Number(x.basic||0),fixed_2026:0,payable_basic:Number(x.basic||0),
      gross_salary:Number(x.gross||0),total_deduction:Number(x.deductions||0),
      net_salary:Number(x.net||0),source:'guest_import',notes:x.note||'Imported from local PWA'
    })})){sets.salary.add(id);persistMap()}
  }
  for(const x of (w.leave||[])){
    const id=String(x.id||'');
    if(!x.start_date||!x.end_date||!id||sets.leave.has(id))continue;
    if(await push('/api/my-leave-records',{method:'POST',body:JSON.stringify({
      leave_type:x.type||'other',start_date:x.start_date||'',end_date:x.end_date||'',
      day_mode:'full',total_days:Number(x.total_days||0),notes:x.note||'Imported from local PWA'
    })})){sets.leave.add(id);persistMap()}
  }

  if(failed===0){
    localStorage.setItem('hisab_guest_last_cloud_sync_at',new Date().toISOString());
    localStorage.removeItem('hisab_guest_last_cloud_sync_error');
  }else{
    localStorage.setItem('hisab_guest_last_cloud_sync_error',new Date().toISOString());
  }
  return {synced:failed===0,attempted,succeeded,failed};
}

function pwaInstallId(){
  let id=localStorage.getItem('hisab_pwa_install_id');
  if(!id){
    id=(crypto.randomUUID?.()||`install-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    localStorage.setItem('hisab_pwa_install_id',id);
  }
  return id;
}
function pwaPlatform(){
  const ua=navigator.userAgent||'';
  if(/iphone|ipad|ipod/i.test(ua))return 'ios';
  if(/android/i.test(ua))return 'android';
  return 'other';
}
async function recordPwaInstall(){
  const standalone=window.matchMedia?.('(display-mode: standalone)').matches||window.navigator.standalone===true;
  const source=standalone?'standalone_first_open':'browser_install';
  const result=await api('/api/public/pwa-install',{
    method:'POST',
    body:JSON.stringify({install_id:pwaInstallId(),platform:pwaPlatform(),source})
  });
  localStorage.setItem('hisab_pwa_install_reported','1');
  return result;
}

function visitorId(){
  let id=localStorage.getItem('public_visitor_id');
  if(!id){
    id=(crypto.randomUUID?.()||`${Date.now()}-${Math.random().toString(36).slice(2)}`);
    localStorage.setItem('public_visitor_id',id);
  }
  return id;
}
function trackPublic(event='page_view',section='home'){
  return fetch(API+'/api/public/track',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({visitor_id:visitorId(),event,section,path:location.pathname})
  }).catch(()=>{});
}

const roleLabel={super_admin:'System Administrator',admin:'Admin',department_admin:'Department Admin',editor:'Editor',employee:'Employee'};
const I18N={
  bn:{
    appName:'হিসাব সহায়িকা',
    appSub:'স্বাধীন ও অনানুষ্ঠানিক হিসাব সহায়ক প্ল্যাটফর্ম',
    login:'লগইন',
    logout:'লগআউট',
    home:'হোম',
    dashboard:'আমার ড্যাশবোর্ড',
    promotion:'পদোন্নতি',
    salary:'বেতন ও পে-স্কেল',
    employees:'কর্মকর্তা-কর্মচারী ব্যবস্থাপনা',
    directory:'বিভাগ ও পদবি',
    admin:'অ্যাডমিন প্যানেল',
    language:'English',
    independent:'এটি একটি স্বাধীন ও অনানুষ্ঠানিক ডিজিটাল সেবা প্ল্যাটফর্ম।',
    welcome:'স্বাগতম'
  },
  en:{
    appName:'Hisab Sahayika',
    appSub:'Independent & unofficial calculation assistant',
    login:'Login',
    logout:'Logout',
    home:'Home',
    dashboard:'My Dashboard',
    promotion:'Promotion',
    salary:'Salary & Pay Scale',
    employees:'Employee Management',
    directory:'Department & Designation',
    admin:'Admin Panel',
    language:'বাংলা',
    independent:'This is an independent and unofficial digital service platform.',
    welcome:'Welcome'
  }
};
function LangToggle({lang,setLang}){return <button className="lang-btn" onClick={()=>setLang(lang==='bn'?'en':'bn')}>{I18N[lang].language}</button>}

function PwaMobileInstallGate({lang='bn'}){
  const en=lang==='en';
  const [pwa,setPwa]=useState(()=>getPwaState());
  const [installing,setInstalling]=useState(false);
  const [installResult,setInstallResult]=useState('');
  const [installStats,setInstallStats]=useState({total_installs:null,today_installs:null});
  useEffect(()=>subscribePwa(setPwa),[]);
  useEffect(()=>{
    let alive=true;
    const load=()=>api('/api/public/pwa-install-stats').then(x=>{if(alive)setInstallStats(x)}).catch(()=>{});
    load();
    const t=setInterval(load,60000);
    return()=>{alive=false;clearInterval(t)};
  },[pwa.installed]);

  const mobile=typeof window!=='undefined'&&(
    window.matchMedia?.('(max-width: 900px)').matches||
    /android|iphone|ipad|ipod|mobile/i.test(navigator.userAgent||'')
  );
  const standalone=typeof window!=='undefined'&&(window.matchMedia?.('(display-mode: standalone)').matches||window.navigator.standalone===true);
  const mainEntry=typeof window!=='undefined'&&window.location.pathname==='/'&&!new URLSearchParams(window.location.search).has('shared_report');
  const hardGate=mobile&&!standalone&&mainEntry;
  useEffect(()=>{
    document.documentElement.classList.toggle('mobile-pwa-hard-gate',!!hardGate);
    document.body.classList.toggle('mobile-pwa-hard-gate',!!hardGate);
    return()=>{
      document.documentElement.classList.remove('mobile-pwa-hard-gate');
      document.body.classList.remove('mobile-pwa-hard-gate');
    };
  },[hardGate]);
  if(!hardGate)return null;

  const lastTime=formatPwaTime(pwa.lastAutoUpdateAt||pwa.build?.built_at||'',lang);
  const installedAt=formatPwaTime(localStorage.getItem('du_pwa_installed_at')||'',lang);

  const install=async()=>{
    if(pwa.iosInstallHint){
      setInstallResult('ios');
      return;
    }
    if(!pwa.canInstall){
      setInstallResult('waiting');
      return;
    }
    setInstalling(true);
    const result=await promptPwaInstall();
    if(result?.outcome==='accepted')setInstallResult('accepted');
    else if(result?.outcome==='dismissed')setInstallResult('dismissed');
    setInstalling(false);
  };

  const services=[
    [WalletCards,en?'Salary & arrears':'বেতন ও বকেয়া'],
    [TrendingUp,en?'Promotion calculation':'পদোন্নতি হিসাব'],
    [Award,en?'Points & house allocation':'পয়েন্ট ও বাসা বরাদ্দ'],
    [Clock3,en?'Service length & retirement':'চাকরিকাল ও অবসর'],
    [FileText,en?'A4 PDF reports':'A4 PDF রিপোর্ট'],
    [Bell,en?'Notices & useful information':'নোটিশ ও প্রয়োজনীয় তথ্য']
  ];

  if(pwa.installed)return <div className="pwa-install-gate installed">
    <div className="pwa-gate-card success">
      <div className="pwa-gate-icon success"><CheckCircle2/></div>
      <span className="pwa-gate-badge">{en?'INSTALLATION COMPLETE':'ইনস্টল সম্পন্ন'}</span>
      <div className="pwa-install-count"><Users/><span>{installStats.total_installs==null?(en?'Loading install count…':'ইনস্টল সংখ্যা লোড হচ্ছে…'):(en?`Total installs: ${numLang(installStats.total_installs,'en',0)}`:`মোট ইনস্টল: ${numLang(installStats.total_installs,'bn',0)}`)}</span></div>
      <h1>{en?'Hisab Sahayika is installed':'হিসাব সহায়িকা ইনস্টল হয়েছে'}</h1>
      <p>{en?'Open Hisab Sahayika from your phone Home Screen and use the calculation services from the app.':'এখন আপনার মোবাইলের Home Screen থেকে হিসাব সহায়িকা খুলে প্রয়োজনীয় হিসাব ও সেবাগুলো ব্যবহার করুন।'}</p>
      <div className="pwa-home-hint">
        <span className="pwa-home-app-icon">হি</span>
        <div><b>{en?'Look for this app on your Home Screen':'Home Screen-এ এই অ্যাপটি খুঁজুন'}</b><small>{en?'Hisab Sahayika · Indigo + Aqua icon':'হিসাব সহায়িকা · ইন্ডিগো + অ্যাকুয়া আইকন'}</small></div>
      </div>
      <div className="pwa-gate-service-title">{en?'Services available in the app':'অ্যাপে যা যা পাবেন'}</div>
      <div className="pwa-gate-services">{services.map(([I,t])=><span key={t}><I/><b>{t}</b></span>)}</div>
      <div className="pwa-gate-disclaimer compact"><ShieldAlert/><div><b>{en?'Independent, unofficial app':'স্বাধীন ও অনানুষ্ঠানিক অ্যাপ'}</b><span>{en?'No official affiliation with the University of Dhaka.':'ঢাকা বিশ্ববিদ্যালয়ের সঙ্গে এই অ্যাপের কোনো অফিসিয়াল সম্পর্ক নেই।'}</span></div></div>
      <div className="pwa-gate-update">
        <RefreshCw/><div><small>{en?'Automatic updates':'অটো আপডেট'}</small><b>{en?'Enabled':'চালু'}</b><em>{en?'Latest app update':'সর্বশেষ অ্যাপ আপডেট'}: {lastTime}</em>{localStorage.getItem('du_pwa_installed_at')&&<em>{en?'Installed':'ইনস্টল হয়েছে'}: {installedAt}</em>}</div>
      </div>
      <div className="pwa-browser-locked-note"><Smartphone/><div><b>{en?'Continue in the installed app':'এখন ইনস্টল করা অ্যাপে প্রবেশ করুন'}</b><span>{en?'This browser page will not continue to the calculators. Open “Hisab Sahayika” from your Home Screen.':'এই ব্রাউজার পেজ থেকে আর সামনে যাওয়া যাবে না। Home Screen থেকে “হিসাব সহায়িকা” অ্যাপটি খুলুন।'}</span></div></div>
      <div className="pwa-gate-actions single">
        <button className="pwa-gate-primary home-open-info" onClick={()=>{}}><Home/><span>{en?'Home Screen → Hisab Sahayika → Open':'Home Screen → হিসাব সহায়িকা → খুলুন'}</span></button>
      </div>
    </div>
  </div>;

  return <div className="pwa-install-gate">
    <div className="pwa-gate-card">
      <div className="pwa-gate-top">
        <span className="pwa-gate-logo">হি</span>
        <div><b>Hisab Sahayika</b><small>{en?'Independent calculation assistant':'স্বাধীন হিসাব সহায়ক অ্যাপ'}</small></div>
      </div>
      <span className="pwa-gate-badge">{en?'INDEPENDENT CALCULATION APP':'স্বাধীন হিসাব সহায়ক অ্যাপ'}</span>
      <div className="pwa-install-count"><Users/><span>{installStats.total_installs==null?(en?'Loading install count…':'ইনস্টল সংখ্যা লোড হচ্ছে…'):(en?`Total installs: ${numLang(installStats.total_installs,'en',0)}`:`মোট ইনস্টল: ${numLang(installStats.total_installs,'bn',0)}`)}</span></div>
      <h1>{en?'Install Hisab Sahayika':'হিসাব সহায়িকা ইনস্টল করুন'}</h1>
      <p>{en?'A convenient independent app for viewing salary, arrears, promotion, points, housing and other supported calculations.':'বেতন, বকেয়া, পদোন্নতি, পয়েন্ট, বাসা, চাকরিকাল ও অন্যান্য সমর্থিত হিসাব জানা ও দেখার জন্য একটি স্বাধীন সহায়ক অ্যাপ।'}</p>

      <div className="pwa-gate-quick">
        <span><WalletCards/>{en?'Salary & arrears':'বেতন ও বকেয়া'}</span>
        <span><TrendingUp/>{en?'Promotion':'পদোন্নতি'}</span>
        <span><Award/>{en?'Points':'পয়েন্ট'}</span>
        <span><Home/>{en?'Housing':'বাসা'}</span>
      </div>

      <div className="pwa-gate-disclaimer"><ShieldAlert/><div><b>{en?'Not an official University of Dhaka app':'ঢাকা বিশ্ববিদ্যালয়ের অফিসিয়াল অ্যাপ নয়'}</b><span>{en?'This is an independent and unofficial calculation assistant. It is not operated, approved or published by the University of Dhaka.':'এটি একটি স্বাধীন ও অনানুষ্ঠানিক হিসাব সহায়ক অ্যাপ। ঢাকা বিশ্ববিদ্যালয় কর্তৃপক্ষ এটি পরিচালনা, অনুমোদন বা প্রকাশ করেনি।'}</span></div></div>

      {pwa.iosInstallHint||installResult==='ios'?<div className="pwa-gate-ios">
        <Share2/><div><b>{en?'Install on iPhone / iPad':'iPhone / iPad-এ ইনস্টল'}</b><span>{en?'Tap Share in Safari, then choose “Add to Home Screen”.':'Safari-তে Share চাপুন, তারপর “Add to Home Screen” নির্বাচন করুন।'}</span></div>
      </div>:null}

      {installResult==='waiting'&&<div className="pwa-gate-message">{en?'The install option is getting ready. Please wait a moment and tap again.':'ইনস্টল অপশন প্রস্তুত হচ্ছে। একটু অপেক্ষা করে আবার চাপুন।'}</div>}
      {installResult==='accepted'&&<div className="pwa-gate-message success">{en?'Installation started. Your phone will finish it automatically.':'ইনস্টল শুরু হয়েছে। এখন আপনার মোবাইল স্বয়ংক্রিয়ভাবে ইনস্টল সম্পন্ন করবে।'}</div>}
      {installResult==='dismissed'&&<div className="pwa-gate-message">{en?'Installation was cancelled. You can install whenever you are ready.':'ইনস্টল বাতিল হয়েছে। প্রস্তুত হলে আবার ইনস্টল করুন।'}</div>}

      <button className="pwa-gate-primary" onClick={install} disabled={installing}>
        {installing?<RefreshCw className="spin"/>:<Save/>}
        <span>{installing?(en?'Installing…':'ইনস্টল হচ্ছে…'):(pwa.iosInstallHint?(en?'Show install steps':'ইনস্টল করার নিয়ম দেখুন'):(pwa.canInstall?(en?'Install App':'অ্যাপ ইনস্টল করুন'):(en?'Prepare Install':'ইনস্টল প্রস্তুত করুন')))}</span>
      </button>
      <small className="pwa-gate-auto-note"><CheckCircle2/>{en?'After installation, future app updates will be applied automatically.':'একবার ইনস্টল হলে পরবর্তী অ্যাপ আপডেটগুলো স্বয়ংক্রিয়ভাবে হবে।'}</small>
      <div className="pwa-gate-browser-rule"><Smartphone/><span>{en?'On mobile, calculations are available through the installed app. Install the app to continue.':'মোবাইলে হিসাব ও সেবা ব্যবহার করতে অ্যাপটি ইনস্টল করতে হবে। ইনস্টল ছাড়া এই পেজ থেকে সামনে যাওয়া যাবে না।'}</span></div>
      <div className="pwa-gate-foot">{en?'Secure install through your browser · No Play Store needed':'ব্রাউজারের নিরাপদ ইনস্টল · Play Store লাগবে না'}</div>
    </div>
  </div>;
}

function PwaControls({lang='bn'}){
  const en=lang==='en';
  const [pwa,setPwa]=useState(()=>getPwaState());
  const [open,setOpen]=useState(false);
  const [nudge,setNudge]=useState(false);
  const [checkNote,setCheckNote]=useState('');
  const [updatedNotice,setUpdatedNotice]=useState(()=>getPwaState().justUpdatedAt||'');
  useEffect(()=>subscribePwa(next=>{setPwa(next);if(next.justUpdatedAt)setUpdatedNotice(next.justUpdatedAt)}),[]);
  useEffect(()=>{
    if((pwa.canInstall||pwa.iosInstallHint)&&!pwa.installed&&sessionStorage.getItem('du_pwa_install_nudge_dismissed')!=='1'){
      const t=setTimeout(()=>setNudge(true),1200);
      return()=>clearTimeout(t);
    }
    setNudge(false);
  },[pwa.canInstall,pwa.iosInstallHint,pwa.previouslyInstalled,pwa.installed]);
  const shownTime=pwa.lastAutoUpdateAt||pwa.build?.built_at||'';
  const timeText=formatPwaTime(shownTime,lang);
  const doInstall=async()=>{
    if(pwa.iosInstallHint){setOpen(true);setNudge(false);return}
    if(!pwa.canInstall){setOpen(true);setNudge(false);return}
    await promptPwaInstall();
    setNudge(false);
  };
  const dismiss=()=>{sessionStorage.setItem('du_pwa_install_nudge_dismissed','1');setNudge(false)};
  const check=async()=>{
    setCheckNote(en?'Checking...':'চেক হচ্ছে...');
    await manualPwaUpdateCheck();
    setCheckNote(en?'Update check complete':'আপডেট চেক সম্পন্ন');
    setTimeout(()=>setCheckNote(''),1800);
  };
  return <div className="pwa-controls">
    {(pwa.canInstall||pwa.iosInstallHint||pwa.previouslyInstalled)&&!pwa.installed&&<button className="pwa-install-button" onClick={doInstall} title={en?'Install app':'অ্যাপ ইনস্টল করুন'}><Save/><span>{en?'Install':'ইনস্টল'}</span></button>}
    <button className={`pwa-status-button ${pwa.updating?'updating':''}`} onClick={()=>setOpen(v=>!v)} title={en?'App update status':'অ্যাপ আপডেট অবস্থা'}><RefreshCw/><span><b>{pwa.offline?(en?'Offline':'অফলাইন'):(pwa.updating?(en?'Updating':'আপডেট হচ্ছে'):(en?'App':'অ্যাপ'))}</b><small>{timeText}</small></span></button>
    {open&&<div className="pwa-status-popover">
      <div className="pwa-status-head"><span>{pwa.updating?<RefreshCw/>:<CheckCircle2/>}</span><div><b>{en?'Hisab Sahayika':'হিসাব সহায়িকা'}</b><small>{en?'Independent · unofficial calculation app':'স্বাধীন · অনানুষ্ঠানিক হিসাব সহায়ক অ্যাপ'}</small></div></div>
      <div className="pwa-status-grid">
        <div><small>{en?'Automatic updates':'অটো আপডেট'}</small><b>{en?'Enabled — checked automatically':'চালু — স্বয়ংক্রিয়ভাবে চেক হবে'}</b></div>
        <div><small>{en?'Last update':'সর্বশেষ আপডেট'}</small><b>{timeText}</b></div>
        <div><small>{en?'Connection':'সংযোগ'}</small><b>{pwa.offline?(en?'Offline — cached app available':'অফলাইন — ক্যাশ করা অ্যাপ চলবে'):(en?'Online':'অনলাইন')}</b></div>
      </div>
      {pwa.iosInstallHint&&<div className="pwa-ios-help">{en?'On iPhone/iPad: tap Share, then “Add to Home Screen”. iOS does not allow silent installation.':'iPhone/iPad-এ Share চাপুন, তারপর “Add to Home Screen” নির্বাচন করুন। iOS নীরবে অটো ইনস্টল অনুমতি দেয় না।'}</div>}
      {!pwa.canInstall&&!pwa.iosInstallHint&&!pwa.installed&&pwa.previouslyInstalled&&<div className="pwa-ios-help">{en?'The app was installed before but is not currently open as an installed app. If the one-tap prompt is unavailable, open your browser menu and choose “Install app” or “Add to Home screen”, then reload this page if needed.':'অ্যাপটি আগে ইনস্টল ছিল, কিন্তু এখন ইনস্টল করা অ্যাপ হিসেবে খোলা নেই। এক-ট্যাপ Install না এলে browser-এর মেনু খুলে “Install app” বা “Add to Home screen” দিন; প্রয়োজন হলে পেজটি একবার reload করুন।'}</div>}
      {checkNote&&<div className="pwa-ios-help">{checkNote}</div>}
      <div className="pwa-status-actions">
        <button className="check" onClick={check}>{en?'Check update':'আপডেট চেক'}</button>
        {(pwa.canInstall||pwa.iosInstallHint||pwa.previouslyInstalled)&&!pwa.installed&&<button className="install" onClick={doInstall}>{en?'Install app':'অ্যাপ ইনস্টল'}</button>}
      </div>
    </div>}
    {pwa.updating&&<div className="pwa-update-toast"><RefreshCw/><span>{en?'New version found. Updating automatically…':'নতুন ভার্সন পাওয়া গেছে। অটো আপডেট হচ্ছে…'}</span></div>}
    {updatedNotice&&!pwa.updating&&<div className="pwa-update-toast pwa-update-complete"><CheckCircle2/><span><b>{en?'Automatic update complete':'অটো আপডেট সম্পন্ন'}</b><small>{formatPwaTime(updatedNotice,lang)}</small></span><button onClick={()=>{setUpdatedNotice('');consumePwaUpdateNotice()}} aria-label={en?'Close':'বন্ধ'}><X size={15}/></button></div>}
    {nudge&&<div className="pwa-install-nudge">
      <span className="app-mark">হি</span>
      <div><b>{en?'Install Hisab Sahayika':'হিসাব সহায়িকা ইনস্টল করুন'}</b><small>{pwa.iosInstallHint?(en?'Add it to your Home Screen for app-like use.':'Home Screen-এ যোগ করলে অ্যাপের মতো ব্যবহার করতে পারবেন।'):(!pwa.canInstall&&pwa.previouslyInstalled?(en?'Reinstall from your browser menu if the one-tap prompt is not available.':'এক-ট্যাপ Install না এলে browser menu থেকে আবার ইনস্টল করুন।'):(en?'One tap to install. Future updates will be automatic.':'এক ট্যাপে ইনস্টল করুন। পরের আপডেটগুলো অটো হবে।'))}</small></div>
      <button onClick={doInstall}>{en?'Install':'ইনস্টল'}</button>
      <button className="dismiss" onClick={dismiss} aria-label={en?'Dismiss':'বন্ধ'}><X size={15}/></button>
    </div>}
  </div>
}

function todayLocalIso(){const d=new Date();const y=d.getFullYear();const m=String(d.getMonth()+1).padStart(2,'0');const day=String(d.getDate()).padStart(2,'0');return `${y}-${m}-${day}`}
function fmtDateLang(d,lang='bn'){if(!d||isNaN(new Date(d)))return '—';return new Intl.DateTimeFormat(lang==='en'?'en-GB':'bn-BD-u-nu-latn',{day:'2-digit',month:'long',year:'numeric'}).format(new Date(d))}
function numLang(v,lang='bn',digits=2){return Number(v||0).toLocaleString(lang==='en'?'en-US':'bn-BD-u-nu-latn',{maximumFractionDigits:digits})}
function moneyLang(v,lang='bn'){return Math.round(Number(v||0)).toLocaleString(lang==='en'?'en-US':'bn-BD-u-nu-latn',{maximumFractionDigits:0})}


function escapeHtml(v){return String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[c]))}
let html2pdfLoader=null;
function loadHtml2Pdf(){
  if(window.html2pdf)return Promise.resolve(window.html2pdf);
  if(html2pdfLoader)return html2pdfLoader;
  html2pdfLoader=new Promise((resolve,reject)=>{
    const sc=document.createElement('script');
    sc.src='https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    sc.onload=()=>window.html2pdf?resolve(window.html2pdf):reject(new Error('PDF library load failed'));
    sc.onerror=()=>reject(new Error('PDF library load failed'));
    document.head.appendChild(sc);
  });
  return html2pdfLoader;
}
let html2canvasLoader=null,jsPdfLoader=null;
function loadHtml2Canvas(){
  if(window.html2canvas)return Promise.resolve(window.html2canvas);
  if(html2canvasLoader)return html2canvasLoader;
  html2canvasLoader=new Promise((resolve,reject)=>{
    const sc=document.createElement('script');
    sc.src='https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    sc.onload=()=>window.html2canvas?resolve(window.html2canvas):reject(new Error('Canvas library load failed'));
    sc.onerror=()=>reject(new Error('Canvas library load failed'));
    document.head.appendChild(sc);
  });
  return html2canvasLoader;
}
function loadJsPdf(){
  if(window.jspdf?.jsPDF)return Promise.resolve(window.jspdf.jsPDF);
  if(jsPdfLoader)return jsPdfLoader;
  jsPdfLoader=new Promise((resolve,reject)=>{
    const sc=document.createElement('script');
    sc.src='https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    sc.onload=()=>window.jspdf?.jsPDF?resolve(window.jspdf.jsPDF):reject(new Error('jsPDF library load failed'));
    sc.onerror=()=>reject(new Error('jsPDF library load failed'));
    document.head.appendChild(sc);
  });
  return jsPdfLoader;
}
const eduBn={masters:'মাস্টার্স',bachelor:'স্নাতক',hsc:'এইচএসসি',diploma:'ডিপ্লোমা',bsceng:'বিএসসি ইঞ্জিনিয়ারিং',mbbs:'এমবিবিএস'};
const categoryBn={officer:'কর্মকর্তা',class3:'তৃতীয় শ্রেণি',class4:'চতুর্থ শ্রেণি'};
const PDF_BRAND={website:'dhakau.pages.dev',developerBn:'মোঃ মশিউর রহমান',developerEn:'Md. Moshiur Rahman',phone:'01759084692'};
function pdfSafe(v){return escapeHtml(v==null?'—':String(v))}
function pdfMoneyCell(v){return `<span style="font-family:'Hind Siliguri','Noto Sans Bengali','Inter',sans-serif;font-variant-numeric:tabular-nums;font-weight:800;white-space:nowrap">${pdfSafe(v)}</span>`}
function pdfSummaryCards(items=[],columns=4){
  const cols=Math.max(2,Math.min(4,Number(columns)||4));
  const tones=[
    {border:'#cddfe8',bg:'linear-gradient(145deg,#ffffff,#eef6fb)',label:'#4d6575',value:'#123e59',bar:'#2a6b8c'},
    {border:'#cfe3d8',bg:'linear-gradient(145deg,#ffffff,#eef8f3)',label:'#4c685d',value:'#14583f',bar:'#21845f'},
    {border:'#e7dbb9',bg:'linear-gradient(145deg,#ffffff,#fff8e8)',label:'#716344',value:'#76591e',bar:'#c29c4b'},
    {border:'#d9e1e6',bg:'linear-gradient(145deg,#ffffff,#f2f6f8)',label:'#596b77',value:'#263f50',bar:'#718a98'}
  ];
  return `<div class="pdf-summary-grid" style="display:grid;grid-template-columns:repeat(${cols},minmax(0,1fr));gap:9px;margin:0 0 12px">${items.map((x,i)=>{
    const t=x.accent?{border:'#d8bd73',bg:'linear-gradient(145deg,#fff9e9,#edf8f3)',label:'#6f6038',value:'#6e531b',bar:'#b99039'}:tones[i%tones.length];
    return `
    <div class="pdf-summary-card" style="position:relative;border:1px solid ${t.border};border-radius:12px;padding:12px 12px 11px;background:${t.bg};min-height:62px;box-sizing:border-box;overflow:hidden;box-shadow:0 4px 12px rgba(18,48,65,.055)">
      <div style="position:absolute;left:0;top:0;bottom:0;width:3px;background:${t.bar}"></div>
      <div style="font-size:10.5px;color:${t.label};font-weight:700;line-height:1.34;overflow-wrap:anywhere">${pdfSafe(x.label)}</div>
      <div style="margin-top:5px;font-size:${x.accent?'18.8px':'16.6px'};color:${t.value};font-weight:700;line-height:1.2;font-family:'Hind Siliguri','Noto Sans Bengali','Inter',sans-serif;font-variant-numeric:tabular-nums;overflow-wrap:anywhere">${pdfSafe(x.value)}</div>
      ${x.note?`<div style="margin-top:4px;font-size:9px;color:#718079;line-height:1.34;overflow-wrap:anywhere">${pdfSafe(x.note)}</div>`:''}
    </div>`;
  }).join('')}</div>`;
}
function pdfTable(rows=[],opts={}){
  const head1=opts.head1||'বিষয়',head2=opts.head2||'বিবরণ/হার',head3=opts.head3||'অংক';
  const three=opts.three===true;
  const compact=opts.compact===true;
  const sizes=three?['42%','25%','33%']:['47%','53%'];
  return `<div class="pdf-table-wrap" style="width:100%;max-width:100%;border:1px solid #cfdde3;border-radius:12px;overflow:hidden;background:#fff;box-shadow:0 4px 12px rgba(18,48,65,.045)">
    <table class="pdf-table" style="width:100%;max-width:100%;border-collapse:collapse;table-layout:fixed;font-size:${compact?'11.2px':'12px'};line-height:1.44">
      <colgroup>
        <col style="width:${sizes[0]}">
        ${three?`<col style="width:${sizes[1]}"><col style="width:${sizes[2]}">`:`<col style="width:${sizes[1]}">`}
      </colgroup>
      <thead><tr style="background:linear-gradient(90deg,#0c3d60,#12566a 60%,#17664c);color:#fff">
        <th style="padding:9px 10px;text-align:left;font-weight:700;border-bottom:1px solid rgba(255,255,255,.14);box-sizing:border-box;white-space:normal;overflow-wrap:anywhere;word-break:normal">${pdfSafe(head1)}</th>
        ${three?`<th style="padding:9px 10px;text-align:center;font-weight:700;border-bottom:1px solid rgba(255,255,255,.14);box-sizing:border-box;white-space:normal;overflow-wrap:anywhere;word-break:normal">${pdfSafe(head2)}</th>`:''}
        <th style="padding:9px 10px;text-align:right;font-weight:700;border-bottom:1px solid rgba(255,255,255,.14);box-sizing:border-box;white-space:normal;overflow-wrap:anywhere;word-break:normal">${pdfSafe(head3)}</th>
      </tr></thead>
      <tbody>${rows.map((r,i)=>{
        const bg=i%2===0?'#fffdf9':'#f1f7f9';
        const emphasis=r.emphasis===true;
        return `<tr style="background:${emphasis?'linear-gradient(90deg,#eaf7f1,#fff8e9)':bg}">
          <td style="padding:${compact?'6.4px 8px':'7.3px 9px'};border-bottom:1px solid #e1e8eb;color:${emphasis?'#154b38':'#3e5665'};font-weight:${emphasis?700:600};box-sizing:border-box;white-space:normal;overflow-wrap:anywhere;word-break:normal;vertical-align:middle">${pdfSafe(r.label)}</td>
          ${three?`<td style="padding:${compact?'6.4px 8px':'7.3px 9px'};border-bottom:1px solid #e1e8eb;text-align:center;color:#61736d;box-sizing:border-box;white-space:normal;overflow-wrap:anywhere;word-break:normal;vertical-align:middle">${pdfSafe(r.detail||'—')}</td>`:''}
          <td style="padding:${compact?'6.4px 8px':'7.3px 9px'};border-bottom:1px solid #e1e8eb;text-align:right;color:${emphasis?'#0f603e':'#172f3f'};font-weight:700;font-family:'Hind Siliguri','Noto Sans Bengali','Inter',sans-serif;font-variant-numeric:tabular-nums;box-sizing:border-box;white-space:normal;overflow-wrap:anywhere;word-break:normal;vertical-align:middle">${pdfSafe(r.value)}</td>
        </tr>`;
      }).join('')}</tbody>
    </table>
  </div>`;
}
function reportShell(title,subtitle,body,lang='bn',meta={}){
  const en=lang==='en';
  const pageNo=Number(meta.pageNo||1),totalPages=Number(meta.totalPages||1);
  const fixed=meta.fixedPage===true,breakAfter=meta.breakAfter===true;
  const pageMinHeight=fixed?'285mm':'270mm';
  const now=new Date();
  const generated=now.toLocaleString(en?'en-GB':'bn-BD-u-nu-latn');
  const reportId=`EDS-${String(now.getFullYear()).slice(-2)}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}-${String(now.getHours()).padStart(2,'0')}${String(now.getMinutes()).padStart(2,'0')}`;
  return `<div class="pdf-page premium-pdf-page" data-pdf-page="${pageNo}" data-break-after="${breakAfter?'true':'false'}" style="width:194mm;min-height:${pageMinHeight};box-sizing:border-box;font-family:'Hind Siliguri','Noto Sans Bengali','Inter',Arial,sans-serif;color:#162433;background:#f6f8f7;line-height:1.5;font-size:12.2px;${breakAfter?'page-break-after:always;break-after:page;':''}">
    <style>
      .premium-pdf-page,.premium-pdf-page *{box-sizing:border-box}
      .premium-pdf-page{overflow:visible!important}
      .premium-pdf-page table{width:100%!important;max-width:100%!important;min-width:0!important;table-layout:fixed!important}
      .premium-pdf-page th,.premium-pdf-page td{max-width:100%;white-space:normal!important;overflow-wrap:anywhere!important;word-break:normal!important}
      .premium-pdf-page b,.premium-pdf-page span,.premium-pdf-page div{overflow-wrap:anywhere;word-break:normal}
      .premium-pdf-page .pdf-table-wrap{width:100%!important;max-width:100%!important;min-width:0!important;overflow:hidden!important;break-inside:avoid;page-break-inside:avoid}
      .premium-pdf-page .pdf-summary-grid,.premium-pdf-page .pdf-body,.premium-pdf-page .pdf-section{width:100%!important;max-width:100%!important;min-width:0!important}
      .premium-pdf-page .pdf-summary-card{min-width:0!important;break-inside:avoid;page-break-inside:avoid}
    </style>
    <div class="pdf-frame" style="min-height:${pageMinHeight};height:auto;box-sizing:border-box;border:1px solid #bdcdd4;border-radius:14px;overflow:hidden;background:linear-gradient(180deg,#ffffff 0%,#ffffff 82%,#f7faf8 100%);display:flex;flex-direction:column;box-shadow:0 0 0 1px #eef3f1 inset,0 8px 24px rgba(16,47,63,.06)">
      <div style="height:5px;background:linear-gradient(90deg,#b98f38,#e4cc85 28%,#1e835e 62%,#0d4a70)"></div>
      <div style="position:relative;background:linear-gradient(118deg,#082d50 0%,#0e4f68 58%,#176247 100%);color:#fff;padding:15px 18px 14px;display:flex;align-items:center;justify-content:space-between;gap:16px;overflow:hidden">
        <div style="position:absolute;right:-28px;top:-42px;width:150px;height:150px;border-radius:50%;background:rgba(217,190,116,.08)"></div>
        <div style="display:flex;align-items:center;gap:12px;min-width:0;position:relative;z-index:1">
          <div style="width:41px;height:41px;border-radius:11px;background:linear-gradient(145deg,#fff,#edf5f2);color:#0c4a67;display:grid;place-items:center;font-family:'Inter',Arial,sans-serif;font-size:10px;font-weight:900;letter-spacing:.5px;flex:0 0 auto;box-shadow:0 5px 16px rgba(0,0,0,.18);border:1px solid rgba(255,255,255,.7)">EDS</div>
          <div style="min-width:0">
            <div style="font-size:10.2px;font-weight:700;opacity:.92;letter-spacing:.1px">${en?'Hisab Sahayika':'হিসাব সহায়িকা'}</div>
            <div style="font-size:20.8px;font-weight:700;margin-top:2px;line-height:1.22;letter-spacing:-.1px">${pdfSafe(title)}</div>
            <div style="font-size:10.4px;opacity:.9;margin-top:4px;line-height:1.38">${pdfSafe(subtitle)}</div>
          </div>
        </div>
        <div style="position:relative;z-index:1;text-align:right;white-space:nowrap;border:1px solid rgba(255,255,255,.25);border-radius:10px;padding:7px 10px;background:linear-gradient(180deg,rgba(255,255,255,.12),rgba(255,255,255,.06));box-shadow:inset 0 1px 0 rgba(255,255,255,.12)">
          <div style="font-family:'Inter',Arial,sans-serif;font-size:9.8px;font-weight:900;letter-spacing:.6px">A4 REPORT</div>
          <div style="font-family:'Inter',Arial,sans-serif;font-size:8.9px;opacity:.86;margin-top:2px">${PDF_BRAND.website}</div>
        </div>
      </div>
      <div style="padding:7px 18px;background:linear-gradient(90deg,#fff8e9,#f0f8f4,#eef6fb);border-bottom:1px solid #dce6e5;display:flex;justify-content:space-between;gap:12px;color:#5d6d66;font-size:9px">
        <span><b style="color:#775d25">${en?'Report ID':'রিপোর্ট আইডি'}:</b> <span style="font-family:'Inter',Arial,sans-serif">${reportId}</span></span>
        <span><b style="color:#35614f">${en?'Generated':'তৈরি'}:</b> ${generated}</span>
      </div>
      <div class="pdf-body" style="flex:1;min-width:0;padding:12px 15px 10px;box-sizing:border-box;overflow:visible;background:linear-gradient(180deg,#ffffff,#fbfdfc)">${body}</div>
      <div class="pdf-footer" style="border-top:1px solid #d5e0e4;background:linear-gradient(90deg,#eef5f8,#f1f8f4,#fff9ed);padding:7px 16px 8px;color:#566975;font-size:8.8px;line-height:1.42">
        <div style="margin-bottom:5px;color:#61726b">${en?'Independent/unofficial digital service report. Verify applicable rules/orders before any final administrative or financial decision.':'স্বাধীন ও অনানুষ্ঠানিক ডিজিটাল সেবা প্রতিবেদন। চূড়ান্ত প্রশাসনিক/আর্থিক সিদ্ধান্তের আগে প্রযোজ্য বিধি/আদেশ যাচাই করুন।'}</div>
        <div style="display:grid;grid-template-columns:1fr 1.2fr auto;gap:10px;align-items:center;border-top:1px dashed #c6d4d8;padding-top:5px">
          <span><b style="font-family:'Inter','Hind Siliguri',sans-serif;color:#24465d">${PDF_BRAND.website}</b></span>
          <span style="text-align:center"><b>${en?'Design & Development':'ডিজাইন ও ডেভেলপমেন্ট'}:</b> ${en?PDF_BRAND.developerEn:PDF_BRAND.developerBn} · <span style="font-family:'Inter',Arial,sans-serif">${PDF_BRAND.phone}</span></span>
          <span style="font-family:'Inter','Hind Siliguri',sans-serif;font-weight:900;color:#23465c;background:#fff;border:1px solid #d1dde1;border-radius:7px;padding:3px 6px">${en?'Page':'পৃষ্ঠা'} ${pageNo} / ${totalPages}</span>
        </div>
      </div>
    </div>
  </div>`;
}
function kv(label,value,opts={}){
  const emphasis=opts.emphasis===true;
  return `<div style="display:grid;grid-template-columns:minmax(0,45%) minmax(0,55%);gap:10px;padding:8px 8px;border-bottom:1px solid #e0e8eb;align-items:center;min-width:0;background:${emphasis?'linear-gradient(90deg,#eaf7f1,#fff8e9)':'transparent'}">
    <span style="min-width:0;color:${emphasis?'#174a36':'#4d606c'};font-size:11.6px;font-weight:${emphasis?700:600};line-height:1.42;white-space:normal;overflow-wrap:anywhere">${pdfSafe(label)}</span>
    <b style="min-width:0;text-align:right;color:${emphasis?'#0d603a':'#172b3b'};font-size:${emphasis?'13.3px':'12.1px'};font-family:'Hind Siliguri','Noto Sans Bengali','Inter',sans-serif;font-variant-numeric:tabular-nums;line-height:1.4;white-space:normal;overflow-wrap:anywhere">${pdfSafe(value)}</b>
  </div>`;
}
function section(title,content,opts={}){
  return `<div class="pdf-section" style="margin:${opts.tight?'9px':'11px'} 0 0;page-break-inside:avoid;break-inside:avoid">
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
      <span style="width:5px;height:19px;border-radius:4px;background:linear-gradient(180deg,#c5a04a,#176c4c);box-shadow:0 2px 5px rgba(25,78,61,.12)"></span>
      <div style="font-size:14.8px;font-weight:700;color:#123d58;line-height:1.28">${pdfSafe(title)}</div>
    </div>
    <div style="border:1px solid #d4e1e6;border-radius:11px;padding:${opts.table?'0':'9px 12px'};background:linear-gradient(145deg,#ffffff,#f8fbfa);box-shadow:0 4px 12px rgba(17,48,65,.035)">${content}</div>
  </div>`;
}
async function buildA4Pdf(element,{coverText='PDF তৈরি হচ্ছে...'}={}){
  if(!element)throw new Error('PDF preview is not available');
  const [html2canvas,JsPDF]=await Promise.all([loadHtml2Canvas(),loadJsPdf()]);
  await document.fonts?.ready?.catch?.(()=>{});

  const cover=document.createElement('div');
  cover.style.cssText='position:fixed;inset:0;z-index:2147483647;background:rgba(12,24,39,.96);color:#fff;display:grid;place-items:center;font-family:"Hind Siliguri","Inter",sans-serif;font-size:16px;font-weight:700';
  cover.innerHTML=`<div style="padding:16px 22px;border:1px solid rgba(255,255,255,.2);border-radius:14px;background:rgba(255,255,255,.06)">${escapeHtml(coverText)}</div>`;

  const stage=document.createElement('div');
  stage.setAttribute('data-pdf-stage','true');
  stage.style.cssText='position:fixed;left:0;top:0;width:194mm;background:#fff;z-index:2147483646;pointer-events:none;overflow:visible;opacity:1;visibility:visible';
  stage.innerHTML=element.innerHTML;

  document.body.appendChild(stage);
  document.body.appendChild(cover);
  try{
    await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
    const pages=[...stage.querySelectorAll('.pdf-page')];
    if(!pages.length)throw new Error('No PDF pages were generated');

    const pdf=new JsPDF({orientation:'portrait',unit:'mm',format:'a4',compress:true});
    for(let i=0;i<pages.length;i++){
      const page=pages[i];
      page.style.display='block';
      page.style.position='relative';
      page.style.width='194mm';
      page.style.height='auto';
      page.style.minHeight='285mm';
      page.style.maxHeight='none';
      page.style.overflow='visible';
      page.style.background='#fff';
      page.style.margin='0';

      const frame=page.querySelector('.pdf-frame');
      if(frame){
        frame.style.height='auto';
        frame.style.minHeight='285mm';
        frame.style.overflow='hidden';
      }
      const body=page.querySelector('.pdf-body');
      if(body){body.style.overflow='visible';body.style.width='100%';body.style.maxWidth='100%';body.style.minWidth='0';}
      page.querySelectorAll('table').forEach(t=>{
        t.style.width='100%';
        t.style.maxWidth='100%';
        t.style.minWidth='0';
        t.style.tableLayout='fixed';
      });
      page.querySelectorAll('.pdf-table-wrap,.pdf-section,.pdf-summary-grid').forEach(el=>{
        el.style.width='100%';
        el.style.maxWidth='100%';
        el.style.minWidth='0';
      });

      await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
      const canvas=await html2canvas(page,{
        scale:2.7,useCORS:true,allowTaint:false,backgroundColor:'#ffffff',logging:false,
        scrollX:0,scrollY:0,
        windowWidth:Math.max(page.scrollWidth,734),
        windowHeight:Math.max(page.scrollHeight,1078)
      });
      if(!canvas.width||!canvas.height)throw new Error('PDF page capture failed');
      if(i>0)pdf.addPage('a4','portrait');

      const maxW=194,maxH=285;
      let drawW=maxW;
      let drawH=drawW*(canvas.height/canvas.width);
      if(drawH>maxH){
        drawH=maxH;
        drawW=drawH*(canvas.width/canvas.height);
      }
      const x=(210-drawW)/2;
      const y=(297-drawH)/2;
      const img=canvas.toDataURL('image/jpeg',0.99);
      pdf.addImage(img,'JPEG',x,y,drawW,drawH,undefined,'MEDIUM');
    }
    return pdf;
  }finally{
    cover.remove();
    stage.remove();
  }
}
async function saveA4Pdf(element,filename){
  const pdf=await buildA4Pdf(element);
  pdf.save(filename);
}
async function a4PdfFileFromHtml(html,filename,lang='bn'){
  const source=document.createElement('div');
  source.style.cssText='width:194mm;background:#fff';
  source.innerHTML=html;
  const pdf=await buildA4Pdf(source,{coverText:lang==='en'?'Preparing PDF for sharing...':'শেয়ারের জন্য PDF তৈরি হচ্ছে...'});
  const blob=pdf.output('blob');
  try{return new File([blob],filename,{type:'application/pdf',lastModified:Date.now()})}
  catch{return blob}
}
async function downloadA4Html(html,filename){
  const source=document.createElement('div');
  source.style.cssText='width:194mm;background:#fff';
  source.innerHTML=html;
  await saveA4Pdf(source,filename);
}
function sanitizeSharedReportHtml(html){
  const doc=new DOMParser().parseFromString(String(html||''),'text/html');
  doc.querySelectorAll('script,iframe,object,embed,link,meta').forEach(x=>x.remove());
  doc.body.querySelectorAll('*').forEach(el=>{
    [...el.attributes].forEach(a=>{
      if(/^on/i.test(a.name))el.removeAttribute(a.name);
      if((a.name==='href'||a.name==='src')&&/^\s*javascript:/i.test(a.value))el.removeAttribute(a.name);
    });
  });
  return doc.body.innerHTML;
}
async function copyToClipboard(text){
  if(navigator.clipboard?.writeText)return navigator.clipboard.writeText(text);
  const t=document.createElement('textarea');t.value=text;t.style.cssText='position:fixed;left:-9999px;top:0';document.body.appendChild(t);t.select();document.execCommand('copy');t.remove();
}
async function createReportShareLink({html,filename,title,summary='',lang='bn'}){
  const x=await api('/api/public/report-share',{method:'POST',body:JSON.stringify({html,title,filename,summary,lang})});
  const url=new URL(window.location.href);url.search='';url.hash='';url.searchParams.set('shared_report',x.token);
  return url.toString();
}
async function nativeShareReport({html,filename,title,summary='',url='',lang='bn'}){
  if(!navigator.share)throw new Error(lang==='en'?'Native sharing is not supported on this browser.':'এই ব্রাউজারে সরাসরি শেয়ার সুবিধা নেই।');
  let file=null;
  try{file=await a4PdfFileFromHtml(html,filename,lang)}catch{}
  const data={title,text:summary||title,url};
  if(file instanceof File&&navigator.canShare?.({files:[file]}))data.files=[file];
  await navigator.share(data);
}

function ReportShareActions({html,filename,title,summary='',lang='bn',existingUrl='',compact=false}){
  const en=lang==='en';
  const [busy,setBusy]=useState(''),[shareUrl,setShareUrl]=useState(existingUrl||''),[copied,setCopied]=useState(false);
  const shareTitle=title||(en?'Hisab Sahayika Report':'হিসাব সহায়িকা রিপোর্ট');
  const shareSummary=summary||(en?'View this calculation report from Hisab Sahayika.':'হিসাব সহায়িকার এই হিসাবের রিপোর্টটি দেখুন।');

  async function ensureUrl(){
    if(existingUrl)return existingUrl;
    if(shareUrl)return shareUrl;
    const url=await createReportShareLink({html,filename,title:shareTitle,summary:shareSummary,lang});
    setShareUrl(url);
    return url;
  }
  async function copyLink(){
    try{setBusy('copy');const url=await ensureUrl();await copyToClipboard(url);setCopied(true);setTimeout(()=>setCopied(false),1800);trackPublic('share','report_copy_link')}
    catch(e){alert((en?'Could not copy link: ':'লিংক কপি করা যায়নি: ')+e.message)}
    finally{setBusy('')}
  }
  async function whatsapp(){
    try{setBusy('whatsapp');const url=await ensureUrl();const text=`${shareTitle}\n${shareSummary}\n${url}`;window.open('https://wa.me/?text='+encodeURIComponent(text),'_blank','noopener,noreferrer');trackPublic('share','report_whatsapp')}
    catch(e){alert((en?'Could not prepare WhatsApp share: ':'হোয়াটসঅ্যাপ শেয়ার প্রস্তুত করা যায়নি: ')+e.message)}
    finally{setBusy('')}
  }
  async function messenger(){
    try{
      setBusy('messenger');const url=await ensureUrl();
      if(navigator.share&&/Android|iPhone|iPad|Mobile/i.test(navigator.userAgent)){
        await navigator.share({title:shareTitle,text:shareSummary,url});
      }else{
        await copyToClipboard(url);
        window.open('https://www.messenger.com/','_blank','noopener,noreferrer');
      }
      trackPublic('share','report_messenger');
    }catch(e){if(e?.name!=='AbortError')alert((en?'Could not open Messenger share: ':'মেসেঞ্জার শেয়ার খোলা যায়নি: ')+e.message)}
    finally{setBusy('')}
  }
  async function moreShare(){
    try{
      setBusy('more');const url=await ensureUrl();
      if(navigator.share)await navigator.share({title:shareTitle,text:shareSummary,url});
      else{await copyToClipboard(url);setCopied(true);setTimeout(()=>setCopied(false),1800)}
      trackPublic('share','report_native');
    }catch(e){if(e?.name!=='AbortError')alert((en?'Sharing is not available: ':'শেয়ার করা যাচ্ছে না: ')+e.message)}
    finally{setBusy('')}
  }
  async function sharePdfFile(){
    try{
      setBusy('pdf');
      if(!navigator.share)throw new Error(en?'PDF file sharing is available on supported mobile browsers.':'PDF ফাইল শেয়ার সমর্থিত মোবাইল ব্রাউজারে পাওয়া যায়।');
      const url=await ensureUrl();
      const file=await a4PdfFileFromHtml(html,filename,lang);
      if(!(file instanceof File)||!navigator.canShare?.({files:[file]}))throw new Error(en?'This browser cannot share PDF files directly.':'এই ব্রাউজার সরাসরি PDF ফাইল শেয়ার করতে পারে না।');
      await navigator.share({title:shareTitle,text:`${shareSummary}\n${url}`,files:[file]});
      trackPublic('share','report_pdf_file');
    }catch(e){
      if(e?.name!=='AbortError'){
        try{const url=await ensureUrl();await copyToClipboard(url)}catch{}
        alert((en?'Direct PDF file sharing is not available here. The report link has been copied instead.':'এখানে সরাসরি PDF ফাইল শেয়ার সম্ভব নয়। বিকল্প হিসেবে রিপোর্টের লিংক কপি করা হয়েছে।'));
      }
    }finally{setBusy('')}
  }
  return <div className={`report-share-actions ${compact?'compact':''}`}>
    <button className="share-whatsapp" disabled={!!busy} onClick={whatsapp}><MessageCircle/>{busy==='whatsapp'?(en?'Preparing...':'প্রস্তুত হচ্ছে'):'WhatsApp'}</button>
    <button className="share-messenger" disabled={!!busy} onClick={messenger}><Send/>{en?'Messenger':'Messenger'}</button>
    <button disabled={!!busy} onClick={copyLink}><Copy/>{copied?(en?'Copied':'কপি হয়েছে'):(en?'Copy Link':'লিংক কপি')}</button>
    <button disabled={!!busy} onClick={moreShare}><Share2/>{en?'All Apps':'সব অ্যাপ'}</button>
    <button className="share-pdf-file" disabled={!!busy} onClick={sharePdfFile}><FileText/>{en?'Share PDF':'PDF শেয়ার'}</button>
  </div>
}

const PDF_CENTER_KEY='hisab_pdf_center_v1';
function readPdfCenter(){
  try{
    const rows=JSON.parse(localStorage.getItem(PDF_CENTER_KEY)||'[]');
    return Array.isArray(rows)?rows.filter(x=>x&&x.html&&x.title).slice(0,16):[];
  }catch{return []}
}
function pdfReportFingerprint(value=''){
  let h=2166136261;
  const s=String(value||'');
  for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}
  return (h>>>0).toString(36);
}
function rememberPdfReport({html,filename,title,summary=''}) {
  if(!html||!title)return;
  try{
    const now=new Date().toISOString();
    const id=`${String(title)}::${pdfReportFingerprint(html)}`;
    const item={id,title:String(title),summary:String(summary||''),filename:String(filename||'report.pdf'),html:String(html),updated_at:now};
    const rows=readPdfCenter().filter(x=>x.id!==item.id);
    localStorage.setItem(PDF_CENTER_KEY,JSON.stringify([item,...rows].slice(0,16)));
    window.dispatchEvent(new CustomEvent('hisab-pdf-center-updated'));
  }catch{}
}
function PdfCenter({lang='bn'}){
  const en=lang==='en';
  const [items,setItems]=useState(()=>readPdfCenter());
  const [preview,setPreview]=useState(null);
  useEffect(()=>{
    const refresh=()=>setItems(readPdfCenter());
    window.addEventListener('hisab-pdf-center-updated',refresh);
    window.addEventListener('storage',refresh);
    return()=>{window.removeEventListener('hisab-pdf-center-updated',refresh);window.removeEventListener('storage',refresh)};
  },[]);
  const remove=id=>{
    const next=readPdfCenter().filter(x=>x.id!==id);
    try{localStorage.setItem(PDF_CENTER_KEY,JSON.stringify(next))}catch{}
    setItems(next);
  };
  const clearAll=()=>{
    if(!confirm(en?'Clear all reports saved in PDF Center on this device?':'এই ডিভাইসের PDF Center-এ রাখা সব রিপোর্ট মুছবেন?'))return;
    try{localStorage.removeItem(PDF_CENTER_KEY)}catch{}
    setItems([]);
  };
  return <div className="pdf-center">
    <section className="pdf-center-hero">
      <div><small>{en?'LOCAL REPORT LIBRARY':'LOCAL রিপোর্ট লাইব্রেরি'}</small><h2>{en?'PDF Center':'PDF সেন্টার'}</h2><p>{en?'Salary, arrear, promotion, house and other report previews you create are kept together on this device.':'বেতন, বকেয়া, পদোন্নতি, বাসা ও অন্যান্য যে রিপোর্ট প্রিভিউ করবেন—সব এই ডিভাইসে এক জায়গায় থাকবে।'}</p></div>
      <div className="pdf-center-badge"><FileText/><b>{numLang(items.length,lang,0)}</b><span>{en?'reports':'রিপোর্ট'}</span></div>
    </section>
    {items.length?<div className="pdf-center-grid">{items.map(item=><article key={item.id} className="pdf-center-card">
      <div className="pdf-center-icon"><FileText/></div>
      <div className="pdf-center-copy"><small>{item.updated_at?new Intl.DateTimeFormat(en?'en-GB':'bn-BD',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}).format(new Date(item.updated_at)):''}</small><h3>{item.title}</h3>{item.summary&&<p>{item.summary}</p>}</div>
      <div className="pdf-center-actions">
        <button className="primary" onClick={()=>setPreview(item)}><Eye/>{en?'Preview':'প্রিভিউ'}</button>
        <button onClick={()=>remove(item.id)} aria-label={en?'Remove report':'রিপোর্ট সরান'}><Trash2/></button>
      </div>
    </article>)}</div>:<div className="pdf-center-empty"><FileText/><h3>{en?'No saved report yet':'এখনও কোনো রিপোর্ট নেই'}</h3><p>{en?'Open any PDF preview from Salary, Arrear, Promotion or House; it will appear here automatically.':'বেতন, বকেয়া, পদোন্নতি বা বাসা থেকে যেকোনো PDF প্রিভিউ খুলুন—এখানে অটো যোগ হবে।'}</p></div>}
    {items.length>0&&<div className="pdf-center-footer"><span><ShieldCheck/>{en?'Stored only on this device unless you explicitly share it.':'আপনি নিজে শেয়ার না করা পর্যন্ত রিপোর্ট শুধু এই ডিভাইসেই থাকবে।'}</span><button onClick={clearAll}><Trash2/>{en?'Clear all':'সব মুছুন'}</button></div>}
    {preview&&<PdfPreviewModal html={preview.html} filename={preview.filename} onClose={()=>setPreview(null)} lang={lang} shareTitle={preview.title} shareSummary={preview.summary||''}/>}
  </div>;
}

function PdfPreviewModal({html,filename,onClose,lang='bn',shareTitle='',shareSummary=''}) {
  const reportRef=useRef(null),viewportRef=useRef(null),paperRef=useRef(null);
  const[busy,setBusy]=useState(false),[fit,setFit]=useState({scale:1,width:0,height:0}); const en=lang==='en';
  const title=shareTitle||(en?'Calculation Report':'হিসাবের রিপোর্ট');
  async function download(){try{setBusy(true);await downloadA4Html(html,filename);trackPublic('download','report_pdf')}catch(e){alert((en?'PDF could not be created: ':'PDF তৈরি করা যায়নি: ')+e.message)}finally{setBusy(false)}}
  useEffect(()=>{rememberPdfReport({html,filename,title,summary:shareSummary})},[html,filename,title,shareSummary]);
  useEffect(()=>{const onKey=e=>{if(e.key==='Escape')onClose?.()};document.addEventListener('keydown',onKey);const prev=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{document.removeEventListener('keydown',onKey);document.body.style.overflow=prev}},[onClose]);
  useEffect(()=>{
    const update=()=>{
      const paper=paperRef.current,viewport=viewportRef.current;
      if(!paper||!viewport)return;
      const mobile=window.matchMedia?.('(max-width: 760px)').matches;
      const naturalWidth=paper.scrollWidth||paper.getBoundingClientRect().width||1;
      const naturalHeight=paper.scrollHeight||paper.getBoundingClientRect().height||1;
      const available=Math.max(240,viewport.clientWidth-8);
      const scale=mobile?Math.min(1,available/naturalWidth):1;
      setFit({scale,width:naturalWidth*scale,height:naturalHeight*scale});
    };
    const id=requestAnimationFrame(()=>requestAnimationFrame(update));
    const ro=typeof ResizeObserver!=='undefined'?new ResizeObserver(update):null;
    if(paperRef.current)ro?.observe(paperRef.current);
    window.addEventListener('resize',update);
    return()=>{cancelAnimationFrame(id);ro?.disconnect();window.removeEventListener('resize',update)};
  },[html]);
  return <div className="pdf-preview-modal">
    <div className="pdf-preview-topbar">
      <div><b>{en?'A4 PDF Preview':'A4 PDF প্রিভিউ'}</b><div>{en?'Check, download or share this report.':'রিপোর্ট যাচাই করুন, ডাউনলোড বা শেয়ার করুন।'}</div></div>
      <div className="pdf-preview-top-actions">
        <button className="pdf-close-btn" onClick={onClose}>{en?'Close':'বন্ধ করুন'}</button>
        <button className="pdf-download-btn" onClick={download} disabled={busy}><Save/>{busy?(en?'Creating...':'তৈরি হচ্ছে'):(en?'Download PDF':'PDF ডাউনলোড')}</button>
      </div>
    </div>
    <div className="pdf-preview-sharebar"><ReportShareActions html={html} filename={filename} title={title} summary={shareSummary} lang={lang}/></div>
    <div className="pdf-preview-scroll" ref={viewportRef}>
      <div className="pdf-preview-fit-shell" style={fit.scale<1?{width:fit.width,height:fit.height}:undefined}>
        <div ref={paperRef} className="pdf-preview-paper" style={fit.scale<1?{transform:`scale(${fit.scale})`,transformOrigin:'top left'}:undefined}>
          <div ref={reportRef} style={{background:'#fff',width:'100%',maxWidth:'100%',overflowX:'hidden'}} dangerouslySetInnerHTML={{__html:html}}/>
        </div>
      </div>
    </div>
  </div>
}

function SharedReportViewer({token,lang='bn',setLang}){
  const en=lang==='en';
  const [state,setState]=useState({loading:true,report:null,error:''});
  const viewportRef=useRef(null),paperRef=useRef(null);
  const [fit,setFit]=useState({scale:1,width:0,height:0});
  useEffect(()=>{
    let alive=true;
    api('/api/public/report-share/'+encodeURIComponent(token)).then(x=>{
      if(!alive)return;
      const r=x.report||{};
      r.report_html=sanitizeSharedReportHtml(r.report_html||'');
      if(!r.report_html)throw new Error(en?'This shared report is invalid.':'শেয়ার করা রিপোর্টটি সঠিক নয়।');
      setState({loading:false,report:r,error:''});
    }).catch(e=>alive&&setState({loading:false,report:null,error:e.message||String(e)}));
    return()=>{alive=false};
  },[token]);
  useEffect(()=>{
    const report=state.report;
    if(!report?.report_html)return;
    rememberPdfReport({
      html:report.report_html,
      filename:report.filename||'shared-report.pdf',
      title:report.title||(en?'Shared Report':'শেয়ার করা রিপোর্ট'),
      summary:report.summary||''
    });
    const update=()=>{
      const paper=paperRef.current,viewport=viewportRef.current;
      if(!paper||!viewport)return;
      const mobile=window.matchMedia?.('(max-width: 760px)').matches;
      const naturalWidth=paper.scrollWidth||paper.getBoundingClientRect().width||1;
      const naturalHeight=paper.scrollHeight||paper.getBoundingClientRect().height||1;
      const available=Math.max(240,viewport.clientWidth-8);
      const scale=mobile?Math.min(1,available/naturalWidth):1;
      setFit({scale,width:naturalWidth*scale,height:naturalHeight*scale});
    };
    const frame=requestAnimationFrame(()=>requestAnimationFrame(update));
    const ro=typeof ResizeObserver!=='undefined'?new ResizeObserver(update):null;
    if(paperRef.current)ro?.observe(paperRef.current);
    window.addEventListener('resize',update);
    return()=>{cancelAnimationFrame(frame);ro?.disconnect();window.removeEventListener('resize',update)};
  },[state.report,en]);
  if(state.loading)return <div className="shared-report-loading">{en?'Loading shared report...':'শেয়ার করা রিপোর্ট লোড হচ্ছে...'}</div>;
  if(state.error||!state.report)return <div className="shared-report-error"><AlertTriangle/><h2>{en?'Report unavailable':'রিপোর্ট পাওয়া যাচ্ছে না'}</h2><p>{state.error|| (en?'The link may have expired.':'লিংকের মেয়াদ শেষ হয়ে থাকতে পারে।')}</p><a href="/">{en?'Go to Home':'হোমে যান'}</a></div>;
  const r=state.report;
  const currentUrl=window.location.href;
  return <div className="shared-report-page">
    <header className="shared-report-header">
      <a className="shared-report-brand" href="/"><Calculator/><div><b>{en?'Hisab Sahayika':'হিসাব সহায়িকা'}</b><small>{en?'Independent shared calculation report':'স্বাধীন হিসাব সহায়ক শেয়ার রিপোর্ট'}</small></div></a>
      <div className="shared-report-header-actions"><LangToggle lang={lang} setLang={setLang}/><a href="/">{en?'Home':'হোম'}</a></div>
    </header>
    <main className="shared-report-main">
      <div className="shared-report-title"><span>{en?'SHARED REPORT':'শেয়ার করা রিপোর্ট'}</span><h1>{r.title}</h1>{r.summary&&<p>{r.summary}</p>}<small>{en?'Link valid until':'লিংক কার্যকর'}: {fmtDateLang(r.expires_at,lang)}</small></div>
      <div className="shared-report-actions">
        <button className="primary" onClick={()=>downloadA4Html(r.report_html,r.filename)}><Save/>{en?'Download PDF':'PDF ডাউনলোড'}</button>
        <ReportShareActions html={r.report_html} filename={r.filename} title={r.title} summary={r.summary||''} lang={lang} existingUrl={currentUrl} compact={true}/>
      </div>
      <div className="shared-report-preview-scroll" ref={viewportRef}>
        <div className="shared-report-fit-shell" style={fit.scale<1?{width:fit.width,height:fit.height}:undefined}>
          <div ref={paperRef} className="shared-report-paper" style={fit.scale<1?{transform:`scale(${fit.scale})`,transformOrigin:'top left'}:undefined} dangerouslySetInnerHTML={{__html:r.report_html}}/>
        </div>
      </div>
    </main>
  </div>
}
function promotionReportHtml(r,lang='bn'){
  const en=lang==='en',f=r.input||{};
  const edu=en?{masters:'Masters',bachelor:"Bachelor's",hsc:'HSC',diploma:'Diploma',bsceng:'BSc Engineering',mbbs:'MBBS'}:eduBn;
  const remaining=(r.remaining?.y||r.remaining?.m||r.remaining?.d)
    ?(en?`${r.remaining.y}y ${r.remaining.m}m ${r.remaining.d}d`:durationBn(r.remaining))
    :(en?'Completed':'সময় পূর্ণ');
  const inputRows=[
    {label:en?'Current grade':'বর্তমান গ্রেড',value:`${en?'Grade':'গ্রেড'} ${f.grade||'—'}`},
    {label:en?'Education':'শিক্ষাগত যোগ্যতা',value:edu[f.edu]||f.edu||'—'},
    {label:en?'Current post joining':'বর্তমান পদে যোগদান',value:f.currentDate?fmtDateLang(f.currentDate,lang):'—'},
    {label:en?'First joining':'প্রথম যোগদান',value:f.firstJoinDate?fmtDateLang(f.firstJoinDate,lang):'—'},
    {label:en?'Calculation date':'হিসাবের তারিখ',value:fmtDateLang(f.calcDate||todayLocalIso(),lang)},
    {label:en?'Computer skill / training':'কম্পিউটার দক্ষতা/প্রশিক্ষণ',value:f.computer==='yes'?(en?'Yes':'আছে'):(en?'No':'নেই')},
    {label:en?'ACR condition':'ACR শর্ত',value:f.acr==='yes'?(en?'Satisfactory':'সন্তোষজনক'):(en?'Incomplete / No':'অসম্পূর্ণ/না')}
  ];
  if(r.stop){
    const body=pdfSummaryCards([
      {label:en?'Current grade':'বর্তমান গ্রেড',value:`${en?'Grade':'গ্রেড'} ${f.grade||'—'}`},
      {label:en?'Result':'ফলাফল',value:r.rule.target||'—',accent:true}
    ],2)+section(en?'Input information':'প্রদত্ত তথ্য',pdfTable(inputRows,{head1:en?'Information':'তথ্য',head3:en?'Value':'মান'}),{table:true})+
    section(en?'Rule result':'নীতিগত ফলাফল',pdfTable([
      {label:en?'Result':'ফলাফল',value:r.rule.target||'—',emphasis:true},
      {label:en?'Reference':'রেফারেন্স',value:r.rule.ref||r.rule.page||'—'}
    ],{head1:en?'Item':'বিষয়',head3:en?'Result':'ফলাফল'}),{table:true});
    return reportShell(en?'Promotion Calculation Report':'পদোন্নতি হিসাব প্রতিবেদন',en?'Eligibility and rule-based assessment':'যোগ্যতা ও নীতিমালাভিত্তিক মূল্যায়ন',body,lang);
  }
  const summary=pdfSummaryCards([
    {label:en?'Next promotion':'পরবর্তী পদোন্নতি',value:`${r.rule.target} · ${en?'Grade':'গ্রেড'} ${r.rule.targetGrade}`,accent:true},
    {label:en?'Eligibility date':'যোগ্যতার তারিখ',value:fmtDateLang(r.eligible,lang)},
    {label:en?'Remaining time':'অবশিষ্ট সময়',value:remaining},
    {label:en?'Service points':'সার্ভিস পয়েন্ট',value:numLang(r.points,lang)}
  ],4);
  const resultRows=[
    {label:en?'Required service':'প্রয়োজনীয় অভিজ্ঞতা',value:`${numLang(r.req,lang,0)} ${en?'years':'বছর'}`},
    {label:en?'Service in current post':'বর্তমান পদে চাকরি',value:en?`${r.elapsed.y}y ${r.elapsed.m}m ${r.elapsed.d}d`:durationBn(r.elapsed)},
    {label:en?'Eligibility date':'নীতিগত যোগ্যতার তারিখ',value:fmtDateLang(r.eligible,lang),emphasis:true},
    {label:en?'Application/circular deadline':'আবেদন/সার্কুলার সময়সীমা',value:fmtDateLang(r.cycle.circularDeadline,lang)},
    {label:en?'Projected final promotion':'সম্ভাব্য চূড়ান্ত পদোন্নতি',value:fmtDateLang(r.cycle.completionDeadline,lang),emphasis:true},
    {label:en?'Current post points':'বর্তমান পদের পয়েন্ট',value:numLang(r.exp?.currentPoints||0,lang)},
    {label:en?'Previous service points':'পূর্ববর্তী চাকরিকালের পয়েন্ট',value:numLang(r.exp?.priorServicePoints||0,lang)},
    {label:en?'Primary conditions':'প্রাথমিক শর্ত',value:r.prelim?(en?'Satisfied':'মূল শর্ত পূর্ণ'):(en?'Incomplete':'অসম্পূর্ণ')}
  ];
  const mainBody=summary+
    section(en?'Input information':'প্রদত্ত তথ্য',pdfTable(inputRows,{head1:en?'Information':'তথ্য',head3:en?'Value':'মান',compact:true}),{table:true,tight:true})+
    section(en?'Eligibility & calculation':'যোগ্যতা ও হিসাব',pdfTable(resultRows,{head1:en?'Calculation item':'হিসাবের বিষয়',head3:en?'Result':'ফলাফল',compact:true}),{table:true,tight:true})+
    `<div style="margin-top:10px;padding:9px 11px;border:1px solid #ead8a9;border-left:4px solid #c49a3d;background:#fffaf0;border-radius:8px;font-size:9.5px;color:#685626;line-height:1.45"><b>${en?'Important:':'গুরুত্বপূর্ণ:'}</b> ${en?'The final promotion date is a projection based on a one-year application, scrutiny and approval process after eligibility; it is not a guaranteed administrative order date.':'যোগ্যতা অর্জনের পর আবেদন, যাচাই-বাছাই ও অনুমোদনের জন্য ১ বছর ধরে সম্ভাব্য চূড়ান্ত তারিখ দেখানো হয়েছে; এটি প্রশাসনিক আদেশের নিশ্চিত তারিখ নয়।'}</div>`;
  const roadmap=(r.roadmap||[]).filter(x=>!x.stop);
  if(!roadmap.length)return reportShell(en?'Detailed Promotion Calculation Report':'পদোন্নতি হিসাবের বিস্তারিত প্রতিবেদন',en?'Eligibility, service points and projected completion':'যোগ্যতা, সার্ভিস পয়েন্ট ও সম্ভাব্য সমাপ্তি',mainBody,lang);
  const page1=reportShell(en?'Detailed Promotion Calculation Report':'পদোন্নতি হিসাবের বিস্তারিত প্রতিবেদন',en?'Eligibility, service points and projected completion':'যোগ্যতা, সার্ভিস পয়েন্ট ও সম্ভাব্য সমাপ্তি',mainBody,lang,{pageNo:1,totalPages:2,fixedPage:true,breakAfter:true});
  const roadRows=roadmap.map((x,i)=>({
    label:`${numLang(i+1,lang,0)}. ${en?'Grade':'গ্রেড'} ${x.fromGrade} → ${x.toGrade}`,
    detail:`${x.years} ${en?'years':'বছর'} · ${x.title}`,
    value:fmtDateLang(x.completionDeadline,lang),
    emphasis:i===0
  }));
  const page2Body=pdfSummaryCards([
    {label:en?'Current grade':'বর্তমান গ্রেড',value:`${en?'Grade':'গ্রেড'} ${f.grade||'—'}`},
    {label:en?'First eligibility':'প্রথম যোগ্যতা',value:fmtDateLang(r.eligible,lang)},
    {label:en?'Roadmap steps':'রোডম্যাপ ধাপ',value:numLang(roadRows.length,lang,0),accent:true}
  ],3)+section(en?'Future promotion roadmap':'ভবিষ্যৎ সম্ভাব্য পদোন্নতি রোডম্যাপ',pdfTable(roadRows,{three:true,head1:en?'Step':'ধাপ',head2:en?'Requirement':'শর্ত/সময়',head3:en?'Projected date':'সম্ভাব্য তারিখ'}),{table:true});
  const page2=reportShell(en?'Promotion Career Roadmap':'পদোন্নতি ক্যারিয়ার রোডম্যাপ',en?'Projected future progression based on current rules':'বর্তমান নিয়মের ভিত্তিতে ভবিষ্যৎ সম্ভাব্য অগ্রগতি',page2Body,lang,{pageNo:2,totalPages:2,fixedPage:true});
  return page1+page2;
}
function houseAllocationReportHtml(r,lang='bn'){
  const en=lang==='en';
  const fmt=x=>x?(en?`${x.y}y ${x.m}m ${x.d}d`:`${numLang(x.y,lang,0)} বছর ${numLang(x.m,lang,0)} মাস ${numLang(x.d,lang,0)} দিন`):'—';
  const inputRows=[
    {label:en?'Employee category':'কর্মচারীর শ্রেণি',value:r.categoryLabel},
    {label:en?'First joining date':'প্রথম যোগদানের তারিখ',value:fmtDateLang(r.input.firstJoin,lang)},
    {label:en?'Entered 3rd Class':'৩য় শ্রেণিতে প্রবেশ',value:fmtDateLang(r.input.thirdClassStart||r.input.firstJoin,lang)},
    {label:en?'Calculation date':'হিসাবের তারিখ',value:fmtDateLang(r.input.calcDate,lang)},
    {label:en?'Current basic salary':'বর্তমান মূল বেতন',value:`${en?'Tk':'৳'} ${moneyLang(r.basic,lang)}`}
  ];
  const pointRows=[
    {label:en?'3rd Class service':'৩য় শ্রেণিতে চাকরিকাল',detail:fmt(r.thirdService),value:'—'},
    {label:en?'Previous 4th Class service':'৪র্থ শ্রেণিতে পূর্ববর্তী চাকরিকাল',detail:fmt(r.fourthService),value:'—'},
    {label:en?'Total service':'মোট চাকরিকাল',detail:fmt(r.totalService),value:'—'},
    {label:en?'Basic salary points':'মূল বেতনভিত্তিক পয়েন্ট',detail:en?'Rule-based':'নিয়ম অনুযায়ী',value:numLang(r.basicPoint,lang)},
    {label:en?'Designation points':'পদবিভিত্তিক পয়েন্ট',detail:en?'Applicable score':'প্রযোজ্য স্কোর',value:numLang(r.designationPoint,lang,0)},
    {label:en?'Marital-status points':'বৈবাহিক অবস্থাভিত্তিক পয়েন্ট',detail:en?'Applicable score':'প্রযোজ্য স্কোর',value:numLang(r.maritalPoint,lang,0)},
    {label:en?'Gender points':'লিঙ্গভিত্তিক পয়েন্ট',detail:en?'Applicable score':'প্রযোজ্য স্কোর',value:numLang(r.genderPoint,lang,0)},
    {label:en?'Total house-allocation point':'মোট বাসা বরাদ্দ পয়েন্ট',detail:en?'Final total':'চূড়ান্ত মোট',value:fmt(r.totalPoint),emphasis:true}
  ];
  const body=pdfSummaryCards([
    {label:en?'Employee category':'কর্মচারীর শ্রেণি',value:r.categoryLabel},
    {label:en?'Basic salary':'মূল বেতন',value:`${en?'Tk':'৳'} ${moneyLang(r.basic,lang)}`},
    {label:en?'Total allocation point':'মোট বরাদ্দ পয়েন্ট',value:fmt(r.totalPoint),accent:true}
  ],3)+
  section(en?'Input information':'প্রদত্ত তথ্য',pdfTable(inputRows,{head1:en?'Information':'তথ্য',head3:en?'Value':'মান'}),{table:true})+
  section(en?'Point calculation':'পয়েন্ট হিসাব',pdfTable(pointRows,{three:true,head1:en?'Point item':'পয়েন্টের বিষয়',head2:en?'Basis':'ভিত্তি',head3:en?'Point':'পয়েন্ট'}),{table:true})+
  `<div style="margin-top:12px;border:2px solid #b79a53;border-radius:11px;padding:12px 14px;background:linear-gradient(120deg,#fffaf0,#f7fbf8);display:flex;justify-content:space-between;align-items:center;gap:14px;min-width:0">
    <span style="font-size:13px;font-weight:900;color:#254d3c">${en?'Final house-allocation point':'চূড়ান্ত বাসা বরাদ্দ পয়েন্ট'}</span>
    <span style="font-family:'Inter','Hind Siliguri',sans-serif;font-size:22px;font-weight:900;color:#75591e">${pdfSafe(fmt(r.totalPoint))}</span>
  </div>`;
  return reportShell(en?'House Allocation Point Calculation':'বাসা বরাদ্দ পয়েন্ট হিসাব',en?'Premium A4 calculation statement':'প্রিমিয়াম A4 হিসাব বিবরণী',body,lang);
}

function salaryOctoberArrearReportHtml(base,lang='bn'){
  const en=lang==='en',a=base?.arrear2026||{};
  const amt=v=>(en?'Tk ':'৳ ')+moneyLang(v,lang);
  const signedAmt=v=>{
    const n=Number(v||0);
    if(n===0)return amt(0);
    return (n>0?'+ ':'− ')+amt(Math.abs(n));
  };
  const monthly=Array.isArray(a.monthlySettlements)?a.monthlySettlements:[];
  const label=(bn,enText)=>en?enText:bn;
  const compareTable=(rows,heads={})=>{
    const body=rows.map((r,i)=>
      '<tr style="background:'+(r.emphasis?'#eef2ff':(i%2?'#fbfcfe':'#fff'))+'">'+
      '<td style="padding:5.3px 7px;border-top:1px solid #edf0f5;color:#445269;font-weight:'+(r.emphasis?800:650)+'">'+pdfSafe(r.label)+'</td>'+
      '<td style="padding:5.3px 7px;border-top:1px solid #edf0f5;text-align:right;color:#5e6a7d;font-variant-numeric:tabular-nums">'+pdfSafe(amt(r.old||0))+'</td>'+
      '<td style="padding:5.3px 7px;border-top:1px solid #edf0f5;text-align:right;color:#293A8C;font-weight:750;font-variant-numeric:tabular-nums">'+pdfSafe(amt(r.new||0))+'</td>'+
      '<td style="padding:5.3px 7px;border-top:1px solid #edf0f5;text-align:right;color:'+(Number(r.diff||0)>=0?'#14714f':'#8c4b55')+';font-weight:850;font-variant-numeric:tabular-nums">'+pdfSafe(signedAmt(r.diff||0))+'</td>'+
      '</tr>'
    ).join('');
    return '<div style="width:100%;border:1px solid #d8e0ea;border-radius:10px;overflow:hidden;background:#fff">'+
      '<table style="width:100%;border-collapse:collapse;table-layout:fixed;font-size:8.7px;line-height:1.28">'+
      '<colgroup><col style="width:37%"><col style="width:21%"><col style="width:21%"><col style="width:21%"></colgroup>'+
      '<thead><tr style="background:linear-gradient(90deg,#293A8C,#3F51B5);color:#fff">'+
      '<th style="padding:6px 7px;text-align:left">'+pdfSafe(heads.item||label('খাত','Item'))+'</th>'+
      '<th style="padding:6px 7px;text-align:right">'+pdfSafe(heads.old||label('আগে পাওয়া/কর্তন','Old paid/deducted'))+'</th>'+
      '<th style="padding:6px 7px;text-align:right">'+pdfSafe(heads.new||label('নতুন প্রাপ্য/কর্তন','New entitlement/deduction'))+'</th>'+
      '<th style="padding:6px 7px;text-align:right">'+pdfSafe(heads.diff||label('সমন্বয়','Adjustment'))+'</th>'+
      '</tr></thead><tbody>'+body+'</tbody></table></div>';
  };

  const earningRowsFor=m=>{
    const o=m.oldPaid||{},n=m.newEntitlement||{},oa=o.allowances||{},na=n.allowances||{};
    const rows=[
      [label('মূল বেতন','Basic pay'),o.payableBasic,n.payableBasic],
      [label('বাড়িভাড়া','House rent'),oa.house,na.house],
      [label('চিকিৎসা ভাতা','Medical allowance'),oa.medical,na.medical],
      [label('শিক্ষা ভাতা','Education allowance'),oa.education,na.education],
      [label('টিফিন ভাতা','Tiffin allowance'),oa.tiffin,na.tiffin],
      [label('যাতায়াত ভাতা','Conveyance allowance'),oa.conveyance,na.conveyance],
      [label('মোবাইল ভাতা','Mobile allowance'),oa.mobile,na.mobile],
      [label('ধোলাই ভাতা','Laundry allowance'),oa.laundry,na.laundry],
      [label('বিশেষ চাহিদাসম্পন্ন সন্তান ভাতা','Special-needs child allowance'),oa.disabledChild,na.disabledChild],
      [label('কার্যভার ভাতা','Charge allowance'),oa.charge,na.charge],
      [label('অন্যান্য অনুমোদিত ভাতা','Other approved allowance'),oa.otherSpecial,na.otherSpecial]
    ].filter((x,i)=>i===0||Number(x[1]||0)!==0||Number(x[2]||0)!==0)
      .map(x=>({label:x[0],old:Number(x[1]||0),new:Number(x[2]||0),diff:Number(x[2]||0)-Number(x[1]||0)}));
    rows.push({label:label('মোট Gross','Total gross'),old:Number(o.gross||0),new:Number(n.gross||0),diff:Number(m.grossAdjustment||0),emphasis:true});
    return rows;
  };

  const deductionRowsFor=m=>{
    const o=m.oldPaid||{},n=m.newEntitlement||{};
    const rows=[
      [label('ভবিষ্য তহবিল (PF)','Provident Fund (PF)'),o.pf,n.pf],
      [label('কল্যাণ তহবিল','Benevolent Fund'),o.bene,n.bene],
      [label('স্বাস্থ্য বীমা','Health insurance'),o.health,n.health],
      [label('গ্রুপ বীমা','Group insurance'),o.group,n.group],
      [label('রাজস্ব স্ট্যাম্প','Revenue stamp'),o.stamp,n.stamp],
      [label('সমিতি','Association'),o.association,n.association],
      [label('ঢাবি বাসা/ইউনিট ভাড়া','DU quarter/unit rent'),o.quarterRent,n.quarterRent],
      [label('বাসা-সংক্রান্ত অন্যান্য কর্তন','Other housing recovery'),o.quarterOther,n.quarterOther],
      [label('আয়কর','Income tax'),o.tax,n.tax]
    ].filter(x=>Number(x[1]||0)!==0||Number(x[2]||0)!==0)
      .map(x=>({label:x[0],old:Number(x[1]||0),new:Number(x[2]||0),diff:Number(x[2]||0)-Number(x[1]||0)}));
    rows.push({label:label('Arrear-সংশ্লিষ্ট মোট কর্তন','Arrear-linked deductions'),old:Number(o.arrearDeductions||0),new:Number(n.arrearDeductions||0),diff:Number(m.deductionAdjustment||0),emphasis:true});
    return rows;
  };

  const monthlyPage=(m,index)=>{
    const monthName=en?m.monthEn:m.monthBn;
    const old=m.oldPaid||{},next=m.newEntitlement||{};
    const summary=pdfSummaryCards([
      {label:label('পুরোনো Net ইতোমধ্যে পাওয়া','Old net already paid'),value:amt(old.net||0)},
      {label:label('নতুন Net প্রাপ্য','New net entitlement'),value:amt(next.net||0)},
      {label:label('Special Benefit সমন্বয়','Special benefit adjustment'),value:'− '+amt(m.specialAdjustment||0)},
      {label:label('চূড়ান্ত মাসিক বকেয়া','Final monthly arrear'),value:amt(m.finalArrear||0),accent:true}
    ],4);

    const fixationRows=[
      {label:label('৩০ জুন ২০২৬ মূল বেতন','30 June 2026 basic'),detail:label('২০১৫ স্কেল','2015 scale'),value:amt(a.oldJuneBasic||base.currentBasic||0)},
      {label:label('১ জুলাই পুরোনো স্কেলের মূল বেতন','1 July old-scale basic'),detail:label('প্রাপ্য হলে July incrementসহ','Includes eligible July increment'),value:amt(a.oldJulyBasic||0)},
      {label:label('পুরোনো স্কেলের July increment','Old-scale July increment'),detail:label('পুরোনো payroll-এর মধ্যেই ইতোমধ্যে পাওয়া','Already included in old payroll'),value:amt(a.legacyIncrementPaid||0)},
      {label:label('২০২৬ স্কেলে Fixed Basic','2026 fixed basic'),detail:label('৩০ জুনের Basic থেকে fixation','Fixed from 30 June basic'),value:amt(base.fixed||0)},
      {label:label('২০২৬ স্কেলের Increment Step','2026-scale increment step'),detail:label('প্রাপ্য হলে নতুন fixation-এর উপর','On new fixation when eligible'),value:amt(a.newScaleIncrementAmount||0)}
    ];

    const reconciliationRows=[
      {label:label('Gross বকেয়া','Gross arrear'),detail:label('নতুন Gross − পুরোনো Gross','New gross − old gross'),value:signedAmt(m.grossAdjustment||0)},
      {label:label('কর্তন সমন্বয়','Deduction adjustment'),detail:label('নতুন কর্তন − আগে কর্তন','New deductions − old deductions'),value:signedAmt(m.deductionAdjustment||0)},
      {label:label('Special Benefit-এর আগে Net বকেয়া','Net arrear before special benefit'),detail:label('নতুন Net − পুরোনো Net','New net − old net'),value:signedAmt(m.netBeforeSpecial||0)},
      {label:label('ইতোমধ্যে পাওয়া Special Benefit','Special benefit already received'),detail:label('আলাদা সমন্বয়; payroll deduction নয়','Separate adjustment; not payroll deduction'),value:'− '+amt(m.specialAdjustment||0)},
      {label:label('চূড়ান্ত মাসিক বকেয়া','Final monthly arrear'),detail:label('Double adjustment ছাড়া','No double adjustment'),value:amt(m.finalArrear||0),emphasis:true}
    ];

    const note='<div style="margin-top:8px;padding:8px 10px;border:1px solid #d9e0ef;border-radius:9px;background:#f7f9fc;color:#5b687a;font-size:8.8px;line-height:1.42"><b style="color:#293A8C">'+
      label('হিসাবের ব্যাখ্যা:','Calculation note:')+'</b> '+
      label('পুরোনো ২০১৫ স্কেলে ইতোমধ্যে পাওয়া Basic, July increment, বাড়িভাড়া ও অন্যান্য ভাতা Old Paid Payroll হিসেবে সমন্বয় করা হয়েছে। PF, কল্যাণ, স্বাস্থ্য/গ্রুপ বীমা ও অন্যান্য scale-linked কর্তনের ক্ষেত্রে নতুন প্রয়োজনীয় কর্তন ও আগে কর্তিত অংকের শুধু পার্থক্য ধরা হয়েছে। PF advance, loan/advance recovery ও ব্যক্তিগত/সাময়িক recovery arrear comparison-এর বাইরে রাখা হয়েছে। Special Benefit আলাদাভাবে সমন্বয় হয়েছে; কোনো অংক দ্বিতীয়বার কর্তন করা হয়নি।','Basic pay, eligible July increment, house rent and other earnings already received under the 2015 scale are treated as Old Paid Payroll. For PF, benevolent fund and other deductions, only the difference between the new required deduction and the amount already deducted is adjusted. Special Benefit is adjusted separately; no amount is deducted twice.')+
      '</div>';

    const body=summary+
      section(label('Pay Fixation Summary','Pay Fixation Summary'),pdfTable(fixationRows,{three:true,compact:true,head1:label('বিষয়','Item'),head2:label('ভিত্তি','Basis'),head3:label('অংক','Amount')}),{table:true})+
      section(label('বেতন ও ভাতা: Old Paid বনাম New Entitlement','Earnings: Old Paid vs New Entitlement'),compareTable(earningRowsFor(m),{old:label('পুরোনো স্কেলে পাওয়া','Old paid'),new:label('নতুন স্কেলে প্রাপ্য','New entitlement')}),{table:true})+
      section(label('কর্তন সমন্বয়','Deduction Reconciliation'),compareTable(deductionRowsFor(m),{old:label('আগে কর্তন হয়েছে','Already deducted'),new:label('নতুন হিসাবে কর্তন','New required deduction')}),{table:true})+
      section(label('চূড়ান্ত সমন্বয়','Final Reconciliation'),pdfTable(reconciliationRows,{three:true,compact:true,head1:label('হিসাব','Calculation'),head2:label('সূত্র/ভিত্তি','Formula / basis'),head3:label('অংক','Amount')}),{table:true})+
      note;

    return reportShell(
      (en?monthName+' 2026 Salary & Arrear Adjustment':monthName+' ২০২৬ বেতন ও বকেয়া সমন্বয়'),
      label('২০১৫ স্কেলে ইতোমধ্যে পাওয়া বনাম ২০২৬ স্কেলে প্রাপ্য','2015-scale already paid vs 2026-scale entitlement'),
      body,lang,{pageNo:index+1,totalPages:4,fixedPage:true,breakAfter:true}
    );
  };

  const previousRows=monthly.map(m=>({
    label:(en?m.monthEn:m.monthBn)+' 2026',
    detail:label('Special Benefit সমন্বয়সহ','After Special Benefit adjustment'),
    value:amt(m.finalArrear||0)
  }));
  previousRows.push({
    label:label('মোট জুলাই–সেপ্টেম্বর বকেয়া','Total July–September arrear'),
    detail:label('অক্টোবর বিলে বহন হবে','Carried to October bill'),
    value:amt(a.priorNetAfterSpecial||0),
    emphasis:true
  });

  const octAllow=a.octoberAllowances||{};
  const otherOctoberAllowances=Object.entries(octAllow).filter(x=>!['house','medical'].includes(x[0])).reduce((s,x)=>s+Number(x[1]||0),0);
  const octoberRows=[
    {label:label('অক্টোবর প্রাপ্য মূল বেতন','October payable basic'),detail:label('২০২৬ বাস্তবায়ন ধাপ','2026 implementation phase'),value:amt(a.octoberBasic||0)},
    {label:label('বাড়িভাড়া','House rent'),detail:label('প্রযোজ্য হার','Applicable rate'),value:amt(octAllow.house||0)},
    {label:label('চিকিৎসা ভাতা','Medical allowance'),detail:'',value:amt(octAllow.medical||0)},
    {label:label('শিক্ষা/টিফিন/যাতায়াত ও অন্যান্য','Education/tiffin/conveyance & others'),detail:label('সমষ্টি','Combined'),value:amt(otherOctoberAllowances)},
    {label:label('অক্টোবর Gross','October gross'),detail:label('চলতি মাস','Current month'),value:amt(a.octoberGross||0),emphasis:true},
    {label:label('অক্টোবর মোট কর্তন','October total deductions'),detail:label('PF/কল্যাণ/বীমা/অন্যান্য','PF/benevolent/insurance/others'),value:'− '+amt(a.octoberDeductions||0)},
    {label:label('অক্টোবর চলতি Net','October current net'),detail:label('চলতি মাসের হাতে প্রাপ্য','Current-month net'),value:amt(a.octoberCurrentNet||0),emphasis:true}
  ];

  const octoberBody=pdfSummaryCards([
    {label:label('অক্টোবর চলতি Net','October current net'),value:amt(a.octoberCurrentNet||0)},
    {label:label('জুলাই–সেপ্টেম্বর বকেয়া','July–September arrear'),value:amt(a.priorNetAfterSpecial||0)},
    {label:label('Special Benefit মোট সমন্বয়','Total Special Benefit adjusted'),value:amt(a.specialBenefitReceivedAmount||0)},
    {label:label('অক্টোবরে মোট আনুমানিক প্রাপ্য','Estimated total in October'),value:amt(a.octoberBillNet||0),accent:true}
  ],4)+
  section(label('অক্টোবর চলতি বেতন','October Current Salary'),pdfTable(octoberRows,{three:true,compact:true,head1:label('খাত','Item'),head2:label('ভিত্তি','Basis'),head3:label('অংক','Amount')}),{table:true})+
  section(label('পূর্বের মাসগুলোর বকেয়া','Previous Monthly Arrears'),pdfTable(previousRows,{three:true,compact:true,head1:label('মাস','Month'),head2:label('অবস্থা','Status'),head3:label('চূড়ান্ত বকেয়া','Final arrear')}),{table:true})+
  '<div style="margin-top:11px;border:2px solid #3F51B5;border-radius:11px;padding:12px 14px;background:linear-gradient(120deg,#eef2ff,#f3fbfa);display:flex;justify-content:space-between;align-items:center;gap:14px">'+
    '<div><div style="font-size:9px;color:#63708a;font-weight:800">FINAL OCTOBER SETTLEMENT</div><div style="font-size:13px;font-weight:800;color:#293A8C;margin-top:2px">'+
    label('অক্টোবর Net + জুলাই–সেপ্টেম্বরের চূড়ান্ত বকেয়া','October net + final July–September arrears')+
    '</div></div><div style="font-size:23px;font-weight:900;color:#14756f;font-family:&quot;Hind Siliguri&quot;,&quot;Inter&quot;,sans-serif;font-variant-numeric:tabular-nums">'+pdfSafe(amt(a.octoberBillNet||0))+'</div></div>'+
  '<div style="margin-top:8px;padding:9px 11px;border-radius:8px;background:#fff8e8;color:#6b5728;font-size:8.9px;line-height:1.45">'+
    label('Special Benefit জুলাই–সেপ্টেম্বরের নিজ নিজ মাসের reconciliation-এ একবার করে সমন্বয় হয়েছে; অক্টোবরের Final Settlement-এ এটি আবার কর্তন করা হয়নি। প্রকৃত আয়কর, ঋণ, বাসা-সংক্রান্ত recovery বা payroll-specific কর্তনের কারণে অফিস বিল ভিন্ন হতে পারে।','Special Benefit has already been adjusted once within each July–September monthly reconciliation and is not deducted again in the October Final Settlement. Actual tax, loan, housing recovery or payroll-specific deductions may change the office bill.')+
    '</div>';

  const pages=monthly.map((m,i)=>monthlyPage(m,i)).join('');
  return pages+reportShell(
    label('অক্টোবর ২০২৬ Final Salary & Arrear Settlement','October 2026 Final Salary & Arrear Settlement'),
    label('চলতি বেতন + জুলাই–সেপ্টেম্বরের মাসভিত্তিক বকেয়া','Current salary + month-by-month July–September arrears'),
    octoberBody,lang,{pageNo:4,totalPages:4,fixedPage:true}
  );
}
function salaryProjectionReportResult(base,p,projections,year){
  const a=p?.allowances||{};
  return {
    ...base,...p,reportYear:year,projections,
    currentIndex:base.currentIndex,currentBasic:base.currentBasic,
    payable:p?.payableBasic??base.payableBasic,payableBasic:p?.payableBasic??base.payableBasic,
    house:a.house??0,medical:a.medical??0,education:a.education??0,tiffin:a.tiffin??0,
    conveyance:a.conveyance??0,mobile:a.mobile??0,laundry:a.laundry??0,disabledChild:a.disabledChild??0,
    area:a.area??0,training:a.training??0,charge:a.charge??0,entertainment:a.entertainment??0,otherSpecial:a.otherSpecial??0,
    deductionMode:p?.deductionMode??base.deductionMode,category:p?.category??base.category,
    gpfRate:p?.gpfRate??base.gpfRate,pf:p?.pf??base.pf,beneRate:p?.beneRate??base.beneRate,bene:p?.bene??base.bene,
    health:p?.health??base.health,group:p?.group??base.group,stamp:p?.stamp??base.stamp,association:p?.association??base.association,
    tax:p?.tax??base.tax,loan:p?.loan??base.loan,other:p?.other??base.other,deductions:p?.deductions??base.deductions,
    net:p?.net??base.net,gross:p?.gross??base.gross,
    input:{...(base.input||{}),date:p?.date||(base.input||{}).date}
  };
}
function salaryYearReportHtml(base,year,lang='bn',meta={}){
  const ps=(base.projections||[]).filter(p=>String(p.date||'').startsWith(String(year)));
  const data=!ps.length?{...base,reportYear:year,projections:[]}:salaryProjectionReportResult(base,ps[ps.length-1],ps,year);
  return salaryReportHtml(data,lang,{pageNo:meta.pageNo||1,totalPages:meta.totalPages||1,breakAfter:meta.breakAfter===true,fixedPage:true});
}
function salaryCombinedReportHtml(base,lang='bn'){
  return [2026,2027,2028].map((year,i)=>salaryYearReportHtml(base,year,lang,{pageNo:i+1,totalPages:3,breakAfter:i<2})).join('');
}
function salaryReportHtml(r,lang='bn',pdfMeta={}){
  const en=lang==='en',f=r.input||{};
  const amt=v=>`${en?'Tk':'৳'} ${moneyLang(v,lang)}`;
  const rate=r.phase?.rate??r.rate??0;
  const zoneLabel=en?'University of Dhaka, Dhaka':'ঢাকা বিশ্ববিদ্যালয়, ঢাকা';
  const categoryLabel=duCategoryInfo(r.category||f.category,lang).label;
  const housingLabel=(r.housingMode||f.housing)==='du_quarter'?(en?'DU allotted quarter/unit':'ঢাবি বরাদ্দকৃত বাসা/ইউনিট'):(en?'No DU quarter — Dhaka house-rent allowance':'ঢাবি বাসা নেই — ঢাকা সিটি বাড়িভাড়া ভাতা');
  const earningRows=[
    [en?'Payable basic':'প্রাপ্য মূল বেতন',r.payableBasic??r.payable],
    [en?'House rent':'বাড়িভাড়া',r.house],
    [en?'Medical allowance':'চিকিৎসা ভাতা',r.medical],
    [en?'Education allowance':'শিক্ষা সহায়ক ভাতা',r.education],
    [en?'Tiffin allowance':'টিফিন ভাতা',r.tiffin],
    [en?'Conveyance allowance':'যাতায়াত ভাতা',r.conveyance],
    [en?'Mobile allowance':'মোবাইল ভাতা',r.mobile],
    [en?'Laundry allowance':'ধোলাই ভাতা',r.laundry],
    [en?'Special-needs child allowance':'বিশেষ চাহিদাসম্পন্ন সন্তান ভাতা',r.disabledChild],
    [en?'Charge allowance':'কার্যভার ভাতা',r.charge],
    [en?'Other separately approved allowance':'আলাদা অনুমোদনপ্রাপ্ত অন্যান্য ভাতা',r.otherSpecial]
  ].filter(([,v],i)=>i===0||Number(v)>0).map(([label,v],i)=>({label,value:amt(v),emphasis:i===0}));
  const deductionRows=[
    [en?`Provident Fund (${numLang(r.gpfRate||0,'en',0)}%)`:`ভবিষ্য তহবিল (PF) (${numLang(r.gpfRate||0,'bn',0)}%)`,r.pf],
    [en?`Benevolent Fund${r.deductionMode!=='custom'?` (${numLang((r.beneRate||0)*100,'en',2)}%)`:''}`:`কল্যাণ তহবিল${r.deductionMode!=='custom'?` (${numLang((r.beneRate||0)*100,'bn',2)}%)`:''}`,r.bene],
    [en?'Health insurance':'স্বাস্থ্য বীমা',r.health],
    [en?'Group insurance':'গ্রুপ বীমা',r.group],
    [en?'Revenue stamp':'রাজস্ব স্ট্যাম্প',r.stamp],
    [en?'Association':'সমিতি',r.association],
    [en?'DU quarter/unit rent':'ঢাবি বাসা/ইউনিট ভাড়া',r.quarterRent],
    [en?'Other housing recovery':'বাসা-সংক্রান্ত অন্যান্য কর্তন',r.quarterOther],
    [en?'Income tax':'আয়কর',r.tax],
    [en?'Loan / advance':'ঋণ / অগ্রিম',r.loan],
    [en?'Other':'অন্যান্য',r.other]
  ].filter(([,v])=>Number(v)>0).map(([label,v])=>({label,value:amt(v)}));
  const metaRows=[
    {label:en?'Calculation date':'হিসাবের তারিখ',value:fmtDateLang(f.date||todayLocalIso(),lang)},
    {label:en?'Grade':'গ্রেড',value:`${en?'Grade':'গ্রেড'} ${numLang(r.grade,lang,0)}`},
    {label:en?'2015 pay stage on 30 June 2026':'৩০ জুন ২০২৬-এর ২০১৫ বেতন ধাপ',value:`${en?'Stage':'ধাপ'} ${numLang(r.currentIndex+1,lang,0)}`},
    {label:en?'2015 basic':'২০১৫ মূল বেতন',value:amt(r.currentBasic)},
    {label:en?'2026 fixed basic':'২০২৬ নির্ধারিত মূল বেতন',value:amt(r.fixed),emphasis:true},
    {label:en?'First eligible increment included':'প্রাপ্য প্রথম ইনক্রিমেন্টসহ মূল বেতন',value:amt(r.fixedWithFirstIncrement??r.fixed)},
    {label:en?'Implementation phase':'বাস্তবায়ন ধাপ',value:r.phase?.label||`${numLang(rate*100,lang,0)}%`},
    {label:en?'DU category':'ঢাকা বিশ্ববিদ্যালয়ের শ্রেণি',value:categoryLabel},
    {label:en?'Work location':'কর্মস্থল',value:zoneLabel},
    {label:en?'Housing status':'বাসার অবস্থা',value:housingLabel},
    {label:en?'PF rate':'PF হার',value:`${numLang(r.gpfRate||0,lang,0)}%`}
  ];
  const reportYear=r.reportYear||null;
  const title=reportYear
    ?(en?('University of Dhaka Pay Scale '+reportYear+' Salary Statement'):('ঢাকা বিশ্ববিদ্যালয় পে-স্কেল '+numLang(reportYear,lang,0)+' বেতন বিবরণী'))
    :(en?'University of Dhaka Pay Scale 2026–2028 Salary Calculation':'ঢাকা বিশ্ববিদ্যালয় পে-স্কেল ২০২৬–২০২৮ বেতন হিসাব');
  const subtitle=reportYear
    ?(en?('DU payroll statement · '+reportYear+' · SRO 348/2026 Public Bodies'):('DU পে-রোল বিবরণী · '+numLang(reportYear,lang,0)+' · এস.আর.ও. ৩৪৮-আইন/২০২৬'))
    :(en?'DU payroll combined statement · SRO 348/2026 · 2026–2028':'DU পে-রোল সমন্বিত বিবরণী · এস.আর.ও. ৩৪৮-আইন/২০২৬ · ২০২৬–২০২৮');
  const ruleNote=r.allowance2026
    ?(en?'New allowance rates apply from 1 January 2028; annual increment applies again from 1 July 2028.':'১ জানুয়ারি ২০২৮ থেকে নতুন ভাতার হার এবং ১ জুলাই ২০২৮ থেকে পরবর্তী বার্ষিক ইনক্রিমেন্ট প্রযোজ্য।')
    :(en?'Until 31 December 2027 the pre-existing allowance amounts/rates remain in force; new allowance rates start from 1 January 2028.':'৩১ ডিসেম্বর ২০২৭ পর্যন্ত পূর্ববর্তী ভাতার অংক/হার বহাল থাকবে; নতুন ভাতার হার ১ জানুয়ারি ২০২৮ থেকে কার্যকর।');

  const summary=pdfSummaryCards([
    {label:en?'Payable basic':'প্রাপ্য মূল বেতন',value:amt(r.payableBasic??r.payable)},
    {label:en?'Monthly allowances':'মাসিক মোট ভাতা',value:amt(r.totalAllowances||0)},
    {label:en?'Total deductions':'মোট কর্তন',value:amt(r.deductions||0)},
    {label:en?'Estimated net payable':'আনুমানিক নিট প্রাপ্য',value:amt(r.net||0),accent:true}
  ],4);

  const stageHtml=r.projections?.length?`<div style="border:1px solid #dbe4e9;border-radius:10px;overflow:hidden;background:#fff">
    <table style="width:100%;max-width:100%;border-collapse:collapse;table-layout:fixed;font-size:10.4px;line-height:1.42">
      <colgroup><col style="width:34%"><col style="width:22%"><col style="width:22%"><col style="width:22%"></colgroup>
      <thead><tr style="background:linear-gradient(90deg,#eef5f2,#f4f7fb);color:#23473a">
        <th style="padding:7px 8px;text-align:left;border-bottom:1px solid #d6e1dc;box-sizing:border-box;overflow-wrap:anywhere">${en?'Stage':'ধাপ'}</th>
        <th style="padding:7px 8px;text-align:right;border-bottom:1px solid #d6e1dc;box-sizing:border-box">${en?'Basic':'মূল বেতন'}</th>
        <th style="padding:7px 8px;text-align:right;border-bottom:1px solid #d6e1dc;box-sizing:border-box">${en?'Gross':'মোট'}</th>
        <th style="padding:7px 8px;text-align:right;border-bottom:1px solid #d6e1dc;box-sizing:border-box">${en?'Est. net':'আনু. নিট'}</th>
      </tr></thead>
      <tbody>${r.projections.map((p,i)=>`<tr style="background:${i%2?'#fbfcfd':'#fff'}">
        <td style="padding:7px 8px;border-bottom:1px solid #e9eef1;color:#425466;font-weight:700;box-sizing:border-box;white-space:normal;overflow-wrap:anywhere">${pdfSafe(p.label)}</td>
        <td style="padding:7px 8px;border-bottom:1px solid #e9eef1;text-align:right;font-family:'Inter','Hind Siliguri',sans-serif;font-weight:800;box-sizing:border-box;white-space:normal;overflow-wrap:anywhere">${pdfSafe(amt(p.payableBasic))}</td>
        <td style="padding:7px 8px;border-bottom:1px solid #e9eef1;text-align:right;font-family:'Inter','Hind Siliguri',sans-serif;font-weight:800;box-sizing:border-box;white-space:normal;overflow-wrap:anywhere">${pdfSafe(amt(p.gross))}</td>
        <td style="padding:7px 8px;border-bottom:1px solid #e9eef1;text-align:right;font-family:'Inter','Hind Siliguri',sans-serif;font-weight:900;color:#0f5f3a;box-sizing:border-box;white-space:normal;overflow-wrap:anywhere">${pdfSafe(amt(p.net))}</td>
      </tr>`).join('')}</tbody>
    </table>
  </div>`:''; 

  const earnRows=[...earningRows,{label:en?'Gross monthly salary':'মোট মাসিক প্রাপ্য',value:amt(r.gross),emphasis:true}];
  if(r.allowance2026&&r.banglaNewYear!=null)earnRows.push({label:en?'Bangla New Year allowance (annual)':'বাংলা নববর্ষ ভাতা (বার্ষিক)',value:amt(r.banglaNewYear)});
  const dedRows=[...deductionRows,{label:en?'Total deductions':'মোট কর্তন',value:amt(r.deductions),emphasis:true}];

  const body=summary+
    section(en?'Fixation & salary basis':'ফিক্সেশন ও বেতনের ভিত্তি',pdfTable(metaRows,{head1:en?'Information':'তথ্য',head3:en?'Value':'মান',compact:true}),{table:true,tight:true})+
    (stageHtml?section(reportYear?(en?`${reportYear} implementation stages`:`${numLang(reportYear,lang,0)} সালের বাস্তবায়ন ধাপ`):(en?'Implementation projection':'বাস্তবায়ন প্রক্ষেপণ'),stageHtml,{table:true,tight:true}):'')+
    `<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:10px;align-items:start">
      <div>${section(en?'Earnings':'প্রাপ্যসমূহ',pdfTable(earnRows,{head1:en?'Earning':'প্রাপ্য',head3:en?'Amount':'অংক',compact:true}),{table:true,tight:true})}</div>
      <div>${section(en?'Deductions':'কর্তনসমূহ',pdfTable(dedRows,{head1:en?'Deduction':'কর্তন',head3:en?'Amount':'অংক',compact:true}),{table:true,tight:true})}</div>
    </div>
    <div style="margin-top:10px;border:2px solid #b89a51;border-radius:11px;padding:11px 14px;background:linear-gradient(120deg,#fffaf0,#eff9f4);display:flex;justify-content:space-between;align-items:center;gap:14px;min-width:0">
      <div><div style="font-size:9.5px;color:#65745f;font-weight:800">${en?'FINAL MONTHLY ESTIMATE':'চূড়ান্ত মাসিক আনুমানিক হিসাব'}</div><div style="font-size:13px;font-weight:900;color:#244b3a;margin-top:2px">${en?'Estimated net payable salary':'আনুমানিক নিট প্রাপ্য বেতন'}</div></div>
      <div style="font-size:24px;font-weight:900;color:#76591e;font-family:'Hind Siliguri','Noto Sans Bengali','Inter',sans-serif;font-variant-numeric:tabular-nums">${pdfSafe(amt(r.net))}</div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:8px">
      <div style="padding:8px 10px;border-left:4px solid #1f6d4d;background:#effaf5;border-radius:8px;font-size:9.5px;color:#38594a;line-height:1.4"><b>${en?'Gazette rule:':'গেজেটের নিয়ম:'}</b> ${pdfSafe(ruleNote)}</div>
      <div style="padding:8px 10px;border-left:4px solid #c69b3e;background:#fff8e8;border-radius:8px;font-size:9.5px;color:#6b5728;line-height:1.4"><b>${en?'Deduction note:':'কর্তন নোট:'}</b> ${r.deductionMode!=='custom'?(en?'DU Auto uses rule-based PF/Benevolent Fund and existing platform payroll presets for supported fixed deductions.':'DU Auto-তে PF/কল্যাণ তহবিল নিয়মভিত্তিক এবং সমর্থিত নির্দিষ্ট কর্তনে আগের পে-রোল প্রিসেট ব্যবহৃত হয়েছে।'):(en?'Custom deductions should be verified against actual payroll.':'কাস্টম কর্তন প্রকৃত পে-রোলের সঙ্গে যাচাই করুন।')}</div>
    </div>`;
  return reportShell(title,subtitle,body,lang,pdfMeta);
}

function AuthPortal({onLogin,onBack,lang,setLang,initialMode='login'}) {
  const en=lang==='en';
  const [mode,setMode]=useState(initialMode==='reset'?'forgot':initialMode);
  const [step,setStep]=useState(0);
  const [form,setForm]=useState({
    name:'',email:'',password:'',confirm:'',account_type:'employee',recovery_code:'',
    employee_reference:'',mobile:'',date_of_birth:'',gender:'male',marital_status:'unmarried',
    employee_category:'third_general',current_post:'',current_grade:'',office_name:'',department_name:'',
    first_joining_date:'',current_post_joining_date:'',third_class_start_date:'',fourth_class_start_date:'',
    previous_promotions:'0',ssc_result:'',hsc_result:'',bachelor_type:'',bachelor_result:'',masters_result:'',
    current_basic_salary:'',salary_effective_date:todayLocalIso(),
    consent_read:false,consent_own:false,consent_advisory:false
  });
  const [err,setErr]=useState(''),[msg,setMsg]=useState(''),[busy,setBusy]=useState(false),[recovery,setRecovery]=useState('');
  const change=(k,v)=>setForm(f=>({...f,[k]:v}));
  const switchMode=m=>{setMode(m);setStep(0);setErr('');setMsg('');setRecovery('')};
  const steps=en?['Important Notice','Account','Personal','Employment','Education','Salary','Review']:['গুরুত্বপূর্ণ ঘোষণা','অ্যাকাউন্ট','ব্যক্তিগত','চাকরি','শিক্ষা','বেতন','যাচাই'];

  function validateStep(){
    if(step===0&&!(form.consent_read&&form.consent_own&&form.consent_advisory))return en?'Please read and accept all three declarations.':'সবগুলো ঘোষণা পড়ে তিনটি সম্মতিতেই টিক দিন।';
    if(step===1&&(!form.name||!form.email||!form.employee_reference||!form.password||form.password!==form.confirm))return en?'Complete the required account fields and make sure both passwords match.':'প্রয়োজনীয় অ্যাকাউন্ট তথ্য পূরণ করুন এবং দুইটি পাসওয়ার্ড মিলিয়ে দিন।';
    if(step===2&&(!form.date_of_birth||!form.gender||!form.marital_status))return en?'Complete the required personal information.':'প্রয়োজনীয় ব্যক্তিগত তথ্য পূরণ করুন।';
    if(step===3&&(!form.current_post||!form.current_grade||!form.first_joining_date||!form.current_post_joining_date))return en?'Complete the required employment information.':'প্রয়োজনীয় চাকরির তথ্য পূরণ করুন।';
    if(step===5&&!form.current_basic_salary)return en?'Enter the current basic salary.':'বর্তমান মূল বেতন দিন।';
    return '';
  }
  function nextStep(){
    const x=validateStep();if(x){setErr(x);return}setErr('');setStep(v=>Math.min(6,v+1));
  }
  async function submit(e){
    e.preventDefault();setErr('');setMsg('');
    if(mode==='register'){
      if(step<6){nextStep();return}
      const x=validateStep();if(x){setErr(x);return}
    }
    setBusy(true);
    try{
      if(mode==='login'){
        const x=await api('/api/login',{method:'POST',body:JSON.stringify({email:form.email,password:form.password})});
        await syncGuestWorkspaceToAccount(x.user).catch(()=>{});
        onLogin(x.user);return;
      }
      if(mode==='register'){
        const x=await api('/api/register-complete',{method:'POST',body:JSON.stringify(form)});
        setRecovery(x.recoveryCode);setMsg(en?'Account created. Save this recovery code now.':'অ্যাকাউন্ট তৈরি হয়েছে। রিকভারি কোডটি এখনই নিরাপদে সংরক্ষণ করুন।');return;
      }
      if(mode==='forgot'){
        if(form.password!==form.confirm)throw new Error(en?'Passwords do not match':'পাসওয়ার্ড দুটি মিলছে না');
        await api('/api/reset-password-recovery',{method:'POST',body:JSON.stringify({email:form.email,recovery_code:form.recovery_code,password:form.password})});
        setMsg(en?'Password reset completed. You can now log in.':'পাসওয়ার্ড পরিবর্তন হয়েছে। এখন লগইন করতে পারবেন।');setMode('login');return;
      }
    }catch(e){setErr(e.message)}finally{setBusy(false)}
  }

  if(mode==='register')return <div className="smart-reg-shell">
    <div className="smart-reg-card">
      <div className="login-top"><button type="button" className="back-link" onClick={onBack}>{en?'← Back to Home':'← হোমে ফিরুন'}</button><LangToggle lang={lang} setLang={setLang}/></div>
      <div className="smart-reg-title"><div className="auth-badge"><ShieldCheck size={15}/>{en?'OPTIONAL BACKUP & SYNC ACCOUNT':'ঐচ্ছিক BACKUP & SYNC অ্যাকাউন্ট'}</div><h1>{en?'Create a Backup & Sync account':'Backup & Sync অ্যাকাউন্ট তৈরি করুন'}</h1><p>{en?'The app works without login. Create an account only if you want cloud backup, recovery and access from multiple devices.':'অ্যাপের মূল সেবা লগইন ছাড়াই কাজ করে। Cloud backup, recovery ও একাধিক ডিভাইসে ব্যবহার করতে চাইলে শুধু তখনই অ্যাকাউন্ট তৈরি করুন।'}</p></div>
      <div className="smart-reg-steps">{steps.map((x,i)=><div key={x} className={`${i===step?'active':''} ${i<step?'done':''}`}><span>{i<step?<CheckCircle2/>:numLang(i+1,lang,0)}</span><b>{x}</b></div>)}</div>

      <form onSubmit={submit} className="smart-reg-form">
        {step===0&&<section className="reg-policy">
          <div className="reg-signup-benefits">
            <div className="reg-signup-benefits-head"><Sparkles/><div><h3>{en?'What an optional account adds':'ঐচ্ছিক অ্যাকাউন্টে অতিরিক্ত যা পাবেন'}</h3><p>{en?'Cloud backup, multi-device sync, account recovery and server-saved personal records. Core calculators and local records already work without login.':'Cloud backup, একাধিক ডিভাইসে sync, account recovery ও server-এ ব্যক্তিগত রেকর্ড সংরক্ষণ। মূল calculator ও Local record login ছাড়াই ব্যবহার করা যায়।'}</p></div></div>
            <div className="reg-signup-mini-grid">
              <span><Cloud/>{en?'Cloud Backup':'Cloud Backup'}</span>
              <span><RefreshCw/>{en?'Multi-device Sync':'Multi-device Sync'}</span>
              <span><LockKeyhole/>{en?'Account Recovery':'Account Recovery'}</span>
              <span><Database/>{en?'Server Records':'Server Records'}</span>
              <span><ShieldCheck/>{en?'Session Security':'Session Security'}</span>
              <span><UserRound/>{en?'Same Data Anywhere':'একই তথ্য যেকোনো ডিভাইসে'}</span>
            </div>
          </div>
          <div className="reg-policy-hero"><ShieldCheck/><div><h2>{en?'Know before you sign up':'সাইন আপ করার আগে জেনে নিন'}</h2><p>{en?'Create an account only after reading and understanding the following conditions.':'নিচের বিষয়গুলো সম্পূর্ণ পড়ে ও বুঝে তারপর অ্যাকাউন্ট তৈরি করুন।'}</p></div></div>
          <div className="reg-warning"><AlertTriangle/><div><b>{en?'Never enter banking secrets here':'কোনো গোপন ব্যাংকিং তথ্য এখানে দেবেন না'}</b><p>{en?'This platform does not ask for bank account numbers, card details, ATM PIN, OTP, mobile-banking PIN, internet-banking password or financial transaction credentials.':'এই প্ল্যাটফর্মে ব্যাংক অ্যাকাউন্ট নম্বর, কার্ডের তথ্য, ATM PIN, OTP, বিকাশ/নগদ/রকেট PIN, ইন্টারনেট ব্যাংকিং পাসওয়ার্ড বা আর্থিক লেনদেনের গোপন তথ্য চাওয়া হয় না।'}</p></div></div>
          <div className="reg-policy-list">
            <p><b>১.</b> {en?'This is an independently developed personal self-service platform. It is not an official government, autonomous, semi-government, university, office or institutional system, and is not controlled by any such authority.':'এটি ব্যক্তিগত উদ্যোগে তৈরি একটি Self-Service Digital Platform। এটি কোনো সরকারি, স্বায়ত্তশাসিত, আধা-সরকারি, বিশ্ববিদ্যালয়, অফিস, দপ্তর বা প্রতিষ্ঠানের অফিসিয়াল সফটওয়্যার নয় এবং কোনো এমন কর্তৃপক্ষের নিয়ন্ত্রণাধীন নয়।'}</p>
            <p><b>২.</b> {en?'Only information necessary for supported personal calculations and career management is requested. Unnecessary personal or financial information is not required.':'শুধু স্বয়ংক্রিয় হিসাব ও ব্যক্তিগত Career Management-এর জন্য প্রয়োজনীয় তথ্য নেওয়া হয়। অপ্রয়োজনীয় ব্যক্তিগত বা আর্থিক তথ্যের প্রয়োজন নেই।'}</p>
            <p><b>৩.</b> {en?'The platform is not designed to sell, publish or commercially provide your personal, employment or calculation information to other users, businesses or third parties.':'ব্যবহারকারীর ব্যক্তিগত, চাকরিসংক্রান্ত বা হিসাবের তথ্য অন্য ব্যবহারকারী, ব্যবসা বা তৃতীয় পক্ষের কাছে বিক্রি, প্রকাশ বা বাণিজ্যিকভাবে সরবরাহ করার জন্য এই প্ল্যাটফর্ম তৈরি করা হয়নি।'}</p>
            <p><b>৪.</b> {en?'Your private dashboard, salary, leave, career and point records are intended for your own account use.':'ব্যক্তিগত Dashboard, Salary, Leave, Career ও Points তথ্য নিজের অ্যাকাউন্টের ব্যবহারের জন্য।'}</p>
            <p><b>৫.</b> {en?'Calculations depend on the information you provide. Incorrect, incomplete or outdated information may produce incorrect results; keeping your data accurate is your responsibility.':'হিসাব আপনার দেওয়া তথ্যের ওপর নির্ভর করে। ভুল, অসম্পূর্ণ বা পুরোনো তথ্য দিলে ফলাফল ভুল হতে পারে; তথ্য সঠিক ও হালনাগাদ রাখার দায়িত্ব ব্যবহারকারীর।'}</p>
            <p><b>৬.</b> {en?'Salary, promotion, service points, education points, house-allocation points, leave, retirement or career outputs are personal assistance calculations, not official orders, approvals or administrative decisions.':'বেতন, পদোন্নতি, সার্ভিস পয়েন্ট, শিক্ষাগত পয়েন্ট, বাসা বরাদ্দ পয়েন্ট, ছুটি, অবসর বা ক্যারিয়ার-সংক্রান্ত ফলাফল ব্যক্তিগত সহায়ক হিসাব; এগুলো কোনো অফিসিয়াল আদেশ, অনুমোদন বা প্রশাসনিক সিদ্ধান্ত নয়।'}</p>
            <p><b>৭.</b> {en?'Before taking an official or financial decision, check the latest applicable rule, circular, office order and the relevant authority.':'কোনো অফিসিয়াল বা আর্থিক সিদ্ধান্ত নেওয়ার আগে সর্বশেষ প্রযোজ্য নীতিমালা, বিজ্ঞপ্তি, অফিস আদেশ ও সংশ্লিষ্ট কর্তৃপক্ষের তথ্য যাচাই করুন।'}</p>
            <p><b>৮.</b> {en?'Use only your own identity and employment information. Do not create an account using another person’s identity, employee ID or records.':'শুধু নিজের পরিচয় ও চাকরিসংক্রান্ত তথ্য ব্যবহার করুন। অন্য ব্যক্তির পরিচয়, Employee ID বা রেকর্ড ব্যবহার করে অ্যাকাউন্ট তৈরি করবেন না।'}</p>
            <p><b>৯.</b> {en?'Your password and recovery code are private. Keep them secure and never share them with another person.':'Password ও Recovery Code ব্যক্তিগত ও গোপনীয়। এগুলো নিরাপদে রাখুন এবং অন্য কাউকে দেবেন না।'}</p>
            <p><b>১০.</b> {en?'Each user is responsible for the information they provide, how they use the platform, and decisions they make from the results. No other user assumes that responsibility.':'প্রত্যেক ব্যবহারকারী তার দেওয়া তথ্য, প্ল্যাটফর্ম ব্যবহারের ধরন এবং ফলাফলের ভিত্তিতে নেওয়া সিদ্ধান্তের জন্য নিজে দায়ী থাকবেন; অন্য কোনো ব্যবহারকারী সেই দায় বহন করবেন না।'}</p>
          </div>
          <div className="reg-consents">
            <label><input type="checkbox" checked={form.consent_read} onChange={e=>change('consent_read',e.target.checked)}/><span>{en?'I have read and understood the declaration, privacy information and terms above.':'আমি উপরের ঘোষণা, গোপনীয়তা ও ব্যবহারের শর্তগুলো সম্পূর্ণ পড়েছি এবং বুঝেছি।'}</span></label>
            <label><input type="checkbox" checked={form.consent_own} onChange={e=>change('consent_own',e.target.checked)}/><span>{en?'I confirm that I will provide my own information and I am responsible for its accuracy.':'আমি নিশ্চিত করছি যে নিজের তথ্য প্রদান করব এবং প্রদত্ত তথ্যের সঠিকতার দায়ভার আমার।'}</span></label>
            <label><input type="checkbox" checked={form.consent_advisory} onChange={e=>change('consent_advisory',e.target.checked)}/><span>{en?'I understand that this platform does not issue official or government decisions; its calculations are personal assistance.':'আমি বুঝেছি যে এই প্ল্যাটফর্ম কোনো অফিসিয়াল বা সরকারি সিদ্ধান্ত প্রদান করে না; এখানে প্রদর্শিত হিসাব ব্যক্তিগত সহায়ক হিসাব।'}</span></label>
          </div>
        </section>}

        {step===1&&<section className="reg-section"><div className="reg-section-head"><UserRound/><div><h2>{en?'Account Information':'অ্যাকাউন্ট তথ্য'}</h2><p>{en?'Information required to create and secure your account.':'অ্যাকাউন্ট তৈরি ও নিরাপদ রাখার জন্য প্রয়োজনীয় তথ্য।'}</p></div></div><div className="reg-grid">
          <label>{en?'Full name *':'পূর্ণ নাম *'}<input value={form.name} onChange={e=>change('name',e.target.value)} /></label>
          <label>{en?'Employee / Reference ID *':'কর্মচারী / রেফারেন্স আইডি *'}<input value={form.employee_reference} onChange={e=>change('employee_reference',e.target.value)}/></label>
          <label>{en?'Email *':'ইমেইল *'}<input type="email" value={form.email} onChange={e=>change('email',e.target.value)}/></label>
          <label>{en?'Account type *':'অ্যাকাউন্টের ধরন *'}<select value={form.account_type} onChange={e=>change('account_type',e.target.value)}><option value="employee">{en?'Employee':'কর্মচারী'}</option><option value="officer">{en?'Officer':'কর্মকর্তা'}</option></select></label>
          <label>{en?'Password *':'পাসওয়ার্ড *'}<input type="password" minLength="10" value={form.password} onChange={e=>change('password',e.target.value)}/><small>{en?'At least 10 characters with letters and numbers':'কমপক্ষে ১০ অক্ষর, অক্ষর ও সংখ্যা ব্যবহার করুন'}</small></label>
          <label>{en?'Confirm password *':'পাসওয়ার্ড নিশ্চিত করুন *'}<input type="password" minLength="10" value={form.confirm} onChange={e=>change('confirm',e.target.value)}/></label>
        </div></section>}

        {step===2&&<section className="reg-section"><div className="reg-section-head"><UserCircle2/><div><h2>{en?'Personal Information':'ব্যক্তিগত তথ্য'}</h2><p>{en?'Only information relevant to supported services is requested.':'সমর্থিত সেবার জন্য প্রয়োজনীয় তথ্যই এখানে নেওয়া হচ্ছে।'}</p></div></div><div className="reg-grid">
          <DMY label={en?'Date of birth *':'জন্মতারিখ *'} value={form.date_of_birth} onChange={v=>change('date_of_birth',v)}/>
          <label>{en?'Mobile number':'মোবাইল নম্বর'}<input value={form.mobile} onChange={e=>change('mobile',e.target.value)} inputMode="tel"/></label>
          <label>{en?'Gender *':'লিঙ্গ *'}<select value={form.gender} onChange={e=>change('gender',e.target.value)}><option value="male">{en?'Male':'পুরুষ'}</option><option value="female">{en?'Female':'নারী'}</option></select></label>
          <label>{en?'Marital status *':'বৈবাহিক অবস্থা *'}<select value={form.marital_status} onChange={e=>change('marital_status',e.target.value)}><option value="unmarried">{en?'Unmarried':'অবিবাহিত'}</option><option value="married">{en?'Married':'বিবাহিত'}</option></select></label>
        </div></section>}

        {step===3&&<section className="reg-section"><div className="reg-section-head"><Briefcase/><div><h2>{en?'Employment Information':'চাকরির তথ্য'}</h2><p>{en?'Used to prefill service, career, promotion and supported point calculations.':'চাকরিকাল, ক্যারিয়ার, পদোন্নতি ও সমর্থিত পয়েন্ট হিসাব স্বয়ংক্রিয়ভাবে পূরণে ব্যবহার হবে।'}</p></div></div><div className="reg-grid">
          <label>{en?'Employee category *':'কর্মী শ্রেণি *'}<select value={form.employee_category} onChange={e=>change('employee_category',e.target.value)}><option value="third_general">{en?'3rd Class General Employee':'৩য় শ্রেণির সাধারণ কর্মচারী'}</option><option value="third_technical">{en?'3rd Class Technical Employee':'৩য় শ্রেণির কারিগরি কর্মচারী'}</option><option value="fourth_general">{en?'4th Class General Employee':'৪র্থ শ্রেণির সাধারণ কর্মচারী'}</option><option value="fourth_technical">{en?'4th Class Technical Employee':'৪র্থ শ্রেণির কারিগরি কর্মচারী'}</option><option value="officer">{en?'Officer':'কর্মকর্তা'}</option><option value="teacher">{en?'Teacher':'শিক্ষক'}</option></select></label>
          <label>{en?'Current post / designation *':'বর্তমান পদ / পদবি *'}<input value={form.current_post} onChange={e=>change('current_post',e.target.value)}/></label>
          <label>{en?'Current grade *':'বর্তমান গ্রেড *'}<select value={form.current_grade} onChange={e=>change('current_grade',e.target.value)}><option value="">{en?'Select grade':'গ্রেড নির্বাচন করুন'}</option>{Array.from({length:20},(_,i)=>i+1).map(g=><option key={g} value={g}>{en?'Grade':'গ্রেড'} {numLang(g,lang,0)}</option>)}</select></label>
          <label>{en?'Department':'বিভাগ'}<input value={form.department_name} onChange={e=>change('department_name',e.target.value)}/></label>
          <label>{en?'Office / Unit':'অফিস / ইউনিট'}<input value={form.office_name} onChange={e=>change('office_name',e.target.value)}/></label>
          <DMY label={en?'First joining date *':'প্রথম যোগদানের তারিখ *'} value={form.first_joining_date} onChange={v=>change('first_joining_date',v)}/>
          <DMY label={en?'Current post joining date *':'বর্তমান পদে যোগদানের তারিখ *'} value={form.current_post_joining_date} onChange={v=>change('current_post_joining_date',v)}/>
          {(form.employee_category==='third_general'||form.employee_category==='third_technical')&&<DMY label={en?'Entered 3rd Class on':'৩য় শ্রেণিতে প্রবেশের তারিখ'} value={form.third_class_start_date} onChange={v=>change('third_class_start_date',v)}/>}
          {(form.employee_category==='third_general'||form.employee_category==='third_technical'||form.employee_category==='fourth_general'||form.employee_category==='fourth_technical')&&<DMY label={en?'Entered 4th Class on':'৪র্থ শ্রেণিতে প্রবেশের তারিখ'} value={form.fourth_class_start_date} onChange={v=>change('fourth_class_start_date',v)}/>}
          <label>{en?'Previous promotions received':'আগে পাওয়া পদোন্নতির সংখ্যা'}<input type="number" min="0" step="1" value={form.previous_promotions} onChange={e=>change('previous_promotions',e.target.value)}/></label>
        </div></section>}

        {step===4&&<section className="reg-section"><div className="reg-section-head"><GraduationCap/><div><h2>{en?'Educational Qualification':'শিক্ষাগত যোগ্যতা'}</h2><p>{en?'Select only the qualifications that apply to you.':'আপনার ক্ষেত্রে প্রযোজ্য শিক্ষাগত যোগ্যতাগুলো নির্বাচন করুন।'}</p></div></div><div className="reg-grid">
          <label>{en?'SSC result':'SSC ফলাফল'}<select value={form.ssc_result} onChange={e=>change('ssc_result',e.target.value)}><option value="">{en?'Not added':'যোগ করব না'}</option><option value="first">{en?'First Class / Division':'১ম শ্রেণি / বিভাগ'}</option><option value="second">{en?'Second Class / Division':'২য় শ্রেণি / বিভাগ'}</option><option value="third">{en?'Third Class / Division':'৩য় শ্রেণি / বিভাগ'}</option></select></label>
          <label>{en?'HSC result':'HSC ফলাফল'}<select value={form.hsc_result} onChange={e=>change('hsc_result',e.target.value)}><option value="">{en?'Not added':'যোগ করব না'}</option><option value="first">{en?'First Class / Division':'১ম শ্রেণি / বিভাগ'}</option><option value="second">{en?'Second Class / Division':'২য় শ্রেণি / বিভাগ'}</option><option value="third">{en?'Third Class / Division':'৩য় শ্রেণি / বিভাগ'}</option></select></label>
          <label>{en?'Bachelor type':'স্নাতকের ধরন'}<select value={form.bachelor_type} onChange={e=>change('bachelor_type',e.target.value)}><option value="">{en?'Not added':'যোগ করব না'}</option><option value="pass">{en?'Bachelor Pass':'স্নাতক (পাস)'}</option><option value="honours">{en?'Bachelor Honours':'স্নাতক (সম্মান)'}</option></select></label>
          {form.bachelor_type&&<label>{en?'Bachelor result':'স্নাতক ফলাফল'}<select value={form.bachelor_result} onChange={e=>change('bachelor_result',e.target.value)}><option value="">{en?'Select':'নির্বাচন করুন'}</option><option value="first">{en?'First Class':'১ম শ্রেণি'}</option><option value="second">{en?'Second Class':'২য় শ্রেণি'}</option><option value="third">{en?'Third Class':'৩য় শ্রেণি'}</option></select></label>}
          <label>{en?'Masters result':'স্নাতকোত্তর ফলাফল'}<select value={form.masters_result} onChange={e=>change('masters_result',e.target.value)}><option value="">{en?'Not added':'যোগ করব না'}</option><option value="first">{en?'First Class':'১ম শ্রেণি'}</option><option value="second">{en?'Second Class':'২য় শ্রেণি'}</option><option value="third">{en?'Third Class':'৩য় শ্রেণি'}</option></select></label>
        </div></section>}

        {step===5&&<section className="reg-section"><div className="reg-section-head"><WalletCards/><div><h2>{en?'Current Salary Information':'বর্তমান বেতন তথ্য'}</h2><p>{en?'Only the current basic salary and its effective date are requested here. No bank information is required.':'এখানে শুধু বর্তমান মূল বেতন ও কার্যকর তারিখ নেওয়া হচ্ছে। কোনো ব্যাংক তথ্য প্রয়োজন নেই।'}</p></div></div>
          <div className="reg-no-bank"><ShieldCheck/><span>{en?'No bank account, card, PIN, OTP or mobile-banking credential is collected.':'কোনো ব্যাংক অ্যাকাউন্ট, কার্ড, PIN, OTP বা মোবাইল ব্যাংকিংয়ের গোপন তথ্য নেওয়া হয় না।'}</span></div>
          <div className="reg-grid"><label>{en?'Current basic salary *':'বর্তমান মূল বেতন *'}<input type="number" min="0" step="1" value={form.current_basic_salary} onChange={e=>change('current_basic_salary',e.target.value)}/></label><DMY label={en?'Salary effective date':'বেতন কার্যকর হওয়ার তারিখ'} value={form.salary_effective_date} onChange={v=>change('salary_effective_date',v)}/></div>
        </section>}

        {step===6&&<section className="reg-section reg-review"><div className="reg-section-head"><CheckCircle2/><div><h2>{en?'Review and Create Account':'তথ্য যাচাই করে অ্যাকাউন্ট তৈরি করুন'}</h2><p>{en?'Check the important information once before creating the account.':'অ্যাকাউন্ট তৈরির আগে গুরুত্বপূর্ণ তথ্যগুলো আরেকবার দেখে নিন।'}</p></div></div>
          <div className="review-grid">
            <div><small>{en?'Name':'নাম'}</small><b>{form.name||'—'}</b></div><div><small>{en?'Reference ID':'রেফারেন্স আইডি'}</small><b>{form.employee_reference||'—'}</b></div>
            <div><small>{en?'Email':'ইমেইল'}</small><b>{form.email||'—'}</b></div><div><small>{en?'Current post':'বর্তমান পদ'}</small><b>{form.current_post||'—'}</b></div>
            <div><small>{en?'Grade':'গ্রেড'}</small><b>{form.current_grade?numLang(form.current_grade,lang,0):'—'}</b></div><div><small>{en?'First joining':'প্রথম যোগদান'}</small><b>{form.first_joining_date?fmtDateLang(form.first_joining_date,lang):'—'}</b></div>
            <div><small>{en?'Basic salary':'মূল বেতন'}</small><b>{form.current_basic_salary?`${en?'Tk':'৳'} ${moneyLang(form.current_basic_salary,lang)}`:'—'}</b></div><div><small>{en?'Employee category':'কর্মী শ্রেণি'}</small><b>{form.employee_category}</b></div>
          </div>
          <div className="reg-final-note"><ShieldCheck/><div><b>{en?'After account creation':'অ্যাকাউন্ট তৈরির পর'}</b><p>{en?'A one-time recovery code will be shown. Save it securely. Your saved profile information will be available to supported dashboard and calculator sections.':'একটি এককালীন Recovery Code দেখানো হবে। এটি নিরাপদে সংরক্ষণ করুন। সংরক্ষিত প্রোফাইল তথ্য সমর্থিত Dashboard ও Calculator অংশে স্বয়ংক্রিয়ভাবে পাওয়া যাবে।'}</p></div></div>
        </section>}

        {err&&<div className="error">{err}</div>}{msg&&<div className="auth-success">{msg}</div>}
        {recovery&&<div className="recovery-box"><div>{en?'YOUR RECOVERY CODE':'আপনার রিকভারি কোড'}</div><strong>{recovery}</strong><button type="button" onClick={()=>navigator.clipboard?.writeText(recovery)}>{en?'Copy Code':'কোড কপি করুন'}</button><small>{en?'Keep this code private and safe. It will not be shown again.':'কোডটি গোপন ও নিরাপদ স্থানে রাখুন। এটি পরে আর দেখানো হবে না।'}</small></div>}

        {!recovery&&<div className="reg-actions">{step>0&&<button type="button" className="reg-back" onClick={()=>{setErr('');setStep(v=>v-1)}}>{en?'Back':'পেছনে'}</button>}<button type="submit" disabled={busy}>{busy?(en?'Please wait...':'অপেক্ষা করুন...'):step===0?(en?'I Agree — Start Sign Up':'আমি সম্মত — সাইন আপ শুরু করুন'):step<6?(en?'Continue':'পরবর্তী ধাপ'):(en?'Create My Account':'আমার অ্যাকাউন্ট তৈরি করুন')}</button></div>}
        {recovery&&<button type="button" className="reg-login-after" onClick={()=>switchMode('login')}>{en?'I saved it — Go to Login':'সংরক্ষণ করেছি — লগইনে যান'}</button>}
      </form>
      {!recovery&&<div className="reg-login-link">{en?'Already have an account?':'আগে থেকেই অ্যাকাউন্ট আছে?'} <button type="button" onClick={()=>switchMode('login')}>{en?'Login':'লগইন করুন'}</button></div>}
    </div>
  </div>;

  const title=mode==='forgot'?(en?'Recover your account':'অ্যাকাউন্ট পুনরুদ্ধার করুন'):(en?'Login for Backup & Sync':'Backup & Sync-এর জন্য লগইন');
  return <div className="login-shell phase8-auth"><form className="login-card phase8-card" onSubmit={submit}>
    <div className="login-top"><button type="button" className="back-link" onClick={onBack}>{en?'← Back to Home':'← হোমে ফিরুন'}</button><LangToggle lang={lang} setLang={setLang}/></div>
    <div className="auth-badge"><ShieldCheck size={15}/>{en?'OPTIONAL BACKUP & SYNC':'ঐচ্ছিক BACKUP & SYNC'}</div>
    <h1>{title}</h1><p>{en?'Hisab Sahayika · Independent calculation assistant':'হিসাব সহায়িকা · স্বাধীন হিসাব সহায়ক প্ল্যাটফর্ম'}</p><div className="auth-guest-note"><CheckCircle2/><span>{en?'No login is required for calculators, local profile, salary history, leave records or reports. Login is only for Cloud Backup, Sync, Recovery and multi-device use.':'ক্যালকুলেটর, Local Profile, বেতন ইতিহাস, ছুটি বা রিপোর্ট ব্যবহারে লগইন লাগবে না। লগইন শুধু Cloud Backup, Sync, Recovery ও একাধিক ডিভাইসে ব্যবহারের জন্য।'}</span></div>
    <label>{en?'Email':'ইমেইল'}<input value={form.email} onChange={e=>change('email',e.target.value)} type="email" required/></label>
    {mode==='forgot'&&<label>{en?'Recovery code':'রিকভারি কোড'}<input value={form.recovery_code} onChange={e=>change('recovery_code',e.target.value)} placeholder="XXXX-XXXX-XXXX-XXXX" required/></label>}
    <label>{mode==='forgot'?(en?'New password':'নতুন পাসওয়ার্ড'):(en?'Password':'পাসওয়ার্ড')}<input value={form.password} onChange={e=>change('password',e.target.value)} type="password" minLength="10" required/></label>
    {mode==='forgot'&&<label>{en?'Confirm password':'পাসওয়ার্ড নিশ্চিত করুন'}<input value={form.confirm} onChange={e=>change('confirm',e.target.value)} type="password" minLength="10" required/></label>}
    {err&&<div className="error">{err}</div>}{msg&&<div className="auth-success">{msg}</div>}
    <button disabled={busy}>{busy?(en?'Please wait...':'অপেক্ষা করুন...'):mode==='forgot'?(en?'Reset Password':'পাসওয়ার্ড পরিবর্তন করুন'):(en?'Login':'লগইন')}</button>
    <div className="auth-links">{mode==='login'&&<><button type="button" onClick={()=>switchMode('forgot')}>{en?'Forgot password?':'পাসওয়ার্ড ভুলে গেছেন?'}</button><button type="button" onClick={()=>switchMode('register')}>{en?'Create new account':'নতুন অ্যাকাউন্ট তৈরি করুন'}</button></>}{mode==='forgot'&&<button type="button" onClick={()=>switchMode('login')}>{en?'Back to login':'লগইনে ফিরুন'}</button>}</div>
  </form></div>
}

function AccountSecurity({lang='bn'}){
  const en=lang==='en'; const [f,setF]=useState({current_password:'',new_password:'',confirm:''}),[busy,setBusy]=useState(false),[err,setErr]=useState(''),[msg,setMsg]=useState(''),[recovery,setRecovery]=useState('');
  async function save(e){e.preventDefault();setErr('');setMsg('');if(f.new_password!==f.confirm)return setErr(en?'New passwords do not match':'নতুন পাসওয়ার্ড দুটি মিলছে না');setBusy(true);try{await api('/api/change-password',{method:'POST',body:JSON.stringify({current_password:f.current_password,new_password:f.new_password})});setF({current_password:'',new_password:'',confirm:''});setMsg(en?'Password changed successfully.':'পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে।')}catch(e){setErr(e.message)}finally{setBusy(false)}}
  async function regen(){const p=prompt(en?'Enter your current password to create a new recovery code:':'নতুন রিকভারি কোড তৈরির জন্য বর্তমান পাসওয়ার্ড লিখুন:');if(!p)return;setErr('');setMsg('');try{const x=await api('/api/recovery-code/regenerate',{method:'POST',body:JSON.stringify({current_password:p})});setRecovery(x.recoveryCode);setMsg(en?'New recovery code created. Save it now.':'নতুন রিকভারি কোড তৈরি হয়েছে। এখনই সংরক্ষণ করুন।')}catch(e){setErr(e.message)}}
  return <div><div className="page-head"><div><h2>{en?'Account & Security':'অ্যাকাউন্ট ও নিরাপত্তা'}</h2><p>{en?'Manage your password and private recovery code.':'নিজের পাসওয়ার্ড ও ব্যক্তিগত রিকভারি কোড পরিচালনা করুন।'}</p></div></div>
    <section className="calc-card security-card"><form onSubmit={save} className="form-grid">
      <label>{en?'Current password':'বর্তমান পাসওয়ার্ড'}<input type="password" value={f.current_password} onChange={e=>setF({...f,current_password:e.target.value})} required/></label>
      <label>{en?'New password':'নতুন পাসওয়ার্ড'}<input type="password" minLength="10" value={f.new_password} onChange={e=>setF({...f,new_password:e.target.value})} required/></label>
      <label>{en?'Confirm new password':'নতুন পাসওয়ার্ড নিশ্চিত করুন'}<input type="password" minLength="10" value={f.confirm} onChange={e=>setF({...f,confirm:e.target.value})} required/></label>
      {err&&<div className="error span-2">{err}</div>}{msg&&<div className="auth-success span-2">{msg}</div>}
      <div className="span-2"><button className="primary" disabled={busy}><LockKeyhole size={16}/>{en?'Change Password':'পাসওয়ার্ড পরিবর্তন করুন'}</button></div>
    </form></section>
    <section className="calc-card security-card"><h3>{en?'Recovery Code':'রিকভারি কোড'}</h3><p>{en?'Use this private code if you forget your password. The server stores only its hash.':'পাসওয়ার্ড ভুলে গেলে এই ব্যক্তিগত কোড ব্যবহার করবেন। সার্ভারে শুধু এর হ্যাশ সংরক্ষিত থাকে।'}</p>
      {recovery&&<div className="recovery-box"><strong>{recovery}</strong><button type="button" onClick={()=>navigator.clipboard?.writeText(recovery)}>{en?'Copy Code':'কোড কপি করুন'}</button></div>}
      <button className="ghost-btn" type="button" onClick={regen}>{en?'Generate New Recovery Code':'নতুন রিকভারি কোড তৈরি করুন'}</button>
    </section></div>
}
function PublicPayScaleHub({lang='bn'}){
  const en=lang==='en';
  const grades=Object.entries(PAY2026).map(([grade,arr])=>({grade,min:arr[0],max:arr[arr.length-1]}));
  return <section className="approved-section public-pay-hub" id="pay-scale-2026">
    <div className="approved-section-title">
      <span>{en?'OFFICIAL GAZETTE · 17 SEP 2026':'সরকারি গেজেট · ১৭ সেপ্টেম্বর ২০২৬'}</span>
      <h2>{en?'Dhaka University Pay Scale 2026 Calculator':'ঢাকা বিশ্ববিদ্যালয় পে-স্কেল ২০২৬ ক্যালকুলেটর'}</h2>
      <p>{en?'Independent calculation assistant using the applicable Public Bodies pay rules and supported DU-related calculation inputs. This is not an official University of Dhaka service.':'প্রযোজ্য Public Bodies বেতন বিধান ও সমর্থিত ঢাকা বিশ্ববিদ্যালয়-সংশ্লিষ্ট হিসাব তথ্য ব্যবহার করে এই স্বাধীন ক্যালকুলেটর কাজ করে। এটি ঢাকা বিশ্ববিদ্যালয়ের কোনো অফিসিয়াল সেবা নয়।'}</p>
    </div>
    <div className="public-pay-facts">
      <article><b>{en?'1 Jul 2026':'১ জুলাই ২০২৬'}</b><span>{en?'Phase 1: 40% (Grade 1–9) / 50% (Grade 10–20) of the difference':'১ম কিস্তি: পার্থক্যের ৪০% (গ্রেড ১–৯) / ৫০% (গ্রেড ১০–২০)'}</span></article>
      <article><b>{en?'1 Jan 2027':'১ জানুয়ারি ২০২৭'}</b><span>{en?'Phase 2: 70% / 75% of the difference':'২য় কিস্তি: পার্থক্যের ৭০% / ৭৫%'}</span></article>
      <article><b>{en?'1 Jul 2027':'১ জুলাই ২০২৭'}</b><span>{en?'Full basic with applicable annual increment(s)':'প্রাপ্য বার্ষিক ইনক্রিমেন্টসহ পূর্ণ মূল বেতন'}</span></article>
      <article><b>{en?'1 Jan 2028':'১ জানুয়ারি ২০২৮'}</b><span>{en?'New allowance rates become effective':'নতুন ভাতার হার কার্যকর'}</span></article>
      <article><b>{en?'1 Jul 2028':'১ জুলাই ২০২৮'}</b><span>{en?'Next annual increment; basic-linked allowances and deductions recalculate':'পরবর্তী বার্ষিক ইনক্রিমেন্ট; মূল বেতননির্ভর ভাতা ও কর্তন পুনঃহিসাব'}</span></article>
    </div>
    <SalaryCalculator lang={lang} publicMode={true}/>
    <details className="public-pay-table">
      <summary>{en?'View official grade-wise 2026 pay scale':'গ্রেডভিত্তিক ২০২৬ বেতনস্কেল দেখুন'}</summary>
      <div className="table-wrap"><table><thead><tr><th>{en?'Grade':'গ্রেড'}</th><th>{en?'Starting basic':'প্রারম্ভিক মূল বেতন'}</th><th>{en?'Maximum basic':'সর্বোচ্চ মূল বেতন'}</th></tr></thead>
      <tbody>{grades.map(x=><tr key={x.grade}><td>{numLang(x.grade,lang,0)}</td><td>{en?'Tk ':'৳'}{moneyLang(x.min,lang)}</td><td>{en?'Tk ':'৳'}{moneyLang(x.max,lang)}</td></tr>)}</tbody></table></div>
    </details>
    <div className="public-pay-source"><ShieldCheck/><div><b>{PAY_SCALE_2026_META.order}</b><span>{PAY_SCALE_2026_META.sro} · {en?'Bangladesh Gazette, 17 September 2026':'বাংলাদেশ গেজেট, ১৭ সেপ্টেম্বর ২০২৬'}</span></div></div>
  </section>
}

function PwaReferenceCenter({lang='bn',notices=[],policies=[]}){
  const en=lang==='en';
  const rows=[
    ...notices.map(x=>({...x,_type:'notice'})),
    ...policies.map(x=>({...x,_type:'policy'}))
  ];
  return <div className="pwa-reference-center">
    <div className="pwa-reference-head"><BookOpen/><div><small>{en?'REFERENCE':'রেফারেন্স'}</small><h2>{en?'Notices & Policies':'নোটিশ ও নীতিমালা'}</h2><p>{en?'Public reference information available without login.':'লগইন ছাড়াই প্রকাশিত রেফারেন্স তথ্য দেখুন।'}</p></div></div>
    <div className="pwa-reference-list">{rows.length?rows.map((x,i)=><article key={(x._type||'x')+'-'+(x.id||i)}><span className={x._type}>{x._type==='notice'?<Bell/>:<BookOpen/>}</span><div><small>{x._type==='notice'?(en?'NOTICE':'নোটিশ'):(en?'POLICY / RULE':'নীতিমালা / বিধি')}</small><b>{x.title||x.name||x.subject||x.title_bn||x.title_en}</b><p>{x.summary||x.description||x.summary_bn||x.summary_en||''}</p></div></article>):<div className="pwa-reference-empty">{en?'No published reference is available right now.':'এই মুহূর্তে কোনো প্রকাশিত রেফারেন্স পাওয়া যায়নি।'}</div>}</div>
    <div className="pwa-reference-note"><ShieldAlert/>{en?'Use as a personal reference aid and verify the latest published source before an official or financial decision.':'ব্যক্তিগত রেফারেন্স হিসেবে ব্যবহার করুন; অফিসিয়াল বা আর্থিক সিদ্ধান্তের আগে সর্বশেষ প্রকাশিত উৎস যাচাই করুন।'}</div>
  </div>;
}

function PwaStandaloneShell({lang='bn',setLang,activePublicTool,openPublicTool,setActivePublicTool,onLogin,onSignup,pwaStats,mobileCalcOpen,setMobileCalcOpen,notices=[],policies=[]}){
  const en=lang==='en';
  const [appStatus,setAppStatus]=useState(()=>getPwaState());
  const [recent,setRecent]=useState(()=>{
    try{return JSON.parse(localStorage.getItem('hisab_recent_tools')||'[]').slice(0,3)}catch{return[]}
  });
  useEffect(()=>subscribePwa(setAppStatus),[]);
  const labels={
    salary:en?'Pay Scale':'পে-স্কেল',
    arrear:en?'Arrear':'বকেয়া',
    promotion:en?'Promotion':'পদোন্নতি',
    house:en?'House Points':'বাসা পয়েন্ট',
    service:en?'Service Length':'চাকরিকাল',
    age:en?'Age':'বয়স',
    gap:en?'Date Gap':'তারিখ ব্যবধান',
    retire:en?'Retirement':'অবসর',
    basic:en?'Basic Projection':'মূল বেতন প্রক্ষেপণ',
    points:en?'Points Center':'পয়েন্ট',
    calendar:en?'Calendar':'ক্যালেন্ডার',
    reference:en?'Notices & Policies':'নোটিশ ও নীতিমালা',
    'pdf-center':en?'PDF Center':'PDF সেন্টার',
    'local-dashboard':en?'My Workspace':'আমার',
    'local-profile':en?'Career Profile':'চাকরি তথ্য',
    'local-education':en?'Education':'শিক্ষা',
    'local-timeline':en?'Career Timeline':'টাইমলাইন',
    'local-salary':en?'Salary History':'বেতন ইতিহাস',
    'local-leave':en?'Leave Records':'ছুটি',
    'local-reports':en?'My Reports':'রিপোর্ট',
    'local-privacy':en?'Data & Backup':'ডাটা ও ব্যাকআপ'
  };
  const icons={salary:WalletCards,arrear:ReceiptText,promotion:TrendingUp,house:Home,service:Clock3,age:UserRound,gap:CalendarDays,retire:FileClock,basic:BadgeDollarSign,points:Award,calendar:CalendarDays,reference:BookOpen,'pdf-center':FileText,'local-dashboard':UserRound};
  const open=(tool)=>{
    const next=[tool,...recent.filter(x=>x!==tool)].slice(0,3);
    setRecent(next);
    localStorage.setItem('hisab_recent_tools',JSON.stringify(next));
    openPublicTool(tool);
  };
  const goHome=()=>{setActivePublicTool(null);setMobileCalcOpen(false);window.scrollTo({top:0,behavior:'smooth'})};
  const updated=formatPwaTime(appStatus.lastAutoUpdateAt||appStatus.build?.built_at||'',lang);
  const localProfile=guestLocalProfile();
  const tools=[
    ['salary',WalletCards,en?'Pay Scale 2026':'পে-স্কেল ২০২৬','indigo'],
    ['arrear',ReceiptText,en?'Arrear':'বকেয়া / এরিয়ার','aqua'],
    ['promotion',TrendingUp,en?'Promotion':'পদোন্নতি','violet'],
    ['points',Award,en?'Points':'পয়েন্ট হিসাব','teal'],
    ['house',Home,en?'House Points':'বাসা বরাদ্দ পয়েন্ট','gold'],
    ['service',Clock3,en?'Service Length':'চাকরিকাল','aqua'],
    ['retire',FileClock,en?'Retirement Date':'অবসর তারিখ','amber'],
    ['calendar',CalendarDays,en?'Office Calendar':'অফিস ক্যালেন্ডার','sky']
  ];
  const moreTools=[
    ['age',UserRound,en?'Age':'বয়স','sky'],
    ['gap',CalendarDays,en?'Date Difference':'তারিখের ব্যবধান','blue'],
    ['basic',BadgeDollarSign,en?'Basic Projection':'মূল বেতন প্রক্ষেপণ','indigo'],
    ['pdf-center',FileText,en?'PDF Center':'PDF সেন্টার','violet'],
    ['reference',BookOpen,en?'Notices & Policies':'নোটিশ ও নীতিমালা','teal']
  ];
  const localServices=[
    ['local-dashboard',LayoutDashboard,en?'My Dashboard':'আমার ড্যাশবোর্ড'],
    ['local-profile',Briefcase,en?'Career Profile':'চাকরি তথ্য'],
    ['local-education',GraduationCap,en?'Education':'শিক্ষা'],
    ['local-timeline',Route,en?'Career Timeline':'টাইমলাইন'],
    ['local-salary',WalletCards,en?'Salary History':'বেতন ইতিহাস'],
    ['local-leave',CalendarDays,en?'Leave Records':'ছুটি'],
    ['local-reports',FileText,en?'My Reports':'রিপোর্ট'],
    ['local-privacy',ShieldCheck,en?'Data & Backup':'ডাটা ও ব্যাকআপ']
  ];
  const localMode=tool=>tool.startsWith('local-')?tool.slice(6):'dashboard';

  const desktopSidebar=<aside className="pwa-desktop-sidebar" aria-label={en?'App navigation':'অ্যাপ নেভিগেশন'}>
    <button className="pwa-desktop-brand" onClick={goHome}>
      <span>হি</span><div><b>{en?'Hisab Sahayika':'হিসাব সহায়িকা'}</b><small>{en?'Independent calculation app':'স্বাধীন হিসাব সহায়ক অ্যাপ'}</small></div>
    </button>
    <nav className="pwa-desktop-nav">
      <div className="pwa-desktop-nav-group">
        <small>{en?'MAIN':'প্রধান'}</small>
        <button className={!activePublicTool?'active':''} onClick={goHome}><LayoutDashboard/><span>{en?'Dashboard':'ড্যাশবোর্ড'}</span></button>
        <button className={activePublicTool==='salary'?'active':''} onClick={()=>open('salary')}><WalletCards/><span>{en?'Pay Scale & Salary':'পে-স্কেল ও বেতন'}</span></button>
        <button className={activePublicTool==='arrear'?'active':''} onClick={()=>open('arrear')}><ReceiptText/><span>{en?'Arrear':'বকেয়া / এরিয়ার'}</span></button>
        <button className={activePublicTool==='promotion'?'active':''} onClick={()=>open('promotion')}><TrendingUp/><span>{en?'Promotion':'পদোন্নতি'}</span></button>
      </div>
      <div className="pwa-desktop-nav-group">
        <small>{en?'CALCULATIONS':'হিসাব'}</small>
        <button className={activePublicTool==='points'?'active':''} onClick={()=>open('points')}><Award/><span>{en?'Points':'পয়েন্ট হিসাব'}</span></button>
        <button className={activePublicTool==='house'?'active':''} onClick={()=>open('house')}><Home/><span>{en?'House Allocation':'বাসা বরাদ্দ'}</span></button>
        <button className={activePublicTool==='service'?'active':''} onClick={()=>open('service')}><Clock3/><span>{en?'Service Length':'চাকরিকাল'}</span></button>
        <button className={activePublicTool==='retire'?'active':''} onClick={()=>open('retire')}><FileClock/><span>{en?'Retirement':'অবসর তারিখ'}</span></button>
        <button className={activePublicTool==='calendar'?'active':''} onClick={()=>open('calendar')}><CalendarDays/><span>{en?'Office Calendar':'অফিস ক্যালেন্ডার'}</span></button>
      </div>
      <div className="pwa-desktop-nav-group compact">
        <small>{en?'MORE TOOLS':'আরও টুল'}</small>
        <button className={activePublicTool==='age'?'active':''} onClick={()=>open('age')}><UserRound/><span>{en?'Age':'বয়স'}</span></button>
        <button className={activePublicTool==='gap'?'active':''} onClick={()=>open('gap')}><CalendarDays/><span>{en?'Date Difference':'তারিখের ব্যবধান'}</span></button>
        <button className={activePublicTool==='basic'?'active':''} onClick={()=>open('basic')}><BadgeDollarSign/><span>{en?'Basic Projection':'মূল বেতন প্রক্ষেপণ'}</span></button>
        <button className={activePublicTool==='pdf-center'?'active':''} onClick={()=>open('pdf-center')}><FileText/><span>{en?'PDF Center':'PDF সেন্টার'}</span></button>
        <button className={activePublicTool==='reference'?'active':''} onClick={()=>open('reference')}><BookOpen/><span>{en?'Notices & Policies':'নোটিশ ও নীতিমালা'}</span></button>
      </div>
      <div className="pwa-desktop-nav-group personal">
        <small>{en?'MY SPACE · LOCAL':'আমার অংশ · LOCAL'}</small>
        <button className={activePublicTool==='local-dashboard'?'active':''} onClick={()=>open('local-dashboard')}><UserRound/><span>{en?'My Dashboard':'আমার ড্যাশবোর্ড'}</span></button>
        <button className={activePublicTool==='local-profile'?'active':''} onClick={()=>open('local-profile')}><Briefcase/><span>{en?'Career Profile':'চাকরি তথ্য'}</span></button>
        <button className={activePublicTool==='local-education'?'active':''} onClick={()=>open('local-education')}><GraduationCap/><span>{en?'Education':'শিক্ষা'}</span></button>
        <button className={activePublicTool==='local-timeline'?'active':''} onClick={()=>open('local-timeline')}><Route/><span>{en?'Career Timeline':'ক্যারিয়ার টাইমলাইন'}</span></button>
        <button className={activePublicTool==='local-salary'?'active':''} onClick={()=>open('local-salary')}><WalletCards/><span>{en?'Salary History':'বেতন ইতিহাস'}</span></button>
        <button className={activePublicTool==='local-leave'?'active':''} onClick={()=>open('local-leave')}><CalendarDays/><span>{en?'Leave Records':'ছুটি'}</span></button>
        <button className={activePublicTool==='local-reports'?'active':''} onClick={()=>open('local-reports')}><FileText/><span>{en?'My Reports':'রিপোর্ট'}</span></button>
        <button className={activePublicTool==='local-privacy'?'active':''} onClick={()=>open('local-privacy')}><ShieldCheck/><span>{en?'Data & Backup':'ডাটা ও ব্যাকআপ'}</span></button>
      </div>
    </nav>
    <div className="pwa-desktop-sidebar-footer">
      <button className="pwa-desktop-sync" onClick={onLogin}><Cloud/><div><b>{en?'Backup & Sync':'ব্যাকআপ ও সিঙ্ক'}</b><small>{en?'Login only when you need cloud sync':'Cloud sync দরকার হলেই লগইন'}</small></div><ChevronRight/></button>
      <div className="pwa-desktop-disclaimer"><ShieldAlert/><span>{en?'Independent & unofficial':'স্বাধীন ও অনানুষ্ঠানিক'}</span></div>
    </div>
  </aside>;

  if(activePublicTool){
    const title=labels[activePublicTool]||'';
    return <div className="pwa-app-shell approved-home pwa-tool-shell">
      {desktopSidebar}
      <header className="pwa-app-topbar tool">
        <button className="pwa-round-btn" onClick={goHome} aria-label={en?'Back':'ফিরুন'}><ArrowLeft/></button>
        <div><small>{en?'HISAB SAHAYIKA':'হিসাব সহায়িকা'}</small><b>{title}</b></div>
        <PwaControls lang={lang}/>
      </header>
      <main className="pwa-tool-content">
        {['salary','arrear'].includes(activePublicTool)&&<SalaryCalculator lang={lang} publicMode={true} initialArrear={activePublicTool==='arrear'}/>}
        {activePublicTool==='promotion'&&<section className="public-tool-only-shell"><PromotionCenter lang={lang} publicMode={true}/></section>}
        {activePublicTool==='house'&&<section className="public-tool-only-shell"><HouseAllocationPoints lang={lang} publicMode={true}/></section>}
        {['service','age','gap','retire','basic'].includes(activePublicTool)&&<section className="public-tool-only-shell"><CalculatorCenter lang={lang} publicMode={true} initialTool={activePublicTool} singleTool={true}/></section>}
        {activePublicTool==='points'&&<section className="public-tool-only-shell"><PointsCalculator lang={lang} publicMode={true}/></section>}
        {activePublicTool==='calendar'&&<section className="public-tool-only-shell"><FiscalOfficeCalendar lang={lang}/></section>}
        {activePublicTool==='reference'&&<PwaReferenceCenter lang={lang} notices={notices} policies={policies}/>}
        {activePublicTool==='pdf-center'&&<PdfCenter lang={lang}/>}
        {activePublicTool?.startsWith('local-')&&<GuestLocalCenter mode={localMode(activePublicTool)} lang={lang} onOpen={open} onLogin={onLogin}/>}
      </main>
      <nav className="pwa-app-bottom">
        <button onClick={goHome}><Home/><span>{en?'Home':'হোম'}</span></button>
        <button className={activePublicTool==='salary'?'active':''} onClick={()=>open('salary')}><WalletCards/><span>{en?'Salary':'বেতন'}</span></button>
        <button className={activePublicTool==='promotion'?'active':''} onClick={()=>open('promotion')}><TrendingUp/><span>{en?'Career':'ক্যারিয়ার'}</span></button>
        <button onClick={()=>setMobileCalcOpen(true)}><Boxes/><span>{en?'Services':'সেবা'}</span></button>
        <button className={activePublicTool?.startsWith('local-')?'active':''} onClick={()=>open('local-dashboard')}><UserRound/><span>{en?'My':'আমার'}</span></button>
      </nav>
      {mobileCalcOpen&&<div className="pwa-service-sheet-backdrop" onClick={()=>setMobileCalcOpen(false)}>
        <section className="pwa-service-sheet" onClick={e=>e.stopPropagation()}>
          <div className="pwa-service-sheet-head"><div><small>{en?'ALL SERVICES':'সব সেবা'}</small><h3>{en?'Choose what you need':'যেটা দরকার সেটি বেছে নিন'}</h3></div><button onClick={()=>setMobileCalcOpen(false)}><X/></button></div>
          <div className="pwa-sheet-grid">{[...tools,...moreTools].map(([key,I,title,tone])=><button key={key} onClick={()=>{setMobileCalcOpen(false);open(key)}}><span className={tone}><I/></span><b>{title}</b></button>)}</div>
          <div className="pwa-sheet-group-title">{en?'PERSONAL · NO LOGIN REQUIRED':'ব্যক্তিগত · লগইন লাগবে না'}</div>
          <div className="pwa-sheet-grid personal">{localServices.map(([key,I,title])=><button key={key} onClick={()=>{setMobileCalcOpen(false);open(key)}}><span className="local"><I/></span><b>{title}</b></button>)}</div>
          <button className="pwa-sheet-dashboard" onClick={()=>{setMobileCalcOpen(false);open('local-dashboard')}}><LayoutDashboard/><div><b>{en?'My Local Dashboard':'আমার Local ড্যাশবোর্ড'}</b><small>{en?'Profile, salary history, leave, reports and more without login':'চাকরি তথ্য, বেতন ইতিহাস, ছুটি, রিপোর্টসহ সবকিছু লগইন ছাড়াই'}</small></div><ChevronRight/></button>
          <button className="pwa-sheet-sync" onClick={onLogin}><Cloud/><span>{en?'Login only for Backup & Sync':'শুধু Backup & Sync-এর জন্য লগইন'}</span></button>
        </section>
      </div>}
    </div>;
  }

  return <div className="pwa-app-shell approved-home">
    {desktopSidebar}
    <header className="pwa-app-topbar">
      <div className="pwa-app-brand"><span>হি</span><div><b>{en?'Hisab Sahayika':'হিসাব সহায়িকা'}</b><small>{en?'Independent calculation assistant':'স্বাধীন হিসাব সহায়ক অ্যাপ'}</small></div></div>
      <div className="pwa-app-head-actions"><button className="pwa-round-btn" onClick={()=>setLang(lang==='bn'?'en':'bn')}>{en?'বাং':'EN'}</button><PwaControls lang={lang}/><button className="pwa-round-btn" onClick={()=>open('local-dashboard')}><UserRound/></button></div>
    </header>

    <main className="pwa-app-home">
      <section className="pwa-welcome-card">
        <div className="pwa-welcome-copy"><small>{en?'WELCOME':'স্বাগতম'}</small><h1>{en?'What would you like to calculate today?':'আজ কোন হিসাবটি করতে চান?'}</h1><p>{en?'Choose a service below and get the result in a few simple steps.':'নিচের একটি সেবা নির্বাচন করুন এবং কয়েকটি সহজ ধাপে হিসাব দেখুন।'}</p></div>
        <div className="pwa-welcome-meta">
          <span><RefreshCw/><div><small>{en?'Latest update':'সর্বশেষ আপডেট'}</small><b>{updated}</b></div></span>
          <span><Users/><div><small>{en?'App installs':'অ্যাপ ইনস্টল'}</small><b>{pwaStats.total_installs==null?'—':numLang(pwaStats.total_installs,lang,0)}</b></div></span>
        </div>
      </section>

      {(localProfile.grade||localProfile.category||localProfile.first_joining_date||localProfile.current_post)&&<section className="pwa-profile-strip">
        <span><small>{en?'Grade':'গ্রেড'}</small><b>{localProfile.grade?(en?`Grade ${localProfile.grade}`:`গ্রেড ${numLang(localProfile.grade,'bn',0)}`):'—'}</b></span>
        <span><small>{en?'Category':'শ্রেণি'}</small><b>{localProfile.category?duCategoryInfo(localProfile.category,lang).label:'—'}</b></span>
        <span><small>{en?'Joined':'যোগদান'}</small><b>{localProfile.first_joining_date?fmtDateLang(localProfile.first_joining_date,lang):'—'}</b></span>
        <button onClick={()=>open('local-profile')}>{en?'Edit':'সম্পাদনা'}<ChevronRight/></button>
      </section>}

      <section className="pwa-home-section">
        <div className="pwa-section-head"><div><small>{en?'QUICK ACTIONS':'দ্রুত সেবা'}</small><h2>{en?'Your calculators':'আপনার প্রয়োজনীয় হিসাব'}</h2></div><button onClick={()=>setMobileCalcOpen(true)}>{en?'See all':'সব দেখুন'}<ChevronRight/></button></div>
        <div className="pwa-quick-grid">
          {tools.map(([key,I,title,tone])=><button key={key} onClick={()=>open(key)}><span className={tone}><I/></span><b>{title}</b></button>)}
          <button onClick={()=>setMobileCalcOpen(true)}><span className="more"><Boxes/></span><b>{en?'More':'আরও সেবা'}</b></button>
        </div>
      </section>

      <section className="pwa-personal-card" onClick={()=>open('local-dashboard')} role="button" tabIndex={0}>
        <div className="pwa-personal-icon"><LayoutDashboard/></div>
        <div><small>{en?'YOUR SPACE · LOCAL':'আপনার ব্যক্তিগত অংশ · LOCAL'}</small><h3>{en?'My Dashboard':'আমার ড্যাশবোর্ড'}</h3><p>{en?'Profile, education, career timeline, salary history, leave and reports — no login required.':'চাকরি তথ্য, শিক্ষা, টাইমলাইন, বেতন ইতিহাস, ছুটি ও রিপোর্ট—সব লগইন ছাড়াই।'}</p></div>
        <ChevronRight/>
      </section>

      {recent.length>0&&<section className="pwa-home-section recent">
        <div className="pwa-section-head"><div><small>{en?'RECENT':'সাম্প্রতিক'}</small><h2>{en?'Recently used':'সাম্প্রতিক ব্যবহৃত'}</h2></div></div>
        <div className="pwa-recent-row">{recent.map(key=>{const I=icons[key]||Calculator;return <button key={key} onClick={()=>open(key)}><span><I/></span><b>{labels[key]||key}</b><ChevronRight/></button>})}</div>
      </section>}

      {(notices.length>0||policies.length>0)&&<section className="pwa-home-section pwa-info-strip">
        <div className="pwa-section-head"><div><small>{en?'INFO':'তথ্য'}</small><h2>{en?'Useful updates':'প্রয়োজনীয় তথ্য'}</h2></div></div>
        <div className="pwa-info-cards">
          {notices.slice(0,1).map((x,i)=><article key={'n'+(x.id||i)}><Bell/><div><small>{en?'Notice':'নোটিশ'}</small><b>{x.title||x.name||x.subject}</b></div></article>)}
          {policies.slice(0,1).map((x,i)=><article key={'p'+(x.id||i)}><BookOpen/><div><small>{en?'Reference':'রেফারেন্স'}</small><b>{x.title||x.name||x.subject}</b></div></article>)}
        </div>
      </section>}

      <section className="pwa-home-footer-note"><ShieldAlert/><span>{en?'Independent and unofficial calculation assistant. No official affiliation with the University of Dhaka.':'স্বাধীন ও অনানুষ্ঠানিক হিসাব সহায়ক অ্যাপ। ঢাকা বিশ্ববিদ্যালয়ের সঙ্গে কোনো অফিসিয়াল সম্পর্ক নেই।'}</span></section>
    </main>

    <nav className="pwa-app-bottom">
      <button className="active" onClick={goHome}><Home/><span>{en?'Home':'হোম'}</span></button>
      <button onClick={()=>open('salary')}><WalletCards/><span>{en?'Salary':'বেতন'}</span></button>
      <button onClick={()=>open('promotion')}><TrendingUp/><span>{en?'Career':'ক্যারিয়ার'}</span></button>
      <button onClick={()=>setMobileCalcOpen(true)}><Boxes/><span>{en?'Services':'সেবা'}</span></button>
      <button onClick={()=>open('local-dashboard')}><UserRound/><span>{en?'My':'আমার'}</span></button>
    </nav>

    {mobileCalcOpen&&<div className="pwa-service-sheet-backdrop" onClick={()=>setMobileCalcOpen(false)}>
      <section className="pwa-service-sheet" onClick={e=>e.stopPropagation()}>
        <div className="pwa-service-sheet-head"><div><small>{en?'ALL SERVICES':'সব সেবা'}</small><h3>{en?'Choose what you need':'যেটা দরকার সেটি বেছে নিন'}</h3></div><button onClick={()=>setMobileCalcOpen(false)}><X/></button></div>
        <div className="pwa-sheet-grid">{[...tools,...moreTools].map(([key,I,title,tone])=><button key={key} onClick={()=>{setMobileCalcOpen(false);open(key)}}><span className={tone}><I/></span><b>{title}</b></button>)}</div>
        <div className="pwa-sheet-group-title">{en?'PERSONAL · NO LOGIN REQUIRED':'ব্যক্তিগত · লগইন লাগবে না'}</div>
        <div className="pwa-sheet-grid personal">{localServices.map(([key,I,title])=><button key={key} onClick={()=>{setMobileCalcOpen(false);open(key)}}><span className="local"><I/></span><b>{title}</b></button>)}</div>
        <button className="pwa-sheet-dashboard" onClick={()=>{setMobileCalcOpen(false);open('local-dashboard')}}><LayoutDashboard/><div><b>{en?'My Local Dashboard':'আমার Local ড্যাশবোর্ড'}</b><small>{en?'Profile, salary history, leave, reports and more without login':'চাকরি তথ্য, বেতন ইতিহাস, ছুটি, রিপোর্টসহ সবকিছু লগইন ছাড়াই'}</small></div><ChevronRight/></button>
        <button className="pwa-sheet-sync" onClick={onLogin}><Cloud/><span>{en?'Login only for Backup & Sync':'শুধু Backup & Sync-এর জন্য লগইন'}</span></button>
      </section>
    </div>}
  </div>;
}

function PublicHome({onLogin,onSignup,lang,setLang}){
  const en=lang==='en';
  const [publicMenu,setPublicMenu]=useState(false);
  const [mobileCalcOpen,setMobileCalcOpen]=useState(false);
  const [activePublicTool,setActivePublicTool]=useState(null);
  const [notices,setNotices]=useState([]);
  const [policies,setPolicies]=useState([]);
  const [visitorStats,setVisitorStats]=useState({today_unique:null,month_unique:null,total_unique:null,total_views:null});
  const [pwaStats,setPwaStats]=useState({total_installs:null});

  useEffect(()=>{
    let alive=true;
    const loadStats=()=>api('/api/public/stats').then(x=>{if(alive)setVisitorStats(x)}).catch(()=>{});
    const loadPwaStats=()=>api('/api/public/pwa-install-stats').then(x=>{if(alive)setPwaStats(x)}).catch(()=>{});
    trackPublic('page_view','home').finally(()=>{loadStats();loadPwaStats()});
    Promise.allSettled([
      api('/api/public/notices?limit=100'),
      api('/api/public/policies?limit=100')
    ]).then(([n,p])=>{
      if(!alive)return;
      if(n.status==='fulfilled')setNotices(n.value.items||n.value.notices||[]);
      if(p.status==='fulfilled')setPolicies(p.value.items||p.value.policies||[]);
    });
    const timer=setInterval(()=>{loadStats();loadPwaStats()},60000);
    return ()=>{alive=false;clearInterval(timer)};
  },[]);

  const go=(id)=>{
    setPublicMenu(false);
    setMobileCalcOpen(false);
    setActivePublicTool(null);
    window.requestAnimationFrame(()=>window.requestAnimationFrame(()=>document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'})));
  };
  const openPublicTool=(tool)=>{
    setPublicMenu(false);
    setMobileCalcOpen(false);
    setActivePublicTool(tool);
    const sectionMap={salary:'pay_scale_calculator',promotion:'promotion_calculator',house:'house_allocation_calculator',service:'service_calculator',age:'age_calculator',gap:'date_gap_calculator',retire:'retirement_calculator'};
    trackPublic('calculator_view',sectionMap[tool]||'calculator');
    window.requestAnimationFrame(()=>window.scrollTo({top:0,behavior:'smooth'}));
  };
  const toolLabels={
    salary:en?'Pay Scale 2026–2028':'পে-স্কেল ২০২৬–২০২৮',
    promotion:en?'Promotion Calculator':'পদোন্নতি ক্যালকুলেটর',
    house:en?'House Allocation Points':'বাসা বরাদ্দ পয়েন্ট',
    service:en?'Service Length Calculator':'চাকরিকাল ক্যালকুলেটর',
    age:en?'Age Calculator':'বয়স ক্যালকুলেটর',
    gap:en?'Date Difference Calculator':'তারিখের ব্যবধান',
    retire:en?'Retirement Date Calculator':'অবসর তারিখ ক্যালকুলেটর',
    points:en?'Points Center':'পয়েন্ট সেন্টার',
    calendar:en?'Office Calendar':'অফিস ক্যালেন্ডার',
    reference:en?'Notices & Policies':'নোটিশ ও নীতিমালা',
    'local-dashboard':en?'My Local Dashboard':'আমার Local ড্যাশবোর্ড',
    'local-profile':en?'Career Profile':'চাকরি তথ্য',
    'local-education':en?'Education Records':'শিক্ষা রেকর্ড',
    'local-timeline':en?'Career Timeline':'ক্যারিয়ার টাইমলাইন',
    'local-salary':en?'Salary History':'বেতন ইতিহাস',
    'local-leave':en?'Leave Records':'ছুটির রেকর্ড',
    'local-reports':en?'Personal Reports':'ব্যক্তিগত রিপোর্ট',
    'local-privacy':en?'Data & Backup':'ডাটা ও ব্যাকআপ'
  };

  const quick=[
    [WalletCards,en?'Pay Scale 2026–2028':'পে-স্কেল ২০২৬–২০২৮','blue','salary'],
    [TrendingUp,en?'Promotion Calculator':'পদোন্নতি ক্যালকুলেটর','green','promotion'],
    [Home,en?'House Allocation Points':'বাসা বরাদ্দ পয়েন্ট','violet','house'],
    [Clock3,en?'Service Length':'চাকরিকাল হিসাব','teal','service'],
    [UserRound,en?'Age Calculator':'বয়স হিসাব','slate','age'],
    [CalendarDays,en?'Date Difference':'তারিখের ব্যবধান','orange','gap'],
    [FileClock,en?'Retirement Date':'অবসর তারিখ','indigo','retire'],
    [LayoutDashboard,en?'Personal Dashboard':'ব্যক্তিগত ড্যাশবোর্ড','navy','local-dashboard']
  ];

  const benefits=[
    [LayoutDashboard,en?'Personal Dashboard':'ব্যক্তিগত ড্যাশবোর্ড',en?'Career, salary, leave and points together.':'চাকরি, বেতন, ছুটি ও পয়েন্ট—সব এক নজরে।'],
    [UserRound,en?'Career Profile':'চাকরি ও ক্যারিয়ার প্রোফাইল',en?'Keep your own service information organized.':'নিজের চাকরির তথ্য গুছিয়ে রাখুন।'],
    [TrendingUp,en?'Promotion Forecast':'পদোন্নতি পূর্বাভাস',en?'Eligibility, remaining time and roadmap.':'যোগ্যতা, বাকি সময় ও সম্ভাব্য রোডম্যাপ।'],
    [WalletCards,en?'Salary & Pay Scale':'বেতন ও পে-স্কেল',en?'Basic, allowance, deductions and net salary.':'মূল বেতন, ভাতা, কর্তন ও নিট বেতন।'],
    [CalendarDays,en?'Leave & Calendar':'ছুটি ও ক্যালেন্ডার',en?'Personal leave and office-day information.':'ব্যক্তিগত ছুটি ও অফিস দিনের তথ্য।'],
    [FileText,en?'Reports & Records':'রিপোর্ট ও রেকর্ড',en?'Create and keep useful personal reports.':'প্রয়োজনীয় ব্যক্তিগত রিপোর্ট তৈরি ও সংরক্ষণ।']
  ];
  const whatsappText=encodeURIComponent(en?'Hello, I need help with Hisab Sahayika.':'আসসালামু আলাইকুম, হিসাব সহায়িকা অ্যাপ বিষয়ে সহায়তা প্রয়োজন।');

  const HeroDevice=()=> <div className="native-device-stage" aria-label={en?'Live interface preview':'লাইভ ইন্টারফেস নমুনা'}>
    <div className="native-laptop">
      <div className="native-laptop-screen">
        <div className="demo-sidebar">
          <div className="demo-logo"><Landmark/><b>{en?'Digital Service':'ডিজিটাল সেবা'}</b></div>
          <button className="active"><LayoutDashboard/>{en?'Dashboard':'ড্যাশবোর্ড'}</button>
          <button><UserRound/>{en?'Profile':'প্রোফাইল'}</button>
          <button><Briefcase/>{en?'Career':'চাকরি'}</button>
          <button><TrendingUp/>{en?'Promotion':'পদোন্নতি'}</button>
          <button><Award/>{en?'Points':'পয়েন্ট'}</button>
          <button><WalletCards/>{en?'Salary':'বেতন'}</button>
          <button><CalendarDays/>{en?'Leave':'ছুটি'}</button>
        </div>
        <div className="demo-main">
          <div className="demo-top"><b>{en?'Personal Dashboard':'ব্যক্তিগত ড্যাশবোর্ড'}</b><span><UserRound/>{en?'Sample User':'নমুনা ব্যবহারকারী'}</span></div>
          <div className="demo-greeting"><small>{en?'WELCOME':'স্বাগতম'}</small><h3>{en?'Your career at a glance':'আপনার ক্যারিয়ার এক নজরে'}</h3></div>
          <div className="demo-kpis">
            <article><span><Clock3/></span><small>{en?'Service':'চাকরিকাল'}</small><b>{en?'12y 4m':'১২ বছর ৪ মাস'}</b></article>
            <article><span><Award/></span><small>{en?'Grade':'বর্তমান গ্রেড'}</small><b>{en?'Grade 13':'গ্রেড ১৩'}</b></article>
            <article><span><WalletCards/></span><small>{en?'Basic':'মূল বেতন'}</small><b>{en?'৳ 17,100':'৳ ১৭,১০০'}</b></article>
          </div>
          <div className="demo-panels">
            <article><div><TrendingUp/><b>{en?'Promotion readiness':'পদোন্নতি প্রস্তুতি'}</b></div><div className="progress"><i></i></div><small>{en?'Eligibility progress':'যোগ্যতার অগ্রগতি'} · 80%</small></article>
            <article><div><Bell/><b>{en?'Recent notice':'সাম্প্রতিক নোটিশ'}</b></div><p>{en?'Important updates will appear here.':'গুরুত্বপূর্ণ আপডেট এখানে দেখা যাবে।'}</p></article>
          </div>
          <div className="demo-services">
            <span><WalletCards/>{en?'Salary':'বেতন'}</span><span><Award/>{en?'Points':'পয়েন্ট'}</span><span><CalendarDays/>{en?'Calendar':'ক্যালেন্ডার'}</span><span><FileText/>{en?'Reports':'রিপোর্ট'}</span>
          </div>
        </div>
      </div>
      <div className="native-laptop-base"></div>
    </div>
    <div className="native-phone">
      <div className="native-phone-notch"></div>
      <div className="phone-head"><div><small>{en?'Hello':'স্বাগতম'}</small><b>{en?'Sample User':'নমুনা ব্যবহারকারী'}</b></div><UserRound/></div>
      <div className="phone-summary"><small>{en?'Current Grade':'বর্তমান গ্রেড'}</small><b>{en?'Grade 13':'গ্রেড ১৩'}</b></div>
      <div className="phone-grid">
        <span><WalletCards/>{en?'Salary':'বেতন'}</span><span><TrendingUp/>{en?'Promotion':'পদোন্নতি'}</span>
        <span><Award/>{en?'Points':'পয়েন্ট'}</span><span><CalendarDays/>{en?'Leave':'ছুটি'}</span>
        <span><FileText/>{en?'Reports':'রিপোর্ট'}</span><span><BookOpen/>{en?'Info':'তথ্য'}</span>
      </div>
      <div className="phone-bottom"><Home/><WalletCards/><Award/><CalendarDays/></div>
    </div>
  </div>;

  const DashboardPreview=()=> <div className="native-dashboard-preview">
    <div className="preview-side">
      <div><Landmark/><b>{en?'My Service':'আমার সেবা'}</b></div>
      <span className="active"><LayoutDashboard/>{en?'Dashboard':'ড্যাশবোর্ড'}</span>
      <span><UserRound/>{en?'Profile':'প্রোফাইল'}</span>
      <span><TrendingUp/>{en?'Promotion':'পদোন্নতি'}</span>
      <span><Award/>{en?'Points':'পয়েন্ট'}</span>
      <span><WalletCards/>{en?'Salary':'বেতন'}</span>
    </div>
    <div className="preview-main">
      <div className="preview-top"><b>{en?'Personal Dashboard':'ব্যক্তিগত ড্যাশবোর্ড'}</b><span>{en?'Sample data':'নমুনা তথ্য'}</span></div>
      <div className="preview-profile"><span><UserRound/></span><div><h3>{en?'Sample User':'নমুনা ব্যবহারকারী'}</h3><p>{en?'Employee Service Profile':'কর্মকর্তা-কর্মচারী সেবা প্রোফাইল'}</p></div></div>
      <div className="preview-kpi-row">
        <article><small>{en?'Service':'চাকরিকাল'}</small><b>{en?'12 years 4 months':'১২ বছর ৪ মাস'}</b></article>
        <article><small>{en?'Current Grade':'বর্তমান গ্রেড'}</small><b>{en?'Grade 13':'গ্রেড ১৩'}</b></article>
        <article><small>{en?'Current Basic':'বর্তমান মূল বেতন'}</small><b>{en?'৳ 17,100':'৳ ১৭,১০০'}</b></article>
      </div>
      <div className="preview-bottom-row">
        <article><b>{en?'Promotion readiness':'পদোন্নতি প্রস্তুতি'}</b><div className="progress"><i></i></div><small>80%</small></article>
        <article><b>{en?'Quick services':'দ্রুত সেবা'}</b><div className="mini-actions"><span><Award/>{en?'Points':'পয়েন্ট'}</span><span><WalletCards/>{en?'Salary':'বেতন'}</span><span><CalendarDays/>{en?'Leave':'ছুটি'}</span></div></article>
      </div>
    </div>
  </div>;

  const appUi=typeof window!=='undefined';
  if(appUi){
    return <PwaStandaloneShell
      lang={lang} setLang={setLang}
      activePublicTool={activePublicTool}
      openPublicTool={openPublicTool}
      setActivePublicTool={setActivePublicTool}
      onLogin={onLogin} onSignup={onSignup}
      pwaStats={pwaStats}
      mobileCalcOpen={mobileCalcOpen}
      setMobileCalcOpen={setMobileCalcOpen}
      notices={notices} policies={policies}
    />;
  }

  return <div className="approved-home" id="home">
    <header className="approved-header">
      <button className="approved-brand brand-button" onClick={()=>go('home')}>
        <span><Calculator/></span><div><b>{en?'Hisab Sahayika':'হিসাব সহায়িকা'}</b><small>{en?'Independent · unofficial calculation assistant':'স্বাধীন · অনানুষ্ঠানিক হিসাব সহায়ক প্ল্যাটফর্ম'}</small></div>
      </button>

      <nav className={publicMenu?'open':''} aria-label={en?'Main navigation':'প্রধান মেনু'}>
        <button onClick={()=>go('home')}>{en?'Home':'হোম'}</button>
        <button className="pay-scale-main-nav" onClick={()=>openPublicTool('salary')}><WalletCards size={16}/><span>{en?'Pay Scale 2026–2028':'পে-স্কেল ২০২৬–২০২৮'}</span><em>{en?'NEW':'নতুন'}</em></button>
        <details className="public-nav-dropdown">
          <summary><Calculator size={16}/><span>{en?'Calculators':'ক্যালকুলেটর'}</span><ChevronDown size={14}/></summary>
          <div className="public-nav-submenu">
            <button onClick={e=>{e.currentTarget.closest('details')?.removeAttribute('open');openPublicTool('promotion')}}><TrendingUp/><div><b>{en?'Promotion':'পদোন্নতি'}</b><small>{en?'Eligibility & roadmap':'যোগ্যতা ও রোডম্যাপ'}</small></div></button>
            <button onClick={e=>{e.currentTarget.closest('details')?.removeAttribute('open');openPublicTool('house')}}><Home/><div><b>{en?'House Allocation':'বাসা বরাদ্দ'}</b><small>{en?'Point calculation':'পয়েন্ট হিসাব'}</small></div></button>
            <button onClick={e=>{e.currentTarget.closest('details')?.removeAttribute('open');openPublicTool('service')}}><Clock3/><div><b>{en?'Service Length':'চাকরিকাল'}</b><small>{en?'Years, months & days':'বছর, মাস ও দিন'}</small></div></button>
            <button onClick={e=>{e.currentTarget.closest('details')?.removeAttribute('open');openPublicTool('age')}}><UserRound/><div><b>{en?'Age Calculator':'বয়স হিসাব'}</b><small>{en?'Exact current age':'সঠিক বর্তমান বয়স'}</small></div></button>
            <button onClick={e=>{e.currentTarget.closest('details')?.removeAttribute('open');openPublicTool('gap')}}><CalendarDays/><div><b>{en?'Date Difference':'তারিখের ব্যবধান'}</b><small>{en?'Between two dates':'দুই তারিখের মধ্যে'}</small></div></button>
            <button onClick={e=>{e.currentTarget.closest('details')?.removeAttribute('open');openPublicTool('retire')}}><FileClock/><div><b>{en?'Retirement Date':'অবসর তারিখ'}</b><small>{en?'Estimate by age':'বয়স অনুযায়ী হিসাব'}</small></div></button>
          </div>
        </details>
        <button onClick={()=>go('services')}>{en?'Services':'সেবাসমূহ'}</button>
        <button onClick={()=>go('notices')}>{en?'Notices':'নোটিশ'}</button>
        <button onClick={()=>go('policies')}>{en?'Policies':'নীতিমালা'}</button>
      </nav>

      <div className="approved-actions">
        <PwaControls lang={lang}/>
        <LangToggle lang={lang} setLang={setLang}/>
        <button className="sign-in" onClick={onLogin}>{en?'Backup & Sync':'ব্যাকআপ ও সিঙ্ক'}</button>
        <button className="new-account" onClick={onSignup}>{en?'Enable Cloud Sync':'Cloud Sync চালু করুন'}</button>
        <button className={`menu ${publicMenu?'active':''}`} aria-expanded={publicMenu} onClick={()=>setPublicMenu(v=>!v)}>
          {publicMenu?(en?'Close Menu':'মেনু বন্ধ'):(en?'Menu':'মেনু')}
        </button>
      </div>
    </header>

    {!activePublicTool&&<>
    <section className="approved-hero du-home-hero">
      <div className="approved-hero-copy">
        <span className="approved-kicker"><Calculator/>{en?'INDEPENDENT · UNOFFICIAL CALCULATION ASSISTANT':'স্বাধীন · অনানুষ্ঠানিক হিসাব সহায়ক অ্যাপ'}</span>
        <h1>{en?'Salary, promotion and points — simple calculations in one place':'বেতন, পদোন্নতি ও পয়েন্ট হিসাব—সহজভাবে এক জায়গায়'}</h1>
        <p>{en?'A simple independent calculator for salary, arrears, promotion, points and related information. It is not an official University of Dhaka service.':'বেতন, বকেয়া, পদোন্নতি, পয়েন্ট ও সংশ্লিষ্ট হিসাব জানা ও দেখার জন্য একটি স্বাধীন সহায়ক প্ল্যাটফর্ম। এটি ঢাকা বিশ্ববিদ্যালয়ের কোনো অফিসিয়াল সেবা নয়।'}</p>
        <div className="approved-hero-buttons">
          <button className="primary" onClick={()=>openPublicTool('salary')}>{en?'Calculate salary':'বেতন হিসাব করুন'}<ArrowRight/></button>
          <button className="secondary" onClick={()=>openPublicTool('promotion')}>{en?'Check promotion':'পদোন্নতি হিসাব'}<TrendingUp/></button>
        </div>
        <div className="approved-trust">
          <span><CheckCircle2/>{en?'Targeted calculations':'লক্ষ্যভিত্তিক হিসাব'}</span>
          <span><CheckCircle2/>{en?'Simple guided steps':'সহজ ধাপে ব্যবহার'}</span>
          <span><CheckCircle2/>{en?'A4 PDF reports':'A4 PDF রিপোর্ট'}</span>
        </div>
        <div className="hero-nonofficial-note"><ShieldAlert/><span>{en?'Independent and unofficial. No official affiliation with the University of Dhaka.':'স্বাধীন ও অনানুষ্ঠানিক। ঢাকা বিশ্ববিদ্যালয়ের সঙ্গে এই প্ল্যাটফর্মের কোনো অফিসিয়াল সম্পর্ক নেই।'}</span></div>
        <div className="public-install-stat"><Users/><span>{pwaStats.total_installs==null?(en?'Install count loading…':'ইনস্টল সংখ্যা লোড হচ্ছে…'):(en?`Total app installs: ${numLang(pwaStats.total_installs,'en',0)}`:`অ্যাপ ইনস্টল: ${numLang(pwaStats.total_installs,'bn',0)}`)}</span></div>
      </div>
      <HeroDevice/>
    </section>

    <section className="approved-section public-calculator-center" id="public-calculator-center">
      <div className="calculator-hub-head">
        <span>{en?'QUICK START':'দ্রুত শুরু করুন'}</span>
        <h2>{en?'Which calculation do you need?':'কোন হিসাবটি করতে চান?'}</h2>
        <p>{en?'Choose a service and start immediately. Only the calculator you choose will open.':'যে সেবাটি প্রয়োজন সেটি বেছে নিন। শুধু সেই ক্যালকুলেটরটি খুলবে—অতিরিক্ত কিছু সামনে আসবে না।'}</p>
      </div>
      <div className="calculator-hub-grid">
        <button className={activePublicTool==='salary'?'active':''} onClick={()=>openPublicTool('salary')}>
          <span className="hub-icon salary"><WalletCards/></span>
          <div><small>{en?'SALARY + ARREAR':'বেতন + বকেয়া'}</small><h3>{en?'Salary & Arrear':'বেতন ও বকেয়া হিসাব'}</h3><p>{en?'Basic, allowances, deductions and 2026–2028 salary stages in one calculation.':'মূল বেতন, ভাতা, কর্তন ও ২০২৬–২০২৮ ধাপ—এক হিসাবেই দেখুন।'}</p><b>{en?'Start calculation':'হিসাব শুরু করুন'}<ArrowRight/></b></div>
        </button>
        <button className={activePublicTool==='promotion'?'active':''} onClick={()=>openPublicTool('promotion')}>
          <span className="hub-icon promotion"><TrendingUp/></span>
          <div><small>{en?'PROMOTION':'পদোন্নতি'}</small><h3>{en?'Promotion Calculation':'পদোন্নতি হিসাব'}</h3><p>{en?'See eligibility, remaining service time and the next possible steps.':'যোগ্যতা, বাকি চাকরিকাল ও পরবর্তী সম্ভাব্য ধাপ দেখুন।'}</p><b>{en?'Start calculation':'হিসাব শুরু করুন'}<ArrowRight/></b></div>
        </button>
        <button className={activePublicTool==='house'?'active':''} onClick={()=>openPublicTool('house')}>
          <span className="hub-icon house"><Home/></span>
          <div><small>{en?'HOUSING':'বাসা'}</small><h3>{en?'House Allocation Points':'বাসা বরাদ্দ পয়েন্ট'}</h3><p>{en?'Enter the required information and see the supported allocation points clearly.':'প্রয়োজনীয় তথ্য দিয়ে বাসা বরাদ্দের পয়েন্ট সহজভাবে দেখুন।'}</p><b>{en?'Start calculation':'হিসাব শুরু করুন'}<ArrowRight/></b></div>
        </button>
      </div>
      {!activePublicTool&&<div className="calculator-hub-guide"><Calculator/><div><b>{en?'No login needed for calculation':'হিসাবের জন্য লগইন লাগবে না'}</b><span>{en?'Choose a card above and enter only the information that applies to you.':'উপরের একটি সেবা বেছে নিয়ে শুধু আপনার ক্ষেত্রে প্রযোজ্য তথ্য দিন।'}</span></div></div>}
    </section>

    <section className="approved-section approved-quick" id="services">
      <div className="approved-section-title"><span>{en?'POPULAR SERVICES':'গুরুত্বপূর্ণ সেবা'}</span><h2>{en?'Important services, organized for one-click access':'গুরুত্বপূর্ণ সব সেবা, এক ক্লিকে ব্যবহারের জন্য সাজানো'}</h2><p>{en?'Career, salary, leave, promotion, points and useful information — all within easy reach.':'ক্যারিয়ার, বেতন, ছুটি, পদোন্নতি ও প্রয়োজনীয় তথ্য—সব সহজেই হাতের মুঠোয়।'}</p></div>
      <div className="approved-quick-grid">{quick.map(([I,t,c,action])=><button key={t} className={c} onClick={()=>openPublicTool(action)}><span><I/></span><b>{t}</b><ChevronRight/></button>)}</div>
    </section>

    <section className="approved-section approved-benefits" id="benefits">
      <div className="approved-section-title"><span>{en?'YOUR DATA, YOUR CONTROL':'নিজের তথ্য, নিজের নিয়ন্ত্রণ'}</span><h2>{en?'Personal calculations without mandatory login':'বাধ্যতামূলক login ছাড়াই ব্যক্তিগত হিসাব'}</h2><p>{en?'In the installed app, local profile, salary history, leave, reports and core calculators work without login. Account login is optional only for Cloud Backup, Sync, Recovery and multi-device use.':'ইনস্টল করা অ্যাপে Local Profile, বেতন ইতিহাস, ছুটি, রিপোর্ট ও মূল calculator login ছাড়াই চলবে। Cloud Backup, Sync, Recovery ও একাধিক ডিভাইসে ব্যবহারের জন্য account login ঐচ্ছিক।'}</p></div>
      <div className="approved-benefit-layout">
        <DashboardPreview/>
        <div className="approved-benefit-grid">{benefits.map(([I,t,d],i)=><article key={t}><span className={`tone t${i%4}`}><I/></span><div><h3>{t}</h3><p>{d}</p></div></article>)}</div>
      </div>
    </section>

    <section className="approved-cta">
      <div><h2>{en?'Use all core services without login':'লগইন ছাড়াই মূল সব সেবা ব্যবহার করুন'}</h2><p>{en?'Your local profile and records can stay on this device. Create an account only for Cloud Backup, Sync, Recovery and multi-device use.':'Local Profile ও ব্যক্তিগত রেকর্ড এই ডিভাইসেই থাকবে। শুধু Cloud Backup, Sync, Recovery ও একাধিক ডিভাইসে ব্যবহারের জন্য অ্যাকাউন্ট তৈরি করুন।'}</p></div>
      <div><button className="white" onClick={onSignup}>{en?'Enable Backup & Sync':'Backup & Sync চালু করুন'}<ArrowRight/></button><button className="outline" onClick={onLogin}>{en?'Login & Sync':'লগইন ও সিঙ্ক'}</button></div>
    </section>


    {notices.length>0&&<section className="approved-section approved-information" id="notices">
      <div className="approved-section-title"><span>{en?'LATEST UPDATES':'সর্বশেষ আপডেট'}</span><h2>{en?'Notices':'নোটিশ'}</h2><p>{en?'Published notices and useful updates.':'প্রকাশিত নোটিশ ও প্রয়োজনীয় আপডেট।'}</p></div>
      <div className="approved-info-grid">
        {notices.map((x,i)=><article key={x.id||i}><span><Bell/></span><div><h3>{x.title||x.name||x.subject}</h3>{x.published_at&&<small>{fmtDate(x.published_at,lang)}</small>}<p>{x.summary||x.description||''}</p></div></article>)}
      </div>
    </section>}

    {policies.length>0&&<section className="approved-section approved-information policies" id="policies">
      <div className="approved-section-title"><span>{en?'REFERENCE':'রেফারেন্স'}</span><h2>{en?'Policies':'নীতিমালা'}</h2><p>{en?'Published reference policies for personal assistance.':'ব্যক্তিগত সহায়ক ব্যবহারের জন্য প্রকাশিত রেফারেন্স নীতিমালা।'}</p></div>
      <div className="approved-info-grid">
        {policies.map((x,i)=><article key={x.id||i}><span><BookOpen/></span><div><h3>{x.title||x.name||x.subject}</h3>{x.published_at&&<small>{fmtDate(x.published_at,lang)}</small>}<p>{x.summary||x.description||''}</p></div></article>)}
      </div>
    </section>}


    <section className="approved-support">
      <div><span><MessageCircle/></span><div><h2>{en?'Need help?':'সহায়তা প্রয়োজন?'}</h2><p>{en?'For platform or technical help, send a WhatsApp message.':'প্ল্যাটফর্ম বা কারিগরি সহায়তার জন্য শুধু হোয়াটসঅ্যাপে মেসেজ করুন।'}</p></div></div>
      <a href={`https://wa.me/8801759084692?text=${whatsappText}`} target="_blank" rel="noreferrer"><MessageCircle/>{en?'Message on WhatsApp':'হোয়াটসঅ্যাপে মেসেজ করুন'}</a>
    </section>


    </>}

    {activePublicTool&&<main className="public-dedicated-calculator" id="public-tool-view">
      <div className="public-tool-page-head">
        <button className="back-home-tool" onClick={()=>go('home')}><ArrowLeft size={16}/>{en?'Back to Home':'হোমে ফিরুন'}</button>
        <div><span>{activePublicTool==='salary'?(en?'PAY SCALE':'পে-স্কেল'):(en?'CALCULATOR':'ক্যালকুলেটর')}</span><h1>{toolLabels[activePublicTool]||''}</h1><p>{en?'Only the selected tool is shown here. Choose another calculator from the top menu at any time.':'এখানে শুধু নির্বাচিত হিসাবটিই দেখানো হচ্ছে। অন্য হিসাবের জন্য উপরের ক্যালকুলেটর মেনু ব্যবহার করুন।'}</p></div>
      </div>
      {activePublicTool==='salary'&&<PublicPayScaleHub lang={lang}/>}
      {activePublicTool==='promotion'&&<section className="public-tool-only-shell"><PromotionCenter lang={lang} publicMode={true}/></section>}
      {activePublicTool==='house'&&<section className="public-tool-only-shell"><HouseAllocationPoints lang={lang} publicMode={true}/></section>}
      {['service','age','gap','retire','basic'].includes(activePublicTool)&&<section className="public-tool-only-shell"><CalculatorCenter lang={lang} publicMode={true} initialTool={activePublicTool} singleTool={true}/></section>}
      {activePublicTool==='points'&&<section className="public-tool-only-shell"><PointsCalculator lang={lang} publicMode={true}/></section>}
      {activePublicTool==='calendar'&&<section className="public-tool-only-shell"><FiscalOfficeCalendar lang={lang}/></section>}
      {activePublicTool==='reference'&&<PwaReferenceCenter lang={lang} notices={notices} policies={policies}/>}
      {activePublicTool==='pdf-center'&&<PdfCenter lang={lang}/>}
      {activePublicTool?.startsWith('local-')&&<GuestLocalCenter mode={activePublicTool.slice(6)} lang={lang} onOpen={openPublicTool} onLogin={onLogin}/>}
    </main>}

    <footer className="approved-footer">
      <button className="approved-brand brand-button footer-brand" onClick={()=>go('home')}><span><Calculator/></span><div><b>{en?'Hisab Sahayika':'হিসাব সহায়িকা'}</b><small>{en?'Independent · unofficial calculation assistant':'স্বাধীন · অনানুষ্ঠানিক হিসাব সহায়ক প্ল্যাটফর্ম'}</small></div></button>
      <div className="approved-footer-links">
        <button onClick={()=>go('home')}>{en?'Home':'হোম'}</button>
        <button onClick={()=>go('services')}>{en?'Services':'সেবা সমূহ'}</button>
        <button onClick={()=>go('policies')}>{en?'Policies':'নীতিমালা'}</button>
        <button onClick={()=>go('benefits')}>{en?'Privacy':'গোপনীয়তা'}</button>
        <a href={`https://wa.me/8801759084692?text=${whatsappText}`} target="_blank" rel="noreferrer">{en?'WhatsApp':'হোয়াটসঅ্যাপ'}</a>
      </div>
      <div className="footer-visitor-counter" title={en?'Anonymous browser/device estimate':'অ্যানোনিমাস ব্রাউজার/ডিভাইসভিত্তিক আনুমানিক হিসাব'}>
        <Eye/>
        <div className="footer-visitor-main"><small>{en?'Total Visitors':'মোট ভিজিটর'}</small><b>{visitorStats.total_unique==null?'—':numLang(visitorStats.total_unique,lang,0)}</b></div>
        <div className="footer-visitor-more"><span>{en?'Today':'আজ'} <b>{visitorStats.today_unique==null?'—':numLang(visitorStats.today_unique,lang,0)}</b></span><i>·</i><span>{en?'This month':'এই মাস'} <b>{visitorStats.month_unique==null?'—':numLang(visitorStats.month_unique,lang,0)}</b></span></div>
      </div>
      <small>{en?'Developer Support via WhatsApp':'ডেভেলপার সহায়তা — শুধু হোয়াটসঅ্যাপ'}<br/><b>মোঃ মশিউর রহমান · 01759084692</b></small>
    </footer>

    {mobileCalcOpen&&<div className="mobile-calc-sheet-backdrop" onClick={()=>setMobileCalcOpen(false)}>
      <section className="mobile-calc-sheet" onClick={e=>e.stopPropagation()}>
        <div className="mobile-calc-sheet-head"><div><small>{en?'QUICK CALCULATORS':'দ্রুত ক্যালকুলেটর'}</small><h3>{en?'Choose a calculator':'যেটা দরকার সেটি বেছে নিন'}</h3></div><button onClick={()=>setMobileCalcOpen(false)} aria-label={en?'Close':'বন্ধ করুন'}><X/></button></div>
        <div className="mobile-calc-sheet-grid">
          <button onClick={()=>openPublicTool('promotion')}><span><TrendingUp/></span><div><b>{en?'Promotion':'পদোন্নতি'}</b><small>{en?'Eligibility & roadmap':'যোগ্যতা ও রোডম্যাপ'}</small></div><ChevronRight/></button>
          <button onClick={()=>openPublicTool('house')}><span><Home/></span><div><b>{en?'House Allocation':'বাসা বরাদ্দ'}</b><small>{en?'Points calculation':'পয়েন্ট হিসাব'}</small></div><ChevronRight/></button>
          <button onClick={()=>openPublicTool('service')}><span><Clock3/></span><div><b>{en?'Service Length':'চাকরিকাল'}</b><small>{en?'Years, months, days':'বছর, মাস, দিন'}</small></div><ChevronRight/></button>
          <button onClick={()=>openPublicTool('age')}><span><UserRound/></span><div><b>{en?'Age':'বয়স'}</b><small>{en?'Exact age':'সঠিক বয়স'}</small></div><ChevronRight/></button>
          <button onClick={()=>openPublicTool('gap')}><span><CalendarDays/></span><div><b>{en?'Date Difference':'তারিখের ব্যবধান'}</b><small>{en?'Two dates':'দুই তারিখ'}</small></div><ChevronRight/></button>
          <button onClick={()=>openPublicTool('retire')}><span><FileClock/></span><div><b>{en?'Retirement':'অবসর'}</b><small>{en?'Retirement date':'অবসর তারিখ'}</small></div><ChevronRight/></button>
        </div>
      </section>
    </div>}

    <nav className="public-mobile-dock" aria-label={en?'Mobile quick navigation':'মোবাইল দ্রুত মেনু'}>
      <button className={!activePublicTool?'active':''} onClick={()=>go('home')}><Home/><span>{en?'Home':'হোম'}</span></button>
      <button className={activePublicTool==='salary'?'active':''} onClick={()=>openPublicTool('salary')}><WalletCards/><span>{en?'Salary':'বেতন'}</span></button>
      <button className={activePublicTool==='promotion'?'active':''} onClick={()=>openPublicTool('promotion')}><TrendingUp/><span>{en?'Career':'ক্যারিয়ার'}</span></button>
      <button className={mobileCalcOpen||(['house','service','age','gap','retire'].includes(activePublicTool))?'active':''} onClick={()=>setMobileCalcOpen(v=>!v)}><Boxes/><span>{en?'Services':'সেবা'}</span></button>
      <button className={activePublicTool?.startsWith('local-')?'active':''} onClick={()=>openPublicTool('local-dashboard')}><UserRound/><span>{en?'My':'আমার'}</span></button>
    </nav>

    <a className="floating-whatsapp" href={`https://wa.me/8801759084692?text=${whatsappText}`} target="_blank" rel="noreferrer" aria-label={en?'Message on WhatsApp':'হোয়াটসঅ্যাপে মেসেজ করুন'}><MessageCircle/><span>{en?'WhatsApp':'হোয়াটসঅ্যাপ'}</span></a>
  </div>
}

function Stat({label,value,icon:Icon}){return <article className="stat-card"><div className="stat-icon"><Icon size={19}/></div><div><small>{label}</small><b>{value}</b></div></article>}



function MiniBars({data=[]}){
  const vals=data.map(x=>Number(x.value||0)),max=Math.max(1,...vals);
  return <div className="mini-bars">{data.map((x,i)=><div key={i} className="mini-bar-wrap" title={`${x.label}: ${x.value}`}><div className="mini-bar" style={{height:`${Math.max(8,(Number(x.value||0)/max)*100)}%`}}></div><small>{x.label}</small></div>)}</div>
}
function DonutStat({a=0,b=0,labelA='A',labelB='B'}){
  const total=Math.max(1,Number(a)+Number(b)),pct=Math.round((Number(a)/total)*100);
  return <div className="donut-stat"><div className="donut-ring" style={{'--pct':`${pct}%`}}><div><b>{pct}%</b><small>{labelA}</small></div></div><div className="donut-legend"><span><i className="dot-one"></i>{labelA}<b>{a}</b></span><span><i className="dot-two"></i>{labelB}<b>{b}</b></span></div></div>
}
function TrendLine({data=[]}){
  const vals=data.map(x=>Number(x.value||0)),max=Math.max(1,...vals),min=Math.min(0,...vals),w=460,h=150,pad=14;
  const pts=vals.map((v,i)=>{const x=pad+(i*(w-pad*2)/Math.max(1,vals.length-1));const y=h-pad-((v-min)/(Math.max(1,max-min)))*(h-pad*2);return [x,y]});
  const path=pts.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ');
  return <div className="trend-chart"><svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none"><path className="trend-fill" d={`${path} L ${pts.at(-1)?.[0]||w-pad} ${h-pad} L ${pts[0]?.[0]||pad} ${h-pad} Z`}/><path className="trend-line" d={path}/>{pts.map((p,i)=><circle key={i} cx={p[0]} cy={p[1]} r="3.3"/>)}</svg><div className="trend-labels">{data.map((x,i)=><span key={i}>{x.label}</span>)}</div></div>
}
function AdminAnalyticsDashboard({user,onPage,lang='bn'}){
  const en=lang==='en';
  const [d,setD]=useState(null),[busy,setBusy]=useState(true),[err,setErr]=useState('');
  async function load(){
    setBusy(true);setErr('');
    try{
      setD(await api('/api/admin/dashboard-analytics'));
    }catch(e){
      try{
        const [s,h]=await Promise.all([
          api('/api/admin/stats'),
          api('/api/admin/system-health').catch(()=>({ok:true,active_sessions:0,expired_sessions:0,inactive_users:0,recovery_ready_users:0}))
        ]);
        setD({
          kpis:{
            total_users:s.users||0,active_users:s.users||0,officers:0,employees:s.users||0,
            career_profiles:0,departments:s.departments||0,designations:s.designations||0,
            notices:0,policies:0
          },
          health:h||{ok:true},
          usage:[],activity_trend:[
            {label:'-6',value:0},{label:'-5',value:0},{label:'-4',value:0},{label:'-3',value:0},
            {label:'-2',value:0},{label:'-1',value:0},{label:'Today',value:0}
          ],
          recent_users:[],recent_audit:[],
          traffic:{today_views:0,today_unique:0,today_calculator_views:0,returning_today:0},
          login:{today_success:0,today_failed:0,today_unique_users:0,today_attempts:0},
          hourly_traffic:Array.from({length:24},(_,hour)=>({hour,value:0,views:0,percent:0})),
          login_trend:[
            {label:'-6',value:0},{label:'-5',value:0},{label:'-4',value:0},{label:'-3',value:0},
            {label:'-2',value:0},{label:'-1',value:0},{label:'Today',value:0}
          ],
          recent_logins:[]
        });
        setErr(en?'Analytics API is not active yet; basic system statistics are shown.':'অ্যানালিটিক্স API এখনো সক্রিয় হয়নি; আপাতত মৌলিক সিস্টেম পরিসংখ্যান দেখানো হচ্ছে।');
      }catch(e2){setErr(e2.message)}
    }finally{setBusy(false)}
  }
  useEffect(()=>{load()},[]);
  if(busy)return <div className="loading">{en?'Loading dashboard...':'ড্যাশবোর্ড লোড হচ্ছে...'}</div>;
  if(!d&&err)return <div className="error">{err}</div>;
  const k=d?.kpis||{},health=d?.health||{},usage=d?.usage||[],activity=d?.activity_trend||[],recent=d?.recent_users||[],audit=d?.recent_audit||[],
    traffic=d?.traffic||{},login=d?.login||{},hourly=d?.hourly_traffic||[],loginTrend=d?.login_trend||[],recentLogins=d?.recent_logins||[];
  return <div className="admin-analytics-dashboard">
    {err&&<div className="notice"><b>{en?'Dashboard notice:':'ড্যাশবোর্ড নোটিশ:'}</b> {err}</div>}
    <section className="analytics-hero">
      <div><span>{en?'PREMIUM SYSTEM COMMAND CENTER':'প্রিমিয়াম সিস্টেম কমান্ড সেন্টার'}</span><h1>{en?'System Administrator Dashboard':'সিস্টেম ব্যবস্থাপক ড্যাশবোর্ড'}</h1><p>{en?'Live platform overview, user analytics, security health, content activity and system controls in one workspace.':'প্ল্যাটফর্ম সারসংক্ষেপ, ব্যবহারকারী বিশ্লেষণ, নিরাপত্তা, কনটেন্ট কার্যক্রম ও সিস্টেম কন্ট্রোল এক জায়গায়।'}</p></div>
      <div className="hero-command-panel"><div><MonitorCheck/><span>{en?'System status':'সিস্টেম অবস্থা'}</span><b>{health.ok?(en?'Healthy':'সচল'):(en?'Attention':'মনোযোগ প্রয়োজন')}</b></div><button onClick={()=>onPage('admin')}><Command/>{en?'Open System Control':'সিস্টেম কন্ট্রোল খুলুন'}</button></div>
    </section>

    <section className="analytics-kpi-grid">
      <article><div className="kpi-icon"><Users/></div><div><small>{en?'Total Users':'মোট ব্যবহারকারী'}</small><b>{k.total_users??0}</b><span>{en?'Registered accounts':'নিবন্ধিত অ্যাকাউন্ট'}</span></div></article>
      <article><div className="kpi-icon"><UserCheck/></div><div><small>{en?'Active Users':'সক্রিয় ব্যবহারকারী'}</small><b>{k.active_users??0}</b><span>{en?'Currently enabled':'বর্তমানে সক্রিয়'}</span></div></article>
      <article><div className="kpi-icon"><Briefcase/></div><div><small>{en?'Officers':'কর্মকর্তা'}</small><b>{k.officers??0}</b><span>{en?'Self-service accounts':'স্ব-পরিচালিত অ্যাকাউন্ট'}</span></div></article>
      <article><div className="kpi-icon"><UserRound/></div><div><small>{en?'Employees':'কর্মচারী'}</small><b>{k.employees??0}</b><span>{en?'Self-service accounts':'স্ব-পরিচালিত অ্যাকাউন্ট'}</span></div></article>
      <article><div className="kpi-icon"><BookUser/></div><div><small>{en?'Career Profiles':'ক্যারিয়ার প্রোফাইল'}</small><b>{k.career_profiles??0}</b><span>{en?'Personal records created':'ব্যক্তিগত রেকর্ড তৈরি'}</span></div></article>
      <article><div className="kpi-icon"><LockKeyhole/></div><div><small>{en?'Active Sessions':'সক্রিয় সেশন'}</small><b>{health.active_sessions??0}</b><span>{en?'Secure sessions':'নিরাপদ সেশন'}</span></div></article>
    </section>

    <section className="analytics-grid top">
      <article className="analytics-card wide">
        <div className="analytics-card-head"><div><LineChart/><div><span>{en?'ACTIVITY TREND':'কার্যক্রমের প্রবণতা'}</span><h3>{en?'Platform activity — last 7 days':'গত ৭ দিনের প্ল্যাটফর্ম কার্যক্রম'}</h3></div></div><small>{en?'Tracked module opens':'মডিউল ব্যবহারের হিসাব'}</small></div>
        <TrendLine data={activity}/>
      </article>
      <article className="analytics-card">
        <div className="analytics-card-head"><div><PieChart/><div><span>{en?'ACCOUNT MIX':'অ্যাকাউন্ট অনুপাত'}</span><h3>{en?'Officer vs Employee':'কর্মকর্তা বনাম কর্মচারী'}</h3></div></div></div>
        <DonutStat a={k.officers||0} b={k.employees||0} labelA={en?'Officer':'কর্মকর্তা'} labelB={en?'Employee':'কর্মচারী'}/>
      </article>
    </section>

    <section className="analytics-grid mid">
      <article className="analytics-card">
        <div className="analytics-card-head"><div><BarChart3/><div><span>{en?'MODULE USAGE':'মডিউল ব্যবহার'}</span><h3>{en?'Most-used services':'সর্বাধিক ব্যবহৃত সেবা'}</h3></div></div></div>
        <MiniBars data={usage.length?usage:[{label:en?'No data':'ডাটা নেই',value:0}]}/>
      </article>
      <article className="analytics-card">
        <div className="analytics-card-head"><div><ShieldEllipsis/><div><span>{en?'SECURITY':'নিরাপত্তা'}</span><h3>{en?'Authentication health':'অথেনটিকেশন স্বাস্থ্য'}</h3></div></div><button className="mini-link" onClick={()=>onPage('admin')}>{en?'Open center':'কেন্দ্র খুলুন'}<ChevronRight size={14}/></button></div>
        <div className="security-health-list">
          <div><span>{en?'Active sessions':'সক্রিয় সেশন'}</span><b>{health.active_sessions??0}</b></div>
          <div><span>{en?'Expired sessions':'মেয়াদোত্তীর্ণ সেশন'}</span><b>{health.expired_sessions??0}</b></div>
          <div><span>{en?'Inactive users':'নিষ্ক্রিয় ব্যবহারকারী'}</span><b>{health.inactive_users??0}</b></div>
          <div><span>{en?'Recovery-ready users':'রিকভারি প্রস্তুত ব্যবহারকারী'}</span><b>{health.recovery_ready_users??0}</b></div>
        </div>
      </article>
      <article className="analytics-card">
        <div className="analytics-card-head"><div><Boxes/><div><span>{en?'CONTENT':'কনটেন্ট'}</span><h3>{en?'Published reference content':'প্রকাশিত রেফারেন্স কনটেন্ট'}</h3></div></div></div>
        <div className="content-kpis">
          <div><Bell/><span>{en?'Notices':'নোটিশ'}</span><b>{k.notices??0}</b></div>
          <div><BookOpen/><span>{en?'Policies':'নীতিমালা'}</span><b>{k.policies??0}</b></div>
          <div><Building2/><span>{en?'Departments':'বিভাগ/অফিস'}</span><b>{k.departments??0}</b></div>
          <div><Briefcase/><span>{en?'Designations':'পদবি'}</span><b>{k.designations??0}</b></div>
        </div>
      </article>
    </section>

    <section className="analytics-grid lower">
      <article className="analytics-card wide">
        <div className="analytics-card-head"><div><UserCog/><div><span>{en?'RECENT USERS':'সাম্প্রতিক ব্যবহারকারী'}</span><h3>{en?'Latest self-service accounts':'সর্বশেষ স্ব-পরিচালিত অ্যাকাউন্ট'}</h3></div></div><button className="mini-link" onClick={()=>onPage('admin')}>{en?'Manage':'ব্যবস্থাপনা'}<ChevronRight size={14}/></button></div>
        <div className="recent-users-list">{recent.length===0?<div className="empty">{en?'No users yet.':'এখনো ব্যবহারকারী নেই।'}</div>:recent.map(x=><div className="recent-user-row" key={x.id}><div className="recent-avatar">{String(x.name||'?').slice(0,1).toUpperCase()}</div><div><b>{x.name}</b><small>{x.email}</small></div><span>{x.account_type==='officer'?(en?'Officer':'কর্মকর্তা'):(en?'Employee':'কর্মচারী')}</span><i className={x.is_active?'online':'offline'}></i></div>)}</div>
      </article>
      <article className="analytics-card">
        <div className="analytics-card-head"><div><ScrollText/><div><span>{en?'AUDIT':'অডিট'}</span><h3>{en?'Recent system activity':'সাম্প্রতিক সিস্টেম কার্যক্রম'}</h3></div></div></div>
        <div className="compact-audit-list">{audit.length===0?<div className="empty">{en?'No audit activity.':'অডিট কার্যক্রম নেই।'}</div>:audit.map(x=><div key={x.id}><History/><div><b>{x.action}</b><small>{x.user_name||'System'} · {x.created_at||'—'}</small></div></div>)}</div>
      </article>
    </section>


    <section className="analytics-grid traffic-login-grid">
      <article className="analytics-card wide">
        <div className="analytics-card-head"><div><Eye/><div><span>{en?'PUBLIC TRAFFIC':'পাবলিক ট্রাফিক'}</span><h3>{en?"Today's website visitors":"আজকের ওয়েবসাইট ভিজিটর"}</h3></div></div><small>{en?'Anonymous, privacy-safe estimate':'অ্যানোনিমাস, প্রাইভেসি-সুরক্ষিত অনুমান'}</small></div>
        <div className="traffic-kpi-row">
          <div><small>{en?'Page Views':'পেজ ভিউ'}</small><b>{traffic.today_views??0}</b></div>
          <div><small>{en?'Unique Visitors (est.)':'ইউনিক ভিজিটর (আনুমানিক)'}</small><b>{traffic.today_unique??0}</b></div>
          <div><small>{en?'Public Calculator Views':'পাবলিক ক্যালকুলেটর ভিউ'}</small><b>{traffic.today_calculator_views??0}</b></div>
          <div><small>{en?'Returning Visitors (est.)':'রিটার্নিং ভিজিটর (আনুমানিক)'}</small><b>{traffic.returning_today??0}</b></div>
        </div>
        <div className="hourly-chart">
          {hourly.map((x,i)=><div key={i} title={`${x.hour}:00 — ${x.views}`}><i style={{height:`${Math.max(6,Math.min(100,x.percent||0))}%`}}></i><small>{x.hour}</small></div>)}
        </div>
      </article>

      <article className="analytics-card">
        <div className="analytics-card-head"><div><LockKeyhole/><div><span>{en?'LOGIN ANALYTICS':'লগইন অ্যানালিটিক্স'}</span><h3>{en?"Today's login activity":"আজকের লগইন কার্যক্রম"}</h3></div></div></div>
        <div className="login-kpi-list">
          <div><span>{en?'Successful logins':'সফল লগইন'}</span><b>{login.today_success??0}</b></div>
          <div><span>{en?'Failed attempts':'ব্যর্থ চেষ্টা'}</span><b>{login.today_failed??0}</b></div>
          <div><span>{en?'Unique logged-in users':'ইউনিক লগইন ব্যবহারকারী'}</span><b>{login.today_unique_users??0}</b></div>
          <div><span>{en?'Total attempts':'মোট লগইন চেষ্টা'}</span><b>{login.today_attempts??0}</b></div>
        </div>
      </article>
    </section>

    <section className="analytics-grid traffic-login-grid second">
      <article className="analytics-card wide">
        <div className="analytics-card-head"><div><LineChart/><div><span>{en?'LOGIN TREND':'লগইন ট্রেন্ড'}</span><h3>{en?'Successful logins — last 7 days':'গত ৭ দিনের সফল লগইন'}</h3></div></div></div>
        <TrendLine data={loginTrend}/>
      </article>
      <article className="analytics-card">
        <div className="analytics-card-head"><div><History/><div><span>{en?'RECENT LOGINS':'সাম্প্রতিক লগইন'}</span><h3>{en?'Latest login activity':'সর্বশেষ লগইন কার্যক্রম'}</h3></div></div></div>
        <div className="recent-login-list">{recentLogins.length===0?<div className="empty">{en?'No login activity yet.':'এখনো লগইন কার্যক্রম নেই।'}</div>:recentLogins.map(x=><div key={x.id} className={x.success?'ok':'fail'}><div><b>{x.email||'—'}</b><small>{x.user_name|| (en?'Unknown user':'অজানা ব্যবহারকারী')}</small></div><span>{x.success?(en?'Success':'সফল'):(en?'Failed':'ব্যর্থ')}</span><time>{x.created_at||'—'}</time></div>)}</div>
      </article>
    </section>

    <section className="admin-quick-command">
      <button onClick={()=>onPage('admin')}><SlidersHorizontal/><span>{en?'System Control':'সিস্টেম কন্ট্রোল'}</span></button>
      <button onClick={()=>onPage('admin-content')}><BookOpen/><span>{en?'Notices & Policies':'নোটিশ ও নীতিমালা'}</span></button>
      <button onClick={()=>onPage('calculators')}><Calculator/><span>{en?'Calculator Center':'ক্যালকুলেটর সেন্টার'}</span></button>
      <button onClick={()=>onPage('account')}><LockKeyhole/><span>{en?'Account Security':'অ্যাকাউন্ট নিরাপত্তা'}</span></button>
    </section>
  </div>
}

function UnifiedEmployeeDashboard({user,onPage,lang='bn'}){
  const en=lang==='en';
  const [career,setCareer]=useState({profile:null,education:[],events:[]});
  const [salaryItems,setSalaryItems]=useState([]);
  const [leaveItems,setLeaveItems]=useState([]);
  const [notices,setNotices]=useState([]);
  const [busy,setBusy]=useState(true);

  useEffect(()=>{
    let alive=true;
    Promise.allSettled([
      api('/api/my-career'),
      api('/api/my-salary-history'),
      api('/api/my-leave-records'),
      api('/api/public/notices?limit=100')
    ]).then(rs=>{
      if(!alive)return;
      const c=rs[0].status==='fulfilled'?rs[0].value:{};
      const s=rs[1].status==='fulfilled'?rs[1].value:{};
      const l=rs[2].status==='fulfilled'?rs[2].value:{};
      const n=rs[3].status==='fulfilled'?rs[3].value:{};
      setCareer({profile:c.profile||null,education:c.education||[],events:c.events||[]});
      setSalaryItems(s.items||[]);
      setLeaveItems(l.items||[]);
      setNotices(n.items||n.notices||[]);
      setBusy(false);
    });
    return()=>{alive=false};
  },[]);

  const p=career.profile||{};
  const today=todayLocalIso();
  const service=p.first_joining_date?diffYMD(p.first_joining_date,today):null;
  const postService=p.current_post_joining_date?diffYMD(p.current_post_joining_date,today):null;
  const serviceText=d=>!d?'—':en?`${numLang(d.y,lang,0)}y ${numLang(d.m,lang,0)}m ${numLang(d.d,lang,0)}d`:`${numLang(d.y,lang,0)} বছর ${numLang(d.m,lang,0)} মাস ${numLang(d.d,lang,0)} দিন`;
  const currentPost=p.current_post||p.designation|| (en?'Not added':'যোগ করা হয়নি');
  const currentGrade=p.current_grade?`${en?'Grade':'গ্রেড'} ${numLang(p.current_grade,lang,0)}`:'—';
  const latestSalary=salaryItems?.[0]||null;
  const thisYear=String(new Date().getFullYear());
  const yearLeave=(leaveItems||[]).filter(x=>String(x.start_date||'').startsWith(thisYear));
  const usedLeave=yearLeave.reduce((sum,x)=>sum+Number(x.total_days||0),0);
  const recentEvents=(career.events||[]).slice(0,3);

  let nextPromo='—';
  let remainingPromo='';
  if(p.current_grade&&p.current_post_joining_date){
    const rule=PROMO_RULES[String(p.current_grade)];
    if(rule&&!rule.noPromotion&&!rule.top){
      const eduKey=p.education_level||'bachelor';
      const years=rule.years?.[eduKey]||rule.years?.bachelor;
      if(years){
        nextPromo=fmtDateLang(addYears(p.current_post_joining_date,years),lang);
        const rem=diffYMD(today,addYears(p.current_post_joining_date,years));
        remainingPromo=rem&&new Date(addYears(p.current_post_joining_date,years))>new Date(today)?serviceText(rem):(en?'Eligible':'যোগ্য');
      }
    }else if(rule?.top||rule?.noPromotion){
      nextPromo=en?'See roadmap':'রোডম্যাপ দেখুন';
    }
  }

  const completion=[
    p.first_joining_date,p.current_post,p.current_grade,p.current_post_joining_date,
    p.employee_id||p.reference_id
  ].filter(Boolean).length;
  const completionPct=Math.round(completion/5*100);

  const quick=[
    {id:'promotion',Icon:TrendingUp,bn:'পদোন্নতি',en:'Promotion',tone:'green'},
    {id:'points',Icon:Award,bn:'পয়েন্ট',en:'Points',tone:'blue'},
    {id:'salary',Icon:WalletCards,bn:'বেতন',en:'Salary',tone:'orange'},
    {id:'leave',Icon:CalendarDays,bn:'ছুটি',en:'Leave',tone:'pink'},
    {id:'calendar',Icon:CalendarDays,bn:'ক্যালেন্ডার',en:'Calendar',tone:'red'},
    {id:'career',Icon:BookUser,bn:'আমার চাকরি',en:'Career',tone:'violet'},
    {id:'reports',Icon:FileText,bn:'রিপোর্ট',en:'Reports',tone:'cyan'},
    {id:'library',Icon:Boxes,bn:'আরও সেবা',en:'More',tone:'slate'}
  ];

  const pointCards=[
    {Icon:Clock3,bn:'সার্ভিস পয়েন্ট',en:'Service Points',subBn:'চাকরিকালভিত্তিক পয়েন্ট',subEn:'Service-based points'},
    {Icon:GraduationCap,bn:'শিক্ষাগত যোগ্যতার পয়েন্ট',en:'Education Points',subBn:'শিক্ষাগত ফলাফলভিত্তিক পয়েন্ট',subEn:'Qualification-based points'},
    {Icon:Home,bn:'বাসা বরাদ্দ পয়েন্ট',en:'House Allocation Points',subBn:'বাসা বরাদ্দের পয়েন্ট হিসাব',subEn:'House allocation points'}
  ];

  return <div className="unified-dashboard">
    <section className="ud-welcome">
      <div className="ud-profile">
        <div className="ud-avatar"><UserRound/></div>
        <div>
          <small>{en?'WELCOME':'স্বাগতম'}</small>
          <h1>{user.name}</h1>
          <p>{[currentPost,currentGrade,p.department_name||p.office_name].filter(Boolean).join(' · ')}</p>
        </div>
      </div>
      <div className="ud-profile-progress">
        <div className="ud-progress-copy"><span>{en?'Profile complete':'প্রোফাইল সম্পন্ন'}</span><b>{numLang(completionPct,lang,0)}%</b></div>
        <div className="ud-progress-track"><i style={{width:`${completionPct}%`}}></i></div>
        <button onClick={()=>onPage('career')}>{en?'Update profile':'প্রোফাইল আপডেট'}<ChevronRight/></button>
      </div>
    </section>

    <section className="ud-quick-section">
      <div className="ud-section-title"><div><Sparkles/><h2>{en?'Quick Services':'দ্রুত সেবা'}</h2></div></div>
      <div className="ud-quick-grid">
        {quick.map(({id,Icon,bn,en:et,tone})=><button key={id} className={`ud-quick ${tone}`} onClick={()=>onPage(id)}>
          <span><Icon/></span><b>{en?et:bn}</b>
        </button>)}
      </div>
    </section>

    <section className="ud-section-block">
      <div className="ud-section-title"><div><Gauge/><h2>{en?'Your Current Status':'আপনার বর্তমান অবস্থা'}</h2></div></div>
      <div className="ud-status-grid">
        <article><span className="green"><Briefcase/></span><small>{en?'Total Service':'মোট চাকরিকাল'}</small><b>{serviceText(service)}</b><p>{p.first_joining_date?fmtDateLang(p.first_joining_date,lang):'—'}</p></article>
        <article><span className="blue"><Milestone/></span><small>{en?'Current Post Tenure':'বর্তমান পদে চাকরিকাল'}</small><b>{serviceText(postService)}</b><p>{currentPost}</p></article>
        <article><span className="violet"><TrendingUp/></span><small>{en?'Next Promotion Eligibility':'পরবর্তী পদোন্নতির যোগ্যতা'}</small><b>{nextPromo}</b><p>{remainingPromo}</p></article>
        <article><span className="orange"><WalletCards/></span><small>{en?'Latest Basic Salary':'সর্বশেষ মূল বেতন'}</small><b>{latestSalary?`${en?'Tk':'৳'} ${moneyLang(latestSalary.payable_basic||latestSalary.basic_2015||0,lang)}`:'—'}</b><p>{latestSalary?.effective_date?fmtDateLang(latestSalary.effective_date,lang):(en?'No salary history yet':'বেতন ইতিহাস নেই')}</p></article>
      </div>
    </section>

    <section className="ud-two-col">
      <div className="ud-panel">
        <div className="ud-section-title compact"><div><Award/><h2>{en?'Points Center':'পয়েন্ট সেন্টার'}</h2></div><button onClick={()=>onPage('points')}>{en?'View all':'সব দেখুন'}<ChevronRight/></button></div>
        <div className="ud-point-list">
          {pointCards.map(({Icon,bn,en:et,subBn,subEn},i)=><button key={bn} onClick={()=>onPage('points')} className={`pc-${i+1}`}><span><Icon/></span><div><b>{en?et:bn}</b><small>{en?subEn:subBn}</small></div><ChevronRight/></button>)}
        </div>
      </div>

      <div className="ud-panel">
        <div className="ud-section-title compact"><div><CalendarDays/><h2>{en?'Leave Overview':'ছুটির সারাংশ'}</h2></div><button onClick={()=>onPage('leave')}>{en?'Details':'বিস্তারিত'}<ChevronRight/></button></div>
        <div className="ud-leave-hero">
          <span><CalendarDays/></span>
          <div><small>{en?'Leave recorded this year':'চলতি বছরে রেকর্ডকৃত ছুটি'}</small><b>{numLang(usedLeave,lang,1)} {en?'days':'দিন'}</b><p>{numLang(yearLeave.length,lang,0)} {en?'record(s)':'টি রেকর্ড'}</p></div>
        </div>
        <div className="ud-mini-list">
          {yearLeave.slice(0,3).map(x=><div key={x.id}><span>{x.leave_type|| (en?'Leave':'ছুটি')}</span><b>{numLang(x.total_days,lang,1)} {en?'day(s)':'দিন'}</b></div>)}
          {yearLeave.length===0&&<div className="ud-empty">{en?'No leave record for this year':'চলতি বছরের ছুটির রেকর্ড নেই'}</div>}
        </div>
      </div>
    </section>

    <section className="ud-two-col ud-lower">
      <div className="ud-panel">
        <div className="ud-section-title compact"><div><History/><h2>{en?'Career Progress':'ক্যারিয়ার অগ্রগতি'}</h2></div><button onClick={()=>onPage('promotion-timeline')}>{en?'Roadmap':'রোডম্যাপ'}<ChevronRight/></button></div>
        <div className="ud-timeline">
          {recentEvents.map((x,i)=><div className="ud-timeline-row" key={x.id||i}><i></i><div><small>{fmtDateLang(x.event_date,lang)}</small><b>{x.title||x.post_name|| (en?'Career event':'চাকরি ইভেন্ট')}</b><p>{[x.post_name,x.grade?`${en?'Grade':'গ্রেড'} ${numLang(x.grade,lang,0)}`:''].filter(Boolean).join(' · ')}</p></div></div>)}
          {recentEvents.length===0&&<div className="ud-empty">{en?'Add your career events to see the timeline':'টাইমলাইন দেখতে চাকরির ইভেন্ট যোগ করুন'}</div>}
        </div>
      </div>

      <div className="ud-panel">
        <div className="ud-section-title compact"><div><Bell/><h2>{en?'Latest Notices':'সাম্প্রতিক নোটিশ'}</h2></div><button onClick={()=>onPage('library')}>{en?'See all':'সব দেখুন'}<ChevronRight/></button></div>
        <div className="ud-notices">
          {notices.slice(0,4).map((x,i)=><button key={x.id||i} onClick={()=>onPage('library')}><span className={`n${i%4}`}><FileText/></span><div><b>{x.title_bn||x.title||x.title_en||'—'}</b><small>{fmtDateLang(x.published_at||x.created_at||x.date,lang)}</small></div><ChevronRight/></button>)}
          {notices.length===0&&<div className="ud-empty">{en?'No notice available':'কোনো নোটিশ নেই'}</div>}
        </div>
      </div>
    </section>

    <section className="ud-calendar-wrap">
      <div className="ud-section-title"><div><CalendarDays/><h2>{en?'Office Calendar':'অফিস ক্যালেন্ডার'}</h2></div><button onClick={()=>onPage('calendar')}>{en?'Open calendar':'ক্যালেন্ডার খুলুন'}<ChevronRight/></button></div>
      <CalendarDashboardWidget lang={lang} onOpen={()=>onPage('calendar')}/>
    </section>

    {busy&&<div className="ud-loading">{en?'Loading your dashboard...':'আপনার ড্যাশবোর্ড লোড হচ্ছে...'}</div>}
  </div>
}

function DashboardHome({user,onPage,lang='bn'}){
  const admin=['super_admin','admin','department_admin'].includes(user.role);
  return admin?<AdminAnalyticsDashboard user={user} onPage={onPage} lang={lang}/>:<UnifiedEmployeeDashboard user={user} onPage={onPage} lang={lang}/>;
}

function PersonalCareerDashboard({user,onPage,lang='bn'}){
  const en=lang==='en';
  const [career,setCareer]=useState({profile:null,education:[],events:[]}),[loadingCareer,setLoadingCareer]=useState(true),[leaveSummary,setLeaveSummary]=useState({records:0,days:0});
  useEffect(()=>{
    api('/api/my-career').then(x=>setCareer({profile:x.profile||null,education:x.education||[],events:x.events||[]}))
      .catch(()=>setCareer({profile:null,education:[],events:[]})).finally(()=>setLoadingCareer(false));
  },[]);
  useEffect(()=>{
    api('/api/my-leave-records').then(x=>{
      const y=String(new Date().getFullYear()),items=(x.items||[]).filter(i=>String(i.start_date||'').startsWith(y));
      setLeaveSummary({records:items.length,days:items.reduce((s,i)=>s+Number(i.total_days||0),0)});
    }).catch(()=>{});
  },[]);
  const p=career.profile||{};
  const today=todayLocalIso();
  const service=p.first_joining_date&&!isNaN(new Date(p.first_joining_date))?diffYMD(p.first_joining_date,today):null;
  const postTenure=p.current_post_joining_date&&!isNaN(new Date(p.current_post_joining_date))?diffYMD(p.current_post_joining_date,today):null;
  const retirement=(p.first_joining_date||p.retirement_age)&&p.retirement_age&&p.first_joining_date?null:null;
  const retirementDate=p.retirement_age&&career.events?null:null;
  const recentEvents=(career.events||[]).slice(0,4);
  const serviceText=d=>!d?'—':en?`${numLang(d.y,lang,0)}y ${numLang(d.m,lang,0)}m ${numLang(d.d,lang,0)}d`:`${numLang(d.y,lang,0)} বছর ${numLang(d.m,lang,0)} মাস ${numLang(d.d,lang,0)} দিন`;
  const gradeText=p.current_grade?`${en?'Grade':'গ্রেড'} ${numLang(p.current_grade,lang,0)}`:'—';
  const currentPost=p.current_post||'—';
  const eventLabel=t=>en?({appointment:'Appointment/Joining',promotion:'Promotion',transfer:'Transfer/Posting',increment:'Increment',training:'Training',grade_change:'Grade Change',other:'Other'}[t]||t):({appointment:'নিয়োগ/যোগদান',promotion:'পদোন্নতি',transfer:'বদলি/পোস্টিং',increment:'ইনক্রিমেন্ট',training:'প্রশিক্ষণ',grade_change:'গ্রেড পরিবর্তন',other:'অন্যান্য'}[t]||t);

  let nextMilestone=en?'Complete your career profile':'চাকরি প্রোফাইল সম্পূর্ণ করুন';
  let promoEstimate='';
  if(p.current_grade&&p.current_post_joining_date&&PROMO_RULES[String(p.current_grade)]){
    const rule=PROMO_RULES[String(p.current_grade)];
    if(rule.noPromotion||rule.top)nextMilestone=rule.target||nextMilestone;
    else{
      nextMilestone=en?`Review promotion eligibility for Grade ${p.current_grade}`:`গ্রেড ${numLang(p.current_grade,lang,0)} থেকে পদোন্নতির যোগ্যতা যাচাই করুন`;
      promoEstimate=en?'Open the Promotion Calculator for a verified estimate.':'যাচাইকৃত সম্ভাব্য হিসাবের জন্য পদোন্নতি ক্যালকুলেটর খুলুন।';
    }
  }

  return <div className="career-dashboard">
    <section className="career-dashboard-hero">
      <div>
        <span>{en?'PERSONAL CAREER DASHBOARD':'ব্যক্তিগত ক্যারিয়ার ড্যাশবোর্ড'}</span>
        <h1>{en?`Welcome, ${user.name}`:`স্বাগতম, ${user.name}`}</h1>
        <p>{en?'Your personal career record, service milestones and verified calculators in one premium workspace.':'আপনার ব্যক্তিগত চাকরি রেকর্ড, সার্ভিস মাইলস্টোন ও যাচাইকৃত ক্যালকুলেটর এক প্রিমিয়াম কর্মপরিসরে।'}</p>
      </div>
      <div className="career-profile-chip"><BookUser size={17}/><div><small>{en?'Current position':'বর্তমান পদ'}</small><b>{currentPost}</b><span>{gradeText}</span></div></div>
    </section>

    <section className="career-dashboard-metrics">
      <article><div className="career-metric-icon"><Briefcase/></div><div><small>{en?'Current Post':'বর্তমান পদ'}</small><b>{currentPost}</b><span>{gradeText}</span></div></article>
      <article><div className="career-metric-icon"><Clock3/></div><div><small>{en?'Total Service':'মোট চাকরিকাল'}</small><b>{serviceText(service)}</b><span>{p.first_joining_date?fmtDateLang(p.first_joining_date,lang):'—'}</span></div></article>
      <article><div className="career-metric-icon"><Milestone/></div><div><small>{en?'Current Post Tenure':'বর্তমান পদে চাকরিকাল'}</small><b>{serviceText(postTenure)}</b><span>{p.current_post_joining_date?fmtDateLang(p.current_post_joining_date,lang):'—'}</span></div></article>
      <article><div className="career-metric-icon"><GraduationCap/></div><div><small>{en?'Education Records':'শিক্ষাগত রেকর্ড'}</small><b>{numLang(career.education?.length||0,lang,0)}</b><span>{en?'Saved qualifications':'সংরক্ষিত যোগ্যতা'}</span></div></article>
    </section>

    <CalendarDashboardWidget lang={lang} onOpen={()=>onPage('calendar')}/>

    <section className="career-dashboard-grid">
      <article className="career-dashboard-card milestone-card">
        <div className="career-dashboard-card-head"><div><Milestone/><span>{en?'NEXT CAREER MILESTONE':'পরবর্তী ক্যারিয়ার মাইলস্টোন'}</span></div></div>
        <h3>{nextMilestone}</h3>
        <p>{promoEstimate|| (en?'Keep your personal career record updated so the platform can provide better estimates.':'আরও নির্ভুল সহায়ক হিসাবের জন্য নিজের চাকরি রেকর্ড হালনাগাদ রাখুন।')}</p>
        <div className="career-card-actions">
          <button className="primary" onClick={()=>onPage('promotion')}><TrendingUp size={16}/>{en?'Promotion Estimate':'পদোন্নতি হিসাব'}</button>
          <button className="secondary" onClick={()=>onPage('career')}><Edit3 size={16}/>{en?'Update My Career':'আমার চাকরি আপডেট'}</button>
        </div>
      </article>

      <article className="career-dashboard-card salary-link-card">
        <div className="career-dashboard-card-head"><div><WalletCards/><span>{en?'SALARY & PAY SCALE':'বেতন ও পে-স্কেল'}</span></div></div>
        <h3>{en?'Verified salary calculation':'যাচাইকৃত বেতন হিসাব'}</h3>
        <p>{en?'Use the existing verified 2015→2026 pay-scale logic without changing your personal record.':'আপনার ব্যক্তিগত রেকর্ড না বদলিয়ে বিদ্যমান যাচাইকৃত ২০১৫→২০২৬ পে-স্কেল হিসাব ব্যবহার করুন।'}</p>
        <button className="ghost-btn" onClick={()=>onPage('salary')}>{en?'Open Pay Scale Calculator':'পে-স্কেল ক্যালকুলেটর খুলুন'}<ChevronRight size={16}/></button>
      </article>
    </section>

    <section className="career-dashboard-grid lower">
      <article className="career-dashboard-card">
        <div className="career-dashboard-card-head"><div><History/><span>{en?'RECENT CAREER TIMELINE':'সাম্প্রতিক চাকরি টাইমলাইন'}</span></div><button className="mini-link" onClick={()=>onPage('career')}>{en?'View all':'সব দেখুন'}<ChevronRight size={14}/></button></div>
        {loadingCareer?<div className="empty">{en?'Loading...':'লোড হচ্ছে...'}</div>:recentEvents.length===0?<div className="career-empty-state"><History/><div><b>{en?'No career events yet':'এখনো চাকরি ইভেন্ট নেই'}</b><p>{en?'Add promotion, posting, increment or training records from My Career.':'আমার চাকরি থেকে পদোন্নতি, পোস্টিং, ইনক্রিমেন্ট বা প্রশিক্ষণ রেকর্ড যোগ করুন।'}</p></div></div>:<div className="career-recent-list">
          {recentEvents.map(x=><div className="career-recent-row" key={x.id}><div className="career-recent-dot"></div><div><small>{fmtDateLang(x.event_date,lang)} · {eventLabel(x.event_type)}</small><b>{x.title}</b><p>{[x.post_name,x.grade?`${en?'Grade':'গ্রেড'} ${x.grade}`:'',x.office_name].filter(Boolean).join(' · ')}</p></div></div>)}
        </div>}
      </article>

      <article className="career-dashboard-card">
        <div className="career-dashboard-card-head"><div><Calculator/><span>{en?'QUICK CALCULATORS':'দ্রুত ক্যালকুলেটর'}</span></div></div>
        <div className="career-quick-tools">
          <button onClick={()=>onPage('calculators')}><Clock3/><div><b>{en?'Service Length':'চাকরিকাল'}</b><small>{en?'Years, months, days':'বছর, মাস, দিন'}</small></div><ChevronRight/></button>
          <button onClick={()=>onPage('promotion')}><TrendingUp/><div><b>{en?'Promotion':'পদোন্নতি'}</b><small>{en?'Eligibility & roadmap':'যোগ্যতা ও রোডম্যাপ'}</small></div><ChevronRight/></button>
          <button onClick={()=>onPage('salary')}><WalletCards/><div><b>{en?'Pay Scale':'পে-স্কেল'}</b><small>{en?'Gross, deductions, net':'মোট, কর্তন, নিট'}</small></div><ChevronRight/></button>
          <button onClick={()=>onPage('leave')}><CalendarDays/><div><b>{en?'Leave Record':'ছুটির হিসাব'}</b><small>{en?`${leaveSummary.days} day(s) this year`:`চলতি বছরে ${numLang(leaveSummary.days,lang,1)} দিন`}</small></div><ChevronRight/></button>
        </div>
      </article>
    </section>

    {!p.first_joining_date&&<section className="career-dashboard-alert"><AlertTriangle/><div><b>{en?'Career profile incomplete':'চাকরি প্রোফাইল অসম্পূর্ণ'}</b><p>{en?'Add your first joining date, current post and grade to unlock a more useful career dashboard.':'আরও কার্যকর ক্যারিয়ার ড্যাশবোর্ডের জন্য প্রথম যোগদান, বর্তমান পদ ও গ্রেড যোগ করুন।'}</p></div><button onClick={()=>onPage('career')}>{en?'Complete Profile':'প্রোফাইল সম্পূর্ণ করুন'}<ArrowRight size={15}/></button></section>}
    <section className="calculator-safety-note"><ShieldCheck/><div><b>{en?'Personal assistance only':'শুধু ব্যক্তিগত সহায়তা'}</b><p>{en?'This dashboard organizes your own data and provides estimates. It does not make or issue official employment decisions.':'এই ড্যাশবোর্ড আপনার নিজের তথ্য সংগঠিত করে ও সহায়ক হিসাব দেয়; কোনো অফিসিয়াল চাকরি-সংক্রান্ত সিদ্ধান্ত দেয় না।'}</p></div></section>
  </div>
}

function DMY({label,value,onChange}){
  const en=/[A-Za-z]/.test(label||''); const d=value?new Date(value+'T00:00:00'):null; const year=d&&!isNaN(d)?d.getFullYear():''; const month=d&&!isNaN(d)?d.getMonth()+1:''; const day=d&&!isNaN(d)?d.getDate():'';
  const years=Array.from({length:70},(_,i)=>new Date().getFullYear()-i),months=Array.from({length:12},(_,i)=>i+1),days=Array.from({length:31},(_,i)=>i+1);
  function setPart(part,v){let y=year||new Date().getFullYear(),m=month||1,dd=day||1;if(part==='y')y=Number(v);if(part==='m')m=Number(v);if(part==='d')dd=Number(v);const max=new Date(y,m,0).getDate();dd=Math.min(dd,max);onChange(`${y}-${String(m).padStart(2,'0')}-${String(dd).padStart(2,'0')}`)}
  return <label>{label}<div className="dmy"><select value={day} onChange={e=>setPart('d',e.target.value)}><option value="">{en?'Day':'দিন'}</option>{days.map(x=><option key={x}>{x}</option>)}</select><select value={month} onChange={e=>setPart('m',e.target.value)}><option value="">{en?'Month':'মাস'}</option>{months.map(x=><option key={x} value={x}>{en?new Intl.DateTimeFormat('en',{month:'short'}).format(new Date(2020,x-1,1)):new Intl.DateTimeFormat('bn-BD',{month:'long'}).format(new Date(2020,x-1,1))}</option>)}</select><select value={year} onChange={e=>setPart('y',e.target.value)}><option value="">{en?'Year':'বছর'}</option>{years.map(x=><option key={x}>{x}</option>)}</select></div></label>
}

function PromotionCenter({lang='bn'}){
  const en=lang==='en', today=todayLocalIso();
  const gp=guestLocalProfile();
  const [f,setF]=useState({grade:String(gp.grade||'13'),edu:'bachelor',currentDate:gp.current_post_joining_date||'',firstJoinDate:gp.first_joining_date||'',calcDate:today,computer:'yes',acr:'yes'}),[result,setResult]=useState(null);
  useEffect(()=>{setF(x=>({...x,calcDate:todayLocalIso()}))},[]);
  function calc(){
    const asOf=todayLocalIso(); const next={...f,calcDate:asOf}; setF(next);
    const rule=PROMO_RULES[next.grade]; if(!rule)return setResult({error:en?'No rule was found for this grade.':'এই গ্রেডের নিয়ম পাওয়া যায়নি।',input:next});
    if(rule.noPromotion||rule.top)return setResult({stop:true,rule,input:next});
    if(!next.currentDate||!next.firstJoinDate)return setResult({error:en?'Enter the first joining date and the current post joining date.':'প্রথম যোগদানের তারিখ ও বর্তমান পদে যোগদানের তারিখ দিন।',input:next});
    const current=new Date(next.currentDate),first=new Date(next.firstJoinDate),calcDate=new Date(asOf);
    if(first>current)return setResult({error:en?'The first joining date cannot be later than the current post joining date.':'প্রথম যোগদানের তারিখ বর্তমান পদে যোগদানের তারিখের পরে হতে পারে না।',input:next});
    if(current>calcDate)return setResult({error:en?'The current post joining date cannot be later than today.':'বর্তমান পদে যোগদানের তারিখ আজকের তারিখের পরে হতে পারে না।',input:next});
    const req=rule.years?.[next.edu]??4, eligible=addYears(next.currentDate,req), elapsed=diffYMD(next.currentDate,asOf), remaining=eligible>calcDate?diffYMD(calcDate,eligible):{y:0,m:0,d:0};
    const exp=serviceExperiencePoints({currentPostStart:next.currentDate,firstJoin:next.firstJoinDate,asOf});
    const prelim=calcDate>=eligible&&next.computer==='yes'&&next.acr==='yes';
    const cycle=annualPromotionCycle(eligible);
    const roadmap=futureRoadmap(next.grade,next.currentDate,next.edu,6);
    const projectedExp=serviceExperiencePoints({currentPostStart:next.currentDate,firstJoin:next.firstJoinDate,asOf:eligible});
    setResult({rule,req,eligible,elapsed,remaining,exp,points:exp.valid?exp.points:0,projectedExp,prelim,cycle,roadmap,input:next});
  }
  const eduOptions=en?[['masters','Masters'],['bachelor',"Bachelor's"],['hsc','HSC'],['diploma','Diploma'],['bsceng','BSc Engineering'],['mbbs','MBBS']]:[['masters','মাস্টার্স'],['bachelor','স্নাতক'],['hsc','এইচএসসি'],['diploma','ডিপ্লোমা'],['bsceng','বিএসসি ইঞ্জিনিয়ারিং'],['mbbs','এমবিবিএস']];
  return <div>
    <div className="page-head"><div><h2>{en?'Promotion Calculator':'পদোন্নতি হিসাব'}</h2><p>{en?'The calculation date is automatically taken as today.':'হিসাবের তারিখ আজকের তারিখ থেকে স্বয়ংক্রিয়ভাবে নেওয়া হবে।'}</p></div></div>
    <section className="calc-card"><div className="form-grid">
      <label>{en?'Current grade':'বর্তমান গ্রেড'}<select value={f.grade} onChange={e=>setF({...f,grade:e.target.value})}>{['17','16','15','14','13','12','11','10','9','6','4'].map(g=><option key={g} value={g}>{en?'Grade':'গ্রেড'} {g}</option>)}</select></label>
      <label>{en?'Education':'শিক্ষাগত যোগ্যতা'}<select value={f.edu} onChange={e=>setF({...f,edu:e.target.value})}>{eduOptions.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label>
      <DMY label={en?'First joining date':'প্রথম যোগদানের তারিখ'} value={f.firstJoinDate} onChange={v=>setF({...f,firstJoinDate:v})}/>
      <DMY label={en?'Current post joining date':'বর্তমান পদে যোগদানের তারিখ'} value={f.currentDate} onChange={v=>setF({...f,currentDate:v})}/>
      <label>{en?'Computer skill / training':'কম্পিউটার দক্ষতা/প্রশিক্ষণ'}<select value={f.computer} onChange={e=>setF({...f,computer:e.target.value})}><option value="yes">{en?'Yes':'আছে'}</option><option value="no">{en?'No':'নেই'}</option></select></label>
      <label>{en?'ACR condition':'ACR শর্ত'}<select value={f.acr} onChange={e=>setF({...f,acr:e.target.value})}><option value="yes">{en?'Satisfactory':'সন্তোষজনক'}</option><option value="no">{en?'Incomplete / No':'অসম্পূর্ণ/না'}</option></select></label>
    </div><div className="notice"><b>{en?'Calculation date:':'হিসাবের তারিখ:'}</b> {fmtDateLang(today,lang)} — {en?'automatic; no input is required.':'স্বয়ংক্রিয়, আলাদা ঘর পূরণ করতে হবে না।'}</div><button className="primary wide" onClick={calc}>{en?'Calculate Promotion':'পদোন্নতি হিসাব করুন'}</button></section>
    {result&&<PromotionResult r={result} lang={lang}/>} </div>
}
function PromotionResult({r,lang='bn'}){
  const en=lang==='en',[preview,setPreview]=useState(false);
  if(r.error)return <section className="result-panel warn"><h3>{en?'Unable to calculate':'হিসাব করা যায়নি'}</h3><p>{r.error}</p></section>;
  const report=promotionReportHtml(r,lang),filename=`promotion-report-${Date.now()}.pdf`;
  if(r.stop)return <div className="result-stack"><section className="result-panel warn"><h3>{r.rule.target}</h3><p>{en?'Reference':'রেফারেন্স'}: {r.rule.ref||r.rule.page||'—'}</p></section><button className="primary wide" onClick={()=>setPreview(true)}><FileText size={17}/> {en?'A4 PDF Preview':'বিস্তারিত A4 PDF প্রিভিউ'}</button>{preview&&<PdfPreviewModal html={report} filename={filename} onClose={()=>setPreview(false)} lang={lang} shareTitle={en?'Promotion Calculation Report':'পদোন্নতি হিসাবের রিপোর্ট'} shareSummary={en?'Promotion eligibility, service points and roadmap report.':'পদোন্নতির যোগ্যতা, সার্ভিস পয়েন্ট ও রোডম্যাপের রিপোর্ট।'}/>}</div>;

  const e=r.exp||{}, pe=r.projectedExp||{};
  const dur=x=>en?`${x.y} years ${x.m} months ${x.d} days`:durationBn(x);
  const hasRemaining=!!(r.remaining.y||r.remaining.m||r.remaining.d);
  const eligibleNow=!hasRemaining;
  const projectedPoints=pe.valid?Number(pe.points||0):null;
  const nextTwo=(r.roadmap||[]).filter(x=>!x.stop).slice(0,2);

  return <div className="result-stack promotion-forecast">
    <section className={`forecast-hero ${r.prelim?'ready':'waiting'}`}>
      <div className="forecast-main">
        <span>{en?'NEXT PROMOTION FORECAST':'পরবর্তী পদোন্নতি পূর্বাভাস'}</span>
        <h3>{r.rule.target}</h3>
        <p>{en?'Target grade':'লক্ষ্য গ্রেড'}: <b>{r.rule.targetGrade}</b> · {en?'Required service':'প্রয়োজনীয় চাকরিকাল'}: <b>{numLang(r.req,lang,0)} {en?'years':'বছর'}</b></p>
      </div>
      <div className="forecast-status">
        <ShieldCheck/>
        <div><small>{en?'Current status':'বর্তমান অবস্থা'}</small><b>{r.prelim?(en?'Preliminarily eligible':'প্রাথমিকভাবে যোগ্য'):(eligibleNow?(en?'Service completed; conditions pending':'চাকরিকাল পূর্ণ; শর্ত যাচাই বাকি'):(en?'Waiting for eligibility':'যোগ্যতার অপেক্ষায়'))}</b></div>
      </div>
    </section>

    <section className="forecast-kpi-grid">
      <article><div className="fk-icon"><CalendarDays/></div><div><small>{en?'Eligibility date':'যোগ্যতার তারিখ'}</small><b>{fmtDateLang(r.eligible,lang)}</b><span>{en?'Earliest rule-based eligibility':'নীতিমালাভিত্তিক সর্বপ্রথম যোগ্যতার সময়'}</span></div></article>
      <article><div className="fk-icon"><Clock3/></div><div><small>{en?'More service required':'আরও চাকরি প্রয়োজন'}</small><b>{hasRemaining?dur(r.remaining):(en?'Completed':'সময় পূর্ণ')}</b><span>{en?'From today':'আজকের তারিখ থেকে'}</span></div></article>
      <article><div className="fk-icon"><TrendingUp/></div><div><small>{en?'Current service points':'বর্তমান সার্ভিস পয়েন্ট'}</small><b>{numLang(r.points,lang)}</b><span>{en?'Calculated under the existing service-point rule':'বিদ্যমান সার্ভিস-পয়েন্ট নিয়ম অনুযায়ী'}</span></div></article>
      <article><div className="fk-icon"><Award/></div><div><small>{en?'Projected points at eligibility':'যোগ্যতার সময় সম্ভাব্য সার্ভিস পয়েন্ট'}</small><b>{projectedPoints===null?'—':numLang(projectedPoints,lang)}</b><span>{en?'Projection, not a separate minimum-point requirement':'এটি পূর্বাভাস; আলাদা ন্যূনতম পয়েন্ট শর্ত নয়'}</span></div></article>
    </section>

    <section className="promotion-window-card">
      <div className="promotion-window-head"><div><span>{en?'FORECAST TIMELINE':'সম্ভাব্য সময়রেখা'}</span><h3>{en?'From eligibility to possible promotion':'যোগ্যতা থেকে সম্ভাব্য পদোন্নতি'}</h3></div><div className="projection-badge">{en?'Projected':'সম্ভাব্য'}</div></div>
      <div className="promotion-timeline">
        <div className="pt-step done"><i><CheckCircle2/></i><small>{en?'Today':'আজ'}</small><b>{fmtDateLang(r.input?.calcDate||todayLocalIso(),lang)}</b></div>
        <span className="pt-line"/>
        <div className={`pt-step ${eligibleNow?'done':'next'}`}><i><CalendarDays/></i><small>{en?'Eligibility completed':'যোগ্যতা পূর্ণ'}</small><b>{fmtDateLang(r.eligible,lang)}</b></div>
        <span className="pt-line"/>
        <div className="pt-step future"><i><FileText/></i><small>{en?'Possible application period':'সম্ভাব্য আবেদন সময়'}</small><b>{en?'From eligibility onward':'যোগ্যতার পর থেকে'}</b><em>{en?'Subject to publication of circular/notice':'বিজ্ঞপ্তি/দরখাস্ত আহ্বান সাপেক্ষে'}</em></div>
        <span className="pt-line"/>
        <div className="pt-step future"><i><ShieldCheck/></i><small>{en?'Projected completion':'সম্ভাব্য চূড়ান্ত পদোন্নতি'}</small><b>{fmtDateLang(r.cycle.completionDeadline,lang)}</b><em>{en?'One-year process projection':'১ বছরের প্রক্রিয়া ধরে পূর্বাভাস'}</em></div>
      </div>
      <div className="forecast-disclaimer"><AlertTriangle/><p>{en?'Eligibility is calculated from the applicable rules. Application and final promotion dates are shown as estimates.':'যোগ্যতার তারিখ প্রযোজ্য নিয়ম অনুযায়ী হিসাব করা হয়। আবেদন ও চূড়ান্ত পদোন্নতির তারিখ সম্ভাব্য সময় হিসেবে দেখানো হয়।'}</p></div>
    </section>

    <section className="forecast-requirements">
      <div className="fr-head"><h3>{en?'What is still required?':'এখনও কী কী প্রয়োজন?'}</h3><span>{en?'Live checklist':'বর্তমান চেকলিস্ট'}</span></div>
      <div className="fr-grid">
        <div className={eligibleNow?'ok':'wait'}><CheckCircle2/><div><b>{en?'Required service':'প্রয়োজনীয় চাকরিকাল'}</b><small>{eligibleNow?(en?'Completed':'পূরণ হয়েছে'):(en?`${dur(r.remaining)} remaining`:`আরও ${dur(r.remaining)} বাকি`)}</small></div></div>
        <div className={r.input?.computer==='yes'?'ok':'wait'}><MonitorCheck/><div><b>{en?'Computer skill/training':'কম্পিউটার দক্ষতা/প্রশিক্ষণ'}</b><small>{r.input?.computer==='yes'?(en?'Available':'আছে'):(en?'Still required':'এখনও প্রয়োজন')}</small></div></div>
        <div className={r.input?.acr==='yes'?'ok':'wait'}><CheckCircle2/><div><b>{en?'ACR condition':'ACR শর্ত'}</b><small>{r.input?.acr==='yes'?(en?'Satisfactory':'সন্তোষজনক'):(en?'Not yet satisfied':'এখনও পূর্ণ নয়')}</small></div></div>
      </div>
    </section>

    <section className="breakdown-card"><h3>{en?'Service point breakdown':'সার্ভিস পয়েন্টের বিস্তারিত'}</h3>
      <div className="money-row"><span>{en?'Current post':'বর্তমান পদ'}: {numLang(e.currentYears||0,lang)} {en?'years × 1':'বছর × ১'}</span><b>{numLang(e.currentPoints||0,lang)}</b></div>
      <div className="money-row"><span>{en?'Previous total service (auto)':'পূর্ববর্তী মোট চাকরিকাল (অটো)'}: {numLang(e.priorServiceYears||0,lang)} {en?'years ÷ 3':'বছর ÷ ৩'}</span><b>{numLang(e.priorServicePoints||0,lang)}</b></div>
      <div className="money-row"><span>{en?'Education-based service requirement':'শিক্ষাগত যোগ্যতাভিত্তিক চাকরিকাল'}</span><b>{numLang(r.req,lang,0)} {en?'years required for this grade':'বছর প্রয়োজন'}</b></div>
      
    </section>

    {nextTwo.length>0&&<section className="next-two-card">
      <div className="next-two-head"><div><span>{en?'CAREER PROJECTION':'ক্যারিয়ার পূর্বাভাস'}</span><h3>{en?'Next two possible promotion steps':'পরবর্তী ২টি সম্ভাব্য পদোন্নতির ধাপ'}</h3></div></div>
      <div className="next-two-grid">
        {nextTwo.map((x,i)=><article key={i}>
          <div className="step-no">{numLang(i+1,lang,0)}</div>
          <div><small>{en?'Possible step':'সম্ভাব্য ধাপ'}</small><h4>{en?'Grade':'গ্রেড'} {x.fromGrade} → {x.toGrade}</h4><p>{x.title}</p></div>
          <div className="step-date"><small>{en?'Projected final date':'সম্ভাব্য চূড়ান্ত সময়'}</small><b>{fmtDateLang(x.completionDeadline,lang)}</b></div>
        </article>)}
      </div>
    </section>}

    <section className="roadmap-card"><h3>{en?'Full future promotion roadmap':'সম্পূর্ণ সম্ভাব্য পদোন্নতি রোডম্যাপ'}</h3>{r.roadmap.map((x,i)=>x.stop?<div className="roadmap-row stop" key={i}><b>{en?'After grade':'গ্রেড'} {x.fromGrade}</b><span>{x.label}</span></div>:<div className="roadmap-row" key={i}><div><b>{x.fromGrade} → {x.toGrade} · {x.title}</b><small>{x.years} {en?'years':'বছর'}</small></div><div><b>{fmtDateLang(x.completionDeadline,lang)}</b><small>{en?'Projected final promotion':'সম্ভাব্য চূড়ান্ত পদোন্নতি'}</small></div></div>)}</section>

    <button className="primary wide" onClick={()=>setPreview(true)}><FileText size={17}/> {en?'A4 PDF Preview':'বিস্তারিত A4 PDF প্রিভিউ'}</button>
    {preview&&<PdfPreviewModal html={report} filename={filename} onClose={()=>setPreview(false)} lang={lang} shareTitle={en?'Promotion Calculation Report':'পদোন্নতি হিসাবের রিপোর্ট'} shareSummary={en?'Promotion eligibility, service points and roadmap report.':'পদোন্নতির যোগ্যতা, সার্ভিস পয়েন্ট ও রোডম্যাপের রিপোর্ট।'}/>}
  </div>
}

function normalizeDuCategory(value){
  const v=String(value||'').trim().toLowerCase().replace(/[\s-]+/g,'_');
  if(!v)return '';
  if(v==='teacher'||v.includes('teacher'))return 'teacher';
  if(v==='officer'||v.includes('officer'))return 'officer';
  if(['class3','third','third_general','third_technical','3rd','3rd_class','class_iii'].includes(v)||v.includes('third')||v.includes('3rd')||v.includes('class_iii'))return 'class3';
  if(['class4','fourth','fourth_general','fourth_technical','4th','4th_class','class_iv'].includes(v)||v.includes('fourth')||v.includes('4th')||v.includes('class_iv'))return 'class4';
  return '';
}
function salaryProfilePrefill(profile={}){
  const category=normalizeDuCategory(profile.category||profile.employee_category||profile.employment_type);
  const rawGrade=String(profile.grade??profile.current_grade??'').trim();
  const grade=/^(?:[1-9]|1\d|20)$/.test(rawGrade)?rawGrade:'';
  return {category,grade};
}
function duCategoryInfo(category,lang='bn'){
  const en=lang==='en';
  const map={
    teacher:{label:en?'Teacher':'শিক্ষক',beneRate:.05},
    officer:{label:en?'Officer':'কর্মকর্তা',beneRate:.05},
    class3:{label:en?'Class III employee':'৩য় শ্রেণির কর্মচারী',beneRate:.04},
    class4:{label:en?'Class IV employee':'৪র্থ শ্রেণির কর্মচারী',beneRate:.0275}
  };
  return map[normalizeDuCategory(category)]||map.class3;
}
function duPayrollDeductionRules({category,date,basic,grade}={}){
  const c=normalizeDuCategory(category)||'class3';
  const d=String(date||'').slice(0,10);
  const b=Math.max(0,Number(basic||0));
  const g=Number(grade||0);
  const beneRate=({teacher:.05,officer:.05,class3:.04,class4:.0275}[c]??.04);
  const pfRate=.10;
  const health=149.34;

  // Verified from multiple DU Class III payslips across Grades 12, 13 and 16
  // and different 2015 pay steps: from July 2026, Group Insurance is a fixed Tk 174.
  // June 2026 is not generalized; only the previously supplied Grade 13/basic 14,760
  // sample is verified at Tk 192.50.
  const class3CurrentGroup=(c==='class3'&&d>='2026-07-01')?174:null;
  const juneVerifiedGroup=(c==='class3'&&g===13&&b===14760&&d>='2026-06-01'&&d<='2026-06-30')?192.50:null;
  const group=class3CurrentGroup??juneVerifiedGroup;
  const groupRuleVerified=group!==null;

  return {
    category:c,date:d,basic:b,grade:g,
    pfRate,beneRate,
    pf:Math.round(b*pfRate*100)/100,
    bene:Math.round(b*beneRate*100)/100,
    health,group,groupRuleVerified,stamp:10,association:10
  };
}
function SalaryFlowProgress({step=1,lang='bn'}){
  const en=lang==='en';
  const items=[
    [en?'Information':'তথ্য',en?'3 basics':'৩টি মূল তথ্য'],
    [en?'Adjustments':'সমন্বয়',en?'Only if needed':'প্রয়োজনে'],
    [en?'Result':'ফলাফল',en?'Salary & arrear':'বেতন ও বকেয়া'],
    [en?'Report':'রিপোর্ট',en?'PDF & share':'PDF ও শেয়ার']
  ];
  return <div className="salary-flow-progress" aria-label={en?'Calculation progress':'হিসাবের অগ্রগতি'}>
    {items.map(([title,sub],i)=>{
      const n=i+1,done=n<step,active=n===step;
      return <div key={n} className={`salary-flow-step ${done?'done':''} ${active?'active':''}`}>
        <span>{done?<CheckCircle2/>:numLang(n,lang,0)}</span><div><b>{title}</b><small>{sub}</small></div>
      </div>;
    })}
  </div>;
}

function SalaryCalculator({lang='bn',publicMode=false,initialArrear=false}){
  const en=lang==='en',today=todayLocalIso();
  const compactPwa=typeof window!=='undefined'&&(
    window.matchMedia?.('(max-width: 900px)').matches||
    /android|iphone|ipad|ipod|mobile/i.test(navigator.userAgent||'')
  );
  const guestProfile=publicMode?guestLocalProfile():{};
  const initialProfilePrefill=salaryProfilePrefill(guestProfile);
  const [f,setF]=useState({
    grade:initialProfilePrefill.grade||'13',currentStage:'0',date:today,housing:'none',duQuarterRent:'0',duQuarterOther:'0',
    children:'0',educationClaimedElsewhere:'no',tiffin:'yes',zone:'dhaka',
    ageBand:'under50',incrementEligible2026:'yes',mobile:'yes',laundry:'no',
    disabledChildren:'0',disabledBenefitElsewhere:'no',chargeAllowance:'no',otherSpecialAllowance:'0',
    deductionMode:'du_auto',category:initialProfilePrefill.category||'class3',gpfRate:'10',benevolent:'0',
    health:'149.34',group:'',stamp:'10',association:'10',tax:'0',loan:'0',other:'0'
  });
  const [r,setR]=useState(null);
  const [formStep,setFormStep]=useState(1);
  const [profileAuto,setProfileAuto]=useState(Boolean(initialProfilePrefill.category||initialProfilePrefill.grade));
  useEffect(()=>{
    if(publicMode)return;
    let alive=true;
    api('/api/my-career').then(x=>{
      if(!alive)return;
      const pref=salaryProfilePrefill(x?.profile||{});
      if(!pref.category&&!pref.grade)return;
      setF(v=>({
        ...v,
        ...(pref.category?{category:pref.category}:{}),
        ...(pref.grade?{grade:pref.grade,currentStage:'0'}:{})
      }));
      setProfileAuto(true);
    }).catch(()=>{});
    return()=>{alive=false};
  },[publicMode]);
  const stages=PAY2015[f.grade]||[];
  const currentIndex=Math.min(Math.max(0,Number(f.currentStage||0)),Math.max(0,stages.length-1));
  const categoryInfo=duCategoryInfo(f.category,lang);
  const currentAutoRules=duPayrollDeductionRules({category:f.category,date:today,basic:0,grade:Number(f.grade)});

  function calc(){
    const grade=Number(f.grade),currentBasic=stages[currentIndex]||0,input={...f,date:today,zone:'dhaka'};
    const make=(date,label,opts={})=>{
      const baseBasic=Number(opts.currentBasic??currentBasic);
      const eligible=opts.incrementEligible??(f.incrementEligible2026==='yes');
      const effectiveChildren=f.educationClaimedElsewhere==='yes'?0:Number(f.children||0);
      const effectiveDisabledChildren=f.disabledBenefitElsewhere==='yes'?0:Number(f.disabledChildren||0);
      const snap=salary2026Snapshot({
        grade,currentBasic:baseBasic,date,incrementEligible2026:eligible,
        housing:f.housing==='du_quarter'?'du_quarter':'no',zone:'dhaka',ageBand:f.ageBand,
        children:effectiveChildren,tiffin:f.tiffin==='yes',conveyance:true,
        mobile:f.mobile==='yes',laundry:f.laundry==='yes',disabledChildren:effectiveDisabledChildren,
        areaType:'none',trainingInstructor:false,chargeAllowance:f.chargeAllowance==='yes',
        entertainmentTier:'none',otherSpecialAllowance:f.otherSpecialAllowance
      });
      const duAuto=f.deductionMode!=='custom';
      const deductionDate=String(opts.deductionDate||date).slice(0,10);
      const autoRules=duPayrollDeductionRules({category:f.category,date:deductionDate,basic:snap.payableBasic,grade});
      const gpfRate=duAuto?autoRules.pfRate*100:Math.max(0,Math.min(25,Number(f.gpfRate||0)));
      const pf=duAuto?autoRules.pf:Math.round(snap.payableBasic*(gpfRate/100)*100)/100;
      const info=duCategoryInfo(f.category,lang);
      const beneRate=duAuto?autoRules.beneRate:info.beneRate;
      const bene=duAuto?autoRules.bene:Number(f.benevolent||0);
      const health=duAuto?autoRules.health:Number(f.health||0);
      const group=duAuto?(autoRules.groupRuleVerified?Number(autoRules.group||0):Number(f.group||0)):Number(f.group||0);
      const stamp=duAuto?autoRules.stamp:Number(f.stamp||0);
      const association=duAuto?autoRules.association:Number(f.association||0);
      const quarterRent=f.housing==='du_quarter'?Math.max(0,Number(f.duQuarterRent||0)):0;
      const quarterOther=f.housing==='du_quarter'?Math.max(0,Number(f.duQuarterOther||0)):0;
      const tax=Math.max(0,Number(f.tax||0)),loan=Math.max(0,Number(f.loan||0)),other=Math.max(0,Number(f.other||0));
      const scaleLinkedDeductions=pf+bene+health+group+stamp+association+quarterRent+quarterOther+tax;
      const personalRecoveries=loan+other;
      const deductions=scaleLinkedDeductions+personalRecoveries;
      return {
        ...snap,label,deductionMode:f.deductionMode,category:f.category,categoryLabel:info.label,
        deductionDate,autoRules,autoRuleIncomplete:duAuto&&!autoRules.groupRuleVerified,gpfRate,pf,beneRate,bene,health,group,stamp,association,quarterRent,quarterOther,tax,loan,other,
        scaleLinkedDeductions,personalRecoveries,deductions,
        arrearDeductions:scaleLinkedDeductions,
        arrearNet:snap.gross-scaleLinkedDeductions,
        net:snap.gross-deductions,location:'ঢাকা বিশ্ববিদ্যালয়, ঢাকা',housingMode:f.housing,
        educationClaimedElsewhere:f.educationClaimedElsewhere,disabledBenefitElsewhere:f.disabledBenefitElsewhere
      };
    };

    const chosen=make(today,en?'Current calculation':'বর্তমান হিসাব');
    const projections=[
      make('2026-07-01',en?'2026 · 1 July':'২০২৬ · ১ জুলাই'),
      make('2027-01-01',en?'2027 · 1 January':'২০২৭ · ১ জানুয়ারি'),
      make('2027-07-01',en?'2027 · 1 July · annual increment':'২০২৭ · ১ জুলাই · বার্ষিক ইনক্রিমেন্ট'),
      make('2028-01-01',en?'2028 · 1 January · new allowances':'২০২৮ · ১ জানুয়ারি · নতুন ভাতা'),
      make('2028-07-01',en?'2028 · 1 July · annual increment':'২০২৮ · ১ জুলাই · বার্ষিক ইনক্রিমেন্ট')
    ];

    const julyIncrementEligible=f.incrementEligible2026==='yes';
    const oldJulyBasic=incremented2015Basic(grade,currentBasic,julyIncrementEligible?1:0);
    const legacyIncrementPaid=Math.max(0,Number(oldJulyBasic||0)-Number(currentBasic||0));
    const legacyJune=make('2026-06-30',en?'Legacy June 2026 payroll':'জুন ২০২৬ পুরোনো পে-রোল',{currentBasic:oldJulyBasic,incrementEligible:false,deductionDate:'2026-06-30'});
    const october=make('2026-10-01',en?'October 2026':'অক্টোবর ২০২৬');
    const newScaleIncrementAmount=Math.max(0,Number(october.fixedWithFirstIncrement||0)-Number(october.fixed||0));
    const special=specialBenefit2025(grade,oldJulyBasic);
    const receivedMonths=3;

    const monthlySettlements=[
      ['2026-07-01','July','জুলাই'],
      ['2026-08-01','August','আগস্ট'],
      ['2026-09-01','September','সেপ্টেম্বর']
    ].map(([date,enMonth,bnMonth])=>{
      const newEntitlement=make(date,en?`${enMonth} 2026 entitlement`:`${bnMonth} ২০২৬ প্রাপ্য`);
      const oldPaid=make('2026-06-30',en?`${enMonth} 2026 old payroll`:`${bnMonth} ২০২৬ পুরোনো পে-রোল`,{
        currentBasic:oldJulyBasic,incrementEligible:false,deductionDate:date
      });
      const basicAdjustment=Number(newEntitlement.payableBasic||0)-Number(oldPaid.payableBasic||0);
      const grossAdjustment=Number(newEntitlement.gross||0)-Number(oldPaid.gross||0);
      const deductionAdjustment=Number(newEntitlement.arrearDeductions||0)-Number(oldPaid.arrearDeductions||0);
      const netBeforeSpecial=Number(newEntitlement.arrearNet||0)-Number(oldPaid.arrearNet||0);
      const specialAdjustment=Number(special.monthly||0);
      const finalArrear=Math.max(0,netBeforeSpecial-specialAdjustment);
      return {
        date,month:en?enMonth:bnMonth,monthEn:enMonth,monthBn:bnMonth,
        oldPaid,newEntitlement,basicAdjustment,grossAdjustment,deductionAdjustment,
        netBeforeSpecial,specialAdjustment,finalArrear
      };
    });

    const specialBenefitReceivedAmount=monthlySettlements.reduce((sum,m)=>sum+Number(m.specialAdjustment||0),0);
    const priorThreeBasicArrear=monthlySettlements.reduce((sum,m)=>sum+Number(m.basicAdjustment||0),0);
    const priorThreeGrossArrear=monthlySettlements.reduce((sum,m)=>sum+Number(m.grossAdjustment||0),0);
    const priorThreeDeductionIncrease=monthlySettlements.reduce((sum,m)=>sum+Number(m.deductionAdjustment||0),0);
    const priorThreeNetArrear=monthlySettlements.reduce((sum,m)=>sum+Number(m.netBeforeSpecial||0),0);
    const priorGrossAfterSpecial=Math.max(0,priorThreeGrossArrear-specialBenefitReceivedAmount);
    const priorNetAfterSpecial=monthlySettlements.reduce((sum,m)=>sum+Number(m.finalArrear||0),0);
    const firstMonth=monthlySettlements[0]||{};
    const monthlyBasicArrear=Number(firstMonth.basicAdjustment||0);
    const monthlyGrossArrear=Number(firstMonth.grossAdjustment||0);
    const monthlyDeductionIncrease=Number(firstMonth.deductionAdjustment||0);
    const monthlyNetArrear=Number(firstMonth.netBeforeSpecial||0);

    const arrear2026={
      startDate:'2026-07-01',endDate:'2026-10-31',months:4,previousMonths:3,
      selectedGrade:grade,specialBenefitRate:special.rate,specialBenefitMinimum:special.minimum,
      specialBenefitMode:'auto',specialBenefitReceivedMonths:receivedMonths,
      specialBenefitReceivedAmount,specialBenefitMonthly:special.monthly,
      specialBenefitThreeMonths:specialBenefitReceivedAmount,
      oldJuneBasic:currentBasic,oldJulyBasic,legacyIncrementPaid,newScaleIncrementAmount,
      legacyBasic:legacyJune.payableBasic,legacyGross:legacyJune.gross,legacyNet:legacyJune.net,
      legacyAllowances:legacyJune.allowances,legacyDeductions:legacyJune.deductions,
      octoberBasic:october.payableBasic,octoberGross:october.gross,octoberCurrentNet:october.net,
      octoberDeductions:october.deductions,octoberAllowances:october.allowances,
      monthlySettlements,
      monthlyBasicArrear,monthlyGrossArrear,monthlyDeductionIncrease,monthlyNetArrear,
      priorThreeBasicArrear,priorThreeGrossArrear,priorThreeDeductionIncrease,priorThreeNetArrear,
      priorGrossAfterSpecial,priorNetAfterSpecial,
      totalBasicArrear:priorThreeBasicArrear,
      totalGrossArrear:priorThreeGrossArrear,
      totalDeductionIncrease:priorThreeDeductionIncrease,
      totalNetAdjustment:priorNetAfterSpecial,
      octoberBillGross:october.gross+priorGrossAfterSpecial,
      octoberBillNet:october.net+priorNetAfterSpecial
    };

    const house=chosen.allowances.house,medical=chosen.allowances.medical,education=chosen.allowances.education,
      tiffin=chosen.allowances.tiffin,conveyance=chosen.allowances.conveyance,mobile=chosen.allowances.mobile,
      laundry=chosen.allowances.laundry,disabledChild=chosen.allowances.disabledChild,
      charge=chosen.allowances.charge,otherSpecial=chosen.allowances.otherSpecial,gross=chosen.gross;
    setR({
      ...chosen,currentIndex,currentBasic,payable:chosen.payableBasic,house,medical,education,tiffin,conveyance,mobile,laundry,
      disabledChild,area:0,training:0,charge,entertainment:0,otherSpecial,gross,projections,arrear2026,input
    });
  }

  useEffect(()=>{setF(x=>({...x,currentStage:'0'}));setR(null)},[f.grade]);
  useEffect(()=>{
    if(!r)return;
    window.requestAnimationFrame(()=>document.getElementById('salary-result')?.scrollIntoView({behavior:'smooth',block:'start'}));
  },[r]);

  const categoryOpts=en?[
    ['teacher','Teacher'],['officer','Officer'],['class3','Class III employee'],['class4','Class IV employee']
  ]:[
    ['teacher','শিক্ষক'],['officer','কর্মকর্তা'],['class3','৩য় শ্রেণির কর্মচারী'],['class4','৪র্থ শ্রেণির কর্মচারী']
  ];

  if(compactPwa){
    return <div className={`pwa-salary-compact salary-input-step-${formStep}`}>
      {!r?<>
        <SalaryFlowProgress step={formStep} lang={lang}/>
        <section className="pwa-salary-form-card">
          <div className="pwa-salary-mini-head"><span>{numLang(formStep,lang,0)}</span><div><b>{formStep===1?(en?'Start with 3 details':'৩টি তথ্য দিয়ে শুরু করুন'):(en?'Review only what needs changing':'শুধু প্রয়োজনীয় সমন্বয় দেখুন')}</b><small>{formStep===1?(en?'Everything else stays automatic or optional':'বাকি সব অটো অথবা ঐচ্ছিক'):(en?'Your basic information is saved while you adjust options':'মূল তথ্য সংরক্ষিত আছে—শুধু দরকার হলে পরিবর্তন করুন')}</small></div></div>

          <div className="pwa-salary-fields wizard-essential">
            <label><span>{en?'Category':'শ্রেণি'}</span><select value={f.category} onChange={e=>setF({...f,category:e.target.value})}>{categoryOpts.map(([v,l])=><option value={v} key={v}>{l}</option>)}</select></label>
            <label><span>{en?'Grade':'গ্রেড'}</span><select value={f.grade} onChange={e=>setF({...f,grade:e.target.value,currentStage:'0'})}>{Array.from({length:20},(_,i)=>i+1).map(g=><option key={g} value={g}>{en?`Grade ${g}`:`গ্রেড ${numLang(g,'bn',0)}`}</option>)}</select></label>
            <label><span>{en?'Basic on 30 Jun':'৩০ জুনের মূল বেতন'}</span><select value={f.currentStage} onChange={e=>setF({...f,currentStage:e.target.value})}>{stages.map((v,i)=><option value={i} key={i}>{en?`Stage ${i+1} · Tk ${moneyLang(v,'en')}`:`ধাপ ${numLang(i+1,'bn',0)} · ৳${moneyLang(v,'bn')}`}</option>)}</select></label>
          </div>
          {profileAuto&&<div className="pwa-salary-auto-row wizard-essential"><span><UserRound/>{en?'Category & grade from saved profile':'শ্রেণি ও গ্রেড প্রোফাইল থেকে অটো'}</span><span><CheckCircle2/>{en?'You can still correct them here':'প্রয়োজনে এখানেই পরিবর্তন করা যাবে'}</span></div>}

          <div className="pwa-salary-auto-row wizard-essential">
            <span><MapPin/>{en?'Dhaka rate':'ঢাকা হার'}</span>
            <span><CheckCircle2/>{en?'Automatic deductions':'অটো কর্তন'}</span>
            <span><RefreshCw/>{en?'Arrear auto':'বকেয়া অটো'}</span>
          </div>

          <div className="salary-wizard-selection-summary wizard-adjustments">
            <span><small>{en?'Category':'শ্রেণি'}</small><b>{categoryInfo.label}</b></span>
            <span><small>{en?'Grade':'গ্রেড'}</small><b>{numLang(Number(f.grade),lang,0)}</b></span>
            <span><small>{en?'Basic':'মূল বেতন'}</small><b>{en?'Tk ':'৳ '}{moneyLang(stages[currentIndex]||0,lang)}</b></span>
          </div>
          <div className="pwa-salary-options-title wizard-adjustments"><span>{en?'Change only if needed':'শুধু প্রয়োজন হলে পরিবর্তন করুন'}</span></div>

          <details className="pwa-salary-option wizard-adjustments">
            <summary><UserCheck/><span>{en?'July increment exception':'জুলাই ইনক্রিমেন্ট প্রাপ্য নয়?'}</span><ChevronDown/></summary>
            <div className="pwa-option-body">
              <label><span>{en?'1 July 2026 increment':'১ জুলাই ২০২৬ ইনক্রিমেন্ট'}</span><select value={f.incrementEligible2026} onChange={e=>setF({...f,incrementEligible2026:e.target.value})}><option value="yes">{en?'Eligible':'প্রাপ্য'}</option><option value="no">{en?'Not eligible':'প্রাপ্য নয়'}</option></select></label>
            </div>
          </details>

          <details className="pwa-salary-option wizard-adjustments">
            <summary><Home/><span>{en?'Housing & family':'বাসা ও পরিবার'}</span><ChevronDown/></summary>
            <div className="pwa-option-body">
              <label><span>{en?'DU quarter?':'DU কোয়ার্টারে থাকেন?'}</span><select value={f.housing} onChange={e=>setF({...f,housing:e.target.value})}><option value="none">{en?'No':'না'}</option><option value="du_quarter">{en?'Yes':'হ্যাঁ'}</option></select></label>
              {f.housing==='du_quarter'&&<>
                <label><span>{en?'Monthly quarter rent':'মাসিক কোয়ার্টার ভাড়া'}</span><input type="number" inputMode="decimal" min="0" value={f.duQuarterRent} onChange={e=>setF({...f,duQuarterRent:e.target.value})}/></label>
                <label><span>{en?'Other housing deduction':'অন্যান্য বাসা কর্তন'}</span><input type="number" inputMode="decimal" min="0" value={f.duQuarterOther} onChange={e=>setF({...f,duQuarterOther:e.target.value})}/></label>
              </>}
              <label><span>{en?'Medical age':'চিকিৎসা ভাতার বয়স'}</span><select value={f.ageBand} onChange={e=>setF({...f,ageBand:e.target.value})}><option value="under50">{en?'Up to 50':'৫০ পর্যন্ত'}</option><option value="over50">{en?'Above 50':'৫০-এর বেশি'}</option></select></label>
              <label><span>{en?'Children':'শিক্ষা ভাতার সন্তান'}</span><select value={f.children} onChange={e=>setF({...f,children:e.target.value})}><option value="0">0</option><option value="1">1</option><option value="2">2</option></select></label>
              {Number(f.children)>0&&<label><span>{en?'Already claimed by spouse?':'স্বামী/স্ত্রী আগে নিচ্ছেন?'}</span><select value={f.educationClaimedElsewhere} onChange={e=>setF({...f,educationClaimedElsewhere:e.target.value})}><option value="no">{en?'No':'না'}</option><option value="yes">{en?'Yes':'হ্যাঁ'}</option></select></label>}
              {Number(f.grade)>=11&&<label><span>{en?'Tiffin allowance':'টিফিন ভাতা'}</span><select value={f.tiffin} onChange={e=>setF({...f,tiffin:e.target.value})}><option value="yes">{en?'Applicable':'প্রযোজ্য'}</option><option value="no">{en?'Not applicable':'প্রযোজ্য নয়'}</option></select></label>}
            </div>
          </details>

          <details className="pwa-salary-option wizard-adjustments">
            <summary><Plus/><span>{en?'Additional allowances':'অতিরিক্ত ভাতা'}</span><ChevronDown/></summary>
            <div className="pwa-option-body">
              <label><span>{en?'Mobile':'মোবাইল'}</span><select value={f.mobile} onChange={e=>setF({...f,mobile:e.target.value})}><option value="yes">{en?'Applicable':'প্রযোজ্য'}</option><option value="no">{en?'Not applicable':'প্রযোজ্য নয়'}</option></select></label>
              <label><span>{en?'Laundry':'ধোলাই'}</span><select value={f.laundry} onChange={e=>setF({...f,laundry:e.target.value})}><option value="no">{en?'Not applicable':'প্রযোজ্য নয়'}</option><option value="yes">{en?'Applicable':'প্রযোজ্য'}</option></select></label>
              <label><span>{en?'Special-needs children':'বিশেষ চাহিদাসম্পন্ন সন্তান'}</span><select value={f.disabledChildren} onChange={e=>setF({...f,disabledChildren:e.target.value})}><option value="0">0</option><option value="1">1</option><option value="2">2</option></select></label>
              {Number(f.disabledChildren)>0&&<label><span>{en?'Same benefit elsewhere?':'একই ভাতা অন্যত্র পাওয়া হচ্ছে?'}</span><select value={f.disabledBenefitElsewhere} onChange={e=>setF({...f,disabledBenefitElsewhere:e.target.value})}><option value="no">{en?'No':'না'}</option><option value="yes">{en?'Yes':'হ্যাঁ'}</option></select></label>}
              <label><span>{en?'Charge allowance':'কার্যভার ভাতা'}</span><select value={f.chargeAllowance} onChange={e=>setF({...f,chargeAllowance:e.target.value})}><option value="no">{en?'No':'না'}</option><option value="yes">{en?'Yes':'হ্যাঁ'}</option></select></label>
              <label><span>{en?'Other approved amount':'অন্যান্য অনুমোদিত ভাতা'}</span><input type="number" inputMode="decimal" min="0" value={f.otherSpecialAllowance} onChange={e=>setF({...f,otherSpecialAllowance:e.target.value})}/></label>
            </div>
          </details>

          <details className="pwa-salary-option wizard-adjustments">
            <summary><ShieldCheck/><span>{en?'Deductions':'কর্তন'} · {f.deductionMode==='du_auto'?(en?'Auto':'অটো'):(en?'Custom':'কাস্টম')}</span><ChevronDown/></summary>
            <div className="pwa-option-body">
              <label><span>{en?'Mode':'পদ্ধতি'}</span><select value={f.deductionMode} onChange={e=>setF({...f,deductionMode:e.target.value})}><option value="du_auto">{en?'Automatic preset':'অটো প্রিসেট'}</option><option value="custom">{en?'Custom':'কাস্টম'}</option></select></label>
              {f.deductionMode==='du_auto'
                ?<div className="pwa-auto-deduction-note"><CheckCircle2/><span>{en?'PF, benevolent fund, insurance, stamp and association are calculated automatically.':'PF, কল্যাণ তহবিল, বীমা, স্ট্যাম্প ও সমিতি অটো হিসাব হবে।'}</span></div>
                :<>
                  <label><span>{en?'PF rate':'PF হার'}</span><select value={f.gpfRate} onChange={e=>setF({...f,gpfRate:e.target.value})}><option value="0">0%</option>{Array.from({length:21},(_,i)=>i+5).map(x=><option key={x} value={x}>{x}%</option>)}</select></label>
                  {(en?[['benevolent','Benevolent'],['health','Health insurance'],['group','Group insurance'],['stamp','Stamp'],['association','Association'],['tax','Tax'],['loan','Loan'],['other','Other']]:[['benevolent','কল্যাণ'],['health','স্বাস্থ্য বীমা'],['group','গ্রুপ বীমা'],['stamp','স্ট্যাম্প'],['association','সমিতি'],['tax','আয়কর'],['loan','ঋণ'],['other','অন্যান্য']]).map(([k,l])=><label key={k}><span>{l}</span><input type="number" inputMode="decimal" min="0" value={f[k]} onChange={e=>setF({...f,[k]:e.target.value})}/></label>)}
                </>}
            </div>
          </details>
        </section>

        <div className={`pwa-salary-sticky-calc ${formStep===2?'dual':''}`}>
          {formStep===1?<button onClick={()=>{setFormStep(2);window.scrollTo({top:0,behavior:'smooth'})}}><span>{en?'Next':'পরবর্তী ধাপ'}</span><ArrowRight/></button>:<>
            <button className="secondary" onClick={()=>{setFormStep(1);window.scrollTo({top:0,behavior:'smooth'})}}><ArrowLeft/><span>{en?'Back':'পেছনে'}</span></button>
            <button onClick={calc}><Calculator/><span>{en?'Show calculation':'আমার হিসাব দেখুন'}</span><ArrowRight/></button>
          </>}
        </div>
      </>:<div id="salary-result"><SalaryResult r={r} lang={lang} compact={true} initialCompactTab={initialArrear?'arrear':'now'} onEdit={()=>{setR(null);setFormStep(1);window.scrollTo({top:0,behavior:'smooth'})}} onReset={()=>{setR(null);setFormStep(1);window.scrollTo({top:0,behavior:'smooth'})}}/></div>}
    </div>;
  }

  return <div className={`${publicMode?'public-salary-calculator ':''}salary-input-step-${formStep}`}>
    {!r?<>
    <div className="page-head pay-calc-head simple-pay-head"><div><span className="pay-head-eyebrow">{en?'UNIVERSITY OF DHAKA':'ঢাকা বিশ্ববিদ্যালয়'}</span><h2>{en?'Salary & Arrear Calculator':'বেতন ও বকেয়া হিসাব'}</h2><p>{en?'Start with just three pieces of information. Date, Dhaka location, regular increment flow and arrear adjustment are automatic.':'শুরুতে শুধু ৩টি তথ্য দিন। তারিখ, ঢাকা লোকেশন, নিয়মিত ইনক্রিমেন্ট ধাপ ও বকেয়া সমন্বয় সিস্টেম নিজে করবে।'}</p></div></div>

    <SalaryFlowProgress step={formStep} lang={lang}/>

    <section className="calc-card salary-essential-card">
      <div className="salary-form-section-title easy-section-title"><span>{numLang(formStep,lang,0)}</span><div><h3>{formStep===1?(en?'Enter these 3 details first':'প্রথমে এই ৩টি তথ্য দিন'):(en?'Check adjustments only if they apply':'শুধু প্রযোজ্য সমন্বয়গুলো দেখুন')}</h3><p>{formStep===1?(en?'For most users, these are enough to begin.':'বেশিরভাগ ব্যবহারকারীর জন্য এই ৩টি তথ্যই শুরু করার জন্য যথেষ্ট।'):(en?'Your first-step information stays saved. Open only the sections you need.':'প্রথম ধাপের তথ্য সংরক্ষিত আছে। শুধু প্রয়োজনীয় সেকশন খুলুন।')}</p></div></div>
      <div className="form-grid essential-three-grid wizard-essential">
        <label>{en?'Your DU category':'আপনার DU শ্রেণি'}<select value={f.category} onChange={e=>setF({...f,category:e.target.value})}>{categoryOpts.map(([v,l])=><option value={v} key={v}>{l}</option>)}</select></label>
        <label>{en?'Current grade':'বর্তমান গ্রেড'}<select value={f.grade} onChange={e=>setF({...f,grade:e.target.value,currentStage:'0'})}>{Array.from({length:20},(_,i)=>i+1).map(g=><option key={g} value={g}>{en?`Grade ${g}`:`গ্রেড ${numLang(g,'bn',0)}`}</option>)}</select></label>
        <label>{en?'Basic on 30 June 2026':'৩০ জুন ২০২৬-এর মূল বেতন'}<select value={f.currentStage} onChange={e=>setF({...f,currentStage:e.target.value})}>{stages.map((v,i)=><option value={i} key={i}>{en?`Stage ${i+1} — Tk ${moneyLang(v,'en')}`:`ধাপ ${numLang(i+1,'bn',0)} — ৳${moneyLang(v,'bn')}`}</option>)}</select></label>
      </div>
      {profileAuto&&<div className="salary-auto-summary wizard-essential"><span><UserRound/><div><small>{en?'Profile autofill':'প্রোফাইল অটোফিল'}</small><b>{en?'Category and grade loaded from your saved profile':'সংরক্ষিত প্রোফাইল থেকে শ্রেণি ও গ্রেড নেওয়া হয়েছে'}</b></div></span></div>}

      <div className="salary-auto-summary wizard-essential">
        <span><MapPin/><div><small>{en?'Work location':'কর্মস্থল'}</small><b>{en?'University of Dhaka, Dhaka':'ঢাকা বিশ্ববিদ্যালয়, ঢাকা'}</b></div></span>
        <span><ShieldCheck/><div><small>{en?'DU Auto':'DU Auto'}</small><b>{categoryInfo.label} · {en?'Benevolent':'কল্যাণ'} {numLang(categoryInfo.beneRate*100,lang,2)}% · PF {numLang(10,lang,0)}%</b></div></span>
      </div>

      <div className="salary-wizard-selection-summary wizard-adjustments">
        <span><small>{en?'Category':'শ্রেণি'}</small><b>{categoryInfo.label}</b></span>
        <span><small>{en?'Grade':'গ্রেড'}</small><b>{numLang(Number(f.grade),lang,0)}</b></span>
        <span><small>{en?'30 June basic':'৩০ জুনের মূল বেতন'}</small><b>{en?'Tk ':'৳ '}{moneyLang(stages[currentIndex]||0,lang)}</b></span>
      </div>

      <details className="salary-detail-block increment-exception-block wizard-adjustments">
        <summary><span><UserCheck/>{en?'Newly appointed or not eligible for 1 July 2026 increment?':'নতুন যোগদানকারী বা ১ জুলাই ২০২৬ ইনক্রিমেন্ট প্রাপ্য নয়?'}</span><small>{en?'Open only if this applies to you':'শুধু প্রযোজ্য হলে খুলুন'}</small></summary>
        <div className="form-grid compact one-field-grid">
          <label>{en?'1 July 2026 annual increment':'১ জুলাই ২০২৬ বার্ষিক ইনক্রিমেন্ট'}<select value={f.incrementEligible2026} onChange={e=>setF({...f,incrementEligible2026:e.target.value})}><option value="yes">{en?'Eligible / regular employee':'প্রাপ্য / নিয়মিত কর্মী'}</option><option value="no">{en?'Not eligible — new appointee without 6 months qualifying service':'প্রাপ্য নয় — নতুন যোগদানকারী, ৬ মাস পূর্ণ হয়নি'}</option></select></label>
        </div>
      </details>

      <details className="salary-detail-block allowance-basic-options wizard-adjustments">
        <summary><span><Home/>{en?'Housing & family information':'বাসা ও পারিবারিক তথ্য'}</span><small>{en?'Open if housing, age or child information needs changing':'বাসা, বয়স বা সন্তানের তথ্য বদলাতে হলে খুলুন'}</small></summary>
        <div className="form-grid compact">
          <label>{en?'Do you live in a DU quarter?':'আপনি কি DU কোয়ার্টারে থাকেন?'}<select value={f.housing} onChange={e=>setF({...f,housing:e.target.value})}><option value="none">{en?'No — receive Dhaka house-rent allowance':'না — ঢাকা সিটি বাড়িভাড়া ভাতা পাব'}</option><option value="du_quarter">{en?'Yes — I live in a DU quarter':'হ্যাঁ — DU কোয়ার্টারে থাকি'}</option></select></label>
          {f.housing==='du_quarter'&&<>
            <label>{en?'Monthly DU unit/quarter rent deduction':'মাসিক ঢাবি বাসা/ইউনিট ভাড়া কর্তন'}<input type="number" min="0" step="1" value={f.duQuarterRent} onChange={e=>setF({...f,duQuarterRent:e.target.value})} placeholder="0"/><small>{en?'Enter the actual approved rent for your allotted unit.':'আপনার বরাদ্দকৃত ইউনিটের প্রকৃত অনুমোদিত ভাড়া লিখুন।'}</small></label>
            <label>{en?'Other housing recovery, if any':'বাসা-সংক্রান্ত অন্যান্য কর্তন, থাকলে'}<input type="number" min="0" step="1" value={f.duQuarterOther} onChange={e=>setF({...f,duQuarterOther:e.target.value})} placeholder="0"/></label>
          </>}
          <label>{en?'Age for medical allowance':'চিকিৎসা ভাতার বয়স'}<select value={f.ageBand} onChange={e=>setF({...f,ageBand:e.target.value})}><option value="under50">{en?'Up to 50 years':'৫০ বছর পর্যন্ত'}</option><option value="over50">{en?'Above 50 years':'৫০ বছরের বেশি'}</option></select></label>
          <label>{en?'Children for education allowance':'শিক্ষা ভাতার জন্য সন্তানের সংখ্যা'}<select value={f.children} onChange={e=>setF({...f,children:e.target.value})}><option value="0">{numLang(0,lang,0)}</option><option value="1">{numLang(1,lang,0)}</option><option value="2">{numLang(2,lang,0)}</option></select></label>
          {Number(f.children)>0&&<label>{en?'Is the same child allowance already claimed by spouse?':'একই সন্তানের ভাতা স্বামী/স্ত্রী আগে থেকেই নিচ্ছেন?'}<select value={f.educationClaimedElsewhere} onChange={e=>setF({...f,educationClaimedElsewhere:e.target.value})}><option value="no">{en?'No':'না'}</option><option value="yes">{en?'Yes — do not add again':'হ্যাঁ — আবার যোগ হবে না'}</option></select></label>}
          {Number(f.grade)>=11&&<label>{en?'Tiffin allowance':'টিফিন ভাতা'}<select value={f.tiffin} onChange={e=>setF({...f,tiffin:e.target.value})}><option value="yes">{en?'Applicable':'প্রযোজ্য'}</option><option value="no">{en?'Not applicable / free meal':'প্রযোজ্য নয় / বিনামূল্যে খাবার পাই'}</option></select></label>}
        </div>
        {f.housing==='du_quarter'&&<div className="notice du-quarter-note"><b>{en?'DU quarter rule:':'ঢাবি বাসার নিয়ম:'}</b> {en?'House-rent allowance is set to zero. Your actual unit rent and other verified housing recovery are added to deductions.':'বাড়িভাড়া ভাতা শূন্য হবে। আপনার প্রকৃত ইউনিট ভাড়া ও যাচাইকৃত অন্যান্য বাসা-সংক্রান্ত অর্থ কর্তনে যোগ হবে।'}</div>}
      </details>

      <details className="deduction-box official-extra-options wizard-adjustments"><summary><span><Plus/>{en?'Additional allowances':'অতিরিক্ত ভাতা'}</span><small>{en?'Open only if something applies':'প্রযোজ্য হলে খুলুন'}</small></summary><div className="form-grid compact">
        <label>{en?'Mobile allowance':'মোবাইল ভাতা'}<select value={f.mobile} onChange={e=>setF({...f,mobile:e.target.value})}><option value="yes">{en?'Applicable':'প্রযোজ্য'}</option><option value="no">{en?'Not applicable':'প্রযোজ্য নয়'}</option></select></label>
        <label>{en?'Laundry allowance':'ধোলাই ভাতা'}<select value={f.laundry} onChange={e=>setF({...f,laundry:e.target.value})}><option value="no">{en?'Not applicable':'প্রযোজ্য নয়'}</option><option value="yes">{en?'Applicable':'প্রযোজ্য'}</option></select></label>
        <label>{en?'Children with special needs':'বিশেষ চাহিদাসম্পন্ন সন্তানের সংখ্যা'}<select value={f.disabledChildren} onChange={e=>setF({...f,disabledChildren:e.target.value})}><option value="0">0</option><option value="1">1</option><option value="2">2</option></select></label>
        {Number(f.disabledChildren)>0&&<label>{en?'Is the same disability benefit received elsewhere?':'একই কারণে অন্য ভাতা পাওয়া হচ্ছে?'}<select value={f.disabledBenefitElsewhere} onChange={e=>setF({...f,disabledBenefitElsewhere:e.target.value})}><option value="no">{en?'No':'না'}</option><option value="yes">{en?'Yes — do not add again':'হ্যাঁ — আবার যোগ হবে না'}</option></select></label>}
        <label>{en?'Charge allowance':'কার্যভার ভাতা'}<select value={f.chargeAllowance} onChange={e=>setF({...f,chargeAllowance:e.target.value})}><option value="no">{en?'Not applicable':'প্রযোজ্য নয়'}</option><option value="yes">{en?'Applicable — Tk 1,500/month':'প্রযোজ্য — মাসিক ৳১,৫০০'}</option></select></label>
        <label>{en?'Other separately approved allowance (monthly)':'আলাদা অনুমোদনপ্রাপ্ত অন্যান্য ভাতা (মাসিক)'}<input type="number" min="0" step="1" value={f.otherSpecialAllowance} onChange={e=>setF({...f,otherSpecialAllowance:e.target.value})} placeholder="0"/><small>{en?'Use only when a separate DU/UGC/Government approval applies.':'শুধু আলাদা DU/UGC/সরকারি অনুমোদন থাকলে ব্যবহার করুন।'}</small></label>
      </div></details>

      <details className="deduction-box du-deduction-box wizard-adjustments"><summary className="du-deduction-summary simple"><span className={f.deductionMode==='du_auto'?'du-status-icon active':'du-status-icon manual'}>{f.deductionMode==='du_auto'?<CheckCircle2/>:<Edit3/>}</span><span className="du-summary-copy"><b>{en?'DU payroll deductions':'DU পে-রোল কর্তন'}</b><small>{en?'DU Auto is already selected — open only to review or customize':'DU Auto আগে থেকেই চালু — দেখতে বা বদলাতে হলে খুলুন'}</small></span></summary>
        <div className="form-grid compact">
          <label>{en?'Deduction mode':'কর্তনের ধরন'}<select value={f.deductionMode} onChange={e=>setF({...f,deductionMode:e.target.value})}><option value="du_auto">{en?'DU Auto':'DU Auto'}</option><option value="custom">{en?'Custom / manual':'কাস্টম / ম্যানুয়াল'}</option></select></label>
          {f.deductionMode==='du_auto'?<>
            <div className="du-auto-deduction-card"><small>{en?'Provident Fund':'ভবিষ্য তহবিল (PF)'}</small><b>10%</b><span>{en?'From payable basic':'প্রাপ্য মূল বেতন থেকে'}</span></div>
            <div className="du-auto-deduction-card"><small>{en?'Benevolent Fund':'কল্যাণ তহবিল'}</small><b>{numLang(categoryInfo.beneRate*100,lang,2)}%</b><span>{categoryInfo.label}</span></div>
            <div className="du-auto-deduction-card"><small>{en?'Health insurance':'স্বাস্থ্য বীমা'}</small><b>{en?'Tk 149.34':'৳ 149.34'}</b><span>{en?'Current DU payroll preset — editable in custom mode':'বর্তমান DU পে-রোল প্রিসেট — কাস্টমে পরিবর্তনযোগ্য'}</span></div>
            <div className="du-auto-deduction-card"><small>{en?'Group insurance':'গ্রুপ বীমা'}</small><b>{currentAutoRules.groupRuleVerified?(en?`Tk ${moneyLang(currentAutoRules.group,'en')}`:`৳ ${moneyLang(currentAutoRules.group,'bn')}`):(en?'Verification required':'হার যাচাই প্রয়োজন')}</b><span>{currentAutoRules.groupRuleVerified?(en?'Verified for this category, grade and date':'এই শ্রেণি, গ্রেড ও তারিখের জন্য যাচাইকৃত'):(en?'No unverified rate is auto-applied':'অনিশ্চিত হার অটো বসানো হবে না')}</span></div>
            <div className="du-auto-deduction-card"><small>{en?'Revenue stamp':'রাজস্ব স্ট্যাম্প'}</small><b>{en?'Tk 10':'৳ 10'}</b><span>{en?'Current preset':'বর্তমান প্রিসেট'}</span></div>
            <div className="du-auto-deduction-card"><small>{en?'Association':'সমিতি'}</small><b>{en?'Tk 10':'৳ 10'}</b><span>{en?'Current preset':'বর্তমান প্রিসেট'}</span></div>
          </>:<>
            <label>{en?'PF subscription rate':'PF সাবস্ক্রিপশন হার'}<select value={f.gpfRate} onChange={e=>setF({...f,gpfRate:e.target.value})}><option value="0">{en?'Not applicable':'প্রযোজ্য নয়'}</option>{Array.from({length:21},(_,i)=>i+5).map(x=><option value={x} key={x}>{numLang(x,lang,0)}%</option>)}</select></label>
            {(en?[['benevolent','Benevolent fund'],['health','Health insurance'],['group','Group insurance'],['stamp','Revenue stamp'],['association','Association']]:[['benevolent','কল্যাণ তহবিল'],['health','স্বাস্থ্য বীমা'],['group','গ্রুপ বীমা'],['stamp','রাজস্ব স্ট্যাম্প'],['association','সমিতি']]).map(([k,l])=><label key={k}>{l}<input type="number" min="0" step="0.01" value={f[k]} onChange={e=>setF({...f,[k]:e.target.value})}/></label>)}
          </>}
          {(en?[['tax','Income tax'],['loan','Loan/advance installment'],['other','Other deduction']]:[['tax','আয়কর'],['loan','ঋণ/অগ্রিম কিস্তি'],['other','অন্যান্য কর্তন']]).map(([k,l])=><label key={k}>{l}<input type="number" min="0" step="0.01" value={f[k]} onChange={e=>setF({...f,[k]:e.target.value})}/></label>)}
        </div>
      </details>

      <div className="salary-submit-bar wizard-actions">
        {formStep===1?<>
          <p>{en?'Your basic information will stay saved in the next step.':'পরবর্তী ধাপে গেলেও এই তথ্যগুলো সংরক্ষিত থাকবে।'}</p>
          <button className="primary" onClick={()=>{setFormStep(2);window.scrollTo({top:0,behavior:'smooth'})}}>{en?'Next step':'পরবর্তী ধাপ'}<ArrowRight size={16}/></button>
        </>:<>
          <button className="wizard-back" onClick={()=>{setFormStep(1);window.scrollTo({top:0,behavior:'smooth'})}}><ArrowLeft size={16}/>{en?'Back':'পেছনে'}</button>
          <p>{en?'Ready? Salary, arrears and 2026–2028 stages will be calculated together.':'তথ্য ঠিক থাকলে হিসাব করুন। বেতন, বকেয়া ও ২০২৬–২০২৮ ধাপ একসাথে তৈরি হবে।'}</p>
          <button className="primary" onClick={calc}>{en?'Show my calculation':'আমার হিসাব দেখুন'}<ArrowRight size={16}/></button>
        </>}
      </div>
    </section>
    </>:<div id="salary-result" className="salary-result-anchor"><SalaryResult r={r} lang={lang} onEdit={()=>{setR(null);setFormStep(1);window.scrollTo({top:0,behavior:'smooth'})}} onReset={()=>{setR(null);setFormStep(1);window.scrollTo({top:0,behavior:'smooth'})}}/></div>}
  </div>
}
function SalaryResult({r,lang='bn',compact=false,initialCompactTab='now',onEdit,onReset}){
  const en=lang==='en';
  const autoRuleWarning=r?.autoRuleIncomplete?(en?'Group-insurance rate is not verified for this category/grade; it was not auto-assumed.':'এই শ্রেণি/গ্রেডের গ্রুপ বীমার হার যাচাইকৃত নয়; অনুমান করে অটো ধরা হয়নি।'):'';
  const [activeYear,setActiveYear]=useState(2026);
  const [resultView,setResultView]=useState('salary');
  const [compactTab,setCompactTab]=useState(initialCompactTab);
  const [pdfBusy,setPdfBusy]=useState('');
  const [pdfPreview,setPdfPreview]=useState(null);
  const [screen,setScreen]=useState('result');
  const [lastResultView,setLastResultView]=useState('salary');
  useEffect(()=>{setActiveYear(2026);setResultView('salary');setCompactTab(initialCompactTab);setPdfPreview(null);setScreen('result');setLastResultView('salary')},[r,initialCompactTab]);
  useEffect(()=>{if(activeYear!==2026)setResultView('salary')},[activeYear]);

  const amt=v=>`${en?'Tk':'৳'} ${moneyLang(v,lang)}`;
  const stamp=Date.now();
  const projections=r.projections||[];
  const yearStages=projections.filter(p=>String(p.date||'').startsWith(String(activeYear)));
  const current=yearStages[yearStages.length-1]||projections[0]||r;
  const ca=current.allowances||{};
  const auto=(current.deductionMode??r.deductionMode)!=='custom';
  const gpfRate=current.gpfRate??r.gpfRate??0;
  const beneRate=current.beneRate??r.beneRate??0;

  const allowances=en?[
    ['House rent',ca.house??0],['Medical allowance',ca.medical??0],['Education allowance',ca.education??0],['Tiffin allowance',ca.tiffin??0],
    ['Conveyance allowance',ca.conveyance??0],['Mobile allowance',ca.mobile??0],['Laundry allowance',ca.laundry??0],
    ['Special-needs child allowance',ca.disabledChild??0],['Charge allowance',ca.charge??0],['Other separately approved allowance',ca.otherSpecial??0]
  ]:[
    ['বাড়িভাড়া',ca.house??0],['চিকিৎসা ভাতা',ca.medical??0],['শিক্ষা সহায়ক ভাতা',ca.education??0],['টিফিন ভাতা',ca.tiffin??0],
    ['যাতায়াত ভাতা',ca.conveyance??0],['মোবাইল ভাতা',ca.mobile??0],['ধোলাই ভাতা',ca.laundry??0],
    ['বিশেষ চাহিদাসম্পন্ন সন্তান ভাতা',ca.disabledChild??0],['কার্যভার ভাতা',ca.charge??0],['আলাদা অনুমোদনপ্রাপ্ত অন্যান্য ভাতা',ca.otherSpecial??0]
  ];
  const deds=en?[
    [`Provident Fund ${numLang(gpfRate,'en',0)}%`,current.pf??0],
    [`Benevolent Fund ${auto?numLang(beneRate*100,'en',2)+'%':''}`,current.bene??0],
    [`Health insurance${auto?' (auto)':''}`,current.health??0],
    [`Group insurance${auto?' (auto)':''}`,current.group??0],
    ['Revenue stamp',current.stamp??0],['Association',current.association??0],['DU quarter/unit rent',current.quarterRent??0],['Other housing recovery',current.quarterOther??0],['Income tax',current.tax??0],['Loan/advance',current.loan??0],['Other',current.other??0]
  ]:[
    [`ভবিষ্য তহবিল (PF) ${numLang(gpfRate,'bn',0)}%`,current.pf??0],
    [`কল্যাণ তহবিল ${auto?numLang(beneRate*100,'bn',2)+'%':''}`,current.bene??0],
    [`স্বাস্থ্য বীমা${auto?' (অটো)':''}`,current.health??0],
    [`গ্রুপ বীমা${auto?' (অটো)':''}`,current.group??0],
    ['রাজস্ব স্ট্যাম্প',current.stamp??0],['সমিতি',current.association??0],['ঢাবি বাসা/ইউনিট ভাড়া',current.quarterRent??0],['বাসা-সংক্রান্ত অন্যান্য কর্তন',current.quarterOther??0],['আয়কর',current.tax??0],['ঋণ/অগ্রিম',current.loan??0],['অন্যান্য',current.other??0]
  ];

  const yearReports=[2026,2027,2028].map(year=>({
    year,html:salaryYearReportHtml(r,year,lang,{pageNo:1,totalPages:1}),filename:`pay-scale-${year}-${stamp}.pdf`
  }));
  const combinedReport={html:salaryCombinedReportHtml(r,lang),filename:`pay-scale-2026-2028-three-page-${stamp}.pdf`};
  const arrear=r.arrear2026||{};
  const arrearReport={html:salaryOctoberArrearReportHtml(r,lang),filename:`july-october-2026-monthly-arrear-${stamp}.pdf`};
  const activeYearReport=yearReports.find(x=>x.year===activeYear)||yearReports[0];
  const activeShareTitle=en?`Pay Scale ${activeYear} Salary Report`:`পে-স্কেল ${numLang(activeYear,lang,0)} বেতন রিপোর্ট`;
  const activeShareSummary=en?`${activeYear} salary calculation, allowances, deductions and net payable.`:`${numLang(activeYear,lang,0)} সালের বেতন, ভাতা, কর্তন ও নিট প্রাপ্যের হিসাব।`;

  function previewPdf(item,key,title='',summary=''){
    if(!item?.html)return;
    setPdfPreview({
      ...item,key,
      title:title||(key==='all'?(en?'Pay Scale 2026–2028 Complete Salary Report':'পে-স্কেল ২০২৬–২০২৮ সম্পূর্ণ বেতন রিপোর্ট'):
        key==='arrear'?(en?'July–October 2026 Monthly Salary & Arrear Statement':'জুলাই–অক্টোবর ২০২৬ মাসভিত্তিক বেতন ও বকেয়া বিবরণী'):
        (en?`Pay Scale ${key} Salary Report`:`পে-স্কেল ${numLang(key,lang,0)} বেতন রিপোর্ট`)),
      summary
    });
    trackPublic('view',key==='all'?'salary_2026_2028_pdf_preview':key==='arrear'?'monthly_2026_arrear_pdf_preview':`salary_${key}_pdf_preview`);
  }
  function openReportCenter(){
    setLastResultView(resultView);
    setResultView('salary');
    setScreen('report');
    window.requestAnimationFrame(()=>window.scrollTo({top:0,behavior:'smooth'}));
  }
  function backToResult(){
    setScreen('result');
    setResultView(lastResultView||'salary');
    window.requestAnimationFrame(()=>window.scrollTo({top:0,behavior:'smooth'}));
  }

  if(compact){
    const cc=r.allowances||{};
    const compactAllowances=(en?[
      ['House rent',cc.house],['Medical',cc.medical],['Education',cc.education],['Tiffin',cc.tiffin],
      ['Conveyance',cc.conveyance],['Mobile',cc.mobile],['Laundry',cc.laundry],['Special-needs child',cc.disabledChild],
      ['Charge',cc.charge],['Other approved',cc.otherSpecial]
    ]:[
      ['বাড়িভাড়া',cc.house],['চিকিৎসা',cc.medical],['শিক্ষা',cc.education],['টিফিন',cc.tiffin],
      ['যাতায়াত',cc.conveyance],['মোবাইল',cc.mobile],['ধোলাই',cc.laundry],['বিশেষ চাহিদাসম্পন্ন সন্তান',cc.disabledChild],
      ['কার্যভার',cc.charge],['অন্যান্য অনুমোদিত',cc.otherSpecial]
    ]).filter(([,v])=>Number(v)>0);
    const compactDeds=(en?[
      ['PF',r.pf],['Benevolent',r.bene],['Health insurance',r.health],['Group insurance',r.group],
      ['Stamp',r.stamp],['Association',r.association],['Quarter rent',r.quarterRent],['Housing recovery',r.quarterOther],
      ['Tax',r.tax],['Loan',r.loan],['Other',r.other]
    ]:[
      ['PF',r.pf],['কল্যাণ তহবিল',r.bene],['স্বাস্থ্য বীমা',r.health],['গ্রুপ বীমা',r.group],
      ['স্ট্যাম্প',r.stamp],['সমিতি',r.association],['কোয়ার্টার ভাড়া',r.quarterRent],['বাসা কর্তন',r.quarterOther],
      ['আয়কর',r.tax],['ঋণ',r.loan],['অন্যান্য',r.other]
    ]).filter(([,v])=>Number(v)>0);

    return <div className="pwa-salary-result">
      <SalaryFlowProgress step={compactTab==='reports'?4:3} lang={lang}/>
      <div className="pwa-result-tabs">
        <button className={compactTab==='now'?'active':''} onClick={()=>setCompactTab('now')}>{en?'Now':'এখন'}</button>
        <button className={compactTab==='timeline'?'active':''} onClick={()=>setCompactTab('timeline')}>{en?'2026–2028':'২০২৬–২০২৮'}</button>
        <button className={compactTab==='details'?'active':''} onClick={()=>setCompactTab('details')}>{en?'Details':'বিস্তারিত'}</button>
      </div>

      {compactTab==='now'&&<>
        {autoRuleWarning&&<div className="error">{autoRuleWarning}</div>}
        <section className="pwa-result-hero">
          <div><small>{en?'ESTIMATED TAKE-HOME':'আনুমানিক হাতে পাবেন'}</small><b>{amt(r.net??0)}</b><span>{r.phase?.label||''}</span></div>
          <CheckCircle2/>
        </section>
        <div className="pwa-result-kpis">
          <article><small>{en?'Basic':'মূল বেতন'}</small><b>{amt(r.payableBasic??r.payable)}</b></article>
          <article><small>{en?'Allowances':'মোট ভাতা'}</small><b>{amt(r.totalAllowances??0)}</b></article>
          <article><small>{en?'Deductions':'মোট কর্তন'}</small><b>{amt(r.deductions??0)}</b></article>
          <article className="net"><small>{en?'Take-home':'হাতে পাবেন'}</small><b>{amt(r.net??0)}</b></article>
        </div>
        <button className="pwa-arrear-card" onClick={()=>setCompactTab('arrear')}>
          <span><ReceiptText/></span><div><small>{en?'OCTOBER 2026':'অক্টোবর ২০২৬'}</small><b>{en?'View arrear calculation':'বকেয়া হিসাব দেখুন'}</b><em>{amt(arrear.octoberBillNet||0)}</em></div><ChevronRight/>
        </button>
      </>}

      {compactTab==='timeline'&&<section className="pwa-timeline-card">
        <div className="pwa-compact-section-head"><small>{en?'PAY SCALE STAGES':'বেতন ধাপ'}</small><h3>{en?'2026–2028 timeline':'২০২৬–২০২৮ টাইমলাইন'}</h3></div>
        <div className="pwa-salary-timeline">
          {projections.map((p,i)=><article key={p.date} className={i===projections.length-1?'latest':''}>
            <span className="dot"></span>
            <div className="copy"><small>{p.label}</small><b>{amt(p.payableBasic)}</b></div>
            <div className="net"><small>{en?'Net':'নিট'}</small><b>{amt(p.net)}</b></div>
          </article>)}
        </div>
      </section>}

      {compactTab==='details'&&<>
        <section className="pwa-compact-profile">
          <span><small>{en?'Category':'শ্রেণি'}</small><b>{duCategoryInfo(r.category,lang).label}</b></span>
          <span><small>{en?'Grade':'গ্রেড'}</small><b>{numLang(r.grade||0,lang,0)}</b></span>
          <span><small>{en?'Housing':'বাসা'}</small><b>{r.housingMode==='du_quarter'?(en?'DU quarter':'DU কোয়ার্টার'):(en?'No quarter':'কোয়ার্টার নেই')}</b></span>
        </section>
        <section className="pwa-compact-money-list">
          <div className="pwa-compact-section-head"><small>{en?'ALLOWANCES':'ভাতা'}</small><h3>{en?'Monthly allowances':'মাসিক ভাতা'}</h3></div>
          {compactAllowances.length?compactAllowances.map(([l,v])=><div key={l}><span>{l}</span><b>+ {amt(v)}</b></div>):<p>{en?'No allowance amount in this stage.':'এই ধাপে কোনো ভাতার অংক নেই।'}</p>}
        </section>
        <section className="pwa-compact-money-list deductions">
          <div className="pwa-compact-section-head"><small>{en?'DEDUCTIONS':'কর্তন'}</small><h3>{en?'Monthly deductions':'মাসিক কর্তন'}</h3></div>
          {compactDeds.map(([l,v])=><div key={l}><span>{l}</span><b>− {amt(v)}</b></div>)}
        </section>
      </>}

      {compactTab==='arrear'&&<section className="pwa-compact-arrear">
        <button className="pwa-inline-back" onClick={()=>setCompactTab('now')}><ArrowLeft/>{en?'Back':'ফিরুন'}</button>
        <div className="pwa-compact-section-head"><small>{en?'MONTHLY RECONCILIATION':'মাসভিত্তিক সমন্বয়'}</small><h3>{en?'July–October salary + arrear':'জুলাই–অক্টোবর বেতন + বকেয়া'}</h3></div>
        <div className="pwa-arrear-total"><small>{en?'Estimated October total receivable':'অক্টোবরে আনুমানিক মোট প্রাপ্য'}</small><b>{amt(arrear.octoberBillNet||0)}</b></div>

        <div className="pwa-month-settlements">
          {(arrear.monthlySettlements||[]).map(m=><article key={m.date}>
            <div className="pwa-month-settlement-head"><span>{en?m.monthEn:m.monthBn} 2026</span><b>{amt(m.finalArrear||0)}</b></div>
            <div className="pwa-month-settlement-grid">
              <span><small>{en?'Old net paid':'পুরোনো Net পাওয়া'}</small><b>{amt(m.oldPaid?.net||0)}</b></span>
              <span><small>{en?'New net due':'নতুন Net প্রাপ্য'}</small><b>{amt(m.newEntitlement?.net||0)}</b></span>
              <span><small>{en?'Deduction difference':'কর্তনের পার্থক্য'}</small><b>{(Number(m.deductionAdjustment||0)>=0?'+ ':'− ')+amt(Math.abs(Number(m.deductionAdjustment||0)))}</b></span>
              <span><small>{en?'Special benefit':'বিশেষ সুবিধা'}</small><b>− {amt(m.specialAdjustment||0)}</b></span>
            </div>
          </article>)}
        </div>

        <div className="pwa-arrear-lines">
          <div><span>{en?'30 Jun 2026 basic':'৩০ জুন ২০২৬ মূল বেতন'}</span><b>{amt(arrear.oldJuneBasic||0)}</b></div>
          <div><span>{en?'Old-scale July increment already paid':'পুরোনো স্কেলের জুলাই ইনক্রিমেন্ট ইতোমধ্যে পাওয়া'}</span><b>{amt(arrear.legacyIncrementPaid||0)}</b></div>
          <div><span>{en?'2026-scale increment step':'২০২৬ স্কেলের ইনক্রিমেন্ট ধাপ'}</span><b>{amt(arrear.newScaleIncrementAmount||0)}</b></div>
          <div><span>{en?'Final Jul–Sep arrear':'চূড়ান্ত জুলাই–সেপ্টেম্বর বকেয়া'}</span><b>+ {amt(arrear.priorNetAfterSpecial||0)}</b></div>
          <div><span>{en?'October current net':'অক্টোবর চলতি Net'}</span><b>+ {amt(arrear.octoberCurrentNet||0)}</b></div>
        </div>
        <div className="pwa-arrear-method-note">{en?'Old salary/allowances already paid are offset against the new entitlement. PF, benevolent and other deductions use only the deduction difference. Special Benefit is adjusted once per arrear month.':'আগে পাওয়া পুরোনো বেতন/ভাতা নতুন প্রাপ্যের বিপরীতে সমন্বয় হয়েছে। PF, কল্যাণ ও অন্যান্য কর্তনে শুধু কর্তনের পার্থক্য ধরা হয়েছে। Special Benefit প্রতিটি বকেয়া মাসে একবার করে সমন্বয় হয়েছে।'}</div>
        <button className="pwa-arrear-pdf" disabled={!!pdfBusy} onClick={()=>previewPdf(arrearReport,'arrear')}><FileText/>{en?'View 4-page A4 arrear PDF':'৪-পৃষ্ঠার A4 বকেয়া PDF দেখুন'}<ChevronRight/></button>
      </section>}

      {compactTab==='reports'&&<section className="pwa-compact-report-center">
        <button className="pwa-inline-back" onClick={()=>setCompactTab('now')}><ArrowLeft/>{en?'Back to result':'ফলাফলে ফিরুন'}</button>
        <div className="pwa-compact-section-head"><small>{en?'REPORT CENTER':'রিপোর্ট সেন্টার'}</small><h3>{en?'Preview, download or share':'প্রিভিউ, ডাউনলোড বা শেয়ার'}</h3></div>
        <div className="pwa-report-choice-grid">
          <button onClick={()=>previewPdf(activeYearReport,String(activeYear),activeShareTitle,activeShareSummary)}><FileText/><span><b>{numLang(activeYear,lang,0)} PDF</b><small>{en?'Selected year':'নির্বাচিত বছর'}</small></span><ChevronRight/></button>
          <button onClick={()=>previewPdf(combinedReport,'all')}><FileText/><span><b>{en?'2026–2028 PDF':'২০২৬–২০২৮ PDF'}</b><small>{en?'Complete report':'সম্পূর্ণ রিপোর্ট'}</small></span><ChevronRight/></button>
          <button onClick={()=>previewPdf(arrearReport,'arrear')}><ReceiptText/><span><b>{en?'Arrear PDF':'বকেয়া PDF'}</b><small>{en?'July–October 2026':'জুলাই–অক্টোবর ২০২৬'}</small></span><ChevronRight/></button>
        </div>
        <ReportShareActions html={activeYearReport.html} filename={activeYearReport.filename} title={activeShareTitle} summary={activeShareSummary} lang={lang} compact={true}/>
      </section>}

      <div className="pwa-result-sticky-actions">
        <button className={compactTab==='reports'?'active':''} onClick={()=>setCompactTab('reports')}><FileText/><span>{en?'Reports':'রিপোর্ট'}</span></button>
        <button className={compactTab==='details'?'active':''} onClick={()=>setCompactTab(compactTab==='details'?'now':'details')}><SlidersHorizontal/><span>{en?'Details':'বিস্তারিত'}</span></button>
        <button onClick={()=>onReset?.()}><RefreshCw/><span>{en?'New':'নতুন হিসাব'}</span></button>
      </div>
      {pdfPreview&&<PdfPreviewModal html={pdfPreview.html} filename={pdfPreview.filename} onClose={()=>setPdfPreview(null)} lang={lang} shareTitle={pdfPreview.title} shareSummary={pdfPreview.summary||''}/>}
    </div>;
  }

  return <div className={`result-stack year-tab-result salary-v2-result salary-screen-${screen}`}>
    <SalaryFlowProgress step={screen==='report'?4:3} lang={lang}/>
    {screen==='result'&&<section className="salary-result-editbar">
      <div><small>{en?'CURRENT INPUT':'বর্তমান তথ্য'}</small><b>{duCategoryInfo(r.category,lang).label} · {en?'Grade ':'গ্রেড '}{numLang(r.grade||0,lang,0)} · {amt(r.currentBasic||0)}</b></div>
      <button onClick={()=>onEdit?.()}><Edit3/>{en?'Edit information':'তথ্য পরিবর্তন'}</button>
    </section>}
    {screen==='report'&&<section className="salary-report-backbar">
      <button onClick={backToResult}><ArrowLeft/>{en?'Back to result':'ফলাফলে ফিরুন'}</button>
      <div><small>{en?'STEP 4':'ধাপ ৪'}</small><b>{en?'Report & PDF Center':'রিপোর্ট ও PDF সেন্টার'}</b></div>
    </section>}
    <section className="salary-result-toolbar">
      <div className="result-year-tabs" aria-label={en?'Salary year':'বেতনের বছর'}>
        {[2026,2027,2028].map(year=><button key={year} className={activeYear===year?'active':''} onClick={()=>setActiveYear(year)}>
          <span>{numLang(year,lang,0)}</span>
          <small>{year===2026?(en?'Phase 1':'১ম ধাপ'):year===2027?(en?'Phase 2 + full':'২য় ধাপ + পূর্ণ'):(en?'New allowances + Jul increment':'নতুন ভাতা + জুলাই ইনক্রিমেন্ট')}</small>
        </button>)}
      </div>
      <div className="salary-result-switch" role="tablist">
        <button className={resultView==='salary'?'active':''} onClick={()=>setResultView('salary')}>{en?'Salary':'বেতন হিসাব'}</button>
        {activeYear===2026&&<button className={resultView==='arrear'?'active':''} onClick={()=>setResultView('arrear')}>{en?'Arrear':'বকেয়া / এরিয়ার'}</button>}
      </div>
    </section>

    {resultView==='salary'&&<>
      <section className="salary-overview-v2">
        <div className="salary-overview-head">
          <div><span>{numLang(activeYear,lang,0)}</span><h3>{en?'Salary result at a glance':'বেতন ফলাফল এক নজরে'}</h3><p>{en?'Only the key figures are shown first. Open details below when needed.':'প্রথমে শুধু গুরুত্বপূর্ণ অংকগুলো দেখানো হচ্ছে। প্রয়োজন হলে নিচের বিস্তারিত খুলুন।'}</p></div>
          <div className="salary-phase-badge">{current.phase?.label||r.phase?.label||'—'}</div>
        </div>

        <div className="salary-du-profile-strip">
          <span><small>{en?'DU category':'DU শ্রেণি'}</small><b>{duCategoryInfo(current.category||r.category,lang).label}</b></span>
          <span><small>{en?'Location':'কর্মস্থল'}</small><b>{en?'University of Dhaka, Dhaka':'ঢাকা বিশ্ববিদ্যালয়, ঢাকা'}</b></span>
          <span><small>{en?'Housing':'বাসা'}</small><b>{(current.housingMode||r.housingMode)==='du_quarter'?(en?'DU quarter/unit':'ঢাবি বাসা/ইউনিট'):(en?'No DU quarter':'ঢাবি বাসা নেই')}</b></span>
        </div>
        <div className="salary-kpi-v2">
          <article><small>{en?'Payable basic':'প্রাপ্য মূল বেতন'}</small><b>{amt(current.payableBasic??r.payableBasic)}</b></article>
          <article><small>{en?'Monthly allowances':'মাসিক মোট ভাতা'}</small><b>{amt(current.totalAllowances??0)}</b></article>
          <article><small>{en?'Total deductions':'মোট কর্তন'}</small><b>{amt(current.deductions??0)}</b></article>
          <article className="net"><small>{en?'Estimated net payable':'আনুমানিক নিট প্রাপ্য'}</small><b>{amt(current.net??0)}</b></article>
        </div>

        <details className="salary-v2-details">
          <summary>{en?'Implementation stages for this year':'এই বছরের বাস্তবায়ন ধাপ'}</summary>
          <div className="details-body salary-stage-list-v2">
            {yearStages.map((p,i)=><article key={p.date} className={i===yearStages.length-1?'current':''}>
              <small>{p.label}</small>
              <b>{amt(p.payableBasic)}</b>
              <div className="salary-stage-metrics">
                <span>{en?'Allowances':'ভাতা'} <b>{amt(p.totalAllowances)}</b></span>
                <span>{en?'Gross':'মোট'} <b>{amt(p.gross)}</b></span>
                <span>{en?'Deductions':'কর্তন'} <b>{amt(p.deductions)}</b></span>
                <span>{en?'Net':'নিট'} <b>{amt(p.net)}</b></span>
              </div>
            </article>)}
          </div>
        </details>

        <details className="salary-v2-details">
          <summary>{en?'Fixation and calculation basis':'ফিক্সেশন ও হিসাবের ভিত্তি'}</summary>
          <div className="details-body">
            <div className="money-row"><span>{en?'2015 current basic':'২০১৫ বর্তমান মূল বেতন'}</span><b>{amt(r.currentBasic)}</b></div>
            <div className="money-row"><span>{en?'2026 fixed basic':'২০২৬ নির্ধারিত মূল বেতন'}</span><b>{amt(r.fixed)}</b></div>
            <div className="money-row"><span>{en?'First eligible increment included':'প্রাপ্য প্রথম ইনক্রিমেন্টসহ'}</span><b>{amt(r.fixedWithFirstIncrement??r.fixed)}</b></div>
            <div className="money-row"><span>{en?'Implemented difference':'বাস্তবায়িত পার্থক্য'}</span><b>{amt(current.implementedDifference??r.implementedDifference)}</b></div>
            <div className="money-row"><span>{en?'Annual increments included':'অন্তর্ভুক্ত বার্ষিক ইনক্রিমেন্ট'}</span><b>{numLang(current.dueIncrementCount??0,lang,0)}</b></div>
          </div>
        </details>
      </section>

      <details className="salary-breakdown-v2">
        <summary>{en?'Monthly allowances & deductions':'মাসিক ভাতা ও কর্তনের বিস্তারিত'}</summary>
        <div className="split-grid">
          <section className="breakdown-card"><h3>{en?'Allowances':'ভাতা'}</h3>
            {allowances.filter(([,v])=>Number(v)>0).map(([l,v])=><div className="money-row" key={l}><span>{l}</span><b>{amt(v)}</b></div>)}
            {(current.allowance2026&&current.houseRate>0)&&<div className="money-row source-row"><span>{en?'House-rent rate':'বাড়িভাড়া হার'}</span><b>{numLang(current.houseRate,lang,0)}%</b></div>}
            {current.allowance2026&&<div className="money-row annual-row"><span>{en?'Bangla New Year allowance (annual)':'বাংলা নববর্ষ ভাতা (বার্ষিক)'}</span><b>{amt(current.banglaNewYear??0)}</b></div>}
          </section>
          <section className="breakdown-card"><h3>{en?'Deductions':'কর্তন'}</h3>{deds.map(([l,v])=><div className="money-row" key={l}><span>{l}</span><b>{amt(v)}</b></div>)}</section>
        </div>
      </details>

      <section className="salary-report-center-v2">
        <div className="salary-report-head-v2"><div><span>{en?'REPORTS':'রিপোর্ট'}</span><h3>{en?'Preview the report first':'প্রথমে রিপোর্ট দেখে নিন'}</h3><p>{en?'Open the A4 preview first; download or share only if you want.':'আগে A4 প্রিভিউ খুলবে; তারপর চাইলে ডাউনলোড বা শেয়ার করবেন।'}</p></div></div>
        <div className="salary-report-primary-actions">
          <button className="primary-report" disabled={!!pdfBusy} onClick={()=>previewPdf(activeYearReport,String(activeYear),activeShareTitle,activeShareSummary)}><FileText/><span><b>{numLang(activeYear,lang,0)} PDF</b><small>{en?'Current selected year':'নির্বাচিত বছর'}</small></span><ChevronRight size={17}/></button>
          <button disabled={!!pdfBusy} onClick={()=>previewPdf(combinedReport,'all')}><FileText/><span><b>{en?'2026–2028 Combined PDF':'২০২৬–২০২৮ একসাথে PDF'}</b><small>{en?'Three-page report':'৩-পৃষ্ঠার রিপোর্ট'}</small></span><ChevronRight size={17}/></button>
        </div>
        <div className="salary-report-share-v2">
          <ReportShareActions html={activeYearReport.html} filename={activeYearReport.filename} title={activeShareTitle} summary={activeShareSummary} lang={lang} compact={true}/>
        </div>
        <details className="salary-v2-details salary-report-more-v2">
          <summary>{en?'Other yearly PDFs and complete-report sharing':'অন্য বছরের PDF ও সম্পূর্ণ রিপোর্ট শেয়ার'}</summary>
          <div className="details-body">
            <div className="year-download-grid">
              {yearReports.filter(x=>x.year!==activeYear).map(x=><button key={x.year} disabled={!!pdfBusy} onClick={()=>previewPdf(x,String(x.year))}><FileText/><span><b>{numLang(x.year,lang,0)} PDF</b><small>{en?'Preview':'প্রিভিউ'}</small></span><ChevronRight size={17}/></button>)}
            </div>
            <div className="combined-report-share">
              <b>{en?'Share the complete 3-page report':'সম্পূর্ণ ৩-পৃষ্ঠার রিপোর্ট শেয়ার করুন'}</b>
              <ReportShareActions html={combinedReport.html} filename={combinedReport.filename} title={en?'Pay Scale 2026–2028 Complete Salary Report':'পে-স্কেল ২০২৬–২০২৮ সম্পূর্ণ বেতন রিপোর্ট'} summary={en?'Complete 2026, 2027 and 2028 salary calculation report in three pages.':'২০২৬, ২০২৭ ও ২০২৮ সালের সম্পূর্ণ বেতন হিসাব—৩ পৃষ্ঠার রিপোর্ট।'} lang={lang} compact={true}/>
            </div>
          </div>
        </details>
        {activeYear===2026&&<div className="salary-report-extra-arrear">
          <div><ReceiptText/><span><small>{en?'ARREAR REPORT':'বকেয়া রিপোর্ট'}</small><b>{en?'July–October 2026 monthly reconciliation':'জুলাই–অক্টোবর ২০২৬ মাসভিত্তিক সমন্বয়'}</b></span></div>
          <button disabled={!!pdfBusy} onClick={()=>previewPdf(arrearReport,'arrear')}><FileText/>{en?'Preview arrear PDF':'বকেয়া PDF প্রিভিউ'}<ChevronRight/></button>
          <ReportShareActions html={arrearReport.html} filename={arrearReport.filename} title={en?'July–October 2026 Monthly Salary & Arrear Statement':'জুলাই–অক্টোবর ২০২৬ মাসভিত্তিক বেতন ও বকেয়া বিবরণী'} summary={en?'Four A4 pages with July–September reconciliation and October settlement.':'জুলাই–সেপ্টেম্বর সমন্বয় ও অক্টোবর নিষ্পত্তিসহ ৪-পৃষ্ঠার A4 রিপোর্ট।'} lang={lang} compact={true}/>
        </div>}
      </section>

      <div className="notice official-pay-note"><b>{en?'Year status:':'বছরের অবস্থা:'}</b> {activeYear===2028?(en?'New allowance rates apply from 1 January 2028; the next annual increment is applied from 1 July 2028.':'১ জানুয়ারি ২০২৮ থেকে নতুন ভাতার হার এবং ১ জুলাই ২০২৮ থেকে পরবর্তী বার্ষিক ইনক্রিমেন্ট প্রয়োগ হবে।'):(en?'Pre-2028 allowance rules remain in force for this year.':'এই বছরে ২০২৮-এর আগের ভাতার নিয়ম/হার কার্যকর থাকবে।')}</div>
    </>}

    {activeYear===2026&&resultView==='arrear'&&<section className="arrear-v2">
      <div className="arrear-v2-head">
        <div><span>{en?'MONTHLY ARREAR RECONCILIATION':'মাসভিত্তিক বকেয়া সমন্বয়'}</span><h3>{en?'October bill + July–September final arrears':'অক্টোবর বিল + জুলাই–সেপ্টেম্বরের চূড়ান্ত বকেয়া'}</h3><p>{en?'Each arrear month compares the complete old payroll already paid with the new entitlement. Earnings and deductions are reconciled separately, and Special Benefit is adjusted once per month.':'প্রতিটি বকেয়া মাসে ইতোমধ্যে পাওয়া সম্পূর্ণ পুরোনো পে-রোলের সঙ্গে নতুন প্রাপ্য তুলনা করা হয়েছে। বেতন/ভাতা ও কর্তন আলাদাভাবে সমন্বয় হয়েছে এবং Special Benefit প্রতি মাসে একবার করে সমন্বয় হয়েছে।'}</p></div>
        <div className="arrear-v2-total"><small>{en?'Estimated October total':'অক্টোবরে আনুমানিক মোট'}</small><b>{amt(arrear.octoberBillNet||0)}</b></div>
      </div>

      <div className="arrear-equation-v2 simple-final" aria-label={en?'Final settlement equation':'চূড়ান্ত সমন্বয়ের সমীকরণ'}>
        <div><small>{en?'October current net':'অক্টোবর চলতি Net'}</small><b>{amt(arrear.octoberCurrentNet||0)}</b></div>
        <i>+</i>
        <div><small>{en?'Final July–September arrear':'চূড়ান্ত জুলাই–সেপ্টেম্বর বকেয়া'}</small><b>{amt(arrear.priorNetAfterSpecial||0)}</b></div>
        <i>=</i>
        <div className="final"><small>{en?'Estimated total receivable':'আনুমানিক মোট প্রাপ্য'}</small><b>{amt(arrear.octoberBillNet||0)}</b></div>
      </div>

      <div className="arrear-mini-kpis-v2 four">
        <article><small>{en?'3-month gross adjustment':'৩ মাসের Gross সমন্বয়'}</small><b>{amt(arrear.priorThreeGrossArrear||0)}</b></article>
        <article><small>{en?'3-month deduction difference':'৩ মাসের কর্তন পার্থক্য'}</small><b>{(Number(arrear.priorThreeDeductionIncrease||0)>=0?'+ ':'− ')+amt(Math.abs(Number(arrear.priorThreeDeductionIncrease||0)))}</b></article>
        <article><small>{en?'Special Benefit adjusted':'Special Benefit সমন্বয়'}</small><b>− {amt(arrear.specialBenefitReceivedAmount||0)}</b></article>
        <article><small>{en?'Final Jul–Sep arrear':'চূড়ান্ত Jul–Sep বকেয়া'}</small><b>{amt(arrear.priorNetAfterSpecial||0)}</b></article>
      </div>

      <section className="arrear-monthly-reconciliation">
        <div className="arrear-monthly-title"><div><small>{en?'OLD PAID → NEW ENTITLEMENT':'OLD PAID → NEW ENTITLEMENT'}</small><h3>{en?'Month-by-month settlement':'মাসভিত্তিক নিষ্পত্তি'}</h3></div><span>{en?'3 arrear months':'৩ বকেয়া মাস'}</span></div>
        <div className="arrear-monthly-grid">
          {(arrear.monthlySettlements||[]).map(m=><article key={m.date}>
            <div className="amr-head"><div><small>{en?'ARREAR MONTH':'বকেয়া মাস'}</small><h4>{en?m.monthEn:m.monthBn} 2026</h4></div><strong>{amt(m.finalArrear||0)}</strong></div>
            <div className="amr-net-row"><span><small>{en?'Old net paid':'পুরোনো Net পাওয়া'}</small><b>{amt(m.oldPaid?.net||0)}</b></span><i>→</i><span><small>{en?'New net due':'নতুন Net প্রাপ্য'}</small><b>{amt(m.newEntitlement?.net||0)}</b></span></div>
            <div className="amr-lines">
              <div><span>{en?'Old gross already paid':'পুরোনো Gross পাওয়া'}</span><b>{amt(m.oldPaid?.gross||0)}</b></div>
              <div><span>{en?'New gross entitlement':'নতুন Gross প্রাপ্য'}</span><b>{amt(m.newEntitlement?.gross||0)}</b></div>
              <div><span>{en?'Gross adjustment':'Gross সমন্বয়'}</span><b>{(Number(m.grossAdjustment||0)>=0?'+ ':'− ')+amt(Math.abs(Number(m.grossAdjustment||0)))}</b></div>
              <div><span>{en?'Deduction difference':'কর্তনের পার্থক্য'}</span><b>{(Number(m.deductionAdjustment||0)>=0?'+ ':'− ')+amt(Math.abs(Number(m.deductionAdjustment||0)))}</b></div>
              <div><span>{en?'Net before Special Benefit':'Special Benefit-এর আগে Net'}</span><b>{amt(m.netBeforeSpecial||0)}</b></div>
              <div><span>{en?'Special Benefit already received':'ইতোমধ্যে পাওয়া Special Benefit'}</span><b>− {amt(m.specialAdjustment||0)}</b></div>
            </div>
            <div className="amr-final"><span>{en?'Final monthly arrear':'চূড়ান্ত মাসিক বকেয়া'}</span><b>{amt(m.finalArrear||0)}</b></div>
          </article>)}
        </div>
      </section>

      <details className="salary-v2-details" open>
        <summary>{en?'Fixation, old payroll and deduction basis':'ফিক্সেশন, পুরোনো পে-রোল ও কর্তনের ভিত্তি'}</summary>
        <div className="details-body">
          <div className="arrear-detail-grid-v2">
            <div><small>{en?'Selected grade':'নির্বাচিত গ্রেড'}</small><b>{en?'Grade ':'গ্রেড '}{numLang(arrear.selectedGrade||r.grade||0,lang,0)}</b></div>
            <div><small>{en?'30 June old-scale basic':'৩০ জুন পুরোনো স্কেলের মূল বেতন'}</small><b>{amt(arrear.oldJuneBasic||0)}</b></div>
            <div><small>{en?'1 July old-scale basic':'১ জুলাই পুরোনো স্কেলের মূল বেতন'}</small><b>{amt(arrear.oldJulyBasic||0)}</b></div>
            <div><small>{en?'Old-scale July increment already paid':'পুরোনো স্কেলের জুলাই ইনক্রিমেন্ট ইতোমধ্যে পাওয়া'}</small><b>{amt(arrear.legacyIncrementPaid||0)}</b></div>
            <div><small>{en?'2026 fixed basic':'২০২৬ স্কেলে Fixed Basic'}</small><b>{amt(r.fixed||0)}</b></div>
            <div><small>{en?'2026-scale increment step':'২০২৬ স্কেলের Increment Step'}</small><b>{amt(arrear.newScaleIncrementAmount||0)}</b></div>
            <div><small>{en?'Old payroll gross / month':'পুরোনো Payroll Gross / মাস'}</small><b>{amt(arrear.legacyGross||0)}</b></div>
            <div><small>{en?'Old payroll deductions / month':'পুরোনো Payroll কর্তন / মাস'}</small><b>{amt(arrear.legacyDeductions||0)}</b></div>
            <div><small>{en?'Monthly Special Benefit':'মাসিক Special Benefit'}</small><b>{amt(arrear.specialBenefitMonthly||0)}</b></div>
            <div><small>{en?'3-month Special Benefit adjusted':'৩ মাসের Special Benefit সমন্বয়'}</small><b>{amt(arrear.specialBenefitReceivedAmount||0)}</b></div>
            <div><small>{en?'3-month net before Special Benefit':'Special Benefit-এর আগে ৩ মাসের Net'}</small><b>{amt(arrear.priorThreeNetArrear||0)}</b></div>
            <div><small>{en?'Final previous arrear':'চূড়ান্ত পূর্বের বকেয়া'}</small><b>{amt(arrear.priorNetAfterSpecial||0)}</b></div>
          </div>
          <div className="arrear-method-v3"><ShieldCheck/><div><b>{en?'No double deduction':'কোনো Double Deduction নেই'}</b><span>{en?'Old Basic, July increment, house rent and other earnings are already included in Old Paid Payroll. PF, benevolent fund and other deductions use only the difference between new required deductions and amounts already deducted. Special Benefit is a separate one-time monthly adjustment.':'পুরোনো Basic, July increment, বাড়িভাড়া ও অন্যান্য প্রাপ্তি Old Paid Payroll-এর মধ্যেই ধরা হয়েছে। PF, কল্যাণ ও অন্যান্য কর্তনে নতুন প্রয়োজনীয় কর্তন থেকে আগে কর্তিত অংকের শুধু পার্থক্য ধরা হয়েছে। Special Benefit আলাদা মাসিক সমন্বয়—দ্বিতীয়বার কোনো অংক কর্তন হয়নি।'}</span></div></div>
        </div>
      </details>

      <div className="arrear-v2-actions">
        <button disabled={!!pdfBusy} onClick={()=>previewPdf(arrearReport,'arrear')}><FileText/><span>{en?'View 4-page A4 Arrear PDF':'৪-পৃষ্ঠার A4 বকেয়া PDF দেখুন'}</span><ChevronRight size={16}/></button>
        <ReportShareActions html={arrearReport.html} filename={arrearReport.filename} title={en?'July–October 2026 Monthly Salary & Arrear Statement':'জুলাই–অক্টোবর ২০২৬ মাসভিত্তিক বেতন ও বকেয়া বিবরণী'} summary={en?'Four A4 pages: July, August, September monthly reconciliation and October final settlement.':'৪টি A4 পৃষ্ঠা: জুলাই, আগস্ট, সেপ্টেম্বরের মাসভিত্তিক সমন্বয় এবং অক্টোবর Final Settlement।'} lang={lang} compact={true}/>
      </div>
      <div className="notice arrear-note"><b>{en?'Important:':'গুরুত্বপূর্ণ:'}</b> {en?'The PDF shows earnings and deductions separately for each month. Final payroll may still differ if the actual office bill contains tax, loan, housing recovery or other payroll-specific entries not entered here.':'PDF-এ প্রতি মাসের বেতন/ভাতা ও কর্তন আলাদাভাবে দেখানো হবে। প্রকৃত অফিস বিলে এখানে না দেওয়া আয়কর, ঋণ, বাসা recovery বা অন্য payroll entry থাকলে চূড়ান্ত অংক ভিন্ন হতে পারে।'}</div>
    </section>}
    {screen==='result'&&<section className="salary-result-next-report">
      <div><FileText/><span><small>{en?'NEXT STEP':'পরবর্তী ধাপ'}</small><b>{en?'Open Report & PDF Center':'রিপোর্ট ও PDF সেন্টার খুলুন'}</b></span></div>
      <button onClick={openReportCenter}>{en?'Reports & PDF':'রিপোর্ট ও PDF'}<ArrowRight/></button>
    </section>}
    {pdfPreview&&<PdfPreviewModal html={pdfPreview.html} filename={pdfPreview.filename} onClose={()=>setPdfPreview(null)} lang={lang} shareTitle={pdfPreview.title} shareSummary={pdfPreview.summary||''}/>}
  </div>
}
function ImagePicker({value,onChange}){
  const[preview,setPreview]=useState(value||''),[msg,setMsg]=useState('');
  useEffect(()=>setPreview(value||''),[value]);

  async function pick(e){
    const file=e.target.files?.[0];
    if(!file)return;
    if(!file.type.startsWith('image/')){setMsg('শুধু ছবি নির্বাচন করুন।');return}
    const img=new Image();
    const url=URL.createObjectURL(file);
    img.onload=()=>{
      const max=420,scale=Math.min(1,max/Math.max(img.width,img.height));
      const c=document.createElement('canvas');
      c.width=Math.max(1,Math.round(img.width*scale));
      c.height=Math.max(1,Math.round(img.height*scale));
      c.getContext('2d').drawImage(img,0,0,c.width,c.height);
      let q=.82,blob=null;
      const tryEncode=()=>new Promise(res=>c.toBlob(res,'image/webp',q));
      (async()=>{
        do{blob=await tryEncode();q-=.08}while(blob&&blob.size>50*1024&&q>=.30);
        URL.revokeObjectURL(url);
        if(!blob||blob.size>50*1024){setMsg('ছবিটি 50 KB-এর মধ্যে compress করা যায়নি। অন্য ছবি দিন।');return}
        const reader=new FileReader();
        reader.onload=()=>{setPreview(reader.result);onChange(reader.result);setMsg(`${Math.ceil(blob.size/1024)} KB · WebP`)};
        reader.readAsDataURL(blob);
      })();
    };
    img.src=url;
  }

  return <div className="photo-picker">
    <div className="photo-preview">{preview?<img src={preview}/>:<UserCircle2 size={42}/>}</div>
    <div><label className="photo-btn"><Camera size={15}/> Profile Photo<input type="file" accept="image/*" onChange={pick}/></label><small>{msg||'সর্বোচ্চ 50 KB · auto resize/compress'}</small></div>
  </div>
}

function EmployeeModal({open,onClose,onSaved,editing,departments,designations}){
  const blank={employee_id:'',name_bn:'',name_en:'',father_name:'',mother_name:'',date_of_birth:'',nid_masked:'',mobile:'',email:'',blood_group:'',designation:'',designation_id:'',department_id:'',office_name:'',grade:'',basic_salary:'',joining_date:'',current_position:'',current_position_joining_date:'',service_status:'active',employment_type:'',photo_data:''};
  const [form,setForm]=useState(blank),[busy,setBusy]=useState(false),[err,setErr]=useState('');

  useEffect(()=>{
    if(open){
      if(editing)setForm({...blank,...editing,department_id:editing.department_id||'',designation_id:editing.designation_id||'',photo_data:editing.photo_data||''});
      else setForm(blank);
      setErr('');
    }
  },[open,editing]);

  if(!open)return null;
  function change(k,v){setForm(f=>({...f,[k]:v}))}

  async function save(e){
    e.preventDefault();setBusy(true);setErr('');
    try{
      const payload={...form,
        grade:form.grade?Number(form.grade):null,
        basic_salary:form.basic_salary?Number(form.basic_salary):null,
        department_id:form.department_id?Number(form.department_id):null,
        designation_id:form.designation_id?Number(form.designation_id):null
      };
      if(editing)await api('/api/employees/'+editing.id,{method:'PUT',body:JSON.stringify(payload)});
      else await api('/api/employees',{method:'POST',body:JSON.stringify(payload)});
      onSaved();onClose();
    }catch(e){setErr(e.message)}finally{setBusy(false)}
  }

  return <div className="modal-backdrop"><div className="modal-card wide-modal">
    <div className="modal-head"><div><h3>{editing?'Employee Profile Edit':'নতুন Employee Profile'}</h3><p>ব্যক্তিগত, চাকরি ও বর্তমান পোস্টিং তথ্য দিন।</p></div><button className="icon-btn" onClick={onClose}><X/></button></div>

    <ImagePicker value={form.photo_data} onChange={v=>change('photo_data',v)}/>

    <form onSubmit={save} className="form-grid">
      <div className="form-section span-2">পরিচয় ও যোগাযোগ</div>
      <label>Employee ID<input required value={form.employee_id} onChange={e=>change('employee_id',e.target.value)}/></label>
      <label>নাম (বাংলা)<input required value={form.name_bn} onChange={e=>change('name_bn',e.target.value)}/></label>
      <label>নাম (English)<input value={form.name_en} onChange={e=>change('name_en',e.target.value)}/></label>
      <label>পিতার নাম<input value={form.father_name} onChange={e=>change('father_name',e.target.value)}/></label>
      <label>মাতার নাম<input value={form.mother_name} onChange={e=>change('mother_name',e.target.value)}/></label>
      <DMY label="জন্মতারিখ" value={form.date_of_birth} onChange={v=>change('date_of_birth',v)}/>
      <label>NID (Masked/limited)<input placeholder="যেমন ******1234" value={form.nid_masked} onChange={e=>change('nid_masked',e.target.value)}/></label>
      <label>মোবাইল<input value={form.mobile} onChange={e=>change('mobile',e.target.value)}/></label>
      <label>ইমেইল<input type="email" value={form.email} onChange={e=>change('email',e.target.value)}/></label>
      <label>Blood Group<select value={form.blood_group} onChange={e=>change('blood_group',e.target.value)}><option value="">নির্বাচন</option>{['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(x=><option key={x}>{x}</option>)}</select></label>

      <div className="form-section span-2">চাকরির তথ্য</div>
      <label>Department / Office<select value={form.department_id} onChange={e=>change('department_id',e.target.value)}><option value="">নির্বাচন</option>{departments.map(d=><option value={d.id} key={d.id}>{d.name_bn||d.name_en}</option>)}</select></label>
      <label>Designation<select value={form.designation_id} onChange={e=>change('designation_id',e.target.value)}><option value="">নির্বাচন</option>{designations.map(d=><option value={d.id} key={d.id}>{d.name_bn||d.name_en}</option>)}</select></label>
      <label>পদবি (Custom/legacy)<input value={form.designation||''} onChange={e=>change('designation',e.target.value)}/></label>
      <label>Office / Unit<input value={form.office_name} onChange={e=>change('office_name',e.target.value)}/></label>
      <label>গ্রেড<select value={form.grade} onChange={e=>change('grade',e.target.value)}><option value="">নির্বাচন</option>{Array.from({length:20},(_,i)=>i+1).map(g=><option key={g}>{g}</option>)}</select></label>
      <label>বেসিক বেতন<input type="number" min="0" value={form.basic_salary} onChange={e=>change('basic_salary',e.target.value)}/></label>
      <DMY label="প্রথম যোগদানের তারিখ" value={form.joining_date} onChange={v=>change('joining_date',v)}/>
      <label>বর্তমান পদ<input value={form.current_position} onChange={e=>change('current_position',e.target.value)}/></label>
      <DMY label="বর্তমান পদে যোগদানের তারিখ" value={form.current_position_joining_date} onChange={v=>change('current_position_joining_date',v)}/>
      <label>Employment Type<select value={form.employment_type} onChange={e=>change('employment_type',e.target.value)}><option value="">নির্বাচন</option><option value="permanent">স্থায়ী</option><option value="temporary">অস্থায়ী</option><option value="contract">চুক্তিভিত্তিক</option></select></label>
      <label>Service Status<select value={form.service_status} onChange={e=>change('service_status',e.target.value)}><option value="active">Active</option><option value="retired">Retired</option><option value="on_leave">On Leave</option><option value="inactive">Inactive</option></select></label>

      {err&&<div className="error span-2">{err}</div>}
      <div className="modal-actions span-2"><button type="button" className="secondary" onClick={onClose}>বাতিল</button><button disabled={busy}><Save size={16}/>{busy?'সংরক্ষণ হচ্ছে...':'Profile সংরক্ষণ'}</button></div>
    </form>
  </div></div>
}


const SERVICE_EVENT_TYPES=[
  ['appointment','নিয়োগ'],['joining','যোগদান'],['promotion','পদোন্নতি'],['transfer','বদলি/পোস্টিং'],
  ['increment','ইনক্রিমেন্ট'],['training','প্রশিক্ষণ'],['grade_change','গ্রেড পরিবর্তন'],['other','অন্যান্য']
];

function ServiceHistoryModal({open,onClose,onSaved,employee,event,departments}){
  const blank={event_type:'promotion',event_date:'',title:'',from_designation:'',to_designation:'',from_grade:'',to_grade:'',department_id:'',office_name:'',reference_no:'',notes:''};
  const[form,setForm]=useState(blank),[busy,setBusy]=useState(false),[err,setErr]=useState('');
  useEffect(()=>{if(open){setForm(event?{...blank,...event,department_id:event.department_id||''}:blank);setErr('')}},[open,event]);
  if(!open)return null;
  const c=(k,v)=>setForm(f=>({...f,[k]:v}));
  async function save(e){
    e.preventDefault();setBusy(true);setErr('');
    try{
      const payload={...form,employee_id:employee.id,from_grade:form.from_grade?Number(form.from_grade):null,to_grade:form.to_grade?Number(form.to_grade):null,department_id:form.department_id?Number(form.department_id):null};
      if(event)await api('/api/service-history/'+event.id,{method:'PUT',body:JSON.stringify(payload)});
      else await api('/api/service-history',{method:'POST',body:JSON.stringify(payload)});
      onSaved();onClose();
    }catch(e){setErr(e.message)}finally{setBusy(false)}
  }
  return <div className="modal-backdrop"><div className="modal-card">
    <div className="modal-head"><div><h3>{event?'Service Event Edit':'নতুন Service Event'}</h3><p>{employee.name_bn} · {employee.employee_id}</p></div><button className="icon-btn" onClick={onClose}><X/></button></div>
    <form className="form-grid" onSubmit={save}>
      <label>Event Type<select value={form.event_type} onChange={e=>c('event_type',e.target.value)}>{SERVICE_EVENT_TYPES.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label>
      <DMY label="কার্যকর তারিখ" value={form.event_date} onChange={v=>c('event_date',v)}/>
      <label className="span-2">শিরোনাম<input required value={form.title} onChange={e=>c('title',e.target.value)} placeholder="যেমন: গ্রেড ১৩ থেকে গ্রেড ১২-এ পদোন্নতি"/></label>
      <label>আগের পদ<input value={form.from_designation} onChange={e=>c('from_designation',e.target.value)}/></label>
      <label>নতুন পদ<input value={form.to_designation} onChange={e=>c('to_designation',e.target.value)}/></label>
      <label>আগের গ্রেড<select value={form.from_grade} onChange={e=>c('from_grade',e.target.value)}><option value="">—</option>{Array.from({length:20},(_,i)=>i+1).map(g=><option key={g}>{g}</option>)}</select></label>
      <label>নতুন গ্রেড<select value={form.to_grade} onChange={e=>c('to_grade',e.target.value)}><option value="">—</option>{Array.from({length:20},(_,i)=>i+1).map(g=><option key={g}>{g}</option>)}</select></label>
      <label>Department / Office<select value={form.department_id} onChange={e=>c('department_id',e.target.value)}><option value="">—</option>{departments.map(d=><option key={d.id} value={d.id}>{d.name_bn||d.name_en}</option>)}</select></label>
      <label>Office / Unit<input value={form.office_name} onChange={e=>c('office_name',e.target.value)}/></label>
      <label>আদেশ/স্মারক নম্বর<input value={form.reference_no} onChange={e=>c('reference_no',e.target.value)}/></label>
      <label className="span-2">মন্তব্য<textarea value={form.notes} onChange={e=>c('notes',e.target.value)} rows="3"/></label>
      {err&&<div className="error span-2">{err}</div>}
      <div className="modal-actions span-2"><button type="button" className="secondary" onClick={onClose}>বাতিল</button><button disabled={busy}><Save size={16}/>{busy?'সংরক্ষণ হচ্ছে...':'সংরক্ষণ'}</button></div>
    </form>
  </div></div>
}

function ServiceHistoryPanel({employee,departments}){
  const[list,setList]=useState([]),[loading,setLoading]=useState(true),[modal,setModal]=useState(false),[editing,setEditing]=useState(null),[err,setErr]=useState('');
  async function load(){setLoading(true);setErr('');try{const x=await api('/api/service-history?employee_id='+employee.id);setList(x.events||[])}catch(e){setErr(e.message)}finally{setLoading(false)}}
  useEffect(()=>{load()},[employee.id]);
  async function remove(ev){if(!confirm('এই service event মুছে ফেলবেন?'))return;try{await api('/api/service-history/'+ev.id,{method:'DELETE'});load()}catch(e){alert(e.message)}}
  const iconFor=t=>t==='promotion'?TrendingUp:t==='transfer'?ArrowRightLeft:t==='training'?GraduationCap:t==='increment'?BadgeDollarSign:t==='joining'?Clock3:History;
  return <section className="history-card">
    <div className="history-head"><div><h3>Service History Timeline</h3><p>নিয়োগ, পদোন্নতি, বদলি, ইনক্রিমেন্ট ও প্রশিক্ষণের ধারাবাহিক রেকর্ড।</p></div><button className="primary" onClick={()=>{setEditing(null);setModal(true)}}><Plus size={15}/> Add Event</button></div>
    {err&&<div className="error">{err}</div>}
    {loading?<div className="empty">Loading...</div>:list.length===0?<div className="empty">এখনো কোনো Service Event যোগ করা হয়নি।</div>:
      <div className="timeline">{list.map(ev=>{const I=iconFor(ev.event_type);return <article className="timeline-item" key={ev.id}>
        <div className="timeline-dot"><I size={17}/></div>
        <div className="timeline-body"><div className="timeline-top"><div><small>{ev.event_type_label||ev.event_type}</small><h4>{ev.title}</h4></div><b>{ev.event_date||'—'}</b></div>
          <div className="timeline-meta">
            {(ev.from_designation||ev.to_designation)&&<span><Briefcase size={14}/>{ev.from_designation||'—'} → {ev.to_designation||'—'}</span>}
            {(ev.from_grade||ev.to_grade)&&<span><ShieldCheck size={14}/>Grade {ev.from_grade||'—'} → {ev.to_grade||'—'}</span>}
            {ev.department_name_bn&&<span><Building2 size={14}/>{ev.department_name_bn}</span>}
            {ev.reference_no&&<span><FileClock size={14}/>{ev.reference_no}</span>}
          </div>
          {ev.notes&&<p>{ev.notes}</p>}
          <div className="timeline-actions"><button className="icon-btn" onClick={()=>{setEditing(ev);setModal(true)}}><Edit3 size={15}/></button><button className="icon-btn danger" onClick={()=>remove(ev)}><Trash2 size={15}/></button></div>
        </div>
      </article>})}</div>}
    <ServiceHistoryModal open={modal} onClose={()=>setModal(false)} onSaved={load} employee={employee} event={editing} departments={departments}/>
  </section>
}

function EmployeeProfile({emp,onEdit,onBack,departments=[]}){
  if(!emp)return null;
  return <div>
    <div className="page-head"><div><button className="back-text" onClick={onBack}>← Employee list</button><h2>Employee Profile</h2></div><button onClick={onEdit}><Edit3 size={16}/> Edit Profile</button></div>
    <section className="profile-hero">
      <div className="profile-avatar">{emp.photo_data?<img src={emp.photo_data}/>:<UserCircle2 size={70}/>}</div>
      <div className="profile-main"><span className="badge active">{emp.service_status||'active'}</span><h2>{emp.name_bn||emp.name_en||'—'}</h2><p>{emp.designation_name_bn||emp.designation||emp.current_position||'পদবি নেই'}</p>
        <div className="profile-meta"><span><IdCard/> {emp.employee_id}</span><span><Building2/> {emp.department_name_bn||'Department নেই'}</span><span><ShieldCheck/> Grade {emp.grade||'—'}</span></div>
      </div>
    </section>
    <section className="profile-grid">
      <article><h3>ব্যক্তিগত তথ্য</h3><div className="info-row"><span>English Name</span><b>{emp.name_en||'—'}</b></div><div className="info-row"><span>পিতার নাম</span><b>{emp.father_name||'—'}</b></div><div className="info-row"><span>মাতার নাম</span><b>{emp.mother_name||'—'}</b></div><div className="info-row"><span>জন্মতারিখ</span><b>{emp.date_of_birth||'—'}</b></div><div className="info-row"><span>Blood Group</span><b>{emp.blood_group||'—'}</b></div><div className="info-row"><span>NID</span><b>{emp.nid_masked||'—'}</b></div></article>
      <article><h3>যোগাযোগ</h3><div className="info-row"><span>মোবাইল</span><b>{emp.mobile||'—'}</b></div><div className="info-row"><span>ইমেইল</span><b>{emp.email||'—'}</b></div><div className="info-row"><span>Office / Unit</span><b>{emp.office_name||'—'}</b></div></article>
      <article><h3>চাকরির তথ্য</h3><div className="info-row"><span>বর্তমান পদ</span><b>{emp.current_position||emp.designation_name_bn||emp.designation||'—'}</b></div><div className="info-row"><span>বর্তমান গ্রেড</span><b>{emp.grade||'—'}</b></div><div className="info-row"><span>Basic Salary</span><b>{emp.basic_salary?`৳${money(emp.basic_salary)}`:'—'}</b></div><div className="info-row"><span>প্রথম যোগদান</span><b>{emp.joining_date||'—'}</b></div><div className="info-row"><span>বর্তমান পদে যোগদান</span><b>{emp.current_position_joining_date||'—'}</b></div><div className="info-row"><span>Employment Type</span><b>{emp.employment_type||'—'}</b></div></article>
    </section>
    <ServiceHistoryPanel employee={emp} departments={departments}/>
  </div>
}

function EmployeeManagement(){
  const[list,setList]=useState([]),[departments,setDepartments]=useState([]),[designations,setDesignations]=useState([]),
    [loading,setLoading]=useState(true),[q,setQ]=useState(''),[modal,setModal]=useState(false),[editing,setEditing]=useState(null),
    [selected,setSelected]=useState(null),[err,setErr]=useState('');

  async function load(){
    setLoading(true);setErr('');
    try{
      const [x,d,g]=await Promise.all([api('/api/employees'),api('/api/departments'),api('/api/designations')]);
      setList(x.employees||[]);setDepartments(d.departments||[]);setDesignations(g.designations||[]);
      if(selected){
        const refreshed=(x.employees||[]).find(e=>e.id===selected.id);
        if(refreshed)setSelected(refreshed);
      }
    }catch(e){setErr(e.message)}finally{setLoading(false)}
  }
  useEffect(()=>{load()},[]);

  const filtered=useMemo(()=>{
    const s=q.trim().toLowerCase();if(!s)return list;
    return list.filter(x=>[x.employee_id,x.name_bn,x.name_en,x.designation,x.designation_name_bn,x.department_name_bn,x.email,x.mobile].some(v=>String(v||'').toLowerCase().includes(s)))
  },[q,list]);

  async function remove(emp){
    if(!confirm(`${emp.name_bn||emp.employee_id} মুছে ফেলবেন?`))return;
    try{await api('/api/employees/'+emp.id,{method:'DELETE'});if(selected?.id===emp.id)setSelected(null);load()}catch(e){alert(e.message)}
  }

  if(selected)return <><EmployeeProfile emp={selected} departments={departments} onBack={()=>setSelected(null)} onEdit={()=>{setEditing(selected);setModal(true)}}/>
    <EmployeeModal open={modal} editing={editing} departments={departments} designations={designations} onClose={()=>setModal(false)} onSaved={load}/></>;

  return <>
    <div className="page-head"><div><h2>Employee Management</h2><p>Profile, Department, Designation, Grade, joining information ও service status পরিচালনা করুন।</p></div><button onClick={()=>{setEditing(null);setModal(true)}}><Plus size={17}/> নতুন Employee</button></div>
    <div className="toolbar"><div className="search"><Search size={17}/><input placeholder="Employee ID, নাম, বিভাগ, পদবি..." value={q} onChange={e=>setQ(e.target.value)}/></div><button className="secondary" onClick={load}><RefreshCw size={16}/> Refresh</button></div>
    {err&&<div className="error">{err}</div>}
    <div className="table-card">{loading?<div className="empty">Loading...</div>:filtered.length===0?<div className="empty">কোনো Employee record পাওয়া যায়নি।</div>:<div className="table-wrap"><table>
      <thead><tr><th>Employee</th><th>Department</th><th>পদবি</th><th>গ্রেড</th><th>Status</th><th></th></tr></thead>
      <tbody>{filtered.map(emp=><tr key={emp.id}>
        <td className="employee-cell" onClick={()=>setSelected(emp)}><div className="mini-avatar">{emp.photo_data?<img src={emp.photo_data}/>:<UserRound size={18}/>}</div><div><b>{emp.name_bn||'—'}</b><small>{emp.employee_id} · {emp.email||'ইমেইল নেই'}</small></div></td>
        <td>{emp.department_name_bn||emp.department_name_en||'—'}</td><td>{emp.designation_name_bn||emp.designation||emp.current_position||'—'}</td><td>{emp.grade||'—'}</td>
        <td><span className={'badge '+(emp.service_status||'active')}>{emp.service_status||'active'}</span></td>
        <td className="actions"><button className="icon-btn" onClick={()=>{setEditing(emp);setModal(true)}}><Settings size={16}/></button><button className="icon-btn danger" onClick={()=>remove(emp)}><Trash2 size={16}/></button></td>
      </tr>)}</tbody>
    </table></div>}</div>
    <EmployeeModal open={modal} editing={editing} departments={departments} designations={designations} onClose={()=>setModal(false)} onSaved={load}/>
  </>
}


function MasterDirectory(){
  const[departments,setDepartments]=useState([]),[designations,setDesignations]=useState([]),[depName,setDepName]=useState(''),[desName,setDesName]=useState(''),[err,setErr]=useState('');
  async function load(){try{const[d,g]=await Promise.all([api('/api/departments'),api('/api/designations')]);setDepartments(d.departments||[]);setDesignations(g.designations||[])}catch(e){setErr(e.message)}}
  useEffect(()=>{load()},[]);
  async function addDepartment(){if(!depName.trim())return;try{await api('/api/departments',{method:'POST',body:JSON.stringify({name_bn:depName.trim(),type:'department'})});setDepName('');load()}catch(e){setErr(e.message)}}
  async function addDesignation(){if(!desName.trim())return;try{await api('/api/designations',{method:'POST',body:JSON.stringify({name_bn:desName.trim()})});setDesName('');load()}catch(e){setErr(e.message)}}
  return <div><div className="page-head"><div><h2>Department & Designation</h2><p>Employee profile-এর জন্য master directory পরিচালনা করুন।</p></div></div>{err&&<div className="error">{err}</div>}
    <div className="split-grid"><section className="breakdown-card"><h3>Departments / Offices</h3><div className="inline-add"><input placeholder="নতুন Department/Office" value={depName} onChange={e=>setDepName(e.target.value)}/><button className="primary" onClick={addDepartment}><Plus size={15}/> Add</button></div>{departments.map(x=><div className="directory-row" key={x.id}><Building2 size={16}/><span>{x.name_bn||x.name_en}</span><small>{x.type||'department'}</small></div>)}</section>
    <section className="breakdown-card"><h3>Designations</h3><div className="inline-add"><input placeholder="নতুন Designation" value={desName} onChange={e=>setDesName(e.target.value)}/><button className="primary" onClick={addDesignation}><Plus size={15}/> Add</button></div>{designations.map(x=><div className="directory-row" key={x.id}><Briefcase size={16}/><span>{x.name_bn||x.name_en}</span><small>{x.grade?`Grade ${x.grade}`:'—'}</small></div>)}</section></div>
  </div>
}






function PersonalLeaveRecord({lang='bn'}){
  const en=lang==='en';
  const blank={leave_type:'casual',start_date:'',end_date:'',day_mode:'full',notes:''};
  const [items,setItems]=useState([]),[form,setForm]=useState(blank),[editing,setEditing]=useState(null),
    [busy,setBusy]=useState(false),[err,setErr]=useState(''),[msg,setMsg]=useState('');
  const labels=en?{
    casual:'Casual Leave',earned:'Earned Leave',medical:'Medical Leave',maternity:'Maternity Leave',
    paternity:'Paternity Leave',study:'Study Leave',special:'Special Leave',other:'Other'
  }:{
    casual:'নৈমিত্তিক ছুটি',earned:'অর্জিত ছুটি',medical:'চিকিৎসা ছুটি',maternity:'মাতৃত্বকালীন ছুটি',
    paternity:'পিতৃত্বকালীন ছুটি',study:'শিক্ষা ছুটি',special:'বিশেষ ছুটি',other:'অন্যান্য'
  };

  async function load(){
    setBusy(true);setErr('');
    try{const x=await api('/api/my-leave-records');setItems(x.items||[])}
    catch(e){setErr(e.message)}finally{setBusy(false)}
  }
  useEffect(()=>{load()},[]);

  function calcDays(start,end,mode='full'){
    if(!start||!end)return 0;
    const a=new Date(start+'T00:00:00'),b=new Date(end+'T00:00:00');
    if(isNaN(a)||isNaN(b)||b<a)return 0;
    const days=Math.floor((b-a)/86400000)+1;
    return mode==='half'?0.5:days;
  }
  const days=calcDays(form.start_date,form.end_date,form.day_mode);

  async function save(e){
    e.preventDefault();setErr('');setMsg('');
    if(!form.start_date||!form.end_date)return setErr(en?'Start and end dates are required.':'শুরুর ও শেষের তারিখ প্রয়োজন।');
    if(new Date(form.end_date)<new Date(form.start_date))return setErr(en?'End date cannot be earlier than start date.':'শেষের তারিখ শুরুর তারিখের আগে হতে পারে না।');
    setBusy(true);
    try{
      const payload={...form,total_days:days};
      if(editing)await api('/api/my-leave-records/'+editing.id,{method:'PUT',body:JSON.stringify(payload)});
      else await api('/api/my-leave-records',{method:'POST',body:JSON.stringify(payload)});
      setForm(blank);setEditing(null);setMsg(en?'Leave record saved.':'ছুটির রেকর্ড সংরক্ষণ হয়েছে।');await load();
    }catch(e){setErr(e.message)}finally{setBusy(false)}
  }
  function edit(x){
    setEditing(x);
    setForm({leave_type:x.leave_type,start_date:x.start_date,end_date:x.end_date,day_mode:x.day_mode||'full',notes:x.notes||''});
    window.scrollTo({top:0,behavior:'smooth'});
  }
  async function remove(id){
    if(!confirm(en?'Delete this leave record?':'এই ছুটির রেকর্ড মুছে ফেলবেন?'))return;
    try{await api('/api/my-leave-records/'+id,{method:'DELETE'});await load()}catch(e){alert(e.message)}
  }

  const thisYear=String(new Date().getFullYear());
  const yearItems=items.filter(x=>String(x.start_date||'').startsWith(thisYear));
  const yearDays=yearItems.reduce((s,x)=>s+Number(x.total_days||0),0);
  const typeTotals=Object.entries(yearItems.reduce((m,x)=>{m[x.leave_type]=(m[x.leave_type]||0)+Number(x.total_days||0);return m},{}))
    .map(([type,value])=>({type,label:labels[type]||type,value})).sort((a,b)=>b.value-a.value);
  const maxType=Math.max(1,...typeTotals.map(x=>x.value));

  return <div className="leave-page">
    <section className="leave-hero">
      <div><span>{en?'PERSONAL LEAVE RECORD':'ব্যক্তিগত ছুটির হিসাব'}</span><h2>{en?'My Leave Record':'আমার ছুটির হিসাব'}</h2><p>{en?'Keep your own leave history for personal planning. This is not an official leave approval or HR record.':'নিজের পরিকল্পনার জন্য ছুটির ইতিহাস সংরক্ষণ করুন। এটি অফিসিয়াল ছুটি অনুমোদন বা HR রেকর্ড নয়।'}</p></div>
      <div className="leave-chip"><CalendarDays size={17}/>{en?'Self-service only':'শুধু ব্যক্তিগত ব্যবহারের জন্য'}</div>
    </section>

    <section className="leave-summary-grid">
      <article><CalendarDays/><div><small>{en?'This Year Records':'চলতি বছরের রেকর্ড'}</small><b>{numLang(yearItems.length,lang,0)}</b><span>{thisYear}</span></div></article>
      <article><Clock3/><div><small>{en?'Recorded Leave Days':'রেকর্ডকৃত ছুটির দিন'}</small><b>{numLang(yearDays,lang,1)}</b><span>{en?'Personal total':'ব্যক্তিগত মোট'}</span></div></article>
      <article><PieChart/><div><small>{en?'Leave Types Used':'ব্যবহৃত ছুটির ধরন'}</small><b>{numLang(typeTotals.length,lang,0)}</b><span>{en?'This year':'চলতি বছর'}</span></div></article>
    </section>

    {err&&<div className="error">{err}</div>}{msg&&<div className="auth-success">{msg}</div>}

    <section className="leave-card">
      <div className="leave-head"><div><CalendarDays/><div><h3>{editing?(en?'Edit Leave Record':'ছুটির রেকর্ড সম্পাদনা'):(en?'Add Leave Record':'ছুটির রেকর্ড যোগ করুন')}</h3><p>{en?'Dates and total days are calculated automatically.':'তারিখ অনুযায়ী মোট দিন স্বয়ংক্রিয়ভাবে হিসাব হবে।'}</p></div></div>{editing&&<button className="secondary" onClick={()=>{setEditing(null);setForm(blank)}}>{en?'Cancel Edit':'সম্পাদনা বাতিল'}</button>}</div>
      <form className="form-grid" onSubmit={save}>
        <label>{en?'Leave type':'ছুটির ধরন'}<select value={form.leave_type} onChange={e=>setForm({...form,leave_type:e.target.value})}>{Object.entries(labels).map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label>
        <label>{en?'Day mode':'দিনের ধরন'}<select value={form.day_mode} onChange={e=>setForm({...form,day_mode:e.target.value})}><option value="full">{en?'Full day(s)':'পূর্ণ দিন'}</option><option value="half">{en?'Half day':'অর্ধদিবস'}</option></select></label>
        <label>{en?'Start date':'শুরুর তারিখ'}<input type="date" value={form.start_date} onChange={e=>setForm({...form,start_date:e.target.value})} required/></label>
        <label>{en?'End date':'শেষের তারিখ'}<input type="date" value={form.end_date} onChange={e=>setForm({...form,end_date:e.target.value})} required/></label>
        <label>{en?'Total days':'মোট দিন'}<input value={numLang(days,lang,1)} readOnly/></label>
        <label className="span-2">{en?'Personal note':'ব্যক্তিগত নোট'}<textarea rows="3" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}/></label>
        <div className="span-2"><button className="primary" disabled={busy}><Save size={16}/>{busy?(en?'Saving...':'সংরক্ষণ হচ্ছে...'):(editing?(en?'Update Record':'রেকর্ড আপডেট'):(en?'Save Record':'রেকর্ড সংরক্ষণ'))}</button></div>
      </form>
    </section>

    <section className="leave-grid">
      <article className="leave-card">
        <div className="leave-head"><div><BarChart3/><div><h3>{en?'Leave by Type':'ধরনভিত্তিক ছুটি'}</h3><p>{en?'Current year personal usage.':'চলতি বছরের ব্যক্তিগত হিসাব।'}</p></div></div></div>
        {typeTotals.length===0?<div className="empty">{en?'No leave data for this year.':'চলতি বছরে কোনো ছুটির রেকর্ড নেই।'}</div>:<div className="leave-bars">
          {typeTotals.map(x=><div key={x.type}><div className="leave-bar-label"><span>{x.label}</span><b>{numLang(x.value,lang,1)}</b></div><div className="leave-bar-track"><i style={{width:`${Math.max(5,(x.value/maxType)*100)}%`}}></i></div></div>)}
        </div>}
      </article>

      <article className="leave-card">
        <div className="leave-head"><div><History/><div><h3>{en?'Leave History':'ছুটির ইতিহাস'}</h3><p>{en?'Newest record first.':'সর্বশেষ রেকর্ড আগে।'}</p></div></div></div>
        {items.length===0?<div className="empty">{en?'No leave record yet.':'এখনো কোনো ছুটির রেকর্ড নেই।'}</div>:<div className="leave-history">
          {items.map(x=><div className="leave-history-row" key={x.id}>
            <div className="leave-history-icon"><CalendarDays/></div>
            <div><small>{fmtDateLang(x.start_date,lang)} → {fmtDateLang(x.end_date,lang)}</small><b>{labels[x.leave_type]||x.leave_type}</b><span>{numLang(x.total_days,lang,1)} {en?'day(s)':'দিন'}{x.notes?` · ${x.notes}`:''}</span></div>
            <div className="leave-actions"><button className="icon-btn" onClick={()=>edit(x)}><Edit3 size={15}/></button><button className="icon-btn danger" onClick={()=>remove(x.id)}><Trash2 size={15}/></button></div>
          </div>)}
        </div>}
      </article>
    </section>

    <section className="calculator-safety-note"><ShieldCheck/><div><b>{en?'Personal record only':'শুধু ব্যক্তিগত রেকর্ড'}</b><p>{en?'This module does not approve, reject or certify leave. Official leave records remain with the competent authority.':'এই মডিউল ছুটি অনুমোদন, প্রত্যাখ্যান বা প্রত্যয়ন করে না। অফিসিয়াল ছুটির রেকর্ড সংশ্লিষ্ট কর্তৃপক্ষের অধীন।'}</p></div></section>
  </div>
}

function PromotionCareerTimeline({lang='bn',onPage}){
  const en=lang==='en';
  const [career,setCareer]=useState({profile:null,education:[],events:[]}),[loading,setLoading]=useState(true),[err,setErr]=useState('');
  useEffect(()=>{api('/api/my-career').then(x=>setCareer({profile:x.profile||null,education:x.education||[],events:x.events||[]})).catch(e=>setErr(e.message)).finally(()=>setLoading(false))},[]);
  if(loading)return <div className="loading">{en?'Loading...':'লোড হচ্ছে...'}</div>;
  const p=career.profile||{},grade=Number(p.current_grade||0),rule=PROMO_RULES[String(grade)];
  const currentYears=p.current_post_joining_date?diffYMD(p.current_post_joining_date,todayLocalIso()):null;
  const priorYears=(p.first_joining_date&&p.current_post_joining_date)?diffYMD(p.first_joining_date,p.current_post_joining_date):null;
  const currentPoints=currentYears?currentYears.y+currentYears.m/12+currentYears.d/365:0;
  const priorPoints=priorYears?(priorYears.y+priorYears.m/12+priorYears.d/365)/3:0;
  const totalPoints=currentPoints+priorPoints;
  const latestEdu=(career.education||[])[0];
  const milestones=(career.events||[]).filter(x=>['promotion','grade_change','appointment','transfer'].includes(x.event_type)).slice(0,8);
  const status=!rule?(en?'No verified rule mapped for this grade':'এই গ্রেডের জন্য যাচাইকৃত নিয়ম ম্যাপ করা নেই'):
    rule.top?(en?'Highest mapped step':'প্রদর্শিত কাঠামোর সর্বোচ্চ ধাপ'):
    rule.noPromotion?(en?'No direct promotion in this route':'এই ধারায় সরাসরি পদোন্নতি নেই'):
    (en?'Promotion route available':'পদোন্নতির রুট রয়েছে');
  return <div className="promotion-timeline-page">
    <section className="promotion-timeline-hero">
      <div><span>{en?'PROMOTION & CAREER TIMELINE':'পদোন্নতি ও ক্যারিয়ার টাইমলাইন'}</span><h2>{en?'My Career Roadmap':'আমার ক্যারিয়ার রোডম্যাপ'}</h2><p>{en?'See your next career steps from your saved career information.':'আপনার সংরক্ষিত চাকরি তথ্য থেকে পরবর্তী ক্যারিয়ার ধাপগুলো দেখুন।'}</p></div>
      <div className="promotion-route-chip"><Route size={17}/>{status}</div>
    </section>

    {err&&<div className="error">{err}</div>}
    <section className="promotion-summary-grid">
      <article><Target/><div><small>{en?'Current Grade':'বর্তমান গ্রেড'}</small><b>{grade?`${en?'Grade':'গ্রেড'} ${numLang(grade,lang,0)}`:'—'}</b><span>{p.current_post||'—'}</span></div></article>
      <article><TrendingUp/><div><small>{en?'Target Grade':'টার্গেট গ্রেড'}</small><b>{rule?.targetGrade?`${en?'Grade':'গ্রেড'} ${numLang(rule.targetGrade,lang,0)}`:'—'}</b><span>{rule?.target||'—'}</span></div></article>
      <article><Clock3/><div><small>{en?'Current Post Service':'বর্তমান পদে চাকরিকাল'}</small><b>{currentYears?(en?`${currentYears.y}y ${currentYears.m}m`:`${numLang(currentYears.y,lang,0)} বছর ${numLang(currentYears.m,lang,0)} মাস`):'—'}</b><span>{p.current_post_joining_date?fmtDateLang(p.current_post_joining_date,lang):'—'}</span></div></article>
      <article><Award/><div><small>{en?'Estimated Service Points':'আনুমানিক সার্ভিস পয়েন্ট'}</small><b>{numLang(totalPoints,lang,2)}</b><span>{en?'Current + immediate prior service':'বর্তমান + অব্যবহিত পূর্ব সেবা'}</span></div></article>
    </section>

    <section className="promotion-roadmap-grid">
      <article className="promotion-roadmap-card">
        <div className="promotion-roadmap-head"><Flag/><div><h3>{en?'Promotion Route':'পদোন্নতি রুট'}</h3><p>{en?'Based on the current promotion rules.':'বর্তমান পদোন্নতি নিয়ম অনুযায়ী।'}</p></div></div>
        {!rule?<div className="empty">{en?'No route available for this grade yet.':'এই গ্রেডের জন্য এখনো কোনো রুট পাওয়া যায়নি।'}</div>:
        <div className="promotion-route-box">
          <div><small>{en?'From':'বর্তমান'}</small><b>{grade?`${en?'Grade':'গ্রেড'} ${numLang(grade,lang,0)}`:'—'}</b></div><ArrowRight/>
          <div><small>{en?'To':'পরবর্তী'}</small><b>{rule.targetGrade?`${en?'Grade':'গ্রেড'} ${numLang(rule.targetGrade,lang,0)}`:rule.target}</b></div>
        </div>}
        {rule?.ref&&<div className="notice"><b>{en?'Reference:':'রেফারেন্স:'}</b> {rule.ref}</div>}
        <button className="primary" onClick={()=>onPage?.('promotion')}><TrendingUp size={16}/>{en?'Open Full Promotion Calculator':'পূর্ণ পদোন্নতি হিসাব খুলুন'}</button>
      </article>

      <article className="promotion-roadmap-card">
        <div className="promotion-roadmap-head"><GraduationCap/><div><h3>{en?'Education Context':'শিক্ষাগত প্রেক্ষাপট'}</h3><p>{en?'Saved education records used for your own reference.':'নিজের রেফারেন্সের জন্য সংরক্ষিত শিক্ষাগত তথ্য।'}</p></div></div>
        {latestEdu?<div className="education-highlight"><GraduationCap/><div><b>{latestEdu.level}</b><span>{[latestEdu.subject,latestEdu.institution,latestEdu.passing_year].filter(Boolean).join(' · ')}</span></div></div>:<div className="empty">{en?'No education record saved yet.':'এখনো শিক্ষাগত রেকর্ড সংরক্ষিত নেই।'}</div>}
        <button className="ghost-btn" onClick={()=>onPage?.('career')}>{en?'Update My Career':'আমার চাকরি আপডেট'}<ChevronRight size={15}/></button>
      </article>
    </section>

    <section className="promotion-roadmap-card">
      <div className="promotion-roadmap-head"><Milestone/><div><h3>{en?'Career Milestones':'ক্যারিয়ার মাইলস্টোন'}</h3><p>{en?'Recent career events from your personal record.':'আপনার ব্যক্তিগত রেকর্ডের সাম্প্রতিক ক্যারিয়ার ইভেন্ট।'}</p></div></div>
      {milestones.length===0?<div className="empty">{en?'No milestone record yet.':'এখনো কোনো মাইলস্টোন রেকর্ড নেই।'}</div>:<div className="promotion-milestone-list">
        {milestones.map(x=><div key={x.id} className="promotion-milestone-row"><div className="promotion-milestone-dot"></div><div><small>{fmtDateLang(x.event_date,lang)}</small><b>{x.title}</b><span>{[x.post_name,x.grade?`${en?'Grade':'গ্রেড'} ${x.grade}`:'',x.office_name].filter(Boolean).join(' · ')}</span></div></div>)}
      </div>}
    </section>

    <section className="calculator-safety-note"><ShieldCheck/><div><b>{en?'Estimate only':'শুধু সহায়ক অনুমান'}</b><p>{en?'Eligibility and timeline information here supports personal planning only. Official promotion decisions remain with the competent authority.':'এখানকার যোগ্যতা ও টাইমলাইন তথ্য শুধুই ব্যক্তিগত পরিকল্পনার সহায়তা। অফিসিয়াল পদোন্নতির সিদ্ধান্ত সংশ্লিষ্ট কর্তৃপক্ষের।'}</p></div></section>
  </div>
}

function SalaryHistory({lang='bn'}){
  const en=lang==='en';
  const blank={effective_date:'',grade:'13',stage_2015:'0',basic_2015:'',fixed_2026:'',payable_basic:'',gross_salary:'',total_deduction:'',net_salary:'',source:'manual',notes:''};
  const [items,setItems]=useState([]),[form,setForm]=useState(blank),[busy,setBusy]=useState(false),[err,setErr]=useState(''),[msg,setMsg]=useState('');
  const stages=PAY2015[form.grade]||[];
  useEffect(()=>{load()},[]);
  async function load(){setBusy(true);setErr('');try{const x=await api('/api/my-salary-history');setItems(x.items||[])}catch(e){setErr(e.message)}finally{setBusy(false)}}
  useEffect(()=>{
    const current=stages[Math.min(Math.max(0,Number(form.stage_2015||0)),Math.max(0,stages.length-1))]||0;
    const fixed=fixed2026(Number(form.grade),current);
    setForm(x=>({...x,basic_2015:String(current||''),fixed_2026:String(fixed||'')}));
  },[form.grade,form.stage_2015]);

  async function save(e){
    e.preventDefault();setErr('');setMsg('');
    if(!form.effective_date)return setErr(en?'Effective date is required.':'কার্যকর তারিখ প্রয়োজন।');
    setBusy(true);
    try{
      await api('/api/my-salary-history',{method:'POST',body:JSON.stringify({
        ...form,
        grade:Number(form.grade),
        stage_2015:Number(form.stage_2015),
        basic_2015:Number(form.basic_2015||0),
        fixed_2026:Number(form.fixed_2026||0),
        payable_basic:Number(form.payable_basic||0),
        gross_salary:Number(form.gross_salary||0),
        total_deduction:Number(form.total_deduction||0),
        net_salary:Number(form.net_salary||0)
      })});
      setForm(blank);setMsg(en?'Salary history saved.':'বেতন ইতিহাস সংরক্ষণ হয়েছে।');await load();
    }catch(e){setErr(e.message)}finally{setBusy(false)}
  }
  async function remove(id){
    if(!confirm(en?'Delete this salary history record?':'এই বেতন ইতিহাস মুছে ফেলবেন?'))return;
    try{await api('/api/my-salary-history/'+id,{method:'DELETE'});await load()}catch(e){alert(e.message)}
  }
  const amt=v=>`${en?'Tk':'৳'} ${moneyLang(v,lang)}`;
  return <div className="salary-history-page">
    <section className="salary-history-hero">
      <div><span>{en?'PERSONAL SALARY & PAY HISTORY':'ব্যক্তিগত বেতন ও পে-ইতিহাস'}</span><h2>{en?'My Salary History':'আমার বেতন ইতিহাস'}</h2><p>{en?'Keep your salary history and compare previous records easily.':'নিজের বেতন ইতিহাস সংরক্ষণ করুন এবং আগের রেকর্ড সহজে তুলনা করুন।'}</p></div>
      <div className="salary-history-chip"><ReceiptText size={17}/>{en?'Personal record':'ব্যক্তিগত রেকর্ড'}</div>
    </section>

    {err&&<div className="error">{err}</div>}{msg&&<div className="auth-success">{msg}</div>}

    <section className="salary-history-card">
      <div className="salary-history-head"><div><WalletCards/><div><h3>{en?'Add salary snapshot':'বেতন স্ন্যাপশট যোগ করুন'}</h3><p>{en?'Store a point-in-time salary record for your own reference.':'নিজের রেফারেন্সের জন্য একটি নির্দিষ্ট সময়ের বেতন রেকর্ড সংরক্ষণ করুন।'}</p></div></div></div>
      <form className="form-grid" onSubmit={save}>
        <label>{en?'Effective date':'কার্যকর তারিখ'}<input type="date" value={form.effective_date} onChange={e=>setForm({...form,effective_date:e.target.value})} required/></label>
        <label>{en?'Grade':'গ্রেড'}<select value={form.grade} onChange={e=>setForm({...form,grade:e.target.value,stage_2015:'0'})}>{Array.from({length:20},(_,i)=>i+1).map(g=><option key={g} value={g}>{en?`Grade ${g}`:`গ্রেড ${g.toLocaleString('bn-BD')}`}</option>)}</select></label>
        <label>{en?'2015 pay stage':'২০১৫ বেতন ধাপ'}<select value={form.stage_2015} onChange={e=>setForm({...form,stage_2015:e.target.value})}>{stages.map((v,i)=><option key={i} value={i}>{en?`Stage ${i+1} — Tk ${moneyLang(v,'en')}`:`ধাপ ${(i+1).toLocaleString('bn-BD')} — ৳${moneyLang(v,'bn')}`}</option>)}</select></label>
        <label>{en?'2015 basic':'২০১৫ মূল বেতন'}<input type="number" value={form.basic_2015} readOnly/></label>
        <label>{en?'2026 full fixed basic':'২০২৬ পূর্ণ নির্ধারিত মূল বেতন'}<input type="number" value={form.fixed_2026} readOnly/></label>
        <label>{en?'Payable basic':'প্রাপ্য মূল বেতন'}<input type="number" min="0" value={form.payable_basic} onChange={e=>setForm({...form,payable_basic:e.target.value})}/></label>
        <label>{en?'Gross salary':'মোট প্রাপ্য'}<input type="number" min="0" value={form.gross_salary} onChange={e=>setForm({...form,gross_salary:e.target.value})}/></label>
        <label>{en?'Total deduction':'মোট কর্তন'}<input type="number" min="0" value={form.total_deduction} onChange={e=>setForm({...form,total_deduction:e.target.value})}/></label>
        <label>{en?'Net salary':'নিট বেতন'}<input type="number" min="0" value={form.net_salary} onChange={e=>setForm({...form,net_salary:e.target.value})}/></label>
        <label className="span-2">{en?'Personal notes':'ব্যক্তিগত নোট'}<textarea rows="3" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}/></label>
        <div className="span-2"><button className="primary" disabled={busy}><Save size={16}/>{busy?(en?'Saving...':'সংরক্ষণ হচ্ছে...'):(en?'Save Salary Snapshot':'বেতন স্ন্যাপশট সংরক্ষণ')}</button></div>
      </form>
    </section>

    <section className="salary-history-card">
      <div className="salary-history-head"><div><ChartNoAxesCombined/><div><h3>{en?'Salary Timeline':'বেতন টাইমলাইন'}</h3><p>{en?'Your saved salary records, newest first.':'আপনার সংরক্ষিত বেতন রেকর্ড, সর্বশেষটি আগে।'}</p></div></div></div>
      {items.length===0?<div className="empty">{en?'No salary history yet.':'এখনো বেতন ইতিহাস নেই।'}</div>:<div className="salary-history-list">{items.map(x=><article key={x.id} className="salary-history-row">
        <div className="salary-history-date"><CalendarDays/><div><b>{fmtDateLang(x.effective_date,lang)}</b><small>{en?`Grade ${x.grade} · Stage ${Number(x.stage_2015)+1}`:`গ্রেড ${numLang(x.grade,lang,0)} · ধাপ ${numLang(Number(x.stage_2015)+1,lang,0)}`}</small></div></div>
        <div className="salary-history-amounts"><span><small>{en?'Payable basic':'প্রাপ্য মূল বেতন'}</small><b>{amt(x.payable_basic)}</b></span><span><small>{en?'Gross':'মোট'}</small><b>{amt(x.gross_salary)}</b></span><span><small>{en?'Net':'নিট'}</small><b>{amt(x.net_salary)}</b></span></div>
        <button className="icon-btn danger" onClick={()=>remove(x.id)}><Trash2 size={15}/></button>
      </article>)}</div>}
    </section>

    
  </div>
}


const EDUCATION_POINT_RULES={
  ssc:{bn:'এস.এস.সি',en:'SSC',points:{first:3,second:2,third:1}},
  hsc:{bn:'এইচ.এস.সি',en:'HSC',points:{first:3,second:2,third:1}},
  bachelor:{bn:'স্নাতক পাশ',en:"Bachelor's Pass",points:{first:3,second:2,third:1}},
  honours:{bn:'স্নাতক সম্মান',en:"Bachelor's Honours",points:{first:4,second:3,third:2}},
  masters:{bn:'স্নাতকোত্তর',en:"Master's",points:{first:3,second:2,third:1}}
};

function PointsCalculator({lang='bn',publicMode=false}){
  const en=lang==='en';
  const today=todayLocalIso();
  const [tab,setTab]=useState('service');
  const [service,setService]=useState({firstJoin:'',currentPostStart:'',asOf:today});
  const [serviceResult,setServiceResult]=useState(null);
  const [edu,setEdu]=useState({
    ssc:'',hsc:'',graduationType:'honours',graduationResult:'',masters:''
  });

  useEffect(()=>{
    const gp=guestLocalProfile();
    if(gp.first_joining_date||gp.current_post_joining_date){
      setService(v=>({...v,firstJoin:gp.first_joining_date||v.firstJoin,currentPostStart:gp.current_post_joining_date||v.currentPostStart,asOf:todayLocalIso()}));
    }
    if(publicMode)return;
    api('/api/my-career').then(x=>{
      const p=x.profile||{};
      setService(v=>({
        ...v,
        firstJoin:p.first_joining_date||v.firstJoin,
        currentPostStart:p.current_post_start_date||p.current_post_joining_date||v.currentPostStart,
        asOf:todayLocalIso()
      }));
    }).catch(()=>{});
  },[]);

  const classOptions=[
    ['',en?'Select result':'ফলাফল নির্বাচন করুন'],
    ['first',en?'1st Division / Class':'১ম বিভাগ / শ্রেণি'],
    ['second',en?'2nd Division / Class':'২য় বিভাগ / শ্রেণি'],
    ['third',en?'3rd Division / Class / Equivalent':'৩য় বিভাগ / শ্রেণি / সমমান']
  ];

  function calcServicePoints(){
    const asOf=todayLocalIso();
    setService(v=>({...v,asOf}));
    if(!service.firstJoin||!service.currentPostStart){
      return setServiceResult({error:en?'Enter the first joining date and current-post joining date.':'প্রথম যোগদানের তারিখ ও বর্তমান পদে যোগদানের তারিখ দিন।'});
    }
    const first=new Date(service.firstJoin+'T00:00:00');
    const current=new Date(service.currentPostStart+'T00:00:00');
    const now=new Date(asOf+'T00:00:00');
    if(Number.isNaN(first.getTime())||Number.isNaN(current.getTime())||first>current||current>now){
      return setServiceResult({error:en?'Check the dates and enter them in chronological order.':'তারিখগুলো যাচাই করে সঠিক ক্রমে দিন।'});
    }
    const exp=serviceExperiencePoints({
      currentPostStart:service.currentPostStart,
      firstJoin:service.firstJoin,
      asOf
    });
    if(!exp?.valid){
      return setServiceResult({error:en?'Service points could not be calculated from these dates.':'এই তারিখগুলো থেকে সার্ভিস পয়েন্ট হিসাব করা যায়নি।'});
    }
    setServiceResult({...exp,asOf});
  }

  const eduRows=useMemo(()=>{
    const rows=[];
    const add=(key,result)=>{
      if(!result)return;
      const rule=EDUCATION_POINT_RULES[key];
      rows.push({key,label:en?rule.en:rule.bn,result,points:rule.points[result]||0});
    };
    add('ssc',edu.ssc);
    add('hsc',edu.hsc);
    add(edu.graduationType==='bachelor'?'bachelor':'honours',edu.graduationResult);
    add('masters',edu.masters);
    return rows;
  },[edu,lang]);

  const educationTotal=eduRows.reduce((s,x)=>s+x.points,0);
  const resultLabel=v=>en?({first:'1st Division / Class',second:'2nd Division / Class',third:'3rd Division / Class / Equivalent'}[v]||'—'):({first:'১ম বিভাগ / শ্রেণি',second:'২য় বিভাগ / শ্রেণি',third:'৩য় বিভাগ / শ্রেণি / সমমান'}[v]||'—');

  const servicePoints=serviceResult&&!serviceResult.error?Number(serviceResult.points||0):null;

  return <div className="points-center">
    <section className="points-hero">
      <div>
        <span>{en?'POINTS CALCULATOR':'পয়েন্ট ক্যালকুলেটর'}</span>
        <h2>{en?'All applicable points in one place':'সব প্রযোজ্য পয়েন্ট এক জায়গায়'}</h2>
        <p>{en?'View service points, education-qualification points and house-allocation points from one organized center.':'সার্ভিস পয়েন্ট, শিক্ষাগত যোগ্যতার পয়েন্ট এবং বাসা বরাদ্দের পয়েন্ট একটি সাজানো কেন্দ্র থেকে দেখুন।'}</p>
      </div>
      <div className="points-policy-chip"><ShieldCheck size={16}/>{en?'Rule-based calculation':'নীতিমালাভিত্তিক হিসাব'}</div>
    </section>

    <section className="points-summary-grid">
      <article className="points-summary-card">
        <div className="points-summary-icon"><Briefcase/></div>
        <div><small>{en?'Service Points':'সার্ভিস পয়েন্ট'}</small><b>{servicePoints===null?'—':numLang(servicePoints,lang)}</b><span>{en?'Current + previous service':'বর্তমান + পূর্ববর্তী চাকরিকাল'}</span></div>
      </article>
      <article className="points-summary-card">
        <div className="points-summary-icon"><GraduationCap/></div>
        <div><small>{en?'Education Points':'শিক্ষাগত যোগ্যতার পয়েন্ট'}</small><b>{numLang(educationTotal,lang,0)}</b><span>{en?'Based on selected qualifications':'নির্বাচিত যোগ্যতা ও ফলাফল অনুযায়ী'}</span></div>
      </article>
      <article className="points-summary-card">
        <div className="points-summary-icon"><Home/></div>
        <div><small>{en?'House Allocation Points':'বাসা বরাদ্দ পয়েন্ট'}</small><b>{en?'AUTO':'অটো'}</b><span>{en?'3rd Class General Employee is active':'৩য় শ্রেণির সাধারণ কর্মচারীর হিসাব সক্রিয়'}</span></div>
      </article>
    </section>

    <div className="points-tabs">
      <button className={tab==='service'?'active':''} onClick={()=>setTab('service')}><Briefcase/>{en?'Service Points':'সার্ভিস পয়েন্ট'}</button>
      <button className={tab==='education'?'active':''} onClick={()=>setTab('education')}><GraduationCap/>{en?'Education Points':'শিক্ষাগত যোগ্যতার পয়েন্ট'}</button>
      <button className={tab==='house'?'active':''} onClick={()=>setTab('house')}><Home/>{en?'House Allocation Points':'বাসা বরাদ্দ পয়েন্ট'}</button>
    </div>

    {tab==='service'&&<section className="points-panel">
      <div className="points-panel-head"><div className="points-panel-icon"><Briefcase/></div><div><h3>{en?'Service Points':'সার্ভিস পয়েন্ট'}</h3><p>{en?'Current post service and previous service are calculated separately under the existing service-point rule.':'বর্তমান পদে চাকরিকাল এবং পূর্ববর্তী চাকরিকাল বিদ্যমান সার্ভিস-পয়েন্ট নিয়ম অনুযায়ী আলাদাভাবে হিসাব করা হবে।'}</p></div></div>
      <div className="form-grid points-form-grid">
        <DMY label={en?'First joining date':'প্রথম যোগদানের তারিখ'} value={service.firstJoin} onChange={v=>setService(x=>({...x,firstJoin:v}))}/>
        <DMY label={en?'Current post joining date':'বর্তমান পদে যোগদানের তারিখ'} value={service.currentPostStart} onChange={v=>setService(x=>({...x,currentPostStart:v}))}/>
      </div>
      <div className="notice"><b>{en?'Calculation date:':'হিসাবের তারিখ:'}</b> {fmtDateLang(today,lang)} — {en?'taken automatically.':'স্বয়ংক্রিয়ভাবে নেওয়া হয়েছে।'}</div>
      <button className="primary points-calc-btn" onClick={calcServicePoints}><Calculator size={17}/>{en?'Calculate Service Points':'সার্ভিস পয়েন্ট হিসাব করুন'}</button>
      {serviceResult?.error&&<div className="points-inline-error"><AlertTriangle size={16}/>{serviceResult.error}</div>}
      {serviceResult&&!serviceResult.error&&<div className="points-result-grid">
        <div><small>{en?'Current post points':'বর্তমান পদের পয়েন্ট'}</small><b>{numLang(serviceResult.currentPoints||0,lang)}</b></div>
        <div><small>{en?'Previous service points':'পূর্ববর্তী চাকরিকালের পয়েন্ট'}</small><b>{numLang(serviceResult.priorServicePoints||0,lang)}</b></div>
        <div className="strong"><small>{en?'Total service points':'মোট সার্ভিস পয়েন্ট'}</small><b>{numLang(serviceResult.points||0,lang)}</b></div>
      </div>}
      <div className="points-rule-note"><BookOpen size={17}/><div><b>{en?'Existing service-point rule':'বিদ্যমান সার্ভিস-পয়েন্ট নিয়ম'}</b><p>{en?'Current post: 1 year = 1 point. Previous service: every 3 years = 1 point. The older 1/5 rule is not applied after 31 December 2025.':'বর্তমান পদে প্রতি ১ বছর = ১ পয়েন্ট। পূর্ববর্তী চাকরিকালের প্রতি ৩ বছর = ১ পয়েন্ট। ৩১ ডিসেম্বর ২০২৫-এর পর পুরোনো ১/৫ নিয়ম প্রয়োগ করা হয় না।'}</p></div></div>
    </section>}

    {tab==='education'&&<section className="points-panel">
      <div className="points-panel-head"><div className="points-panel-icon"><GraduationCap/></div><div><h3>{en?'Education Qualification Points':'শিক্ষাগত যোগ্যতার পয়েন্ট'}</h3><p>{en?'Select the result for each applicable examination to calculate education points.':'প্রযোজ্য প্রতিটি পরীক্ষার ফলাফল নির্বাচন করুন। ফলাফল অনুযায়ী শিক্ষাগত যোগ্যতার পয়েন্ট দেখাবে।'}</p></div></div>

      <div className="education-point-form">
        <label>{en?'SSC result':'এস.এস.সি ফলাফল'}<select value={edu.ssc} onChange={e=>setEdu(x=>({...x,ssc:e.target.value}))}>{classOptions.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label>
        <label>{en?'HSC result':'এইচ.এস.সি ফলাফল'}<select value={edu.hsc} onChange={e=>setEdu(x=>({...x,hsc:e.target.value}))}>{classOptions.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label>
        <label>{en?'Graduation type':'স্নাতকের ধরন'}<select value={edu.graduationType} onChange={e=>setEdu(x=>({...x,graduationType:e.target.value,graduationResult:''}))}><option value="bachelor">{en?"Bachelor's Pass":'স্নাতক পাশ'}</option><option value="honours">{en?"Bachelor's Honours":'স্নাতক সম্মান'}</option></select></label>
        <label>{en?'Graduation result':'স্নাতক ফলাফল'}<select value={edu.graduationResult} onChange={e=>setEdu(x=>({...x,graduationResult:e.target.value}))}>{classOptions.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label>
        <label>{en?"Master's result (if applicable)":'স্নাতকোত্তর ফলাফল (প্রযোজ্য হলে)'}<select value={edu.masters} onChange={e=>setEdu(x=>({...x,masters:e.target.value}))}>{classOptions.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label>
      </div>

      <div className="education-table-wrap">
        <table className="education-point-table">
          <thead><tr><th>{en?'Qualification':'যোগ্যতা'}</th><th>{en?'Selected result':'নির্বাচিত ফলাফল'}</th><th>{en?'Points':'পয়েন্ট'}</th></tr></thead>
          <tbody>
            {eduRows.length?eduRows.map(r=><tr key={r.key}><td>{r.label}</td><td>{resultLabel(r.result)}</td><td><b>{numLang(r.points,lang,0)}</b></td></tr>):<tr><td colSpan="3" className="empty-row">{en?'Select results above to calculate education points.':'শিক্ষাগত পয়েন্ট দেখতে উপরে ফলাফল নির্বাচন করুন।'}</td></tr>}
          </tbody>
          <tfoot><tr><td colSpan="2">{en?'Total education points':'মোট শিক্ষাগত যোগ্যতার পয়েন্ট'}</td><td><b>{numLang(educationTotal,lang,0)}</b></td></tr></tfoot>
        </table>
      </div>

      <div className="education-rule-grid">
        {Object.entries(EDUCATION_POINT_RULES).map(([key,r])=><article key={key}><b>{en?r.en:r.bn}</b><span>{en?'1st':'১ম'}: {r.points.first} · {en?'2nd':'২য়'}: {r.points.second} · {en?'3rd':'৩য়'}: {r.points.third}</span></article>)}
      </div>

      <div className="points-rule-note caution"><AlertTriangle size={17}/><div><b>{en?'Advanced degrees':'উচ্চতর ডিগ্রি'}</b><p>{en?'Additional higher-degree points will be added soon.':'এম.ফিল/পিএইচডি ও অন্যান্য উচ্চতর ডিগ্রির অতিরিক্ত পয়েন্ট শীঘ্রই যোগ হবে।'}</p></div></div>
    </section>}

    {tab==='house'&&<HouseAllocationPoints lang={lang}/>}
  </div>
}



function HouseAllocationPoints({lang='bn',publicMode=false}){
  const en=lang==='en';
  const [kind,setKind]=useState('third_general');
  const [preview,setPreview]=useState(false);
  const [form,setForm]=useState({
    firstJoin:'',
    thirdClassStart:'',
    calcDate:todayLocalIso(),
    basicSalary:'',
    previousPromotions:'0',
    marital:'married',
    gender:'male'
  });

  const groups=[
    {id:'third_general',icon:Users,bn:'৩য় শ্রেণির সাধারণ কর্মচারী',en:'3rd Class General Employee',ready:true,subBn:'অটোমেটিক হিসাব সক্রিয়',subEn:'Automatic calculation active'},
    {id:'third_technical',icon:Settings,bn:'৩য় শ্রেণির কারিগরি কর্মচারী',en:'3rd Class Technical Employee',ready:false,subBn:'নীতিমালা যাচাই ও সংযোজনাধীন',subEn:'Rules under verification'},
    {id:'fourth_general',icon:Users,bn:'৪র্থ শ্রেণির সাধারণ কর্মচারী',en:'4th Class General Employee',ready:false,subBn:'নীতিমালা যাচাই ও সংযোজনাধীন',subEn:'Rules under verification'},
    {id:'fourth_technical',icon:Settings,bn:'৪র্থ শ্রেণির কারিগরি কর্মচারী',en:'4th Class Technical Employee',ready:false,subBn:'নীতিমালা যাচাই ও সংযোজনাধীন',subEn:'Rules under verification'},
    {id:'officer',icon:Briefcase,bn:'কর্মকর্তা',en:'Officer',ready:false,subBn:'নীতিমালা যাচাই ও সংযোজনাধীন',subEn:'Rules under verification'},
    {id:'teacher',icon:GraduationCap,bn:'শিক্ষক',en:'Teacher',ready:false,subBn:'নীতিমালা যাচাই ও সংযোজনাধীন',subEn:'Rules under verification'}
  ];
  const current=groups.find(x=>x.id===kind)||groups[0];

  useEffect(()=>{
    const gp=guestLocalProfile();
    const localFirst=gp.first_joining_date||'';
    if(localFirst||gp.third_class_start_date||gp.previous_promotions||gp.marital_status||gp.gender){
      setForm(v=>({...v,
        firstJoin:v.firstJoin||localFirst,
        thirdClassStart:v.thirdClassStart||gp.third_class_start_date||localFirst,
        previousPromotions:String(gp.previous_promotions??v.previousPromotions??0),
        marital:gp.marital_status||v.marital,
        gender:gp.gender||v.gender
      }));
    }
    if(publicMode)return;
    api('/api/my-career').then(x=>{
      const p=x?.profile||{};
      const first=p.first_joining_date||p.first_join_date||'';
      setForm(v=>({...v,
        firstJoin:v.firstJoin||first,
        thirdClassStart:v.thirdClassStart||p.third_class_start_date||first,
        basicSalary:v.basicSalary||p.current_basic_salary||'',
        previousPromotions:String(p.previous_promotions??v.previousPromotions??0),
        marital:p.marital_status||v.marital,
        gender:p.gender||v.gender
      }));
    }).catch(()=>{});
  },[publicMode]);

  function ymdDiff(start,end){
    if(!start||!end)return null;
    const [sy,sm,sd]=String(start).split('-').map(Number);
    const [ey,em,ed]=String(end).split('-').map(Number);
    if(!sy||!sm||!sd||!ey||!em||!ed)return null;
    const a=new Date(Date.UTC(sy,sm-1,sd)),b=new Date(Date.UTC(ey,em-1,ed));
    if(b<a)return null;
    let y=ey-sy,m=em-sm,d=ed-sd;
    if(d<0){
      m-=1;
      const daysPrevMonth=new Date(Date.UTC(ey,em-1,0)).getUTCDate();
      d+=daysPrevMonth;
    }
    if(m<0){y-=1;m+=12}
    return {y,m,d};
  }
  const zero={y:0,m:0,d:0};
  const fmtYmd=x=>x?`${numLang(x.y,lang,0)}-${String(x.m).padStart(2,'0').replace(/[0-9]/g,c=>lang==='bn'?'০১২৩৪৫৬৭৮৯'[+c]:c)}-${String(x.d).padStart(2,'0').replace(/[0-9]/g,c=>lang==='bn'?'০১২৩৪৫৬৭৮৯'[+c]:c)}`:'—';

  const first=form.firstJoin;
  const third=form.thirdClassStart||form.firstJoin;
  const calc=form.calcDate||todayLocalIso();
  const validDates=!!first&&!!third&&!!calc&&new Date(first+'T00:00:00')<=new Date(third+'T00:00:00')&&new Date(third+'T00:00:00')<=new Date(calc+'T00:00:00');

  const fourthService=validDates&&first!==third?(ymdDiff(first,third)||zero):zero;
  const thirdService=validDates?(ymdDiff(third,calc)||zero):null;
  const totalService=validDates?(ymdDiff(first,calc)||zero):null;

  const basic=Number(form.basicSalary)||0;
  const basicPoint=basic>0?basic/100:0;
  const priorPromotionCount=Math.max(0,Math.floor(Number(form.previousPromotions)||0));
  const designationPoint=1+priorPromotionCount;
  const maritalPoint=form.marital==='married'?3:0;
  const genderPoint=form.gender==='female'?3:0;

  // House-allocation total uses whole numeric points plus the month/day remainder
  // from service. This matches the observed screen: 7-03-29 + 155 + 2 + 3 + 0 = 167-03-29.
  const fixedNumericPoints=basicPoint+designationPoint+maritalPoint+genderPoint;
  const totalPoint=totalService?{
    y:totalService.y+fixedNumericPoints,
    m:totalService.m,
    d:totalService.d
  }:null;
  const houseResult=totalPoint?{categoryLabel:en?current.en:current.bn,input:{...form},basic,basicPoint,designationPoint,maritalPoint,genderPoint,thirdService,fourthService,totalService,totalPoint}:null;
  const houseReport=houseResult?houseAllocationReportHtml(houseResult,lang):'';
  const houseFilename=en?`house-allocation-points-${Date.now()}.pdf`:`basha-boraddo-points-${Date.now()}.pdf`;

  return <section className={`points-panel house-allocation-module ${publicMode?'public-house-allocation':''}`}>
    <div className="points-panel-head">
      <div className="points-panel-icon"><Home/></div>
      <div>
        <h3>{en?'House Allocation Points':'বাসা বরাদ্দ পয়েন্ট'}</h3>
        <p>{en?'Choose the applicable employee category. Automatic calculation is currently available for 3rd Class General Employees.':'প্রযোজ্য কর্মচারীর শ্রেণি নির্বাচন করুন। বর্তমানে ৩য় শ্রেণির সাধারণ কর্মচারীর অটোমেটিক হিসাব চালু আছে।'}</p>
      </div>
    </div>

    <div className="house-category-grid">
      {groups.map(g=>{
        const Icon=g.icon;
        return <button key={g.id} className={`house-category-card ${kind===g.id?'active':''} ${g.ready?'ready':'pending'}`} onClick={()=>setKind(g.id)}>
          <div className="house-cat-icon"><Icon/></div>
          <div><b>{en?g.en:g.bn}</b><small>{en?g.subEn:g.subBn}</small></div>
          <span className={`house-status ${g.ready?'ready':'pending'}`}>{g.ready?(en?'Active':'সক্রিয়'):(en?'Coming Soon':'শীঘ্রই আসছে')}</span>
        </button>
      })}
    </div>

    {current.ready?<div className="house-active-panel auto-house-panel">
      <div className="house-active-head">
        <div>
          <span>{en?'AUTOMATIC RULE SET':'অটোমেটিক নিয়ম'}</span>
          <h4>{en?current.en:current.bn}</h4>
          <p>{en?'Enter the employee information below. Service, basic-salary, designation, marital-status and gender points will be calculated automatically.':'নিচে কর্মচারীর তথ্য দিন। চাকরিকাল, মূল বেতন, পদবি, বৈবাহিক অবস্থা ও লিঙ্গভিত্তিক পয়েন্ট স্বয়ংক্রিয়ভাবে হিসাব হবে।'}</p>
        </div>
        <div className="house-active-badge"><ShieldCheck/>{en?'Auto calculation':'অটো হিসাব'}</div>
      </div>

      <div className="house-auto-form">
        <DMY label={en?'First joining date':'প্রথম যোগদানের তারিখ'} value={form.firstJoin} onChange={v=>setForm(x=>({...x,firstJoin:v}))}/>
        <DMY label={en?'Entered 3rd Class on':'৩য় শ্রেণিতে প্রবেশের তারিখ'} value={form.thirdClassStart} onChange={v=>setForm(x=>({...x,thirdClassStart:v}))}/>
        <DMY label={en?'Point calculation date':'পয়েন্ট হিসাবের তারিখ'} value={form.calcDate} onChange={v=>setForm(x=>({...x,calcDate:v}))}/>
        <label>{en?'Current basic salary':'বর্তমান মূল বেতন'}<input type="number" min="0" step="100" value={form.basicSalary} onChange={e=>setForm(x=>({...x,basicSalary:e.target.value}))} placeholder={en?'e.g. 15500':'যেমন ১৫৫০০'}/></label>
        <label>{en?'Previous promotions received':'আগে পাওয়া পদোন্নতির সংখ্যা'}<input type="number" min="0" step="1" value={form.previousPromotions} onChange={e=>setForm(x=>({...x,previousPromotions:e.target.value}))}/></label>
        <label>{en?'Marital status':'বৈবাহিক অবস্থা'}<select value={form.marital} onChange={e=>setForm(x=>({...x,marital:e.target.value}))}><option value="married">{en?'Married':'বিবাহিত'}</option><option value="unmarried">{en?'Unmarried':'অবিবাহিত'}</option></select></label>
        <label>{en?'Gender':'লিঙ্গ'}<select value={form.gender} onChange={e=>setForm(x=>({...x,gender:e.target.value}))}><option value="male">{en?'Male':'পুরুষ'}</option><option value="female">{en?'Female':'নারী'}</option></select></label>
      </div>

      {!validDates&&<div className="house-date-help"><AlertTriangle/>{en?'Enter valid service dates in order: first joining ≤ 3rd Class entry ≤ calculation date. If the employee joined directly in 3rd Class, use the same date for the first two fields.':'তারিখ সঠিক ক্রমে দিন: প্রথম যোগদান ≤ ৩য় শ্রেণিতে প্রবেশ ≤ হিসাবের তারিখ। সরাসরি ৩য় শ্রেণিতে যোগ দিলে প্রথম দুই ঘরে একই তারিখ দিন।'}</div>}

      <div className="house-official-style">
        <div className="house-detail-head"><span>{en?'POINT DETAILS':'পয়েন্টের বিস্তারিত'}</span><b>{en?'Automatic Calculation':'স্বয়ংক্রিয় হিসাব'}</b></div>
        <div className="house-detail-row"><span>{en?'Service as 3rd Class':'৩য় শ্রেণিতে চাকরিকাল'}</span><b>{thirdService?fmtYmd(thirdService):'—'}</b></div>
        <div className="house-detail-row"><span>{en?'Service as 4th Class':'৪র্থ শ্রেণিতে পূর্ববর্তী চাকরিকাল'}</span><b>{validDates?fmtYmd(fourthService):'—'}</b></div>
        <div className="house-detail-row strong"><span>{en?'Point based on Service':'চাকরিকালভিত্তিক পয়েন্ট'}</span><b>{totalService?fmtYmd(totalService):'—'}</b></div>
        <div className="house-detail-row"><span>{en?'Point based on Basic Salary':'মূল বেতনভিত্তিক পয়েন্ট'} <small>({en?'Basic ÷ 100':'মূল বেতন ÷ ১০০'})</small></span><b>{numLang(basicPoint,lang)}</b></div>
        <div className="house-detail-row"><span>{en?'Point based on Designation':'পদবিভিত্তিক পয়েন্ট'} <small>({en?'current post 1 + each previous promotion 1':'বর্তমান পদ ১ + প্রতিটি পূর্ববর্তী পদোন্নতি ১'})</small></span><b>{numLang(designationPoint,lang,0)}</b></div>
        <div className="house-detail-row"><span>{en?'Point based on Marital Status':'বৈবাহিক অবস্থাভিত্তিক পয়েন্ট'} <small>({en?'married +3':'বিবাহিত +৩'})</small></span><b>{numLang(maritalPoint,lang,0)}</b></div>
        <div className="house-detail-row"><span>{en?'Point based on Gender':'লিঙ্গভিত্তিক পয়েন্ট'} <small>({en?'female +3, male 0':'নারী +৩, পুরুষ ০'})</small></span><b>{numLang(genderPoint,lang,0)}</b></div>
        <div className="house-detail-row total"><span>{en?'Total Point':'মোট বাসা বরাদ্দ পয়েন্ট'}</span><b>{totalPoint?fmtYmd(totalPoint):'—'}</b></div>
      </div>
      {houseResult&&<><button className="primary wide house-pdf-btn" onClick={()=>setPreview(true)}><FileText size={17}/>{en?'A4 PDF Preview & Download':'A4 PDF প্রিভিউ ও ডাউনলোড'}</button>{preview&&<PdfPreviewModal html={houseReport} filename={houseFilename} onClose={()=>setPreview(false)} lang={lang} shareTitle={en?'House Allocation Point Report':'বাসা বরাদ্দ পয়েন্ট রিপোর্ট'} shareSummary={en?'House allocation point calculation report.':'বাসা বরাদ্দ পয়েন্ট হিসাবের রিপোর্ট।'}/>}</>}
    </div>:<div className="house-pending-panel">
      <div className="house-coming-icon"><Clock3/></div>
      <span>{en?'COMING SOON':'শীঘ্রই আসছে'}</span>
      <h4>{en?current.en:current.bn}</h4>
      <p>{en?'Automatic calculation for this category is coming soon.':'এই শ্রেণির অটোমেটিক বাসা বরাদ্দ পয়েন্ট হিসাব শীঘ্রই চালু হবে।'}</p>
      
    </div>}
  </section>
}

function CalculatorCenter({lang='bn',onPage,publicMode=false,initialTool='service',singleTool=false}){
  const en=lang==='en';
  const [tool,setTool]=useState(initialTool||'service');
  const [career,setCareer]=useState({profile:null,education:[],events:[]});
  const [service,setService]=useState({start:'',end:todayLocalIso()});
  const [age,setAge]=useState({dob:'',asOf:todayLocalIso()});
  const [gap,setGap]=useState({from:'',to:''});
  const [retire,setRetire]=useState({dob:'',age:'60'});
  const [basicProj,setBasicProj]=useState({grade:'13',stage:'0',date:'2027-07-01'});
  const [result,setResult]=useState(null);

  useEffect(()=>{setTool(initialTool||'service');setResult(null)},[initialTool]);
  useEffect(()=>{
    const gp=guestLocalProfile();
    if(gp.first_joining_date)setService(v=>({...v,start:gp.first_joining_date}));
    if(gp.date_of_birth){
      setAge(v=>({...v,dob:gp.date_of_birth}));
      setRetire(v=>({...v,dob:gp.date_of_birth}));
    }
    if(gp.retirement_age)setRetire(v=>({...v,age:String(gp.retirement_age)}));
    if(gp.grade)setBasicProj(v=>({...v,grade:String(gp.grade),stage:'0'}));
    if(publicMode)return;
    api('/api/my-career').then(x=>{
      setCareer({profile:x.profile||null,education:x.education||[],events:x.events||[]});
      const p=x.profile||{};
      if(p.first_joining_date)setService(v=>({...v,start:p.first_joining_date}));
      if(p.date_of_birth){
        setAge(v=>({...v,dob:p.date_of_birth}));
        setRetire(v=>({...v,dob:p.date_of_birth}));
      }
      if(p.retirement_age)setRetire(v=>({...v,age:String(p.retirement_age)}));
      if(p.current_grade)setBasicProj(v=>({...v,grade:String(p.current_grade),stage:'0'}));
    }).catch(()=>{});
  },[publicMode]);

  const validDate=v=>!!v&&!isNaN(new Date(v+'T00:00:00'));
  const dateObj=v=>new Date(v+'T00:00:00');
  function cleanDuration(a,b){
    if(!validDate(a)||!validDate(b))return null;
    if(dateObj(a)>dateObj(b))return null;
    return diffYMD(a,b);
  }
  function calcService(){
    const end=todayLocalIso();
    const d=cleanDuration(service.start,end);
    setService(x=>({...x,end}));
    setResult(d?{type:'service',d,start:service.start,end}:{error:en?'Enter a valid joining/start date.':'সঠিক যোগদান/শুরুর তারিখ দিন।'});
  }
  function calcAge(){
    const asOf=todayLocalIso();
    const d=cleanDuration(age.dob,asOf);
    setAge(x=>({...x,asOf}));
    setResult(d?{type:'age',d,dob:age.dob,asOf}:{error:en?'Enter a valid date of birth.':'সঠিক জন্মতারিখ দিন।'});
  }
  function calcGap(){
    const d=cleanDuration(gap.from,gap.to);
    setResult(d?{type:'gap',d,from:gap.from,to:gap.to}:{error:en?'Enter two valid dates in chronological order.':'সঠিক ক্রমে দুটি তারিখ দিন।'});
  }
  function calcRetire(){
    const years=Number(retire.age);
    if(!validDate(retire.dob)||!Number.isFinite(years)||years<1||years>100){
      return setResult({error:en?'Enter a valid date of birth and retirement age.':'সঠিক জন্মতারিখ ও অবসরের বয়স দিন।'});
    }
    const retirement=addYears(retire.dob,years);
    const today=todayLocalIso();
    const remaining=dateObj(retirement)>=dateObj(today)?cleanDuration(today,retirement):null;
    setResult({type:'retire',dob:retire.dob,years,retirement,remaining,passed:dateObj(retirement)<dateObj(today)});
  }
  function calcBasicProjection(){
    const grade=Number(basicProj.grade),stages=PAY2015[String(grade)]||[],idx=Math.min(Math.max(0,Number(basicProj.stage||0)),Math.max(0,stages.length-1));
    const current=stages[idx]||0,fixed=fixed2026(grade,current),rate=implementationRate(grade,basicProj.date),increase=Math.max(0,fixed-current),payable=Math.round(current+increase*rate);
    setResult({type:'basicProjection',grade,stage:idx+1,current,fixed,rate,payable,date:basicProj.date});
  }
  const showDur=d=>en?`${numLang(d.y,lang,0)} years ${numLang(d.m,lang,0)} months ${numLang(d.d,lang,0)} days`:durationBn(d);
  const tools=[
    ['service',Clock3,en?'Service Length':'চাকরিকাল'],
    ['age',UserRound,en?'Age':'বয়স'],
    ['gap',CalendarDays,en?'Date Difference':'তারিখের ব্যবধান'],
    ['retire',FileClock,en?'Retirement Estimate':'অবসর তারিখ'],
    ['basic',BadgeDollarSign,en?'Basic Pay Projection':'মূল বেতন প্রক্ষেপণ']
  ];
  const stages=PAY2015[basicProj.grade]||[];

  return <div className={`calculator-center advanced-calculator-center ${publicMode?'public-single-calculator':''}`}>
    {!singleTool&&<section className="advanced-calc-hero">
      <div><span>{en?'ADVANCED CALCULATOR CENTER':'উন্নত ক্যালকুলেটর সেন্টার'}</span><h2>{en?'Smart calculations from your own data':'নিজের তথ্য থেকে স্মার্ট হিসাব'}</h2><p>{en?'Use career, date, service and pay tools from one calculation center.':'ক্যারিয়ার, তারিখ, চাকরিকাল ও বেতন-সংক্রান্ত হিসাব এক জায়গা থেকে ব্যবহার করুন।'}</p></div>
    </section>}

    {!singleTool&&<div className="calc-hub-grid">
      <button className="calc-hub-card promotion" onClick={()=>onPage?.('promotion')}><TrendingUp/><div><b>{en?'Promotion Calculator':'পদোন্নতি হিসাব'}</b><small>{en?'Promotion rules and roadmap':'পদোন্নতি নিয়ম ও রোডম্যাপ'}</small></div><ChevronRight/></button>
      <button className="calc-hub-card salary" onClick={()=>onPage?.('salary')}><WalletCards/><div><b>{en?'Pay Scale Calculator':'পে-স্কেল হিসাব'}</b><small>{en?'Fixation, gross, deductions and payslip':'ফিক্সেশন, মোট বেতন, কর্তন ও পে-স্লিপ'}</small></div><ChevronRight/></button>
      <button className="calc-hub-card points" onClick={()=>onPage?.('points')}><Award/><div><b>{en?'Points Calculator':'পয়েন্ট ক্যালকুলেটর'}</b><small>{en?'Service, education and house-allocation points':'সার্ভিস, শিক্ষাগত যোগ্যতা ও বাসা বরাদ্দ পয়েন্ট'}</small></div><ChevronRight/></button>
    </div>}

    {!publicMode&&career.profile&&<section className="calc-personal-data-strip">
      <div><BookUser/><div><small>{en?'Personal data detected':'ব্যক্তিগত তথ্য পাওয়া গেছে'}</small><b>{career.profile.current_post||'—'} · {career.profile.current_grade?`${en?'Grade':'গ্রেড'} ${career.profile.current_grade}`:'—'}</b></div></div>
      <button onClick={()=>onPage?.('career')}>{en?'Update My Career':'আমার চাকরি আপডেট'}<ChevronRight size={14}/></button>
    </section>}

    {!singleTool&&<div className="calculator-tabs">
      {tools.map(([k,I,l])=><button key={k} className={tool===k?'active':''} onClick={()=>{setTool(k);setResult(null)}}><I size={17}/>{l}</button>)}
    </div>}

    <section className="calc-card calculator-tool-card">
      {tool==='service'&&<>
        <div className="tool-head"><Clock3/><div><h3>{en?'Service Length Calculator':'চাকরিকাল হিসাব'}</h3><p>{publicMode?(en?'Enter the joining/start date to calculate exact service length.':'যোগদান/শুরুর তারিখ দিয়ে সঠিক চাকরিকাল হিসাব করুন।'):(en?'Your first joining date is auto-filled from My Career when available.':'আমার চাকরি থেকে প্রথম যোগদানের তারিখ থাকলে স্বয়ংক্রিয়ভাবে বসবে।')}</p></div></div>
        <div className="form-grid"><DMY label={en?'Joining / start date':'যোগদান / শুরুর তারিখ'} value={service.start} onChange={v=>setService({...service,start:v})}/></div>
        <div className="notice"><b>{en?'As of:':'হিসাব পর্যন্ত:'}</b> {fmtDateLang(todayLocalIso(),lang)}</div>
        <button className="primary wide" onClick={calcService}>{en?'Calculate Service Length':'চাকরিকাল হিসাব করুন'}</button>
      </>}
      {tool==='age'&&<>
        <div className="tool-head"><UserRound/><div><h3>{en?'Age Calculator':'বয়স হিসাব'}</h3><p>{en?'Exact age in years, months and days as of today.':'আজকের তারিখ অনুযায়ী বছর, মাস ও দিনে সঠিক বয়স।'}</p></div></div>
        <div className="form-grid"><DMY label={en?'Date of birth':'জন্মতারিখ'} value={age.dob} onChange={v=>setAge({...age,dob:v})}/></div>
        <button className="primary wide" onClick={calcAge}>{en?'Calculate Age':'বয়স হিসাব করুন'}</button>
      </>}
      {tool==='gap'&&<>
        <div className="tool-head"><CalendarDays/><div><h3>{en?'Date Difference Calculator':'দুই তারিখের ব্যবধান'}</h3><p>{en?'Find the exact interval between any two dates.':'যেকোনো দুই তারিখের সঠিক ব্যবধান বের করুন।'}</p></div></div>
        <div className="form-grid"><DMY label={en?'From date':'শুরুর তারিখ'} value={gap.from} onChange={v=>setGap({...gap,from:v})}/><DMY label={en?'To date':'শেষ তারিখ'} value={gap.to} onChange={v=>setGap({...gap,to:v})}/></div>
        <button className="primary wide" onClick={calcGap}>{en?'Calculate Difference':'ব্যবধান হিসাব করুন'}</button>
      </>}
      {tool==='retire'&&<>
        <div className="tool-head"><FileClock/><div><h3>{en?'Retirement Date Estimate':'অবসর তারিখ অনুমান'}</h3><p>{en?'Enter your applicable retirement age. No policy age is assumed by the system.':'আপনার ক্ষেত্রে প্রযোজ্য অবসরের বয়স দিন। সিস্টেম কোনো নীতিগত বয়স অনুমান করে না।'}</p></div></div>
        <div className="form-grid"><DMY label={en?'Date of birth':'জন্মতারিখ'} value={retire.dob} onChange={v=>setRetire({...retire,dob:v})}/><label>{en?'Applicable retirement age':'প্রযোজ্য অবসরের বয়স'}<input type="number" min="1" max="100" value={retire.age} onChange={e=>setRetire({...retire,age:e.target.value})}/></label></div>
        <button className="primary wide" onClick={calcRetire}>{en?'Estimate Retirement Date':'অবসর তারিখ হিসাব করুন'}</button>
      </>}
      {tool==='basic'&&<>
        <div className="tool-head"><BadgeDollarSign/><div><h3>{en?'Basic Pay Projection':'মূল বেতন প্রক্ষেপণ'}</h3><p>{en?'Projects basic pay using the current fixation and implementation schedule.':'বর্তমান ফিক্সেশন ও বাস্তবায়ন সূচি অনুযায়ী মূল বেতন প্রক্ষেপণ দেখায়।'}</p></div></div>
        <div className="form-grid">
          <label>{en?'Grade':'গ্রেড'}<select value={basicProj.grade} onChange={e=>setBasicProj({...basicProj,grade:e.target.value,stage:'0'})}>{Array.from({length:20},(_,i)=>i+1).map(g=><option key={g} value={g}>{en?`Grade ${g}`:`গ্রেড ${g.toLocaleString('bn-BD')}`}</option>)}</select></label>
          <label>{en?'Current 2015 pay stage':'বর্তমান ২০১৫ বেতন ধাপ'}<select value={basicProj.stage} onChange={e=>setBasicProj({...basicProj,stage:e.target.value})}>{stages.map((v,i)=><option value={i} key={i}>{en?`Stage ${i+1} — Tk ${moneyLang(v,'en')}`:`ধাপ ${(i+1).toLocaleString('bn-BD')} — ৳${moneyLang(v,'bn')}`}</option>)}</select></label>
          <label>{en?'Projection date':'প্রক্ষেপণের তারিখ'}<input type="date" value={basicProj.date} onChange={e=>setBasicProj({...basicProj,date:e.target.value})}/></label>
        </div>
        <button className="primary wide" onClick={calcBasicProjection}>{en?'Project Basic Pay':'মূল বেতন প্রক্ষেপণ করুন'}</button>
      </>}
    </section>

    {result&&<section className={`calculator-result ${result.error?'warn':'ok'}`}>
      {result.error?<><AlertTriangle/><div><h3>{en?'Unable to calculate':'হিসাব করা যায়নি'}</h3><p>{result.error}</p></div></>:
      result.type==='service'?<><CheckCircle2/><div><small>{en?'Total service length':'মোট চাকরিকাল'}</small><h3>{showDur(result.d)}</h3><p>{fmtDateLang(result.start,lang)} → {fmtDateLang(result.end,lang)}</p></div></>:
      result.type==='age'?<><CheckCircle2/><div><small>{en?'Current age':'বর্তমান বয়স'}</small><h3>{showDur(result.d)}</h3><p>{en?'Date of birth':'জন্মতারিখ'}: {fmtDateLang(result.dob,lang)}</p></div></>:
      result.type==='gap'?<><CheckCircle2/><div><small>{en?'Exact difference':'সঠিক ব্যবধান'}</small><h3>{showDur(result.d)}</h3><p>{fmtDateLang(result.from,lang)} → {fmtDateLang(result.to,lang)}</p></div></>:
      result.type==='retire'?<><FileClock/><div><small>{en?'Estimated retirement date':'সম্ভাব্য অবসর তারিখ'}</small><h3>{fmtDateLang(result.retirement,lang)}</h3><p>{en?`Based on the retirement age you entered: ${numLang(result.years,lang,0)} years.`:`আপনার দেওয়া অবসরের বয়স ${numLang(result.years,lang,0)} বছর ধরে হিসাব করা হয়েছে।`}</p></div></>:
      <><BadgeDollarSign/><div><small>{en?'Projected payable basic':'প্রক্ষেপিত প্রাপ্য মূল বেতন'}</small><h3>{en?'Tk':'৳'} {moneyLang(result.payable,lang)}</h3><p>{en?`2015 basic Tk ${moneyLang(result.current,'en')} · Full fixed 2026 Tk ${moneyLang(result.fixed,'en')} · Implementation ${numLang(result.rate*100,lang,0)}%`:`২০১৫ মূল বেতন ৳${moneyLang(result.current,'bn')} · ২০২৬ পূর্ণ নির্ধারিত ৳${moneyLang(result.fixed,'bn')} · বাস্তবায়ন ${numLang(result.rate*100,lang,0)}%`}</p></div></>}
    </section>}

    
  </div>
}

function MyCareer({lang='bn'}){
  const en=lang==='en';
  const blankProfile={first_joining_date:'',current_post:'',current_grade:'',current_post_joining_date:'',employment_type:'',office_name:'',department_name:'',employee_reference:'',retirement_age:'',notes:''};
  const [profile,setProfile]=useState(blankProfile),[education,setEducation]=useState([]),[events,setEvents]=useState([]),
    [loading,setLoading]=useState(true),[saving,setSaving]=useState(false),[err,setErr]=useState(''),[msg,setMsg]=useState('');
  const [eduForm,setEduForm]=useState({level:'',institution:'',subject:'',passing_year:'',result:'',notes:''});
  const [eventForm,setEventForm]=useState({event_type:'promotion',event_date:'',title:'',post_name:'',grade:'',office_name:'',reference_no:'',notes:''});

  async function load(){
    setLoading(true);setErr('');
    try{
      const x=await api('/api/my-career');
      setProfile({...blankProfile,...(x.profile||{})});
      setEducation(x.education||[]);
      setEvents(x.events||[]);
    }catch(e){setErr(e.message)}finally{setLoading(false)}
  }
  useEffect(()=>{load()},[]);

  async function saveProfile(e){
    e.preventDefault();setSaving(true);setErr('');setMsg('');
    try{
      await api('/api/my-career/profile',{method:'PUT',body:JSON.stringify(profile)});
      setMsg(en?'Career profile saved.':'চাকরি প্রোফাইল সংরক্ষণ হয়েছে।');await load();
    }catch(e){setErr(e.message)}finally{setSaving(false)}
  }
  async function addEducation(e){
    e.preventDefault();setErr('');setMsg('');
    try{
      await api('/api/my-career/education',{method:'POST',body:JSON.stringify(eduForm)});
      setEduForm({level:'',institution:'',subject:'',passing_year:'',result:'',notes:''});await load();
    }catch(e){setErr(e.message)}
  }
  async function delEducation(id){
    if(!confirm(en?'Delete this education record?':'এই শিক্ষাগত রেকর্ড মুছে ফেলবেন?'))return;
    try{await api(`/api/my-career/education/${id}`,{method:'DELETE'});await load()}catch(e){alert(e.message)}
  }
  async function addEvent(e){
    e.preventDefault();setErr('');setMsg('');
    try{
      await api('/api/my-career/events',{method:'POST',body:JSON.stringify(eventForm)});
      setEventForm({event_type:'promotion',event_date:'',title:'',post_name:'',grade:'',office_name:'',reference_no:'',notes:''});await load();
    }catch(e){setErr(e.message)}
  }
  async function delEvent(id){
    if(!confirm(en?'Delete this career record?':'এই চাকরি রেকর্ড মুছে ফেলবেন?'))return;
    try{await api(`/api/my-career/events/${id}`,{method:'DELETE'});await load()}catch(e){alert(e.message)}
  }

  if(loading)return <div className="loading">{en?'Loading...':'লোড হচ্ছে...'}</div>;
  const c=(k,v)=>setProfile(x=>({...x,[k]:v}));
  const eventLabels=en?{appointment:'Appointment/Joining',promotion:'Promotion',transfer:'Transfer/Posting',increment:'Increment',training:'Training',grade_change:'Grade Change',other:'Other'}:{appointment:'নিয়োগ/যোগদান',promotion:'পদোন্নতি',transfer:'বদলি/পোস্টিং',increment:'ইনক্রিমেন্ট',training:'প্রশিক্ষণ',grade_change:'গ্রেড পরিবর্তন',other:'অন্যান্য'};
  return <div className="my-career-page">
    <section className="career-hero">
      <div><span>{en?'PERSONAL DIGITAL SERVICE BOOK':'ব্যক্তিগত ডিজিটাল সার্ভিস বুক'}</span><h2>{en?'My Career':'আমার চাকরি'}</h2><p>{en?'Maintain your own career information, education and service timeline. This is a personal record, not an official service book or administrative order.':'নিজের চাকরি, শিক্ষা ও সার্ভিস টাইমলাইন নিজে সংরক্ষণ করুন। এটি ব্যক্তিগত রেকর্ড; অফিসিয়াল সার্ভিস বুক বা প্রশাসনিক আদেশ নয়।'}</p></div>
      <div className="career-lock"><ShieldCheck size={16}/>{en?'Private self-service record':'ব্যক্তিগত স্ব-পরিচালিত রেকর্ড'}</div>
    </section>

    {err&&<div className="error">{err}</div>}{msg&&<div className="auth-success">{msg}</div>}

    <section className="career-card">
      <div className="career-section-head"><div><BookUser/><div><h3>{en?'Career Profile':'চাকরি প্রোফাইল'}</h3><p>{en?'Core employment information used by your personal dashboard and future calculators.':'ব্যক্তিগত ড্যাশবোর্ড ও ভবিষ্যৎ হিসাবের জন্য মূল চাকরি তথ্য।'}</p></div></div></div>
      <form className="form-grid" onSubmit={saveProfile}>
        <DMY label={en?'First joining date':'প্রথম যোগদানের তারিখ'} value={profile.first_joining_date||''} onChange={v=>c('first_joining_date',v)}/>
        <label>{en?'Current post':'বর্তমান পদ'}<input value={profile.current_post||''} onChange={e=>c('current_post',e.target.value)}/></label>
        <label>{en?'Current grade':'বর্তমান গ্রেড'}<select value={profile.current_grade||''} onChange={e=>c('current_grade',e.target.value)}><option value="">{en?'Select':'নির্বাচন'}</option>{Array.from({length:20},(_,i)=>i+1).map(g=><option key={g} value={g}>{en?`Grade ${g}`:`গ্রেড ${g.toLocaleString('bn-BD')}`}</option>)}</select></label>
        <DMY label={en?'Current post joining date':'বর্তমান পদে যোগদানের তারিখ'} value={profile.current_post_joining_date||''} onChange={v=>c('current_post_joining_date',v)}/>
        <label>{en?'Employment type':'চাকরির ধরন'}<select value={profile.employment_type||''} onChange={e=>c('employment_type',e.target.value)}><option value="">{en?'Select':'নির্বাচন'}</option><option value="permanent">{en?'Permanent':'স্থায়ী'}</option><option value="temporary">{en?'Temporary':'অস্থায়ী'}</option><option value="contract">{en?'Contract':'চুক্তিভিত্তিক'}</option></select></label>
        <label>{en?'Office / Unit':'অফিস / ইউনিট'}<input value={profile.office_name||''} onChange={e=>c('office_name',e.target.value)}/></label>
        <label>{en?'Department / Section':'বিভাগ / শাখা'}<input value={profile.department_name||''} onChange={e=>c('department_name',e.target.value)}/></label>
        <label>{en?'Employee / Reference ID':'কর্মী / রেফারেন্স নম্বর'}<input value={profile.employee_reference||''} onChange={e=>c('employee_reference',e.target.value)}/></label>
        <label>{en?'Applicable retirement age':'প্রযোজ্য অবসরের বয়স'}<input type="number" min="1" max="100" value={profile.retirement_age||''} onChange={e=>c('retirement_age',e.target.value)}/></label>
        <label className="span-2">{en?'Personal notes':'ব্যক্তিগত নোট'}<textarea rows="3" value={profile.notes||''} onChange={e=>c('notes',e.target.value)}/></label>
        <div className="span-2"><button className="primary" disabled={saving}><Save size={16}/>{saving?(en?'Saving...':'সংরক্ষণ হচ্ছে...'):(en?'Save Career Profile':'চাকরি প্রোফাইল সংরক্ষণ')}</button></div>
      </form>
    </section>

    <section className="career-split">
      <article className="career-card">
        <div className="career-section-head"><div><GraduationCap/><div><h3>{en?'Education':'শিক্ষাগত যোগ্যতা'}</h3><p>{en?'Add your own education history.':'নিজের শিক্ষাগত ইতিহাস যোগ করুন।'}</p></div></div></div>
        <form className="career-inline-form" onSubmit={addEducation}>
          <input required placeholder={en?'Level / degree':'স্তর / ডিগ্রি'} value={eduForm.level} onChange={e=>setEduForm({...eduForm,level:e.target.value})}/>
          <input placeholder={en?'Institution':'প্রতিষ্ঠান'} value={eduForm.institution} onChange={e=>setEduForm({...eduForm,institution:e.target.value})}/>
          <input placeholder={en?'Subject':'বিষয়'} value={eduForm.subject} onChange={e=>setEduForm({...eduForm,subject:e.target.value})}/>
          <input type="number" placeholder={en?'Year':'সন'} value={eduForm.passing_year} onChange={e=>setEduForm({...eduForm,passing_year:e.target.value})}/>
          <button className="primary"><Plus size={15}/>{en?'Add':'যোগ করুন'}</button>
        </form>
        <div className="career-list">{education.length===0?<div className="empty">{en?'No education record yet.':'এখনো শিক্ষাগত রেকর্ড নেই।'}</div>:education.map(x=><div className="career-list-row" key={x.id}><div><b>{x.level}</b><small>{[x.subject,x.institution,x.passing_year].filter(Boolean).join(' · ')||'—'}</small></div><button className="icon-btn danger" onClick={()=>delEducation(x.id)}><Trash2 size={15}/></button></div>)}</div>
      </article>

      <article className="career-card">
        <div className="career-section-head"><div><Milestone/><div><h3>{en?'Career Timeline':'চাকরি টাইমলাইন'}</h3><p>{en?'Promotion, posting, increment, training and other milestones.':'পদোন্নতি, পোস্টিং, ইনক্রিমেন্ট, প্রশিক্ষণ ও অন্যান্য ধাপ।'}</p></div></div></div>
        <form className="career-inline-form" onSubmit={addEvent}>
          <select value={eventForm.event_type} onChange={e=>setEventForm({...eventForm,event_type:e.target.value})}>{Object.entries(eventLabels).map(([v,l])=><option key={v} value={v}>{l}</option>)}</select>
          <input type="date" required value={eventForm.event_date} onChange={e=>setEventForm({...eventForm,event_date:e.target.value})}/>
          <input required placeholder={en?'Title':'শিরোনাম'} value={eventForm.title} onChange={e=>setEventForm({...eventForm,title:e.target.value})}/>
          <input placeholder={en?'Post / grade':'পদ / গ্রেড'} value={eventForm.post_name} onChange={e=>setEventForm({...eventForm,post_name:e.target.value})}/>
          <button className="primary"><Plus size={15}/>{en?'Add':'যোগ করুন'}</button>
        </form>
        <div className="career-timeline">{events.length===0?<div className="empty">{en?'No career event yet.':'এখনো চাকরি ইভেন্ট নেই।'}</div>:events.map(x=><div className="career-timeline-row" key={x.id}><div className="career-timeline-dot"></div><div><small>{x.event_date} · {eventLabels[x.event_type]||x.event_type}</small><b>{x.title}</b><p>{[x.post_name,x.grade?`${en?'Grade':'গ্রেড'} ${x.grade}`:'',x.office_name].filter(Boolean).join(' · ')}</p></div><button className="icon-btn danger" onClick={()=>delEvent(x.id)}><Trash2 size={15}/></button></div>)}</div>
      </article>
    </section>

    <section className="calculator-safety-note"><ShieldCheck/><div><b>{en?'Personal record only':'শুধু ব্যক্তিগত রেকর্ড'}</b><p>{en?'This module does not approve promotions, salary fixation, leave or any administrative decision.':'এই মডিউল পদোন্নতি, বেতন নির্ধারণ, ছুটি বা কোনো প্রশাসনিক সিদ্ধান্ত অনুমোদন করে না।'}</p></div></section>
  </div>
}


function NoticePolicyCenter({lang='bn',canManage=false}){
  const en=lang==='en';
  const [tab,setTab]=useState('notices'),[notices,setNotices]=useState([]),[policies,setPolicies]=useState([]),[busy,setBusy]=useState(false),[err,setErr]=useState('');
  const blankNotice={title_bn:'',title_en:'',summary_bn:'',summary_en:'',category:'general',publish_date:todayLocalIso(),file_url:'',is_public:true,is_active:true,pinned:false};
  const blankPolicy={title_bn:'',title_en:'',summary_bn:'',summary_en:'',category:'general',reference_no:'',effective_date:'',publish_date:todayLocalIso(),file_url:'',is_public:true,is_active:true,pinned:false};
  const [form,setForm]=useState(blankNotice),[editing,setEditing]=useState(null);
  async function load(){
    setBusy(true);setErr('');
    try{
      const [n,p]=await Promise.all([api('/api/notices'),api('/api/policies')]);
      setNotices(n.notices||[]);setPolicies(p.policies||[]);
    }catch(e){setErr(e.message)}finally{setBusy(false)}
  }
  useEffect(()=>{load()},[]);
  function switchTab(v){setTab(v);setEditing(null);setForm(v==='notices'?blankNotice:blankPolicy)}
  function edit(item){setEditing(item);setForm({...item,is_public:!!item.is_public,is_active:!!item.is_active,pinned:!!item.pinned});window.scrollTo({top:0,behavior:'smooth'})}
  async function save(e){
    e.preventDefault(); if(!canManage)return;
    setBusy(true);setErr('');
    try{
      const endpoint=tab==='notices'?'/api/notices':'/api/policies';
      const method=editing?'PUT':'POST'; const path=editing?`${endpoint}/${editing.id}`:endpoint;
      await api(path,{method,body:JSON.stringify(form)});
      setEditing(null);setForm(tab==='notices'?blankNotice:blankPolicy);await load();
    }catch(e){setErr(e.message)}finally{setBusy(false)}
  }
  async function remove(item){
    if(!canManage)return;
    if(!confirm(en?'Delete this item?':'এই আইটেমটি মুছে ফেলবেন?'))return;
    try{await api(`/${'api'}/${tab}/${item.id}`,{method:'DELETE'});load()}catch(e){alert(e.message)}
  }
  const list=tab==='notices'?notices:policies;
  const titleOf=x=>en?(x.title_en||x.title_bn):(x.title_bn||x.title_en);
  const summaryOf=x=>en?(x.summary_en||x.summary_bn):(x.summary_bn||x.summary_en);
  return <div className="content-library">
    <div className="page-head"><div><h2>{en?'Notice Board & Policy Library':'নোটিশ বোর্ড ও নীতিমালা লাইব্রেরি'}</h2><p>{en?'Publish notices and maintain a searchable policy library.':'নোটিশ প্রকাশ এবং অনুসন্ধানযোগ্য নীতিমালা লাইব্রেরি পরিচালনা করুন।'}</p></div></div>
    <div className="library-tabs"><button className={tab==='notices'?'active':''} onClick={()=>switchTab('notices')}><Bell size={16}/>{en?'Notices':'নোটিশ'}</button><button className={tab==='policies'?'active':''} onClick={()=>switchTab('policies')}><BookOpen size={16}/>{en?'Policies & Rules':'নীতিমালা ও বিধি'}</button></div>
    {err&&<div className="error">{err}</div>}
    {canManage&&<form className="library-editor" onSubmit={save}>
      <div className="library-editor-head"><div><b>{editing?(en?'Edit item':'আইটেম সম্পাদনা'):(en?'Add new item':'নতুন আইটেম যোগ করুন')}</b><small>{en?'Bangla and English content are stored separately.':'বাংলা ও ইংরেজি কনটেন্ট আলাদাভাবে সংরক্ষিত হবে।'}</small></div>{editing&&<button type="button" className="secondary" onClick={()=>{setEditing(null);setForm(tab==='notices'?blankNotice:blankPolicy)}}>{en?'Cancel edit':'সম্পাদনা বাতিল'}</button>}</div>
      <div className="form-grid">
        <label>{en?'Bangla title':'বাংলা শিরোনাম'}<input required value={form.title_bn||''} onChange={e=>setForm({...form,title_bn:e.target.value})}/></label>
        <label>{en?'English title':'ইংরেজি শিরোনাম'}<input value={form.title_en||''} onChange={e=>setForm({...form,title_en:e.target.value})}/></label>
        <label className="span-2">{en?'Bangla summary':'বাংলা সারাংশ'}<textarea rows="3" value={form.summary_bn||''} onChange={e=>setForm({...form,summary_bn:e.target.value})}/></label>
        <label className="span-2">{en?'English summary':'ইংরেজি সারাংশ'}<textarea rows="3" value={form.summary_en||''} onChange={e=>setForm({...form,summary_en:e.target.value})}/></label>
        <label>{en?'Category':'ক্যাটাগরি'}<input value={form.category||''} onChange={e=>setForm({...form,category:e.target.value})}/></label>
        <label>{en?'Publish date':'প্রকাশের তারিখ'}<input type="date" value={form.publish_date||''} onChange={e=>setForm({...form,publish_date:e.target.value})}/></label>
        {tab==='policies'&&<><label>{en?'Reference / order no.':'রেফারেন্স / আদেশ নং'}<input value={form.reference_no||''} onChange={e=>setForm({...form,reference_no:e.target.value})}/></label><label>{en?'Effective date':'কার্যকর তারিখ'}<input type="date" value={form.effective_date||''} onChange={e=>setForm({...form,effective_date:e.target.value})}/></label></>}
        <label className="span-2">{en?'Document URL (PDF/Drive/public link)':'ডকুমেন্ট URL (PDF/Drive/public link)'}<input type="url" value={form.file_url||''} onChange={e=>setForm({...form,file_url:e.target.value})} placeholder="https://..."/></label>
        <label className="check-line"><input type="checkbox" checked={!!form.is_public} onChange={e=>setForm({...form,is_public:e.target.checked})}/>{en?'Show publicly':'পাবলিকভাবে দেখান'}</label>
        <label className="check-line"><input type="checkbox" checked={!!form.pinned} onChange={e=>setForm({...form,pinned:e.target.checked})}/>{en?'Mark important':'গুরুত্বপূর্ণ হিসেবে রাখুন'}</label>
        <label className="check-line"><input type="checkbox" checked={!!form.is_active} onChange={e=>setForm({...form,is_active:e.target.checked})}/>{en?'Active':'সক্রিয়'}</label>
        <div className="span-2"><button className="primary" disabled={busy}><Save size={16}/>{busy?(en?'Saving...':'সংরক্ষণ হচ্ছে...'):(editing?(en?'Update':'আপডেট করুন'):(en?'Publish':'প্রকাশ করুন'))}</button></div>
      </div>
    </form>}
    <div className="library-admin-list">
      {busy&&list.length===0?<div className="empty">{en?'Loading...':'লোড হচ্ছে...'}</div>:list.length===0?<div className="empty">{en?'No records yet.':'এখনো কোনো রেকর্ড নেই।'}</div>:list.map(x=><article className="library-admin-card" key={x.id}>
        <div className="library-admin-icon">{tab==='notices'?<Bell/>:<BookOpen/>}</div><div className="library-admin-body"><div className="library-admin-title"><div><h3>{titleOf(x)}</h3><p>{summaryOf(x)||'—'}</p></div><div className="status-stack">{x.pinned&&<span className="badge active">{en?'Important':'গুরুত্বপূর্ণ'}</span>}<span className={'badge '+(x.is_public?'active':'')}>{x.is_public?(en?'Public':'পাবলিক'):(en?'Private':'প্রাইভেট')}</span></div></div>
        <div className="library-admin-meta"><span><CalendarDays size={14}/>{x.publish_date||'—'}</span>{x.category&&<span>{x.category}</span>}{x.reference_no&&<span><FileText size={14}/>{x.reference_no}</span>}{x.file_url&&<a href={x.file_url} target="_blank" rel="noreferrer">{en?'Open document':'ডকুমেন্ট খুলুন'}</a>}</div></div>
        {canManage&&<div className="library-admin-actions"><button className="icon-btn" onClick={()=>edit(x)}><Edit3 size={16}/></button><button className="icon-btn danger" onClick={()=>remove(x)}><Trash2 size={16}/></button></div>}
      </article>)}
    </div>
  </div>
}


function AdminMetric({label,value,icon:Icon,sub}){
  return <article className="admin-metric-card"><div className="admin-metric-icon"><Icon size={20}/></div><div><small>{label}</small><b>{value??'—'}</b>{sub&&<span>{sub}</span>}</div></article>
}
function SuperAdminControlCenter({lang='bn',onPage}){
  const en=lang==='en';
  const[stats,setStats]=useState(null),[users,setUsers]=useState([]),[auditRows,setAuditRows]=useState([]),[health,setHealth]=useState(null),
    [tab,setTab]=useState('overview'),[busy,setBusy]=useState(false),[err,setErr]=useState(''),[selectedUser,setSelectedUser]=useState(null),
    [userEdit,setUserEdit]=useState(null),[newPassword,setNewPassword]=useState(''),[showPassword,setShowPassword]=useState(false),[adminRecovery,setAdminRecovery]=useState(''),[userBusy,setUserBusy]=useState(false),[settings,setSettings]=useState({
      support_phone:'01759084692',whatsapp:'01759084692',calendar_enabled:'0',calendar_source_url:'',maintenance_mode:'0'
    });
  async function load(){
    setBusy(true);setErr('');
    const wait=ms=>new Promise(r=>setTimeout(r,ms));
    const fetchSafe=async(path)=>{
      let lastErr=null;
      for(let attempt=0;attempt<2;attempt++){
        try{return{ok:true,data:await api(path)}}
        catch(e){lastErr=e;if(attempt===0)await wait(280)}
      }
      return{ok:false,error:lastErr};
    };
    try{
      const [sR,uR,aR,hR,stR]=await Promise.all([
        fetchSafe('/api/admin/stats'),
        fetchSafe('/api/admin/users'),
        fetchSafe('/api/admin/audit?limit=80'),
        fetchSafe('/api/admin/system-health'),
        fetchSafe('/api/admin/settings')
      ]);

      if(sR.ok)setStats(sR.data);
      if(uR.ok)setUsers(uR.data?.users||[]);
      if(aR.ok)setAuditRows(aR.data?.logs||[]);
      if(hR.ok)setHealth(hR.data);
      if(stR.ok)setSettings(x=>({...x,...(stR.data?.settings||{})}));

      const failed=[sR,uR,aR,hR,stR].filter(x=>!x.ok);
      if(failed.length===5){
        setErr(en?'The admin data service could not be reached. Please refresh once.':'অ্যাডমিন ডাটা সার্ভিসে সংযোগ পাওয়া যায়নি। একবার রিফ্রেশ করুন।');
      }else if(failed.length){
        setErr(en?'Some admin data is temporarily unavailable; available information is still shown.':'কিছু অ্যাডমিন তথ্য সাময়িকভাবে পাওয়া যায়নি; যেগুলো পাওয়া গেছে সেগুলো দেখানো হচ্ছে।');
      }
    }finally{setBusy(false)}
  }
  useEffect(()=>{load()},[]);
  async function toggleUser(x){
    if(!confirm(en?`${x.is_active?'Deactivate':'Activate'} this account?`:`এই অ্যাকাউন্ট ${x.is_active?'নিষ্ক্রিয়':'সক্রিয়'} করবেন?`))return;
    try{await api(`/api/admin/users/${x.id}/status`,{method:'PUT',body:JSON.stringify({is_active:!x.is_active})});await load()}catch(e){alert(e.message)}
  }
  async function openUserControl(x){
    setUserBusy(true);setAdminRecovery('');setNewPassword('');setShowPassword(false);
    try{
      const d=await api(`/api/admin/users/${x.id}`);
      setSelectedUser(d);
      setUserEdit({...d.account,is_active:!!d.account.is_active,email_verified:!!d.account.email_verified});
    }catch(e){alert(e.message)}finally{setUserBusy(false)}
  }
  async function saveUserAccount(){
    if(!userEdit)return;
    setUserBusy(true);
    try{
      await api(`/api/admin/users/${userEdit.id}`,{method:'PUT',body:JSON.stringify(userEdit)});
      await load();await openUserControl(userEdit);
      alert(en?'Account information updated.':'অ্যাকাউন্ট তথ্য আপডেট হয়েছে।');
    }catch(e){alert(e.message)}finally{setUserBusy(false)}
  }
  async function resetUserPassword(){
    if(!selectedUser?.account?.id)return;
    if(!newPassword||newPassword.length<10){alert(en?'Use at least 10 characters with letters and numbers.':'কমপক্ষে ১০ অক্ষরের অক্ষর ও সংখ্যা যুক্ত পাসওয়ার্ড দিন।');return}
    if(!confirm(en?'Replace this user’s password and sign out all existing sessions?':'এই ব্যবহারকারীর পাসওয়ার্ড পরিবর্তন করে সব বর্তমান সেশন লগআউট করবেন?'))return;
    setUserBusy(true);
    try{
      await api(`/api/admin/users/${selectedUser.account.id}/password`,{method:'PUT',body:JSON.stringify({new_password:newPassword})});
      setNewPassword('');setShowPassword(false);
      alert(en?'New password has been set.':'নতুন পাসওয়ার্ড সেট হয়েছে।');
    }catch(e){alert(e.message)}finally{setUserBusy(false)}
  }
  async function rotateAdminRecovery(){
    if(!selectedUser?.account?.id)return;
    if(!confirm(en?'Generate a new recovery code? The previous recovery code will stop working.':'নতুন রিকভারি কোড তৈরি করবেন? আগের রিকভারি কোড আর কাজ করবে না।'))return;
    setUserBusy(true);
    try{
      const d=await api(`/api/admin/users/${selectedUser.account.id}/recovery-code`,{method:'POST'});
      setAdminRecovery(d.recoveryCode||'');
      setSelectedUser(s=>s?{...s,account:{...s.account,recovery_ready:1}}:s);
      await load();
    }catch(e){alert(e.message)}finally{setUserBusy(false)}
  }
  async function logoutUserEverywhere(){
    if(!selectedUser?.account?.id)return;
    if(!confirm(en?'Sign this user out from every device?':'এই ব্যবহারকারীকে সব ডিভাইস থেকে লগআউট করবেন?'))return;
    setUserBusy(true);try{await api(`/api/admin/users/${selectedUser.account.id}/logout-all`,{method:'POST'});alert(en?'All sessions signed out.':'সব সেশন লগআউট করা হয়েছে।')}catch(e){alert(e.message)}finally{setUserBusy(false)}
  }
  async function deleteManagedUser(){
    const a=selectedUser?.account;if(!a)return;
    const phrase=`DELETE ${a.id}`;
    const typed=prompt(en?`Permanent delete: account and personal records will be removed. Type ${phrase} to confirm.`:`স্থায়ীভাবে ডিলিট করলে অ্যাকাউন্ট ও ব্যক্তিগত রেকর্ড মুছে যাবে। নিশ্চিত করতে ${phrase} লিখুন।`);
    if(typed!==phrase)return;
    setUserBusy(true);
    try{await api(`/api/admin/users/${a.id}`,{method:'DELETE'});setSelectedUser(null);setUserEdit(null);await load();alert(en?'User permanently deleted.':'ব্যবহারকারী স্থায়ীভাবে ডিলিট হয়েছে।')}
    catch(e){alert(e.message)}finally{setUserBusy(false)}
  }
  async function saveSettings(){
    setBusy(true);setErr('');
    try{await api('/api/admin/settings',{method:'PUT',body:JSON.stringify(settings)});await load()}
    catch(e){setErr(e.message)}finally{setBusy(false)}
  }
  const roleText=r=>en?({super_admin:'System Administrator',admin:'Admin',department_admin:'Department Admin',editor:'Editor',employee:'Employee'}[r]||r):({super_admin:'সিস্টেম ব্যবস্থাপক',admin:'অ্যাডমিন',department_admin:'বিভাগীয় অ্যাডমিন',editor:'সম্পাদক',employee:'কর্মকর্তা-কর্মচারী'}[r]||r);
  const tabs=[
    ['overview',Gauge,en?'Overview':'সারসংক্ষেপ'],
    ['users',UserCog,en?'Users':'ব্যবহারকারী'],
    ['content',BookOpen,en?'Content':'কনটেন্ট'],
    ['rules',Calculator,en?'Calculator Rules':'ক্যালকুলেটর রুলস'],
    ['calendar',CalendarDays,en?'Calendar':'ক্যালেন্ডার'],
    ['security',ShieldAlert,en?'Security':'নিরাপত্তা'],
    ['audit',ScrollText,en?'Audit Logs':'অডিট লগ'],
    ['settings',SlidersHorizontal,en?'System Settings':'সিস্টেম সেটিংস']
  ];
  return <div className="super-admin-center">
    <section className="admin-control-hero">
      <div><span>{en?'SYSTEM CONTROL CENTER':'সিস্টেম কন্ট্রোল সেন্টার'}</span><h2>{en?'System Management Center':'সিস্টেম ব্যবস্থাপনা কেন্দ্র'}</h2><p>{en?'Manage users, content, security, calendar and platform settings from one streamlined workspace.':'ব্যবহারকারী, কনটেন্ট, নিরাপত্তা, ক্যালেন্ডার ও প্ল্যাটফর্ম সেটিংস এক জায়গা থেকে পরিচালনা করুন।'}</p></div>
      <div className="admin-health-chip"><Activity size={16}/>{health?.ok?(en?'System Healthy':'সিস্টেম সচল'):(en?'Attention':'মনোযোগ প্রয়োজন')}</div>
    </section>

    <div className="admin-control-tabs">{tabs.map(([k,I,l])=><button key={k} className={tab===k?'active':''} onClick={()=>setTab(k)}><I size={16}/>{l}</button>)}</div>
    {err&&<div className="error">{err}</div>}

    {tab==='overview'&&<>
      <section className="admin-metrics-grid">
        <AdminMetric label={en?'Total Users':'মোট ব্যবহারকারী'} value={stats?.users} icon={Users}/>
        <AdminMetric label={en?'Active Employees':'সক্রিয় কর্মকর্তা-কর্মচারী'} value={stats?.active_employees} icon={Activity}/>
        <AdminMetric label={en?'Departments':'বিভাগ/অফিস'} value={stats?.departments} icon={Building2}/>
        <AdminMetric label={en?'Designations':'পদবি'} value={stats?.designations} icon={Briefcase}/>
        <AdminMetric label={en?'Active Sessions':'সক্রিয় সেশন'} value={health?.active_sessions} icon={LockKeyhole}/>
        <AdminMetric label={en?'Audit Events':'অডিট ইভেন্ট'} value={health?.audit_events} icon={ScrollText}/>
      </section>
      <section className="admin-action-grid">
        <button onClick={()=>onPage?.('employees')}><Users/><div><b>{en?'User & Career Records':'ব্যবহারকারী ও ক্যারিয়ার রেকর্ড'}</b><small>{en?'Structured profiles and service history':'স্ট্রাকচার্ড প্রোফাইল ও চাকরি ইতিহাস'}</small></div><ChevronRight/></button>
        <button onClick={()=>onPage?.('directory')}><Building2/><div><b>{en?'Master Directory':'মাস্টার ডিরেক্টরি'}</b><small>{en?'Manage master data':'মাস্টার ডাটা পরিচালনা'}</small></div><ChevronRight/></button>
        <button onClick={()=>onPage?.('admin-content')}><BookOpen/><div><b>{en?'Notices & Policies':'নোটিশ ও নীতিমালা'}</b><small>{en?'Publish reference content':'রেফারেন্স কনটেন্ট প্রকাশ'}</small></div><ChevronRight/></button>
        <button onClick={()=>setTab('security')}><ShieldCheck/><div><b>{en?'Security Center':'নিরাপত্তা কেন্দ্র'}</b><small>{en?'Sessions and account status':'সেশন ও অ্যাকাউন্ট অবস্থা'}</small></div><ChevronRight/></button>
      </section>
    </>}

    {tab==='users'&&<section className="admin-panel-card">
      <div className="admin-panel-head"><div><h3>{en?'User Account & Recovery Management':'ব্যবহারকারী অ্যাকাউন্ট ও রিকভারি ব্যবস্থাপনা'}</h3><p>{en?'Two recovery paths remain active: user self-service recovery and Super Admin assisted recovery. Existing passwords and recovery codes are never displayed; they can only be replaced.':'দুই ধরনের রিকভারি একসাথে থাকবে—ব্যবহারকারীর নিজস্ব রিকভারি এবং সুপার অ্যাডমিন সহায়তায় রিকভারি। নিরাপত্তার কারণে বর্তমান পাসওয়ার্ড বা রিকভারি কোড দেখা যাবে না; শুধু নতুন করে সেট করা যাবে।'}</p></div><button className="secondary" onClick={load}><RefreshCw size={15}/>{en?'Refresh':'রিফ্রেশ'}</button></div>
      <div className="dual-recovery-note"><ShieldCheck size={18}/><div><b>{en?'Dual Recovery Enabled':'দুই ধরনের রিকভারি সক্রিয়'}</b><span>{en?'Self-service: Email + saved recovery code → new password. Admin-assisted: Super Admin can edit the account, set a new password, replace recovery code, revoke sessions or delete the account.':'নিজস্ব পদ্ধতি: ইমেইল + সংরক্ষিত রিকভারি কোড দিয়ে নতুন পাসওয়ার্ড। অ্যাডমিন সহায়তা: সুপার অ্যাডমিন অ্যাকাউন্ট এডিট, নতুন পাসওয়ার্ড, নতুন রিকভারি কোড, সেশন বন্ধ বা অ্যাকাউন্ট ডিলিট করতে পারবেন।'}</span></div></div>
      <div className="table-wrap admin-users-table"><table><thead><tr><th>{en?'ID / User':'আইডি / ব্যবহারকারী'}</th><th>{en?'Role':'ভূমিকা'}</th><th>{en?'Type':'ধরন'}</th><th>{en?'Recovery':'রিকভারি'}</th><th>{en?'Status':'অবস্থা'}</th><th>{en?'Control':'নিয়ন্ত্রণ'}</th></tr></thead><tbody>
        {users.map(x=><tr key={x.id}><td><b>#{x.id} · {x.name}</b><small style={{display:'block'}}>{x.employee_id||'—'} · {x.email}</small></td><td>{roleText(x.role)}</td><td>{x.account_type==='officer'?(en?'Officer':'কর্মকর্তা'):(en?'Employee':'কর্মচারী')}</td><td><span className={'badge '+(x.recovery_ready?'active':'')}>{x.recovery_ready?(en?'Ready':'সক্রিয়'):(en?'Not set':'নেই')}</span></td><td><span className={'badge '+(x.is_active?'active':'')}>{x.is_active?(en?'Active':'সক্রিয়'):(en?'Inactive':'নিষ্ক্রিয়')}</span></td><td><div className="admin-user-actions"><button className="secondary small" onClick={()=>openUserControl(x)}><Edit3 size={14}/>{en?'Manage':'পরিচালনা'}</button><button className="icon-btn" title={en?'Toggle status':'অবস্থা পরিবর্তন'} onClick={()=>toggleUser(x)}><Power size={15}/></button></div></td></tr>)}
      </tbody></table></div>
    </section>}

    {selectedUser&&userEdit&&<div className="modal-backdrop admin-user-modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget){setSelectedUser(null);setUserEdit(null);setAdminRecovery('')}}}>
      <section className="modal admin-user-control-modal">
        <div className="modal-head"><div><span className="admin-user-kicker">{en?'SUPER ADMIN USER CONTROL':'সুপার অ্যাডমিন ইউজার কন্ট্রোল'}</span><h3>{userEdit.name||'—'} <small>#{userEdit.id}</small></h3><p>{en?'Account identity, access, password, recovery and personal-data controls.':'অ্যাকাউন্ট পরিচয়, প্রবেশাধিকার, পাসওয়ার্ড, রিকভারি ও ব্যক্তিগত ডাটা নিয়ন্ত্রণ।'}</p></div><button className="icon-btn" onClick={()=>{setSelectedUser(null);setUserEdit(null);setAdminRecovery('')}}><X/></button></div>

        <div className="admin-user-control-grid">
          <section className="admin-control-block span-2"><div className="control-block-title"><UserCog/><div><b>{en?'Account Information':'অ্যাকাউন্ট তথ্য'}</b><small>{en?'Edit login ID, email, role and account status.':'লগইন আইডি, ইমেইল, ভূমিকা ও অ্যাকাউন্ট স্ট্যাটাস এডিট করুন।'}</small></div></div>
            <div className="form-grid admin-user-form">
              <label>{en?'System User ID':'সিস্টেম ইউজার আইডি'}<input value={'#'+userEdit.id} disabled/></label>
              <label>{en?'Employee / Reference ID':'কর্মী / রেফারেন্স আইডি'}<input value={userEdit.employee_id||''} onChange={e=>setUserEdit({...userEdit,employee_id:e.target.value})}/></label>
              <label>{en?'Full name':'পূর্ণ নাম'}<input value={userEdit.name||''} onChange={e=>setUserEdit({...userEdit,name:e.target.value})}/></label>
              <label>{en?'Login email':'লগইন ইমেইল'}<input type="email" value={userEdit.email||''} onChange={e=>setUserEdit({...userEdit,email:e.target.value})}/></label>
              <label>{en?'Role':'ভূমিকা'}<select value={userEdit.role||'employee'} onChange={e=>setUserEdit({...userEdit,role:e.target.value})}><option value="employee">{en?'Employee User':'কর্মকর্তা-কর্মচারী'}</option><option value="editor">{en?'Editor':'সম্পাদক'}</option><option value="department_admin">{en?'Department Admin':'বিভাগীয় অ্যাডমিন'}</option><option value="admin">{en?'Admin':'অ্যাডমিন'}</option><option value="super_admin">{en?'Super Admin':'সুপার অ্যাডমিন'}</option></select></label>
              <label>{en?'Account type':'অ্যাকাউন্টের ধরন'}<select value={userEdit.account_type||'employee'} onChange={e=>setUserEdit({...userEdit,account_type:e.target.value})}><option value="officer">{en?'Officer':'কর্মকর্তা'}</option><option value="employee">{en?'Employee':'কর্মচারী'}</option></select></label>
              <label className="check-row"><input type="checkbox" checked={!!userEdit.is_active} onChange={e=>setUserEdit({...userEdit,is_active:e.target.checked})}/><span>{en?'Account active':'অ্যাকাউন্ট সক্রিয়'}</span></label>
              <label className="check-row"><input type="checkbox" checked={!!userEdit.email_verified} onChange={e=>setUserEdit({...userEdit,email_verified:e.target.checked})}/><span>{en?'Email verified flag':'ইমেইল ভেরিফাইড স্ট্যাটাস'}</span></label>
            </div>
            <button className="primary admin-save-user" disabled={userBusy} onClick={saveUserAccount}><Save size={16}/>{en?'Save Account Changes':'অ্যাকাউন্ট পরিবর্তন সংরক্ষণ'}</button>
          </section>

          <section className="admin-control-block"><div className="control-block-title"><LockKeyhole/><div><b>{en?'Admin Password Reset':'অ্যাডমিন পাসওয়ার্ড রিসেট'}</b><small>{en?'The current password cannot be viewed. Set a replacement password.':'বর্তমান পাসওয়ার্ড দেখা যাবে না। নতুন পাসওয়ার্ড সেট করুন।'}</small></div></div>
            <label>{en?'New password':'নতুন পাসওয়ার্ড'}<div className="password-admin-row"><input type={showPassword?'text':'password'} value={newPassword} onChange={e=>setNewPassword(e.target.value)} placeholder={en?'Minimum 10 characters':'কমপক্ষে ১০ অক্ষর'}/><button className="icon-btn" type="button" onClick={()=>setShowPassword(v=>!v)}><Eye size={16}/></button></div></label>
            <button className="secondary full" disabled={userBusy||!newPassword} onClick={resetUserPassword}><LockKeyhole size={15}/>{en?'Set New Password':'নতুন পাসওয়ার্ড সেট করুন'}</button>
            <small className="security-copy">{en?'Setting a new password signs the user out from all current sessions.':'নতুন পাসওয়ার্ড সেট করলে ব্যবহারকারীর সব বর্তমান সেশন লগআউট হবে।'}</small>
          </section>

          <section className="admin-control-block"><div className="control-block-title"><ShieldCheck/><div><b>{en?'Recovery Code':'রিকভারি কোড'}</b><small>{selectedUser.account.recovery_ready?(en?'A recovery code is configured.':'একটি রিকভারি কোড সেট করা আছে।'):(en?'No recovery code is configured.':'রিকভারি কোড সেট করা নেই।')}</small></div></div>
            {adminRecovery?<div className="admin-recovery-result"><span>{en?'NEW RECOVERY CODE':'নতুন রিকভারি কোড'}</span><strong>{adminRecovery}</strong><button className="secondary full" onClick={()=>navigator.clipboard?.writeText(adminRecovery)}>{en?'Copy Code':'কোড কপি করুন'}</button><small>{en?'Show this to the user securely. It will not be retrievable later.':'নিরাপদভাবে ব্যবহারকারীকে দিন। পরে এই কোড আর দেখা যাবে না।'}</small></div>:<button className="secondary full" disabled={userBusy} onClick={rotateAdminRecovery}><ShieldCheck size={15}/>{en?'Generate / Replace Recovery Code':'রিকভারি কোড তৈরি / পরিবর্তন'}</button>}
          </section>

          <section className="admin-control-block span-2 user-data-summary"><div className="control-block-title"><Database/><div><b>{en?'Personal Data Summary':'ব্যক্তিগত ডাটা সারসংক্ষেপ'}</b><small>{en?'Records connected to this account.':'এই অ্যাকাউন্টের সঙ্গে যুক্ত রেকর্ড।'}</small></div></div><div className="record-count-grid"><span><b>{selectedUser.profile?1:0}</b>{en?'Career Profile':'ক্যারিয়ার প্রোফাইল'}</span><span><b>{selectedUser.counts?.education||0}</b>{en?'Education':'শিক্ষা'}</span><span><b>{selectedUser.counts?.career_events||0}</b>{en?'Career Events':'ক্যারিয়ার ইভেন্ট'}</span><span><b>{selectedUser.counts?.salary_history||0}</b>{en?'Salary Records':'বেতন রেকর্ড'}</span><span><b>{selectedUser.counts?.leave_records||0}</b>{en?'Leave Records':'ছুটির রেকর্ড'}</span><span><b>{selectedUser.counts?.sessions||0}</b>{en?'Active Sessions':'সক্রিয় সেশন'}</span></div></section>

          <section className="admin-danger-zone span-2"><div><b>{en?'Security & Destructive Actions':'নিরাপত্তা ও স্থায়ী কার্যক্রম'}</b><p>{en?'Use these only when account recovery, access revocation or permanent removal is required.':'শুধু অ্যাকাউন্ট রিকভারি, প্রবেশাধিকার বন্ধ বা স্থায়ীভাবে মুছে ফেলার প্রয়োজন হলে ব্যবহার করুন।'}</p></div><div className="danger-actions"><button className="secondary" disabled={userBusy} onClick={logoutUserEverywhere}><LogOut size={15}/>{en?'Logout All Devices':'সব ডিভাইস লগআউট'}</button><button className="danger-button" disabled={userBusy} onClick={deleteManagedUser}><Trash2 size={15}/>{en?'Delete User & Personal Data':'ব্যবহারকারী ও ব্যক্তিগত ডাটা ডিলিট'}</button></div></section>
        </div>
      </section>
    </div>}

    {tab==='content'&&<section className="admin-panel-card">
      <div className="admin-panel-head"><div><h3>{en?'System Content Management':'সিস্টেম কনটেন্ট ব্যবস্থাপনা'}</h3><p>{en?'Public references, notices, policies, forms and help content.':'পাবলিক রেফারেন্স, নোটিশ, নীতিমালা, ফরম ও সহায়তা কনটেন্ট।'}</p></div></div>
      <div className="admin-action-grid compact-actions">
        <button onClick={()=>onPage?.('admin-content')}><Bell/><div><b>{en?'Notices':'নোটিশ'}</b><small>{en?'Publish and pin updates':'আপডেট প্রকাশ/পিন'}</small></div><ChevronRight/></button>
        <button onClick={()=>onPage?.('admin-content')}><BookOpen/><div><b>{en?'Policies & Rules':'নীতিমালা ও বিধি'}</b><small>{en?'Reference library':'রেফারেন্স লাইব্রেরি'}</small></div><ChevronRight/></button>
        <button><FileText/><div><b>{en?'Forms & Links':'ফরম ও লিংক'}</b><small>{en?'Manage useful links':'প্রয়োজনীয় লিংক পরিচালনা'}</small></div><ChevronRight/></button>
        <button><HelpCircle/><div><b>{en?'Help & FAQ':'সহায়তা ও প্রশ্নোত্তর'}</b><small>{en?'Support guidance':'ব্যবহার সহায়িকা'}</small></div><ChevronRight/></button>
      </div>
    </section>}

    {tab==='rules'&&<section className="admin-panel-card">
      <div className="admin-panel-head"><div><h3>{en?'Calculator Rules Registry':'ক্যালকুলেটর রুলস রেজিস্ট্রি'}</h3><p>{en?'Calculator formulas are managed centrally.':'ক্যালকুলেটরের সূত্রগুলো কেন্দ্রীয়ভাবে পরিচালিত হয়।'}</p></div></div>
      <div className="rules-registry">
        <article><TrendingUp/><div><b>{en?'Promotion Rules':'পদোন্নতি নীতিমালা'}</b><p>{en?'Education-based service requirement, service points and one-year process.':'শিক্ষাগত যোগ্যতাভিত্তিক চাকরিকাল, সার্ভিস পয়েন্ট ও ১ বছরের প্রক্রিয়া।'}</p></div><span>{en?'Active':'সক্রিয়'}</span></article>
        <article><WalletCards/><div><b>{en?'Pay Scale Rules':'পে-স্কেল নিয়ম'}</b><p>{en?'2015 stage, 2026 fixation, implementation rate, allowances and deductions.':'২০১৫ ধাপ, ২০২৬ ফিক্সেশন, বাস্তবায়ন হার, ভাতা ও কর্তন।'}</p></div><span>{en?'Active':'সক্রিয়'}</span></article>
        <article><Calculator/><div><b>{en?'General Calculators':'সাধারণ ক্যালকুলেটর'}</b><p>{en?'Service length, age, date difference and retirement estimate.':'চাকরিকাল, বয়স, তারিখের ব্যবধান ও অবসর তারিখ অনুমান।'}</p></div><span>{en?'Active':'সক্রিয়'}</span></article>
      </div>
      
    </section>}

    {tab==='calendar'&&<section className="admin-panel-card">
      <div className="admin-panel-head"><div><h3>{en?'Calendar Reference Management':'ক্যালেন্ডার রেফারেন্স ব্যবস্থাপনা'}</h3><p>{en?'Maintain the published source and explicit office-holiday records. Friday and Saturday are calculated automatically.':'প্রকাশিত উৎস ও নির্দিষ্ট অফিস-ছুটির রেকর্ড পরিচালনা করুন। শুক্রবার ও শনিবার স্বয়ংক্রিয়ভাবে হিসাব হবে।'}</p></div></div>
      <div className="form-grid">
        <label>{en?'Calendar reference enabled':'ক্যালেন্ডার রেফারেন্স চালু'}<select value={settings.calendar_enabled||'0'} onChange={e=>setSettings({...settings,calendar_enabled:e.target.value})}><option value="0">{en?'No':'না'}</option><option value="1">{en?'Yes':'হ্যাঁ'}</option></select></label>
        <label>{en?'Published source URL':'প্রকাশিত উৎসের URL'}<input value={settings.calendar_source_url||''} onChange={e=>setSettings({...settings,calendar_source_url:e.target.value})} placeholder="https://..."/></label>
      </div>
      
      <button className="primary" onClick={saveSettings}><Save size={16}/>{en?'Save Calendar Settings':'ক্যালেন্ডার সেটিংস সংরক্ষণ'}</button>
      <AdminOfficeCalendarManager lang={lang}/>
    </section>}

    {tab==='security'&&<section className="admin-panel-card">
      <div className="admin-panel-head"><div><h3>{en?'Security Center':'নিরাপত্তা কেন্দ্র'}</h3><p>{en?'Session state, user status and authentication health.':'সেশন অবস্থা, ব্যবহারকারী স্ট্যাটাস ও অথেনটিকেশন স্বাস্থ্য।'}</p></div></div>
      <section className="admin-metrics-grid small">
        <AdminMetric label={en?'Active Sessions':'সক্রিয় সেশন'} value={health?.active_sessions} icon={LockKeyhole}/>
        <AdminMetric label={en?'Expired Sessions':'মেয়াদোত্তীর্ণ সেশন'} value={health?.expired_sessions} icon={Clock3}/>
        <AdminMetric label={en?'Inactive Users':'নিষ্ক্রিয় ব্যবহারকারী'} value={health?.inactive_users} icon={ShieldAlert}/>
        <AdminMetric label={en?'Recovery-ready Users':'রিকভারি প্রস্তুত ব্যবহারকারী'} value={health?.recovery_ready_users} icon={ShieldCheck}/>
      </section>
      <div className="notice"><b>{en?'Recovery model:':'রিকভারি মডেল:'}</b> {en?'Recovery codes are stored as hashes only; no email/SMS/domain dependency.':'রিকভারি কোড শুধু হ্যাশ হিসেবে সংরক্ষিত; কোনো ইমেইল/এসএমএস/ডোমেইন নির্ভরতা নেই।'}</div>
    </section>}

    {tab==='audit'&&<section className="admin-panel-card">
      <div className="admin-panel-head"><div><h3>{en?'Audit Logs':'অডিট লগ'}</h3><p>{en?'Recent system-level changes and actions.':'সাম্প্রতিক সিস্টেম পরিবর্তন ও কার্যক্রম।'}</p></div></div>
      <div className="audit-list">{auditRows.length===0?<div className="empty">{en?'No audit entries found.':'কোনো অডিট রেকর্ড পাওয়া যায়নি।'}</div>:auditRows.map(x=><article key={x.id}><div className="audit-icon"><History size={15}/></div><div><b>{x.action}</b><p>{x.user_name||'System'} · {x.entity_type||'—'} {x.entity_id?`#${x.entity_id}`:''}</p></div><time>{x.created_at||'—'}</time></article>)}</div>
    </section>}

    {tab==='settings'&&<section className="admin-panel-card">
      <div className="admin-panel-head"><div><h3>{en?'System Settings':'সিস্টেম সেটিংস'}</h3><p>{en?'Safe platform-level configuration.':'নিরাপদ প্ল্যাটফর্ম-স্তরের কনফিগারেশন।'}</p></div></div>
      <div className="form-grid">
        <label>{en?'Support phone':'সহায়তা ফোন'}<input value={settings.support_phone||''} onChange={e=>setSettings({...settings,support_phone:e.target.value})}/></label>
        <label>{en?'WhatsApp':'হোয়াটসঅ্যাপ'}<input value={settings.whatsapp||''} onChange={e=>setSettings({...settings,whatsapp:e.target.value})}/></label>
        <label>{en?'Maintenance mode':'রক্ষণাবেক্ষণ মোড'}<select value={settings.maintenance_mode||'0'} onChange={e=>setSettings({...settings,maintenance_mode:e.target.value})}><option value="0">{en?'Off':'বন্ধ'}</option><option value="1">{en?'On':'চালু'}</option></select></label>
      </div>
      <button className="primary" onClick={saveSettings}><Save size={16}/>{en?'Save Settings':'সেটিংস সংরক্ষণ'}</button>
    </section>}
  </div>
}

function AdminPanel({lang='bn',onPage}){return <SuperAdminControlCenter lang={lang} onPage={onPage}/>}

function App(){
  useEffect(()=>{
    const touch=('ontouchstart' in window)||navigator.maxTouchPoints>0;
    const apply=()=>document.documentElement.classList.toggle('mobile-device',touch&&window.innerWidth<=1180);
    apply();window.addEventListener('resize',apply);
    return()=>window.removeEventListener('resize',apply);
  },[]);
  useEffect(()=>{
    let alive=true;
    const report=async(next)=>{
      if(!alive||!next.installed||localStorage.getItem('hisab_pwa_install_reported')==='1')return;
      try{await recordPwaInstall()}catch{}
    };
    report(getPwaState());
    const unsub=subscribePwa(report);
    return()=>{alive=false;unsub?.()};
  },[]);
  const params=new URLSearchParams(window.location.search);
  const queryAuth=params.get('auth')||'';
  const queryToken=params.get('token')||'';
  const sharedReportToken=params.get('shared_report')||'';
  const[user,setUser]=useState(null),[loading,setLoading]=useState(true),[page,setPage]=useState('dashboard'),
    [showLogin,setShowLogin]=useState(()=>!!queryAuth),[authMode,setAuthMode]=useState(()=>queryAuth||'login'),[authToken,setAuthToken]=useState(()=>queryToken),
    [lang,setLang]=useState('bn'),[mobileMenu,setMobileMenu]=useState(false);
  useEffect(()=>{if(sharedReportToken){setLoading(false);return}api('/api/me').then(x=>setUser(x.user)).catch(()=>{}).finally(()=>setLoading(false))},[sharedReportToken]);
  useEffect(()=>{setMobileMenu(false)},[page]);
  useEffect(()=>{
    document.body.classList.toggle('mobile-drawer-open',mobileMenu);
    return()=>document.body.classList.remove('mobile-drawer-open');
  },[mobileMenu]);
  async function logout(){try{await api('/api/logout',{method:'POST'})}catch{}setLang('bn');setUser(null);setShowLogin(false);setPage('dashboard')}
  useEffect(()=>{if(user&&page)api('/api/usage',{method:'POST',body:JSON.stringify({module:page})}).catch(()=>{})},[user?.id,page]);
  if(sharedReportToken)return <SharedReportViewer token={sharedReportToken} lang={lang} setLang={setLang}/>;
  if(loading)return <div className="loading">Loading...</div>;
  if(!user)return showLogin?<AuthPortal onLogin={u=>{setLang('bn');setUser(u);window.history.replaceState({},'',window.location.pathname)}} onBack={()=>{setShowLogin(false);setAuthMode('login');setAuthToken('');window.history.replaceState({},'',window.location.pathname)}} lang={lang} setLang={setLang} initialMode={authMode} initialToken={authToken}/>:<PublicHome onLogin={()=>{setAuthMode('login');setShowLogin(true)}} onSignup={()=>{setAuthMode('register');setShowLogin(true)}} lang={lang} setLang={setLang}/>;
  const admin=['super_admin','admin','department_admin'].includes(user.role);
  return <div className={`app ${mobileMenu?'mobile-menu-open':''}`}><button className={`mobile-drawer-backdrop ${mobileMenu?'show':''}`} aria-label={lang==='en'?'Close menu':'মেনু বন্ধ করুন'} onClick={()=>setMobileMenu(false)}></button><aside className={`side ${mobileMenu?'mobile-open':''}`}>
    <div className="brand"><div><b>{lang==='en'?'Hisab Sahayika':'হিসাব সহায়িকা'}</b><small>{lang==='en'?'Independent · unofficial':'স্বাধীন · অনানুষ্ঠানিক'}</small></div><button className="mobile-drawer-close" onClick={()=>setMobileMenu(false)} aria-label={lang==='en'?'Close menu':'মেনু বন্ধ করুন'}><X size={19}/></button></div>
    <nav className="smart-side-nav">
      <div className="side-group"><small>{lang==='en'?'MAIN':'প্রধান'}</small>
        <button className={page==='dashboard'?'active':''} onClick={()=>setPage('dashboard')}><LayoutDashboard size={18}/>{lang==='en'?'Dashboard':'ড্যাশবোর্ড'}</button>
        <button className={page==='career'?'active':''} onClick={()=>setPage('career')}><UserRound size={18}/>{lang==='en'?'My Profile & Career':'আমার প্রোফাইল ও চাকরি'}</button>
      </div>
      <div className="side-group"><small>{lang==='en'?'CAREER':'ক্যারিয়ার'}</small>
        <button className={page==='promotion'?'active':''} onClick={()=>setPage('promotion')}><TrendingUp size={18}/>{lang==='en'?'Promotion':'পদোন্নতি'}</button>
        <button className={page==='promotion-timeline'?'active':''} onClick={()=>setPage('promotion-timeline')}><Route size={18}/>{lang==='en'?'Career Roadmap':'ক্যারিয়ার রোডম্যাপ'}</button>
      </div>
      <div className="side-group"><small>{lang==='en'?'CALCULATIONS':'হিসাব'}</small>
        <button className={page==='points'?'active':''} onClick={()=>setPage('points')}><Award size={18}/>{lang==='en'?'Points Calculator':'পয়েন্ট ক্যালকুলেটর'}</button>
        <button className={page==='salary'?'active':''} onClick={()=>setPage('salary')}><WalletCards size={18}/>{lang==='en'?'Pay Scale & Salary':'পে-স্কেল ও বেতন'}</button>
        <button className={page==='salary-history'?'active':''} onClick={()=>setPage('salary-history')}><ReceiptText size={18}/>{lang==='en'?'Salary History':'বেতন ইতিহাস'}</button>
        <button className={page==='calculators'?'active':''} onClick={()=>setPage('calculators')}><Calculator size={18}/>{lang==='en'?'Calculator Center':'ক্যালকুলেটর সেন্টার'}</button>
      </div>
      <div className="side-group"><small>{lang==='en'?'PERSONAL RECORDS':'ব্যক্তিগত রেকর্ড'}</small>
        <button className={page==='leave'?'active':''} onClick={()=>setPage('leave')}><CalendarDays size={18}/>{lang==='en'?'Leave Record':'ছুটির হিসাব'}</button>
        <button className={page==='calendar'?'active':''} onClick={()=>setPage('calendar')}><CalendarDays size={18}/>{lang==='en'?'Calendar':'ক্যালেন্ডার'}</button>
        <button className={page==='reports'?'active':''} onClick={()=>setPage('reports')}><FileText size={18}/>{lang==='en'?'My Reports':'আমার রিপোর্ট'}</button>
      </div>
      <div className="side-group"><small>{lang==='en'?'INFORMATION':'তথ্য ও সহায়তা'}</small>
        <button className={page==='library'?'active':''} onClick={()=>setPage('library')}><BookOpen size={18}/>{lang==='en'?'Knowledge Center':'নলেজ সেন্টার'}</button>
        <button className={page==='privacy'?'active':''} onClick={()=>setPage('privacy')}><ShieldCheck size={18}/>{lang==='en'?'Data & Privacy':'ডাটা ও গোপনীয়তা'}</button>
      </div>
      <div className="side-group"><small>{lang==='en'?'ACCOUNT':'অ্যাকাউন্ট'}</small>
        <button className={page==='account'?'active':''} onClick={()=>setPage('account')}><LockKeyhole size={18}/>{lang==='en'?'Account & Security':'অ্যাকাউন্ট ও নিরাপত্তা'}</button>
        {admin&&<button className={page==='admin'?'active':''} onClick={()=>setPage('admin')}><ShieldCheck size={18}/>{lang==='en'?'System Control':'সিস্টেম কন্ট্রোল'}</button>}
      </div>
    </nav></aside>
    <main><header className="app-topbar"><div className="mobile-topbar-left"><button className={`mobile-menu-trigger text-menu-trigger ${mobileMenu?'active':''}`} onClick={()=>setMobileMenu(v=>!v)} aria-expanded={mobileMenu} aria-label={lang==='en'?(mobileMenu?'Close menu':'Open menu'):(mobileMenu?'মেনু বন্ধ করুন':'মেনু খুলুন')}><span>{lang==='en'?(mobileMenu?'Close Menu':'Menu'):(mobileMenu?'মেনু বন্ধ':'মেনু')}</span></button><div><h2>{lang==='en'?`Welcome, ${user.name}`:`স্বাগতম, ${user.name}`}</h2><p>{lang==='en'?(roleLabel[user.role]||user.role):({super_admin:'সিস্টেম ব্যবস্থাপক',admin:'অ্যাডমিন',department_admin:'বিভাগীয় অ্যাডমিন',editor:'সম্পাদক',employee:'কর্মকর্তা-কর্মচারী'}[user.role]||user.role)}</p></div></div><div className="header-actions"><PwaControls lang={lang}/><LangToggle lang={lang} setLang={setLang}/><button className="logout" onClick={logout}><LogOut size={16}/><span>{lang==='en'?'Logout':'লগআউট'}</span></button></div></header>
      {page==='dashboard'&&<DashboardHome user={user} onPage={setPage} lang={lang}/>} 
      {page==='career'&&<MyCareer lang={lang}/>}
      {page==='promotion'&&<PromotionCenter lang={lang}/>}
      {page==='promotion-timeline'&&<PromotionCareerTimeline lang={lang} onPage={setPage}/>}
      {page==='salary'&&<SalaryCalculator lang={lang}/>} 
      {page==='salary-history'&&<SalaryHistory lang={lang}/>}
      {page==='leave'&&<PersonalLeaveRecord lang={lang}/>} 
      {page==='calendar'&&<LoggedInOfficeCalendar lang={lang}/>} 
      {page==='calculators'&&<CalculatorCenter lang={lang} onPage={setPage}/>}
      {page==='points'&&<PointsCalculator lang={lang}/>}
      {page==='admin-content'&&admin&&<NoticePolicyCenter lang={lang} canManage={true}/>}
      {page==='library'&&<KnowledgeCenter lang={lang}/>}
      {page==='reports'&&<PersonalCareerReports lang={lang}/>}
      {page==='privacy'&&<PrivacyControlCenter lang={lang}/>}
      {page==='release-status'&&admin&&<FinalReleaseStatus lang={lang}/>} 
      {page==='account'&&<AccountSecurity lang={lang}/>}
      {page==='employees'&&admin&&<EmployeeManagement lang={lang}/>}
      {page==='directory'&&admin&&<MasterDirectory lang={lang}/>}
      {page==='admin'&&admin&&<AdminPanel lang={lang} onPage={setPage}/>}
    </main>
    <nav className="mobile-bottom-nav" aria-label={lang==='en'?'Mobile navigation':'মোবাইল নেভিগেশন'}>
      <button className={page==='dashboard'?'active':''} onClick={()=>setPage('dashboard')}><LayoutDashboard/><span>{lang==='en'?'Home':'হোম'}</span></button>
      <button className={page==='salary'?'active':''} onClick={()=>setPage('salary')}><WalletCards/><span>{lang==='en'?'Salary':'বেতন'}</span></button>
      <button className={['promotion','promotion-timeline'].includes(page)?'active':''} onClick={()=>setPage('promotion')}><TrendingUp/><span>{lang==='en'?'Career':'ক্যারিয়ার'}</span></button>
      <button className={mobileMenu?'active':''} onClick={()=>setMobileMenu(v=>!v)}><Boxes/><span>{lang==='en'?'Services':'সেবা'}</span></button>
      <button className={page==='career'?'active':''} onClick={()=>setPage('career')}><UserRound/><span>{lang==='en'?'My':'আমার'}</span></button>
    </nav>
    <a className="floating-whatsapp logged-in-whatsapp" href={`https://wa.me/8801759084692?text=${encodeURIComponent(lang==='en'?'Hello, I need help with Hisab Sahayika.':'আসসালামু আলাইকুম, হিসাব সহায়িকা অ্যাপ বিষয়ে সহায়তা প্রয়োজন।')}`} target="_blank" rel="noreferrer" aria-label={lang==='en'?'Message on WhatsApp':'হোয়াটসঅ্যাপে মেসেজ করুন'}><MessageCircle/><span>{lang==='en'?'WhatsApp':'হোয়াটসঅ্যাপ'}</span></a>
  </div>
}
createRoot(document.getElementById('root')).render(<App/>);
