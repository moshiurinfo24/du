
import React,{useEffect,useMemo,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {
  LayoutDashboard,TrendingUp,WalletCards,Users,ShieldCheck,LogOut,Plus,Search,
  UserRound,Building2,IdCard,Activity,ChevronRight,X,Save,Trash2,RefreshCw,
  Settings,Database,LockKeyhole,Home,BookOpen,Calculator,HelpCircle,Phone,
  Bell,ArrowRight,CalendarDays,CheckCircle2,AlertTriangle,Landmark,FileText,Camera,Briefcase,MapPin,Mail,PhoneCall,Edit3,UserCircle2,History,ArrowRightLeft,GraduationCap,BadgeDollarSign,Clock3,FileClock
} from 'lucide-react';
import './styles.css';
import {
  PAY2015,PAY2026,PROMO_RULES,money,fmtDate,diffYMD,durationBn,addYears,
  annualPromotionCycle,futureRoadmap,serviceExperiencePoints,fixed2026,implementationRate,houseRent2015
} from './rules';

const API=import.meta.env.VITE_API_URL||import.meta.env.VITE_API_BASE||'';
async function api(path,opts={}){
  const r=await fetch(API+path,{credentials:'include',headers:{'Content-Type':'application/json',...(opts.headers||{})},...opts});
  const d=await r.json().catch(()=>({}));
  if(!r.ok) throw new Error(d.error||d.detail||'Request failed');
  return d;
}
const roleLabel={super_admin:'Super Admin',admin:'Admin',department_admin:'Department Admin',editor:'Editor',employee:'Employee'};
const I18N={
  bn:{
    appName:'কর্মকর্তা-কর্মচারী ডিজিটাল সেবা',
    appSub:'স্বাধীন ডিজিটাল সেবা প্ল্যাটফর্ম',
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
    appName:'Employee Digital Service Platform',
    appSub:'Independent Digital Service Platform',
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

function todayLocalIso(){const d=new Date();const y=d.getFullYear();const m=String(d.getMonth()+1).padStart(2,'0');const day=String(d.getDate()).padStart(2,'0');return `${y}-${m}-${day}`}
function fmtDateLang(d,lang='bn'){if(!d||isNaN(new Date(d)))return '—';return new Intl.DateTimeFormat(lang==='en'?'en-GB':'bn-BD',{day:'2-digit',month:'long',year:'numeric'}).format(new Date(d))}
function numLang(v,lang='bn',digits=2){return Number(v||0).toLocaleString(lang==='en'?'en-US':'bn-BD',{maximumFractionDigits:digits})}
function moneyLang(v,lang='bn'){return Math.round(Number(v||0)).toLocaleString(lang==='en'?'en-US':'bn-BD',{maximumFractionDigits:0})}


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
const eduBn={masters:'মাস্টার্স',bachelor:'স্নাতক',hsc:'এইচএসসি',diploma:'ডিপ্লোমা',bsceng:'বিএসসি ইঞ্জিনিয়ারিং',mbbs:'এমবিবিএস'};
const categoryBn={officer:'কর্মকর্তা',class3:'তৃতীয় শ্রেণি',class4:'চতুর্থ শ্রেণি'};
function reportShell(title,subtitle,body,lang='bn'){
  const en=lang==='en';
  return `<div style="width:194mm;box-sizing:border-box;font-family:'Noto Sans Bengali','Hind Siliguri',Arial,sans-serif;color:#172033;background:#fff;padding:10mm 10mm 12mm;line-height:1.55;font-size:11.5px">
    <div style="border:1px solid #d9dfeb;border-radius:14px;overflow:hidden">
      <div style="background:linear-gradient(135deg,#111936,#263f74);color:#fff;padding:18px 22px">
        <div style="font-size:10px;letter-spacing:.7px;opacity:.8">${en?'Employee Digital Service Platform':'কর্মকর্তা-কর্মচারী ডিজিটাল সেবা'}</div>
        <div style="font-size:22px;font-weight:800;margin-top:4px">${escapeHtml(title)}</div>
        <div style="font-size:10.5px;opacity:.86;margin-top:4px">${escapeHtml(subtitle)}</div>
      </div>
      <div style="padding:18px 22px">${body}</div>
      <div style="border-top:1px solid #e3e7ef;padding:12px 22px;color:#667085;font-size:9.5px;background:#f8fafc">
        ${en?'This is an independent and unofficial digital service platform. Verify the applicable rules/orders before any final administrative or financial decision.':'এটি একটি স্বাধীন ও অনানুষ্ঠানিক ডিজিটাল সেবা প্ল্যাটফর্ম। চূড়ান্ত প্রশাসনিক/আর্থিক সিদ্ধান্তের জন্য প্রযোজ্য বিধি ও আদেশ যাচাই করুন।'}<br>
        ${en?'Report generated':'প্রতিবেদন তৈরি'}: ${new Date().toLocaleString(en?'en-GB':'bn-BD')}
      </div>
    </div>
  </div>`;
}
function kv(label,value){return `<div style="display:flex;justify-content:space-between;gap:16px;padding:7px 0;border-bottom:1px dashed #dfe4ec"><span style="color:#667085">${escapeHtml(label)}</span><b style="text-align:right;color:#182230">${escapeHtml(value)}</b></div>`}
function section(title,content){return `<div style="margin:14px 0 0;page-break-inside:avoid"><div style="font-size:13px;font-weight:800;color:#1d3263;margin-bottom:5px">${escapeHtml(title)}</div><div style="border:1px solid #e1e6ef;border-radius:10px;padding:9px 12px;background:#fff">${content}</div></div>`}
async function saveA4Pdf(element,filename){
  if(!element)throw new Error('PDF preview is not available');
  const html2pdf=await loadHtml2Pdf();
  await document.fonts?.ready?.catch?.(()=>{});
  await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
  await html2pdf().set({
    margin:[6,6,6,6],filename,
    image:{type:'jpeg',quality:.98},
    html2canvas:{scale:2,useCORS:true,backgroundColor:'#ffffff',logging:false,scrollX:0,scrollY:0},
    jsPDF:{unit:'mm',format:'a4',orientation:'portrait'},
    pagebreak:{mode:['css','legacy'],avoid:['.pdf-keep']}
  }).from(element).save();
}
function PdfPreviewModal({html,filename,onClose,lang='bn'}){
  const reportRef=useRef(null); const[busy,setBusy]=useState(false); const en=lang==='en';
  async function download(){try{setBusy(true);await saveA4Pdf(reportRef.current,filename)}catch(e){alert((en?'PDF could not be created: ':'PDF তৈরি করা যায়নি: ')+e.message)}finally{setBusy(false)}}
  useEffect(()=>{const onKey=e=>{if(e.key==='Escape')onClose?.()};document.addEventListener('keydown',onKey);const prev=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{document.removeEventListener('keydown',onKey);document.body.style.overflow=prev}},[onClose]);
  return <div style={{position:'fixed',inset:0,zIndex:99999,background:'rgba(7,12,28,.78)',backdropFilter:'blur(8px)',display:'flex',flexDirection:'column'}}>
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,padding:'12px 18px',background:'#101936',color:'#fff',boxShadow:'0 8px 28px rgba(0,0,0,.24)'}}>
      <div><b style={{fontSize:16}}>{en?'A4 PDF Preview':'A4 PDF প্রিভিউ'}</b><div style={{fontSize:12,opacity:.78}}>{en?'Check the information first, then download the PDF.':'তথ্য যাচাই করে তারপর PDF ডাউনলোড করুন।'}</div></div>
      <div style={{display:'flex',gap:10,flexWrap:'wrap',justifyContent:'flex-end'}}>
        <button onClick={onClose} style={{border:'1px solid rgba(255,255,255,.28)',background:'transparent',color:'#fff',padding:'9px 14px',borderRadius:10,cursor:'pointer'}}>{en?'Close':'বন্ধ করুন'}</button>
        <button onClick={download} disabled={busy} style={{border:0,background:'linear-gradient(135deg,#d7a84f,#f0c86e)',color:'#17120a',fontWeight:800,padding:'9px 15px',borderRadius:10,cursor:busy?'wait':'pointer',opacity:busy?.7:1}}>{busy?(en?'Creating PDF...':'PDF তৈরি হচ্ছে...'):(en?'Download PDF':'PDF ডাউনলোড')}</button>
      </div>
    </div>
    <div style={{flex:1,overflow:'auto',padding:'24px 12px 40px'}}><div style={{width:'210mm',minHeight:'297mm',margin:'0 auto',background:'#fff',boxShadow:'0 18px 60px rgba(0,0,0,.34)',padding:'8mm',boxSizing:'border-box'}}><div ref={reportRef} style={{background:'#fff'}} dangerouslySetInnerHTML={{__html:html}}/></div></div>
  </div>
}
function promotionReportHtml(r,lang='bn'){
  const en=lang==='en', f=r.input||{};
  const edu=en?{masters:'Masters',bachelor:"Bachelor's",hsc:'HSC',diploma:'Diploma',bsceng:'BSc Engineering',mbbs:'MBBS'}:eduBn;
  let overview=kv(en?'Current grade':'বর্তমান গ্রেড',`${en?'Grade':'গ্রেড'} ${f.grade||'—'}`)+kv(en?'Education':'শিক্ষাগত যোগ্যতা',edu[f.edu]||f.edu||'—')+kv(en?'Current post joining date':'বর্তমান পদে যোগদান',f.currentDate?fmtDateLang(f.currentDate,lang):'—')+kv(en?'First joining date':'প্রথম যোগদান',f.firstJoinDate?fmtDateLang(f.firstJoinDate,lang):'—')+kv(en?'Calculation date':'হিসাবের তারিখ',fmtDateLang(f.calcDate||todayLocalIso(),lang))+kv(en?'Computer skill/training':'কম্পিউটার দক্ষতা/প্রশিক্ষণ',f.computer==='yes'?(en?'Yes':'আছে'):(en?'No':'নেই'))+kv(en?'ACR condition':'ACR শর্ত',f.acr==='yes'?(en?'Satisfactory':'সন্তোষজনক'):(en?'Incomplete / No':'অসম্পূর্ণ/না'));
  let result='';
  if(r.stop) result=kv(en?'Result':'ফলাফল',r.rule.target)+kv(en?'Reference':'রেফারেন্স',r.rule.ref||r.rule.page||'—');
  else result=kv(en?'Next promotion level':'সম্ভাব্য পরবর্তী পদ/ধাপ',`${r.rule.target} - ${en?'Grade':'গ্রেড'} ${r.rule.targetGrade}`)+kv(en?'Eligibility date':'নীতিগত যোগ্যতার তারিখ',fmtDateLang(r.eligible,lang))+kv(en?'Application/circular deadline':'আবেদন/সার্কুলার সময়সীমা',fmtDateLang(r.cycle.circularDeadline,lang))+kv(en?'Projected final promotion date':'পদোন্নতির সম্ভাব্য চূড়ান্ত তারিখ',fmtDateLang(r.cycle.completionDeadline,lang))+kv(en?'Required service':'প্রয়োজনীয় অভিজ্ঞতা',`${numLang(r.req,lang,0)} ${en?'years':'বছর'}`)+kv(en?'Service in current post':'বর্তমান পদে চাকরি',en?`${r.elapsed.y} years ${r.elapsed.m} months ${r.elapsed.d} days`:durationBn(r.elapsed))+kv(en?'Remaining time':'অবশিষ্ট সময়',(r.remaining.y||r.remaining.m||r.remaining.d)?(en?`${r.remaining.y} years ${r.remaining.m} months ${r.remaining.d} days`:durationBn(r.remaining)):(en?'Completed':'সময় পূর্ণ'))+kv(en?'Total service points':'মোট সার্ভিস পয়েন্ট',numLang(r.points,lang))+kv(en?'Current post points':'বর্তমান পদের পয়েন্ট',numLang(r.exp?.currentPoints||0,lang))+kv(en?'Previous service points':'পূর্ববর্তী মোট চাকরিকালের পয়েন্ট',numLang(r.exp?.priorServicePoints||0,lang))+kv(en?'Primary conditions':'প্রাথমিক শর্তের অবস্থা',r.prelim?(en?'Satisfied':'যোগ্যতার মূল শর্ত পূর্ণ'):(en?'One or more conditions incomplete':'এক বা একাধিক শর্ত অসম্পূর্ণ'));
  let roadmap=''; if(!r.stop&&r.roadmap?.length) roadmap=r.roadmap.map((x,i)=>x.stop?kv(`${i+1}. ${en?'After grade':'গ্রেড'} ${x.fromGrade}`,x.label):kv(`${i+1}. ${en?'Grade':'গ্রেড'} ${x.fromGrade} → ${x.toGrade}`,`${x.title} | ${x.years} ${en?'years':'বছর'} | ${en?'Projected final promotion':'সম্ভাব্য চূড়ান্ত পদোন্নতি'}: ${fmtDateLang(x.completionDeadline,lang)}`)).join('');
  const body=section(en?'Input information':'প্রদত্ত তথ্য',overview)+section(en?'Detailed calculation':'হিসাবের বিস্তারিত ফলাফল',result)+(roadmap?section(en?'Future promotion roadmap':'ভবিষ্যৎ সম্ভাব্য পদোন্নতি রোডম্যাপ',roadmap):'')+`<div style="margin-top:14px;padding:10px 12px;border-left:4px solid #d59b35;background:#fff8e8;border-radius:8px;font-size:10.5px"><b>${en?'Important:':'গুরুত্বপূর্ণ:'}</b> ${en?'After eligibility is achieved, the application, scrutiny and approval process is calculated as one full year. The displayed final date is therefore one year after the eligibility date and is a projected date, not a guaranteed administrative order date.':'যোগ্যতা অর্জনের পর আবেদন দাখিল, যাচাই-বাছাই ও অনুমোদনসহ সম্পূর্ণ পদোন্নতি প্রক্রিয়ার জন্য ১ পূর্ণ বছর ধরা হয়েছে। তাই সম্ভাব্য চূড়ান্ত পদোন্নতির তারিখ যোগ্যতার তারিখের ১ বছর পরে দেখানো হয়; এটি প্রশাসনিক আদেশের নিশ্চিত তারিখ নয়।'}</div>`;
  return reportShell(en?'Detailed Promotion Calculation Report':'পদোন্নতি হিসাবের বিস্তারিত প্রতিবেদন',en?'A4 PDF · eligibility, service points, one-year promotion process and future roadmap':'A4 PDF · যোগ্যতা, অভিজ্ঞতা পয়েন্ট, ১ বছরের পদোন্নতি প্রক্রিয়া ও ভবিষ্যৎ রোডম্যাপ',body,lang);
}
function salaryReportHtml(r,lang='bn'){
  const en=lang==='en',f=r.input||{};
  const cat=en?{officer:'Officer',class3:'Class III',class4:'Class IV'}:{officer:'কর্মকর্তা',class3:'তৃতীয় শ্রেণি',class4:'চতুর্থ শ্রেণি'};
  const amt=v=>`${en?'Tk':'৳'} ${moneyLang(v,lang)}`;
  const row=(label,value,bold=false)=>`<div style="display:grid;grid-template-columns:1fr auto;gap:18px;padding:7px 0;border-bottom:1px solid #e8ebf1"><span style="color:#4b5565">${escapeHtml(label)}</span><span style="font-weight:${bold?800:650};color:#172033;text-align:right">${escapeHtml(value)}</span></div>`;
  const earningRows=[
    [en?'Payable basic':'প্রাপ্য মূল বেতন',r.payable],
    [en?'House rent':'বাড়িভাড়া',r.house],
    [en?'Medical allowance':'চিকিৎসা ভাতা',r.medical],
    [en?'Education allowance':'শিক্ষা ভাতা',r.education],
    [en?'Tiffin allowance':'টিফিন ভাতা',r.tiffin],
    [en?'Conveyance allowance':'যাতায়াত ভাতা',r.conveyance]
  ];
  const deductionRows=[
    [en?'Provident fund subscription (10%)':'ভবিষ্য তহবিল সাবস্ক্রিপশন (১০%)',r.pf],
    [en?'Benevolent fund':'কল্যাণ তহবিল',r.bene],
    [en?'Health insurance':'স্বাস্থ্য বীমা',r.health],
    [en?'Group insurance':'গ্রুপ বীমা',r.group],
    [en?'Revenue stamp':'রাজস্ব স্ট্যাম্প',r.stamp],
    [en?'Association':'সমিতি',r.association],
    [en?'Income tax':'আয়কর',r.tax],
    [en?'Loan':'ঋণ',r.loan],
    [en?'Other':'অন্যান্য',r.other]
  ];
  const meta=`<div style="display:grid;grid-template-columns:1fr 1fr;gap:0 26px">
    ${row(en?'Calculation date':'হিসাবের তারিখ',fmtDateLang(f.date||todayLocalIso(),lang))}
    ${row(en?'Grade':'গ্রেড',`${en?'Grade':'গ্রেড'} ${numLang(r.grade,lang,0)}`)}
    ${row(en?'Current 2015 pay stage':'বর্তমান ২০১৫ বেতন ধাপ',`${en?'Stage':'ধাপ'} ${numLang(r.currentIndex+1,lang,0)}`)}
    ${row(en?'Current 2015 basic':'বর্তমান ২০১৫ মূল বেতন',amt(r.currentBasic))}
    ${row(en?'2026 full fixed basic':'২০২৬ পূর্ণ নির্ধারিত মূল বেতন',amt(r.fixed))}
    ${row(en?'Implementation rate':'বাস্তবায়ন হার',`${numLang(r.rate*100,lang,0)}%`)}
    ${row(en?'Employee category':'কর্মচারী শ্রেণি',cat[f.category]||'—')}
    ${row(en?'Work location':'কর্মস্থল',f.zone==='dhaka'?(en?'Dhaka City':'ঢাকা সিটি'):(en?'Other':'অন্যান্য'))}
  </div>`;
  const earn=earningRows.map(([l,v])=>row(l,amt(v))).join('')+row(en?'Gross salary':'মোট প্রাপ্য',amt(r.gross),true);
  const ded=deductionRows.map(([l,v])=>row(l,amt(v))).join('')+row(en?'Total deductions':'মোট কর্তন',amt(r.deductions),true);
  const title=en?'Salary Calculation Payslip':'বেতন হিসাব পে-স্লিপ';
  const body=`
    <div style="border:1px solid #dce2ec;border-radius:12px;padding:14px 16px;background:#fafbfe">${meta}</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:14px;align-items:start">
      <div style="border:1px solid #dce2ec;border-radius:12px;padding:12px 14px"><div style="font-size:13px;font-weight:800;color:#1d3263;margin-bottom:4px">${en?'Earnings':'প্রাপ্যসমূহ'}</div>${earn}</div>
      <div style="border:1px solid #dce2ec;border-radius:12px;padding:12px 14px"><div style="font-size:13px;font-weight:800;color:#1d3263;margin-bottom:4px">${en?'Deductions':'কর্তনসমূহ'}</div>${ded}</div>
    </div>
    <div style="margin-top:14px;border:2px solid #1f3568;border-radius:12px;padding:14px 16px;display:flex;justify-content:space-between;align-items:center;background:#f4f7ff">
      <span style="font-size:14px;font-weight:800;color:#1f3568">${en?'Net payable salary':'নিট প্রাপ্য বেতন'}</span>
      <span style="font-size:24px;font-weight:900;color:#111936">${amt(r.net)}</span>
    </div>
    <div style="margin-top:12px;padding:10px 12px;border-left:4px solid #d59b35;background:#fff8e8;border-radius:8px;font-size:10.5px"><b>${en?'Note:':'নোট:'}</b> ${en?'Special benefit is excluded. Provident fund advance installment is not included in regular deductions. No new allowance rate for 2028 has been assumed.':'বিশেষ সুবিধা সম্পূর্ণ বাদ। ভবিষ্য তহবিল অগ্রিমের কিস্তি নিয়মিত কর্তনের মধ্যে রাখা হয়নি। ২০২৮ সালের নতুন ভাতার হার অনুমান করা হয়নি।'}</div>`;
  return reportShell(title,en?'A4 payslip-style salary statement':'এ-ফোর পে-স্লিপধর্মী বেতন বিবরণী',body,lang);
}

function Login({onLogin,onBack,lang,setLang}){
  const[email,setEmail]=useState(''),[password,setPassword]=useState(''),[err,setErr]=useState(''),[busy,setBusy]=useState(false);
  const en=lang==='en';
  async function submit(e){e.preventDefault();setErr('');setBusy(true);try{const x=await api('/api/login',{method:'POST',body:JSON.stringify({email,password})});onLogin(x.user)}catch(e){setErr(e.message)}finally{setBusy(false)}}
  return <div className="login-shell"><form className="login-card" onSubmit={submit}>
    <div className="login-top"><button type="button" className="back-link" onClick={onBack}>{en?'← Back to Home':'← হোমে ফিরুন'}</button><LangToggle lang={lang} setLang={setLang}/></div>
    <h1>{en?'Employee Service ERP':'কর্মকর্তা-কর্মচারী সেবা ব্যবস্থা'}</h1><p>{en?'Independent Digital Service Platform':'স্বাধীন ডিজিটাল সেবা প্ল্যাটফর্ম'}</p>
    <label>{en?'Email':'ইমেইল'}<input value={email} onChange={e=>setEmail(e.target.value)} type="email" required/></label>
    <label>{en?'Password':'পাসওয়ার্ড'}<input value={password} onChange={e=>setPassword(e.target.value)} type="password" required/></label>
    {err&&<div className="error">{err}</div>}
    <button disabled={busy}>{busy?(en?'Signing in...':'লগইন হচ্ছে...'):(en?'Login':'লগইন')}</button>
    <small>{en?'This is an independent and unofficial digital service platform.':'এটি একটি স্বাধীন ও অনানুষ্ঠানিক ডিজিটাল সেবা প্ল্যাটফর্ম।'}</small>
  </form></div>
}
function PublicHome({onLogin,lang,setLang}){
  const t=I18N[lang], en=lang==='en';
  const [publicTool,setPublicTool]=useState('promotion');
  const scrollTo=(id)=>requestAnimationFrame(()=>document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'}));
  const openTool=(tool)=>{setPublicTool(tool);scrollTo('public-calculator');};
  const copy=en?{
    nav:['Services','Calculators','Updates','Help'],
    eyebrow:'INDEPENDENT · SMART · SECURE',
    title:'A premium digital service experience for officers and employees',
    desc:'Promotion eligibility, pay-scale calculation, service tools and secure ERP access — brought together in one modern platform.',
    login:'Login to ERP', explore:'Explore Services', live:'PUBLIC CALCULATORS · NO LOGIN REQUIRED',
    quick:'Instant Access', active:'Public tools available now', promo:'Promotion Calculator', promoSub:'Eligibility, annual cycle and roadmap', pay:'Pay Scale Calculator', paySub:'Fixation, payable basic, gross and net salary', employee:'Employee ERP', employeeSub:'Secure profile and service management', rules:'Rules & Policies', rulesSub:'Structured policy library',
    services:'Premium Services', servicesSub:'Everything important, presented clearly and beautifully.', open:'Open', loginOpen:'Login Required',
    calcTitle:'Calculate without logging in', calcSub:'Promotion and pay-scale calculators are temporarily available to everyone from the homepage.', promoTab:'Promotion', payTab:'Pay Scale',
    updates:'Platform Highlights', u1:'Public calculation enabled',u1d:'Promotion and pay-scale calculations can now be used without login.',u2:'Secure ERP remains protected',u2d:'Employee records and administrative modules still require authenticated access.',u3:'Independent platform',u3d:'This is not an official institutional system.',
    help:'Need assistance?', helpText:'For platform support and technical assistance', call:'Call 01759084692'
  }:{
    nav:['সেবা','ক্যালকুলেটর','আপডেট','সহায়তা'],
    eyebrow:'স্বাধীন · আধুনিক · নিরাপদ',
    title:'কর্মকর্তা-কর্মচারীদের জন্য প্রিমিয়াম ডিজিটাল সেবার অভিজ্ঞতা',
    desc:'পদোন্নতির যোগ্যতা, পে-স্কেল হিসাব, চাকরি-সংক্রান্ত টুল এবং নিরাপদ ERP প্রবেশ—সবকিছু এক আধুনিক প্ল্যাটফর্মে।',
    login:'ERP-তে লগইন', explore:'সেবাগুলো দেখুন', live:'পাবলিক ক্যালকুলেটর · লগইন প্রয়োজন নেই',
    quick:'দ্রুত প্রবেশ', active:'এখনই ব্যবহারযোগ্য পাবলিক সেবা', promo:'পদোন্নতি ক্যালকুলেটর', promoSub:'যোগ্যতা, বার্ষিক প্রক্রিয়া ও ভবিষ্যৎ ধাপ', pay:'পে-স্কেল ক্যালকুলেটর', paySub:'ফিক্সেশন, প্রাপ্য বেসিক, মোট ও নেট বেতন', employee:'কর্মকর্তা-কর্মচারী ERP', employeeSub:'নিরাপদ প্রোফাইল ও চাকরি ব্যবস্থাপনা', rules:'বিধি ও নীতিমালা', rulesSub:'সুশৃঙ্খল নীতিমালা তথ্যভান্ডার',
    services:'প্রিমিয়াম সেবাসমূহ', servicesSub:'প্রয়োজনীয় সেবাগুলো সহজ, সুন্দর ও পরিষ্কারভাবে সাজানো।', open:'খুলুন', loginOpen:'লগইন প্রয়োজন',
    calcTitle:'লগইন ছাড়াই হিসাব করুন', calcSub:'পদোন্নতি ও পে-স্কেল হিসাব আপাতত হোমপেজ থেকেই সবাই ব্যবহার করতে পারবেন।', promoTab:'পদোন্নতি', payTab:'পে-স্কেল',
    updates:'প্ল্যাটফর্মের বিশেষ সুবিধা', u1:'পাবলিক হিসাব চালু',u1d:'এখন লগইন ছাড়াই পদোন্নতি ও পে-স্কেল হিসাব করা যাবে।',u2:'ERP নিরাপদই থাকছে',u2d:'কর্মী তথ্য ও প্রশাসনিক মডিউলে প্রবেশের জন্য লগইন প্রয়োজন হবে।',u3:'স্বাধীন প্ল্যাটফর্ম',u3d:'এটি কোনো প্রতিষ্ঠানের অফিসিয়াল সিস্টেম নয়।',
    help:'সহায়তা প্রয়োজন?', helpText:'প্ল্যাটফর্ম সহায়তা ও কারিগরি সহযোগিতার জন্য', call:'কল করুন 01759084692'
  };
  return <div className={'public premium-public '+(en?'lang-en':'lang-bn')}>
    <header className="public-nav luxury-nav">
      <div className="public-brand"><div className="brand-orb"><ShieldCheck size={19}/></div><div><b>{t.appName}</b><small>{t.appSub}</small></div></div>
      <nav>
        <a href="#services">{copy.nav[0]}</a><a href="#public-calculator">{copy.nav[1]}</a><a href="#updates">{copy.nav[2]}</a><a href="#help">{copy.nav[3]}</a>
        <LangToggle lang={lang} setLang={setLang}/><button className="nav-login" onClick={onLogin}>{t.login}<ArrowRight size={15}/></button>
      </nav>
    </header>

    <section className="public-hero luxury-hero">
      <div className="hero-glow glow-one"></div><div className="hero-glow glow-two"></div>
      <div className="public-copy">
        <span className="eyebrow luxury-eyebrow"><span className="pulse-dot"></span>{copy.eyebrow}</span>
        <h1>{copy.title}</h1><p>{copy.desc}</p>
        <div className="public-actions"><button className="luxury-primary" onClick={()=>openTool('promotion')}>{copy.promo}<ArrowRight size={17}/></button><button className="luxury-secondary" onClick={onLogin}>{copy.login}</button></div>
        <div className="public-live"><Activity size={16}/><b>{copy.live}</b></div>
        <div className="trust-row"><span><ShieldCheck/> {en?'Secure Session':'নিরাপদ সেশন'}</span><span><Database/> {en?'Cloud Ready':'ক্লাউড প্রস্তুত'}</span><span><Activity/> {en?'Responsive':'রেসপনসিভ'}</span></div>
      </div>
      <div className="hero-panel luxury-panel">
        <div className="hero-panel-head"><div className="panel-icon"><Landmark/></div><div><b>{copy.quick}</b><small>{copy.active}</small></div><span className="status-pill"><span></span>{en?'LIVE':'সক্রিয়'}</span></div>
        <div className="quick-grid luxury-quick">
          <button onClick={()=>openTool('promotion')}><span className="quick-icon"><TrendingUp/></span><b>{copy.promo}</b><small>{copy.promoSub}</small><ChevronRight className="quick-arrow"/></button>
          <button onClick={()=>openTool('salary')}><span className="quick-icon gold"><WalletCards/></span><b>{copy.pay}</b><small>{copy.paySub}</small><ChevronRight className="quick-arrow"/></button>
          <button onClick={onLogin}><span className="quick-icon violet"><Users/></span><b>{copy.employee}</b><small>{copy.employeeSub}</small><ChevronRight className="quick-arrow"/></button>
          <button onClick={()=>scrollTo('updates')}><span className="quick-icon teal"><BookOpen/></span><b>{copy.rules}</b><small>{copy.rulesSub}</small><ChevronRight className="quick-arrow"/></button>
        </div>
      </div>
    </section>

    <section id="services" className="public-section luxury-section">
      <div className="section-title centered"><span>{en?'PREMIUM ACCESS':'প্রিমিয়াম প্রবেশ'}</span><h2>{copy.services}</h2><p>{copy.servicesSub}</p></div>
      <div className="service-grid luxury-services">
        {[[copy.promo,copy.promoSub,TrendingUp,'promotion',false],[copy.pay,copy.paySub,WalletCards,'salary',false],[copy.employee,copy.employeeSub,Users,'login',true],[copy.rules,copy.rulesSub,BookOpen,'updates',true]].map(([a,b,I,target,locked],idx)=><article className="service-card luxury-card" key={a}><div className="card-number">0{idx+1}</div><div className="service-icon"><I/></div><h3>{a}</h3><p>{b}</p><button onClick={()=>target==='login'?onLogin():target==='updates'?scrollTo('updates'):openTool(target)}>{locked?copy.loginOpen:copy.open}<ChevronRight size={15}/></button></article>)}
      </div>
    </section>

    <section id="public-calculator" className="public-section calculator-stage">
      <div className="section-title centered"><span>{en?'PUBLIC TOOLS':'পাবলিক টুল'}</span><h2>{copy.calcTitle}</h2><p>{copy.calcSub}</p></div>
      <div className="calculator-switch"><button className={publicTool==='promotion'?'active':''} onClick={()=>setPublicTool('promotion')}><TrendingUp/>{copy.promoTab}</button><button className={publicTool==='salary'?'active':''} onClick={()=>setPublicTool('salary')}><WalletCards/>{copy.payTab}</button></div>
      <div className="public-calculator-card">{publicTool==='promotion'?<PromotionCenter lang={lang}/>:<SalaryCalculator lang={lang}/>}</div>
    </section>

    <section id="updates" className="public-section muted-section luxury-updates"><div className="section-title centered"><span>{en?'PLATFORM':'প্ল্যাটফর্ম'}</span><h2>{copy.updates}</h2></div><div className="update-list premium-update-list">
      <article><div className="update-icon"><Calculator/></div><div><b>{copy.u1}</b><p>{copy.u1d}</p></div></article>
      <article><div className="update-icon"><LockKeyhole/></div><div><b>{copy.u2}</b><p>{copy.u2d}</p></div></article>
      <article><div className="update-icon"><FileText/></div><div><b>{copy.u3}</b><p>{copy.u3d}</p></div></article>
    </div></section>

    <section className="public-cta"><div><span>{en?'SUPPORT':'সহায়তা'}</span><h2>{copy.help}</h2><p>{copy.helpText}</p></div><a href="tel:01759084692"><PhoneCall/>{copy.call}</a></section>
    <footer id="help"><div><b>{t.appName}</b><p>{t.independent}</p></div><div><HelpCircle/> {en?'Developer Support':'ডেভেলপার সহায়তা'} · <Phone/> 01759084692</div></footer>
  </div>
}
function Stat({label,value,icon:Icon}){return <article className="stat-card"><div className="stat-icon"><Icon size={19}/></div><div><small>{label}</small><b>{value}</b></div></article>}


function DashboardHome({user,onPage,lang='bn'}){
  if(lang==='en')return <>
    <section className="hero"><div><span>SERVICE PLATFORM</span><h1>Employee Service Foundation</h1><p>Homepage, promotion calculator, pay scale calculator, employee management and service history are active.</p></div><div className="hero-chip"><Activity size={16}/> System Active</div></section>
    <section className="stats-grid"><Stat label="Role" value={roleLabel[user.role]||user.role} icon={ShieldCheck}/><Stat label="Employee ID" value={user.employee_id||'—'} icon={IdCard}/><Stat label="Account Status" value="Active" icon={Activity}/><Stat label="Security" value="Session Protected" icon={LockKeyhole}/></section>
    <section className="module-grid"><article className="module-card"><div className="module-icon"><TrendingUp/></div><h3>Promotion Centre</h3><p>Calculate eligibility date, annual cycle and future roadmap.</p><button className="ghost-btn" onClick={()=>onPage('promotion')}>Calculate <ChevronRight size={16}/></button></article>
    <article className="module-card"><div className="module-icon green"><WalletCards/></div><h3>Salary & Pay Scale</h3><p>Calculate fixation, payable basic, gross and net salary.</p><button className="ghost-btn" onClick={()=>onPage('salary')}>Calculate <ChevronRight size={16}/></button></article></section>
    <section className="notice"><b>Notice</b><p>This is an independent and unofficial digital service platform.</p></section>
  </>;
  return <>
    <section className="hero"><div><span>সেবা প্ল্যাটফর্ম</span><h1>কর্মকর্তা-কর্মচারী সেবা ব্যবস্থা</h1><p>হোমপেজ, পদোন্নতি হিসাব, পে-স্কেল হিসাব, কর্মকর্তা-কর্মচারী ব্যবস্থাপনা ও চাকরি ইতিহাস সক্রিয়।</p></div><div className="hero-chip"><Activity size={16}/> সিস্টেম সক্রিয়</div></section>
    <section className="stats-grid"><Stat label="ভূমিকা" value={roleLabel[user.role]||user.role} icon={ShieldCheck}/><Stat label="কর্মী নম্বর" value={user.employee_id||'—'} icon={IdCard}/><Stat label="অ্যাকাউন্ট অবস্থা" value="সক্রিয়" icon={Activity}/><Stat label="নিরাপত্তা" value="সুরক্ষিত সেশন" icon={LockKeyhole}/></section>
    <section className="module-grid"><article className="module-card"><div className="module-icon"><TrendingUp/></div><h3>পদোন্নতি কেন্দ্র</h3><p>যোগ্যতার তারিখ, বার্ষিক প্রক্রিয়া এবং ভবিষ্যৎ ধাপ হিসাব করুন।</p><button className="ghost-btn" onClick={()=>onPage('promotion')}>হিসাব করুন <ChevronRight size={16}/></button></article>
    <article className="module-card"><div className="module-icon green"><WalletCards/></div><h3>বেতন ও পে-স্কেল</h3><p>ফিক্সেশন, প্রাপ্য বেসিক, মোট ও নেট বেতন হিসাব করুন।</p><button className="ghost-btn" onClick={()=>onPage('salary')}>হিসাব করুন <ChevronRight size={16}/></button></article></section>
    <section className="notice"><b>দ্রষ্টব্য</b><p>এটি একটি স্বাধীন ও অনানুষ্ঠানিক ডিজিটাল সেবা প্ল্যাটফর্ম।</p></section>
  </>
}
function DMY({label,value,onChange}){
  const en=/[A-Za-z]/.test(label||''); const d=value?new Date(value+'T00:00:00'):null; const year=d&&!isNaN(d)?d.getFullYear():''; const month=d&&!isNaN(d)?d.getMonth()+1:''; const day=d&&!isNaN(d)?d.getDate():'';
  const years=Array.from({length:70},(_,i)=>new Date().getFullYear()-i),months=Array.from({length:12},(_,i)=>i+1),days=Array.from({length:31},(_,i)=>i+1);
  function setPart(part,v){let y=year||new Date().getFullYear(),m=month||1,dd=day||1;if(part==='y')y=Number(v);if(part==='m')m=Number(v);if(part==='d')dd=Number(v);const max=new Date(y,m,0).getDate();dd=Math.min(dd,max);onChange(`${y}-${String(m).padStart(2,'0')}-${String(dd).padStart(2,'0')}`)}
  return <label>{label}<div className="dmy"><select value={day} onChange={e=>setPart('d',e.target.value)}><option value="">{en?'Day':'দিন'}</option>{days.map(x=><option key={x}>{x}</option>)}</select><select value={month} onChange={e=>setPart('m',e.target.value)}><option value="">{en?'Month':'মাস'}</option>{months.map(x=><option key={x} value={x}>{en?new Intl.DateTimeFormat('en',{month:'short'}).format(new Date(2020,x-1,1)):new Intl.DateTimeFormat('bn-BD',{month:'long'}).format(new Date(2020,x-1,1))}</option>)}</select><select value={year} onChange={e=>setPart('y',e.target.value)}><option value="">{en?'Year':'বছর'}</option>{years.map(x=><option key={x}>{x}</option>)}</select></div></label>
}

function PromotionCenter({lang='bn'}){
  const en=lang==='en', today=todayLocalIso();
  const [f,setF]=useState({grade:'13',edu:'bachelor',currentDate:'',firstJoinDate:'',calcDate:today,computer:'yes',acr:'yes'}),[result,setResult]=useState(null);
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
    const prelim=calcDate>=eligible&&next.computer==='yes'&&next.acr==='yes'; const cycle=annualPromotionCycle(eligible); const roadmap=futureRoadmap(next.grade,next.currentDate,next.edu,6);
    setResult({rule,req,eligible,elapsed,remaining,exp,points:exp.valid?exp.points:0,prelim,cycle,roadmap,input:next});
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
  const en=lang==='en',[preview,setPreview]=useState(false); if(r.error)return <section className="result-panel warn"><h3>{en?'Unable to calculate':'হিসাব করা যায়নি'}</h3><p>{r.error}</p></section>;
  const report=promotionReportHtml(r,lang),filename=`promotion-report-${Date.now()}.pdf`;
  if(r.stop)return <div className="result-stack"><section className="result-panel warn"><h3>{r.rule.target}</h3><p>{en?'Reference':'রেফারেন্স'}: {r.rule.ref||r.rule.page||'—'}</p></section><button className="primary wide" onClick={()=>setPreview(true)}><FileText size={17}/> {en?'A4 PDF Preview':'বিস্তারিত A4 PDF প্রিভিউ'}</button>{preview&&<PdfPreviewModal html={report} filename={filename} onClose={()=>setPreview(false)} lang={lang}/>}</div>;
  const e=r.exp||{}; const dur=x=>en?`${x.y} years ${x.m} months ${x.d} days`:durationBn(x);
  return <div className="result-stack"><section className={`result-panel ${r.prelim?'ok':'warn'}`}><small>{en?'Next promotion level':'সম্ভাব্য পরবর্তী পদ/ধাপ'}</small><h3>{r.rule.target} · {en?'Grade':'গ্রেড'} {r.rule.targetGrade}</h3><p>{en?'Required service based on education':'শিক্ষাগত যোগ্যতা অনুযায়ী প্রয়োজনীয় চাকরিকাল'}: <b>{numLang(r.req,lang,0)} {en?'years':'বছর'}</b></p></section>
    <section className="stats-grid"><Stat label={en?'Eligibility date':'যোগ্যতার তারিখ'} value={fmtDateLang(r.eligible,lang)} icon={CalendarDays}/><Stat label={en?'Current post service':'বর্তমান পদে চাকরি'} value={dur(r.elapsed)} icon={Clock3}/><Stat label={en?'Remaining time':'আর কত সময় লাগবে'} value={(r.remaining.y||r.remaining.m||r.remaining.d)?dur(r.remaining):(en?'Completed':'সময় পূর্ণ')} icon={Activity}/><Stat label={en?'Total service points':'মোট সার্ভিস পয়েন্ট'} value={numLang(r.points,lang)} icon={TrendingUp}/></section>
    <section className="breakdown-card"><h3>{en?'Service point breakdown':'সার্ভিস পয়েন্টের বিস্তারিত'}</h3><div className="money-row"><span>{en?'Current post':'বর্তমান পদ'}: {numLang(e.currentYears||0,lang)} {en?'years × 1':'বছর × ১'}</span><b>{numLang(e.currentPoints||0,lang)}</b></div><div className="money-row"><span>{en?'Previous total service (auto)':'পূর্ববর্তী মোট চাকরিকাল (অটো)'}: {numLang(e.priorServiceYears||0,lang)} {en?'years ÷ 3':'বছর ÷ ৩'}</span><b>{numLang(e.priorServicePoints||0,lang)}</b></div><div className="money-row"><span>{en?'Education rule':'শিক্ষাগত যোগ্যতার নিয়ম'}</span><b>{en?`Requires ${r.req} years for this grade; no separate point is added.`:`এই গ্রেডে ${r.req} বছর প্রয়োজন; আলাদা পয়েন্ট যোগ হয় না।`}</b></div></section>
    <section className="cycle-card"><h3>{en?'One-year promotion process':'১ বছরের পদোন্নতি প্রক্রিয়া'}</h3><div className="cycle-flow"><div><small>{en?'Eligible':'যোগ্যতা পূর্ণ'}</small><b>{fmtDateLang(r.eligible,lang)}</b></div><span>→</span><div><small>{en?'Application/circular deadline':'দরখাস্ত আহ্বানের সময়সীমা'}</small><b>{fmtDateLang(r.cycle.circularDeadline,lang)}</b></div><span>→</span><div><small>{en?'Projected final promotion':'সম্ভাব্য চূড়ান্ত পদোন্নতি'}</small><b>{fmtDateLang(r.cycle.completionDeadline,lang)}</b></div></div><p>{en?'The application, scrutiny and approval process is calculated as one full year after eligibility. The displayed date is projected, not guaranteed.':'যোগ্যতা অর্জনের পর আবেদন, যাচাই-বাছাই ও অনুমোদনসহ ১ পূর্ণ বছর ধরে সম্ভাব্য চূড়ান্ত পদোন্নতির তারিখ হিসাব করা হয়েছে। প্রদর্শিত তারিখটি সম্ভাব্য, নিশ্চিত নয়।'}</p></section>
    <section className="roadmap-card"><h3>{en?'Future promotion roadmap':'পরবর্তী পদোন্নতির সম্ভাব্য রোডম্যাপ'}</h3>{r.roadmap.map((x,i)=>x.stop?<div className="roadmap-row stop" key={i}><b>{en?'After grade':'গ্রেড'} {x.fromGrade}</b><span>{x.label}</span></div>:<div className="roadmap-row" key={i}><div><b>{x.fromGrade} → {x.toGrade} · {x.title}</b><small>{x.years} {en?'years':'বছর'}</small></div><div><b>{fmtDateLang(x.completionDeadline,lang)}</b><small>{en?'Projected final promotion':'সম্ভাব্য চূড়ান্ত পদোন্নতি'}</small></div></div>)}</section>
    <button className="primary wide" onClick={()=>setPreview(true)}><FileText size={17}/> {en?'A4 PDF Preview':'বিস্তারিত A4 PDF প্রিভিউ'}</button>{preview&&<PdfPreviewModal html={report} filename={filename} onClose={()=>setPreview(false)} lang={lang}/>} </div>
}
function SalaryCalculator({lang='bn'}){
  const en=lang==='en',today=todayLocalIso();
  const [f,setF]=useState({grade:'13',currentStage:'0',date:today,housing:'no',children:'0',tiffin:'yes',zone:'dhaka',category:'class3',health:'149.34',group:'192.50',stamp:'10',association:'10',tax:'0',loan:'0',other:'0'});
  const [r,setR]=useState(null); const stages=PAY2015[f.grade]||[]; const currentIndex=Math.min(Math.max(0,Number(f.currentStage||0)),Math.max(0,stages.length-1));
  function calc(){const date=todayLocalIso();const next={...f,date};setF(next);const grade=Number(next.grade),currentBasic=stages[currentIndex]||0,fixed=fixed2026(grade,currentBasic),rate=implementationRate(grade,date);const increase=Math.max(0,fixed-currentBasic),implemented=Math.round(increase*rate),payable=Math.round(currentBasic+implemented);const house=Math.round(houseRent2015(currentBasic,next.housing)),medical=1500,education=Math.min(Number(next.children||0),2)*500,tiffin=next.tiffin==='yes'&&grade>=11?200:0,conveyance=next.zone==='dhaka'&&grade>=11?300:0;const gross=payable+house+medical+education+tiffin+conveyance;const pf=Math.round(payable*.10*100)/100,beneRate=next.category==='officer'?.05:next.category==='class4'?.0275:.04,bene=Math.round(payable*beneRate*100)/100;const health=Number(next.health||0),group=Number(next.group||0),stamp=Number(next.stamp||0),association=Number(next.association||0),tax=Number(next.tax||0),loan=Number(next.loan||0),other=Number(next.other||0);const deductions=pf+bene+health+group+stamp+association+tax+loan+other;setR({grade,currentIndex,currentBasic,fixed,rate,increase,implemented,payable,house,medical,education,tiffin,conveyance,gross,pf,bene,health,group,stamp,association,tax,loan,other,deductions,net:gross-deductions,input:next})}
  useEffect(()=>{setF(x=>({...x,currentStage:'0'}));setR(null)},[f.grade]);
  const catOpts=en?[['officer','Officer'],['class3','Class III'],['class4','Class IV']]:[['officer','কর্মকর্তা'],['class3','তৃতীয় শ্রেণি'],['class4','চতুর্থ শ্রেণি']];
  return <div><div className="page-head"><div><h2>{en?'Salary & Pay Scale Calculator':'বেতন ও পে-স্কেল হিসাব'}</h2><p>{en?'Select the current 2015 pay stage directly; no separate post-2015 increment field is required.':'বর্তমান ২০১৫ বেতন ধাপ সরাসরি নির্বাচন করুন; ২০১৫-পরবর্তী ইনক্রিমেন্টের আলাদা ঘর লাগবে না।'}</p></div></div><section className="calc-card"><div className="form-grid">
    <label>{en?'Grade':'গ্রেড'}<select value={f.grade} onChange={e=>setF({...f,grade:e.target.value})}>{Array.from({length:20},(_,i)=>i+1).map(g=><option key={g} value={g}>{en?`Grade ${g}`:`গ্রেড ${g.toLocaleString('bn-BD')}`}</option>)}</select></label>
    <label>{en?'Current 2015 pay stage':'বর্তমান ২০১৫ বেতন ধাপ'}<select value={f.currentStage} onChange={e=>setF({...f,currentStage:e.target.value})}>{stages.map((v,i)=><option value={i} key={i}>{en?`Stage ${i+1} — Tk ${moneyLang(v,'en')}`:`ধাপ ${(i+1).toLocaleString('bn-BD')} — ৳${moneyLang(v,'bn')}`}</option>)}</select></label>
    <label>{en?'Employee category':'কর্মচারী শ্রেণি'}<select value={f.category} onChange={e=>setF({...f,category:e.target.value})}>{catOpts.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label>
    <label>{en?'Housing facility':'বাসা সুবিধা'}<select value={f.housing} onChange={e=>setF({...f,housing:e.target.value})}><option value="no">{en?'No':'না'}</option><option value="yes">{en?'Yes':'হ্যাঁ'}</option></select></label>
    <label>{en?'Children for education allowance':'শিক্ষা ভাতার সন্তানের সংখ্যা'}<select value={f.children} onChange={e=>setF({...f,children:e.target.value})}><option value="0">{numLang(0,lang,0)}</option><option value="1">{numLang(1,lang,0)}</option><option value="2">{numLang(2,lang,0)}</option></select></label>
    <label>{en?'Tiffin allowance':'টিফিন ভাতা'}<select value={f.tiffin} onChange={e=>setF({...f,tiffin:e.target.value})}><option value="yes">{en?'Applicable':'প্রযোজ্য'}</option><option value="no">{en?'Not applicable':'প্রযোজ্য নয়'}</option></select></label>
    <label>{en?'Work location':'কর্মস্থল'}<select value={f.zone} onChange={e=>setF({...f,zone:e.target.value})}><option value="dhaka">{en?'Dhaka City':'ঢাকা সিটি'}</option><option value="other">{en?'Other':'অন্যান্য'}</option></select></label>
  </div><div className="notice"><b>{en?'Calculation date:':'হিসাবের তারিখ:'}</b> {fmtDateLang(today,lang)} — {en?'automatic; no date field needs to be filled.':'স্বয়ংক্রিয়, আলাদা তারিখের ঘর পূরণ করতে হবে না।'}</div><details className="deduction-box"><summary>{en?'Edit regular deductions':'নিয়মিত কর্তন সম্পাদনা'}</summary><div className="form-grid compact">{(en?[['health','Health insurance'],['group','Group insurance'],['stamp','Revenue stamp'],['association','Association'],['tax','Income tax'],['loan','Loan'],['other','Other']]:[['health','স্বাস্থ্য বীমা'],['group','গ্রুপ বীমা'],['stamp','রাজস্ব স্ট্যাম্প'],['association','সমিতি'],['tax','আয়কর'],['loan','ঋণ'],['other','অন্যান্য']]).map(([k,l])=><label key={k}>{l}<input type="number" step="0.01" value={f[k]} onChange={e=>setF({...f,[k]:e.target.value})}/></label>)}</div></details><button className="primary wide" onClick={calc}>{en?'Calculate Salary':'বেতন হিসাব করুন'}</button></section>{r&&<SalaryResult r={r} lang={lang}/>}</div>
}
function SalaryResult({r,lang='bn'}){
  const en=lang==='en',[preview,setPreview]=useState(false); const report=salaryReportHtml(r,lang); const filename=en?`salary-payslip-${Date.now()}.pdf`:`beton-pay-slip-${Date.now()}.pdf`; const amt=v=>`${en?'Tk':'৳'} ${moneyLang(v,lang)}`; const allowances=en?[['House rent',r.house],['Medical allowance',r.medical],['Education allowance',r.education],['Tiffin allowance',r.tiffin],['Conveyance allowance',r.conveyance]]:[['বাড়িভাড়া',r.house],['চিকিৎসা ভাতা',r.medical],['শিক্ষা ভাতা',r.education],['টিফিন ভাতা',r.tiffin],['যাতায়াত ভাতা',r.conveyance]]; const deds=en?[['Provident fund subscription 10%',r.pf],['Benevolent fund',r.bene],['Health insurance',r.health],['Group insurance',r.group],['Revenue stamp',r.stamp],['Association',r.association],['Income tax',r.tax],['Loan',r.loan],['Other',r.other]]:[['ভবিষ্য তহবিল সাবস্ক্রিপশন ১০%',r.pf],['কল্যাণ তহবিল',r.bene],['স্বাস্থ্য বীমা',r.health],['গ্রুপ বীমা',r.group],['রাজস্ব স্ট্যাম্প',r.stamp],['সমিতি',r.association],['আয়কর',r.tax],['ঋণ',r.loan],['অন্যান্য',r.other]];
  return <div className="result-stack"><section className="result-panel ok"><small>{en?'Payable basic':'প্রাপ্য মূল বেতন'}</small><h3>{amt(r.payable)}</h3><p>{en?`2015 current basic ${amt(r.currentBasic)} · 2026 full fixed basic ${amt(r.fixed)} · Implementation ${numLang(r.rate*100,lang,0)}%`:`২০১৫ বর্তমান মূল বেতন ${amt(r.currentBasic)} · ২০২৬ পূর্ণ নির্ধারিত মূল বেতন ${amt(r.fixed)} · বাস্তবায়ন ${numLang(r.rate*100,lang,0)}%`}</p></section><section className="salary-summary"><article><small>{en?'Basic increase':'মূল বেতন বৃদ্ধি'}</small><b>{amt(r.increase)}</b></article><article><small>{en?'Implemented increase':'বাস্তবায়িত বৃদ্ধি'}</small><b>{amt(r.implemented)}</b></article><article><small>{en?'Gross salary':'মোট প্রাপ্য'}</small><b>{amt(r.gross)}</b></article><article><small>{en?'Total deductions':'মোট কর্তন'}</small><b>{amt(r.deductions)}</b></article><article className="net"><small>{en?'Net payable salary':'নিট প্রাপ্য বেতন'}</small><b>{amt(r.net)}</b></article></section><div className="split-grid"><section className="breakdown-card"><h3>{en?'Earnings':'প্রাপ্যসমূহ'}</h3>{allowances.map(([l,v])=><div className="money-row" key={l}><span>{l}</span><b>{amt(v)}</b></div>)}</section><section className="breakdown-card"><h3>{en?'Deductions':'কর্তনসমূহ'}</h3>{deds.map(([l,v])=><div className="money-row" key={l}><span>{l}</span><b>{amt(v)}</b></div>)}</section></div><div className="notice"><b>{en?'Note:':'নোট:'}</b> {en?'Special benefit is excluded. Provident fund advance installment is not included in regular deductions. No new allowance rate for 2028 has been assumed.':'বিশেষ সুবিধা সম্পূর্ণ বাদ। ভবিষ্য তহবিল অগ্রিমের কিস্তি নিয়মিত কর্তনের মধ্যে রাখা হয়নি। ২০২৮ সালের নতুন ভাতার হার অনুমান করা হয়নি।'}</div><button className="primary wide" onClick={()=>setPreview(true)}><FileText size={17}/> {en?'A4 Payslip Preview':'এ-ফোর পে-স্লিপ প্রিভিউ'}</button>{preview&&<PdfPreviewModal html={report} filename={filename} onClose={()=>setPreview(false)} lang={lang}/>}</div>
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

function AdminPanel(){
  const[stats,setStats]=useState(null),[err,setErr]=useState('');
  useEffect(()=>{api('/api/admin/stats').then(setStats).catch(e=>setErr(e.message))},[]);
  return <><div className="page-head"><div><h2>Admin Panel</h2><p>System health, database status এবং account overview.</p></div></div>{err&&<div className="error">{err}</div>}<section className="stats-grid"><Stat label="Total Employees" value={stats?.employees??'—'} icon={Users}/><Stat label="Active Employees" value={stats?.active_employees??'—'} icon={Activity}/><Stat label="Total Users" value={stats?.users??'—'} icon={UserRound}/><Stat label="Departments" value={stats?.departments??'—'} icon={Building2}/></section><section className="admin-grid"><article className="admin-card"><Database/><div><h3>D1 Database</h3><p>Connected এবং operational.</p></div></article><article className="admin-card"><ShieldCheck/><div><h3>Role Security</h3><p>Admin-only API routes protected.</p></div></article><article className="admin-card"><LockKeyhole/><div><h3>Session Security</h3><p>HttpOnly secure cookie session enabled.</p></div></article></section></>
}

function App(){
  const[user,setUser]=useState(null),[loading,setLoading]=useState(true),[page,setPage]=useState('dashboard'),[showLogin,setShowLogin]=useState(false),[lang,setLang]=useState(()=>localStorage.getItem('app_lang')||'bn');
  useEffect(()=>{api('/api/me').then(x=>setUser(x.user)).catch(()=>{}).finally(()=>setLoading(false))},[]);
  useEffect(()=>{localStorage.setItem('app_lang',lang)},[lang]);
  async function logout(){try{await api('/api/logout',{method:'POST'})}catch{}setUser(null);setShowLogin(false);setPage('dashboard')}
  if(loading)return <div className="loading">Loading...</div>;
  if(!user)return showLogin?<Login onLogin={setUser} onBack={()=>setShowLogin(false)} lang={lang} setLang={setLang}/>:<PublicHome onLogin={()=>setShowLogin(true)} lang={lang} setLang={setLang}/>;
  const admin=['super_admin','admin','department_admin'].includes(user.role);
  return <div className="app"><aside className="side">
    <div className="brand"><div><b>{lang==='en'?'Employee Service ERP':'কর্মকর্তা-কর্মচারী সেবা'}</b><small>{lang==='en'?'Independent Platform':'স্বাধীন প্ল্যাটফর্ম'}</small></div></div>
    <nav>
      <button className={page==='dashboard'?'active':''} onClick={()=>setPage('dashboard')}><LayoutDashboard size={18}/>{lang==='en'?'My Dashboard':'আমার ড্যাশবোর্ড'}</button>
      <button className={page==='promotion'?'active':''} onClick={()=>setPage('promotion')}><TrendingUp size={18}/>{lang==='en'?'Promotion':'পদোন্নতি'}</button>
      <button className={page==='salary'?'active':''} onClick={()=>setPage('salary')}><WalletCards size={18}/>{lang==='en'?'Salary & Pay Scale':'বেতন ও পে-স্কেল'}</button>
      {admin&&<button className={page==='employees'?'active':''} onClick={()=>setPage('employees')}><Users size={18}/>{lang==='en'?'Employee Management':'কর্মকর্তা-কর্মচারী ব্যবস্থাপনা'}</button>}
      {admin&&<button className={page==='directory'?'active':''} onClick={()=>setPage('directory')}><Building2 size={18}/>{lang==='en'?'Department & Designation':'বিভাগ ও পদবি'}</button>}
      {admin&&<button className={page==='admin'?'active':''} onClick={()=>setPage('admin')}><ShieldCheck size={18}/>{lang==='en'?'Admin Panel':'অ্যাডমিন প্যানেল'}</button>}
    </nav></aside>
    <main><header><div><h2>{lang==='en'?`Welcome, ${user.name}`:`স্বাগতম, ${user.name}`}</h2><p>{lang==='en'?(roleLabel[user.role]||user.role):({super_admin:'সুপার অ্যাডমিন',admin:'অ্যাডমিন',department_admin:'বিভাগীয় অ্যাডমিন',editor:'সম্পাদক',employee:'কর্মকর্তা-কর্মচারী'}[user.role]||user.role)}</p></div><div className="header-actions"><LangToggle lang={lang} setLang={setLang}/><button className="logout" onClick={logout}><LogOut size={16}/>{lang==='en'?'Logout':'লগআউট'}</button></div></header>
      {page==='dashboard'&&<DashboardHome user={user} onPage={setPage} lang={lang}/>}
      {page==='promotion'&&<PromotionCenter lang={lang}/>}
      {page==='salary'&&<SalaryCalculator lang={lang}/>}
      {page==='employees'&&admin&&<EmployeeManagement lang={lang}/>}
      {page==='directory'&&admin&&<MasterDirectory lang={lang}/>}
      {page==='admin'&&admin&&<AdminPanel lang={lang}/>}
    </main></div>
}
createRoot(document.getElementById('root')).render(<App/>);
