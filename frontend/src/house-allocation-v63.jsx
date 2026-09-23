import React,{useMemo,useState} from 'react';
import {AlertTriangle,ChevronRight,FileSearch,FileText,Home,ListFilter,Search,Users,X} from 'lucide-react';
import DATA from './house-allocation-data-v63.js';
import './house-directory-v63.css';

const BN_DIGITS='০১২৩৪৫৬৭৮৯';
function normalize(v){
  return String(v||'').toLowerCase().replace(/[০-৯]/g,function(d){return String(BN_DIGITS.indexOf(d))}).replace(/[\u200c\u200d]/g,'').replace(/\s+/g,' ').trim();
}
function shortText(text,q){
  const src=String(text||''),needle=normalize(q);
  if(!needle)return src.slice(0,360)+(src.length>360?'…':'');
  const norm=normalize(src),i=norm.indexOf(needle);
  if(i<0)return src.slice(0,360)+(src.length>360?'…':'');
  const start=Math.max(0,i-150),end=Math.min(src.length,i+needle.length+360);
  return (start>0?'…':'')+src.slice(start,end)+(end<src.length?'…':'');
}
function sourceFor(id){return DATA.sources.find(function(x){return x.id===id})||{}}

export default function HouseAllocationDirectory({lang='bn',onOpenPoints}){
  const en=lang==='en';
  const [q,setQ]=useState('');
  const [group,setGroup]=useState('all');
  const [category,setCategory]=useState('all');
  const nq=normalize(q);
  const groupOptions=[
    ['all',en?'All':'সব',FileSearch],['teacher',en?'Teachers':'শিক্ষক',Users],
    ['officer',en?'Officers':'কর্মকর্তা',Users],['employee',en?'Employees':'কর্মচারী',Users],
    ['technical',en?'Technical':'কারিগরি',Users]
  ];
  const categories=useMemo(function(){
    const rows=DATA.pages.filter(function(x){return group==='all'||x.group===group}),seen=new Map();
    rows.forEach(function(x){if(!seen.has(x.category))seen.set(x.category,en?x.categoryEn:x.categoryBn)});
    return Array.from(seen.entries());
  },[group,en]);
  const results=useMemo(function(){
    return DATA.pages.filter(function(x){
      if(group!=='all'&&x.group!==group)return false;
      if(category!=='all'&&x.category!==category)return false;
      if(!nq)return true;
      const s=sourceFor(x.sourceId);
      return normalize([x.text,x.groupBn,x.groupEn,x.categoryBn,x.categoryEn,s.titleBn,s.titleEn].join(' ')).includes(nq);
    });
  },[group,category,nq,en]);
  function chooseGroup(v){setGroup(v);setCategory('all')}

  return <div className="house-dir-v63">
    <section className="house-dir-hero">
      <div className="house-dir-hero-icon"><Home/></div>
      <div className="house-dir-hero-copy">
        <small>{en?'PUBLISHED HOUSING INFORMATION':'প্রকাশিত বাসা/সিট তথ্য'}</small>
        <h2>{en?'House & Seat Allocation Information':'বাসা ও সিট বরাদ্দ তথ্য'}</h2>
        <p>{en?'Search the published committee panels and draft lists by name, designation, office/department, point, current house or seat.':'নাম, পদবি, অফিস/বিভাগ, পয়েন্ট, বর্তমান বাসা বা সিট দিয়ে প্রকাশিত কমিটি/প্যানেল ও খসড়া তালিকায় খুঁজুন।'}</p>
      </div>
      {onOpenPoints&&<button className="house-dir-points-btn" onClick={onOpenPoints}>{en?'Point calculator':'পয়েন্ট হিসাব'}<ChevronRight/></button>}
    </section>

    <section className="house-dir-disclaimer"><AlertTriangle/><div><b>{en?'Important notice':'গুরুত্বপূর্ণ ঘোষণা'}</b><p>{en?'This is not an official University of Dhaka app. Information is presented in searchable form from published source lists/panels. For a final decision, follow the latest official notice/order of the University.':'এটি ঢাকা বিশ্ববিদ্যালয়ের অফিসিয়াল অ্যাপ নয়। প্রকাশিত উৎস তালিকা/প্যানেলের তথ্য অনুসন্ধানযোগ্যভাবে উপস্থাপন করা হয়েছে। চূড়ান্ত সিদ্ধান্তের জন্য বিশ্ববিদ্যালয়ের সর্বশেষ অফিসিয়াল নোটিশ/আদেশ অনুসরণ করুন।'}</p></div></section>

    <section className="house-dir-sources">
      {DATA.sources.map(function(s){return <article key={s.id}><div><FileText/><span className={'house-dir-status '+s.status}>{en?s.statusEn:s.statusBn}</span></div><h3>{en?s.titleEn:s.titleBn}</h3><p>{en?s.noteEn:s.noteBn}</p><small>{en?'Source pages':'উৎস পৃষ্ঠা'}: {s.pages}</small></article>})}
    </section>

    <section className="house-dir-search-panel">
      <div className="house-dir-search"><Search/><input value={q} onChange={function(e){setQ(e.target.value)}} placeholder={en?'Search name, designation, office, point, house or seat':'নাম, পদবি, অফিস, পয়েন্ট, বাসা বা সিট দিয়ে খুঁজুন'} autoComplete="off"/>{q&&<button onClick={function(){setQ('')}} aria-label={en?'Clear':'মুছুন'}><X/></button>}</div>
      <div className="house-dir-groups">{groupOptions.map(function(row){const id=row[0],label=row[1],Icon=row[2];return <button key={id} className={group===id?'active':''} onClick={function(){chooseGroup(id)}}><Icon/>{label}</button>})}</div>
      <div className="house-dir-filter"><ListFilter/><select value={category} onChange={function(e){setCategory(e.target.value)}}><option value="all">{en?'All categories':'সব ক্যাটাগরি'}</option>{categories.map(function(row){return <option key={row[0]} value={row[0]}>{row[1]}</option>})}</select><span>{en?(results.length+' matching page(s)'):(results.length.toLocaleString('bn-BD')+'টি মিল পাওয়া পৃষ্ঠা')}</span></div>
    </section>

    {!nq&&group==='all'&&category==='all'&&<section className="house-dir-guide"><Search/><div><b>{en?'Start with a name or point':'নাম বা পয়েন্ট লিখে শুরু করুন'}</b><p>{en?'You may also select Teachers, Officers, Employees or Technical staff to browse a specific published list.':'অথবা শিক্ষক, কর্মকর্তা, কর্মচারী বা কারিগরি নির্বাচন করে নির্দিষ্ট প্রকাশিত তালিকা ব্রাউজ করুন।'}</p></div></section>}

    <section className="house-dir-results">
      {results.map(function(x){const s=sourceFor(x.sourceId);return <article className="house-dir-result" key={x.id}><div className="house-dir-result-top"><div className="house-dir-result-tags"><span>{en?x.groupEn:x.groupBn}</span><span>{en?x.categoryEn:x.categoryBn}</span><span className={'house-dir-status '+x.status}>{en?s.statusEn:s.statusBn}</span></div><b>{en?'Page':'পৃষ্ঠা'} {x.page.toLocaleString(en?'en-US':'bn-BD')}</b></div><h3>{en?s.titleEn:s.titleBn}</h3><p className="house-dir-snippet">{shortText(x.text,q)}</p><div className="house-dir-source-line"><FileText/><span>{en?'Match found in published source page':'প্রকাশিত উৎসের এই পৃষ্ঠায় মিল পাওয়া গেছে'} {x.page.toLocaleString(en?'en-US':'bn-BD')}</span></div></article>})}
      {results.length===0&&<div className="house-dir-empty"><FileSearch/><div><b>{en?'No matching record found':'মিল পাওয়া যায়নি'}</b><p>{en?'Try a shorter name, office/department, point or house/seat number.':'নামের ছোট অংশ, অফিস/বিভাগ, পয়েন্ট বা বাসা/সিট নম্বর দিয়ে আবার খুঁজুন।'}</p></div></div>}
    </section>
  </div>;
}
