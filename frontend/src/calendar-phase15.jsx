import React,{useEffect,useMemo,useState} from 'react';
import {CalendarDays,Clock3,ShieldCheck,ArrowRight} from 'lucide-react';
import './calendar-phase15.css';

const API=import.meta.env.VITE_API_URL||import.meta.env.VITE_API_BASE||'';
const BN=['জানুয়ারি','ফেব্রুয়ারি','মার্চ','এপ্রিল','মে','জুন','জুলাই','আগস্ট','সেপ্টেম্বর','অক্টোবর','নভেম্বর','ডিসেম্বর'];
const EN=['January','February','March','April','May','June','July','August','September','October','November','December'];
const DBN=['রবি','সোম','মঙ্গল','বুধ','বৃহ','শুক্র','শনি'];
const DEN=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

const iso=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const parseIso=s=>new Date(`${s}T00:00:00`);
const sameDay=(a,b)=>iso(a)===iso(b);
const addDays=(d,n)=>{const x=new Date(d);x.setDate(x.getDate()+n);return x};
const fmt=(d,lang='bn')=>new Intl.DateTimeFormat(lang==='en'?'en-GB':'bn-BD',{day:'2-digit',month:'long',year:'numeric'}).format(d);

export function fiscalYearFromDate(d=new Date()){
  const y=d.getFullYear();
  return d.getMonth()>=6?`${y}-${y+1}`:`${y-1}-${y}`;
}
function fyBounds(fy){
  const [a,b]=String(fy).split('-').map(Number);
  return {start:new Date(a,6,1),end:new Date(b,5,30)};
}
function holidayMap(data){return Object.fromEntries((data?.holidays||[]).map(x=>[x.holiday_date,x]))}
function dayStatus(d,hm,en){
  const h=hm[iso(d)];
  if(h)return {type:'holiday',label:en?(h.title_en||h.title_bn):h.title_bn};
  if(d.getDay()===5)return {type:'weekend',label:en?'Weekly Holiday — Friday':'সাপ্তাহিক ছুটি — শুক্রবার'};
  if(d.getDay()===6)return {type:'weekend',label:en?'Weekly Holiday — Saturday':'সাপ্তাহিক ছুটি — শনিবার'};
  return {type:'open',label:en?'Office Open':'অফিস খোলা'};
}
function useCalendarData(){
  const [data,setData]=useState(null),[err,setErr]=useState(''),[loading,setLoading]=useState(true);
  const fy=fiscalYearFromDate(new Date());
  useEffect(()=>{
    let alive=true;
    fetch(`${API}/api/public/office-calendar?fy=${encodeURIComponent(fy)}`,{credentials:'include'})
      .then(async r=>{const x=await r.json();if(!r.ok||x.error)throw new Error(x.error||'Calendar request failed');return x})
      .then(x=>{if(alive)setData(x)})
      .catch(e=>{if(alive)setErr(e.message)})
      .finally(()=>{if(alive)setLoading(false)});
    return()=>{alive=false};
  },[fy]);
  return {data,err,loading,fy};
}
function CalendarSummary({data,lang='bn'}){
  const en=lang==='en',today=new Date(),hm=useMemo(()=>holidayMap(data),[data]);
  const current=dayStatus(today,hm,en);
  const startWeek=addDays(today,-today.getDay()),endWeek=addDays(startWeek,6);
  const monthH=(data?.holidays||[]).filter(x=>{const d=parseIso(x.holiday_date);return d.getFullYear()===today.getFullYear()&&d.getMonth()===today.getMonth()});
  const weekH=(data?.holidays||[]).filter(x=>{const d=parseIso(x.holiday_date);return d>=startWeek&&d<=endWeek});
  const next=(data?.holidays||[]).map(x=>({...x,d:parseIso(x.holiday_date)})).filter(x=>x.d>=new Date(today.getFullYear(),today.getMonth(),today.getDate())).sort((a,b)=>a.d-b.d)[0];
  return <div className="fc-summary-grid">
    <article><CalendarDays/><div><small>{en?'Today':'আজ'}</small><b>{fmt(today,lang)}</b><span className={'fc-status '+current.type}>{current.label}</span></div></article>
    <article><Clock3/><div><small>{en?'This Week':'এই সপ্তাহ'}</small><b>{en?`${weekH.length} listed office holiday(s)`:`${weekH.length.toLocaleString('bn-BD')}টি তালিকাভুক্ত অফিস ছুটি`}</b><span>{fmt(startWeek,lang)} — {fmt(endWeek,lang)}</span></div></article>
    <article><CalendarDays/><div><small>{en?'This Month':'এই মাস'}</small><b>{en?`${monthH.length} listed office holiday(s)`:`${monthH.length.toLocaleString('bn-BD')}টি তালিকাভুক্ত অফিস ছুটি`}</b><span>{en?EN[today.getMonth()]:BN[today.getMonth()]}</span></div></article>
    <article><ArrowRight/><div><small>{en?'Next Office Holiday':'পরবর্তী অফিস ছুটি'}</small><b>{next?(en?(next.title_en||next.title_bn):next.title_bn):(en?'No listed holiday ahead':'সামনে তালিকাভুক্ত ছুটি নেই')}</b><span>{next?fmt(next.d,lang):'—'}</span></div></article>
  </div>
}
function MonthCalendar({data,lang='bn'}){
  const en=lang==='en',today=new Date(),fy=data?.fiscal_year||fiscalYearFromDate(today),bounds=fyBounds(fy);
  const initial=today<bounds.start?bounds.start:today>bounds.end?bounds.end:today;
  const [cursor,setCursor]=useState(new Date(initial.getFullYear(),initial.getMonth(),1));
  useEffect(()=>setCursor(new Date(initial.getFullYear(),initial.getMonth(),1)),[fy]);
  const hm=useMemo(()=>holidayMap(data),[data]);
  const first=new Date(cursor.getFullYear(),cursor.getMonth(),1),last=new Date(cursor.getFullYear(),cursor.getMonth()+1,0),cells=[];
  for(let i=0;i<first.getDay();i++)cells.push(null);
  for(let d=1;d<=last.getDate();d++)cells.push(new Date(cursor.getFullYear(),cursor.getMonth(),d));
  const prev=new Date(cursor.getFullYear(),cursor.getMonth()-1,1),next=new Date(cursor.getFullYear(),cursor.getMonth()+1,1);
  const canPrev=prev>=new Date(bounds.start.getFullYear(),bounds.start.getMonth(),1);
  const canNext=next<=new Date(bounds.end.getFullYear(),bounds.end.getMonth(),1);
  return <>
    <div className="fc-toolbar">
      <button disabled={!canPrev} onClick={()=>canPrev&&setCursor(prev)} aria-label={en?'Previous month':'আগের মাস'}>‹</button>
      <b>{en?EN[cursor.getMonth()]:BN[cursor.getMonth()]} {cursor.getFullYear().toLocaleString(en?'en-US':'bn-BD',{useGrouping:false})}</b>
      <button disabled={!canNext} onClick={()=>canNext&&setCursor(next)} aria-label={en?'Next month':'পরের মাস'}>›</button>
    </div>
    <div className="fc-week">{(en?DEN:DBN).map(x=><b key={x}>{x}</b>)}</div>
    <div className="fc-grid">{cells.map((d,i)=>{
      if(!d)return <div className="fc-empty" key={'e'+i}/>;
      const st=dayStatus(d,hm,en);
      return <div key={iso(d)} className={'fc-day '+st.type+(sameDay(d,today)?' today':'')} title={st.label}>
        <strong>{d.getDate().toLocaleString(en?'en-US':'bn-BD')}</strong><small>{st.label}</small>
      </div>;
    })}</div>
  </>;
}
function CalendarCore({lang='bn',loggedIn=false}){
  const en=lang==='en',{data,err,loading,fy}=useCalendarData();
  return <section className={'fiscal-calendar '+(loggedIn?'fc-logged':'')} id="office-calendar">
    <div className="fc-head">
      <span>{en?'FISCAL-YEAR OFFICE CALENDAR':'অর্থবছরভিত্তিক অফিস ক্যালেন্ডার'}</span>
      <h2>{loggedIn?(en?'My Office Calendar':'আমার অফিস ক্যালেন্ডার'):(en?'Office Open / Holiday Calendar':'অফিস খোলা / ছুটির ক্যালেন্ডার')}</h2>
      <p>{en?`Fiscal year ${fy}: Friday, Saturday and listed office holidays are closed; all other days are Office Open.`:`অর্থবছর ${fy}: শুক্রবার, শনিবার ও তালিকাভুক্ত অফিস ছুটি বন্ধ; অন্য সব দিন অফিস খোলা।`}</p>
    </div>
    {loading&&<div className="fc-loading">{en?'Loading calendar...':'ক্যালেন্ডার লোড হচ্ছে...'}</div>}
    {err&&<div className="fc-error">{err}</div>}
    {data&&<>
      <CalendarSummary data={data} lang={lang}/>
      <MonthCalendar data={data} lang={lang}/>
      <div className="fc-legend"><span><i className="open"/> {en?'Office Open':'অফিস খোলা'}</span><span><i className="weekend"/> {en?'Friday / Saturday weekly holiday':'শুক্রবার / শনিবার সাপ্তাহিক ছুটি'}</span><span><i className="holiday"/> {en?'Listed Office Holiday':'তালিকাভুক্ত অফিস ছুটি'}</span></div>
      <div className="fc-source"><div><b>{en?'Reference source':'রেফারেন্স উৎস'}</b><p>{en?'Published holiday list used only as an independent/unofficial reference.':'প্রকাশিত ছুটির তালিকা শুধু স্বাধীন/অনানুষ্ঠানিক রেফারেন্স হিসেবে ব্যবহৃত।'}</p></div><a href={data.source_url||'https://www.du.ac.bd/du_post_details/notice/27726'} target="_blank" rel="noreferrer">{en?'View published source':'প্রকাশিত উৎস দেখুন'} <ArrowRight size={15}/></a></div>
      <div className="fc-disclaimer"><ShieldCheck/><p>{en?'This calendar is a reference aid. Official office-opening or closure decisions remain subject to the competent authority and any later published order.':'এই ক্যালেন্ডার একটি রেফারেন্স সহায়িকা। অফিস খোলা/বন্ধের চূড়ান্ত সিদ্ধান্ত সংশ্লিষ্ট কর্তৃপক্ষ এবং পরবর্তীতে প্রকাশিত আদেশের অধীন।'}</p></div>
    </>}
  </section>
}
export default function FiscalOfficeCalendar({lang='bn'}){return <CalendarCore lang={lang}/>}
export function LoggedInOfficeCalendar({lang='bn'}){return <div className="logged-calendar-page"><CalendarCore lang={lang} loggedIn/></div>}
export function CalendarDashboardWidget({lang='bn',onOpen}){
  const en=lang==='en',today=new Date(),{data,err,loading,fy}=useCalendarData(),hm=useMemo(()=>holidayMap(data),[data]);
  const st=dayStatus(today,hm,en);
  const next=(data?.holidays||[]).map(x=>({...x,d:parseIso(x.holiday_date)})).filter(x=>x.d>=new Date(today.getFullYear(),today.getMonth(),today.getDate())).sort((a,b)=>a.d-b.d)[0];
  return <section className="calendar-dashboard-widget"><div className="cdw-icon"><CalendarDays/></div><div className="cdw-main"><small>{en?'OFFICE CALENDAR':'অফিস ক্যালেন্ডার'}</small><h3>{loading?(en?'Checking today...':'আজকের অবস্থা দেখা হচ্ছে...'):st.label}</h3><p>{err?err:(next?(en?`Next office holiday: ${next.title_en||next.title_bn} · ${fmt(next.d,lang)}`:`পরবর্তী অফিস ছুটি: ${next.title_bn} · ${fmt(next.d,lang)}`):(en?'No listed office holiday ahead in this fiscal year.':'এই অর্থবছরে সামনে তালিকাভুক্ত অফিস ছুটি নেই।'))}</p></div><div className="cdw-side"><span>{en?'Fiscal Year':'অর্থবছর'} {fy}</span>{onOpen&&<button onClick={onOpen}>{en?'Open Calendar':'ক্যালেন্ডার খুলুন'}<ArrowRight size={15}/></button>}</div></section>
}
