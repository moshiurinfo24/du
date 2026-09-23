import React,{useEffect,useMemo,useState} from 'react';
import {
  AlertTriangle,BadgeCheck,BookOpen,Calculator,CalendarDays,ChevronRight,
  Coins,FileText,History,Landmark,ReceiptText,ShieldCheck,UserRound,WalletCards
} from 'lucide-react';
import './pension-center-v1.css';

const GAZETTE_URL='https://www.dpp.gov.bd/upload_file/gazettes/62983_75061.pdf';
const DU_STATUTE_URL='https://www.du.ac.bd/fontView/ordinance/Calendar_Part_II.pdf';
const PREF_KEY='hisab_pension_prefill_v1';

const PENSION_RATES={
  5:21,6:24,7:27,8:30,9:33,10:36,11:39,12:43,13:47,14:51,15:54,16:57,
  17:63,18:65,19:69,20:72,21:75,22:79,23:83,24:87,25:90
};
const REVISION_SLABS=[
  {max:9000,rate:100,min:10000,maxNew:18000},
  {max:20000,rate:75,min:18001,maxNew:35000},
  {max:30000,rate:65,min:35001,maxNew:49000},
  {max:40000,rate:60,min:49001,maxNew:62000},
  {max:Infinity,rate:55,min:62001,maxNew:70200}
];
const MONEY=new Intl.NumberFormat('bn-BD',{maximumFractionDigits:0});
const MONEY_EN=new Intl.NumberFormat('en-US',{maximumFractionDigits:0});

function money(v,en=false){
  const n=Number(v||0);
  return (en?'Tk ':'৳ ')+(en?MONEY_EN:MONEY).format(Math.round(n));
}
function num(v,en=false){
  const n=Number(v||0);
  return (en?MONEY_EN:MONEY).format(n);
}
function clamp(v,min,max){return Math.min(max,Math.max(min,v))}
function todayIso(){
  const d=new Date(),y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0');
  return y+'-'+m+'-'+day;
}
function addYearsIso(iso,years){
  if(!iso||!Number.isFinite(Number(years)))return '';
  const d=new Date(iso+'T00:00:00');
  if(Number.isNaN(d.getTime()))return '';
  d.setFullYear(d.getFullYear()+Number(years));
  const y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0');
  return y+'-'+m+'-'+day;
}
function serviceYmd(start,end){
  if(!start||!end)return null;
  const a=new Date(start+'T00:00:00'),b=new Date(end+'T00:00:00');
  if(Number.isNaN(a.getTime())||Number.isNaN(b.getTime())||b<a)return null;
  let y=b.getFullYear()-a.getFullYear(),m=b.getMonth()-a.getMonth(),d=b.getDate()-a.getDate();
  if(d<0){m-=1;d+=new Date(b.getFullYear(),b.getMonth(),0).getDate()}
  if(m<0){y-=1;m+=12}
  return {y,m,d};
}
function readPref(){
  try{const x=JSON.parse(localStorage.getItem(PREF_KEY)||'null');return x&&typeof x==='object'?x:{}}catch{return {}}
}
function savePref(next){try{localStorage.setItem(PREF_KEY,JSON.stringify(next||{}))}catch{}}

function pensionRateFor(years){
  const y=Math.floor(Number(years||0));
  if(y<5)return 0;
  return PENSION_RATES[Math.min(25,y)]||0;
}
function gratuityMultiplier(years){
  const y=Math.floor(Number(years||0));
  if(y<5)return 0;
  if(y<10)return 265;
  if(y<15)return 260;
  if(y<20)return 245;
  return 230;
}
function slabFor(v){return REVISION_SLABS.find(x=>Number(v)<=x.max)||REVISION_SLABS[REVISION_SLABS.length-1]}
function phasedShare(oldNet,asOf){
  if(asOf<'2026-07-01')return 0;
  if(asOf<='2026-12-31')return Number(oldNet)<=20000?0.50:0.40;
  if(asOf<='2027-06-30')return Number(oldNet)<=20000?0.75:0.70;
  return 1;
}
function RateTable({en}){
  const rows=Object.entries(PENSION_RATES);
  return <details className="pension-rate-table">
    <summary><BookOpen/>{en?'See official service-rate table':'চাকরিকালভিত্তিক সরকারি হার দেখুন'}</summary>
    <div className="pension-rate-grid">
      {rows.map(([y,r])=><span key={y}><b>{en?(y+' years'):(Number(y).toLocaleString('bn-BD')+' বছর')}</b><em>{num(r,en)}%</em></span>)}
    </div>
  </details>
}

function ResultActions({en,onSave,onPreview}){
  return <div className="pension-result-actions">
    <button className="secondary" onClick={onSave}><History/>{en?'Save to My Calculations':'আমার হিসাবে সংরক্ষণ'}</button>
    <button className="primary" onClick={onPreview}><FileText/>{en?'A4 PDF Preview & Download':'A4 PDF প্রিভিউ ও ডাউনলোড'}</button>
  </div>
}

function ExistingPensioner({en,onSaveCalculation,onPreviewReport}){
  const saved=readPref();
  const [form,setForm]=useState({oldNet:String(saved.oldNet||''),asOf:saved.asOf||todayIso(),kind:saved.kind||'original'});
  const result=useMemo(()=>{
    const oldNet=Number(form.oldNet||0);
    if(!oldNet||oldNet<0)return null;
    if(oldNet>70200){
      return {
        protected:true,oldNet,fullTarget:oldNet,current:oldNet,increase:0,
        note:en?'Existing pension above Tk 70,200 remains protected up to the next applicable annual increase. This Phase-1 calculator does not estimate a later annual increment.':'৳৭০,২০০-এর বেশি বিদ্যমান পেনশন পরবর্তী প্রযোজ্য বার্ষিক বৃদ্ধির আগ পর্যন্ত সুরক্ষিত থাকবে। Phase-1 এ পরবর্তী annual increment অনুমান করা হচ্ছে না।'
      };
    }
    const slab=slabFor(oldNet);
    const fullTarget=clamp(oldNet*(1+slab.rate/100),slab.min,slab.maxNew);
    const increase=Math.max(0,fullTarget-oldNet);
    const share=phasedShare(oldNet,form.asOf);
    const current=oldNet+(increase*share);
    return {...slab,oldNet,fullTarget,increase,share,current,protected:false};
  },[form,en]);
  useEffect(()=>{savePref({...readPref(),oldNet:form.oldNet,asOf:form.asOf,kind:form.kind})},[form]);
  const payload=result?{mode:'existing',form,result}:null;

  return <section className="pension-mode-card">
    <div className="pension-section-head"><div><WalletCards/><div><small>{en?'2026 REVISION':'২০২৬ পুনর্নির্ধারণ'}</small><h3>{en?'Existing pensioner revision':'বর্তমান পেনশনারের নতুন হিসাব'}</h3><p>{en?'Only enter the net pension received on 30 June 2026. The slab, revision rate and phased payable amount are calculated automatically.':'শুধু ৩০ জুন ২০২৬-এ পাওয়া নিট পেনশনের অংক দিন। স্ল্যাব, বৃদ্ধির হার ও ধাপভিত্তিক প্রাপ্য অটোমেটিক হিসাব হবে।'}</p></div></div></div>
    <div className="pension-simple-guide"><BadgeCheck/><div><b>{en?'One main figure is enough':'মূলত একটি অংকই দিতে হবে'}</b><p>{en?'Enter the 30 June 2026 net pension. The rest of the calculation is automatic.':'৩০ জুন ২০২৬-এর নিট পেনশন দিন। বাকি হিসাব অটোমেটিক।'}</p></div></div>
    <div className="pension-form-grid">
      <label>{en?'Pension type':'পেনশনের ধরন'}<select value={form.kind} onChange={e=>setForm({...form,kind:e.target.value})}><option value="original">{en?'Original pensioner':'মূল পেনশনভোগী'}</option><option value="family">{en?'Lifetime family pensioner':'আজীবন পারিবারিক পেনশনভোগী'}</option></select></label>
      <label className="pension-focus-input">{en?'Net pension on 30 June 2026':'৩০ জুন ২০২৬-এর নিট পেনশন'}<input type="number" min="1" value={form.oldNet} onChange={e=>setForm({...form,oldNet:e.target.value})} placeholder={en?'e.g. 18000':'যেমন ১৮০০০'}/><small>{en?'Remembered on this device.':'এই ডিভাইসে মনে রাখা হবে।'}</small></label>
      <label>{en?'Show payable as of':'কোন তারিখের প্রাপ্য দেখাবেন'}<input type="date" min="2026-07-01" value={form.asOf} onChange={e=>setForm({...form,asOf:e.target.value})}/></label>
    </div>

    {result&&<div className="pension-result-wrap">
      <div className="pension-result-hero">
        <div><small>{en?'PAYABLE FOR SELECTED DATE':'নির্বাচিত তারিখে প্রাপ্য'}</small><strong>{money(result.current,en)}</strong><p>{result.protected?result.note:(en?('Full revised target: '+money(result.fullTarget,true)):('পূর্ণ পুনর্নির্ধারিত লক্ষ্য: '+money(result.fullTarget,false)))}</p></div>
        <BadgeCheck/>
      </div>
      {!result.protected&&<div className="pension-kpi-grid">
        <article><span>{en?'Old net pension':'পুরোনো নিট পেনশন'}</span><b>{money(result.oldNet,en)}</b></article>
        <article><span>{en?'Revision rate':'বৃদ্ধির হার'}</span><b>{num(result.rate,en)}%</b></article>
        <article><span>{en?'Full increase':'পূর্ণ বৃদ্ধি'}</span><b>{money(result.increase,en)}</b></article>
        <article><span>{en?'Implemented share':'কার্যকর অংশ'}</span><b>{num(result.share*100,en)}%</b></article>
      </div>}
      {!result.protected&&<div className="pension-explain">
        <Calculator/><div><b>{en?'How this result was applied':'হিসাব কীভাবে প্রয়োগ হয়েছে'}</b><p>{en?('The full revised pension is constrained to the official slab range '+money(result.min,true)+'–'+money(result.maxNew,true)+'. The selected date receives '+num(result.share*100,true)+'% of the increase over the 30 June 2026 pension.'):('পূর্ণ পুনর্নির্ধারিত পেনশন সরকারি স্ল্যাব '+money(result.min,false)+'–'+money(result.maxNew,false)+' এর মধ্যে সীমাবদ্ধ। নির্বাচিত তারিখে ৩০ জুন ২০২৬-এর পেনশনের ওপর বৃদ্ধির '+num(result.share*100,false)+'% কার্যকর ধরা হয়েছে।')}</p></div>
      </div>}
      <ResultActions en={en} onSave={()=>onSaveCalculation?.(payload)} onPreview={()=>onPreviewReport?.(payload)}/>
    </div>}
  </section>
}

function NewRetiree({en,profile={},onSaveCalculation,onPreviewReport}){
  const saved=readPref();
  const profileRetirement=profile.date_of_birth&&profile.retirement_age?addYearsIso(profile.date_of_birth,profile.retirement_age):'';
  const [form,setForm]=useState({
    basic:String(saved.basic||profile.current_basic_salary||''),
    joiningDate:saved.joiningDate||profile.first_joining_date||'',
    retirementDate:saved.retirementDate||profileRetirement||'',
    years:String(saved.years||'25'),months:String(saved.months||'0'),
    leaveMonths:String(saved.leaveMonths||'0'),otherDeduction:String(saved.otherDeduction||'0')
  });
  useEffect(()=>{
    setForm(v=>({...v,
      basic:v.basic||String(profile.current_basic_salary||''),
      joiningDate:v.joiningDate||profile.first_joining_date||'',
      retirementDate:v.retirementDate||profileRetirement||''
    }));
  },[profile.current_basic_salary,profile.first_joining_date,profileRetirement]);
  useEffect(()=>{savePref({...readPref(),basic:form.basic,joiningDate:form.joiningDate,retirementDate:form.retirementDate,years:form.years,months:form.months,leaveMonths:form.leaveMonths,otherDeduction:form.otherDeduction})},[form]);
  const autoService=useMemo(()=>serviceYmd(form.joiningDate,form.retirementDate),[form.joiningDate,form.retirementDate]);
  const result=useMemo(()=>{
    const basic=Number(form.basic||0),years=autoService?autoService.y:Math.floor(Number(form.years||0)),months=autoService?autoService.m:Math.max(0,Math.min(11,Number(form.months||0)));
    if(!basic||years<0)return null;
    const completedYears=years;
    const rate=pensionRateFor(completedYears);
    const multiplier=gratuityMultiplier(completedYears);
    const grossPension=basic*(rate/100);
    const surrendered=grossPension*0.50;
    const monthlyPension=grossPension-surrendered;
    const gratuity=surrendered*multiplier;
    const leaveMonths=Math.max(0,Math.min(18,Number(form.leaveMonths||0)));
    const leaveEncashment=basic*leaveMonths;
    const deduction=Math.max(0,Number(form.otherDeduction||0));
    const grossOneTime=gratuity+leaveEncashment;
    const netOneTime=Math.max(0,grossOneTime-deduction);
    return {basic,years,months,days:autoService?.d||0,completedYears,rate,multiplier,grossPension,surrendered,monthlyPension,gratuity,leaveMonths,leaveEncashment,deduction,grossOneTime,netOneTime,eligible:completedYears>=5,autoService:!!autoService};
  },[form,autoService]);
  const hasProfile=Boolean(profile.current_basic_salary||profile.first_joining_date||profile.date_of_birth||profile.retirement_age);
  const payload=result?{mode:'new',form,result,profile}:null;

  return <section className="pension-mode-card">
    <div className="pension-section-head"><div><Landmark/><div><small>{en?'NEW RETIREE · SMART PREFILL':'নতুন অবসরপ্রাপ্ত · SMART PREFILL'}</small><h3>{en?'Pension, gratuity & retirement summary':'পেনশন, আনুতোষিক ও অবসর সারাংশ'}</h3><p>{en?'Saved Career Profile data is used automatically when available. Correct only the fields that need changes.':'চাকরি তথ্য-এ সংরক্ষিত ডাটা থাকলে অটোমেটিক নেওয়া হবে। শুধু যেগুলো পরিবর্তন দরকার সেগুলো ঠিক করবেন।'}</p></div></div></div>

    {hasProfile&&<div className="pension-profile-prefill"><UserRound/><div><b>{en?'Career-profile data found':'চাকরি তথ্য থেকে ডাটা পাওয়া গেছে'}</b><p>{en?'Basic salary, joining date and retirement date are prefilled where available.':'মূল বেতন, যোগদানের তারিখ ও অবসরের তারিখ পাওয়া গেলে অটো বসানো হয়েছে।'}</p></div></div>}

    <div className="pension-form-grid pension-form-smart">
      <label>{en?'Last / applicable pensionable basic':'শেষ / প্রযোজ্য পেনশনযোগ্য মূল বেতন'}<input type="number" min="0" value={form.basic} onChange={e=>setForm({...form,basic:e.target.value})} placeholder={en?'e.g. 50000':'যেমন ৫০০০০'}/><small>{profile.current_basic_salary?(en?'Prefilled from Career Profile; verify the final pensionable basic.':'চাকরি তথ্য থেকে অটো এসেছে; চূড়ান্ত pensionable basic যাচাই করুন।'):''}</small></label>
      <label>{en?'First joining date':'প্রথম যোগদানের তারিখ'}<input type="date" value={form.joiningDate} onChange={e=>setForm({...form,joiningDate:e.target.value})}/></label>
      <label>{en?'Retirement date':'অবসরের তারিখ'}<input type="date" value={form.retirementDate} onChange={e=>setForm({...form,retirementDate:e.target.value})}/><small>{profileRetirement?(en?'Calculated from saved DOB + retirement age.':'সংরক্ষিত জন্মতারিখ + অবসরের বয়স থেকে অটো হিসাব।'):''}</small></label>
      {autoService?<div className="pension-auto-service"><CalendarDays/><div><span>{en?'Auto qualifying service':'অটো চাকরিকাল'}</span><b>{en?(autoService.y+'y '+autoService.m+'m '+autoService.d+'d'):(autoService.y.toLocaleString('bn-BD')+' বছর '+autoService.m.toLocaleString('bn-BD')+' মাস '+autoService.d.toLocaleString('bn-BD')+' দিন')}</b><small>{en?'Completed years are used for the pension-rate table.':'পেনশন হার নির্ধারণে পূর্ণ বছর ব্যবহার হচ্ছে।'}</small></div></div>:<>
        <label>{en?'Completed qualifying years':'পূর্ণ পেনশনযোগ্য চাকরির বছর'}<input type="number" min="0" max="60" value={form.years} onChange={e=>setForm({...form,years:e.target.value})}/></label>
        <label>{en?'Additional months':'অতিরিক্ত মাস'}<input type="number" min="0" max="11" value={form.months} onChange={e=>setForm({...form,months:e.target.value})}/></label>
      </>}
      <label>{en?'Eligible leave encashment months':'ছুটি নগদায়নের প্রাপ্য মাস'}<input type="number" min="0" max="18" step="0.5" value={form.leaveMonths} onChange={e=>setForm({...form,leaveMonths:e.target.value})}/><small>{en?'Maximum 18 months; enter only actually eligible leave.':'সর্বোচ্চ ১৮ মাস; বাস্তবে যত মাস প্রাপ্য সেটাই দিন।'}</small></label>
      <label>{en?'Loan / advance / other recovery':'ঋণ / অগ্রিম / অন্যান্য কর্তন'}<input type="number" min="0" value={form.otherDeduction} onChange={e=>setForm({...form,otherDeduction:e.target.value})}/></label>
    </div>

    {result&&<div className="pension-result-wrap">
      {!result.eligible?<div className="pension-warning"><AlertTriangle/><div><b>{en?'Pension rate not applied':'পেনশন হার প্রয়োগ করা হয়নি'}</b><p>{en?'This Phase-1 calculator starts the government pension-rate table at 5 completed qualifying years.':'এই Phase-1 ক্যালকুলেটরে সরকারি পেনশন হার ৫ পূর্ণ পেনশনযোগ্য বছর থেকে শুরু করা হয়েছে।'}</p></div></div>:<>
        <div className="pension-result-hero new">
          <div><small>{en?'ESTIMATED MONTHLY PENSION · BASE':'সম্ভাব্য মাসিক পেনশন · BASE'}</small><strong>{money(result.monthlyPension,en)}</strong><p>{en?('Gross pension '+money(result.grossPension,true)+' · 50% surrendered for gratuity'):('গ্রস পেনশন '+money(result.grossPension,false)+' · আনুতোষিকের জন্য ৫০% সমর্পিত')}</p></div>
          <Coins/>
        </div>

        <div className="pension-kpi-grid six">
          <article><span>{en?'Pension rate':'পেনশন হার'}</span><b>{num(result.rate,en)}%</b></article>
          <article><span>{en?'Gross pension':'গ্রস পেনশন'}</span><b>{money(result.grossPension,en)}</b></article>
          <article><span>{en?'Surrendered 50%':'সমর্পিত ৫০%'}</span><b>{money(result.surrendered,en)}</b></article>
          <article><span>{en?'Gratuity multiplier':'আনুতোষিক হার'}</span><b>{num(result.multiplier,en)}×</b></article>
          <article><span>{en?'Gratuity':'আনুতোষিক'}</span><b>{money(result.gratuity,en)}</b></article>
          <article><span>{en?'Leave encashment':'ছুটি নগদায়ন'}</span><b>{money(result.leaveEncashment,en)}</b></article>
        </div>

        <div className="pension-one-time">
          <div><small>{en?'GROSS ONE-TIME BENEFIT':'মোট এককালীন প্রাপ্য'}</small><b>{money(result.grossOneTime,en)}</b><span>{en?'Gratuity + leave encashment':'আনুতোষিক + ছুটি নগদায়ন'}</span></div>
          <ChevronRight/>
          <div><small>{en?'NET AFTER RECOVERY':'কর্তনের পর নিট'}</small><b>{money(result.netOneTime,en)}</b><span>{en?('Recovery '+money(result.deduction,true)):('কর্তন '+money(result.deduction,false))}</span></div>
        </div>

        <div className="pension-explain"><ReceiptText/><div><b>{en?'Core formula':'মূল হিসাব'}</b><p>{en?('Gross pension = last basic × '+num(result.rate,true)+'%. Monthly pension shown here = 50% of gross pension after surrender. Gratuity = surrendered pension × '+num(result.multiplier,true)+'.'):('গ্রস পেনশন = শেষ মূল বেতন × '+num(result.rate,false)+'%। এখানে মাসিক পেনশন = ৫০% সমর্পণের পর অবশিষ্ট অংশ। আনুতোষিক = সমর্পিত পেনশন × '+num(result.multiplier,false)+'।')}</p></div></div>
        <ResultActions en={en} onSave={()=>onSaveCalculation?.(payload)} onPreview={()=>onPreviewReport?.(payload)}/>
      </>}
      <RateTable en={en}/>
    </div>}
  </section>
}

export default function PensionRetirementCenter({lang='bn'}){
  const en=lang==='en';
  const [mode,setMode]=useState('existing');
  return <div className="pension-center-v1">
    <section className="pension-hero">
      <div className="pension-hero-icon"><Landmark/></div>
      <div><small>{en?'SMART OFFICE HISAB · PENSION CENTER':'স্মার্ট অফিস হিসাব · পেনশন সেন্টার'}</small><h2>{en?'Pension & Retirement Center':'পেনশন ও অবসর সেন্টার'}</h2><p>{en?'Government-2026 pension revision and a Phase-1 retirement-benefit calculator for University of Dhaka officers and employees.':'সরকারি ২০২৬ পেনশন পুনর্নির্ধারণ এবং ঢাকা বিশ্ববিদ্যালয়ের কর্মকর্তা-কর্মচারীদের জন্য Phase-1 অবসর সুবিধার সহায়ক হিসাব।'}</p></div>
    </section>

    <section className="pension-rule-banner">
      <ShieldCheck/>
      <div><b>{en?'Verified source layer':'যাচাইকৃত উৎসভিত্তিক হিসাব'}</b><p>{en?'Core 2026 pension rates, existing-pension revision slabs, gratuity multipliers and the 18-month leave-encashment ceiling are based on the Ministry of Finance retirement-benefit order published in the Bangladesh Gazette on 17 September 2026.':'মূল ২০২৬ pension rate, বিদ্যমান পেনশন পুনর্নির্ধারণের slab, আনুতোষিক multiplier এবং ১৮ মাসের ছুটি নগদায়নের সীমা ১৭ সেপ্টেম্বর ২০২৬ প্রকাশিত অর্থ মন্ত্রণালয়ের অবসর-সুবিধা আদেশের ভিত্তিতে রাখা হয়েছে।'}</p></div>
    </section>

    <div className="pension-mode-tabs">
      <button className={mode==='existing'?'active':''} onClick={()=>setMode('existing')}><WalletCards/><span><b>{en?'Existing pensioner':'বর্তমান পেনশনার'}</b><small>{en?'2026 revised net pension':'২০২৬ পুনর্নির্ধারিত নিট পেনশন'}</small></span></button>
      <button className={mode==='new'?'active':''} onClick={()=>setMode('new')}><Landmark/><span><b>{en?'New retiree':'নতুন অবসরপ্রাপ্ত'}</b><small>{en?'Pension + gratuity + leave':'পেনশন + আনুতোষিক + ছুটি'}</small></span></button>
    </div>

    {mode==='existing'?<ExistingPensioner en={en}/>:<NewRetiree en={en}/>}

    <section className="pension-phase-note">
      <FileText/>
      <div><b>{en?'Phase-1 scope':'Phase-1 সীমা'}</b><p>{en?'PF final settlement, Benevolent Fund, Group Insurance, family-pension eligibility, DU past-service contribution and PDF export will be added as separate verified layers. They are intentionally not guessed in this first release.':'PF final settlement, Benevolent Fund, Group Insurance, family-pension eligibility, DU past-service contribution এবং PDF export পরবর্তী যাচাইকৃত layer-এ যোগ হবে। প্রথম release-এ এগুলো অনুমান করে হিসাব করা হয়নি।'}</p></div>
    </section>

    <section className="pension-sources">
      <div><BookOpen/><span><b>{en?'Government Gazette · 17 Sep 2026':'সরকারি গেজেট · ১৭ সেপ্টেম্বর ২০২৬'}</b><small>{en?'Retirement benefits determination / revision':'অবসরকালীন সুবিধাদি নির্ধারণ / পুনর্নির্ধারণ'}</small></span><a href={GAZETTE_URL} target="_blank" rel="noreferrer">{en?'Open':'দেখুন'}<ChevronRight/></a></div>
      <div><BookOpen/><span><b>{en?'University of Dhaka · Tenth Statutes':'ঢাকা বিশ্ববিদ্যালয় · Tenth Statutes'}</b><small>{en?'Employees Pension / Gratuity Statutes':'Employees Pension / Gratuity Statutes'}</small></span><a href={DU_STATUTE_URL} target="_blank" rel="noreferrer">{en?'Open':'দেখুন'}<ChevronRight/></a></div>
    </section>

    <section className="pension-disclaimer"><AlertTriangle/><p>{en?'This is an independent assistance calculator, not an official University of Dhaka pension sanction. Final pension, gratuity, recoveries and eligibility must follow the latest applicable government order, University statute, office record and sanctioning authority.':'এটি স্বাধীন সহায়ক হিসাব; ঢাকা বিশ্ববিদ্যালয়ের অফিসিয়াল pension sanction নয়। চূড়ান্ত পেনশন, আনুতোষিক, কর্তন ও eligibility সর্বশেষ সরকারি আদেশ, বিশ্ববিদ্যালয় statute, অফিস রেকর্ড ও অনুমোদনকারী কর্তৃপক্ষ অনুযায়ী নির্ধারিত হবে।'}</p></section>
  </div>;
}
