
import React,{useEffect,useState} from 'react';
import {UserRound,Briefcase,GraduationCap,Route,WalletCards,CalendarDays,FileText,ShieldCheck,Cloud,Download,Upload,Trash2,Plus,Save,ChevronRight,Clock3,Database,CheckCircle2,AlertTriangle,Pencil,X} from 'lucide-react';
import './guest-local-v1.css';

const KEY='hisab_guest_workspace_v1';
const emptyData={
  profile:{name:'',category:'',employee_category:'',grade:'',date_of_birth:'',mobile:'',gender:'',marital_status:'',first_joining_date:'',current_post:'',current_post_joining_date:'',third_class_start_date:'',fourth_class_start_date:'',previous_promotions:'0',retirement_age:'',office_name:'',department_name:'',current_basic_salary:'',salary_effective_date:'',employment_type:'',employee_reference:''},
  education:[],events:[],salary_history:[],leave:[],leave_entitlements:{},updated_at:''
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
const HISTORY_KEY='hisab_calculation_history_v1';
const PDF_KEY='hisab_pdf_center_v1';
const BACKUP_FORMAT='hisab-sahayika-backup';
const BACKUP_VERSION=2;
const MAX_BACKUP_BYTES=12*1024*1024;

function plainObject(v){return !!v&&typeof v==='object'&&!Array.isArray(v)}
function safeRows(v,max=2500){return Array.isArray(v)?v.filter(plainObject).slice(0,max).map(x=>({...x})):[]}
function normalizeLocalLeaveEntitlements(raw={}){
  const allowed=['casual','earned','medical','maternity','paternity','study','special','other'],out={};
  for(const [year,value] of Object.entries(plainObject(raw)?raw:{})){
    if(!/^\d{4}$/.test(year)||!plainObject(value))continue;
    const entitlements={};
    for(const type of allowed){
      const v=value.entitlements?.[type];
      if(v===''||v===null||v===undefined)continue;
      const n=Number(v);if(Number.isFinite(n)&&n>=0&&n<=366)entitlements[type]=Math.round(n*100)/100;
    }
    out[year]={entitlements,source_note:String(value.source_note||'').slice(0,500)};
  }
  return out;
}
function normalizeWorkspace(raw={}){
  const source=plainObject(raw)?raw:{};
  const profileSource=plainObject(source.profile)?source.profile:{};
  const profile={...emptyData.profile};
  for(const key of Object.keys(profile)){
    const v=profileSource[key];
    if(['string','number','boolean'].includes(typeof v))profile[key]=v;
  }
  return {
    ...emptyData,
    profile,
    education:safeRows(source.education),
    events:safeRows(source.events),
    salary_history:safeRows(source.salary_history),
    leave:safeRows(source.leave),
    leave_entitlements:normalizeLocalLeaveEntitlements(source.leave_entitlements),
    updated_at:typeof source.updated_at==='string'?source.updated_at:''
  };
}
function readLocalRows(key,max){
  try{return safeRows(JSON.parse(localStorage.getItem(key)||'[]'),max)}catch{return []}
}
function fullBackupPayload(data){
  return {
    format:BACKUP_FORMAT,
    version:BACKUP_VERSION,
    app:'Hisab Sahayika',
    exported_at:new Date().toISOString(),
    data:{
      workspace:normalizeWorkspace(data),
      calculation_history:readLocalRows(HISTORY_KEY,80),
      pdf_center:readLocalRows(PDF_KEY,16)
    }
  };
}
function downloadData(data){
  const payload=fullBackupPayload(data);
  const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json;charset=utf-8'});
  const url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download='hisab-sahayika-backup-'+new Date().toISOString().slice(0,10)+'.json';
  document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
}
function parseBackup(raw){
  if(!plainObject(raw))throw new Error('Invalid backup file');
  if(raw.format===BACKUP_FORMAT&&plainObject(raw.data)&&plainObject(raw.data.workspace)){
    return {
      legacy:false,
      version:Number(raw.version||1),
      exported_at:String(raw.exported_at||''),
      workspace:normalizeWorkspace(raw.data.workspace),
      hasHistory:Object.prototype.hasOwnProperty.call(raw.data,'calculation_history'),
      calculation_history:safeRows(raw.data.calculation_history,80),
      hasPdf:Object.prototype.hasOwnProperty.call(raw.data,'pdf_center'),
      pdf_center:safeRows(raw.data.pdf_center,16)
    };
  }
  if(plainObject(raw.profile)||Array.isArray(raw.education)||Array.isArray(raw.events)||Array.isArray(raw.salary_history)||Array.isArray(raw.leave)){
    return {legacy:true,version:1,exported_at:String(raw.updated_at||''),workspace:normalizeWorkspace(raw),hasHistory:false,calculation_history:[],hasPdf:false,pdf_center:[]};
  }
  throw new Error('This JSON file is not a supported Hisab Sahayika backup.');
}
function meaningful(v){return !(v===undefined||v===null||v==='')}
function mergeProfile(current={},incoming={}){
  const next={...emptyData.profile,...current};
  for(const key of Object.keys(emptyData.profile))if(meaningful(incoming[key]))next[key]=incoming[key];
  return next;
}
function rowIdentity(x,index,prefix){
  if(x?.id!==undefined&&x?.id!==null&&String(x.id)!=='')return 'id:'+String(x.id);
  if(x?.fingerprint)return 'fp:'+String(x.fingerprint);
  const core=[x?.effective_date,x?.event_date,x?.start_date,x?.title,x?.level,x?.type,x?.leave_type,x?.updated_at].filter(Boolean).join('|');
  return core?'core:'+core:prefix+':'+index+':'+JSON.stringify(x);
}
function mergeRows(current,incoming,max=2500,prefix='row'){
  const map=new Map();
  safeRows(current,max).forEach((x,i)=>map.set(rowIdentity(x,i,prefix),x));
  safeRows(incoming,max).forEach((x,i)=>map.set(rowIdentity(x,i,prefix),{...(map.get(rowIdentity(x,i,prefix))||{}),...x}));
  return Array.from(map.values()).slice(0,max);
}
function mergeWorkspace(current,incoming){
  return {
    ...emptyData,
    ...current,
    ...incoming,
    profile:mergeProfile(current?.profile,incoming?.profile),
    education:mergeRows(current?.education,incoming?.education,2500,'edu'),
    events:mergeRows(current?.events,incoming?.events,2500,'event').sort((a,b)=>String(b.event_date||'').localeCompare(String(a.event_date||''))),
    salary_history:mergeRows(current?.salary_history,incoming?.salary_history,2500,'salary').sort((a,b)=>String(b.effective_date||'').localeCompare(String(a.effective_date||''))),
    leave:mergeRows(current?.leave,incoming?.leave,2500,'leave').sort((a,b)=>String(b.start_date||'').localeCompare(String(a.start_date||''))),
    leave_entitlements:{...normalizeLocalLeaveEntitlements(current?.leave_entitlements),...normalizeLocalLeaveEntitlements(incoming?.leave_entitlements)},
    updated_at:new Date().toISOString()
  };
}
function profileFilledCount(profile={}){
  return Object.values(profile||{}).filter(meaningful).length;
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
    {tab==='reports'&&<Reports en={en} lang={lang} data={data} service={service} leaveDays={leaveDays} latestSalary={latestSalary} onOpen={onOpen}/>}
    {tab==='privacy'&&<Privacy en={en} data={data} onLogin={onLogin} onRestore={next=>{setData(next);setSaved(en?'Backup restored on this device':'ব্যাকআপ এই ডিভাইসে রিস্টোর হয়েছে');setTimeout(()=>setSaved(''),2200)}}/>}
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
    <button className="guest-sync-card" onClick={onLogin}><Cloud/><div><b>{en?'Backup & Sync — optional':'Backup & Sync — ঐচ্ছিক'}</b><span>{en?'Login only for Cloud Backup, Sync, Recovery and multi-device use.':'শুধু Cloud Backup, Sync, Recovery ও একাধিক ডিভাইসে ব্যবহার করতে চাইলে লগইন করুন।'}</span></div><ChevronRight/></button>
  </div>;
}

function Profile({en,data,commit}){
  const [f,setF]=useState(data.profile||emptyData.profile);
  useEffect(()=>setF(data.profile||emptyData.profile),[data.profile]);
  const setDetailedCategory=value=>{
    const broad=value==='teacher'?'teacher':value==='officer'?'officer':value.startsWith('third_')?'class3':value.startsWith('fourth_')?'class4':f.category||'';
    setF({...f,employee_category:value,category:broad});
  };
  return <form className="guest-card guest-form" onSubmit={e=>{e.preventDefault();commit({...data,profile:f})}}>
    <Title icon={Briefcase} title={en?'Career profile':'চাকরি প্রোফাইল'} sub={en?'Saved locally on this device.':'এই ডিভাইসে সংরক্ষিত হবে।'}/>
    <div className="guest-fields">
      <label>{en?'Name (optional)':'নাম (ঐচ্ছিক)'}<input value={f.name||''} onChange={e=>setF({...f,name:e.target.value})}/></label>
      <label>{en?'Payroll category':'পে-রোল শ্রেণি'}<select value={f.category||''} onChange={e=>setF({...f,category:e.target.value})}><option value="">{en?'Select':'নির্বাচন করুন'}</option><option value="teacher">{en?'Teacher':'শিক্ষক'}</option><option value="officer">{en?'Officer':'কর্মকর্তা'}</option><option value="class3">{en?'Class III employee':'৩য় শ্রেণির কর্মচারী'}</option><option value="class4">{en?'Class IV employee':'৪র্থ শ্রেণির কর্মচারী'}</option></select></label>
      <label>{en?'Detailed employee category':'বিস্তারিত কর্মী শ্রেণি'}<select value={f.employee_category||''} onChange={e=>setDetailedCategory(e.target.value)}><option value="">{en?'Optional':'ঐচ্ছিক'}</option><option value="third_general">{en?'3rd Class General':'৩য় শ্রেণির সাধারণ'}</option><option value="third_technical">{en?'3rd Class Technical':'৩য় শ্রেণির কারিগরি'}</option><option value="fourth_general">{en?'4th Class General':'৪র্থ শ্রেণির সাধারণ'}</option><option value="fourth_technical">{en?'4th Class Technical':'৪র্থ শ্রেণির কারিগরি'}</option><option value="officer">{en?'Officer':'কর্মকর্তা'}</option><option value="teacher">{en?'Teacher':'শিক্ষক'}</option></select></label>
      <label>{en?'Current grade':'বর্তমান গ্রেড'}<select value={f.grade||''} onChange={e=>setF({...f,grade:e.target.value})}><option value="">{en?'Select':'নির্বাচন করুন'}</option>{Array.from({length:20},(_,i)=>i+1).map(x=><option key={x} value={x}>{en?'Grade ':'গ্রেড '}{x}</option>)}</select></label>
      <label>{en?'Current post':'বর্তমান পদ'}<input value={f.current_post||''} onChange={e=>setF({...f,current_post:e.target.value})}/></label>
      <label>{en?'Current basic salary':'বর্তমান মূল বেতন'}<input type="number" min="0" inputMode="decimal" value={f.current_basic_salary||''} onChange={e=>setF({...f,current_basic_salary:e.target.value})}/></label>
      <label>{en?'Basic effective date':'মূল বেতন কার্যকর তারিখ'}<input type="date" value={f.salary_effective_date||''} onChange={e=>setF({...f,salary_effective_date:e.target.value})}/></label>
      <label>{en?'Date of birth':'জন্মতারিখ'}<input type="date" value={f.date_of_birth||''} onChange={e=>setF({...f,date_of_birth:e.target.value})}/></label>
      <label>{en?'Mobile number':'মোবাইল নম্বর'}<input inputMode="tel" value={f.mobile||''} onChange={e=>setF({...f,mobile:e.target.value})}/></label>
      <label>{en?'Gender':'লিঙ্গ'}<select value={f.gender||''} onChange={e=>setF({...f,gender:e.target.value})}><option value="">{en?'Select':'নির্বাচন করুন'}</option><option value="male">{en?'Male':'পুরুষ'}</option><option value="female">{en?'Female':'নারী'}</option></select></label>
      <label>{en?'Marital status':'বৈবাহিক অবস্থা'}<select value={f.marital_status||''} onChange={e=>setF({...f,marital_status:e.target.value})}><option value="">{en?'Select':'নির্বাচন করুন'}</option><option value="married">{en?'Married':'বিবাহিত'}</option><option value="unmarried">{en?'Unmarried':'অবিবাহিত'}</option></select></label>
      <label>{en?'First joining date':'প্রথম যোগদানের তারিখ'}<input type="date" value={f.first_joining_date||''} onChange={e=>setF({...f,first_joining_date:e.target.value})}/></label>
      <label>{en?'Current post joining':'বর্তমান পদে যোগদান'}<input type="date" value={f.current_post_joining_date||''} onChange={e=>setF({...f,current_post_joining_date:e.target.value})}/></label>
      <label>{en?'Entered 3rd class':'৩য় শ্রেণিতে প্রবেশ'}<input type="date" value={f.third_class_start_date||''} onChange={e=>setF({...f,third_class_start_date:e.target.value})}/></label>
      <label>{en?'Entered 4th class':'৪র্থ শ্রেণিতে প্রবেশ'}<input type="date" value={f.fourth_class_start_date||''} onChange={e=>setF({...f,fourth_class_start_date:e.target.value})}/></label>
      <label>{en?'Previous promotions':'আগের পদোন্নতির সংখ্যা'}<input type="number" min="0" value={f.previous_promotions||0} onChange={e=>setF({...f,previous_promotions:e.target.value})}/></label>
      <label>{en?'Office / unit':'অফিস / ইউনিট'}<input value={f.office_name||''} onChange={e=>setF({...f,office_name:e.target.value})}/></label>
      <label>{en?'Department / branch':'বিভাগ / শাখা'}<input value={f.department_name||''} onChange={e=>setF({...f,department_name:e.target.value})}/></label>
      <label>{en?'Retirement age':'অবসরের বয়স'}<input type="number" min="40" max="75" value={f.retirement_age||''} onChange={e=>setF({...f,retirement_age:e.target.value})}/></label>
    </div><button className="guest-primary"><Save/>{en?'Save on this device':'এই ডিভাইসে সংরক্ষণ'}</button>
  </form>;
}

function Education({en,data,commit}){
  const blank={level:'',institution:'',subject:'',passing_year:'',result:''};
  const [f,setF]=useState(blank);
  const [editing,setEditing]=useState('');
  const reset=()=>{setF(blank);setEditing('')};
  const save=e=>{
    e.preventDefault();if(!f.level)return;
    const item=editing?{...f,id:editing}:{id:uid(),...f};
    const next=editing?data.education.map(x=>x.id===editing?item:x):[item,...data.education];
    commit({...data,education:next});reset();
  };
  const beginEdit=x=>{setEditing(x.id);setF({...blank,...x})};
  return <div className="guest-two-part"><form className="guest-card guest-form" onSubmit={save}><Title icon={GraduationCap} title={editing?(en?'Edit education':'শিক্ষাগত তথ্য সম্পাদনা'):(en?'Add education':'শিক্ষাগত যোগ্যতা যোগ করুন')}/><div className="guest-fields"><label>{en?'Level':'স্তর'}<input value={f.level} onChange={e=>setF({...f,level:e.target.value})}/></label><label>{en?'Institution':'প্রতিষ্ঠান'}<input value={f.institution} onChange={e=>setF({...f,institution:e.target.value})}/></label><label>{en?'Subject':'বিষয়'}<input value={f.subject} onChange={e=>setF({...f,subject:e.target.value})}/></label><label>{en?'Passing year':'পাসের বছর'}<input inputMode="numeric" value={f.passing_year} onChange={e=>setF({...f,passing_year:e.target.value})}/></label><label>{en?'Result':'ফলাফল'}<input value={f.result} onChange={e=>setF({...f,result:e.target.value})}/></label></div><div className="guest-form-actions"><button className="guest-primary">{editing?<Save/>:<Plus/>}{editing?(en?'Save changes':'পরিবর্তন সংরক্ষণ'):(en?'Add':'যোগ করুন')}</button>{editing&&<button type="button" className="guest-cancel" onClick={reset}><X/>{en?'Cancel':'বাতিল'}</button>}</div></form><List items={data.education} empty={en?'No education saved yet.':'এখনও কোনো শিক্ষাগত তথ্য নেই।'} edit={beginEdit} remove={id=>commit({...data,education:data.education.filter(x=>x.id!==id)})} render={x=><div><b>{x.level}</b><span>{[x.subject,x.institution,x.passing_year,x.result].filter(Boolean).join(' · ')}</span></div>}/></div>;
}

function Timeline({en,lang,data,commit}){
  const blank={event_date:'',type:'promotion',title:'',post_name:'',grade:'',office_name:''};
  const [f,setF]=useState(blank);
  const [editing,setEditing]=useState('');
  const reset=()=>{setF(blank);setEditing('')};
  const save=e=>{
    e.preventDefault();if(!f.event_date||!f.title)return;
    const item=editing?{...f,id:editing}:{id:uid(),...f};
    const next=(editing?data.events.map(x=>x.id===editing?item:x):[item,...data.events]).sort((a,b)=>String(b.event_date).localeCompare(String(a.event_date)));
    commit({...data,events:next});reset();
  };
  const beginEdit=x=>{setEditing(x.id);setF({...blank,...x})};
  return <div className="guest-two-part"><form className="guest-card guest-form" onSubmit={save}><Title icon={Route} title={editing?(en?'Edit career event':'ক্যারিয়ার ইভেন্ট সম্পাদনা'):(en?'Add career event':'ক্যারিয়ার ইভেন্ট যোগ করুন')}/><div className="guest-fields"><label>{en?'Date':'তারিখ'}<input type="date" value={f.event_date} onChange={e=>setF({...f,event_date:e.target.value})}/></label><label>{en?'Type':'ধরন'}<select value={f.type} onChange={e=>setF({...f,type:e.target.value})}><option value="appointment">{en?'Appointment':'যোগদান'}</option><option value="promotion">{en?'Promotion':'পদোন্নতি'}</option><option value="transfer">{en?'Transfer / posting':'বদলি / পোস্টিং'}</option><option value="increment">{en?'Increment':'ইনক্রিমেন্ট'}</option><option value="training">{en?'Training':'প্রশিক্ষণ'}</option><option value="other">{en?'Other':'অন্যান্য'}</option></select></label><label>{en?'Title':'শিরোনাম'}<input value={f.title} onChange={e=>setF({...f,title:e.target.value})}/></label><label>{en?'Post':'পদ'}<input value={f.post_name} onChange={e=>setF({...f,post_name:e.target.value})}/></label><label>{en?'Grade':'গ্রেড'}<input inputMode="numeric" value={f.grade} onChange={e=>setF({...f,grade:e.target.value})}/></label><label>{en?'Office':'অফিস'}<input value={f.office_name} onChange={e=>setF({...f,office_name:e.target.value})}/></label></div><div className="guest-form-actions"><button className="guest-primary">{editing?<Save/>:<Plus/>}{editing?(en?'Save changes':'পরিবর্তন সংরক্ষণ'):(en?'Add event':'ইভেন্ট যোগ করুন')}</button>{editing&&<button type="button" className="guest-cancel" onClick={reset}><X/>{en?'Cancel':'বাতিল'}</button>}</div></form><List items={data.events} empty={en?'No career event saved yet.':'এখনও কোনো ক্যারিয়ার ইভেন্ট নেই।'} edit={beginEdit} remove={id=>commit({...data,events:data.events.filter(x=>x.id!==id)})} render={x=><div><b>{dateFmt(x.event_date,lang)} · {x.title}</b><span>{[x.post_name,x.grade?(en?'Grade ':'গ্রেড ')+x.grade:'',x.office_name].filter(Boolean).join(' · ')}</span></div>}/></div>;
}

function Salary({en,lang,data,commit}){
  const p=data.profile||{};
  const blank={effective_date:p.salary_effective_date||'',grade:String(p.grade||''),basic:String(p.current_basic_salary||''),gross:'',deductions:'',net:'',note:''};
  const [f,setF]=useState(blank);
  const [editing,setEditing]=useState('');
  const reset=()=>{setF(blank);setEditing('')};
  const save=e=>{
    e.preventDefault();if(!f.effective_date)return;
    const item=editing?{...f,id:editing}:{id:uid(),...f};
    const next=(editing?data.salary_history.map(x=>x.id===editing?item:x):[item,...data.salary_history]).sort((a,b)=>String(b.effective_date).localeCompare(String(a.effective_date)));
    commit({...data,salary_history:next});reset();
  };
  const beginEdit=x=>{setEditing(x.id);setF({...blank,...x})};
  return <div className="guest-two-part"><form className="guest-card guest-form" onSubmit={save}><Title icon={WalletCards} title={editing?(en?'Edit salary snapshot':'বেতন স্ন্যাপশট সম্পাদনা'):(en?'Save salary snapshot':'বেতন স্ন্যাপশট সংরক্ষণ')} sub={en?'Works without login.':'লগইন ছাড়াই কাজ করবে।'}/><div className="guest-fields"><label>{en?'Effective date':'কার্যকর তারিখ'}<input type="date" value={f.effective_date} onChange={e=>setF({...f,effective_date:e.target.value})}/></label><label>{en?'Grade':'গ্রেড'}<input inputMode="numeric" value={f.grade} onChange={e=>setF({...f,grade:e.target.value})}/></label>{[['basic',en?'Basic':'মূল বেতন'],['gross',en?'Gross':'মোট'],['deductions',en?'Deductions':'কর্তন'],['net',en?'Net':'নিট']].map(([k,l])=><label key={k}>{l}<input type="number" inputMode="decimal" min="0" value={f[k]} onChange={e=>setF({...f,[k]:e.target.value})}/></label>)}<label>{en?'Note':'নোট'}<input value={f.note} onChange={e=>setF({...f,note:e.target.value})}/></label></div><div className="guest-form-actions"><button className="guest-primary"><Save/>{editing?(en?'Save changes':'পরিবর্তন সংরক্ষণ'):(en?'Save':'সংরক্ষণ')}</button>{editing&&<button type="button" className="guest-cancel" onClick={reset}><X/>{en?'Cancel':'বাতিল'}</button>}</div></form><List items={data.salary_history} empty={en?'No salary snapshot saved yet.':'এখনও কোনো বেতন স্ন্যাপশট নেই।'} edit={beginEdit} remove={id=>commit({...data,salary_history:data.salary_history.filter(x=>x.id!==id)})} render={x=><div><b>{dateFmt(x.effective_date,lang)} · {en?'Net ':'নিট ৳'}{num(x.net,lang)}</b><span>{en?'Basic ':'মূল '}{num(x.basic,lang)} · {en?'Gross ':'মোট '}{num(x.gross,lang)}</span></div>}/></div>;
}

function Leave({en,lang,data,commit}){
  const blank={type:'casual',start_date:'',end_date:'',note:''};
  const [f,setF]=useState(blank);
  const [editing,setEditing]=useState('');
  const names=en?{casual:'Casual',earned:'Earned',medical:'Medical',maternity:'Maternity',paternity:'Paternity',study:'Study',special:'Special',other:'Other'}:{casual:'নৈমিত্তিক',earned:'অর্জিত',medical:'চিকিৎসা',maternity:'মাতৃত্বকালীন',paternity:'পিতৃত্বকালীন',study:'শিক্ষা',special:'বিশেষ',other:'অন্যান্য'};
  const reset=()=>{setF(blank);setEditing('')};
  const save=e=>{
    e.preventDefault();const total=inclusiveDays(f.start_date,f.end_date);if(!total)return;
    const item=editing?{...f,id:editing,total_days:total}:{id:uid(),...f,total_days:total};
    const next=(editing?data.leave.map(x=>x.id===editing?item:x):[item,...data.leave]).sort((a,b)=>String(b.start_date).localeCompare(String(a.start_date)));
    commit({...data,leave:next});reset();
  };
  const beginEdit=x=>{setEditing(x.id);setF({...blank,...x})};
  return <div className="guest-two-part"><form className="guest-card guest-form" onSubmit={save}><Title icon={CalendarDays} title={editing?(en?'Edit leave record':'ছুটির রেকর্ড সম্পাদনা'):(en?'Add leave record':'ছুটির রেকর্ড যোগ করুন')}/><div className="guest-fields"><label>{en?'Leave type':'ছুটির ধরন'}<select value={f.type} onChange={e=>setF({...f,type:e.target.value})}>{Object.entries(names).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select></label><label>{en?'Start':'শুরু'}<input type="date" value={f.start_date} onChange={e=>setF({...f,start_date:e.target.value})}/></label><label>{en?'End':'শেষ'}<input type="date" value={f.end_date} onChange={e=>setF({...f,end_date:e.target.value})}/></label><label>{en?'Note':'নোট'}<input value={f.note} onChange={e=>setF({...f,note:e.target.value})}/></label></div><div className="guest-form-actions"><button className="guest-primary">{editing?<Save/>:<Plus/>}{editing?(en?'Save changes':'পরিবর্তন সংরক্ষণ'):(en?'Add':'যোগ করুন')}</button>{editing&&<button type="button" className="guest-cancel" onClick={reset}><X/>{en?'Cancel':'বাতিল'}</button>}</div></form><List items={data.leave} empty={en?'No leave record saved yet.':'এখনও কোনো ছুটির রেকর্ড নেই।'} edit={beginEdit} remove={id=>commit({...data,leave:data.leave.filter(x=>x.id!==id)})} render={x=><div><b>{names[x.type]||x.type} · {num(x.total_days,lang,1)} {en?'day(s)':'দিন'}</b><span>{dateFmt(x.start_date,lang)} — {dateFmt(x.end_date,lang)}</span></div>}/></div>;
}

function Reports({en,lang,data,service,leaveDays,latestSalary,onOpen}){
  const p=data.profile||{};
  return <div className="guest-card guest-report"><Title icon={FileText} title={en?'Local personal summary':'Local ব্যক্তিগত সারসংক্ষেপ'} sub={en?'Created from records on this device.':'এই ডিভাইসের তথ্য থেকে তৈরি।'}/><div className="guest-report-kpis"><span><small>{en?'Post':'পদ'}</small><b>{p.current_post||'—'}</b></span><span><small>{en?'Grade':'গ্রেড'}</small><b>{p.grade||'—'}</b></span><span><small>{en?'Career events':'ক্যারিয়ার ইভেন্ট'}</small><b>{num(data.events.length,lang)}</b></span><span><small>{en?'Education':'শিক্ষা রেকর্ড'}</small><b>{num(data.education.length,lang)}</b></span><span><small>{en?'Salary records':'বেতন রেকর্ড'}</small><b>{num(data.salary_history.length,lang)}</b></span><span><small>{en?'Leave days':'ছুটির দিন'}</small><b>{num(leaveDays,lang,1)}</b></span></div><div className="guest-report-actions"><button onClick={()=>window.print()}><FileText/>{en?'Print / PDF':'প্রিন্ট / PDF'}</button><button onClick={()=>onOpen?.('pdf-center')}><FileText/>{en?'PDF Center':'PDF সেন্টার'}</button><button onClick={()=>downloadData(data)}><Download/>{en?'Backup JSON':'ব্যাকআপ JSON'}</button></div><div className="guest-disclaimer"><ShieldCheck/>{en?'Personal reference only; not an official record or order.':'শুধু ব্যক্তিগত রেফারেন্স; কোনো অফিসিয়াল রেকর্ড বা আদেশ নয়।'}</div></div>;
}

function Privacy({en,data,onLogin,onRestore}){
  const [backup,setBackup]=useState(null),[fileName,setFileName]=useState(''),[error,setError]=useState(''),[busy,setBusy]=useState(false);
  const clear=()=>{if(!confirm(en?'Delete all local personal records?':'সব Local ব্যক্তিগত রেকর্ড মুছে ফেলবেন?'))return;localStorage.removeItem(KEY);location.reload()};
  async function chooseBackup(e){
    const file=e.target.files?.[0];e.target.value='';setError('');setBackup(null);setFileName('');
    if(!file)return;
    if(file.size>MAX_BACKUP_BYTES){setError(en?'Backup file is too large. Maximum supported size is 12 MB.':'ব্যাকআপ ফাইলটি অনেক বড়। সর্বোচ্চ ১২ MB পর্যন্ত সমর্থিত।');return}
    try{
      const parsed=parseBackup(JSON.parse(await file.text()));
      setBackup(parsed);setFileName(file.name);
    }catch(err){setError(en?'This file could not be read as a valid Hisab Sahayika backup.':'ফাইলটি বৈধ হিসাব সহায়িকা ব্যাকআপ হিসেবে পড়া যায়নি।')}
  }
  function restore(mode){
    if(!backup)return;
    const replace=mode==='replace';
    const prompt=replace
      ?(en?'Replace the local records included in this backup? Current records in those included sections will be replaced.':'ব্যাকআপে থাকা Local রেকর্ড দিয়ে বর্তমান অন্তর্ভুক্ত অংশগুলো Replace করবেন? ঐ অংশের বর্তমান রেকর্ড প্রতিস্থাপিত হবে।')
      :(en?'Merge this backup with the records already on this device? Imported non-empty profile fields will update matching fields.':'এই ব্যাকআপটি বর্তমান Local রেকর্ডের সঙ্গে Merge করবেন? Import করা Profile-এর পূরণ করা তথ্য একই field আপডেট করবে।');
    if(!confirm(prompt))return;
    setBusy(true);setError('');
    try{
      const current=readData();
      const next=replace?normalizeWorkspace(backup.workspace):mergeWorkspace(current,backup.workspace);
      const saved=writeData(next);
      if(backup.hasHistory){
        const rows=replace?backup.calculation_history:mergeRows(readLocalRows(HISTORY_KEY,80),backup.calculation_history,80,'history').sort((a,b)=>String(b.created_at||'').localeCompare(String(a.created_at||'')));
        localStorage.setItem(HISTORY_KEY,JSON.stringify(rows.slice(0,80)));
        window.dispatchEvent(new CustomEvent('hisab-calculation-history-updated'));
      }
      if(backup.hasPdf){
        const rows=replace?backup.pdf_center:mergeRows(readLocalRows(PDF_KEY,16),backup.pdf_center,16,'pdf').sort((a,b)=>String(b.updated_at||'').localeCompare(String(a.updated_at||'')));
        localStorage.setItem(PDF_KEY,JSON.stringify(rows.slice(0,16)));
        window.dispatchEvent(new CustomEvent('hisab-pdf-center-updated'));
      }
      onRestore?.(saved);setBackup(null);setFileName('');
    }catch(err){setError(en?'Restore failed. No further changes were applied.':'রিস্টোর সম্পন্ন করা যায়নি।')}
    finally{setBusy(false)}
  }
  const counts=backup?{
    profile:profileFilledCount(backup.workspace.profile),
    education:backup.workspace.education.length,
    events:backup.workspace.events.length,
    salary:backup.workspace.salary_history.length,
    leave:backup.workspace.leave.length,
    entitlementYears:Object.keys(backup.workspace.leave_entitlements||{}).length,
    history:backup.calculation_history.length,
    pdf:backup.pdf_center.length
  }:null;
  return <div className="guest-data-center">
    <div className="guest-privacy-grid">
      <article><Download/><h3>{en?'Export full backup':'সম্পূর্ণ ব্যাকআপ Export'}</h3><p>{en?'Download profile, records, calculation history and PDF Center as one JSON backup.':'Profile, রেকর্ড, হিসাবের ইতিহাস ও PDF Center এক JSON ব্যাকআপে ডাউনলোড করুন।'}</p><button onClick={()=>downloadData(data)}><Download/>{en?'Export Backup':'ব্যাকআপ Export'}</button></article>
      <article><Upload/><h3>{en?'Import / Restore backup':'ব্যাকআপ Import / Restore'}</h3><p>{en?'Choose a current or older Hisab Sahayika JSON file. You will preview it before anything changes.':'বর্তমান বা পুরোনো হিসাব সহায়িকা JSON ফাইল নির্বাচন করুন। পরিবর্তনের আগে Preview দেখাবে।'}</p><label className="guest-import-button"><Upload/>{en?'Choose JSON Backup':'JSON ব্যাকআপ নির্বাচন'}<input type="file" accept=".json,application/json" onChange={chooseBackup}/></label></article>
      <article><Cloud/><h3>Backup & Sync</h3><p>{en?'Optional login for Cloud Backup, Sync, Recovery and multiple-device use.':'Cloud Backup, Sync, Recovery ও একাধিক ডিভাইসে ব্যবহারের জন্য ঐচ্ছিক লগইন।'}</p><button onClick={onLogin}><Cloud/>{en?'Login for Backup & Sync':'Backup & Sync-এর জন্য লগইন'}</button></article>
      <article><Trash2/><h3>{en?'Clear local records':'Local রেকর্ড মুছুন'}</h3><p>{en?'Deletes only personal workspace records on this device.':'শুধু এই ডিভাইসের ব্যক্তিগত workspace রেকর্ড মুছবে।'}</p><button className="danger" onClick={clear}><Trash2/>{en?'Clear':'মুছুন'}</button></article>
    </div>
    {error&&<div className="guest-backup-error"><AlertTriangle/>{error}</div>}
    {backup&&<section className="guest-backup-preview">
      <div className="guest-backup-preview-head"><div><Upload/><div><small>{backup.legacy?(en?'LEGACY BACKUP':'পুরোনো ব্যাকআপ'):`BACKUP V${backup.version}`}</small><h3>{en?'Backup preview':'ব্যাকআপ Preview'}</h3><p>{fileName}{backup.exported_at?` · ${dateFmt(String(backup.exported_at).slice(0,10),en?'en':'bn')}`:''}</p></div></div><button onClick={()=>{setBackup(null);setFileName('')}}><X/></button></div>
      <div className="guest-backup-counts">
        <span><small>{en?'Profile fields':'Profile তথ্য'}</small><b>{counts.profile}</b></span>
        <span><small>{en?'Education':'শিক্ষা'}</small><b>{counts.education}</b></span>
        <span><small>{en?'Timeline':'টাইমলাইন'}</small><b>{counts.events}</b></span>
        <span><small>{en?'Salary records':'বেতন রেকর্ড'}</small><b>{counts.salary}</b></span>
        <span><small>{en?'Leave records':'ছুটি রেকর্ড'}</small><b>{counts.leave}</b></span>
        <span><small>{en?'Leave balance years':'ছুটি ব্যালেন্স বছর'}</small><b>{counts.entitlementYears}</b></span>
        <span className={!backup.hasHistory?'muted':''}><small>{en?'Calculations':'হিসাবের ইতিহাস'}</small><b>{backup.hasHistory?counts.history:'—'}</b></span>
        <span className={!backup.hasPdf?'muted':''}><small>PDF Center</small><b>{backup.hasPdf?counts.pdf:'—'}</b></span>
      </div>
      {backup.legacy&&<div className="guest-backup-legacy"><ShieldCheck/><span>{en?'Older backup detected. It contains personal workspace records only; Calculation History and PDF Center will not be changed.':'পুরোনো ব্যাকআপ পাওয়া গেছে। এতে শুধু ব্যক্তিগত workspace রেকর্ড আছে; হিসাবের ইতিহাস ও PDF Center পরিবর্তন হবে না।'}</span></div>}
      <div className="guest-backup-mode-note"><b>{en?'Merge':'Merge'}:</b> {en?'keeps current records and adds/updates imported records.':'বর্তমান রেকর্ড রেখে Import করা রেকর্ড যোগ/আপডেট করবে।'} <b>{en?'Replace':'Replace'}:</b> {en?'replaces the sections included in this backup.':'এই ব্যাকআপে থাকা অংশগুলোর বর্তমান data প্রতিস্থাপন করবে।'}</div>
      <div className="guest-backup-actions"><button disabled={busy} className="merge" onClick={()=>restore('merge')}><Plus/>{busy?(en?'Restoring...':'রিস্টোর হচ্ছে'):(en?'Merge Restore':'Merge করে Restore')}</button><button disabled={busy} className="replace" onClick={()=>restore('replace')}><Save/>{en?'Replace & Restore':'Replace করে Restore'}</button></div>
    </section>}
  </div>;
}

function Title({icon:Icon,title,sub}){
  return <div className="guest-card-title"><Icon/><div><h3>{title}</h3>{sub&&<p>{sub}</p>}</div></div>;
}
function List({items,empty,remove,edit,render}){
  return <section className="guest-record-list">{!items?.length?<div className="guest-empty">{empty}</div>:items.map(x=><article key={x.id}>{render(x)}<div className="guest-record-actions">{edit&&<button type="button" className="edit" onClick={()=>edit(x)} aria-label="Edit"><Pencil/></button>}<button type="button" className="delete" onClick={()=>remove(x.id)} aria-label="Delete"><Trash2/></button></div></article>)}</section>;
}
