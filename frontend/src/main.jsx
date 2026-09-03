
import React,{useEffect,useMemo,useState} from 'react';
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
  annualPromotionCycle,futureRoadmap,fixed2026,implementationRate,houseRent2015
} from './rules';

const API=import.meta.env.VITE_API_BASE||'';
async function api(path,opts={}){
  const r=await fetch(API+path,{credentials:'include',headers:{'Content-Type':'application/json',...(opts.headers||{})},...opts});
  const d=await r.json().catch(()=>({}));
  if(!r.ok) throw new Error(d.error||d.detail||'Request failed');
  return d;
}
const roleLabel={super_admin:'Super Admin',admin:'Admin',department_admin:'Department Admin',editor:'Editor',employee:'Employee'};

function Login({onLogin,onBack}){
  const[email,setEmail]=useState(''),[password,setPassword]=useState(''),[err,setErr]=useState(''),[busy,setBusy]=useState(false);
  async function submit(e){e.preventDefault();setErr('');setBusy(true);try{const x=await api('/api/login',{method:'POST',body:JSON.stringify({email,password})});onLogin(x.user)}catch(e){setErr(e.message)}finally{setBusy(false)}}
  return <div className="login-shell"><form className="login-card" onSubmit={submit}>
    <button type="button" className="back-link" onClick={onBack}>← হোমে ফিরুন</button>
    <div className="logo">ক-ক</div><h1>DU Employee ERP</h1><p>স্বেচ্ছাসেবী ডিজিটাল সেবা প্ল্যাটফর্ম</p>
    <label>ইমেইল<input value={email} onChange={e=>setEmail(e.target.value)} type="email" required/></label>
    <label>পাসওয়ার্ড<input value={password} onChange={e=>setPassword(e.target.value)} type="password" required/></label>
    {err&&<div className="error">{err}</div>}
    <button disabled={busy}>{busy?'লগইন হচ্ছে...':'লগইন'}</button>
    <small>এটি কোনো অফিসিয়াল ঢাকা বিশ্ববিদ্যালয় ERP নয়।</small>
  </form></div>
}

function PublicHome({onLogin}){
  return <div className="public">
    <header className="public-nav">
      <div className="public-brand"><div className="logo small">ক-ক</div><div><b>DU Employee ERP</b><small>কর্মকর্তা-কর্মচারী ডিজিটাল সেবা</small></div></div>
      <nav><a href="#services">সেবা</a><a href="#updates">আপডেট</a><a href="#help">সহায়তা</a><button onClick={onLogin}>লগইন</button></nav>
    </header>
    <section className="public-hero">
      <div className="public-copy">
        <span className="eyebrow">ZERO-COST DIGITAL FOUNDATION</span>
        <h1>ঢাকা বিশ্ববিদ্যালয়ের কর্মকর্তা-কর্মচারীদের জন্য একটি আধুনিক ডিজিটাল সেবা প্ল্যাটফর্ম</h1>
        <p>পদোন্নতি, পে-স্কেল, Employee Profile, service information এবং ভবিষ্যৎ online service—এক জায়গায়।</p>
        <div className="public-actions"><button onClick={onLogin}>ERP-তে লগইন <ArrowRight size={17}/></button><a href="#services">সেবাগুলো দেখুন</a></div>
        <div className="trust-row"><span><CheckCircle2/> Cloudflare Hosted</span><span><ShieldCheck/> Secure Session</span><span><Database/> D1 Database</span></div>
      </div>
      <div className="hero-panel">
        <div className="hero-panel-head"><Landmark/><div><b>Quick Services</b><small>Phase 3 Active</small></div></div>
        <div className="quick-grid">
          <button onClick={onLogin}><TrendingUp/><b>পদোন্নতি</b><small>Eligibility + Roadmap</small></button>
          <button onClick={onLogin}><WalletCards/><b>পে-স্কেল</b><small>2015 → 2026</small></button>
          <button onClick={onLogin}><Users/><b>Employee</b><small>Profile Management</small></button>
          <button onClick={onLogin}><Calculator/><b>Calculator</b><small>Service Tools</small></button>
        </div>
      </div>
    </section>
    <section id="services" className="public-section"><div className="section-title"><span>QUICK ACCESS</span><h2>প্রধান সেবা</h2></div>
      <div className="service-grid">
        {[['পদোন্নতি কেন্দ্র','বর্তমান গ্রেড, যোগদানের তারিখ, শিক্ষা ও ACR থেকে সম্ভাব্য পদোন্নতি হিসাব।',TrendingUp],
          ['বেতন ও পে-স্কেল ERP','২০১৫ বর্তমান basic থেকে ২০২৬ fixation, বাস্তবায়িত basic, gross ও net হিসাব।',WalletCards],
          ['Employee Management','Employee ID, পদবি, grade, joining date ও service status পরিচালনা।',Users],
          ['Rules & Policies','পর্যায়ক্রমে promotion, leave, salary ও retirement rule library যুক্ত হবে।',BookOpen]
        ].map(([t,p,I])=><article className="service-card" key={t}><div className="service-icon"><I/></div><h3>{t}</h3><p>{p}</p><button onClick={onLogin}>খুলুন <ChevronRight size={15}/></button></article>)}
      </div>
    </section>
    <section id="updates" className="public-section muted-section"><div className="section-title"><span>LATEST</span><h2>সিস্টেম আপডেট</h2></div>
      <div className="update-list">
        <article><Bell/><div><b>Phase 3 চালু</b><p>Homepage, Promotion Calculator এবং Pay Scale Calculator একীভূত করা হয়েছে।</p></div></article>
        <article><ShieldCheck/><div><b>Secure login active</b><p>Cloudflare Worker + D1 + HttpOnly secure session foundation কার্যকর।</p></div></article>
        <article><FileText/><div><b>স্বাধীন/অনঅফিসিয়াল টুল</b><p>অফিসিয়াল সিদ্ধান্তের জন্য সংশ্লিষ্ট বিশ্ববিদ্যালয় আদেশ/নীতিমালা অনুসরণযোগ্য।</p></div></article>
      </div>
    </section>
    <footer id="help"><div><b>DU Employee ERP</b><p>স্বেচ্ছাসেবী ও স্বাধীন ডিজিটাল উদ্যোগ</p></div><div><HelpCircle/> সহায়তা · <Phone/> 01759084692</div></footer>
  </div>
}

function Stat({label,value,icon:Icon}){return <article className="stat-card"><div className="stat-icon"><Icon size={19}/></div><div><small>{label}</small><b>{value}</b></div></article>}

function DashboardHome({user,onPage}){
  return <>
    <section className="hero"><div><span>PHASE 3</span><h1>Employee ERP Foundation</h1><p>Homepage, Promotion Calculator, Pay Scale Calculator, Employee Management ও secure foundation সক্রিয়।</p></div><div className="hero-chip"><Activity size={16}/> System Active</div></section>
    <section className="stats-grid"><Stat label="Role" value={roleLabel[user.role]||user.role} icon={ShieldCheck}/><Stat label="Employee ID" value={user.employee_id||'—'} icon={IdCard}/><Stat label="Account Status" value="Active" icon={Activity}/><Stat label="Security" value="Session Protected" icon={LockKeyhole}/></section>
    <section className="module-grid">
      <article className="module-card"><div className="module-icon"><TrendingUp/></div><h3>পদোন্নতি কেন্দ্র</h3><p>Eligibility date, annual cycle এবং future roadmap হিসাব করুন।</p><button className="ghost-btn" onClick={()=>onPage('promotion')}>হিসাব করুন <ChevronRight size={16}/></button></article>
      <article className="module-card"><div className="module-icon green"><WalletCards/></div><h3>বেতন ও পে-স্কেল ERP</h3><p>২০১৫ basic থেকে ২০২৬ fixation, payable basic, gross ও net হিসাব করুন।</p><button className="ghost-btn" onClick={()=>onPage('salary')}>হিসাব করুন <ChevronRight size={16}/></button></article>
    </section>
    <section className="notice"><b>দ্রষ্টব্য</b><p>এটি ব্যক্তিগত ও স্বেচ্ছাসেবী উদ্যোগ। অফিসিয়াল সিদ্ধান্তে সংশ্লিষ্ট কর্তৃপক্ষের নোটিশ/বিধি/আদেশ অনুসরণ করতে হবে।</p></section>
  </>
}

function DMY({label,value,onChange}){
  const d=value?new Date(value):null;
  const day=d&&!isNaN(d)?d.getDate():'',month=d&&!isNaN(d)?d.getMonth()+1:'',year=d&&!isNaN(d)?d.getFullYear():'';
  const days=Array.from({length:31},(_,i)=>i+1), months=Array.from({length:12},(_,i)=>i+1), years=Array.from({length:80},(_,i)=>new Date().getFullYear()-i);
  function set(part,v){let dd=day||1,mm=month||1,yy=year||new Date().getFullYear();if(part==='d')dd=Number(v);if(part==='m')mm=Number(v);if(part==='y')yy=Number(v);if(!v){onChange('');return}const x=new Date(yy,mm-1,dd);onChange(`${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,'0')}-${String(x.getDate()).padStart(2,'0')}`)}
  return <label className="dmy-label">{label}<div className="dmy">
    <select value={day} onChange={e=>set('d',e.target.value)}><option value="">দিন</option>{days.map(x=><option key={x}>{x}</option>)}</select>
    <select value={month} onChange={e=>set('m',e.target.value)}><option value="">মাস</option>{months.map(x=><option key={x}>{x}</option>)}</select>
    <select value={year} onChange={e=>set('y',e.target.value)}><option value="">বছর</option>{years.map(x=><option key={x}>{x}</option>)}</select>
  </div></label>
}

function PromotionCenter(){
  const [f,setF]=useState({grade:'13',edu:'bachelor',currentDate:'',duDate:'',computer:'yes',acr:'yes'}),[result,setResult]=useState(null);
  function calc(){
    const rule=PROMO_RULES[f.grade];
    if(!f.currentDate||!f.duDate)return setResult({error:'দুইটি যোগদানের তারিখ নির্বাচন করুন।'});
    const current=new Date(f.currentDate),du=new Date(f.duDate),today=new Date();today.setHours(0,0,0,0);
    if(du>current)return setResult({error:'ঢাকা বিশ্ববিদ্যালয়ে প্রথম যোগদানের তারিখ বর্তমান পদে যোগদানের তারিখের পরে হতে পারে না।'});
    if(!rule)return setResult({error:'এই গ্রেডের rule map পাওয়া যায়নি।'});
    if(rule.noPromotion||rule.top)return setResult({stop:true,rule});
    const req=(rule.years&&rule.years[f.edu])||4;
    const eligible=addYears(current,req),cycle=annualPromotionCycle(eligible);
    const currentYears=Math.max(0,(today-current)/(365.2425*86400000));
    const pastYears=Math.max(0,(current-du)/(365.2425*86400000));
    const points=currentYears+(pastYears/3);
    const elapsed=diffYMD(current,today),remaining=today>=eligible?{y:0,m:0,d:0}:diffYMD(today,eligible);
    const prelim=today>=eligible&&f.computer==='yes'&&f.acr==='yes';
    setResult({rule,req,eligible,cycle,points,elapsed,remaining,prelim,roadmap:futureRoadmap(f.grade,current,f.edu,6)});
  }
  return <div>
    <div className="page-head"><div><h2>পদোন্নতি কেন্দ্র</h2><p>দুইটি তারিখ থেকে service, point, eligibility এবং annual promotion cycle স্বয়ংক্রিয়ভাবে হিসাব হবে।</p></div></div>
    <section className="calc-card">
      <div className="form-grid promo-form">
        <label>বর্তমান গ্রেড<select value={f.grade} onChange={e=>setF({...f,grade:e.target.value})}>{['16','17','15','14','13','12','11','10','9','6','4'].map(g=><option key={g} value={g}>গ্রেড {g}</option>)}</select></label>
        <label>শিক্ষাগত যোগ্যতা<select value={f.edu} onChange={e=>setF({...f,edu:e.target.value})}><option value="masters">Masters</option><option value="bachelor">Bachelor</option><option value="hsc">HSC</option><option value="diploma">Diploma</option><option value="bsceng">BSc Engineering</option><option value="mbbs">MBBS</option></select></label>
        <DMY label="বর্তমান পদে যোগদানের তারিখ" value={f.currentDate} onChange={v=>setF({...f,currentDate:v})}/>
        <DMY label="ঢাকা বিশ্ববিদ্যালয়ে প্রথম যোগদানের তারিখ" value={f.duDate} onChange={v=>setF({...f,duDate:v})}/>
        <label>কম্পিউটার দক্ষতা/প্রশিক্ষণ<select value={f.computer} onChange={e=>setF({...f,computer:e.target.value})}><option value="yes">আছে</option><option value="no">নেই</option></select></label>
        <label>ACR শর্ত<select value={f.acr} onChange={e=>setF({...f,acr:e.target.value})}><option value="yes">সন্তোষজনক</option><option value="no">অসম্পূর্ণ/না</option></select></label>
      </div>
      <button className="primary wide" onClick={calc}>পদোন্নতি হিসাব করুন</button>
    </section>
    {result&&<PromotionResult r={result}/>}
  </div>
}

function PromotionResult({r}){
  if(r.error)return <div className="error">{r.error}</div>;
  if(r.stop)return <section className="result-panel warn"><h3>{r.rule.target}</h3><p>রেফারেন্স: {r.rule.ref}</p></section>;
  return <div className="result-stack">
    <section className={'result-panel '+(r.prelim?'ok':'')}><small>সম্ভাব্য পরবর্তী পদোন্নতি</small><h3>{r.rule.target} — গ্রেড {r.rule.targetGrade}</h3><div className="big-date">{fmtDate(r.cycle.completionDeadline)}</div><p>Projected promotion-process completion deadline · নীতিগত যোগ্যতা পূর্ণ: {fmtDate(r.eligible)}</p></section>
    <section className="metric-grid">
      <Stat label="বর্তমান পদে চাকরি" value={durationBn(r.elapsed)} icon={CalendarDays}/><Stat label="প্রয়োজনীয় অভিজ্ঞতা" value={`${r.req} বছর`} icon={CheckCircle2}/><Stat label="অবশিষ্ট সময়" value={r.remaining.y||r.remaining.m||r.remaining.d?durationBn(r.remaining):'সময় পূর্ণ'} icon={Activity}/><Stat label="Experience Point" value={r.points.toLocaleString('bn-BD',{maximumFractionDigits:2})} icon={TrendingUp}/>
    </section>
    <section className="cycle-card"><h3>বার্ষিক পদোন্নতি প্রক্রিয়া</h3><div className="cycle-flow"><div><small>যোগ্যতা পূর্ণ</small><b>{fmtDate(r.eligible)}</b></div><span>→</span><div><small>আবেদন/সার্কুলার</small><b>{fmtDate(r.cycle.circularDeadline)}</b></div><span>→</span><div><small>Projected completion</small><b>{fmtDate(r.cycle.completionDeadline)}</b></div></div><p>নীতিমালায় প্রতি বছর ১ বার, ৩১ ডিসেম্বরের মধ্যে দরখাস্ত আহ্বান এবং জুন মাসের মধ্যে কার্যক্রম সম্পন্ন করার কথা বলা হয়েছে।</p></section>
    <section className="roadmap-card"><h3>ভবিষ্যৎ সম্ভাব্য Promotion Roadmap</h3>{r.roadmap.map((x,i)=>x.stop?<div className="roadmap-row stop" key={i}><b>{x.fromGrade} গ্রেডের পর</b><span>{x.label}</span></div>:<div className="roadmap-row" key={i}><div><b>{x.fromGrade} → {x.toGrade} · {x.title}</b><small>{x.years} বছর · {x.ref}</small></div><div><b>{fmtDate(x.completionDeadline)}</b><small>Projected completion</small></div></div>)}</section>
    <div className="notice"><b>সতর্কতা:</b> এটি simplified দুই-তারিখ model। একাধিক পূর্ববর্তী পদ বা technical/medical stream-এর বিশেষ শর্ত থাকলে অফিসিয়াল নীতিমালা যাচাই প্রয়োজন।</div>
  </div>
}

function SalaryCalculator(){
  const today='2026-09-03';
  const [f,setF]=useState({grade:'13',fixStage:'0',postInc:'0',date:today,housing:'no',children:'0',tiffin:'yes',zone:'dhaka',category:'class3',health:'149.34',group:'192.50',stamp:'10',association:'10',tax:'0',loan:'0',other:'0'});
  const [r,setR]=useState(null);
  const stages=PAY2015[f.grade]||[];
  const currentIndex=Math.min(Number(f.fixStage||0)+Math.max(0,Number(f.postInc||0)),Math.max(0,stages.length-1));
  function calc(){
    const grade=Number(f.grade),currentBasic=stages[currentIndex]||0,fixed=fixed2026(grade,currentBasic),rate=implementationRate(grade,f.date);
    const increase=Math.max(0,fixed-currentBasic),implemented=Math.round(increase*rate),payable=Math.round(currentBasic+implemented);
    const house=Math.round(houseRent2015(currentBasic,f.housing)),medical=1500,education=Math.min(Number(f.children||0),2)*500,tiffin=f.tiffin==='yes'&&grade>=11?200:0,conveyance=f.zone==='dhaka'&&grade>=11?300:0;
    const gross=payable+house+medical+education+tiffin+conveyance;
    const pf=Math.round(payable*.10*100)/100,beneRate=f.category==='officer'?.05:f.category==='class4'?.0275:.04,bene=Math.round(payable*beneRate*100)/100;
    const health=Number(f.health||0),group=Number(f.group||0),stamp=Number(f.stamp||0),association=Number(f.association||0),tax=Number(f.tax||0),loan=Number(f.loan||0),other=Number(f.other||0);
    const deductions=pf+bene+health+group+stamp+association+tax+loan+other;
    setR({grade,currentIndex,currentBasic,fixed,rate,increase,implemented,payable,house,medical,education,tiffin,conveyance,gross,pf,bene,health,group,stamp,association,tax,loan,other,deductions,net:gross-deductions});
  }
  useEffect(()=>{setF(x=>({...x,fixStage:'0',postInc:'0'}));setR(null)},[f.grade]);
  return <div>
    <div className="page-head"><div><h2>বেতন ও পে-স্কেল ERP</h2><p>২০১৫ বর্তমান basic → ২০২৬ full fixation → grade-based implementation → gross/net.</p></div></div>
    <section className="calc-card"><div className="form-grid">
      <label>গ্রেড<select value={f.grade} onChange={e=>setF({...f,grade:e.target.value})}>{Array.from({length:20},(_,i)=>i+1).map(g=><option key={g}>{g}</option>)}</select></label>
      <label>Fixation/Joining Stage<select value={f.fixStage} onChange={e=>setF({...f,fixStage:e.target.value})}>{stages.map((v,i)=><option value={i} key={i}>ধাপ {i+1} — ৳{money(v)}</option>)}</select></label>
      <label>Post-2015 Annual Increment<input type="number" min="0" value={f.postInc} onChange={e=>setF({...f,postInc:e.target.value})}/></label>
      <label>বর্তমান ২০১৫ ধাপ<input readOnly value={`ধাপ ${currentIndex+1} — ৳${money(stages[currentIndex]||0)}`}/></label>
      <label>হিসাবের তারিখ<input type="date" value={f.date} onChange={e=>setF({...f,date:e.target.value})}/></label>
      <label>DU Category<select value={f.category} onChange={e=>setF({...f,category:e.target.value})}><option value="officer">কর্মকর্তা</option><option value="class3">Class III</option><option value="class4">Class IV</option></select></label>
      <label>সরকারি/বিশ্ববিদ্যালয় বাসা<select value={f.housing} onChange={e=>setF({...f,housing:e.target.value})}><option value="no">না</option><option value="yes">হ্যাঁ</option></select></label>
      <label>শিক্ষা ভাতা সন্তানের সংখ্যা<select value={f.children} onChange={e=>setF({...f,children:e.target.value})}><option>0</option><option>1</option><option>2</option></select></label>
      <label>টিফিন ভাতা প্রযোজ্য<select value={f.tiffin} onChange={e=>setF({...f,tiffin:e.target.value})}><option value="yes">হ্যাঁ</option><option value="no">না</option></select></label>
      <label>কর্মস্থল<select value={f.zone} onChange={e=>setF({...f,zone:e.target.value})}><option value="dhaka">DU / Dhaka City</option><option value="other">অন্যান্য</option></select></label>
    </div>
    <details className="deduction-box"><summary>নিয়মিত Deduction সম্পাদনা</summary><div className="form-grid compact">
      {[['health','Health Insurance'],['group','Group Insurance'],['stamp','Revenue Stamp'],['association','Association'],['tax','Tax'],['loan','Loan'],['other','Other']].map(([k,l])=><label key={k}>{l}<input type="number" step="0.01" value={f[k]} onChange={e=>setF({...f,[k]:e.target.value})}/></label>)}
    </div></details>
    <button className="primary wide" onClick={calc}>বেতন হিসাব করুন</button></section>
    {r&&<SalaryResult r={r}/>}
  </div>
}

function SalaryResult({r}){
  return <div className="result-stack">
    <section className="result-panel ok"><small>প্রাপ্য Basic</small><h3>৳{money(r.payable)}</h3><p>২০১৫ বর্তমান basic ৳{money(r.currentBasic)} · ২০২৬ full fixed basic ৳{money(r.fixed)} · বাস্তবায়ন {(r.rate*100).toLocaleString('bn-BD')}%</p></section>
    <section className="salary-summary">
      <article><small>Basic Increase</small><b>৳{money(r.increase)}</b></article><article><small>Implemented Increase</small><b>৳{money(r.implemented)}</b></article><article><small>Gross Salary</small><b>৳{money(r.gross)}</b></article><article><small>Total Deduction</small><b>৳{money(r.deductions)}</b></article><article className="net"><small>Net Salary</small><b>৳{money(r.net)}</b></article>
    </section>
    <div className="split-grid">
      <section className="breakdown-card"><h3>ভাতা</h3>{[['House Rent',r.house],['Medical',r.medical],['Education',r.education],['Tiffin',r.tiffin],['Conveyance',r.conveyance]].map(([l,v])=><div className="money-row" key={l}><span>{l}</span><b>৳{money(v)}</b></div>)}</section>
      <section className="breakdown-card"><h3>Deduction</h3>{[['PF Subscription 10%',r.pf],['Benevolent',r.bene],['Health Insurance',r.health],['Group Insurance',r.group],['Revenue Stamp',r.stamp],['Association',r.association],['Tax',r.tax],['Loan',r.loan],['Other',r.other]].map(([l,v])=><div className="money-row" key={l}><span>{l}</span><b>৳{money(v)}</b></div>)}</section>
    </div>
    <div className="notice"><b>নিয়ম:</b> Special Benefit সম্পূর্ণ বাদ। ৩১ ডিসেম্বর ২০২৭ পর্যন্ত house rent/medical/education/tiffin/conveyance ২০১৫ current basic ও ২০১৫ rule layer ধরে হিসাব করা হয়েছে। PF Advance Installment default deduction-এ নেই। ২০২৮-এর নতুন allowance rate এখানে অনুমান করা হয়নি।</div>
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
      <DMY label="ঢাকা বিশ্ববিদ্যালয়ে প্রথম যোগদানের তারিখ" value={form.joining_date} onChange={v=>change('joining_date',v)}/>
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
  const[user,setUser]=useState(null),[loading,setLoading]=useState(true),[page,setPage]=useState('dashboard'),[showLogin,setShowLogin]=useState(false);
  useEffect(()=>{api('/api/me').then(x=>setUser(x.user)).catch(()=>{}).finally(()=>setLoading(false))},[]);
  async function logout(){try{await api('/api/logout',{method:'POST'})}catch{}setUser(null);setShowLogin(false);setPage('dashboard')}
  if(loading)return <div className="loading">Loading...</div>;
  if(!user)return showLogin?<Login onLogin={setUser} onBack={()=>setShowLogin(false)}/>:<PublicHome onLogin={()=>setShowLogin(true)}/>;
  const admin=['super_admin','admin','department_admin'].includes(user.role);
  return <div className="app"><aside className="side"><div className="brand"><div className="logo small">ক-ক</div><div><b>DU Employee ERP</b><small>Zero-Cost Foundation</small></div></div><nav>
    <button className={page==='dashboard'?'active':''} onClick={()=>setPage('dashboard')}><LayoutDashboard size={18}/> আমার ড্যাশবোর্ড</button>
    <button className={page==='promotion'?'active':''} onClick={()=>setPage('promotion')}><TrendingUp size={18}/> পদোন্নতি</button>
    <button className={page==='salary'?'active':''} onClick={()=>setPage('salary')}><WalletCards size={18}/> বেতন ও পে-স্কেল</button>
    {admin&&<button className={page==='employees'?'active':''} onClick={()=>setPage('employees')}><Users size={18}/> Employee Management</button>}
    {admin&&<button className={page==='directory'?'active':''} onClick={()=>setPage('directory')}><Building2 size={18}/> Department & Designation</button>}{admin&&<button className={page==='admin'?'active':''} onClick={()=>setPage('admin')}><ShieldCheck size={18}/> Admin Panel</button>}
  </nav></aside><main><header><div><h2>স্বাগতম, {user.name}</h2><p>{roleLabel[user.role]||user.role}</p></div><button className="logout" onClick={logout}><LogOut size={16}/> লগআউট</button></header>
    {page==='dashboard'&&<DashboardHome user={user} onPage={setPage}/>}
    {page==='promotion'&&<PromotionCenter/>}
    {page==='salary'&&<SalaryCalculator/>}
    {page==='employees'&&admin&&<EmployeeManagement/>}
    {page==='directory'&&admin&&<MasterDirectory/>}{page==='admin'&&admin&&<AdminPanel/>}
  </main></div>
}
createRoot(document.getElementById('root')).render(<App/>);
