import React,{useEffect,useMemo,useState} from 'react';
import {
  AlertTriangle,BadgeCheck,Building2,ChevronRight,FileSearch,FileText,Home,
  ListFilter,MapPin,Search,SlidersHorizontal,UserRound,Users,X
} from 'lucide-react';
import DATA from './house-allocation-data-v63.js';
import './house-directory-v63.css';

const BN_DIGITS='০১২৩৪৫৬৭৮৯';
const VISIBLE_GROUPS=new Set(['officer','employee','technical']);
const ROLE_HINT_TOKEN_RE=/(অফিসার|কর্মকর্তা|সহকারী|সহায়ক|পরিদর্শক|গ্রন্থাগারিক|লাইব্রেরিয়ান|প্রকৌশলী|সাইন্টিস্ট|সায়েন্টিস্ট|ফোরম্যান|ইমাম|খতিব|প্রোগ্রামার|ডেমনস্ট্রেটর|ম্যানেজার|হিসাবরক্ষক|সহযোগী|প্রহরী|দপ্তরী|বার্তাবাহক|স্টোনোগ্রাফার|টেকনেশিয়ান|মেকানিক|অপারেটর|রাজমিস্ত্রী|প্লাম্বার|কম্পাউন্ডার|ড্রাইভার|টিনস্মিথ|লিফটম্যান|মেশিনম্যান|কেয়ারটেকার|সটার্র|সর্টার|স্টোরকিপার|স্টোরকীপার|মুয়াজ্জিন|মিস্ত্রি|ইলেকট্রিশিয়ান|ড্রাফটসম্যান|টাইপিস্ট|ক্যাশিয়ার|অডিটর|সুপারভাইজার|নার্স|প্রুফম্যান|ম্যান)/;
const ROLE_PREFIXES=new Set(['প্রধান','সিনিয়র','সিনি','সি','প্রিন্সিপ্যাল','প্রি','জুনিয়র','ডেপুটি','উপ','নির্বাহী','তত্ত্বাবধায়ক','মেডিকেল','টেকনিক্যাল','টেক','এ্যাডমিনিস্ট্রেটিভ','এ্যাড','প্রশাসনিক','একাউন্টস','স্টোর','সেকশন','কলেজ','ফার্মাসিউটিক্যাল','গবেষণা','কম্পিউটার','ল্যাব','ল্যাবরেটরী','নিরাপত্তা','লাইব্রেরী','হিসাবরক্ষণ','সেলস','গেস্টেনার','মেশিন','লিফট','ক্রাফট','অফিস','উচ্চমান','সায়েন্টিফিক','সাইন্টিফিক']);

const SECTION_META={
  'officer-special':{totalSerial:12,pages:'16–17',bn:'কর্মকর্তা — বিশেষ বিবেচনার আবেদন',en:'Officers — special consideration'},
  'officer-point':{totalSerial:188,pages:'18–26',bn:'কর্মকর্তা — সেন্ট্রালপুল পয়েন্ট সিনিয়রিটি',en:'Officers — central pool point seniority'},
  'employee-promoted':{totalSerial:104,pages:'1–7',bn:'পদোন্নতিপ্রাপ্ত ৩য় শ্রেণি — বাসা',en:'Promoted Class III — housing'},
  'employee-direct':{totalSerial:147,pages:'8–15',bn:'সরাসরি নিয়োগপ্রাপ্ত ৩য় শ্রেণি — বাসা',en:'Direct-recruit Class III — housing'},
  'employee-seat':{totalSerial:10,pages:'16',bn:'৩য় শ্রেণি — সিট বরাদ্দ',en:'Class III — seat allocation'},
  'technical-house':{totalSerial:134,pages:'17–23',bn:'৩য় শ্রেণি কারিগরি — বাসা',en:'Class III technical — housing'},
  'technical-seat':{totalSerial:13,pages:'24',bn:'৩য় শ্রেণি কারিগরি — সিট বরাদ্দ',en:'Class III technical — seat allocation'}
};
function sectionMetaFor(x){
  return SECTION_META[x.category]||{
    totalSerial:bnToNumber(x.serial),
    pages:String(x.sourcePage||''),
    bn:x.categoryBn||'',
    en:x.categoryEn||''
  };
}

function normalize(v){
  return String(v||'')
    .toLowerCase()
    .replace(/[০-৯]/g,function(d){return String(BN_DIGITS.indexOf(d))})
    .replace(/[\u200c\u200d]/g,'')
    .replace(/[–—]/g,'-')
    .replace(/\s+/g,' ')
    .trim();
}
function bnToNumber(v){
  const n=Number(normalize(v));
  return Number.isFinite(n)?n:0;
}
function numberLabel(n,en){return Number(n||0).toLocaleString(en?'en-US':'bn-BD')}
function ordinalLabel(n,en){
  const value=Number(n||0);
  if(en){
    const mod100=value%100;
    const suffix=(mod100>=11&&mod100<=13)?'th':({1:'st',2:'nd',3:'rd'}[value%10]||'th');
    return value+suffix;
  }
  const bn=numberLabel(value,false);
  if(value===1)return bn+'ম';
  if(value===2)return bn+'য়';
  if(value===3)return bn+'য়';
  if(value===4)return bn+'র্থ';
  return bn+'তম';
}
function sourceFor(id){return DATA.sources.find(function(x){return x.id===id})||{}}
function roleOfficeFields(v){
  const value=String(v||'').trim();
  if(!value)return {designation:'',office:''};
  const comma=value.indexOf(',');
  if(comma>0&&comma<value.length-1){
    return {designation:value.slice(0,comma).trim(),office:value.slice(comma+1).trim()};
  }
  return {designation:value,office:''};
}
function searchMatch(x,nq,scope){
  if(!nq)return {score:0,reason:'browse'};
  const name=normalize(x.name);
  if(name===nq)return {score:500,reason:'name-exact'};
  if(name.startsWith(nq))return {score:420,reason:'name-start'};
  if(name.includes(nq))return {score:360,reason:'name'};
  if(scope==='name')return null;
  const role=normalize(x.roleOffice);
  if(role.includes(nq))return {score:240,reason:'office'};
  if(normalize(x.point).includes(nq))return {score:220,reason:'point'};
  if(normalize(x.request).includes(nq))return {score:180,reason:'request'};
  if(normalize([x.categoryBn,x.categoryEn,x.sectionBn,x.sectionEn].join(' ')).includes(nq))return {score:150,reason:'section'};
  if(normalize(x.raw).includes(nq))return {score:100,reason:'other'};
  return null;
}
function matchReasonLabel(reason,en){
  const labels={
    'name-exact':[en?'Exact name':'নামের সঠিক মিল'],
    'name-start':[en?'Name match':'নামে মিল'],
    'name':[en?'Name match':'নামে মিল'],
    'office':[en?'Designation / office match':'পদবি/অফিসে মিল'],
    'point':[en?'Point match':'পয়েন্টে মিল'],
    'request':[en?'Allocation note match':'আবেদন/বরাদ্দ তথ্যে মিল'],
    'section':[en?'List match':'তালিকার তথ্যে মিল'],
    'other':[en?'Other source text match':'অন্যান্য উৎস তথ্যে মিল']
  };
  return (labels[reason]||[''])[0];
}
function escapeRegExp(v){return String(v||'').replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}
function Highlight({text,q}){
  const src=String(text||'');
  const needle=String(q||'').trim();
  if(!needle)return src;
  const re=new RegExp('('+escapeRegExp(needle)+')','ig');
  const parts=src.split(re);
  return <>{parts.map(function(part,i){return normalize(part)===normalize(needle)?<mark key={i}>{part}</mark>:<React.Fragment key={i}>{part}</React.Fragment>})}</>;
}
function stripPageHeader(text){
  return String(text||'')
    .replace(/^\s*[০-৯]+\s+অপর পৃষ্ঠায় দ্রষ্টব্য[:：]?\s*/,'')
    .replace(/^\s*ঢাকা বিশ্ববিদ্যালয়\s*/,'')
    .trim();
}
function cleanName(v){
  return String(v||'')
    .replace(/^(জনাব|জনাবা|মিসেস|মোছা\.?|শ্রী)\s+/,'')
    .replace(/[,;:]+$/,'')
    .trim();
}
function splitRoleOffice(beforePoint){
  const value=String(beforePoint||'').trim();
  const tokens=value.split(/\s+/).filter(Boolean);
  let roleAt=-1;
  for(let i=0;i<tokens.length;i++){
    const key=tokens[i].replace(/[,.()]/g,'').toLowerCase();
    if(ROLE_HINT_TOKEN_RE.test(key)){roleAt=i;break}
  }
  if(roleAt<0)return {name:cleanName(value),roleOffice:''};
  while(roleAt>0){
    const prev=tokens[roleAt-1].replace(/[,.()]/g,'').replace(/[-–—]+$/,'').toLowerCase();
    if(!ROLE_PREFIXES.has(prev))break;
    roleAt-=1;
  }
  return {
    name:cleanName(tokens.slice(0,roleAt).join(' ')),
    roleOffice:tokens.slice(roleAt).join(' ').trim()
  };
}
function findPoint(text){
  const m=String(text||'').match(/([০-৯]{2,3}-[০-৯]{1,2})(?!-[০-৯])/);
  return m?m[1]:'';
}
function findRequest(text){
  const value=String(text||'');
  const m=value.match(/(?:তিনি|তারা|উভয়ে)[^।]*(?:বরাদ্দ|বাসা|সিট)[^।]*।?/);
  if(m)return m[0].trim();
  const pieces=value.split('।').map(function(x){return x.trim()}).filter(Boolean);
  const hit=pieces.find(function(x){return /(বরাদ্দ|বাসা|সিট)/.test(x)});
  return hit?(hit+'।'):'';
}
function allocationType(page,segment){
  const probe=normalize([page.category,page.categoryBn,segment].join(' '));
  return probe.includes('seat')||probe.includes('সিট')?'seat':'house';
}
function parseTablePage(page){
  let body=stripPageHeader(page.text);
  const headerIndex=body.indexOf('মন্তব্য');
  if(headerIndex>=0)body=body.slice(headerIndex+'মন্তব্য'.length).trim();

  const starts=[];
  const re=/(?:^|\s)([০-৯]{1,3})\s+(?=[^০-৯\s])/g;
  let m;
  while((m=re.exec(body))){
    const rawStart=m.index+(m[0].length-m[1].length-1);
    starts.push({serial:m[1],start:rawStart,contentStart:rawStart+m[1].length+1});
  }
  if(!starts.length)return [];

  const rows=[];
  starts.forEach(function(item,i){
    const end=i+1<starts.length?starts[i+1].start:body.length;
    const segment=body.slice(item.contentStart,end).trim();
    if(segment.length<12)return;
    const point=findPoint(segment);
    if(!point)return;
    const pointIndex=segment.indexOf(point);
    const beforePoint=(pointIndex>=0?segment.slice(0,pointIndex):segment).trim();
    const parsed=splitRoleOffice(beforePoint);
    if(!parsed.name||parsed.name.length>120)return;
    rows.push({
      id:page.id+'-'+item.serial,
      sourceId:page.sourceId,
      sourcePage:page.page,
      serial:item.serial,
      group:page.group,
      groupBn:page.groupBn,
      groupEn:page.groupEn,
      category:page.category,
      categoryBn:page.categoryBn,
      categoryEn:page.categoryEn,
      status:page.status,
      name:parsed.name,
      roleOffice:parsed.roleOffice,
      point,
      request:findRequest(segment),
      allocationType:allocationType(page,segment),
      raw:segment
    });
  });
  return rows;
}
function parseSpecialPage(page){
  let body=stripPageHeader(page.text);
  const heading=body.indexOf('আবেদন সমূহ');
  if(heading>=0)body=body.slice(heading+'আবেদন সমূহ'.length).trim();
  const starts=[];
  const re=/(?:^|\s)([০-৯]{1,2})।\s*/g;
  let m;
  while((m=re.exec(body))){
    starts.push({serial:m[1],start:m.index,contentStart:re.lastIndex});
  }
  const rows=[];
  starts.forEach(function(item,i){
    const end=i+1<starts.length?starts[i+1].start:body.length;
    const segment=body.slice(item.contentStart,end).trim();
    if(segment.length<12)return;
    const prefix=(segment.split(/তাঁর আবেদনে|তার আবেদনে/)[0]||segment).trim();
    const honorific=Math.max(prefix.lastIndexOf('জনাব '),prefix.lastIndexOf('মিসেস '),prefix.lastIndexOf('জনাবা '));
    let name='',roleOffice='';
    if(honorific>=0){
      const cut=prefix.slice(honorific).replace(/^(জনাব|মিসেস|জনাবা)\s+/,'');
      name=cleanName(cut);
      roleOffice=prefix.slice(0,honorific).trim();
    }else{
      const parsed=splitRoleOffice(prefix);
      name=parsed.name;
      roleOffice=parsed.roleOffice;
    }
    const pointMatch=segment.match(/পয়েন্ট\s+([০-৯]+-[০-৯]+)/);
    rows.push({
      id:page.id+'-'+item.serial,
      sourceId:page.sourceId,
      sourcePage:page.page,
      serial:item.serial,
      group:page.group,
      groupBn:page.groupBn,
      groupEn:page.groupEn,
      category:page.category,
      categoryBn:page.categoryBn,
      categoryEn:page.categoryEn,
      status:page.status,
      name,
      roleOffice,
      point:pointMatch?pointMatch[1]:'',
      request:findRequest(segment),
      allocationType:'house',
      raw:segment
    });
  });
  return rows;
}
function parsePage(page){return page.category==='officer-special'?parseSpecialPage(page):parseTablePage(page)}
function safeSourceTitle(source,en){
  if(source.id==='teacher-officer-2026-09-15'){
    return en?'Officer Housing Information — 15 September 2026':'কর্মকর্তা বাসা বরাদ্দ তথ্য — ১৫ সেপ্টেম্বর ২০২৬';
  }
  return en?source.titleEn:source.titleBn;
}
function safeSourceNote(source,en){
  if(source.id==='teacher-officer-2026-09-15'){
    return en?'Published officer housing applications and point-seniority information.':'প্রকাশিত কর্মকর্তা বাসা আবেদন ও পয়েন্ট-সিনিয়রিটি তথ্য।';
  }
  return en?source.noteEn:source.noteBn;
}

export default function HouseAllocationDirectory({lang='bn',onOpenPoints}){
  const en=lang==='en';
  const [q,setQ]=useState('');
  const [group,setGroup]=useState('all');
  const [kind,setKind]=useState('all');
  const [category,setCategory]=useState('all');
  const [searchScope,setSearchScope]=useState('name');
  const [selected,setSelected]=useState(null);
  const [limit,setLimit]=useState(60);
  const nq=normalize(q);

  const visiblePages=useMemo(function(){
    return DATA.pages.filter(function(x){return VISIBLE_GROUPS.has(x.group)});
  },[]);

  const records=useMemo(function(){
    const parsed=visiblePages.flatMap(parsePage).filter(function(x){return x.name&&x.name.length>1});
    return parsed.map(function(x){
      const position=bnToNumber(x.serial);
      const meta=sectionMetaFor(x);
      return {...x,position,listTotal:meta.totalSerial,sectionPages:meta.pages,sectionBn:meta.bn,sectionEn:meta.en};
    });
  },[visiblePages]);

  const groupOptions=[
    ['all',en?'All':'সব',FileSearch],
    ['officer',en?'Officers':'কর্মকর্তা',Users],
    ['employee',en?'Employees':'কর্মচারী',Users],
    ['technical',en?'Technical':'কারিগরি',Users]
  ];
  const kindOptions=[
    ['all',en?'House + Seat':'বাসা + সিট'],
    ['house',en?'House':'বাসা বরাদ্দ'],
    ['seat',en?'Seat':'সিট বরাদ্দ']
  ];

  const categories=useMemo(function(){
    const seen=new Map();
    records
      .filter(function(x){return group==='all'||x.group===group})
      .filter(function(x){return kind==='all'||x.allocationType===kind})
      .forEach(function(x){if(!seen.has(x.category))seen.set(x.category,en?x.categoryEn:x.categoryBn)});
    return Array.from(seen.entries());
  },[records,group,kind,en]);

  useEffect(function(){
    if(category!=='all'&&!categories.some(function(row){return row[0]===category}))setCategory('all');
  },[categories,category]);

  useEffect(function(){setLimit(60)},[q,group,kind,category,searchScope]);

  const filteredRecords=useMemo(function(){
    return records
      .filter(function(x){
        if(group!=='all'&&x.group!==group)return false;
        if(kind!=='all'&&x.allocationType!==kind)return false;
        if(category!=='all'&&x.category!==category)return false;
        return true;
      })
      .map(function(x){
        const match=searchMatch(x,nq,searchScope);
        return match?{...x,matchScore:match.score,matchReason:match.reason}:null;
      })
      .filter(Boolean)
      .sort(function(a,b){
        if(b.matchScore!==a.matchScore)return b.matchScore-a.matchScore;
        const an=normalize(a.name),bn=normalize(b.name);
        if(an!==bn)return an.localeCompare(bn,'bn');
        return a.position-b.position;
      });
  },[records,group,kind,category,nq,searchScope]);

  const groupedResults=useMemo(function(){
    const map=new Map();
    filteredRecords.forEach(function(x){
      const key=normalize(x.name);
      if(!map.has(key))map.set(key,{key,name:x.name,items:[],primary:x,bestScore:x.matchScore});
      const g=map.get(key);
      g.items.push(x);
      if(x.matchScore>g.bestScore){g.primary=x;g.bestScore=x.matchScore}
    });
    return Array.from(map.values()).sort(function(a,b){
      if(b.bestScore!==a.bestScore)return b.bestScore-a.bestScore;
      return normalize(a.name).localeCompare(normalize(b.name),'bn');
    });
  },[filteredRecords]);

  const hasIntent=Boolean(nq)||group!=='all'||kind!=='all'||category!=='all';
  const results=hasIntent?groupedResults:[];
  const visibleResults=results.slice(0,limit);
  const resultRecordCount=results.reduce(function(sum,g){return sum+g.items.length},0);
  const visibleSourceIds=new Set(records.map(function(x){return x.sourceId}));
  const visibleSources=DATA.sources.filter(function(s){return visibleSourceIds.has(s.id)});
  const selectedRecord=selected?selected.record:null;
  const selectedFields=selectedRecord?roleOfficeFields(selectedRecord.roleOffice):{designation:'',office:''};

  function chooseGroup(v){setGroup(v);setCategory('all')}
  function chooseKind(v){setKind(v);setCategory('all')}

  return <div className="house-dir-v64">
    <section className="house-dir-hero">
      <div className="house-dir-hero-icon"><Home/></div>
      <div className="house-dir-hero-copy">
        <small>{en?'SEARCHABLE HOUSING DIRECTORY':'অনুসন্ধানযোগ্য বাসা/সিট ডিরেক্টরি'}</small>
        <h2>{en?'House & Seat Allocation Information':'বাসা ও সিট বরাদ্দ তথ্য'}</h2>
        <p>{en?'Search published officer, employee and technical-staff information by name, designation, office/department, point, house or seat.':'নাম, পদবি, অফিস/বিভাগ, পয়েন্ট, বাসা বা সিট দিয়ে কর্মকর্তা, কর্মচারী ও কারিগরি কর্মচারীদের প্রকাশিত তথ্য খুঁজুন।'}</p>
      </div>
      {onOpenPoints&&<button className="house-dir-points-btn" onClick={onOpenPoints}>{en?'Point calculator':'পয়েন্ট হিসাব'}<ChevronRight/></button>}
    </section>

    <section className="house-dir-disclaimer">
      <AlertTriangle/>
      <div>
        <b>{en?'Important notice':'গুরুত্বপূর্ণ ঘোষণা'}</b>
        <p>{en?'This is not an official University of Dhaka app. Search results are a structured view of published source lists. Always follow the latest official notice/order for final decisions.':'এটি ঢাকা বিশ্ববিদ্যালয়ের অফিসিয়াল অ্যাপ নয়। প্রকাশিত উৎস তালিকার তথ্যকে অনুসন্ধানযোগ্যভাবে সাজিয়ে দেখানো হচ্ছে। চূড়ান্ত সিদ্ধান্তের জন্য বিশ্ববিদ্যালয়ের সর্বশেষ অফিসিয়াল নোটিশ/আদেশ অনুসরণ করুন।'}</p>
      </div>
    </section>

    <section className="house-dir-source-strip">
      <FileText/>
      <div>
        <b>{en?'Published sources':'প্রকাশিত উৎস'}</b>
        <span>{visibleSources.map(function(s){return safeSourceTitle(s,en)}).join('  •  ')}</span>
      </div>
    </section>

    <section className="house-dir-search-panel">
      <div className="house-dir-search">
        <Search/>
        <input value={q} onChange={function(e){setQ(e.target.value)}} placeholder={en?'Search name, designation, office, point, house or seat':'নাম, পদবি, অফিস, পয়েন্ট, বাসা বা সিট লিখে খুঁজুন'} autoComplete="off"/>
        {q&&<button onClick={function(){setQ('')}} aria-label={en?'Clear':'মুছুন'}><X/></button>}
      </div>
      <div className="house-dir-search-scope">
        <span>{en?'Search in':'সার্চের ধরন'}</span>
        <button className={searchScope==='name'?'active':''} onClick={function(){setSearchScope('name')}}>{en?'Name only':'শুধু নাম'}</button>
        <button className={searchScope==='all'?'active':''} onClick={function(){setSearchScope('all')}}>{en?'All information':'সব তথ্য'}</button>
        <small>{searchScope==='name'?(en?'Shows only people whose names match.':'শুধু যাদের নামের সাথে মিলবে তাদের দেখাবে।'):(en?'Also checks designation, office, point and allocation notes.':'পদবি, অফিস, পয়েন্ট ও বরাদ্দের তথ্যেও খুঁজবে।')}</small>
      </div>

      <div className="house-dir-control-row">
        <div className="house-dir-groups">
          {groupOptions.map(function(row){const id=row[0],label=row[1],Icon=row[2];return <button key={id} className={group===id?'active':''} onClick={function(){chooseGroup(id)}}><Icon/>{label}</button>})}
        </div>
        <div className="house-dir-kind">
          {kindOptions.map(function(row){return <button key={row[0]} className={kind===row[0]?'active':''} onClick={function(){chooseKind(row[0])}}>{row[1]}</button>})}
        </div>
      </div>

      <div className="house-dir-filter">
        <ListFilter/>
        <select value={category} onChange={function(e){setCategory(e.target.value)}}>
          <option value="all">{en?'All categories':'সব ক্যাটাগরি'}</option>
          {categories.map(function(row){return <option key={row[0]} value={row[0]}>{row[1]}</option>})}
        </select>
        <span>{hasIntent?(en?(results.length+' people • '+resultRecordCount+' record(s)'):(results.length.toLocaleString('bn-BD')+' জন • '+resultRecordCount.toLocaleString('bn-BD')+'টি রেকর্ড')):(en?'Search to see results':'সার্চ করলে ফলাফল দেখাবে')}</span>
      </div>
    </section>

    {!hasIntent&&<section className="house-dir-guide">
      <Search/>
      <div>
        <b>{en?'Search the published list':'প্রকাশিত তালিকায় খুঁজুন'}</b>
        <p>{en?'Type a name, designation, office/department, point, current house or seat. You can also filter by group and allocation type.':'নাম, পদবি, অফিস/বিভাগ, পয়েন্ট, বর্তমান বাসা বা সিট লিখুন। চাইলে কর্মকর্তা/কর্মচারী/কারিগরি এবং বাসা/সিট ফিল্টারও ব্যবহার করতে পারবেন।'}</p>
      </div>
    </section>}

    {hasIntent&&<section className="house-dir-results-head">
      <div><SlidersHorizontal/><span>{en?'Search results':'অনুসন্ধানের ফলাফল'}</span></div>
      <b>{results.length.toLocaleString(en?'en-US':'bn-BD')}</b>
    </section>}

    <section className="house-dir-results">
      {visibleResults.map(function(g){
        const x=g.primary;
        const s=sourceFor(x.sourceId);
        return <article className="house-dir-person-card" key={g.key}>
          <div className="house-dir-rank-strip">
            <div className="house-dir-rank-serial">
              <span>{en?'Serial no.':'ক্রমিক নং'}</span>
              <strong>{numberLabel(x.position,en)}</strong>
            </div>
            <div className="house-dir-rank-summary">
              <b>{en?('Serial '+numberLabel(x.position,true)+' / '+numberLabel(x.listTotal,true)):('ক্রমিক '+numberLabel(x.position,false)+' / '+numberLabel(x.listTotal,false))}</b>
              <small>{en?(x.sectionEn+' • position '+ordinalLabel(x.position,true)):(x.sectionBn+' • অবস্থান '+ordinalLabel(x.position,false))}</small>
            </div>
          </div>
          <div className="house-dir-person-main">
            <div className="house-dir-avatar"><UserRound/></div>
            <div className="house-dir-person-copy">
              <div className="house-dir-result-tags">
                <span>{en?x.groupEn:x.groupBn}</span>
                <span>{x.allocationType==='seat'?(en?'Seat':'সিট বরাদ্দ'):(en?'House':'বাসা বরাদ্দ')}</span>
                <span className={'house-dir-status '+x.status}>{en?s.statusEn:s.statusBn}</span>
                {nq&&<span className="house-dir-match-badge">{matchReasonLabel(x.matchReason,en)}</span>}
                {g.items.length>1&&<span className="house-dir-multi-badge">{en?(g.items.length+' published records'):(g.items.length.toLocaleString('bn-BD')+'টি প্রকাশিত রেকর্ড')}</span>}
              </div>
              <h3><Highlight text={x.name} q={q}/></h3>
              {x.roleOffice&&<p className="house-dir-role"><Building2/><span><Highlight text={x.roleOffice} q={q}/></span></p>}
            </div>
          </div>

          <div className="house-dir-person-meta">
            {x.point&&<div><BadgeCheck/><span>{en?'Point':'পয়েন্ট'}</span><b>{x.point}</b></div>}
            <div><FileText/><span>{en?'Source page':'উৎস পৃষ্ঠা'}</span><b>{x.sourcePage.toLocaleString(en?'en-US':'bn-BD')}</b></div>
          </div>

          {x.request&&<div className="house-dir-request"><MapPin/><p><Highlight text={x.request} q={q}/></p></div>}

          <div className="house-dir-card-footer">
            <span>{en?x.categoryEn:x.categoryBn}</span>
            <button onClick={function(){setSelected({group:g,record:x})}}>{en?'View details':'বিস্তারিত দেখুন'}<ChevronRight/></button>
          </div>
        </article>
      })}

      {hasIntent&&results.length===0&&<div className="house-dir-empty">
        <FileSearch/>
        <div><b>{en?'No matching record found':'মিল পাওয়া যায়নি'}</b><p>{en?'Try a shorter name, office/department, point, house or seat number.':'নামের ছোট অংশ, অফিস/বিভাগ, পয়েন্ট, বাসা বা সিট নম্বর দিয়ে আবার খুঁজুন।'}</p></div>
      </div>}

      {results.length>visibleResults.length&&<button className="house-dir-more" onClick={function(){setLimit(function(v){return v+60})}}>
        {en?'Show more results':'আরও ফলাফল দেখুন'} <span>{(results.length-visibleResults.length).toLocaleString(en?'en-US':'bn-BD')}</span>
      </button>}
    </section>

    {selected&&<div className="house-dir-modal-backdrop" onMouseDown={function(){setSelected(null)}}>
      <section className="house-dir-modal" onMouseDown={function(e){e.stopPropagation()}} role="dialog" aria-modal="true">
        <div className="house-dir-modal-head">
          <div><small>{en?'ALLOCATION RECORD':'বরাদ্দ তথ্য'}</small><h3>{selectedRecord.name}</h3></div>
          <button onClick={function(){setSelected(null)}} aria-label={en?'Close':'বন্ধ করুন'}><X/></button>
        </div>
        <div className="house-dir-rank-hero">
          <div className="house-dir-rank-big">
            <span>{en?'Serial no.':'ক্রমিক নং'}</span>
            <strong>{numberLabel(selectedRecord.position,en)}</strong>
          </div>
          <div className="house-dir-rank-stats">
            <div><span>{en?'Position in this section':'এই অংশে অবস্থান'}</span><b>{ordinalLabel(selectedRecord.position,en)}</b></div>
            <div><span>{en?'Last serial in this section':'এই অংশের শেষ ক্রমিক'}</span><b>{numberLabel(selectedRecord.listTotal,en)}</b></div>
            <p>{en?('Section serial '+numberLabel(selectedRecord.position,true)+' / '+numberLabel(selectedRecord.listTotal,true)):('এই অংশের ক্রমিক '+numberLabel(selectedRecord.position,false)+' / '+numberLabel(selectedRecord.listTotal,false))}</p>
          </div>
        </div>
        <div className="house-dir-part-label">
          <span>{en?'PDF section / part':'PDF-এর অংশ / তালিকা'}</span>
          <b>{en?selectedRecord.sectionEn:selectedRecord.sectionBn}</b>
          <small>{en?('Source pages '+selectedRecord.sectionPages):('উৎস পৃষ্ঠা '+selectedRecord.sectionPages)}</small>
        </div>
        <div className="house-dir-modal-grid">
          <div><span>{en?'Group':'ধরন'}</span><b>{en?selectedRecord.groupEn:selectedRecord.groupBn}</b></div>
          <div><span>{en?'Allocation':'বরাদ্দ'}</span><b>{selectedRecord.allocationType==='seat'?(en?'Seat':'সিট'):(en?'House':'বাসা')}</b></div>
          {selectedRecord.point&&<div><span>{en?'Point':'পয়েন্ট'}</span><b>{selectedRecord.point}</b></div>}
          <div><span>{en?'Source page':'উৎস পৃষ্ঠা'}</span><b>{selectedRecord.sourcePage.toLocaleString(en?'en-US':'bn-BD')}</b></div>
        </div>
        {selectedFields.designation&&<div className="house-dir-structured-fields">
          <div><span>{en?'Designation':'পদবি'}</span><p>{selectedFields.designation}</p></div>
          {selectedFields.office&&<div><span>{en?'Office / department':'অফিস / বিভাগ'}</span><p>{selectedFields.office}</p></div>}
        </div>}
        {selectedRecord.request&&<div className="house-dir-detail-block"><span>{en?'Application / allocation note':'আবেদন / বরাদ্দ সংক্রান্ত তথ্য'}</span><p>{selectedRecord.request}</p></div>}
        {selected.group.items.length>1&&<div className="house-dir-record-history">
          <div className="house-dir-record-history-head">
            <b>{en?'Published records with this exact name':'এই নামে প্রকাশিত রেকর্ডসমূহ'}</b>
            <span>{selected.group.items.length.toLocaleString(en?'en-US':'bn-BD')}</span>
          </div>
          <div className="house-dir-record-history-list">
            {selected.group.items.map(function(r){
              return <button key={r.id} className={selectedRecord.id===r.id?'active':''} onClick={function(){setSelected({group:selected.group,record:r})}}>
                <strong>{en?('Serial '+numberLabel(r.position,true)):('ক্রমিক '+numberLabel(r.position,false))}</strong>
                <span>{en?r.sectionEn:r.sectionBn}</span>
                <small>{en?('Page '+r.sourcePage):('পৃষ্ঠা '+r.sourcePage.toLocaleString('bn-BD'))}</small>
              </button>
            })}
          </div>
        </div>}
        <div className="house-dir-detail-block source"><span>{en?'Published source':'প্রকাশিত উৎস'}</span><p>{safeSourceTitle(sourceFor(selectedRecord.sourceId),en)} — {en?'page':'পৃষ্ঠা'} {selectedRecord.sourcePage.toLocaleString(en?'en-US':'bn-BD')}</p></div>
        <details className="house-dir-raw"><summary>{en?'See original extracted row text':'উৎস থেকে নেওয়া মূল অংশ দেখুন'}</summary><p>{selectedRecord.raw}</p></details>
      </section>
    </div>}
  </div>;
}
