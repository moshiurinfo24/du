import React,{useEffect,useMemo,useState} from 'react';
import {
  AlertTriangle,BadgeCheck,BookOpen,Calculator,CalendarDays,ChevronRight,
  Coins,FileText,History,Landmark,ReceiptText,ShieldCheck,UserRound,WalletCards
} from 'lucide-react';
import './pension-center-v1.css';
import {PAY2015,PAY2026,fixed2026,salary2026Snapshot} from './rules';

const GAZETTE_URL='https://www.dpp.gov.bd/upload_file/gazettes/62983_75061.pdf';
const PAY_GAZETTE_URL='https://www.dpp.gov.bd/upload_file/gazettes/62976_48524.pdf';
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
function ageOnDate(dob,date){
  if(!dob||!date)return null;
  const b=new Date(dob+'T00:00:00'),d=new Date(date+'T00:00:00');
  if(Number.isNaN(b.getTime())||Number.isNaN(d.getTime())||d<b)return null;
  let age=d.getFullYear()-b.getFullYear();
  const beforeBirthday=(d.getMonth()<b.getMonth())||(d.getMonth()===b.getMonth()&&d.getDate()<b.getDate());
  if(beforeBirthday)age-=1;
  return age;
}
function pensionerMedical(date,dob){
  const age=ageOnDate(dob,date);
  if(age==null)return {amount:0,age:null,label:'DOB_REQUIRED'};
  const b50=addYearsIso(dob,50),b60=addYearsIso(dob,60),b65=addYearsIso(dob,65),b70=addYearsIso(dob,70);
  if(date<'2028-01-01')return {amount:date>=b65?2500:1500,age,label:date>=b65?'65+ old rule':'old rule'};
  if(date<=b50)return {amount:3000,age,label:'≤50'};
  if(date<=b60)return {amount:4000,age,label:'50+ to 60'};
  if(date<=b70)return {amount:5000,age,label:'60+ to 70'};
  return {amount:6000,age,label:'70+'};
}
function pensionIncrementCount(date){
  if(date<'2027-07-01')return 0;
  const y=Number(date.slice(0,4))||2027;
  let count=0;
  for(let yr=2027;yr<=y;yr++)if(date>=yr+'-07-01')count++;
  return count;
}
function revisedExistingAt(oldNet,date){
  const old=Number(oldNet||0);
  if(!old)return null;
  const protectedHigh=old>70200;
  let fullTarget=old,rate=0,min=old,maxNew=old;
  if(!protectedHigh){
    const slab=slabFor(old);
    rate=slab.rate;min=slab.min;maxNew=slab.maxNew;
    fullTarget=clamp(old*(1+rate/100),min,maxNew);
  }
  if(date<'2026-07-01')return {amount:old,fullTarget,rate,share:0,protected:protectedHigh};
  if(date<='2026-12-31'){
    const share=old<=20000?0.50:0.40;
    return {amount:protectedHigh?old:old+(fullTarget-old)*share,fullTarget,rate,share,protected:protectedHigh};
  }
  if(date<='2027-06-30'){
    const share=old<=20000?0.75:0.70;
    return {amount:protectedHigh?old:old+(fullTarget-old)*share,fullTarget,rate,share,protected:protectedHigh};
  }
  const increments=pensionIncrementCount(date);
  const base=protectedHigh?old:fullTarget;
  return {amount:base*Math.pow(1.05,increments),fullTarget,rate,share:1,protected:protectedHigh,increments};
}
function pensionAllowanceSnapshot({net,dob,date}){
  const med=pensionerMedical(date,dob);
  const newRates=date>='2028-01-01';
  const festivalEach=Number(net||0);
  const boishakhiRate=newRates?0.15:0.20;
  const boishakhi=Number(net||0)*boishakhiRate;
  return {medical:med.amount,age:med.age,medicalBand:med.label,festivalEach,festivalAnnual:festivalEach*2,boishakhiRate,boishakhi};
}
function newRetireePhase(oldNet,newNet,date){
  const old=Number(oldNet||0),full=Number(newNet||0);
  if(date<'2026-07-01')return {share:0,amount:old,label:'2015'};
  if(date<='2026-12-31'){
    const share=old<=20000?0.50:0.40;
    return {share,amount:old+(full-old)*share,label:'2026-H2'};
  }
  if(date<='2027-06-30'){
    const share=old<=20000?0.75:0.70;
    return {share,amount:old+(full-old)*share,label:'2027-H1'};
  }
  return {share:1,amount:full,label:'full'};
}
function retirementAgeFor(type,profileAge){
  if(Number(profileAge)>0)return Number(profileAge);
  return type==='teacher'?65:type==='officer'?62:60;
}
function benevolentRateFor(type){
  if(type==='teacher'||type==='officer')return 0.05;
  if(type==='class3')return 0.04;
  if(type==='class4')return 0.0275;
  return 0;
}
function benevolentPotential({type,basic,serviceYears,confirmed}){
  const rate=benevolentRateFor(type);
  const eligible=Number(serviceYears||0)>=10;
  const benefit=confirmed&&eligible?Math.max(6000,Number(basic||0)*24):0;
  return {rate,eligible,benefit,confirmed:!!confirmed};
}
function pensionIncrementsSince(retirementDate,date){
  if(!retirementDate||!date||date<retirementDate)return 0;
  const startYear=Math.max(2027,Number(retirementDate.slice(0,4))||2027);
  const endYear=Number(date.slice(0,4))||startYear;
  let count=0;
  for(let yr=startYear;yr<=endYear;yr++){
    const boundary=yr+'-07-01';
    if(retirementDate<boundary&&date>=boundary)count++;
  }
  return count;
}
function retireeNetAtDate({retirementDate,date,oldNet,fullNet}){
  if(!retirementDate||date<retirementDate)return null;
  if(date<='2027-06-30')return newRetireePhase(oldNet,fullNet,date).amount;
  const increments=pensionIncrementsSince(retirementDate,date);
  return Number(fullNet||0)*Math.pow(1.05,increments);
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

function GradeScaleTable({en}){
  return <details className="pension-rate-table pension-grade-table">
    <summary><Landmark/>{en?'2026 grade-wise pay scale':'২০২৬ গ্রেডভিত্তিক পূর্ণ বেতনস্কেল'}</summary>
    <div className="pension-grade-grid">
      {Array.from({length:20},(_,i)=>String(i+1)).map(g=>{
        const a=PAY2026[g]||[],first=a[0]||0,last=a[a.length-1]||first;
        return <span key={g}><b>{en?'Grade ':'গ্রেড '}{num(g,en)}</b><em>{money(first,en)} → {money(last,en)}</em><small>{en?(a.length+' step(s)'):(a.length.toLocaleString('bn-BD')+'টি ধাপ')}</small></span>
      })}
    </div>
  </details>
}

function ResultActions({en,onSave,onPreview}){
  return <div className="pension-result-actions">
    <button className="secondary" onClick={onSave}><History/>{en?'Save to My Calculations':'আমার হিসাবে সংরক্ষণ'}</button>
    <button className="primary" onClick={onPreview}><FileText/>{en?'A4 PDF Preview & Download':'A4 PDF প্রিভিউ ও ডাউনলোড'}</button>
  </div>
}

function ExistingPensioner({en,onSaveCalculation,onPreviewReport,profile={}}){
  const saved=readPref();
  const [form,setForm]=useState({
    oldNet:String(saved.oldNet||''),
    asOf:saved.asOf||todayIso(),
    kind:saved.kind||'original',
    dob:saved.pensionDob||profile.date_of_birth||''
  });
  const result=useMemo(()=>{
    const oldNet=Number(form.oldNet||0);
    if(!oldNet||oldNet<0)return null;
    const selected=revisedExistingAt(oldNet,form.asOf);
    const allowance=pensionAllowanceSnapshot({net:selected.amount,dob:form.dob,date:form.asOf});
    const fullIncrease=Math.max(0,selected.fullTarget-oldNet);
    return {...selected,oldNet,current:selected.amount,increase:fullIncrease,...allowance};
  },[form]);
  const timeline=useMemo(()=>{
    const oldNet=Number(form.oldNet||0);
    if(!oldNet)return [];
    const dates=[
      ['2026-12-31',en?'Jul–Dec 2026':'জুলাই–ডিসেম্বর ২০২৬'],
      ['2027-06-30',en?'Jan–Jun 2027':'জানুয়ারি–জুন ২০২৭'],
      ['2027-07-01',en?'From 1 Jul 2027':'১ জুলাই ২০২৭ থেকে'],
      ['2028-01-01',en?'From 1 Jan 2028':'১ জানুয়ারি ২০২৮ থেকে'],
      ['2028-07-01',en?'From 1 Jul 2028':'১ জুলাই ২০২৮ থেকে']
    ];
    return dates.map(([date,label])=>{
      const p=revisedExistingAt(oldNet,date);
      const a=pensionAllowanceSnapshot({net:p.amount,dob:form.dob,date});
      return {date,label,...p,...a};
    });
  },[form.oldNet,form.dob,en]);
  useEffect(()=>{savePref({...readPref(),oldNet:form.oldNet,asOf:form.asOf,kind:form.kind,pensionDob:form.dob})},[form]);
  const payload=result?{mode:'existing',form,result,timeline}:null;

  return <section className="pension-mode-card">
    <div className="pension-section-head"><div><WalletCards/><div><small>{en?'2026 REVISION':'২০২৬ পুনর্নির্ধারণ'}</small><h3>{en?'Existing pensioner revision':'বর্তমান পেনশনারের নতুন হিসাব'}</h3><p>{en?'Only enter the net pension received on 30 June 2026. The slab, revision rate and phased payable amount are calculated automatically.':'শুধু ৩০ জুন ২০২৬-এ পাওয়া নিট পেনশনের অংক দিন। স্ল্যাব, বৃদ্ধির হার ও ধাপভিত্তিক প্রাপ্য অটোমেটিক হিসাব হবে।'}</p></div></div></div>
    <div className="pension-simple-guide"><BadgeCheck/><div><b>{en?'One main figure is enough':'মূলত একটি অংকই দিতে হবে'}</b><p>{en?'Enter the 30 June 2026 net pension. The rest of the calculation is automatic.':'৩০ জুন ২০২৬-এর নিট পেনশন দিন। বাকি হিসাব অটোমেটিক।'}</p></div></div>
    <div className="pension-form-grid">
      <label>{en?'Pension type':'পেনশনের ধরন'}<select value={form.kind} onChange={e=>setForm({...form,kind:e.target.value})}><option value="original">{en?'Original pensioner':'মূল পেনশনভোগী'}</option><option value="family">{en?'Lifetime family pensioner':'আজীবন পারিবারিক পেনশনভোগী'}</option></select></label>
      <label>{en?'Date of birth':'জন্মতারিখ'}<input type="date" value={form.dob} onChange={e=>setForm({...form,dob:e.target.value})}/><small>{en?'Used only for age-based medical allowance.':'শুধু বয়সভিত্তিক চিকিৎসা ভাতা হিসাবের জন্য।'}</small></label>
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
        <Calculator/><div><b>{en?'How this result was applied':'হিসাব কীভাবে প্রয়োগ হয়েছে'}</b><p>{en?('The full revised pension is constrained to the official slab range '+money(result.min,true)+'–'+money(result.maxNew,true)+'. The selected date receives the applicable phased share; from July 2027 the full revised pension continues with annual pension increment rules.'):('পূর্ণ পুনর্নির্ধারিত পেনশন সরকারি স্ল্যাব '+money(result.min,false)+'–'+money(result.maxNew,false)+' এর মধ্যে সীমাবদ্ধ। নির্বাচিত তারিখ অনুযায়ী ধাপভিত্তিক অংশ প্রযোজ্য; জুলাই ২০২৭ থেকে পূর্ণ পেনশন বার্ষিক পেনশন বৃদ্ধির নিয়মসহ চলবে।')}</p></div>
      </div>}

      <div className="pension-kpi-grid six pension-allowance-kpis">
        <article><span>{en?'Age on selected date':'নির্বাচিত তারিখে বয়স'}</span><b>{result.age==null?'—':(num(result.age,en)+(en?' years':' বছর'))}</b></article>
        <article><span>{en?'Medical allowance / month':'চিকিৎসা ভাতা / মাস'}</span><b>{result.medical?money(result.medical,en):'—'}</b></article>
        <article><span>{en?'Festival allowance / each':'উৎসব ভাতা / প্রতিবার'}</span><b>{money(result.festivalEach,en)}</b></article>
        <article><span>{en?'Festival allowance / year':'উৎসব ভাতা / বছর'}</span><b>{money(result.festivalAnnual,en)}</b></article>
        <article><span>{en?'Bangla New Year rate':'বাংলা নববর্ষ ভাতার হার'}</span><b>{num(result.boishakhiRate*100,en)}%</b></article>
        <article><span>{en?'Bangla New Year allowance':'বাংলা নববর্ষ ভাতা'}</span><b>{money(result.boishakhi,en)}</b></article>
      </div>

      <section className="pension-timeline">
        <div className="pension-timeline-head"><CalendarDays/><div><b>{en?'2026–2028 benefit timeline':'২০২৬–২০২৮ সুবিধার টাইমলাইন'}</b><small>{en?'Monthly pension and age-based allowances at each government transition point.':'সরকারি পরিবর্তনের প্রতিটি ধাপে মাসিক পেনশন ও বয়সভিত্তিক ভাতা।'}</small></div></div>
        <div className="pension-timeline-grid">
          {timeline.map(x=><article key={x.date}>
            <small>{x.label}</small>
            <b>{money(x.amount,en)}</b>
            <span>{en?'Monthly pension':'মাসিক পেনশন'}</span>
            <p>{en?'Medical':'চিকিৎসা'}: {x.medical?money(x.medical,en):'—'}</p>
            <p>{en?'Festival ×2':'উৎসব ×২'}: {money(x.festivalAnnual,en)}</p>
            <p>{en?'New Year':'নববর্ষ'}: {num(x.boishakhiRate*100,en)}% · {money(x.boishakhi,en)}</p>
          </article>)}
        </div>
      </section>

      <ResultActions en={en} onSave={()=>onSaveCalculation?.(payload)} onPreview={()=>onPreviewReport?.(payload)}/>
    </div>}
  </section>
}

function NewRetiree({en,profile={},onSaveCalculation,onPreviewReport}){
  const saved=readPref();
  const inferredType=saved.employmentType||(Number(profile.retirement_age)===65?'teacher':Number(profile.retirement_age)===62?'officer':'class3');
  const inferredGrade=String(saved.pensionGrade||profile.grade||'');
  const profileBasic=Number(profile.current_basic_salary||0);
  const initialBasic=String(saved.oldBasic||((PAY2015[inferredGrade]||[]).includes(profileBasic)?profileBasic:'')||'');
  const profileRetirement=profile.date_of_birth?addYearsIso(profile.date_of_birth,retirementAgeFor(inferredType,profile.retirement_age)):'';
  const [form,setForm]=useState({
    employmentType:inferredType,
    dob:saved.retireeDob||profile.date_of_birth||'',
    grade:inferredGrade,
    oldBasic:initialBasic,
    incrementEligible2026:saved.incrementEligible2026!==false,
    joiningDate:saved.joiningDate||profile.first_joining_date||'',
    retirementDate:saved.retirementDate||profileRetirement||'',
    years:String(saved.years||'25'),months:String(saved.months||'0'),
    leaveMonths:String(saved.leaveMonths||'0'),otherDeduction:String(saved.otherDeduction||'0'),
    benevolentConfirmed:saved.benevolentConfirmed===true,
    pfFinal:String(saved.pfFinal||''),
    groupInsurance:String(saved.groupInsurance||'')
  });
  const gradeSteps=PAY2015[String(form.grade)]||[];
  useEffect(()=>{savePref({...readPref(),
    employmentType:form.employmentType,retireeDob:form.dob,pensionGrade:form.grade,oldBasic:form.oldBasic,
    incrementEligible2026:form.incrementEligible2026,joiningDate:form.joiningDate,retirementDate:form.retirementDate,
    years:form.years,months:form.months,leaveMonths:form.leaveMonths,otherDeduction:form.otherDeduction,
    benevolentConfirmed:form.benevolentConfirmed,pfFinal:form.pfFinal,groupInsurance:form.groupInsurance
  })},[form]);
  const autoService=useMemo(()=>serviceYmd(form.joiningDate,form.retirementDate),[form.joiningDate,form.retirementDate]);
  const payJourney=useMemo(()=>{
    const g=String(form.grade),oldBasic=Number(form.oldBasic||0);
    if(!g||!oldBasic)return [];
    return [
      ['2026-07-01',en?'1 Jul 2026':'১ জুলাই ২০২৬'],
      ['2027-01-01',en?'1 Jan 2027':'১ জানুয়ারি ২০২৭'],
      ['2027-07-01',en?'1 Jul 2027':'১ জুলাই ২০২৭'],
      ['2028-01-01',en?'1 Jan 2028':'১ জানুয়ারি ২০২৮']
    ].map(([date,label])=>{
      const snap=salary2026Snapshot({grade:g,currentBasic:oldBasic,date,incrementEligible2026:form.incrementEligible2026,housing:'no',zone:'dhaka',ageBand:'under50',children:0,tiffin:false,conveyance:false,mobile:false});
      return {date,label,...snap,benevolentDeduction:Math.round(snap.payableBasic*benevolentRateFor(form.employmentType))};
    });
  },[form.grade,form.oldBasic,form.incrementEligible2026,form.employmentType,en]);
  const result=useMemo(()=>{
    const grade=String(form.grade||''),oldBasic=Number(form.oldBasic||0),years=autoService?autoService.y:Math.floor(Number(form.years||0)),months=autoService?autoService.m:Math.max(0,Math.min(11,Number(form.months||0)));
    if(!grade||!oldBasic||years<0)return null;
    const completedYears=years,rate=pensionRateFor(completedYears),multiplier=gratuityMultiplier(completedYears);
    const retireDate=form.retirementDate||todayIso();
    const snap=salary2026Snapshot({grade,currentBasic:oldBasic,date:retireDate,incrementEligible2026:form.incrementEligible2026,housing:'no',zone:'dhaka',ageBand:'under50',children:0,tiffin:false,conveyance:false,mobile:false});
    const fullBasic=retireDate<'2026-07-01'?oldBasic:(retireDate<'2027-07-01'?snap.fixedWithFirstIncrement:snap.fullWithIncrements);
    const oldGross=oldBasic*(rate/100),oldNet=oldGross*0.50;
    const grossPension=fullBasic*(rate/100),surrendered=grossPension*0.50,fullNetPension=grossPension-surrendered;
    const phase=newRetireePhase(oldNet,fullNetPension,retireDate);
    const monthlyPension=phase.amount;
    const gratuity=surrendered*multiplier;
    const leaveMonths=Math.max(0,Math.min(18,Number(form.leaveMonths||0)));
    const leaveEncashment=fullBasic*leaveMonths;
    const benevolent=benevolentPotential({type:form.employmentType,basic:fullBasic,serviceYears:completedYears,confirmed:form.benevolentConfirmed});
    const pfFinal=Math.max(0,Number(form.pfFinal||0));
    const groupInsurance=Math.max(0,Number(form.groupInsurance||0));
    const deduction=Math.max(0,Number(form.otherDeduction||0));
    const grossOneTime=gratuity+leaveEncashment+benevolent.benefit+pfFinal+groupInsurance;
    const netOneTime=Math.max(0,grossOneTime-deduction);
    const allowance=pensionAllowanceSnapshot({net:monthlyPension,dob:form.dob,date:retireDate});
    return {grade,oldBasic,basic:fullBasic,oldGross,oldNet,years,months,days:autoService?.d||0,completedYears,rate,multiplier,
      grossPension,surrendered,fullNetPension,phase,monthlyPension,gratuity,leaveMonths,leaveEncashment,benevolent,pfFinal,groupInsurance,
      deduction,grossOneTime,netOneTime,eligible:completedYears>=5,autoService:!!autoService,...allowance};
  },[form,autoService]);
  const pensionJourney=useMemo(()=>{
    if(!result||!form.retirementDate)return [];
    const dates=[
      ['2026-12-31',en?'End 2026':'২০২৬ শেষ'],
      ['2027-06-30',en?'30 Jun 2027':'৩০ জুন ২০২৭'],
      ['2027-07-01',en?'1 Jul 2027':'১ জুলাই ২০২৭'],
      ['2028-01-01',en?'1 Jan 2028':'১ জানুয়ারি ২০২৮'],
      ['2028-07-01',en?'1 Jul 2028':'১ জুলাই ২০২৮']
    ];
    return dates.map(([date,label])=>{
      const net=retireeNetAtDate({retirementDate:form.retirementDate,date,oldNet:result.oldNet,fullNet:result.fullNetPension});
      if(net==null)return {date,label,notRetired:true};
      const a=pensionAllowanceSnapshot({net,dob:form.dob,date});
      return {date,label,net,...a,increments:pensionIncrementsSince(form.retirementDate,date)};
    });
  },[result,form.retirementDate,form.dob,en]);
  const hasProfile=Boolean(profile.current_basic_salary||profile.first_joining_date||profile.date_of_birth||profile.retirement_age||profile.grade);
  const payload=result?{mode:'new',form,result,profile,payJourney,pensionJourney}:null;

  return <section className="pension-mode-card">
    <div className="pension-section-head"><div><Landmark/><div><small>{en?'NEW RETIREE · SMART PREFILL':'নতুন অবসরপ্রাপ্ত · SMART PREFILL'}</small><h3>{en?'Pension, gratuity & retirement summary':'পেনশন, আনুতোষিক ও অবসর সারাংশ'}</h3><p>{en?'Saved Career Profile data is used automatically when available. Correct only the fields that need changes.':'চাকরি তথ্য-এ সংরক্ষিত ডাটা থাকলে অটোমেটিক নেওয়া হবে। শুধু যেগুলো পরিবর্তন দরকার সেগুলো ঠিক করবেন।'}</p></div></div></div>

    {hasProfile&&<div className="pension-profile-prefill"><UserRound/><div><b>{en?'Career-profile data found':'চাকরি তথ্য থেকে ডাটা পাওয়া গেছে'}</b><p>{en?'Basic salary, joining date and retirement date are prefilled where available.':'মূল বেতন, যোগদানের তারিখ ও অবসরের তারিখ পাওয়া গেলে অটো বসানো হয়েছে।'}</p></div></div>}

    <div className="pension-form-grid pension-form-smart">
      <label>{en?'Employee category':'কর্মচারীর ধরন'}<select value={form.employmentType} onChange={e=>{const t=e.target.value;const age=retirementAgeFor(t,0);setForm({...form,employmentType:t,retirementDate:form.dob?addYearsIso(form.dob,age):form.retirementDate})}}><option value="teacher">{en?'Teacher · retirement 65':'শিক্ষক · অবসর ৬৫'}</option><option value="officer">{en?'Officer · retirement 62':'কর্মকর্তা · অবসর ৬২'}</option><option value="class3">{en?'Class III employee · retirement 60':'৩য় শ্রেণির কর্মচারী · অবসর ৬০'}</option><option value="class4">{en?'Class IV employee · retirement 60':'৪র্থ শ্রেণির কর্মচারী · অবসর ৬০'}</option></select></label>
      <label>{en?'Date of birth':'জন্মতারিখ'}<input type="date" value={form.dob} onChange={e=>{const dob=e.target.value;setForm({...form,dob,retirementDate:dob?addYearsIso(dob,retirementAgeFor(form.employmentType,0)):form.retirementDate})}}/></label>
      <label>{en?'Grade on 30 Jun 2026':'৩০ জুন ২০২৬-এর গ্রেড'}<select value={form.grade} onChange={e=>{const g=e.target.value;const steps=PAY2015[g]||[];setForm({...form,grade:g,oldBasic:String(steps[0]||'')})}}><option value="">{en?'Select grade':'গ্রেড বাছাই করুন'}</option>{Array.from({length:20},(_,i)=>String(i+1)).map(g=><option key={g} value={g}>{en?'Grade ':'গ্রেড '}{num(g,en)}</option>)}</select></label>
      <label className="pension-focus-input">{en?'30 Jun 2026 basic / scale step':'৩০ জুন ২০২৬-এর মূল বেতন / ধাপ'}<select value={form.oldBasic} onChange={e=>setForm({...form,oldBasic:e.target.value})} disabled={!form.grade}><option value="">{en?'Select scale step':'বেতন ধাপ বাছাই করুন'}</option>{gradeSteps.map((v,i)=><option key={v} value={v}>{en?('Step '+(i+1)+' · '+money(v,true)):('ধাপ '+(i+1).toLocaleString('bn-BD')+' · '+money(v,false))}</option>)}</select><small>{en?'No manual basic typing: choose the official 2015 step for your grade.':'ম্যানুয়াল basic লিখতে হবে না—নিজের গ্রেডের অফিসিয়াল ২০১৫ ধাপ বাছাই করুন।'}</small></label>
      <label>{en?'First joining date':'প্রথম যোগদানের তারিখ'}<input type="date" value={form.joiningDate} onChange={e=>setForm({...form,joiningDate:e.target.value})}/></label>
      <label>{en?'Retirement date':'অবসরের তারিখ'}<input type="date" value={form.retirementDate} onChange={e=>setForm({...form,retirementDate:e.target.value})}/><small>{form.dob?(en?'Auto from DOB + category retirement age; editable if an official order differs.':'জন্মতারিখ + ধরন অনুযায়ী অটো; অফিসিয়াল আদেশে ভিন্ন হলে পরিবর্তনযোগ্য।'):''}</small></label>
      <label className="pension-check-label"><input type="checkbox" checked={form.incrementEligible2026} onChange={e=>setForm({...form,incrementEligible2026:e.target.checked})}/><span>{en?'Eligible for the applicable annual increment in 2026 fixation':'২০২৬ বেতন নির্ধারণে প্রযোজ্য বার্ষিক ইনক্রিমেন্ট পাবেন'}</span></label>
      {autoService?<div className="pension-auto-service"><CalendarDays/><div><span>{en?'Auto qualifying service':'অটো চাকরিকাল'}</span><b>{en?(autoService.y+'y '+autoService.m+'m '+autoService.d+'d'):(autoService.y.toLocaleString('bn-BD')+' বছর '+autoService.m.toLocaleString('bn-BD')+' মাস '+autoService.d.toLocaleString('bn-BD')+' দিন')}</b><small>{en?'Completed years are used for the pension-rate table.':'পেনশন হার নির্ধারণে পূর্ণ বছর ব্যবহার হচ্ছে।'}</small></div></div>:<>
        <label>{en?'Completed qualifying years':'পূর্ণ পেনশনযোগ্য চাকরির বছর'}<input type="number" min="0" max="60" value={form.years} onChange={e=>setForm({...form,years:e.target.value})}/></label>
        <label>{en?'Additional months':'অতিরিক্ত মাস'}<input type="number" min="0" max="11" value={form.months} onChange={e=>setForm({...form,months:e.target.value})}/></label>
      </>}
      <label>{en?'Eligible leave encashment months':'ছুটি নগদায়নের প্রাপ্য মাস'}<input type="number" min="0" max="18" step="0.5" value={form.leaveMonths} onChange={e=>setForm({...form,leaveMonths:e.target.value})}/><small>{en?'Maximum 18 months; enter only actually eligible leave.':'সর্বোচ্চ ১৮ মাস; বাস্তবে যত মাস প্রাপ্য সেটাই দিন।'}</small></label>
      <label className="pension-check-label"><input type="checkbox" checked={form.benevolentConfirmed} onChange={e=>setForm({...form,benevolentConfirmed:e.target.checked})}/><span>{en?'I have subscribed to the DU Benevolent Fund at the prescribed rate for at least 10 years':'আমি DU Benevolent Fund-এ নির্ধারিত হারে অন্তত ১০ বছর subscription দিয়েছি'}</span></label>
      <label>{en?'PF final balance from statement (optional)':'PF statement-এর final balance (ঐচ্ছিক)'}<input type="number" min="0" value={form.pfFinal} onChange={e=>setForm({...form,pfFinal:e.target.value})} placeholder={en?'Enter only from official PF statement':'শুধু অফিসিয়াল PF statement থেকে দিন'}/></label>
      <label>{en?'Group Insurance amount from statement (optional)':'Group Insurance statement-এর অংক (ঐচ্ছিক)'}<input type="number" min="0" value={form.groupInsurance} onChange={e=>setForm({...form,groupInsurance:e.target.value})} placeholder={en?'Enter verified amount only':'যাচাইকৃত অংক দিন'}/></label>
      <label>{en?'Loan / advance / other recovery':'ঋণ / অগ্রিম / অন্যান্য কর্তন'}<input type="number" min="0" value={form.otherDeduction} onChange={e=>setForm({...form,otherDeduction:e.target.value})}/></label>
    </div>

    {result&&<div className="pension-result-wrap">
      {!result.eligible?<div className="pension-warning"><AlertTriangle/><div><b>{en?'Pension rate not applied':'পেনশন হার প্রয়োগ করা হয়নি'}</b><p>{en?'This Phase-1 calculator starts the government pension-rate table at 5 completed qualifying years.':'এই Phase-1 ক্যালকুলেটরে সরকারি পেনশন হার ৫ পূর্ণ পেনশনযোগ্য বছর থেকে শুরু করা হয়েছে।'}</p></div></div>:<>
        <div className="pension-result-hero new">
          <div><small>{en?'PAYABLE MONTHLY PENSION AT RETIREMENT':'অবসরের সময় প্রাপ্য মাসিক পেনশন'}</small><strong>{money(result.monthlyPension,en)}</strong><p>{en?('Full 2026-scale net pension '+money(result.fullNetPension,true)+' · payable phase '+num(result.phase.share*100,true)+'% of the increase'):('পূর্ণ ২০২৬-স্কেল নিট পেনশন '+money(result.fullNetPension,false)+' · বর্ধিত অংশের প্রাপ্য ধাপ '+num(result.phase.share*100,false)+'%')}</p></div>
          <Coins/>
        </div>

        <div className="pension-pay-fix-summary">
          <div><span>{en?'2015 basic · 30 Jun 2026':'২০১৫ মূল বেতন · ৩০ জুন ২০২৬'}</span><b>{money(result.oldBasic,en)}</b></div>
          <ChevronRight/>
          <div><span>{en?'Full applicable 2026 basic':'পূর্ণ প্রযোজ্য ২০২৬ মূল বেতন'}</span><b>{money(result.basic,en)}</b></div>
          <ChevronRight/>
          <div className="accent"><span>{en?'Grade':'গ্রেড'}</span><b>{num(result.grade,en)}</b></div>
        </div>

        <div className="pension-kpi-grid six">
          <article><span>{en?'Pension rate':'পেনশন হার'}</span><b>{num(result.rate,en)}%</b></article>
          <article><span>{en?'Gross pension':'গ্রস পেনশন'}</span><b>{money(result.grossPension,en)}</b></article>
          <article><span>{en?'Surrendered 50%':'সমর্পিত ৫০%'}</span><b>{money(result.surrendered,en)}</b></article>
          <article><span>{en?'Gratuity multiplier':'আনুতোষিক হার'}</span><b>{num(result.multiplier,en)}×</b></article>
          <article><span>{en?'Gratuity':'আনুতোষিক'}</span><b>{money(result.gratuity,en)}</b></article>
          <article><span>{en?'Leave encashment':'ছুটি নগদায়ন'}</span><b>{money(result.leaveEncashment,en)}</b></article>
        </div>

        <div className="pension-kpi-grid six pension-allowance-kpis">
          <article><span>{en?'Age at retirement':'অবসরের সময় বয়স'}</span><b>{result.age==null?'—':(num(result.age,en)+(en?' years':' বছর'))}</b></article>
          <article><span>{en?'Medical allowance / month':'চিকিৎসা ভাতা / মাস'}</span><b>{result.medical?money(result.medical,en):'—'}</b></article>
          <article><span>{en?'Festival allowance / each':'উৎসব ভাতা / প্রতিবার'}</span><b>{money(result.festivalEach,en)}</b></article>
          <article><span>{en?'Festival ×2 / year':'উৎসব ×২ / বছর'}</span><b>{money(result.festivalAnnual,en)}</b></article>
          <article><span>{en?'Bangla New Year rate':'বাংলা নববর্ষ হার'}</span><b>{num(result.boishakhiRate*100,en)}%</b></article>
          <article><span>{en?'Bangla New Year allowance':'বাংলা নববর্ষ ভাতা'}</span><b>{money(result.boishakhi,en)}</b></article>
        </div>

        {payJourney.length>0&&<section className="pension-timeline">
          <div className="pension-timeline-head"><CalendarDays/><div><b>{en?'Grade & basic journey · 2026–2028':'গ্রেড ও মূল বেতনের যাত্রা · ২০২৬–২০২৮'}</b><small>{en?'Uses the same 2026 pay-fixation engine as the Pay Scale module.':'পে-স্কেল মডিউলের একই ২০২৬ pay-fixation engine ব্যবহার করা হয়েছে।'}</small></div></div>
          <div className="pension-timeline-grid pay">
            {payJourney.map(x=><article key={x.date}>
              <small>{x.label}</small>
              <b>{money(x.payableBasic,en)}</b>
              <span>{en?'Payable basic':'প্রাপ্য মূল বেতন'}</span>
              <p>{x.phase?.label||''}</p>
              {x.allowance2026&&<p>{en?'New allowances active':'নতুন ভাতা কার্যকর'}</p>}
            </article>)}
          </div>
        </section>}

        {pensionJourney.length>0&&<section className="pension-timeline">
          <div className="pension-timeline-head"><WalletCards/><div><b>{en?'Retirement benefit journey · 2026–2028':'অবসর-পরবর্তী সুবিধার যাত্রা · ২০২৬–২০২৮'}</b><small>{en?'Shows pension and age-based allowances only after the selected retirement date.':'নির্বাচিত অবসরের তারিখের পর থেকেই পেনশন ও বয়সভিত্তিক ভাতা দেখানো হচ্ছে।'}</small></div></div>
          <div className="pension-timeline-grid">
            {pensionJourney.map(x=><article key={x.date} className={x.notRetired?'muted':''}>
              <small>{x.label}</small>
              {x.notRetired?<><b>—</b><span>{en?'Still in service':'তখনও চাকরিতে'}</span></>:<>
                <b>{money(x.net,en)}</b><span>{en?'Monthly pension':'মাসিক পেনশন'}</span>
                <p>{en?'Medical':'চিকিৎসা'}: {x.medical?money(x.medical,en):'—'}</p>
                <p>{en?'Festival ×2':'উৎসব ×২'}: {money(x.festivalAnnual,en)}</p>
                <p>{en?'New Year':'নববর্ষ'}: {num(x.boishakhiRate*100,en)}%</p>
              </>}
            </article>)}
          </div>
        </section>}

        <section className="pension-du-benefits">
          <div className="pension-timeline-head"><ShieldCheck/><div><b>{en?'DU retirement benefits & deductions':'ঢাবি অবসর সুবিধা ও কর্তন'}</b><small>{en?'Benevolent benefit is automatic only after you confirm the statutory subscription condition. PF and Group Insurance use statement amounts only.':'Benevolent benefit statutory subscription শর্ত confirm করলে অটো হবে। PF ও Group Insurance শুধু statement-এর অংক ধরবে।'}</small></div></div>
          <div className="pension-kpi-grid six">
            <article><span>{en?'Benevolent monthly deduction rate':'Benevolent মাসিক কর্তনের হার'}</span><b>{num((result.benevolent?.rate||0)*100,en)}%</b></article>
            <article><span>{en?'DU Benevolent one-time benefit':'DU Benevolent এককালীন সুবিধা'}</span><b>{result.benevolent?.benefit?money(result.benevolent.benefit,en):(result.benevolent?.eligible?(en?'Confirm subscription':'subscription নিশ্চিত করুন'):(en?'Not yet eligible':'এখনও যোগ্য নয়'))}</b></article>
            <article><span>{en?'PF final balance':'PF final balance'}</span><b>{money(result.pfFinal,en)}</b></article>
            <article><span>{en?'Group Insurance':'Group Insurance'}</span><b>{money(result.groupInsurance,en)}</b></article>
            <article><span>{en?'Loan / recovery':'ঋণ / কর্তন'}</span><b>{money(result.deduction,en)}</b></article>
            <article><span>{en?'Benevolent basis':'Benevolent ভিত্তি'}</span><b>{result.benevolent?.eligible?(en?'24 months basic':'২৪ মাসের basic'):(en?'Own subscription refund rule':'নিজস্ব subscription ফেরত বিধান')}</b></article>
          </div>
        </section>

        <div className="pension-one-time">
          <div><small>{en?'GROSS ONE-TIME BENEFIT':'মোট এককালীন প্রাপ্য'}</small><b>{money(result.grossOneTime,en)}</b><span>{en?'Gratuity + leave + confirmed DU benefits':'আনুতোষিক + ছুটি + নিশ্চিত DU সুবিধা'}</span></div>
          <ChevronRight/>
          <div><small>{en?'NET AFTER RECOVERY':'কর্তনের পর নিট'}</small><b>{money(result.netOneTime,en)}</b><span>{en?('Recovery '+money(result.deduction,true)):('কর্তন '+money(result.deduction,false))}</span></div>
        </div>

        <div className="pension-explain"><ReceiptText/><div><b>{en?'Core formula':'মূল হিসাব'}</b><p>{en?('Gross pension = last basic × '+num(result.rate,true)+'%. Monthly pension shown here = 50% of gross pension after surrender. Gratuity = surrendered pension × '+num(result.multiplier,true)+'.'):('গ্রস পেনশন = শেষ মূল বেতন × '+num(result.rate,false)+'%। এখানে মাসিক পেনশন = ৫০% সমর্পণের পর অবশিষ্ট অংশ। আনুতোষিক = সমর্পিত পেনশন × '+num(result.multiplier,false)+'।')}</p></div></div>
        <ResultActions en={en} onSave={()=>onSaveCalculation?.(payload)} onPreview={()=>onPreviewReport?.(payload)}/>
      </>}
      <RateTable en={en}/>
      <GradeScaleTable en={en}/>
    </div>}
  </section>
}

export default function PensionRetirementCenter({lang='bn',profile={},onSaveCalculation,onPreviewReport}){
  const en=lang==='en';
  const pref=readPref();
  const suggested=profile.current_basic_salary||profile.first_joining_date?'new':'existing';
  const [mode,setMode]=useState(pref.mode||suggested);
  useEffect(()=>{savePref({...readPref(),mode})},[mode]);
  return <div className="pension-center-v1">
    <section className="pension-hero">
      <div className="pension-hero-icon"><Landmark/></div>
      <div><small>{en?'SMART OFFICE HISAB · PENSION CENTER':'স্মার্ট অফিস হিসাব · পেনশন সেন্টার'}</small><h2>{en?'Pension & Retirement Center':'পেনশন ও অবসর সেন্টার'}</h2><p>{en?'Auto-prefill from Career Profile, clear calculation breakdown, and A4 PDF preview/download.':'চাকরি তথ্য থেকে অটো-ফিল, পরিষ্কার হিসাবের ব্যাখ্যা এবং A4 PDF রিপোর্ট প্রিভিউ/ডাউনলোড।'}</p></div>
    </section>

    <section className="pension-rule-banner">
      <ShieldCheck/>
      <div><b>{en?'Verified source layer':'যাচাইকৃত উৎসভিত্তিক হিসাব'}</b><p>{en?'Core 2026 pension rates, existing-pension revision slabs, gratuity multipliers and the 18-month leave-encashment ceiling are based on the Ministry of Finance retirement-benefit order published in the Bangladesh Gazette on 17 September 2026.':'মূল ২০২৬ pension rate, বিদ্যমান পেনশন পুনর্নির্ধারণের slab, আনুতোষিক multiplier এবং ১৮ মাসের ছুটি নগদায়নের সীমা ১৭ সেপ্টেম্বর ২০২৬ প্রকাশিত অর্থ মন্ত্রণালয়ের অবসর-সুবিধা আদেশের ভিত্তিতে রাখা হয়েছে।'}</p></div>
    </section>

    <div className="pension-mode-tabs">
      <button className={mode==='existing'?'active':''} onClick={()=>setMode('existing')}><WalletCards/><span><b>{en?'Existing pensioner':'বর্তমান পেনশনার'}</b><small>{en?'Only 30 Jun 2026 net pension needed':'শুধু ৩০ জুন ২০২৬-এর নিট পেনশন দিন'}</small></span></button>
      <button className={mode==='new'?'active':''} onClick={()=>setMode('new')}><Landmark/><span><b>{en?'New retiree / planning':'নতুন অবসরপ্রাপ্ত / পরিকল্পনা'}</b><small>{en?'Career data prefilled automatically':'চাকরি তথ্য অটো-ফিল হবে'}</small></span></button>
    </div>

    {mode==='existing'?<ExistingPensioner en={en} profile={profile} onSaveCalculation={onSaveCalculation} onPreviewReport={onPreviewReport}/>:<NewRetiree en={en} profile={profile} onSaveCalculation={onSaveCalculation} onPreviewReport={onPreviewReport}/>}

    <section className="pension-phase-note">
      <FileText/>
      <div><b>{en?'Current verified scope':'বর্তমান যাচাইকৃত সীমা'}</b><p>{en?'A4 PDF report is now available. PF final settlement, Benevolent Fund, Group Insurance, family-pension eligibility and DU past-service contribution remain separate until exact applicable DU records/rules are confirmed.':'A4 PDF রিপোর্ট এখন আছে। PF final settlement, Benevolent Fund, Group Insurance, family-pension eligibility এবং DU past-service contribution-এর সঠিক প্রযোজ্য DU record/rule নিশ্চিত না হওয়া পর্যন্ত মোট প্রাপ্যে মেশানো হচ্ছে না।'}</p></div>
    </section>

    <section className="pension-sources three">
      <div><BookOpen/><span><b>{en?'Public Bodies Pay Order 2026':'Public Bodies বেতন ও ভাতা আদেশ ২০২৬'}</b><small>{en?'Grade, scale steps, phased basic and allowances':'গ্রেড, ধাপ, মূল বেতন বাস্তবায়ন ও ভাতা'}</small></span><a href={PAY_GAZETTE_URL} target="_blank" rel="noreferrer">{en?'Open':'দেখুন'}<ChevronRight/></a></div>
      <div><BookOpen/><span><b>{en?'Retirement Benefits Order · 2026':'অবসরকালীন সুবিধা আদেশ · ২০২৬'}</b><small>{en?'Pension, gratuity and pension revision':'পেনশন, আনুতোষিক ও পুনর্নির্ধারণ'}</small></span><a href={GAZETTE_URL} target="_blank" rel="noreferrer">{en?'Open':'দেখুন'}<ChevronRight/></a></div>
      <div><BookOpen/><span><b>{en?'University of Dhaka · Tenth Statutes':'ঢাকা বিশ্ববিদ্যালয় · Tenth Statutes'}</b><small>{en?'Employees Pension / Gratuity Statutes':'Employees Pension / Gratuity Statutes'}</small></span><a href={DU_STATUTE_URL} target="_blank" rel="noreferrer">{en?'Open':'দেখুন'}<ChevronRight/></a></div>
    </section>

    <section className="pension-disclaimer"><AlertTriangle/><p>{en?'This is an independent assistance calculator, not an official University of Dhaka pension sanction. Final pension, gratuity, recoveries and eligibility must follow the latest applicable government order, University statute, office record and sanctioning authority.':'এটি স্বাধীন সহায়ক হিসাব; ঢাকা বিশ্ববিদ্যালয়ের অফিসিয়াল pension sanction নয়। চূড়ান্ত পেনশন, আনুতোষিক, কর্তন ও eligibility সর্বশেষ সরকারি আদেশ, বিশ্ববিদ্যালয় statute, অফিস রেকর্ড ও অনুমোদনকারী কর্তৃপক্ষ অনুযায়ী নির্ধারিত হবে।'}</p></section>
  </div>;
}
