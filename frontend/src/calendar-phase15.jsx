import React,{useEffect,useMemo,useState} from 'react';
import {CalendarDays,Clock3,ShieldCheck,ArrowRight,Plus,Save,Trash2,Edit3,X,RefreshCw} from 'lucide-react';
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


export function AdminOfficeCalendarManager({lang='bn'}){
  const en=lang==='en';
  const currentFy=fiscalYearFromDate(new Date());
  const blank={fiscal_year:currentFy,holiday_date:'',title_bn:'',title_en:'',notes_bn:'',notes_en:'',source_url:'https://www.du.ac.bd/du_post_details/notice/27726',is_active:true};
  const [fy,setFy]=useState(currentFy),[items,setItems]=useState([]),[form,setForm]=useState(blank),
    [editing,setEditing]=useState(null),[busy,setBusy]=useState(false),[err,setErr]=useState(''),[msg,setMsg]=useState('');

  async function request(path,opts={}){
    const r=await fetch(API+path,{credentials:'include',headers:{'Content-Type':'application/json',...(opts.headers||{})},...opts});
    const d=await r.json().catch(()=>({}));
    if(!r.ok)throw new Error(d.error||'Request failed');
    return d;
  }
  async function load(targetFy=fy){
    setBusy(true);setErr('');
    try{
      const x=await request(`/api/admin/office-calendar?fy=${encodeURIComponent(targetFy)}`);
      setItems(x.holidays||[]);
    }catch(e){setErr(e.message)}finally{setBusy(false)}
  }
  useEffect(()=>{load(currentFy)},[]);

  function changeFy(v){
    setFy(v);
    setForm(x=>({...x,fiscal_year:v}));
    setEditing(null);setMsg('');
    load(v);
  }
  function edit(x){
    setEditing(x);
    setForm({
      fiscal_year:x.fiscal_year||fy,
      holiday_date:x.holiday_date||'',
      title_bn:x.title_bn||'',
      title_en:x.title_en||'',
      notes_bn:x.notes_bn||'',
      notes_en:x.notes_en||'',
      source_url:x.source_url||'https://www.du.ac.bd/du_post_details/notice/27726',
      is_active:!!x.is_active
    });
    window.scrollTo({top:0,behavior:'smooth'});
  }
  function cancel(){
    setEditing(null);setForm({...blank,fiscal_year:fy});setErr('');setMsg('');
  }
  async function save(e){
    e.preventDefault();setErr('');setMsg('');
    if(!form.holiday_date||!form.title_bn.trim())return setErr(en?'Holiday date and Bangla title are required.':'ছুটির তারিখ ও বাংলা শিরোনাম প্রয়োজন।');
    setBusy(true);
    try{
      const path=editing?`/api/admin/office-calendar/${editing.id}`:'/api/admin/office-calendar';
      await request(path,{method:editing?'PUT':'POST',body:JSON.stringify({...form,fiscal_year:fy})});
      setMsg(editing?(en?'Office holiday updated.':'অফিস ছুটি আপডেট হয়েছে.'):(en?'Office holiday added.':'অফিস ছুটি যোগ হয়েছে.'));
      setEditing(null);setForm({...blank,fiscal_year:fy});await load(fy);
    }catch(e){setErr(e.message)}finally{setBusy(false)}
  }
  async function remove(x){
    if(!confirm(en?`Delete "${x.title_en||x.title_bn}"?`:`"${x.title_bn}" মুছে ফেলবেন?`))return;
    setErr('');setMsg('');
    try{await request(`/api/admin/office-calendar/${x.id}`,{method:'DELETE'});setMsg(en?'Office holiday deleted.':'অফিস ছুটি মুছে ফেলা হয়েছে.');await load(fy)}
    catch(e){setErr(e.message)}
  }

  return <div className="admin-calendar-manager">
    <div className="acm-topbar">
      <div><span>{en?'OFFICE HOLIDAY MAINTENANCE':'অফিস ছুটি ব্যবস্থাপনা'}</span><h3>{en?'Fiscal Office Calendar':'অর্থবছরভিত্তিক অফিস ক্যালেন্ডার'}</h3><p>{en?'Only explicit office holidays are stored here. Friday and Saturday remain automatic weekly holidays.':'এখানে শুধু নির্দিষ্ট অফিস ছুটি সংরক্ষণ হবে। শুক্রবার ও শনিবার স্বয়ংক্রিয় সাপ্তাহিক ছুটি হিসেবেই থাকবে।'}</p></div>
      <div className="acm-fy"><label>{en?'Fiscal Year':'অর্থবছর'}<select value={fy} onChange={e=>changeFy(e.target.value)}><option value="2025-2026">2025-2026</option><option value="2026-2027">2026-2027</option><option value="2027-2028">2027-2028</option></select></label><button className="secondary" onClick={()=>load()} disabled={busy}><RefreshCw size={15}/>{en?'Refresh':'রিফ্রেশ'}</button></div>
    </div>

    {err&&<div className="fc-error">{err}</div>}{msg&&<div className="acm-success">{msg}</div>}

    <form className="acm-editor" onSubmit={save}>
      <div className="acm-editor-head"><div><b>{editing?(en?'Edit office holiday':'অফিস ছুটি সম্পাদনা'):(en?'Add office holiday':'অফিস ছুটি যোগ করুন')}</b><small>{en?'Do not add class-only holidays.':'শুধু ক্লাস ছুটি এখানে যোগ করবেন না।'}</small></div>{editing&&<button type="button" className="secondary" onClick={cancel}><X size={15}/>{en?'Cancel Edit':'সম্পাদনা বাতিল'}</button>}</div>
      <div className="form-grid">
        <label>{en?'Holiday date':'ছুটির তারিখ'}<input type="date" value={form.holiday_date} onChange={e=>setForm({...form,holiday_date:e.target.value})} required/></label>
        <label>{en?'Active':'সক্রিয়'}<select value={form.is_active?'1':'0'} onChange={e=>setForm({...form,is_active:e.target.value==='1'})}><option value="1">{en?'Yes':'হ্যাঁ'}</option><option value="0">{en?'No':'না'}</option></select></label>
        <label>{en?'Bangla title':'বাংলা শিরোনাম'}<input value={form.title_bn} onChange={e=>setForm({...form,title_bn:e.target.value})} required/></label>
        <label>{en?'English title':'ইংরেজি শিরোনাম'}<input value={form.title_en} onChange={e=>setForm({...form,title_en:e.target.value})}/></label>
        <label className="span-2">{en?'Bangla note':'বাংলা নোট'}<textarea rows="2" value={form.notes_bn} onChange={e=>setForm({...form,notes_bn:e.target.value})}/></label>
        <label className="span-2">{en?'English note':'ইংরেজি নোট'}<textarea rows="2" value={form.notes_en} onChange={e=>setForm({...form,notes_en:e.target.value})}/></label>
        <label className="span-2">{en?'Published source URL':'প্রকাশিত উৎসের URL'}<input type="url" value={form.source_url} onChange={e=>setForm({...form,source_url:e.target.value})}/></label>
        <div className="span-2"><button className="primary" disabled={busy}>{editing?<Edit3 size={16}/>:<Plus size={16}/>} {busy?(en?'Saving...':'সংরক্ষণ হচ্ছে...'):(editing?(en?'Update Holiday':'ছুটি আপডেট করুন'):(en?'Add Office Holiday':'অফিস ছুটি যোগ করুন'))}</button></div>
      </div>
    </form>

    <div className="acm-list-card">
      <div className="acm-list-head"><div><CalendarDays/><div><h3>{en?'Stored Office Holidays':'সংরক্ষিত অফিস ছুটি'}</h3><p>{en?`${items.length} record(s) for ${fy}`:`${items.length.toLocaleString('bn-BD')}টি রেকর্ড · ${fy}`}</p></div></div></div>
      {busy&&items.length===0?<div className="fc-loading">{en?'Loading...':'লোড হচ্ছে...'}</div>:items.length===0?<div className="acm-empty">{en?'No office holiday stored for this fiscal year.':'এই অর্থবছরে কোনো অফিস ছুটি সংরক্ষিত নেই।'}</div>:<div className="acm-list">
        {items.map(x=><article key={x.id} className={!x.is_active?'inactive':''}>
          <div className="acm-date"><CalendarDays/><div><b>{fmt(parseIso(x.holiday_date),lang)}</b><small>{x.holiday_date}</small></div></div>
          <div className="acm-title"><b>{en?(x.title_en||x.title_bn):x.title_bn}</b><small>{en?(x.title_bn||''):(x.title_en||'')}</small>{(x.notes_bn||x.notes_en)&&<p>{en?(x.notes_en||x.notes_bn):(x.notes_bn||x.notes_en)}</p>}</div>
          <span className={'acm-state '+(x.is_active?'active':'inactive')}>{x.is_active?(en?'Active':'সক্রিয়'):(en?'Inactive':'নিষ্ক্রিয়')}</span>
          <div className="acm-actions"><button type="button" onClick={()=>edit(x)} title={en?'Edit':'সম্পাদনা'}><Edit3 size={15}/></button><button type="button" className="danger" onClick={()=>remove(x)} title={en?'Delete':'মুছুন'}><Trash2 size={15}/></button></div>
        </article>)}
      </div>}
    </div>

    <div className="fc-disclaimer"><ShieldCheck/><p>{en?'System administrators maintain reference content only. This screen does not approve leave, employment, promotion or any official administrative decision.':'সিস্টেম ব্যবস্থাপক এখানে শুধু রেফারেন্স কনটেন্ট রক্ষণাবেক্ষণ করেন। এই স্ক্রিন ছুটি, চাকরি, পদোন্নতি বা কোনো অফিসিয়াল প্রশাসনিক সিদ্ধান্ত অনুমোদন করে না।'}</p></div>
  </div>
}
