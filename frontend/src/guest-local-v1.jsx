
import React,{useEffect,useState} from 'react';
import {UserRound,Briefcase,GraduationCap,Route,WalletCards,CalendarDays,FileText,ShieldCheck,Cloud,Download,Trash2,Plus,Save,ChevronRight,Clock3,Database,CheckCircle2} from 'lucide-react';
import './guest-local-v1.css';

const KEY='hisab_guest_workspace_v1';
const emptyData={
  profile:{name:'',category:'',grade:'',date_of_birth:'',gender:'',marital_status:'',first_joining_date:'',current_post:'',current_post_joining_date:'',third_class_start_date:'',fourth_class_start_date:'',previous_promotions:'0',retirement_age:'59',office_name:'',department_name:''},
  education:[],events:[],salary_history:[],leave:[],updated_at:''
};
function readData(){
  try{
    const x=JSON.parse(localStorage.getItem(KEY)||'null');
    return x&&typeof x==='object'?{...emptyData,...x,profile:{...emptyData.profile,...(x.profile||{})}}:{...emptyData};
  }catch{return {...emptyData}}
}
function writeData(data){
  const next={...data,updated_at:new Date().toISOString()};
  localStorage.setItem(KEY,JSON.stringify(next));
  return next;
}
const uid=()=>crypto.randomUUID?.()||String(Date.now())+'-'+Math.random().toString(36).slice(2);
const dateFmt=(v,lang='bn')=>{
  if(!v)return '—';
  const d=new Date(v+'T00:00:00');
  return Number.isNaN(d.getTime())?v:new Intl.DateTimeFormat(lang==='en'?'en-GB':'bn-BD',{day:'2-digit',month:'short',year:'numeric'}).format(d);
};
const num=(v,lang='bn',digits=0)=>Number(v||0).toLocaleString(lang==='en'?'en-US':'bn-BD',{maximumFractionDigits:digits});
function serviceDuration(a){
  if(!a)return null;
  const s=new Date(a+'T00:00:00'),e=new Date();
  if(Number.isNaN(s.getTime())||s>e)return null;
  let y=e.getFullYear()-s.getFullYear(),m=e.getMonth()-s.getMonth(),d=e.getDate()-s.getDate();
  if(d<0){m--;d+=new Date(e.getFullYear(),e.getMonth(),0).getDate()}
  if(m<0){y--;m+=12}
  return {y,m,d};
}
function inclusiveDays(a,b){
  if(!a||!b)return 0;
  const x=new Date(a+'T00:00:00'),y=new Date(b+'T00:00:00');
  if(Number.isNaN(x.getTime())||Number.isNaN(y.getTime())||y<x)return 0;
  return Math.floor((y-x)/86400000)+1;
}
function downloadData(data){
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json;charset=utf-8'});
  const url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download='hisab-sahayika-local-data-'+new Date().toISOString().slice(0,10)+'.json';
  document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
}

export default function GuestLocalCenter({mode='dashboard',lang='bn',onOpen,onLogin}){
  const en=lang==='en';
  const [data,setData]=useState(readData);
  const [tab,setTab]=useState(mode);
  const [saved,setSaved]=useState('');
  useEffect(()=>setTab(mode),[mode]);
  const commit=next=>{
    const x=writeData(next);setData(x);setSaved(en?'Saved on this device':'এই ডিভাইসে সংরক্ষিত');
    setTimeout(()=>setSaved(''),1400);
  };
  const p=data.profile||{};
  const service=serviceDuration(p.first_joining_date);
  const leaveDays=data.leave.reduce((a,x)=>a+Number(x.total_days||0),0);
  const latestSalary=data.salary_history[0]||null;
  const nav=[
    ['dashboard',UserRound,en?'Dashboard':'ড্যাশবোর্ড'],
    ['profile',Briefcase,en?'Profile':'চাকরি তথ্য'],
    ['education',GraduationCap,en?'Education':'শিক্ষা'],
    ['timeline',Route,en?'Timeline':'টাইমলাইন'],
    ['salary',WalletCards,en?'Salary':'বেতন ইতিহাস'],
    ['leave',CalendarDays,en?'Leave':'ছুটি'],
    ['reports',FileText,en?'Reports':'রিপোর্ট'],
    ['privacy',ShieldCheck,en?'Data':'ডাটা']
  ];
  return <div className="guest-local">
    <section className="guest-local-head">
      <div><small>LOCAL MODE</small><h2>{en?'My Workspace':'আমার তথ্য ও রেকর্ড'}</h2><p>{en?'No login required. Records remain on this device until you choose cloud sync.':'লগইন লাগবে না। Cloud Sync না করা পর্যন্ত তথ্য এই ডিভাইসেই থাকবে।'}</p></div>
      <span><Database/><b>{en?'On this device':'এই ডিভাইসে'}</b></span>
    </section>
    {saved&&<div className="guest-saved"><CheckCircle2/>{saved}</div>}
    <div className="guest-local-nav">{nav.map(([k,I,l])=><button key={k} className={tab===k?'active':''} onClick={()=>setTab(k)}><I/><span>{l}</span></button>)}</div>

    {tab==='dashboard'&&<Dashboard en={en} lang={lang} data={data} service={service} leaveDays={leaveDays} latestSalary={latestSalary} onTab={setTab} onOpen={onOpen} onLogin={onLogin}/>}
    {tab==='profile'&&<Profile en={en} data={data} commit={commit}/>}
    {tab==='education'&&<Education en={en} data={data} commit={commit}/>}
    {tab==='timeline'&&<Timeline en={en} lang={lang} data={data} commit={commit}/>}
    {tab==='salary'&&<Salary en={en} lang={lang} data={data} commit={commit}/>}
    {tab==='leave'&&<Leave en={en} lang={lang} data={data} commit={commit}/>}
    {tab==='reports'&&<Reports en={en} lang={lang} data={data} service={service} leaveDays={leaveDays} latestSalary={latestSalary}/>}
    {tab==='privacy'&&<Privacy en={en} data={data} onLogin={onLogin}/>}
  </div>;
}

function Dashboard({en,lang,data,service,leaveDays,latestSalary,onTab,onOpen,onLogin}){
  const p=data.profile||{};
  return <div className="guest-dashboard">
    <div className="guest-kpis">
      <article><Briefcase/><small>{en?'Current post':'বর্তমান পদ'}</small><b>{p.current_post||'—'}</b><span>{p.grade?(en?'Grade ':'গ্রেড ')+num(p.grade,lang):'—'}</span></article>
      <article><Clock3/><small>{en?'Service':'চাকরিকাল'}</small><b>{service?(en?num(service.y,lang)+'y '+num(service.m,lang)+'m':num(service.y,lang)+' বছর '+num(service.m,lang)+' মাস'):'—'}</b><span>{dateFmt(p.first_joining_date,lang)}</span></article>
      <article><WalletCards/><small>{en?'Latest saved net':'সর্বশেষ সংরক্ষিত নিট'}</small><b>{latestSalary?(en?'Tk ':'৳ ')+num(latestSalary.net,lang):'—'}</b><span>{num(data.salary_history.length,lang)} {en?'record(s)':'রেকর্ড'}</span></article>
      <article><CalendarDays/><small>{en?'Leave recorded':'রেকর্ডকৃত ছুটি'}</small><b>{num(leaveDays,lang,1)}</b><span>{en?'day(s)':'দিন'}</span></article>
    </div>
    <section className="guest-action-section"><h3>{en?'Quick actions':'দ্রুত কাজ'}</h3><div className="guest-action-grid">
      <button onClick={()=>onOpen?.('salary')}><WalletCards/><span>{en?'Salary':'বেতন হিসাব'}</span></button>
      <button onClick={()=>onOpen?.('promotion')}><Briefcase/><span>{en?'Promotion':'পদোন্নতি'}</span></button>
      <button onClick={()=>onOpen?.('points')}><Route/><span>{en?'Points':'পয়েন্ট'}</span></button>
      <button onClick={()=>onTab('leave')}><CalendarDays/><span>{en?'Leave':'ছুটি'}</span></button>
    </div></section>
    <button className="guest-sync-card" onClick={onLogin}><Cloud/><div><b>{en?'Backup & Sync — optional':'Backup & Sync — ঐচ্ছিক'}</b><span>{en?'Login only for cloud backup and multi-device use.':'শুধু Cloud backup ও একাধিক ডিভাইসে ব্যবহার করতে চাইলে লগইন করুন।'}</span></div><ChevronRight/></button>
  </div>;
}

function Profile({en,data,commit}){
  const [f,setF]=useState(data.profile||emptyData.profile);
  useEffect(()=>setF(data.profile||emptyData.profile),[data.profile]);
  return <form className="guest-card guest-form" onSubmit={e=>{e.preventDefault();commit({...data,profile:f})}}>
    <Title icon={Briefcase} title={en?'Career profile':'চাকরি প্রোফাইল'} sub={en?'Saved locally on this device.':'এই ডিভাইসে সংরক্ষিত হবে।'}/>
    <div className="guest-fields">
      <label>{en?'Name (optional)':'নাম (ঐচ্ছিক)'}<input value={f.name||''} onChange={e=>setF({...f,name:e.target.value})}/></label>
      <label>{en?'Category':'শ্রেণি'}<select value={f.category||''} onChange={e=>setF({...f,category:e.target.value})}><option value="">{en?'Select':'নির্বাচন করুন'}</option><option value="teacher">{en?'Teacher':'শিক্ষক'}</option><option value="officer">{en?'Officer':'কর্মকর্তা'}</option><option value="class3">{en?'Class III employee':'৩য় শ্রেণির কর্মচারী'}</option><option value="class4">{en?'Class IV employee':'৪র্থ শ্রেণির কর্মচারী'}</option></select></label>
      <label>{en?'Current grade':'বর্তমান গ্রেড'}<select value={f.grade||''} onChange={e=>setF({...f,grade:e.target.value})}><option value="">{en?'Select':'নির্বাচন করুন'}</option>{Array.from({length:20},(_,i)=>i+1).map(x=><option key={x} value={x}>{en?'Grade ':'গ্রেড '}{x}</option>)}</select></label>
      <label>{en?'Current post':'বর্তমান পদ'}<input value={f.current_post||''} onChange={e=>setF({...f,current_post:e.target.value})}/></label>
      <label>{en?'Date of birth':'জন্মতারিখ'}<input type="date" value={f.date_of_birth||''} onChange={e=>setF({...f,date_of_birth:e.target.value})}/></label>
      <label>{en?'Gender':'লিঙ্গ'}<select value={f.gender||''} onChange={e=>setF({...f,gender:e.target.value})}><option value="">{en?'Select':'নির্বাচন করুন'}</option><option value="male">{en?'Male':'পুরুষ'}</option><option value="female">{en?'Female':'নারী'}</option></select></label>
      <label>{en?'Marital status':'বৈবাহিক অবস্থা'}<select value={f.marital_status||''} onChange={e=>setF({...f,marital_status:e.target.value})}><option value="">{en?'Select':'নির্বাচন করুন'}</option><option value="married">{en?'Married':'বিবাহিত'}</option><option value="unmarried">{en?'Unmarried':'অবিবাহিত'}</option></select></label>
      <label>{en?'First joining date':'প্রথম যোগদানের তারিখ'}<input type="date" value={f.first_joining_date||''} onChange={e=>setF({...f,first_joining_date:e.target.value})}/></label>
      <label>{en?'Current post joining':'বর্তমান পদে যোগদান'}<input type="date" value={f.current_post_joining_date||''} onChange={e=>setF({...f,current_post_joining_date:e.target.value})}/></label>
      <label>{en?'Entered 3rd class':'৩য় শ্রেণিতে প্রবেশ'}<input type="date" value={f.third_class_start_date||''} onChange={e=>setF({...f,third_class_start_date:e.target.value})}/></label>
      <label>{en?'Entered 4th class':'৪র্থ শ্রেণিতে প্রবেশ'}<input type="date" value={f.fourth_class_start_date||''} onChange={e=>setF({...f,fourth_class_start_date:e.target.value})}/></label>
      <label>{en?'Previous promotions':'আগের পদোন্নতির সংখ্যা'}<input type="number" min="0" value={f.previous_promotions||0} onChange={e=>setF({...f,previous_promotions:e.target.value})}/></label>
      <label>{en?'Office / unit':'অফিস / ইউনিট'}<input value={f.office_name||''} onChange={e=>setF({...f,office_name:e.target.value})}/></label>
      <label>{en?'Department / branch':'বিভাগ / শাখা'}<input value={f.department_name||''} onChange={e=>setF({...f,department_name:e.target.value})}/></label>
      <label>{en?'Retirement age':'অবসরের বয়স'}<input type="number" min="40" max="75" value={f.retirement_age||59} onChange={e=>setF({...f,retirement_age:e.target.value})}/></label>
    </div><button className="guest-primary"><Save/>{en?'Save on this device':'এই ডিভাইসে সংরক্ষণ'}</button>
  </form>;
}

function Education({en,data,commit}){
  const [f,setF]=useState({level:'',institution:'',subject:'',passing_year:'',result:''});
  const add=e=>{e.preventDefault();if(!f.level)return;commit({...data,education:[{id:uid(),...f},...data.education]});setF({level:'',institution:'',subject:'',passing_year:'',result:''})};
  return <div className="guest-two-part"><form className="guest-card guest-form" onSubmit={add}><Title icon={GraduationCap} title={en?'Add education':'শিক্ষাগত যোগ্যতা যোগ করুন'}/><div className="guest-fields"><label>{en?'Level':'স্তর'}<input value={f.level} onChange={e=>setF({...f,level:e.target.value})}/></label><label>{en?'Institution':'প্রতিষ্ঠান'}<input value={f.institution} onChange={e=>setF({...f,institution:e.target.value})}/></label><label>{en?'Subject':'বিষয়'}<input value={f.subject} onChange={e=>setF({...f,subject:e.target.value})}/></label><label>{en?'Passing year':'পাসের বছর'}<input inputMode="numeric" value={f.passing_year} onChange={e=>setF({...f,passing_year:e.target.value})}/></label><label>{en?'Result':'ফলাফল'}<input value={f.result} onChange={e=>setF({...f,result:e.target.value})}/></label></div><button className="guest-primary"><Plus/>{en?'Add':'যোগ করুন'}</button></form><List items={data.education} empty={en?'No education saved yet.':'এখনও কোনো শিক্ষাগত তথ্য নেই।'} remove={id=>commit({...data,education:data.education.filter(x=>x.id!==id)})} render={x=><div><b>{x.level}</b><span>{[x.subject,x.institution,x.passing_year,x.result].filter(Boolean).join(' · ')}</span></div>}/></div>;
}

function Timeline({en,lang,data,commit}){
  const [f,setF]=useState({event_date:'',type:'promotion',title:'',post_name:'',grade:'',office_name:''});
  const add=e=>{e.preventDefault();if(!f.event_date||!f.title)return;commit({...data,events:[{id:uid(),...f},...data.events].sort((a,b)=>String(b.event_date).localeCompare(String(a.event_date))) });setF({event_date:'',type:'promotion',title:'',post_name:'',grade:'',office_name:''})};
  return <div className="guest-two-part"><form className="guest-card guest-form" onSubmit={add}><Title icon={Route} title={en?'Add career event':'ক্যারিয়ার ইভেন্ট যোগ করুন'}/><div className="guest-fields"><label>{en?'Date':'তারিখ'}<input type="date" value={f.event_date} onChange={e=>setF({...f,event_date:e.target.value})}/></label><label>{en?'Type':'ধরন'}<select value={f.type} onChange={e=>setF({...f,type:e.target.value})}><option value="appointment">{en?'Appointment':'যোগদান'}</option><option value="promotion">{en?'Promotion':'পদোন্নতি'}</option><option value="transfer">{en?'Transfer / posting':'বদলি / পোস্টিং'}</option><option value="increment">{en?'Increment':'ইনক্রিমেন্ট'}</option><option value="training">{en?'Training':'প্রশিক্ষণ'}</option><option value="other">{en?'Other':'অন্যান্য'}</option></select></label><label>{en?'Title':'শিরোনাম'}<input value={f.title} onChange={e=>setF({...f,title:e.target.value})}/></label><label>{en?'Post':'পদ'}<input value={f.post_name} onChange={e=>setF({...f,post_name:e.target.value})}/></label><label>{en?'Grade':'গ্রেড'}<input inputMode="numeric" value={f.grade} onChange={e=>setF({...f,grade:e.target.value})}/></label><label>{en?'Office':'অফিস'}<input value={f.office_name} onChange={e=>setF({...f,office_name:e.target.value})}/></label></div><button className="guest-primary"><Plus/>{en?'Add event':'ইভেন্ট যোগ করুন'}</button></form><List items={data.events} empty={en?'No career event saved yet.':'এখনও কোনো ক্যারিয়ার ইভেন্ট নেই।'} remove={id=>commit({...data,events:data.events.filter(x=>x.id!==id)})} render={x=><div><b>{dateFmt(x.event_date,lang)} · {x.title}</b><span>{[x.post_name,x.grade?(en?'Grade ':'গ্রেড ')+x.grade:'',x.office_name].filter(Boolean).join(' · ')}</span></div>}/></div>;
}

function Salary({en,lang,data,commit}){
  const [f,setF]=useState({effective_date:'',grade:'',basic:'',gross:'',deductions:'',net:'',note:''});
  const add=e=>{e.preventDefault();if(!f.effective_date)return;commit({...data,salary_history:[{id:uid(),...f},...data.salary_history].sort((a,b)=>String(b.effective_date).localeCompare(String(a.effective_date))) });setF({effective_date:'',grade:'',basic:'',gross:'',deductions:'',net:'',note:''})};
  return <div className="guest-two-part"><form className="guest-card guest-form" onSubmit={add}><Title icon={WalletCards} title={en?'Save salary snapshot':'বেতন স্ন্যাপশট সংরক্ষণ'} sub={en?'Works without login.':'লগইন ছাড়াই কাজ করবে।'}/><div className="guest-fields"><label>{en?'Effective date':'কার্যকর তারিখ'}<input type="date" value={f.effective_date} onChange={e=>setF({...f,effective_date:e.target.value})}/></label><label>{en?'Grade':'গ্রেড'}<input inputMode="numeric" value={f.grade} onChange={e=>setF({...f,grade:e.target.value})}/></label>{[['basic',en?'Basic':'মূল বেতন'],['gross',en?'Gross':'মোট'],['deductions',en?'Deductions':'কর্তন'],['net',en?'Net':'নিট']].map(([k,l])=><label key={k}>{l}<input type="number" inputMode="decimal" min="0" value={f[k]} onChange={e=>setF({...f,[k]:e.target.value})}/></label>)}</div><button className="guest-primary"><Save/>{en?'Save':'সংরক্ষণ'}</button></form><List items={data.salary_history} empty={en?'No salary snapshot saved yet.':'এখনও কোনো বেতন স্ন্যাপশট নেই।'} remove={id=>commit({...data,salary_history:data.salary_history.filter(x=>x.id!==id)})} render={x=><div><b>{dateFmt(x.effective_date,lang)} · {en?'Net ':'নিট ৳'}{num(x.net,lang)}</b><span>{en?'Basic ':'মূল '}{num(x.basic,lang)} · {en?'Gross ':'মোট '}{num(x.gross,lang)}</span></div>}/></div>;
}

function Leave({en,lang,data,commit}){
  const [f,setF]=useState({type:'casual',start_date:'',end_date:'',note:''});
  const names=en?{casual:'Casual',earned:'Earned',medical:'Medical',maternity:'Maternity',paternity:'Paternity',study:'Study',special:'Special',other:'Other'}:{casual:'নৈমিত্তিক',earned:'অর্জিত',medical:'চিকিৎসা',maternity:'মাতৃত্বকালীন',paternity:'পিতৃত্বকালীন',study:'শিক্ষা',special:'বিশেষ',other:'অন্যান্য'};
  const add=e=>{e.preventDefault();const total=inclusiveDays(f.start_date,f.end_date);if(!total)return;commit({...data,leave:[{id:uid(),...f,total_days:total},...data.leave].sort((a,b)=>String(b.start_date).localeCompare(String(a.start_date))) });setF({type:'casual',start_date:'',end_date:'',note:''})};
  return <div className="guest-two-part"><form className="guest-card guest-form" onSubmit={add}><Title icon={CalendarDays} title={en?'Add leave record':'ছুটির রেকর্ড যোগ করুন'}/><div className="guest-fields"><label>{en?'Leave type':'ছুটির ধরন'}<select value={f.type} onChange={e=>setF({...f,type:e.target.value})}>{Object.entries(names).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select></label><label>{en?'Start':'শুরু'}<input type="date" value={f.start_date} onChange={e=>setF({...f,start_date:e.target.value})}/></label><label>{en?'End':'শেষ'}<input type="date" value={f.end_date} onChange={e=>setF({...f,end_date:e.target.value})}/></label><label>{en?'Note':'নোট'}<input value={f.note} onChange={e=>setF({...f,note:e.target.value})}/></label></div><button className="guest-primary"><Plus/>{en?'Add':'যোগ করুন'}</button></form><List items={data.leave} empty={en?'No leave record saved yet.':'এখনও কোনো ছুটির রেকর্ড নেই।'} remove={id=>commit({...data,leave:data.leave.filter(x=>x.id!==id)})} render={x=><div><b>{names[x.type]||x.type} · {num(x.total_days,lang,1)} {en?'day(s)':'দিন'}</b><span>{dateFmt(x.start_date,lang)} — {dateFmt(x.end_date,lang)}</span></div>}/></div>;
}

function Reports({en,lang,data,service,leaveDays,latestSalary}){
  const p=data.profile||{};
  return <div className="guest-card guest-report"><Title icon={FileText} title={en?'Local personal summary':'Local ব্যক্তিগত সারসংক্ষেপ'} sub={en?'Created from records on this device.':'এই ডিভাইসের তথ্য থেকে তৈরি।'}/><div className="guest-report-kpis"><span><small>{en?'Post':'পদ'}</small><b>{p.current_post||'—'}</b></span><span><small>{en?'Grade':'গ্রেড'}</small><b>{p.grade||'—'}</b></span><span><small>{en?'Career events':'ক্যারিয়ার ইভেন্ট'}</small><b>{num(data.events.length,lang)}</b></span><span><small>{en?'Education':'শিক্ষা রেকর্ড'}</small><b>{num(data.education.length,lang)}</b></span><span><small>{en?'Salary records':'বেতন রেকর্ড'}</small><b>{num(data.salary_history.length,lang)}</b></span><span><small>{en?'Leave days':'ছুটির দিন'}</small><b>{num(leaveDays,lang,1)}</b></span></div><div className="guest-report-actions"><button onClick={()=>window.print()}><FileText/>{en?'Print / PDF':'প্রিন্ট / PDF'}</button><button onClick={()=>downloadData(data)}><Download/>JSON</button></div><div className="guest-disclaimer"><ShieldCheck/>{en?'Personal reference only; not an official record or order.':'শুধু ব্যক্তিগত রেফারেন্স; কোনো অফিসিয়াল রেকর্ড বা আদেশ নয়।'}</div></div>;
}

function Privacy({en,data,onLogin}){
  const clear=()=>{if(!confirm(en?'Delete all local personal records?':'সব Local ব্যক্তিগত রেকর্ড মুছে ফেলবেন?'))return;localStorage.removeItem(KEY);location.reload()};
  return <div className="guest-privacy-grid"><article><Download/><h3>{en?'Download local data':'Local ডাটা ডাউনলোড'}</h3><p>{en?'Export this device data as JSON.':'এই ডিভাইসের তথ্য JSON হিসেবে নিন।'}</p><button onClick={()=>downloadData(data)}><Download/>Export</button></article><article><Cloud/><h3>Backup & Sync</h3><p>{en?'Optional login for cloud backup and multiple devices.':'Cloud backup ও একাধিক ডিভাইসের জন্য ঐচ্ছিক login।'}</p><button onClick={onLogin}><Cloud/>Login & Sync</button></article><article><Trash2/><h3>{en?'Clear local records':'Local রেকর্ড মুছুন'}</h3><p>{en?'Deletes only records on this device.':'শুধু এই ডিভাইসের রেকর্ড মুছবে।'}</p><button className="danger" onClick={clear}><Trash2/>{en?'Clear':'মুছুন'}</button></article></div>;
}

function Title({icon:Icon,title,sub}){
  return <div className="guest-card-title"><Icon/><div><h3>{title}</h3>{sub&&<p>{sub}</p>}</div></div>;
}
function List({items,empty,remove,render}){
  return <section className="guest-record-list">{!items?.length?<div className="guest-empty">{empty}</div>:items.map(x=><article key={x.id}>{render(x)}<button onClick={()=>remove(x.id)}><Trash2/></button></article>)}</section>;
}
