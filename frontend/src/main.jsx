
import React,{useEffect,useMemo,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {
  LayoutDashboard,TrendingUp,WalletCards,Users,ShieldCheck,LogOut,Plus,Search,
  UserRound,Building2,IdCard,Activity,ChevronRight,X,Save,Trash2,RefreshCw,
  Settings,Database,LockKeyhole,Home,BookOpen,Calculator,HelpCircle,Phone,
  Bell,ArrowRight,CalendarDays,CheckCircle2,AlertTriangle,Landmark,FileText,Camera,Briefcase,MapPin,Mail,PhoneCall,MessageCircle,Edit3,UserCircle2,History,ArrowRightLeft,GraduationCap,BadgeDollarSign,Clock3,FileClock,ServerCog,Gauge,UserCog,ScrollText,SlidersHorizontal,ShieldAlert,Link2,Eye,Power,BookUser,NotebookTabs,Milestone,Award
} from 'lucide-react';
import './styles.css';
import './auth-phase8.css';
import './admin-premium.css';
import './career-phase9.css';
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
const roleLabel={super_admin:'System Administrator',admin:'Admin',department_admin:'Department Admin',editor:'Editor',employee:'Employee'};
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

function AuthPortal({onLogin,onBack,lang,setLang,initialMode='login'}) {
  const en=lang==='en';
  const [mode,setMode]=useState(initialMode==='reset'?'forgot':initialMode);
  const [form,setForm]=useState({name:'',email:'',password:'',confirm:'',account_type:'employee',recovery_code:''});
  const [err,setErr]=useState(''),[msg,setMsg]=useState(''),[busy,setBusy]=useState(false),[recovery,setRecovery]=useState('');

  const change=(k,v)=>setForm(f=>({...f,[k]:v}));
  const switchMode=m=>{setMode(m);setErr('');setMsg('');setRecovery('')};
  async function submit(e){
    e.preventDefault();setBusy(true);setErr('');setMsg('');
    try{
      if(mode==='login'){
        const x=await api('/api/login',{method:'POST',body:JSON.stringify({email:form.email,password:form.password})});onLogin(x.user);return;
      }
      if(mode==='register'){
        if(form.password!==form.confirm)throw new Error(en?'Passwords do not match':'পাসওয়ার্ড দুটি মিলছে না');
        const x=await api('/api/register',{method:'POST',body:JSON.stringify({name:form.name,email:form.email,password:form.password,account_type:form.account_type})});
        setRecovery(x.recoveryCode);setMsg(en?'Account created. Save this recovery code now. It will not be shown again.':'অ্যাকাউন্ট তৈরি হয়েছে। এই রিকভারি কোডটি এখনই সংরক্ষণ করুন। পরে আর দেখানো হবে না।');return;
      }
      if(mode==='forgot'){
        if(form.password!==form.confirm)throw new Error(en?'Passwords do not match':'পাসওয়ার্ড দুটি মিলছে না');
        await api('/api/reset-password-recovery',{method:'POST',body:JSON.stringify({email:form.email,recovery_code:form.recovery_code,password:form.password})});
        setMsg(en?'Password reset completed. You can now log in.':'পাসওয়ার্ড পরিবর্তন হয়েছে। এখন লগইন করতে পারবেন।');setMode('login');return;
      }
    }catch(e){setErr(e.message)}finally{setBusy(false)}
  }
  const title=mode==='register'?(en?'Create your account':'নিজের অ্যাকাউন্ট তৈরি করুন'):mode==='forgot'?(en?'Recover your account':'অ্যাকাউন্ট পুনরুদ্ধার করুন'):(en?'Secure login':'নিরাপদ লগইন');
  return <div className="login-shell phase8-auth"><form className="login-card phase8-card" onSubmit={submit}>
    <div className="login-top"><button type="button" className="back-link" onClick={onBack}>{en?'← Back to Home':'← হোমে ফিরুন'}</button><LangToggle lang={lang} setLang={setLang}/></div>
    <div className="auth-badge"><ShieldCheck size={15}/>{en?'FREE SELF-SERVICE ACCOUNT':'বিনামূল্যের স্বয়ংক্রিয় অ্যাকাউন্ট'}</div>
    <h1>{title}</h1><p>{en?'Employee Digital Service Platform':'কর্মকর্তা-কর্মচারী ডিজিটাল সেবা'}</p>
    {mode==='register'&&<>
      <label>{en?'Full name':'পূর্ণ নাম'}<input value={form.name} onChange={e=>change('name',e.target.value)} required/></label>
      <label>{en?'Account type':'অ্যাকাউন্টের ধরন'}<select value={form.account_type} onChange={e=>change('account_type',e.target.value)}><option value="officer">{en?'Officer':'কর্মকর্তা'}</option><option value="employee">{en?'Employee':'কর্মচারী'}</option></select></label>
    </>}
    <label>{en?'Email':'ইমেইল'}<input value={form.email} onChange={e=>change('email',e.target.value)} type="email" required/></label>
    {mode==='forgot'&&<label>{en?'Recovery code':'রিকভারি কোড'}<input value={form.recovery_code} onChange={e=>change('recovery_code',e.target.value)} placeholder="XXXX-XXXX-XXXX-XXXX" required/></label>}
    <label>{mode==='forgot'?(en?'New password':'নতুন পাসওয়ার্ড'):(en?'Password':'পাসওয়ার্ড')}<input value={form.password} onChange={e=>change('password',e.target.value)} type="password" minLength="10" required/></label>
    {(mode==='register'||mode==='forgot')&&<label>{en?'Confirm password':'পাসওয়ার্ড নিশ্চিত করুন'}<input value={form.confirm} onChange={e=>change('confirm',e.target.value)} type="password" minLength="10" required/></label>}
    {(mode==='register'||mode==='forgot')&&<small className="password-rule">{en?'Use at least 10 characters with letters and numbers.':'কমপক্ষে ১০ অক্ষর ব্যবহার করুন এবং অক্ষর ও সংখ্যা রাখুন।'}</small>}
    {err&&<div className="error">{err}</div>}{msg&&<div className="auth-success">{msg}</div>}
    {recovery&&<div className="recovery-box"><div>{en?'YOUR RECOVERY CODE':'আপনার রিকভারি কোড'}</div><strong>{recovery}</strong><button type="button" onClick={()=>navigator.clipboard?.writeText(recovery)}>{en?'Copy Code':'কোড কপি করুন'}</button><small>{en?'Keep this code private and safe.':'কোডটি গোপন ও নিরাপদ স্থানে রাখুন।'}</small></div>}
    {!recovery&&<button disabled={busy}>{busy?(en?'Please wait...':'অপেক্ষা করুন...'):mode==='register'?(en?'Create Account':'অ্যাকাউন্ট তৈরি করুন'):mode==='forgot'?(en?'Reset Password':'পাসওয়ার্ড পরিবর্তন করুন'):(en?'Login':'লগইন')}</button>}
    {recovery&&<button type="button" onClick={()=>switchMode('login')}>{en?'I saved it — Go to Login':'সংরক্ষণ করেছি — লগইনে যান'}</button>}
    <div className="auth-links">
      {mode==='login'&&<><button type="button" onClick={()=>switchMode('forgot')}>{en?'Forgot password?':'পাসওয়ার্ড ভুলে গেছেন?'}</button><button type="button" onClick={()=>switchMode('register')}>{en?'Create new account':'নতুন অ্যাকাউন্ট তৈরি করুন'}</button></>}
      {(mode==='register'||mode==='forgot')&&!recovery&&<button type="button" onClick={()=>switchMode('login')}>{en?'Back to login':'লগইনে ফিরুন'}</button>}
    </div>
    <small>{en?'No paid email, SMS or domain is required. Independent and unofficial platform.':'কোনো পেইড ইমেইল, এসএমএস বা ডোমেইন প্রয়োজন নেই। স্বাধীন ও অনানুষ্ঠানিক প্ল্যাটফর্ম।'}</small>
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
function PublicHome({onLogin,lang,setLang}){
  const t=I18N[lang], en=lang==='en';
  const [publicTool,setPublicTool]=useState('promotion');
  const [publicNotices,setPublicNotices]=useState([]);
  const [publicPolicies,setPublicPolicies]=useState([]);
  useEffect(()=>{
    Promise.all([
      api('/api/public/notices?limit=6').catch(()=>({notices:[]})),
      api('/api/public/policies?limit=6').catch(()=>({policies:[]}))
    ]).then(([n,p])=>{setPublicNotices(n.notices||[]);setPublicPolicies(p.policies||[])});
  },[]);
  const scrollTo=(id)=>requestAnimationFrame(()=>document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'}));
  const openTool=(tool)=>{setPublicTool(tool);scrollTo('public-calculator');};
  const copy=en?{
    home:'Home',promotion:'Promotion Calculator',pay:'Pay Scale Calculator',policies:'Policies',notices:'Notices',forms:'Forms',help:'Help',login:'Login',
    eyebrow:'INDEPENDENT · SMART · SECURE',title:'A premium digital service experience for officers and employees',desc:'Promotion eligibility, pay-scale calculation, policy guidance, forms and secure ERP access — together in one modern platform.',
    heroPromo:'Calculate Promotion',heroLogin:'Login to ERP',live:'PUBLIC CALCULATORS · NO LOGIN REQUIRED',quick:'Instant Access',active:'Essential services in one place',
    promoSub:'Eligibility, service points, process timeline and future roadmap',paySub:'Fixation, payable basic, gross, deductions and net salary',employee:'Employee ERP',employeeSub:'Secure profile, service history and administration',policiesSub:'Promotion and pay-scale policy guidance',
    services:'Digital Services',servicesSub:'Fast access to the most important employee-service tools.',open:'Open',loginOpen:'Login Required',
    calcTitle:'Calculate without logging in',calcSub:'Use the promotion and pay-scale calculators directly from the homepage.',promoTab:'Promotion',payTab:'Pay Scale',
    policyTitle:'Policies & Rules',policySub:'Clear reference points for the calculations used by this platform.',policy1:'Promotion policy',policy1d:'Education-based service requirement, experience points and the one-year promotion process are reflected in the calculator.',policy2:'Pay-scale calculation rules',policy2d:'2015 pay stage, 2026 fixation, implementation rate, allowances and regular deductions are shown transparently.',policy3:'Independent reference',policy3d:'Always verify the applicable official rules and orders before a final administrative or financial decision.',
    noticeTitle:'Notices',noticeSub:'Platform notices and service updates.',noticeEmpty:'No new public notice has been published yet.',noticeHint:'When a verified notice is added, it will appear here.',
    formsTitle:'Forms Center',formsSub:'A dedicated area for useful employee-service forms.',form1:'Promotion-related forms',form2:'Leave and service forms',form3:'Salary and financial forms',formState:'Forms will be added here as verified files become available.',
    helpTitle:'Help & Support',helpSub:'Need help using the calculators or the platform?',helpText:'Developer support is available by phone and WhatsApp.',call:'Call',whatsapp:'WhatsApp',developer:'Developer Support',
    footerNav:'Quick links'
  }:{
    home:'হোম',promotion:'পদোন্নতি হিসাব',pay:'পে-স্কেল হিসাব',policies:'নীতিমালা',notices:'নোটিশ',forms:'ফরমসমূহ',help:'সহায়তা',login:'লগইন',
    eyebrow:'স্বাধীন · আধুনিক · নিরাপদ',title:'কর্মকর্তা-কর্মচারীদের জন্য প্রিমিয়াম ডিজিটাল সেবার অভিজ্ঞতা',desc:'পদোন্নতির যোগ্যতা, পে-স্কেল হিসাব, নীতিমালা সহায়িকা, ফরম এবং নিরাপদ ERP প্রবেশ—সবকিছু এক আধুনিক প্ল্যাটফর্মে।',
    heroPromo:'পদোন্নতি হিসাব করুন',heroLogin:'ERP-তে লগইন',live:'পাবলিক ক্যালকুলেটর · লগইন প্রয়োজন নেই',quick:'দ্রুত প্রবেশ',active:'প্রয়োজনীয় সেবা এক জায়গায়',
    promoSub:'যোগ্যতা, সার্ভিস পয়েন্ট, প্রক্রিয়ার সময় ও ভবিষ্যৎ ধাপ',paySub:'ফিক্সেশন, প্রাপ্য মূল বেতন, মোট, কর্তন ও নিট বেতন',employee:'কর্মকর্তা-কর্মচারী ERP',employeeSub:'নিরাপদ প্রোফাইল, চাকরি ইতিহাস ও প্রশাসন',policiesSub:'পদোন্নতি ও পে-স্কেল হিসাবের নীতিমালা সহায়িকা',
    services:'ডিজিটাল সেবাসমূহ',servicesSub:'গুরুত্বপূর্ণ কর্মকর্তা-কর্মচারী সেবায় দ্রুত প্রবেশ।',open:'খুলুন',loginOpen:'লগইন প্রয়োজন',
    calcTitle:'লগইন ছাড়াই হিসাব করুন',calcSub:'হোমপেজ থেকেই পদোন্নতি ও পে-স্কেল হিসাব ব্যবহার করুন।',promoTab:'পদোন্নতি',payTab:'পে-স্কেল',
    policyTitle:'নীতিমালা ও বিধি',policySub:'এই প্ল্যাটফর্মে ব্যবহৃত হিসাবের নিয়মগুলো সহজভাবে দেখুন।',policy1:'পদোন্নতি নীতিমালা',policy1d:'শিক্ষাগত যোগ্যতাভিত্তিক চাকরিকাল, অভিজ্ঞতা পয়েন্ট এবং এক বছরের পদোন্নতি প্রক্রিয়া ক্যালকুলেটরে অনুসরণ করা হয়েছে।',policy2:'পে-স্কেল হিসাবের নিয়ম',policy2d:'২০১৫ বেতন ধাপ, ২০২৬ ফিক্সেশন, বাস্তবায়ন হার, ভাতা ও নিয়মিত কর্তন স্বচ্ছভাবে দেখানো হয়।',policy3:'স্বাধীন তথ্য সহায়িকা',policy3d:'চূড়ান্ত প্রশাসনিক বা আর্থিক সিদ্ধান্তের আগে প্রযোজ্য অফিসিয়াল বিধি ও আদেশ যাচাই করুন।',
    noticeTitle:'নোটিশ',noticeSub:'প্ল্যাটফর্ম নোটিশ ও সেবা আপডেট।',noticeEmpty:'এখনো নতুন কোনো পাবলিক নোটিশ প্রকাশ করা হয়নি।',noticeHint:'যাচাইকৃত নোটিশ যুক্ত হলে এখানে দেখা যাবে।',
    formsTitle:'ফরমসমূহ',formsSub:'প্রয়োজনীয় কর্মকর্তা-কর্মচারী সেবা ফরমের জন্য নির্দিষ্ট কেন্দ্র।',form1:'পদোন্নতি-সংক্রান্ত ফরম',form2:'ছুটি ও চাকরি-সংক্রান্ত ফরম',form3:'বেতন ও আর্থিক ফরম',formState:'যাচাইকৃত ফাইল পাওয়া অনুযায়ী ফরমগুলো এখানে যুক্ত হবে।',
    helpTitle:'সহায়তা ও যোগাযোগ',helpSub:'ক্যালকুলেটর বা প্ল্যাটফর্ম ব্যবহার করতে সহায়তা প্রয়োজন?',helpText:'ফোন ও হোয়াটসঅ্যাপে ডেভেলপার সহায়তা পাওয়া যাবে।',call:'কল করুন',whatsapp:'হোয়াটসঅ্যাপ',developer:'ডেভেলপার সহায়তা',
    footerNav:'দ্রুত লিংক'
  };
  const navItems=[[copy.home,'top'],[copy.promotion,'public-calculator','promotion'],[copy.pay,'public-calculator','salary'],[copy.policies,'policies'],[copy.notices,'notices'],[copy.forms,'forms'],[copy.help,'help']];
  const goto=(id,tool)=>tool?openTool(tool):scrollTo(id);
  return <div id="top" className={'public premium-public '+(en?'lang-en':'lang-bn')}>
    <header className="public-nav luxury-nav">
      <div className="public-brand"><div className="brand-orb"><ShieldCheck size={19}/></div><div><b>{t.appName}</b><small>{t.appSub}</small></div></div>
      <nav className="public-menu">
        <div className="public-menu-links">{navItems.map(([label,id,tool])=><button key={label} className="nav-text-btn" onClick={()=>goto(id,tool)}>{label}</button>)}</div>
        <LangToggle lang={lang} setLang={setLang}/><button className="nav-login" onClick={onLogin}>{copy.login}<ArrowRight size={15}/></button>
      </nav>
    </header>

    <section className="public-hero luxury-hero">
      <div className="hero-glow glow-one"></div><div className="hero-glow glow-two"></div>
      <div className="public-copy">
        <span className="eyebrow luxury-eyebrow"><span className="pulse-dot"></span>{copy.eyebrow}</span>
        <h1>{copy.title}</h1><p>{copy.desc}</p>
        <div className="public-actions"><button className="luxury-primary" onClick={()=>openTool('promotion')}>{copy.heroPromo}<ArrowRight size={17}/></button><button className="luxury-secondary" onClick={onLogin}>{copy.heroLogin}</button></div>
        <div className="public-live"><Activity size={16}/><b>{copy.live}</b></div>
        <div className="trust-row"><span><ShieldCheck/> {en?'Secure Session':'নিরাপদ সেশন'}</span><span><Database/> {en?'Cloud Ready':'ক্লাউড প্রস্তুত'}</span><span><Activity/> {en?'Responsive':'রেসপনসিভ'}</span></div>
      </div>
      <div className="hero-panel luxury-panel">
        <div className="hero-panel-head"><div className="panel-icon"><Landmark/></div><div><b>{copy.quick}</b><small>{copy.active}</small></div><span className="status-pill"><span></span>{en?'LIVE':'সক্রিয়'}</span></div>
        <div className="quick-grid luxury-quick">
          <button onClick={()=>openTool('promotion')}><span className="quick-icon"><TrendingUp/></span><b>{copy.promotion}</b><small>{copy.promoSub}</small><ChevronRight className="quick-arrow"/></button>
          <button onClick={()=>openTool('salary')}><span className="quick-icon gold"><WalletCards/></span><b>{copy.pay}</b><small>{copy.paySub}</small><ChevronRight className="quick-arrow"/></button>
          <button onClick={onLogin}><span className="quick-icon violet"><Users/></span><b>{copy.employee}</b><small>{copy.employeeSub}</small><ChevronRight className="quick-arrow"/></button>
          <button onClick={()=>scrollTo('policies')}><span className="quick-icon teal"><BookOpen/></span><b>{copy.policies}</b><small>{copy.policiesSub}</small><ChevronRight className="quick-arrow"/></button>
        </div>
      </div>
    </section>

    <section id="services" className="public-section luxury-section">
      <div className="section-title centered"><span>{en?'SERVICES':'সেবাসমূহ'}</span><h2>{copy.services}</h2><p>{copy.servicesSub}</p></div>
      <div className="service-grid luxury-services">
        {[[copy.promotion,copy.promoSub,TrendingUp,'promotion'],[copy.pay,copy.paySub,WalletCards,'salary'],[copy.employee,copy.employeeSub,Users,'login'],[copy.policies,copy.policiesSub,BookOpen,'policies']].map(([a,b,I,target],idx)=><article className="service-card luxury-card" key={a}><div className="card-number">0{idx+1}</div><div className="service-icon"><I/></div><h3>{a}</h3><p>{b}</p><button onClick={()=>target==='login'?onLogin():target==='policies'?scrollTo('policies'):openTool(target)}>{target==='login'?copy.loginOpen:copy.open}<ChevronRight size={15}/></button></article>)}
      </div>
    </section>

    <section id="public-calculator" className="public-section calculator-stage">
      <div className="section-title centered"><span>{en?'PUBLIC TOOLS':'পাবলিক টুল'}</span><h2>{copy.calcTitle}</h2><p>{copy.calcSub}</p></div>
      <div className="calculator-switch"><button className={publicTool==='promotion'?'active':''} onClick={()=>setPublicTool('promotion')}><TrendingUp/>{copy.promoTab}</button><button className={publicTool==='salary'?'active':''} onClick={()=>setPublicTool('salary')}><WalletCards/>{copy.payTab}</button></div>
      <div className="public-calculator-card">{publicTool==='promotion'?<PromotionCenter lang={lang}/>:<SalaryCalculator lang={lang}/>}</div>
    </section>

    <section id="policies" className="public-section info-stage">
      <div className="section-title centered"><span>{en?'REFERENCE':'তথ্য সহায়িকা'}</span><h2>{copy.policyTitle}</h2><p>{copy.policySub}</p></div>
      {publicPolicies.length>0?<div className="library-grid">
        {publicPolicies.map(p=><article className="library-card" key={p.id}>
          <div className="library-top"><span className="library-type"><BookOpen size={15}/>{en?'Policy':'নীতিমালা'}</span>{p.category&&<small>{p.category}</small>}</div>
          <h3>{en?(p.title_en||p.title_bn):(p.title_bn||p.title_en)}</h3>
          <p>{en?(p.summary_en||p.summary_bn||''):(p.summary_bn||p.summary_en||'')}</p>
          <div className="library-meta"><span><CalendarDays size={14}/>{p.effective_date||p.publish_date||'—'}</span>{p.reference_no&&<span><FileText size={14}/>{p.reference_no}</span>}</div>
          {p.file_url&&<a className="library-link" href={p.file_url} target="_blank" rel="noreferrer">{en?'Open document':'ডকুমেন্ট খুলুন'}<ArrowRight size={14}/></a>}
        </article>)}
      </div>:<div className="info-grid three-col">
        {[[BookOpen,copy.policy1,copy.policy1d],[WalletCards,copy.policy2,copy.policy2d],[ShieldCheck,copy.policy3,copy.policy3d]].map(([I,h,d])=><article className="info-card" key={h}><div className="info-icon"><I/></div><h3>{h}</h3><p>{d}</p></article>)}
      </div>}
    </section>

    <section id="notices" className="public-section soft-stage">
      <div className="section-title centered"><span>{en?'UPDATES':'আপডেট'}</span><h2>{copy.noticeTitle}</h2><p>{copy.noticeSub}</p></div>
      {publicNotices.length>0?<div className="notice-list-public">
        {publicNotices.map(n=><article className="notice-public-card" key={n.id}>
          <div className="notice-date"><CalendarDays size={16}/><span>{n.publish_date||n.created_at?.slice?.(0,10)||'—'}</span></div>
          <div><div className="notice-tags">{n.pinned?<span>{en?'Important':'গুরুত্বপূর্ণ'}</span>:null}{n.category?<small>{n.category}</small>:null}</div>
          <h3>{en?(n.title_en||n.title_bn):(n.title_bn||n.title_en)}</h3><p>{en?(n.summary_en||n.summary_bn||''):(n.summary_bn||n.summary_en||'')}</p>
          {n.file_url&&<a className="library-link" href={n.file_url} target="_blank" rel="noreferrer">{en?'View notice':'নোটিশ দেখুন'}<ArrowRight size={14}/></a>}</div>
        </article>)}
      </div>:<div className="empty-premium"><div className="empty-icon"><Bell/></div><div><h3>{copy.noticeEmpty}</h3><p>{copy.noticeHint}</p></div></div>}
    </section>

    <section id="forms" className="public-section info-stage">
      <div className="section-title centered"><span>{en?'DOWNLOAD CENTER':'ডাউনলোড কেন্দ্র'}</span><h2>{copy.formsTitle}</h2><p>{copy.formsSub}</p></div>
      <div className="forms-grid">{[copy.form1,copy.form2,copy.form3].map((x,i)=><article className="form-placeholder" key={x}><div className="form-icon"><FileText/></div><div><b>{x}</b><small>{copy.formState}</small></div><span>0{i+1}</span></article>)}</div>
    </section>

    <section id="help" className="public-cta support-cta"><div><span>{en?'SUPPORT':'সহায়তা'}</span><h2>{copy.helpTitle}</h2><p>{copy.helpSub} {copy.helpText}</p></div><div className="support-actions"><a href="tel:01759084692"><PhoneCall/>{copy.call} · 01759084692</a><a className="wa-btn" href="https://wa.me/8801759084692" target="_blank" rel="noreferrer"><MessageCircle/>{copy.whatsapp}</a></div></section>

    <footer><div><b>{t.appName}</b><p>{t.independent}</p></div><div className="footer-links"><b>{copy.footerNav}</b><div>{navItems.slice(0,6).map(([label,id,tool])=><button key={label} onClick={()=>goto(id,tool)}>{label}</button>)}</div></div><div><HelpCircle/> {copy.developer}<br/><Phone/> 01759084692 · <a href="https://wa.me/8801759084692" target="_blank" rel="noreferrer">{copy.whatsapp}</a></div></footer>

    <a className="whatsapp-float" href="https://wa.me/8801759084692" target="_blank" rel="noreferrer" aria-label={copy.whatsapp} title={copy.whatsapp}><MessageCircle/><span>{copy.whatsapp}</span></a>
  </div>
}
function Stat({label,value,icon:Icon}){return <article className="stat-card"><div className="stat-icon"><Icon size={19}/></div><div><small>{label}</small><b>{value}</b></div></article>}


function DashboardHome({user,onPage,lang='bn'}){
  if(lang==='en')return <>
    <section className="hero"><div><span>SERVICE PLATFORM</span><h1>Employee Service Foundation</h1><p>Homepage, promotion calculator, pay scale calculator, employee management and service history are active.</p></div><div className="hero-chip"><Activity size={16}/> System Active</div></section>
    <section className="stats-grid"><Stat label="Role" value={roleLabel[user.role]||user.role} icon={ShieldCheck}/><Stat label="Employee ID" value={user.employee_id||'—'} icon={IdCard}/><Stat label="Account Status" value="Active" icon={Activity}/><Stat label="Security" value="Session Protected" icon={LockKeyhole}/></section>
    <section className="module-grid"><article className="module-card"><div className="module-icon"><BookUser/></div><h3>My Career</h3><p>Maintain your personal career profile, education and service timeline.</p><button className="ghost-btn" onClick={()=>onPage('career')}>Open Career <ChevronRight size={16}/></button></article><article className="module-card"><div className="module-icon"><TrendingUp/></div><h3>Promotion Centre</h3><p>Calculate eligibility date, annual cycle and future roadmap.</p><button className="ghost-btn" onClick={()=>onPage('promotion')}>Calculate <ChevronRight size={16}/></button></article>
    <article className="module-card"><div className="module-icon green"><WalletCards/></div><h3>Salary & Pay Scale</h3><p>Calculate fixation, payable basic, gross and net salary.</p><button className="ghost-btn" onClick={()=>onPage('salary')}>Calculate <ChevronRight size={16}/></button></article>
    <article className="module-card"><div className="module-icon"><Calculator/></div><h3>Calculator Center</h3><p>Service length, age, date difference and retirement-date estimate.</p><button className="ghost-btn" onClick={()=>onPage('calculators')}>Open Center <ChevronRight size={16}/></button></article></section>
    <section className="notice"><b>Notice</b><p>This is an independent and unofficial digital service platform.</p></section>
  </>;
  return <>
    <section className="hero"><div><span>সেবা প্ল্যাটফর্ম</span><h1>কর্মকর্তা-কর্মচারী সেবা ব্যবস্থা</h1><p>হোমপেজ, পদোন্নতি হিসাব, পে-স্কেল হিসাব, কর্মকর্তা-কর্মচারী ব্যবস্থাপনা ও চাকরি ইতিহাস সক্রিয়।</p></div><div className="hero-chip"><Activity size={16}/> সিস্টেম সক্রিয়</div></section>
    <section className="stats-grid"><Stat label="ভূমিকা" value={roleLabel[user.role]||user.role} icon={ShieldCheck}/><Stat label="কর্মী নম্বর" value={user.employee_id||'—'} icon={IdCard}/><Stat label="অ্যাকাউন্ট অবস্থা" value="সক্রিয়" icon={Activity}/><Stat label="নিরাপত্তা" value="সুরক্ষিত সেশন" icon={LockKeyhole}/></section>
    <section className="module-grid"><article className="module-card"><div className="module-icon"><BookUser/></div><h3>আমার চাকরি</h3><p>নিজের চাকরি প্রোফাইল, শিক্ষা ও সার্ভিস টাইমলাইন সংরক্ষণ করুন।</p><button className="ghost-btn" onClick={()=>onPage('career')}>খুলুন <ChevronRight size={16}/></button></article><article className="module-card"><div className="module-icon"><TrendingUp/></div><h3>পদোন্নতি কেন্দ্র</h3><p>যোগ্যতার তারিখ, বার্ষিক প্রক্রিয়া এবং ভবিষ্যৎ ধাপ হিসাব করুন।</p><button className="ghost-btn" onClick={()=>onPage('promotion')}>হিসাব করুন <ChevronRight size={16}/></button></article>
    <article className="module-card"><div className="module-icon green"><WalletCards/></div><h3>বেতন ও পে-স্কেল</h3><p>ফিক্সেশন, প্রাপ্য বেসিক, মোট ও নেট বেতন হিসাব করুন।</p><button className="ghost-btn" onClick={()=>onPage('salary')}>হিসাব করুন <ChevronRight size={16}/></button></article>
    <article className="module-card"><div className="module-icon"><Calculator/></div><h3>ক্যালকুলেটর সেন্টার</h3><p>চাকরিকাল, বয়স, তারিখের ব্যবধান এবং অবসর তারিখের অনুমান।</p><button className="ghost-btn" onClick={()=>onPage('calculators')}>সেন্টার খুলুন <ChevronRight size={16}/></button></article></section>
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
    <div className="internal-admin-note"><ShieldCheck size={15}/> System Control → User & Career Records</div><div className="page-head"><div><h2>Employee Management</h2><p>Profile, Department, Designation, Grade, joining information ও service status পরিচালনা করুন।</p></div><button onClick={()=>{setEditing(null);setModal(true)}}><Plus size={17}/> নতুন Employee</button></div>
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
  return <div><div className="internal-admin-note"><ShieldCheck size={15}/> System Control → Master Directory</div><div className="page-head"><div><h2>Department & Designation</h2><p>Employee profile-এর জন্য master directory পরিচালনা করুন।</p></div></div>{err&&<div className="error">{err}</div>}
    <div className="split-grid"><section className="breakdown-card"><h3>Departments / Offices</h3><div className="inline-add"><input placeholder="নতুন Department/Office" value={depName} onChange={e=>setDepName(e.target.value)}/><button className="primary" onClick={addDepartment}><Plus size={15}/> Add</button></div>{departments.map(x=><div className="directory-row" key={x.id}><Building2 size={16}/><span>{x.name_bn||x.name_en}</span><small>{x.type||'department'}</small></div>)}</section>
    <section className="breakdown-card"><h3>Designations</h3><div className="inline-add"><input placeholder="নতুন Designation" value={desName} onChange={e=>setDesName(e.target.value)}/><button className="primary" onClick={addDesignation}><Plus size={15}/> Add</button></div>{designations.map(x=><div className="directory-row" key={x.id}><Briefcase size={16}/><span>{x.name_bn||x.name_en}</span><small>{x.grade?`Grade ${x.grade}`:'—'}</small></div>)}</section></div>
  </div>
}



function CalculatorCenter({lang='bn',onPage}){
  const en=lang==='en';
  const [tool,setTool]=useState('service');
  const [service,setService]=useState({start:'',end:todayLocalIso()});
  const [age,setAge]=useState({dob:'',asOf:todayLocalIso()});
  const [gap,setGap]=useState({from:'',to:''});
  const [retire,setRetire]=useState({dob:'',age:'60'});
  const [result,setResult]=useState(null);

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
  const showDur=d=>en?`${numLang(d.y,lang,0)} years ${numLang(d.m,lang,0)} months ${numLang(d.d,lang,0)} days`:durationBn(d);
  const tools=[
    ['service',Clock3,en?'Service Length':'চাকরিকাল'],
    ['age',UserRound,en?'Age Calculator':'বয়স হিসাব'],
    ['gap',CalendarDays,en?'Date Difference':'তারিখের ব্যবধান'],
    ['retire',FileClock,en?'Retirement Estimate':'অবসর তারিখ']
  ];
  return <div className="calculator-center">
    <div className="page-head"><div><h2>{en?'Calculator Center':'ক্যালকুলেটর সেন্টার'}</h2><p>{en?'Simple service and date calculators. Policy-specific formulas are kept only in their verified modules.':'চাকরি ও তারিখভিত্তিক সহজ হিসাব। নীতিমালানির্ভর হিসাব শুধু যাচাইকৃত নিজস্ব মডিউলেই রাখা হয়েছে।'}</p></div></div>

    <div className="calc-hub-grid">
      <button className="calc-hub-card promotion" onClick={()=>onPage?.('promotion')}><TrendingUp/><div><b>{en?'Promotion Calculator':'পদোন্নতি হিসাব'}</b><small>{en?'Verified promotion rules and roadmap':'যাচাইকৃত পদোন্নতি নীতিমালা ও রোডম্যাপ'}</small></div><ChevronRight/></button>
      <button className="calc-hub-card salary" onClick={()=>onPage?.('salary')}><WalletCards/><div><b>{en?'Pay Scale Calculator':'পে-স্কেল হিসাব'}</b><small>{en?'Fixation, gross, deductions and payslip':'ফিক্সেশন, মোট বেতন, কর্তন ও পে-স্লিপ'}</small></div><ChevronRight/></button>
    </div>

    <div className="calculator-tabs">
      {tools.map(([k,I,l])=><button key={k} className={tool===k?'active':''} onClick={()=>{setTool(k);setResult(null)}}><I size={17}/>{l}</button>)}
    </div>

    <section className="calc-card calculator-tool-card">
      {tool==='service'&&<>
        <div className="tool-head"><Clock3/><div><h3>{en?'Service Length Calculator':'চাকরিকাল হিসাব'}</h3><p>{en?'Calculation date is taken automatically as today.':'হিসাবের তারিখ স্বয়ংক্রিয়ভাবে আজকের তারিখ নেওয়া হবে।'}</p></div></div>
        <div className="form-grid"><DMY label={en?'Joining / start date':'যোগদান / শুরুর তারিখ'} value={service.start} onChange={v=>setService({...service,start:v})}/></div>
        <div className="notice"><b>{en?'As of:':'হিসাব পর্যন্ত:'}</b> {fmtDateLang(todayLocalIso(),lang)}</div>
        <button className="primary wide" onClick={calcService}>{en?'Calculate Service Length':'চাকরিকাল হিসাব করুন'}</button>
      </>}
      {tool==='age'&&<>
        <div className="tool-head"><UserRound/><div><h3>{en?'Age Calculator':'বয়স হিসাব'}</h3><p>{en?'Exact age in years, months and days as of today.':'আজকের তারিখ অনুযায়ী বছর, মাস ও দিনে সঠিক বয়স।'}</p></div></div>
        <div className="form-grid"><DMY label={en?'Date of birth':'জন্মতারিখ'} value={age.dob} onChange={v=>setAge({...age,dob:v})}/></div>
        <div className="notice"><b>{en?'As of:':'হিসাব পর্যন্ত:'}</b> {fmtDateLang(todayLocalIso(),lang)}</div>
        <button className="primary wide" onClick={calcAge}>{en?'Calculate Age':'বয়স হিসাব করুন'}</button>
      </>}
      {tool==='gap'&&<>
        <div className="tool-head"><CalendarDays/><div><h3>{en?'Date Difference Calculator':'দুই তারিখের ব্যবধান'}</h3><p>{en?'Find the exact interval between any two dates.':'যেকোনো দুই তারিখের সঠিক ব্যবধান বের করুন।'}</p></div></div>
        <div className="form-grid"><DMY label={en?'From date':'শুরুর তারিখ'} value={gap.from} onChange={v=>setGap({...gap,from:v})}/><DMY label={en?'To date':'শেষ তারিখ'} value={gap.to} onChange={v=>setGap({...gap,to:v})}/></div>
        <button className="primary wide" onClick={calcGap}>{en?'Calculate Difference':'ব্যবধান হিসাব করুন'}</button>
      </>}
      {tool==='retire'&&<>
        <div className="tool-head"><FileClock/><div><h3>{en?'Retirement Date Estimate':'অবসর তারিখ অনুমান'}</h3><p>{en?'Enter the retirement age applicable to you; the system does not assume a policy age.':'আপনার ক্ষেত্রে প্রযোজ্য অবসরের বয়স নিজে দিন; সিস্টেম কোনো নীতিগত বয়স অনুমান করবে না।'}</p></div></div>
        <div className="form-grid"><DMY label={en?'Date of birth':'জন্মতারিখ'} value={retire.dob} onChange={v=>setRetire({...retire,dob:v})}/><label>{en?'Applicable retirement age':'প্রযোজ্য অবসরের বয়স'}<input type="number" min="1" max="100" value={retire.age} onChange={e=>setRetire({...retire,age:e.target.value})}/></label></div>
        <button className="primary wide" onClick={calcRetire}>{en?'Estimate Retirement Date':'অবসর তারিখ হিসাব করুন'}</button>
      </>}
    </section>

    {result&&<section className={`calculator-result ${result.error?'warn':'ok'}`}>
      {result.error?<><AlertTriangle/><div><h3>{en?'Unable to calculate':'হিসাব করা যায়নি'}</h3><p>{result.error}</p></div></>:
      result.type==='service'?<><CheckCircle2/><div><small>{en?'Total service length':'মোট চাকরিকাল'}</small><h3>{showDur(result.d)}</h3><p>{fmtDateLang(result.start,lang)} → {fmtDateLang(result.end,lang)}</p></div></>:
      result.type==='age'?<><CheckCircle2/><div><small>{en?'Current age':'বর্তমান বয়স'}</small><h3>{showDur(result.d)}</h3><p>{en?'Date of birth':'জন্মতারিখ'}: {fmtDateLang(result.dob,lang)}</p></div></>:
      result.type==='gap'?<><CheckCircle2/><div><small>{en?'Exact difference':'সঠিক ব্যবধান'}</small><h3>{showDur(result.d)}</h3><p>{fmtDateLang(result.from,lang)} → {fmtDateLang(result.to,lang)}</p></div></>:
      <><FileClock/><div><small>{en?'Estimated retirement date':'সম্ভাব্য অবসর তারিখ'}</small><h3>{fmtDateLang(result.retirement,lang)}</h3><p>{en?`Based on the retirement age you entered: ${numLang(result.years,lang,0)} years.`:`আপনার দেওয়া অবসরের বয়স ${numLang(result.years,lang,0)} বছর ধরে হিসাব করা হয়েছে।`}</p>{result.passed?<p className="calc-status-note">{en?'This calculated date has already passed.':'হিসাবকৃত তারিখটি ইতোমধ্যে অতিক্রান্ত হয়েছে।'}</p>:result.remaining&&<p className="calc-status-note">{en?'Time remaining: ':'বাকি সময়: '}{showDur(result.remaining)}</p>}</div></>}
    </section>}

    <section className="calculator-safety-note"><ShieldCheck/><div><b>{en?'Policy-safe design':'নীতিমালা-নিরাপদ নকশা'}</b><p>{en?'No unverified pension, gratuity, leave, increment or retirement formula has been added. Those calculators can be activated after their governing rules are verified.':'যাচাই ছাড়া পেনশন, গ্র্যাচুইটি, ছুটি, ইনক্রিমেন্ট বা অবসরের কোনো সূত্র যোগ করা হয়নি। সংশ্লিষ্ট নীতিমালা যাচাই হলে সেগুলো সক্রিয় করা যাবে।'}</p></div></section>
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
    <div className="page-head"><div><h2>{en?'Notice Board & Policy Library':'নোটিশ বোর্ড ও নীতিমালা লাইব্রেরি'}</h2><p>{en?'Publish verified notices and maintain a searchable policy/reference library.':'যাচাইকৃত নোটিশ প্রকাশ এবং নীতিমালা/রেফারেন্স লাইব্রেরি পরিচালনা করুন।'}</p></div></div>
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
    [tab,setTab]=useState('overview'),[busy,setBusy]=useState(false),[err,setErr]=useState(''),[settings,setSettings]=useState({
      support_phone:'01759084692',whatsapp:'01759084692',calendar_enabled:'0',calendar_source_url:'',maintenance_mode:'0'
    });
  async function load(){
    setBusy(true);setErr('');
    try{
      const [s,u,a,h,st]=await Promise.all([
        api('/api/admin/stats'),
        api('/api/admin/users'),
        api('/api/admin/audit?limit=80'),
        api('/api/admin/system-health'),
        api('/api/admin/settings')
      ]);
      setStats(s);setUsers(u.users||[]);setAuditRows(a.logs||[]);setHealth(h);setSettings(x=>({...x,...(st.settings||{})}));
    }catch(e){setErr(e.message)}finally{setBusy(false)}
  }
  useEffect(()=>{load()},[]);
  async function toggleUser(x){
    if(!confirm(en?`${x.is_active?'Deactivate':'Activate'} this account?`:`এই অ্যাকাউন্ট ${x.is_active?'নিষ্ক্রিয়':'সক্রিয়'} করবেন?`))return;
    try{await api(`/api/admin/users/${x.id}/status`,{method:'PUT',body:JSON.stringify({is_active:!x.is_active})});await load()}catch(e){alert(e.message)}
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
      <div><span>{en?'SYSTEM CONTROL CENTER':'সিস্টেম কন্ট্রোল সেন্টার'}</span><h2>{en?'System Administrator':'সিস্টেম ব্যবস্থাপক'}</h2><p>{en?'Technical operations, content, security and platform configuration — without making official employment decisions.':'প্রযুক্তিগত পরিচালনা, কনটেন্ট, নিরাপত্তা ও প্ল্যাটফর্ম কনফিগারেশন—কোনো অফিসিয়াল চাকরি-সংক্রান্ত সিদ্ধান্ত ছাড়াই।'}</p></div>
      <div className="admin-health-chip"><Activity size={16}/>{health?.ok?(en?'System Healthy':'সিস্টেম সচল'):(en?'Check Required':'যাচাই প্রয়োজন')}</div>
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
        <button onClick={()=>onPage?.('library')}><BookOpen/><div><b>{en?'Notices & Policies':'নোটিশ ও নীতিমালা'}</b><small>{en?'Publish reference content':'রেফারেন্স কনটেন্ট প্রকাশ'}</small></div><ChevronRight/></button>
        <button onClick={()=>setTab('security')}><ShieldCheck/><div><b>{en?'Security Center':'নিরাপত্তা কেন্দ্র'}</b><small>{en?'Sessions and account status':'সেশন ও অ্যাকাউন্ট অবস্থা'}</small></div><ChevronRight/></button>
      </section>
    </>}

    {tab==='users'&&<section className="admin-panel-card">
      <div className="admin-panel-head"><div><h3>{en?'User Management':'ব্যবহারকারী ব্যবস্থাপনা'}</h3><p>{en?'Technical account control only. No employment approval workflow.':'শুধু প্রযুক্তিগত অ্যাকাউন্ট নিয়ন্ত্রণ। চাকরি-সংক্রান্ত কোনো অনুমোদন নয়।'}</p></div><button className="secondary" onClick={load}><RefreshCw size={15}/>{en?'Refresh':'রিফ্রেশ'}</button></div>
      <div className="table-wrap"><table><thead><tr><th>{en?'User':'ব্যবহারকারী'}</th><th>{en?'Role':'ভূমিকা'}</th><th>{en?'Type':'ধরন'}</th><th>{en?'Status':'অবস্থা'}</th><th></th></tr></thead><tbody>
        {users.map(x=><tr key={x.id}><td><b>{x.name}</b><small style={{display:'block'}}>{x.email}</small></td><td>{roleText(x.role)}</td><td>{x.account_type||'employee'}</td><td><span className={'badge '+(x.is_active?'active':'')}>{x.is_active?(en?'Active':'সক্রিয়'):(en?'Inactive':'নিষ্ক্রিয়')}</span></td><td><button className="icon-btn" title={en?'Toggle status':'অবস্থা পরিবর্তন'} onClick={()=>toggleUser(x)}><Power size={15}/></button></td></tr>)}
      </tbody></table></div>
    </section>}

    {tab==='content'&&<section className="admin-panel-card">
      <div className="admin-panel-head"><div><h3>{en?'System Content Management':'সিস্টেম কনটেন্ট ব্যবস্থাপনা'}</h3><p>{en?'Public references, notices, policies, forms and help content.':'পাবলিক রেফারেন্স, নোটিশ, নীতিমালা, ফরম ও সহায়তা কনটেন্ট।'}</p></div></div>
      <div className="admin-action-grid compact-actions">
        <button onClick={()=>onPage?.('library')}><Bell/><div><b>{en?'Notices':'নোটিশ'}</b><small>{en?'Publish and pin verified updates':'যাচাইকৃত আপডেট প্রকাশ/পিন'}</small></div><ChevronRight/></button>
        <button onClick={()=>onPage?.('library')}><BookOpen/><div><b>{en?'Policies & Rules':'নীতিমালা ও বিধি'}</b><small>{en?'Reference library':'রেফারেন্স লাইব্রেরি'}</small></div><ChevronRight/></button>
        <button><FileText/><div><b>{en?'Forms & Links':'ফরম ও লিংক'}</b><small>{en?'Reference links only; no file storage':'শুধু রেফারেন্স লিংক; ফাইল স্টোরেজ নয়'}</small></div><ChevronRight/></button>
        <button><HelpCircle/><div><b>{en?'Help & FAQ':'সহায়তা ও প্রশ্নোত্তর'}</b><small>{en?'Support guidance':'ব্যবহার সহায়িকা'}</small></div><ChevronRight/></button>
      </div>
    </section>}

    {tab==='rules'&&<section className="admin-panel-card">
      <div className="admin-panel-head"><div><h3>{en?'Calculator Rules Registry':'ক্যালকুলেটর রুলস রেজিস্ট্রি'}</h3><p>{en?'Verified formulas remain code-controlled to prevent accidental calculation errors.':'হিসাবের ভুল এড়াতে যাচাইকৃত সূত্রগুলো কোড-নিয়ন্ত্রিত থাকবে।'}</p></div></div>
      <div className="rules-registry">
        <article><TrendingUp/><div><b>{en?'Promotion Rules':'পদোন্নতি নীতিমালা'}</b><p>{en?'Education-based service requirement, service points and one-year process.':'শিক্ষাগত যোগ্যতাভিত্তিক চাকরিকাল, সার্ভিস পয়েন্ট ও ১ বছরের প্রক্রিয়া।'}</p></div><span>{en?'Verified':'যাচাইকৃত'}</span></article>
        <article><WalletCards/><div><b>{en?'Pay Scale Rules':'পে-স্কেল নিয়ম'}</b><p>{en?'2015 stage, 2026 fixation, implementation rate, allowances and deductions.':'২০১৫ ধাপ, ২০২৬ ফিক্সেশন, বাস্তবায়ন হার, ভাতা ও কর্তন।'}</p></div><span>{en?'Verified':'যাচাইকৃত'}</span></article>
        <article><Calculator/><div><b>{en?'General Calculators':'সাধারণ ক্যালকুলেটর'}</b><p>{en?'Service length, age, date difference and retirement estimate.':'চাকরিকাল, বয়স, তারিখের ব্যবধান ও অবসর তারিখ অনুমান।'}</p></div><span>{en?'Active':'সক্রিয়'}</span></article>
      </div>
      <div className="notice"><b>{en?'Safety rule:':'নিরাপত্তা নীতি:'}</b> {en?'Calculator formulas are not editable from the admin UI. Changes should only be deployed after source verification and testing.':'অ্যাডমিন UI থেকে ক্যালকুলেটর সূত্র সম্পাদনা করা যাবে না। উৎস যাচাই ও টেস্টের পরই কোড ডেপ্লয় করে পরিবর্তন করতে হবে।'}</div>
    </section>}

    {tab==='calendar'&&<section className="admin-panel-card">
      <div className="admin-panel-head"><div><h3>{en?'Calendar Reference Management':'ক্যালেন্ডার রেফারেন্স ব্যবস্থাপনা'}</h3><p>{en?'Configure the published calendar source as an independent reference service.':'প্রকাশিত ক্যালেন্ডার উৎসকে স্বাধীন রেফারেন্স সেবা হিসেবে কনফিগার করুন।'}</p></div></div>
      <div className="form-grid">
        <label>{en?'Calendar reference enabled':'ক্যালেন্ডার রেফারেন্স চালু'}<select value={settings.calendar_enabled||'0'} onChange={e=>setSettings({...settings,calendar_enabled:e.target.value})}><option value="0">{en?'No':'না'}</option><option value="1">{en?'Yes':'হ্যাঁ'}</option></select></label>
        <label>{en?'Published source URL':'প্রকাশিত উৎসের URL'}<input value={settings.calendar_source_url||''} onChange={e=>setSettings({...settings,calendar_source_url:e.target.value})} placeholder="https://..."/></label>
      </div>
      <div className="notice"><b>{en?'Branding safeguard:':'ব্র্যান্ডিং সুরক্ষা:'}</b> {en?'The platform remains independent and unofficial; the calendar appears only as a sourced reference.':'প্ল্যাটফর্ম স্বাধীন ও অনানুষ্ঠানিক থাকবে; ক্যালেন্ডার শুধুমাত্র উৎস-উল্লেখসহ রেফারেন্স হিসেবে দেখানো হবে।'}</div>
      <button className="primary" onClick={saveSettings}><Save size={16}/>{en?'Save Calendar Settings':'ক্যালেন্ডার সেটিংস সংরক্ষণ'}</button>
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
  const params=new URLSearchParams(window.location.search);
  const queryAuth=params.get('auth')||'';
  const queryToken=params.get('token')||'';
  const[user,setUser]=useState(null),[loading,setLoading]=useState(true),[page,setPage]=useState('dashboard'),
    [showLogin,setShowLogin]=useState(()=>!!queryAuth),[authMode,setAuthMode]=useState(()=>queryAuth||'login'),[authToken,setAuthToken]=useState(()=>queryToken),
    [lang,setLang]=useState(()=>localStorage.getItem('app_lang')||'bn');
  useEffect(()=>{api('/api/me').then(x=>setUser(x.user)).catch(()=>{}).finally(()=>setLoading(false))},[]);
  useEffect(()=>{localStorage.setItem('app_lang',lang)},[lang]);
  async function logout(){try{await api('/api/logout',{method:'POST'})}catch{}setUser(null);setShowLogin(false);setPage('dashboard')}
  if(loading)return <div className="loading">Loading...</div>;
  if(!user)return showLogin?<AuthPortal onLogin={u=>{setUser(u);window.history.replaceState({},'',window.location.pathname)}} onBack={()=>{setShowLogin(false);setAuthMode('login');setAuthToken('');window.history.replaceState({},'',window.location.pathname)}} lang={lang} setLang={setLang} initialMode={authMode} initialToken={authToken}/>:<PublicHome onLogin={()=>{setAuthMode('login');setShowLogin(true)}} lang={lang} setLang={setLang}/>;
  const admin=['super_admin','admin','department_admin'].includes(user.role);
  return <div className="app"><aside className="side">
    <div className="brand"><div><b>{lang==='en'?'Employee Service ERP':'কর্মকর্তা-কর্মচারী সেবা'}</b><small>{lang==='en'?'Independent Platform':'স্বাধীন প্ল্যাটফর্ম'}</small></div></div>
    <nav>
      <button className={page==='dashboard'?'active':''} onClick={()=>setPage('dashboard')}><LayoutDashboard size={18}/>{lang==='en'?'My Dashboard':'আমার ড্যাশবোর্ড'}</button>
      <button className={page==='career'?'active':''} onClick={()=>setPage('career')}><BookUser size={18}/>{lang==='en'?'My Career':'আমার চাকরি'}</button>
      <button className={page==='promotion'?'active':''} onClick={()=>setPage('promotion')}><TrendingUp size={18}/>{lang==='en'?'Promotion':'পদোন্নতি'}</button>
      <button className={page==='salary'?'active':''} onClick={()=>setPage('salary')}><WalletCards size={18}/>{lang==='en'?'Salary & Pay Scale':'বেতন ও পে-স্কেল'}</button>
      <button className={page==='calculators'?'active':''} onClick={()=>setPage('calculators')}><Calculator size={18}/>{lang==='en'?'Calculator Center':'ক্যালকুলেটর সেন্টার'}</button>
      <button className={page==='library'?'active':''} onClick={()=>setPage('library')}><BookOpen size={18}/>{lang==='en'?'Notices & Policies':'নোটিশ ও নীতিমালা'}</button>
      <button className={page==='account'?'active':''} onClick={()=>setPage('account')}><LockKeyhole size={18}/>{lang==='en'?'Account & Security':'অ্যাকাউন্ট ও নিরাপত্তা'}</button>
      {admin&&<button className={page==='admin'?'active':''} onClick={()=>setPage('admin')}><ShieldCheck size={18}/>{lang==='en'?'System Control':'সিস্টেম কন্ট্রোল'}</button>}
    </nav></aside>
    <main><header><div><h2>{lang==='en'?`Welcome, ${user.name}`:`স্বাগতম, ${user.name}`}</h2><p>{lang==='en'?(roleLabel[user.role]||user.role):({super_admin:'সিস্টেম ব্যবস্থাপক',admin:'অ্যাডমিন',department_admin:'বিভাগীয় অ্যাডমিন',editor:'সম্পাদক',employee:'কর্মকর্তা-কর্মচারী'}[user.role]||user.role)}</p></div><div className="header-actions"><LangToggle lang={lang} setLang={setLang}/><button className="logout" onClick={logout}><LogOut size={16}/>{lang==='en'?'Logout':'লগআউট'}</button></div></header>
      {page==='dashboard'&&<DashboardHome user={user} onPage={setPage} lang={lang}/>} 
      {page==='career'&&<MyCareer lang={lang}/>}
      {page==='promotion'&&<PromotionCenter lang={lang}/>}
      {page==='salary'&&<SalaryCalculator lang={lang}/>}
      {page==='calculators'&&<CalculatorCenter lang={lang} onPage={setPage}/>}
      {page==='library'&&<NoticePolicyCenter lang={lang} canManage={admin}/>} 
      {page==='account'&&<AccountSecurity lang={lang}/>}
      {page==='employees'&&admin&&<EmployeeManagement lang={lang}/>}
      {page==='directory'&&admin&&<MasterDirectory lang={lang}/>}
      {page==='admin'&&admin&&<AdminPanel lang={lang} onPage={setPage}/>}
    </main></div>
}
createRoot(document.getElementById('root')).render(<App/>);
