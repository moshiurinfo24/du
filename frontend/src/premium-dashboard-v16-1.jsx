import React,{useEffect,useMemo,useState} from 'react';
import {
  Briefcase,Clock3,Milestone,GraduationCap,CalendarDays,WalletCards,TrendingUp,
  History,Calculator,ChevronRight,ShieldCheck,Sparkles,Target,Award,BookUser,
  ArrowRight,RefreshCw
} from 'lucide-react';
import './premium-dashboard-v16-1.css';

const API=import.meta.env.VITE_API_URL||import.meta.env.VITE_API_BASE||'';
async function api(path){
  const r=await fetch(API+path,{credentials:'include'});
  const d=await r.json().catch(()=>({}));
  if(!r.ok)throw new Error(d.error||d.detail||'Request failed');
  return d;
}
const iso=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const parseDate=v=>v?new Date(`${String(v).slice(0,10)}T00:00:00`):null;
function diffYMD(a,b){
  const s=parseDate(a),e=parseDate(b); if(!s||!e||isNaN(s)||isNaN(e))return null;
  let y=e.getFullYear()-s.getFullYear(),m=e.getMonth()-s.getMonth(),d=e.getDate()-s.getDate();
  if(d<0){m--;d+=new Date(e.getFullYear(),e.getMonth(),0).getDate()}
  if(m<0){y--;m+=12} return {y,m,d};
}
const fmt=(v,lang)=>{
  if(!v)return '—'; const d=parseDate(v); if(!d||isNaN(d))return v;
  return new Intl.DateTimeFormat(lang==='en'?'en-GB':'bn-BD',{day:'2-digit',month:'short',year:'numeric'}).format(d);
};
const num=(v,lang,d=0)=>Number(v||0).toLocaleString(lang==='en'?'en-US':'bn-BD',{maximumFractionDigits:d});
function fyNow(){
  const d=new Date(),y=d.getFullYear();
  return d.getMonth()>=6?`${y}-${y+1}`:`${y-1}-${y}`;
}
function money(v,lang){return `${lang==='en'?'Tk':'৳'} ${Number(v||0).toLocaleString(lang==='en'?'en-US':'bn-BD',{maximumFractionDigits:0})}`}

function MiniLineChart({items,lang}){
  const data=[...items].filter(x=>Number(x.net_salary||x.payable_basic||0)>0).sort((a,b)=>String(a.effective_date).localeCompare(String(b.effective_date))).slice(-7);
  if(data.length<2)return <div className="lux-empty-chart"><TrendingUp/><b>{lang==='en'?'Salary trend will appear here':'বেতন ট্রেন্ড এখানে দেখা যাবে'}</b><span>{lang==='en'?'Add at least two salary-history snapshots.':'কমপক্ষে দুইটি বেতন ইতিহাস স্ন্যাপশট যোগ করুন।'}</span></div>;
  const vals=data.map(x=>Number(x.net_salary||x.payable_basic||0)),min=Math.min(...vals),max=Math.max(...vals),range=Math.max(1,max-min);
  const pts=data.map((x,i)=>`${18+(i*(264/(data.length-1)))},${112-((vals[i]-min)/range)*76}`).join(' ');
  return <div className="lux-line-wrap">
    <svg viewBox="0 0 300 132" className="lux-line-chart" role="img" aria-label="Salary trend">
      <defs><linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="currentColor" stopOpacity=".22"/><stop offset="100%" stopColor="currentColor" stopOpacity=".02"/></linearGradient></defs>
      <line x1="18" y1="112" x2="282" y2="112" className="axis"/>
      <polyline points={`18,112 ${pts} 282,112`} fill="url(#lineFill)" stroke="none"/>
      <polyline points={pts} fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
      {data.map((x,i)=>{const [cx,cy]=pts.split(' ')[i].split(',');return <circle key={x.id||i} cx={cx} cy={cy} r="4.5" fill="white" stroke="currentColor" strokeWidth="3"/>})}
    </svg>
    <div className="lux-chart-labels">{data.map((x,i)=><span key={x.id||i}>{fmt(x.effective_date,lang).split(' ')[0]} {fmt(x.effective_date,lang).split(' ')[1]}</span>)}</div>
  </div>
}

function CareerBars({events,profile,lang}){
  const current=new Date(),curY=current.getFullYear();
  const years=[curY-4,curY-3,curY-2,curY-1,curY];
  const counts=years.map(y=>(events||[]).filter(x=>String(x.event_date||'').startsWith(String(y))).length);
  if(profile?.first_joining_date){
    const joinY=Number(String(profile.first_joining_date).slice(0,4));
    years.forEach((y,i)=>{if(y===joinY&&counts[i]===0)counts[i]=1});
  }
  const max=Math.max(1,...counts);
  return <div className="lux-bars">{years.map((y,i)=><div className="lux-bar-col" key={y}><div className="lux-bar-track"><i style={{height:`${Math.max(8,(counts[i]/max)*100)}%`}}></i></div><b>{num(counts[i],lang)}</b><span>{String(y).slice(-2)}</span></div>)}</div>
}

function LeaveDonut({items,lang}){
  const year=String(new Date().getFullYear());
  const rows=(items||[]).filter(x=>String(x.start_date||'').startsWith(year));
  const days=rows.reduce((s,x)=>s+Number(x.total_days||0),0);
  const types=new Set(rows.map(x=>x.leave_type)).size;
  const circumference=2*Math.PI*43, pct=Math.min(1,days/30),dash=circumference*pct;
  return <div className="lux-donut-block"><div className="lux-donut"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="43" className="ring-bg"/><circle cx="50" cy="50" r="43" className="ring-value" strokeDasharray={`${dash} ${circumference-dash}`}/></svg><div><b>{num(days,lang,1)}</b><span>{lang==='en'?'days':'দিন'}</span></div></div><div className="lux-donut-meta"><small>{lang==='en'?'Current-year leave':'চলতি বছরের ছুটি'}</small><b>{num(rows.length,lang)} {lang==='en'?'record(s)':'রেকর্ড'}</b><span>{num(types,lang)} {lang==='en'?'leave type(s)':'ধরনের ছুটি'}</span></div></div>
}

function MonthCalendar({calendar,lang,onOpen}){
  const en=lang==='en',today=new Date(),year=today.getFullYear(),month=today.getMonth(),first=new Date(year,month,1),last=new Date(year,month+1,0),lead=first.getDay();
  const weekdays=en?['Sun','Mon','Tue','Wed','Thu','Fri','Sat']:['রবি','সোম','মঙ্গল','বুধ','বৃহ','শুক্র','শনি'];
  const holidays=new Map((calendar?.holidays||[]).map(x=>[x.holiday_date,x]));
  const cells=[];
  for(let i=0;i<lead;i++)cells.push(null);
  for(let d=1;d<=last.getDate();d++)cells.push(new Date(year,month,d));
  while(cells.length%7)cells.push(null);
  let next=null;
  for(let i=0;i<370;i++){const d=new Date(today);d.setDate(today.getDate()+i);const key=iso(d);if(d.getDay()===5||d.getDay()===6||holidays.has(key)){next={date:d,holiday:holidays.get(key)};break}}
  const monthLabel=new Intl.DateTimeFormat(en?'en-US':'bn-BD',{month:'long',year:'numeric'}).format(today);
  return <article className="lux-card lux-calendar-card">
    <div className="lux-card-head"><div><span>{en?'OFFICE CALENDAR':'অফিস ক্যালেন্ডার'}</span><h3>{monthLabel}</h3></div><button onClick={onOpen}>{en?'Full calendar':'পূর্ণ ক্যালেন্ডার'}<ChevronRight/></button></div>
    <div className="lux-calendar-week">{weekdays.map(x=><b key={x}>{x}</b>)}</div>
    <div className="lux-calendar-grid">{cells.map((d,i)=>{
      if(!d)return <span key={'e'+i} className="empty"></span>;
      const key=iso(d),h=holidays.get(key),wk=d.getDay()===5||d.getDay()===6,todayCell=key===iso(today);
      return <span key={key} title={h?(en?(h.title_en||h.title_bn):h.title_bn):''} className={`${wk?'weekend ':''}${h?'holiday ':''}${todayCell?'today ':''}`}><b>{num(d.getDate(),lang)}</b>{h&&<i></i>}</span>
    })}</div>
    <div className="lux-calendar-footer"><div className="legend"><span><i className="dot today-dot"></i>{en?'Today':'আজ'}</span><span><i className="dot weekend-dot"></i>{en?'Fri/Sat':'শুক্র/শনি'}</span><span><i className="dot holiday-dot"></i>{en?'Office holiday':'অফিস ছুটি'}</span></div>{next&&<div className="next-off"><small>{en?'Next closure':'পরবর্তী বন্ধ'}</small><b>{fmt(iso(next.date),lang)}</b><span>{next.holiday?(en?(next.holiday.title_en||next.holiday.title_bn):next.holiday.title_bn):(en?(next.date.getDay()===5?'Friday':'Saturday'):(next.date.getDay()===5?'শুক্রবার':'শনিবার'))}</span></div>}</div>
  </article>
}

export default function PremiumPersonalDashboard({user,onPage,lang='bn'}){
  const en=lang==='en';
  const [career,setCareer]=useState({profile:null,education:[],events:[]}),[salary,setSalary]=useState([]),[leave,setLeave]=useState([]),[calendar,setCalendar]=useState(null),[busy,setBusy]=useState(true);
  async function load(){
    setBusy(true);
    const fy=fyNow();
    const [c,s,l,cal]=await Promise.all([
      api('/api/my-career').catch(()=>({profile:null,education:[],events:[]})),
      api('/api/my-salary-history').catch(()=>({items:[]})),
      api('/api/my-leave-records').catch(()=>({items:[]})),
      api(`/api/public/office-calendar?fy=${encodeURIComponent(fy)}`).catch(()=>null)
    ]);
    setCareer({profile:c.profile||null,education:c.education||[],events:c.events||[]});
    setSalary(s.items||[]);setLeave(l.items||[]);setCalendar(cal);setBusy(false);
  }
  useEffect(()=>{load()},[]);
  const p=career.profile||{},today=iso(new Date()),service=p.first_joining_date?diffYMD(p.first_joining_date,today):null,postTenure=p.current_post_joining_date?diffYMD(p.current_post_joining_date,today):null;
  const serviceText=d=>!d?'—':en?`${num(d.y,lang)}y ${num(d.m,lang)}m ${num(d.d,lang)}d`:`${num(d.y,lang)} বছর ${num(d.m,lang)} মাস ${num(d.d,lang)} দিন`;
  const currentPost=p.current_post||'—',grade=p.current_grade?`${en?'Grade':'গ্রেড'} ${num(p.current_grade,lang)}`:'—';
  const latestSalary=[...salary].sort((a,b)=>String(b.effective_date).localeCompare(String(a.effective_date)))[0];
  const recentEvents=[...(career.events||[])].sort((a,b)=>String(b.event_date).localeCompare(String(a.event_date))).slice(0,4);
  const profileScore=[p.first_joining_date,p.current_post,p.current_grade,p.current_post_joining_date,p.office_name,p.department_name].filter(Boolean).length/6*100;
  const thisYear=String(new Date().getFullYear()),leaveDays=leave.filter(x=>String(x.start_date||'').startsWith(thisYear)).reduce((s,x)=>s+Number(x.total_days||0),0);

  if(busy)return <div className="lux-loading"><Sparkles/><b>{en?'Preparing your premium dashboard...':'আপনার প্রিমিয়াম ড্যাশবোর্ড প্রস্তুত হচ্ছে...'}</b></div>;

  return <div className="lux-dashboard">
    <section className="lux-hero">
      <div className="lux-hero-copy"><span><Sparkles/> {en?'PERSONAL EXECUTIVE WORKSPACE':'ব্যক্তিগত এক্সিকিউটিভ ওয়ার্কস্পেস'}</span><h1>{en?`Welcome, ${user.name}`:`স্বাগতম, ${user.name}`}</h1><p>{en?'Your career, salary, leave, milestones and office calendar — organized in one premium workspace.':'আপনার চাকরি, বেতন, ছুটি, মাইলস্টোন ও অফিস ক্যালেন্ডার—একটি প্রিমিয়াম কর্মপরিসরে।'}</p><div className="lux-hero-actions"><button onClick={()=>onPage('career')}><BookUser/>{en?'Update career':'চাকরি আপডেট'}</button><button className="ghost" onClick={()=>onPage('reports')}><Award/>{en?'My report':'আমার রিপোর্ট'}</button></div></div>
      <div className="lux-profile-orb"><div className="orb-ring" style={{'--score':`${profileScore*3.6}deg`}}><div><small>{en?'Profile':'প্রোফাইল'}</small><b>{num(profileScore,lang)}%</b><span>{en?'complete':'সম্পূর্ণ'}</span></div></div><h3>{currentPost}</h3><p>{grade}</p></div>
    </section>

    <section className="lux-kpis">
      <article><div className="lux-icon"><Briefcase/></div><div><small>{en?'Current Post':'বর্তমান পদ'}</small><b>{currentPost}</b><span>{grade}</span></div></article>
      <article><div className="lux-icon"><Clock3/></div><div><small>{en?'Total Service':'মোট চাকরিকাল'}</small><b>{serviceText(service)}</b><span>{fmt(p.first_joining_date,lang)}</span></div></article>
      <article><div className="lux-icon"><Milestone/></div><div><small>{en?'Current Post Tenure':'বর্তমান পদে চাকরিকাল'}</small><b>{serviceText(postTenure)}</b><span>{fmt(p.current_post_joining_date,lang)}</span></div></article>
      <article><div className="lux-icon"><WalletCards/></div><div><small>{en?'Latest Net Salary':'সর্বশেষ নিট বেতন'}</small><b>{latestSalary?money(latestSalary.net_salary,lang):'—'}</b><span>{latestSalary?fmt(latestSalary.effective_date,lang):(en?'No snapshot yet':'এখনো স্ন্যাপশট নেই')}</span></div></article>
    </section>

    <section className="lux-grid-top">
      <article className="lux-card lux-salary-card"><div className="lux-card-head"><div><span>{en?'SALARY PROGRESSION':'বেতন অগ্রগতি'}</span><h3>{en?'Personal salary trend':'ব্যক্তিগত বেতন ট্রেন্ড'}</h3></div><button onClick={()=>onPage('salary-history')}>{en?'History':'ইতিহাস'}<ChevronRight/></button></div><MiniLineChart items={salary} lang={lang}/><div className="lux-mini-stats"><span><small>{en?'Snapshots':'স্ন্যাপশট'}</small><b>{num(salary.length,lang)}</b></span><span><small>{en?'Latest payable basic':'সর্বশেষ প্রাপ্য মূল বেতন'}</small><b>{latestSalary?money(latestSalary.payable_basic,lang):'—'}</b></span></div></article>
      <MonthCalendar calendar={calendar} lang={lang} onOpen={()=>onPage('calendar')}/>
    </section>

    <section className="lux-grid-mid">
      <article className="lux-card"><div className="lux-card-head"><div><span>{en?'CAREER ACTIVITY':'ক্যারিয়ার কার্যক্রম'}</span><h3>{en?'5-year milestone activity':'৫ বছরের মাইলস্টোন কার্যক্রম'}</h3></div><Target/></div><CareerBars events={career.events} profile={p} lang={lang}/></article>
      <article className="lux-card"><div className="lux-card-head"><div><span>{en?'LEAVE INSIGHT':'ছুটি ইনসাইট'}</span><h3>{en?'Current-year leave usage':'চলতি বছরের ছুটি ব্যবহার'}</h3></div><CalendarDays/></div><LeaveDonut items={leave} lang={lang}/><button className="lux-wide-link" onClick={()=>onPage('leave')}>{en?'Open My Leave Record':'আমার ছুটির হিসাব খুলুন'}<ArrowRight/></button></article>
      <article className="lux-card"><div className="lux-card-head"><div><span>{en?'NEXT ACTIONS':'পরবর্তী করণীয়'}</span><h3>{en?'Career shortcuts':'ক্যারিয়ার শর্টকাট'}</h3></div><Sparkles/></div><div className="lux-action-list"><button onClick={()=>onPage('promotion')}><TrendingUp/><div><b>{en?'Promotion estimate':'পদোন্নতি হিসাব'}</b><small>{en?'Eligibility & roadmap':'যোগ্যতা ও রোডম্যাপ'}</small></div><ChevronRight/></button><button onClick={()=>onPage('salary')}><WalletCards/><div><b>{en?'Pay-scale calculator':'পে-স্কেল ক্যালকুলেটর'}</b><small>{en?'Verified salary calculation':'যাচাইকৃত বেতন হিসাব'}</small></div><ChevronRight/></button><button onClick={()=>onPage('calculators')}><Calculator/><div><b>{en?'Calculator center':'ক্যালকুলেটর সেন্টার'}</b><small>{en?'Service, age & dates':'চাকরিকাল, বয়স ও তারিখ'}</small></div><ChevronRight/></button></div></article>
    </section>

    <section className="lux-grid-bottom">
      <article className="lux-card lux-timeline"><div className="lux-card-head"><div><span>{en?'CAREER TIMELINE':'ক্যারিয়ার টাইমলাইন'}</span><h3>{en?'Recent milestones':'সাম্প্রতিক মাইলস্টোন'}</h3></div><button onClick={()=>onPage('career-roadmap')}>{en?'Roadmap':'রোডম্যাপ'}<ChevronRight/></button></div>{recentEvents.length?<div className="lux-timeline-list">{recentEvents.map(x=><div key={x.id}><i></i><div><small>{fmt(x.event_date,lang)}</small><b>{x.title}</b><span>{[x.post_name,x.grade?`${en?'Grade':'গ্রেড'} ${x.grade}`:'',x.office_name].filter(Boolean).join(' · ')}</span></div></div>)}</div>:<div className="lux-empty-chart"><History/><b>{en?'No career milestone saved yet':'এখনো ক্যারিয়ার মাইলস্টোন সংরক্ষিত নেই'}</b><span>{en?'Add records from My Career.':'আমার চাকরি থেকে রেকর্ড যোগ করুন।'}</span></div>}</article>
      <article className="lux-card lux-insight"><div className="lux-card-head"><div><span>{en?'PERSONAL SNAPSHOT':'ব্যক্তিগত স্ন্যাপশট'}</span><h3>{en?'Your workspace at a glance':'এক নজরে আপনার কর্মপরিসর'}</h3></div><Award/></div><div className="lux-insight-list"><span><GraduationCap/><div><small>{en?'Education records':'শিক্ষাগত রেকর্ড'}</small><b>{num(career.education?.length||0,lang)}</b></div></span><span><History/><div><small>{en?'Career events':'ক্যারিয়ার ইভেন্ট'}</small><b>{num(career.events?.length||0,lang)}</b></div></span><span><WalletCards/><div><small>{en?'Salary snapshots':'বেতন স্ন্যাপশট'}</small><b>{num(salary.length,lang)}</b></div></span><span><CalendarDays/><div><small>{en?'Leave days this year':'চলতি বছরে ছুটি'}</small><b>{num(leaveDays,lang,1)}</b></div></span></div><button className="lux-wide-link" onClick={()=>onPage('reports')}>{en?'Open Personal Report':'ব্যক্তিগত রিপোর্ট খুলুন'}<ArrowRight/></button></article>
    </section>

    <section className="lux-safety"><ShieldCheck/><div><b>{en?'Personal self-service workspace':'ব্যক্তিগত স্ব-সেবা কর্মপরিসর'}</b><p>{en?'Charts and summaries are generated only from your saved records. No fake or estimated activity is inserted when data is missing.':'চার্ট ও সারসংক্ষেপ শুধুমাত্র আপনার সংরক্ষিত রেকর্ড থেকে তৈরি হয়। তথ্য না থাকলে কোনো কৃত্রিম বা অনুমানভিত্তিক কার্যক্রম দেখানো হয় না।'}</p></div><button onClick={load}><RefreshCw/>{en?'Refresh':'রিফ্রেশ'}</button></section>
  </div>
}
