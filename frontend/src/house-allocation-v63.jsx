import React,{useEffect,useMemo,useState} from 'react';
import {
  AlertTriangle,BadgeCheck,Building2,ChevronRight,FileSearch,FileText,Home,
  ListFilter,MapPin,Search,SlidersHorizontal,UserRound,Users,X
} from 'lucide-react';
import DATA from './house-allocation-data-v63.js';
import './house-directory-v63.css';

const BN_DIGITS='০১২৩৪৫৬৭৮৯';
const VISIBLE_GROUPS=new Set(['officer','employee','technical']);
const ROLE_RE=/(পরিচালক|উপ-পরীক্ষা নিয়ন্ত্রক|পরীক্ষা নিয়ন্ত্রক|রেজিস্ট্রার|ডেপুটি রেজিস্ট্রার|সহকারী রেজিস্ট্রার|সিনিয়র প্রশাসনিক কর্মকর্তা|সি\. প্রশাসনিক কর্মকর্তা|প্রশাসনিক কর্মকর্তা|সিনিয়র টেকনিক্যাল অফিসার|টেকনিক্যাল অফিসার|প্রিন্সিপ্যাল মুয়াজ্জিন|সিনিয়র অফিস সহায়ক|অফিস সহায়ক|সিনিয়র দপ্তরী|দপ্তরী|সিনিয়র নিরাপত্তা প্রহরী|নিরাপত্তা প্রহরী|সিনিয়র স্টোনোগ্রাফার|স্টোনোগ্রাফার|প্রধান সহকারী|উচ্চমান সহকারী|সহকারী হিসাবরক্ষক|জুনিয়র সহকারী হিসাবরক্ষক|হিসাবরক্ষক|কেয়ারটেকার|সিনিয়র লাইব্রেরী সহকারী|লাইব্রেরী সহকারী|সিনিয়র প্লাম্বার|প্লাম্বার|সিনিয়র ল্যাব সহকারী|ল্যাব সহকারী|ল্যাবরেটরী সহকারী|ল্যাবরেটরী টেকনেশিয়ান|টেকনেশিয়ান|সিনিয়র কম্পাউন্ডার|কম্পাউন্ডার|ড্রাইভার|টিনস্মিথ|ক্রাফট ইন্সট্রাক্টর|ক্রাফট ইন্সট্রাক্টট|রাজমিস্ত্রী|ফিল্টার অপারেটর|মেশিন অপারেটর|লিফটম্যান|গেস্টেনার মেশিন অপারেটর|সেলস ম্যান|স্টোর কিপার|সটার্র|বার্তাবাহক|মুয়াজ্জিন)/;

function normalize(v){
  return String(v||'')
    .toLowerCase()
    .replace(/[০-৯]/g,function(d){return String(BN_DIGITS.indexOf(d))})
    .replace(/[\u200c\u200d]/g,'')
    .replace(/[–—]/g,'-')
    .replace(/\s+/g,' ')
    .trim();
}
function sourceFor(id){return DATA.sources.find(function(x){return x.id===id})||{}}
function escapeRegExp(v){return String(v||'').replace(/[.*+?^$()|[\]{}\\]/g,'\\$&')}
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
  const m=value.match(ROLE_RE);
  if(!m)return {name:cleanName(value),roleOffice:''};
  const i=m.index||0;
  return {name:cleanName(value.slice(0,i)),roleOffice:value.slice(i).trim()};
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
    const pointIndex=point?segment.indexOf(point):-1;
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
  const [selected,setSelected]=useState(null);
  const [limit,setLimit]=useState(60);
  const nq=normalize(q);

  const visiblePages=useMemo(function(){
    return DATA.pages.filter(function(x){return VISIBLE_GROUPS.has(x.group)});
  },[]);

  const records=useMemo(function(){
    return visiblePages.flatMap(parsePage).filter(function(x){return x.name&&x.name.length>1});
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

  useEffect(function(){setLimit(60)},[q,group,kind,category]);

  const filtered=useMemo(function(){
    return records.filter(function(x){
      if(group!=='all'&&x.group!==group)return false;
      if(kind!=='all'&&x.allocationType!==kind)return false;
      if(category!=='all'&&x.category!==category)return false;
      if(!nq)return true;
      const s=sourceFor(x.sourceId);
      return normalize([
        x.name,x.roleOffice,x.point,x.request,x.raw,x.groupBn,x.groupEn,
        x.categoryBn,x.categoryEn,safeSourceTitle(s,false),safeSourceTitle(s,true)
      ].join(' ')).includes(nq);
    });
  },[records,group,kind,category,nq]);

  const hasIntent=Boolean(nq)||group!=='all'||kind!=='all'||category!=='all';
  const results=hasIntent?filtered:[];
  const visibleResults=results.slice(0,limit);
  const visibleSourceIds=new Set(records.map(function(x){return x.sourceId}));
  const visibleSources=DATA.sources.filter(function(s){return visibleSourceIds.has(s.id)});

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
        <span>{hasIntent?(en?(results.length+' result(s)'):(results.length.toLocaleString('bn-BD')+'টি ফলাফল')):(en?'Search to see results':'সার্চ করলে ফলাফল দেখাবে')}</span>
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
      {visibleResults.map(function(x){
        const s=sourceFor(x.sourceId);
        return <article className="house-dir-person-card" key={x.id}>
          <div className="house-dir-person-main">
            <div className="house-dir-avatar"><UserRound/></div>
            <div className="house-dir-person-copy">
              <div className="house-dir-result-tags">
                <span>{en?x.groupEn:x.groupBn}</span>
                <span>{x.allocationType==='seat'?(en?'Seat':'সিট বরাদ্দ'):(en?'House':'বাসা বরাদ্দ')}</span>
                <span className={'house-dir-status '+x.status}>{en?s.statusEn:s.statusBn}</span>
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
            <button onClick={function(){setSelected(x)}}>{en?'View details':'বিস্তারিত দেখুন'}<ChevronRight/></button>
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
          <div><small>{en?'ALLOCATION RECORD':'বরাদ্দ তথ্য'}</small><h3>{selected.name}</h3></div>
          <button onClick={function(){setSelected(null)}} aria-label={en?'Close':'বন্ধ করুন'}><X/></button>
        </div>
        <div className="house-dir-modal-grid">
          <div><span>{en?'Group':'ধরন'}</span><b>{en?selected.groupEn:selected.groupBn}</b></div>
          <div><span>{en?'Allocation':'বরাদ্দ'}</span><b>{selected.allocationType==='seat'?(en?'Seat':'সিট'):(en?'House':'বাসা')}</b></div>
          {selected.point&&<div><span>{en?'Point':'পয়েন্ট'}</span><b>{selected.point}</b></div>}
          <div><span>{en?'Source page':'উৎস পৃষ্ঠা'}</span><b>{selected.sourcePage.toLocaleString(en?'en-US':'bn-BD')}</b></div>
        </div>
        {selected.roleOffice&&<div className="house-dir-detail-block"><span>{en?'Designation / office / current listing':'পদবি / অফিস / বর্তমান তালিকা'}</span><p>{selected.roleOffice}</p></div>}
        {selected.request&&<div className="house-dir-detail-block"><span>{en?'Application / allocation note':'আবেদন / বরাদ্দ সংক্রান্ত তথ্য'}</span><p>{selected.request}</p></div>}
        <div className="house-dir-detail-block source"><span>{en?'Published source':'প্রকাশিত উৎস'}</span><p>{safeSourceTitle(sourceFor(selected.sourceId),en)} — {en?'page':'পৃষ্ঠা'} {selected.sourcePage.toLocaleString(en?'en-US':'bn-BD')}</p></div>
        <details className="house-dir-raw"><summary>{en?'See source-row text':'উৎসের সংশ্লিষ্ট অংশ দেখুন'}</summary><p>{selected.raw}</p></details>
      </section>
    </div>}
  </div>;
}
