
import React,{useEffect,useMemo,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {
  LayoutDashboard,TrendingUp,WalletCards,Users,ShieldCheck,LogOut,Plus,Search,
  UserRound,Building2,IdCard,Activity,ChevronRight,X,Save,Trash2,RefreshCw,
  Settings,Database,LockKeyhole,Home,BookOpen,Calculator,HelpCircle,Phone,
  Bell,ArrowRight,CalendarDays,CheckCircle2,AlertTriangle,Landmark,FileText,Camera,Briefcase,MapPin,Mail,PhoneCall,MessageCircle,Edit3,UserCircle2,History,ArrowRightLeft,GraduationCap,BadgeDollarSign,Clock3,FileClock,ServerCog,Gauge,UserCog,ScrollText,SlidersHorizontal,ShieldAlert,Link2,Eye,Power,BookUser,NotebookTabs,Milestone,Award,BarChart3,PieChart,LineChart,MonitorCheck,Sparkles,UserCheck,UserX,Boxes,Command,DatabaseZap,ShieldEllipsis,Radio,TrendingDown,ReceiptText,ChartNoAxesCombined,Route,Flag,Target
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
import FiscalOfficeCalendar,{LoggedInOfficeCalendar,CalendarDashboardWidget,AdminOfficeCalendarManager} from './calendar-phase15.jsx';
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
        const x=await api('/api/login',{method:'POST',body:JSON.stringify({email:form.email,password:form.password})});onLogin(x.user);return;
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
      <div className="smart-reg-title"><div className="auth-badge"><ShieldCheck size={15}/>{en?'SMART SELF-SERVICE SIGN UP':'স্মার্ট স্বয়ংক্রিয় সাইন আপ'}</div><h1>{en?'Create your personal service account':'আপনার ব্যক্তিগত সেবা অ্যাকাউন্ট তৈরি করুন'}</h1><p>{en?'Provide the necessary information once. Your dashboard and supported calculators can reuse it automatically.':'প্রয়োজনীয় তথ্য একবার দিন। পরে ড্যাশবোর্ড ও সমর্থিত ক্যালকুলেটরগুলো এই তথ্য স্বয়ংক্রিয়ভাবে ব্যবহার করবে।'}</p></div>
      <div className="smart-reg-steps">{steps.map((x,i)=><div key={x} className={`${i===step?'active':''} ${i<step?'done':''}`}><span>{i<step?<CheckCircle2/>:numLang(i+1,lang,0)}</span><b>{x}</b></div>)}</div>

      <form onSubmit={submit} className="smart-reg-form">
        {step===0&&<section className="reg-policy">
          <div className="reg-signup-benefits">
            <div className="reg-signup-benefits-head"><Sparkles/><div><h3>{en?'What you get after creating an account':'অ্যাকাউন্ট তৈরি করলে যা পাবেন'}</h3><p>{en?'Your own dashboard with career, promotion, points, salary, leave, calendar and report tools.':'নিজের Dashboard-এ Career, Promotion, Points, Salary, Leave, Calendar ও Report সুবিধা পাবেন।'}</p></div></div>
            <div className="reg-signup-mini-grid">
              <span><LayoutDashboard/>{en?'Dashboard':'ড্যাশবোর্ড'}</span>
              <span><TrendingUp/>{en?'Promotion':'পদোন্নতি'}</span>
              <span><Award/>{en?'Points':'পয়েন্ট'}</span>
              <span><WalletCards/>{en?'Salary':'বেতন'}</span>
              <span><CalendarDays/>{en?'Leave & Calendar':'ছুটি ও ক্যালেন্ডার'}</span>
              <span><FileText/>{en?'Reports':'রিপোর্ট'}</span>
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

  const title=mode==='forgot'?(en?'Recover your account':'অ্যাকাউন্ট পুনরুদ্ধার করুন'):(en?'Secure login':'নিরাপদ লগইন');
  return <div className="login-shell phase8-auth"><form className="login-card phase8-card" onSubmit={submit}>
    <div className="login-top"><button type="button" className="back-link" onClick={onBack}>{en?'← Back to Home':'← হোমে ফিরুন'}</button><LangToggle lang={lang} setLang={setLang}/></div>
    <div className="auth-badge"><ShieldCheck size={15}/>{en?'FREE SELF-SERVICE ACCOUNT':'বিনামূল্যের স্বয়ংক্রিয় অ্যাকাউন্ট'}</div>
    <h1>{title}</h1><p>{en?'Employee Digital Service Platform':'কর্মকর্তা-কর্মচারী ডিজিটাল সেবা'}</p>
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
function PublicHome({onLogin,onSignup,lang,setLang}){
  const en=lang==='en';
  const [publicTool,setPublicTool]=useState('promotion');
  const [publicNotices,setPublicNotices]=useState([]);
  const [publicPolicies,setPublicPolicies]=useState([]);
  const [publicMenu,setPublicMenu]=useState(false);

  useEffect(()=>{
    trackPublic('page_view','home');
    Promise.all([
      api('/api/public/notices?limit=4').catch(()=>({notices:[]})),
      api('/api/public/policies?limit=4').catch(()=>({policies:[]}))
    ]).then(([n,p])=>{setPublicNotices(n.notices||[]);setPublicPolicies(p.policies||[])});
  },[]);

  const scrollTo=id=>{setPublicMenu(false);requestAnimationFrame(()=>document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'}))};
  const openTool=tool=>{setPublicTool(tool);scrollTo('public-tools')};

  const quickServices=[
    [TrendingUp,en?'Promotion':'পদোন্নতি',()=>openTool('promotion'),'green'],
    [Award,en?'Points Calculator':'পয়েন্ট ক্যালকুলেটর',onLogin,'blue'],
    [WalletCards,en?'Pay Scale & Salary':'পে-স্কেল ও বেতন',()=>openTool('salary'),'orange'],
    [Briefcase,en?'Service Length':'চাকরিকাল হিসাব',onLogin,'cyan'],
    [CalendarDays,en?'Leave Management':'ছুটি ব্যবস্থাপনা',onLogin,'pink'],
    [CalendarDays,en?'Office Calendar':'ক্যালেন্ডার',()=>scrollTo('calendar'),'indigo'],
    [BookOpen,en?'Policies':'নীতিমালা',()=>scrollTo('policies'),'violet'],
    [FileText,en?'Reports':'রিপোর্ট',onLogin,'slate']
  ];

  const loginBenefits=[
    [LayoutDashboard,en?'Personal Dashboard':'ব্যক্তিগত ড্যাশবোর্ড',en?'Career, salary, leave and points in one view.':'ক্যারিয়ার, বেতন, ছুটি ও পয়েন্ট এক নজরে।'],
    [UserRound,en?'Career Profile':'চাকরি ও ক্যারিয়ার প্রোফাইল',en?'Keep your own employment information organized.':'নিজের চাকরির তথ্য গুছিয়ে রাখুন।'],
    [TrendingUp,en?'Promotion Forecast':'পদোন্নতি Forecast',en?'Eligibility, remaining time and roadmap.':'যোগ্যতা, বাকি সময় ও রোডম্যাপ।'],
    [Award,en?'Points Calculator':'পয়েন্ট ক্যালকুলেটর',en?'Service, education and supported house points.':'সার্ভিস, শিক্ষা ও সমর্থিত বাসা বরাদ্দ পয়েন্ট।'],
    [WalletCards,en?'Salary & Pay Scale':'বেতন ও পে-স্কেল',en?'Basic, gross, deductions and net salary.':'মূল, মোট, কর্তন ও নিট বেতন।'],
    [ReceiptText,en?'Salary History':'বেতন ইতিহাস',en?'Keep and review your own salary records.':'নিজের বেতন রেকর্ড সংরক্ষণ ও পর্যালোচনা।'],
    [CalendarDays,en?'Leave & Calendar':'ছুটি ও ক্যালেন্ডার',en?'Personal leave records and office dates.':'ব্যক্তিগত ছুটি ও অফিসের দিন-তারিখ।'],
    [FileText,en?'Career Reports':'ক্যারিয়ার রিপোর্ট',en?'Personal career, salary and leave summaries.':'ক্যারিয়ার, বেতন ও ছুটির ব্যক্তিগত সারাংশ।'],
    [BookOpen,en?'Knowledge Center':'নলেজ সেন্টার',en?'Notices, policies and useful references.':'নোটিশ, নীতিমালা ও প্রয়োজনীয় রেফারেন্স।'],
    [LockKeyhole,en?'Account & Security':'অ্যাকাউন্ট ও নিরাপত্তা',en?'Password, recovery and privacy controls.':'Password, Recovery ও Privacy নিয়ন্ত্রণ।']
  ];

  return <div id="top" className="mx-home">
    <header className="mx-header">
      <button className="mx-brand" onClick={()=>scrollTo('top')}>
        <span className="mx-brand-icon"><Landmark/></span>
        <span><b>{en?'Employee Digital Service Platform':'কর্মকর্তা-কর্মচারী ডিজিটাল সেবা'}</b><small>{en?'Personal Career & Service Management':'ব্যক্তিগত ক্যারিয়ার ও সেবা ব্যবস্থাপনা'}</small></span>
      </button>

      <nav className={`mx-main-nav ${publicMenu?'open':''}`}>
        <div className="mx-menu-head"><b>{en?'Menu':'মেনু'}</b><button onClick={()=>setPublicMenu(false)}><X/></button></div>
        <button onClick={()=>scrollTo('top')}>{en?'Home':'হোম'}</button>
        <button onClick={()=>scrollTo('services')}>{en?'Services':'সেবাসমূহ'}</button>
        <button onClick={()=>scrollTo('benefits')}>{en?'Benefits':'সুবিধাসমূহ'}</button>
        <button onClick={()=>scrollTo('points')}>{en?'Points':'পয়েন্ট'}</button>
        <button onClick={()=>scrollTo('calendar')}>{en?'Calendar':'ক্যালেন্ডার'}</button>
        <button onClick={()=>scrollTo('notices')}>{en?'Notices':'নোটিশ'}</button>
        <button onClick={()=>scrollTo('policies')}>{en?'Policies':'নীতিমালা'}</button>
      </nav>

      <div className="mx-head-actions">
        <LangToggle lang={lang} setLang={setLang}/>
        <button className="mx-signin" onClick={onLogin}>{en?'Sign in':'সাইন ইন'}</button>
        <button className="mx-signup" onClick={onSignup}>{en?'New Account':'নতুন অ্যাকাউন্ট'}</button>
        <button className="mx-menu-btn" onClick={()=>setPublicMenu(v=>!v)}><Boxes/></button>
      </div>
    </header>
    <button className={`mx-backdrop ${publicMenu?'show':''}`} onClick={()=>setPublicMenu(false)}></button>

    <section className="mx-hero">
      <div className="mx-hero-photo" aria-hidden="true"></div>
      <div className="mx-hero-bg"><i></i><i></i><i></i></div>
      <div className="mx-hero-copy">
        <span className="mx-kicker"><Sparkles/>{en?'PERSONAL · SMART · SELF-SERVICE':'ব্যক্তিগত · স্মার্ট · স্বয়ংক্রিয় সেবা'}</span>
        <h1>{en?'Your career, salary, promotion and points — all in one place':'আপনার ক্যারিয়ার, বেতন, পদোন্নতি ও পয়েন্ট—সব হিসাব এক জায়গায়'}</h1>
        <p>{en?'Manage personal career information, supported calculations, salary, points, leave and useful service records from one modern account.':'একটি আধুনিক অ্যাকাউন্ট থেকে ব্যক্তিগত ক্যারিয়ার তথ্য, সমর্থিত হিসাব, বেতন, পয়েন্ট, ছুটি ও প্রয়োজনীয় সেবা রেকর্ড পরিচালনা করুন।'}</p>
        <div className="mx-hero-buttons">
          <button className="primary" onClick={onLogin}>{en?'Sign in now':'সাইন ইন করুন'}<ArrowRight/></button>
          <button className="secondary" onClick={onSignup}>{en?'Create new account':'নতুন অ্যাকাউন্ট তৈরি করুন'}<ChevronRight/></button>
        </div>
        <div className="mx-hero-trust">
          <span><CheckCircle2/>{en?'Necessary information only':'শুধু প্রয়োজনীয় তথ্য'}</span>
          <span><ShieldCheck/>{en?'Private self-service':'ব্যক্তিগত Self-Service'}</span>
          <span><Calculator/>{en?'Automatic calculations':'স্বয়ংক্রিয় হিসাব'}</span>
        </div>
      </div>

      <div className="mx-hero-device" aria-hidden="true">
        <div className="mx-desk">
          <div className="mx-desk-bar"><span></span><span></span><span></span></div>
          <div className="mx-desk-body">
            <aside>
              <b></b>{Array.from({length:7},(_,i)=><i key={i}></i>)}
            </aside>
            <main>
              <div className="mx-preview-head"><span className="mx-inline-avatar" aria-hidden="true"><i className="hair"></i><i className="head"></i><i className="body"></i><i className="shirt"></i></span><div><strong>{en?'Welcome, Sample User':'শুভ অপরাহ্ন, নমুনা ব্যবহারকারী'}</strong><small>{en?'Employee · Grade 13':'কর্মচারী · গ্রেড ১৩'}</small></div><em>{en?'Profile 82%':'প্রোফাইল ৮২%'}</em></div>
              <div className="mx-preview-shortcuts">
                {[['চাকরি',BookUser],['পদোন্নতি',TrendingUp],['পয়েন্ট',Award],['বেতন',WalletCards],['ছুটি',CalendarDays],['ক্যালেন্ডার',CalendarDays],['রিপোর্ট',FileText],['নিরাপত্তা',LockKeyhole]].map(([label,I])=><i key={label}><I/><b>{en?({চাকরি:'Career',পদোন্নতি:'Promotion',পয়েন্ট:'Points',বেতন:'Salary',ছুটি:'Leave',ক্যালেন্ডার:'Calendar',রিপোর্ট:'Reports',নিরাপত্তা:'Security'}[label]):label}</b></i>)}
              </div>
              <div className="mx-preview-row"><i><small>{en?'Service':'চাকরিকাল'}</small><b>{en?'16y 4m':'১৬ বছর ৪ মাস'}</b></i><i><small>{en?'Next Promotion':'পরবর্তী পদোন্নতি'}</small><b>{en?'1y 8m':'১ বছর ৮ মাস'}</b></i><i><small>{en?'Current Basic':'বর্তমান মূল বেতন'}</small><b>{en?'Tk 16,000':'৳ ১৬,০০০'}</b></i></div>
              <div className="mx-preview-chart"><span></span><span></span><span></span><span></span><span></span><span></span></div>
            </main>
          </div>
        </div>
        <div className="mx-mobile">
          <div className="mx-notch"></div>
          <div className="mx-mobile-profile"><span className="mx-inline-avatar small" aria-hidden="true"><i className="hair"></i><i className="head"></i><i className="body"></i><i className="shirt"></i></span><div><b>{en?'Sample User':'নমুনা ব্যবহারকারী'}</b><small>{en?'Employee':'কর্মচারী'}</small></div></div>
          <div className="mx-mobile-grid">{[[BookUser,'চাকরি'],[TrendingUp,'পদোন্নতি'],[Award,'পয়েন্ট'],[WalletCards,'বেতন'],[CalendarDays,'ছুটি'],[CalendarDays,'ক্যালেন্ডার'],[FileText,'রিপোর্ট'],[LockKeyhole,'নিরাপত্তা']].map(([I,label])=><i key={label}><I/><b>{en?({চাকরি:'Career',পদোন্নতি:'Promo',পয়েন্ট:'Points',বেতন:'Salary',ছুটি:'Leave',ক্যালেন্ডার:'Cal',রিপোর্ট:'Report',নিরাপত্তা:'Security'}[label]):label}</b></i>)}</div>
          <div className="mx-mobile-panels"><i><small>{en?'Service':'চাকরিকাল'}</small><b>{en?'16y 4m':'১৬ বছর ৪ মাস'}</b></i><i><small>{en?'Basic':'মূল বেতন'}</small><b>{en?'Tk 16,000':'৳ ১৬,০০০'}</b></i></div>
          <div className="mx-mobile-nav">{Array.from({length:5},(_,i)=><i key={i}></i>)}</div>
        </div>
        <div className="mx-float-card f1"><TrendingUp/><b>{en?'Promotion':'পদোন্নতি'}</b></div>
        <div className="mx-float-card f2"><Award/><b>{en?'Points':'পয়েন্ট'}</b></div>
        <div className="mx-float-card f3"><WalletCards/><b>{en?'Salary':'বেতন'}</b></div>
      </div>
    </section>

    <section id="services" className="mx-section mx-services">
      <div className="mx-section-title">
        <span>{en?'QUICK SERVICES':'দ্রুত সেবা'}</span>
        <h2>{en?'Important services, arranged for one-click access':'গুরুত্বপূর্ণ সব সেবা, এক ক্লিকে ব্যবহারের জন্য সাজানো'}</h2>
        <p>{en?'The most-used career and employee service tools are available from the homepage.':'সবচেয়ে প্রয়োজনীয় ক্যারিয়ার ও কর্মজীবন-সংক্রান্ত সেবাগুলো হোমপেজ থেকেই দ্রুত ব্যবহার করুন।'}</p>
      </div>
      <div className="mx-quick-grid">
        {quickServices.map(([Icon,title,action,tone])=><button key={title} className={`mx-quick-card ${tone}`} onClick={action}>
          <span><Icon/></span><b>{title}</b><ChevronRight/>
        </button>)}
      </div>
    </section>

    <section id="benefits" className="mx-section mx-benefits">
      <div className="mx-section-title">
        <span>{en?'AFTER SIGN IN':'লগইন করলে যা পাবেন'}</span>
        <h2>{en?'Your own personal career and service workspace':'নিজের ব্যক্তিগত ক্যারিয়ার ও সেবা ব্যবস্থাপনা'}</h2>
        <p>{en?'Sign in once to use your saved information across the supported dashboard, calculations and personal records.':'একবার লগইন করলে সংরক্ষিত তথ্য ব্যবহার করে Dashboard, হিসাব ও ব্যক্তিগত রেকর্ড এক জায়গা থেকে পরিচালনা করতে পারবেন।'}</p>
      </div>
      <div className="mx-benefit-layout">
        <div className="mx-benefit-screen">
          <div className="mx-benefit-top"></div>
          <div className="mx-benefit-body">
            <aside>{Array.from({length:7},(_,i)=><i key={i}></i>)}</aside>
            <main>
              <div className="mx-benefit-profile"><span className="mx-inline-avatar" aria-hidden="true"><i className="hair"></i><i className="head"></i><i className="body"></i><i className="shirt"></i></span><div><strong>{en?'Sample Career Dashboard':'নমুনা ক্যারিয়ার ড্যাশবোর্ড'}</strong><small>{en?'Profile complete 82%':'প্রোফাইল সম্পন্ন ৮২%'}</small></div></div>
              <div className="mx-benefit-mini">{[[BookUser,'চাকরি'],[TrendingUp,'পদোন্নতি'],[Award,'পয়েন্ট'],[WalletCards,'বেতন'],[CalendarDays,'ছুটি'],[CalendarDays,'ক্যালেন্ডার'],[FileText,'রিপোর্ট'],[BookOpen,'নীতিমালা']].map(([I,label])=><i key={label}><I/><b>{en?({চাকরি:'Career',পদোন্নতি:'Promotion',পয়েন্ট:'Points',বেতন:'Salary',ছুটি:'Leave',ক্যালেন্ডার:'Calendar',রিপোর্ট:'Reports',নীতিমালা:'Policies'}[label]):label}</b></i>)}</div>
              <div className="mx-benefit-bottom"><i><small>{en?'Service':'চাকরিকাল'}</small><b>{en?'16y 4m':'১৬ বছর ৪ মাস'}</b></i><i><small>{en?'Promotion':'পদোন্নতি'}</small><b>{en?'1y 8m left':'১ বছর ৮ মাস বাকি'}</b></i><i><small>{en?'Basic':'মূল বেতন'}</small><b>{en?'Tk 16,000':'৳ ১৬,০০০'}</b></i></div>
            </main>
          </div>
          <div className="mx-benefit-bubble one"><Award/>{en?'Points':'পয়েন্ট'}</div>
          <div className="mx-benefit-bubble two"><TrendingUp/>{en?'Promotion':'পদোন্নতি'}</div>
          <div className="mx-benefit-bubble three"><WalletCards/>{en?'Salary':'বেতন'}</div>
        </div>
        <div className="mx-benefit-cards">
          {loginBenefits.map(([Icon,title,desc],i)=><article key={title} className={`mx-benefit-card b${i+1}`}>
            <span><Icon/></span><div><h3>{title}</h3><p>{desc}</p></div>
          </article>)}
        </div>
      </div>
      <div className="mx-benefit-cta">
        <div><b>{en?'Create your personal account and start organizing your career information.':'নিজের অ্যাকাউন্ট তৈরি করে ক্যারিয়ারের প্রয়োজনীয় তথ্য গুছিয়ে রাখা শুরু করুন।'}</b><small>{en?'Enter the necessary information once and reuse it across supported services.':'প্রয়োজনীয় তথ্য একবার দিন—সমর্থিত সেবাগুলো পরে সেই তথ্য ব্যবহার করবে।'}</small></div>
        <button onClick={onSignup}>{en?'Create Account':'অ্যাকাউন্ট তৈরি করুন'}<ArrowRight/></button>
      </div>
    </section>

    <section className="mx-band">
      <div><span>{en?'PERSONAL CAREER MANAGEMENT':'ব্যক্তিগত ক্যারিয়ার ব্যবস্থাপনা'}</span><h2>{en?'One profile, multiple supported calculations and records':'একবার তথ্য দিন—ড্যাশবোর্ড ও সমর্থিত হিসাবগুলো পরে নিজে থেকেই কাজে লাগবে'}</h2><p>{en?'A clean personal workspace for your career, salary, points, leave and reports.':'ক্যারিয়ার, বেতন, পয়েন্ট, ছুটি ও রিপোর্টের জন্য একটি পরিষ্কার ব্যক্তিগত workspace।'}</p></div>
      <div><button onClick={onSignup}>{en?'New Account':'নতুন অ্যাকাউন্ট'}<ArrowRight/></button><button onClick={onLogin}>{en?'Sign in':'সাইন ইন'}</button></div>
    </section>

    <section id="points" className="mx-section mx-points">
      <div className="mx-section-title">
        <span>{en?'POINTS CENTER':'পয়েন্ট ক্যালকুলেটর'}</span>
        <h2>{en?'Three point systems, one clean center':'তিন ধরনের পয়েন্ট—একটি পরিষ্কার সেন্টার'}</h2>
      </div>
      <div className="mx-point-grid">
        <article><span className="g"><Clock3/></span><h3>{en?'Service Points':'সার্ভিস পয়েন্ট'}</h3><p>{en?'Service-experience based point calculation.':'চাকরির অভিজ্ঞতাভিত্তিক সার্ভিস পয়েন্ট হিসাব।'}</p></article>
        <article><span className="v"><GraduationCap/></span><h3>{en?'Education Points':'শিক্ষাগত যোগ্যতার পয়েন্ট'}</h3><p>{en?'Qualification points from supported academic results.':'সমর্থিত শিক্ষাগত ফলাফল থেকে যোগ্যতার পয়েন্ট।'}</p></article>
        <article><span className="p"><Home/></span><h3>{en?'House Allocation Points':'বাসা বরাদ্দ পয়েন্ট'}</h3><p>{en?'Automatic calculation for supported employee categories.':'সমর্থিত কর্মী শ্রেণির জন্য স্বয়ংক্রিয় হিসাব।'}</p></article>
      </div>
    </section>

    <section className="mx-section mx-two-up">
      <article className="mx-module-card">
        <div className="mx-module-head"><span><TrendingUp/></span><div><small>{en?'CAREER':'ক্যারিয়ার'}</small><h3>{en?'Promotion & Career Roadmap':'পদোন্নতি ও ক্যারিয়ার রোডম্যাপ'}</h3></div></div>
        <div className="mx-roadmap">
          <i></i><div><b>{en?'Current position':'বর্তমান অবস্থান'}</b><small>{en?'Current grade and service timeline':'বর্তমান গ্রেড ও চাকরিকাল টাইমলাইন'}</small></div>
          <i></i><div><b>{en?'Next eligibility':'পরবর্তী যোগ্যতা'}</b><small>{en?'Required service and remaining time':'প্রয়োজনীয় চাকরিকাল ও বাকি সময়'}</small></div>
          <i></i><div><b>{en?'Future roadmap':'ভবিষ্যৎ রোডম্যাপ'}</b><small>{en?'Next supported promotion steps':'পরবর্তী সমর্থিত পদোন্নতির ধাপ'}</small></div>
        </div>
      </article>
      <article className="mx-module-card">
        <div className="mx-module-head"><span><WalletCards/></span><div><small>{en?'SALARY':'বেতন'}</small><h3>{en?'Salary & Pay Scale Snapshot':'বেতন ও পে-স্কেল সারাংশ'}</h3></div></div>
        <div className="mx-salary-boxes"><div><small>{en?'Basic':'মূল বেতন'}</small><b>—</b></div><div><small>{en?'Gross':'মোট বেতন'}</small><b>—</b></div><div><small>{en?'Net':'নিট বেতন'}</small><b>—</b></div></div>
        <div className="mx-salary-bars"><i></i><i></i><i></i><i></i><i></i></div>
      </article>
    </section>

    <section id="public-tools" className="mx-section mx-public-tools">
      <div className="mx-section-title">
        <span>{en?'PUBLIC CALCULATORS':'পাবলিক ক্যালকুলেটর'}</span>
        <h2>{en?'Use selected calculators without signing in':'সাইন ইন ছাড়াই নির্বাচিত হিসাব ব্যবহার করুন'}</h2>
      </div>
      <div className="mx-tool-tabs">
        <button className={publicTool==='promotion'?'active':''} onClick={()=>setPublicTool('promotion')}><TrendingUp/>{en?'Promotion':'পদোন্নতি'}</button>
        <button className={publicTool==='salary'?'active':''} onClick={()=>setPublicTool('salary')}><WalletCards/>{en?'Pay Scale':'পে-স্কেল'}</button>
      </div>
      <div className="mx-tool-stage">{publicTool==='promotion'?<PromotionCenter lang={lang}/>:<SalaryCalculator lang={lang}/>}</div>
    </section>

    <section id="calendar" className="mx-section mx-calendar">
      <div className="mx-section-title">
        <span>{en?'OFFICE CALENDAR':'অফিস ক্যালেন্ডার'}</span>
        <h2>{en?'Office days and holidays at a glance':'অফিসের দিন-তারিখ এক নজরে'}</h2>
      </div>
      <FiscalOfficeCalendar lang={lang}/>
    </section>

    <section className="mx-section mx-info-grid">
      <div id="notices" className="mx-info-panel">
        <div className="mx-panel-title"><span>{en?'LATEST':'সাম্প্রতিক'}</span><h2>{en?'Notices':'নোটিশ'}</h2></div>
        <div className="mx-list">
          {publicNotices.length?publicNotices.map((n,i)=><article key={n.id||i}><i className={`dot d${i}`}></i><div><b>{en?(n.title_en||n.title_bn):(n.title_bn||n.title_en)}</b><small>{n.publish_date||n.created_at?.slice?.(0,10)||'—'}</small></div></article>):<div className="mx-empty">{en?'No public notice available':'কোনো পাবলিক নোটিশ নেই'}</div>}
        </div>
      </div>
      <div id="policies" className="mx-info-panel">
        <div className="mx-panel-title"><span>{en?'REFERENCE':'তথ্য সহায়িকা'}</span><h2>{en?'Policies':'নীতিমালা'}</h2></div>
        <div className="mx-list">
          {publicPolicies.length?publicPolicies.map((p,i)=><article key={p.id||i}><span className={`doc d${i}`}><BookOpen/></span><div><b>{en?(p.title_en||p.title_bn):(p.title_bn||p.title_en)}</b><small>{p.effective_date||p.publish_date||'—'}</small></div></article>):<div className="mx-empty">{en?'No public policy available':'কোনো পাবলিক নীতিমালা নেই'}</div>}
        </div>
      </div>
    </section>

    <section className="mx-section mx-security">
      <div><span className="mx-security-icon"><ShieldCheck/></span><div><small>{en?'PRIVACY & SECURITY':'গোপনীয়তা ও নিরাপত্তা'}</small><h2>{en?'Only information necessary for supported services is requested':'সমর্থিত সেবার জন্য প্রয়োজনীয় তথ্যই নেওয়া হয়'}</h2><p>{en?'Bank account details, card information, PIN, OTP and mobile-banking secrets are not required.':'ব্যাংক অ্যাকাউন্ট, কার্ডের তথ্য, PIN, OTP বা মোবাইল ব্যাংকিংয়ের গোপন তথ্যের প্রয়োজন নেই।'}</p></div></div>
      <button onClick={onSignup}>{en?'Read & Create Account':'জেনে-বুঝে অ্যাকাউন্ট তৈরি করুন'}<ArrowRight/></button>
    </section>

    <section className="mx-support">
      <div><small>{en?'SUPPORT':'সহায়তা'}</small><h2>{en?'Need help using the platform?':'প্ল্যাটফর্ম ব্যবহার করতে সহায়তা প্রয়োজন?'}</h2><p>{en?'Developer support is available for technical assistance.':'কারিগরি সহায়তার জন্য Developer Support রয়েছে।'}</p></div>
      <div><a href="tel:01759084692"><PhoneCall/>{en?'Call':'কল'} · 01759084692</a><a href="https://wa.me/8801759084692" target="_blank" rel="noreferrer"><MessageCircle/>WhatsApp</a></div>
    </section>

    <footer className="mx-footer">
      <div><b>{en?'Employee Digital Service Platform':'কর্মকর্তা-কর্মচারী ডিজিটাল সেবা'}</b><p>{en?'Independent personal self-service platform.':'ব্যক্তিগত উদ্যোগে তৈরি স্বাধীন Self-Service Platform।'}</p></div>
      <div><button onClick={()=>scrollTo('services')}>{en?'Services':'সেবাসমূহ'}</button><button onClick={()=>scrollTo('benefits')}>{en?'Benefits':'সুবিধাসমূহ'}</button><button onClick={()=>scrollTo('calendar')}>{en?'Calendar':'ক্যালেন্ডার'}</button><button onClick={()=>scrollTo('notices')}>{en?'Notices':'নোটিশ'}</button><button onClick={()=>scrollTo('policies')}>{en?'Policies':'নীতিমালা'}</button></div>
      <div><small>{en?'Developer Support':'ডেভেলপার সহায়তা'}</small><b>মোঃ মশিউর রহমান · 01759084692</b></div>
    </footer>
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
      api('/api/public/notices?limit=4')
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
  if(r.stop)return <div className="result-stack"><section className="result-panel warn"><h3>{r.rule.target}</h3><p>{en?'Reference':'রেফারেন্স'}: {r.rule.ref||r.rule.page||'—'}</p></section><button className="primary wide" onClick={()=>setPreview(true)}><FileText size={17}/> {en?'A4 PDF Preview':'বিস্তারিত A4 PDF প্রিভিউ'}</button>{preview&&<PdfPreviewModal html={report} filename={filename} onClose={()=>setPreview(false)} lang={lang}/>}</div>;

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
    {preview&&<PdfPreviewModal html={report} filename={filename} onClose={()=>setPreview(false)} lang={lang}/>}
  </div>
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

function PointsCalculator({lang='bn'}){
  const en=lang==='en';
  const today=todayLocalIso();
  const [tab,setTab]=useState('service');
  const [service,setService]=useState({firstJoin:'',currentPostStart:'',asOf:today});
  const [serviceResult,setServiceResult]=useState(null);
  const [edu,setEdu]=useState({
    ssc:'',hsc:'',graduationType:'honours',graduationResult:'',masters:''
  });

  useEffect(()=>{
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



function HouseAllocationPoints({lang='bn'}){
  const en=lang==='en';
  const [kind,setKind]=useState('third_general');
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
  },[]);

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

  return <section className="points-panel house-allocation-module">
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

      
    </div>:<div className="house-pending-panel">
      <div className="house-coming-icon"><Clock3/></div>
      <span>{en?'COMING SOON':'শীঘ্রই আসছে'}</span>
      <h4>{en?current.en:current.bn}</h4>
      <p>{en?'Automatic calculation for this category is coming soon.':'এই শ্রেণির অটোমেটিক বাসা বরাদ্দ পয়েন্ট হিসাব শীঘ্রই চালু হবে।'}</p>
      
    </div>}
  </section>
}

function CalculatorCenter({lang='bn',onPage}){
  const en=lang==='en';
  const [tool,setTool]=useState('service');
  const [career,setCareer]=useState({profile:null,education:[],events:[]});
  const [service,setService]=useState({start:'',end:todayLocalIso()});
  const [age,setAge]=useState({dob:'',asOf:todayLocalIso()});
  const [gap,setGap]=useState({from:'',to:''});
  const [retire,setRetire]=useState({dob:'',age:'60'});
  const [basicProj,setBasicProj]=useState({grade:'13',stage:'0',date:'2027-07-01'});
  const [result,setResult]=useState(null);

  useEffect(()=>{
    api('/api/my-career').then(x=>{
      setCareer({profile:x.profile||null,education:x.education||[],events:x.events||[]});
      const p=x.profile||{};
      if(p.first_joining_date)setService(v=>({...v,start:p.first_joining_date}));
      if(p.retirement_age)setRetire(v=>({...v,age:String(p.retirement_age)}));
    }).catch(()=>{});
  },[]);

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

  return <div className="calculator-center advanced-calculator-center">
    <section className="advanced-calc-hero">
      <div><span>{en?'ADVANCED CALCULATOR CENTER':'উন্নত ক্যালকুলেটর সেন্টার'}</span><h2>{en?'Smart calculations from your own data':'নিজের তথ্য থেকে স্মার্ট হিসাব'}</h2><p>{en?'Use career, date, service and pay tools from one calculation center.':'ক্যারিয়ার, তারিখ, চাকরিকাল ও বেতন-সংক্রান্ত হিসাব এক জায়গা থেকে ব্যবহার করুন।'}</p></div>
      
    </section>

    <div className="calc-hub-grid">
      <button className="calc-hub-card promotion" onClick={()=>onPage?.('promotion')}><TrendingUp/><div><b>{en?'Promotion Calculator':'পদোন্নতি হিসাব'}</b><small>{en?'Promotion rules and roadmap':'পদোন্নতি নিয়ম ও রোডম্যাপ'}</small></div><ChevronRight/></button>
      <button className="calc-hub-card salary" onClick={()=>onPage?.('salary')}><WalletCards/><div><b>{en?'Pay Scale Calculator':'পে-স্কেল হিসাব'}</b><small>{en?'Fixation, gross, deductions and payslip':'ফিক্সেশন, মোট বেতন, কর্তন ও পে-স্লিপ'}</small></div><ChevronRight/></button>
      <button className="calc-hub-card points" onClick={()=>onPage?.('points')}><Award/><div><b>{en?'Points Calculator':'পয়েন্ট ক্যালকুলেটর'}</b><small>{en?'Service, education and house-allocation points':'সার্ভিস, শিক্ষাগত যোগ্যতা ও বাসা বরাদ্দ পয়েন্ট'}</small></div><ChevronRight/></button>
    </div>

    {career.profile&&<section className="calc-personal-data-strip">
      <div><BookUser/><div><small>{en?'Personal data detected':'ব্যক্তিগত তথ্য পাওয়া গেছে'}</small><b>{career.profile.current_post||'—'} · {career.profile.current_grade?`${en?'Grade':'গ্রেড'} ${career.profile.current_grade}`:'—'}</b></div></div>
      <button onClick={()=>onPage?.('career')}>{en?'Update My Career':'আমার চাকরি আপডেট'}<ChevronRight size={14}/></button>
    </section>}

    <div className="calculator-tabs">
      {tools.map(([k,I,l])=><button key={k} className={tool===k?'active':''} onClick={()=>{setTool(k);setResult(null)}}><I size={17}/>{l}</button>)}
    </div>

    <section className="calc-card calculator-tool-card">
      {tool==='service'&&<>
        <div className="tool-head"><Clock3/><div><h3>{en?'Service Length Calculator':'চাকরিকাল হিসাব'}</h3><p>{en?'Your first joining date is auto-filled from My Career when available.':'আমার চাকরি থেকে প্রথম যোগদানের তারিখ থাকলে স্বয়ংক্রিয়ভাবে বসবে।'}</p></div></div>
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
  const params=new URLSearchParams(window.location.search);
  const queryAuth=params.get('auth')||'';
  const queryToken=params.get('token')||'';
  const[user,setUser]=useState(null),[loading,setLoading]=useState(true),[page,setPage]=useState('dashboard'),
    [showLogin,setShowLogin]=useState(()=>!!queryAuth),[authMode,setAuthMode]=useState(()=>queryAuth||'login'),[authToken,setAuthToken]=useState(()=>queryToken),
    [lang,setLang]=useState('bn'),[mobileMenu,setMobileMenu]=useState(false);
  useEffect(()=>{api('/api/me').then(x=>setUser(x.user)).catch(()=>{}).finally(()=>setLoading(false))},[]);
  useEffect(()=>{setMobileMenu(false)},[page]);
  useEffect(()=>{
    document.body.classList.toggle('mobile-drawer-open',mobileMenu);
    return()=>document.body.classList.remove('mobile-drawer-open');
  },[mobileMenu]);
  async function logout(){try{await api('/api/logout',{method:'POST'})}catch{}setUser(null);setShowLogin(false);setPage('dashboard')}
  useEffect(()=>{if(user&&page)api('/api/usage',{method:'POST',body:JSON.stringify({module:page})}).catch(()=>{})},[user?.id,page]);
  if(loading)return <div className="loading">Loading...</div>;
  if(!user)return showLogin?<AuthPortal onLogin={u=>{setUser(u);window.history.replaceState({},'',window.location.pathname)}} onBack={()=>{setShowLogin(false);setAuthMode('login');setAuthToken('');window.history.replaceState({},'',window.location.pathname)}} lang={lang} setLang={setLang} initialMode={authMode} initialToken={authToken}/>:<PublicHome onLogin={()=>{setAuthMode('login');setShowLogin(true)}} onSignup={()=>{setAuthMode('register');setShowLogin(true)}} lang={lang} setLang={setLang}/>;
  const admin=['super_admin','admin','department_admin'].includes(user.role);
  return <div className={`app ${mobileMenu?'mobile-menu-open':''}`}><button className={`mobile-drawer-backdrop ${mobileMenu?'show':''}`} aria-label={lang==='en'?'Close menu':'মেনু বন্ধ করুন'} onClick={()=>setMobileMenu(false)}></button><aside className={`side ${mobileMenu?'mobile-open':''}`}>
    <div className="brand"><div><b>{lang==='en'?'Employee Service ERP':'কর্মকর্তা-কর্মচারী সেবা'}</b><small>{lang==='en'?'Digital Service Platform':'ডিজিটাল সেবা প্ল্যাটফর্ম'}</small></div><button className="mobile-drawer-close" onClick={()=>setMobileMenu(false)} aria-label={lang==='en'?'Close menu':'মেনু বন্ধ করুন'}><X size={19}/></button></div>
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
    <main><header className="app-topbar"><div className="mobile-topbar-left"><button className="mobile-menu-trigger" onClick={()=>setMobileMenu(v=>!v)} aria-label={lang==='en'?(mobileMenu?'Close menu':'Open menu'):(mobileMenu?'মেনু বন্ধ করুন':'মেনু খুলুন')}><span></span><span></span><span></span></button><div><h2>{lang==='en'?`Welcome, ${user.name}`:`স্বাগতম, ${user.name}`}</h2><p>{lang==='en'?(roleLabel[user.role]||user.role):({super_admin:'সিস্টেম ব্যবস্থাপক',admin:'অ্যাডমিন',department_admin:'বিভাগীয় অ্যাডমিন',editor:'সম্পাদক',employee:'কর্মকর্তা-কর্মচারী'}[user.role]||user.role)}</p></div></div><div className="header-actions"><LangToggle lang={lang} setLang={setLang}/><button className="logout" onClick={logout}><LogOut size={16}/><span>{lang==='en'?'Logout':'লগআউট'}</span></button></div></header>
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
      <button className={page==='career'?'active':''} onClick={()=>setPage('career')}><BookUser/><span>{lang==='en'?'Career':'চাকরি'}</span></button>
      <button className={page==='points'?'active':''} onClick={()=>setPage('points')}><Award/><span>{lang==='en'?'Points':'পয়েন্ট'}</span></button>
      <button className={page==='calendar'?'active':''} onClick={()=>setPage('calendar')}><CalendarDays/><span>{lang==='en'?'Calendar':'ক্যালেন্ডার'}</span></button>
      <button className={mobileMenu?'active':''} onClick={()=>setMobileMenu(v=>!v)}><Boxes/><span>{lang==='en'?'Menu':'মেনু'}</span></button>
    </nav>
  </div>
}
createRoot(document.getElementById('root')).render(<App/>);
