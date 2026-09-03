
import React,{useEffect,useMemo,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {
  LayoutDashboard,TrendingUp,WalletCards,Users,ShieldCheck,LogOut,
  Plus,Search,UserRound,Building2,IdCard,Activity,ChevronRight,X,
  Save,Trash2,RefreshCw,Settings,Database,LockKeyhole
} from 'lucide-react';
import './styles.css';

const API=import.meta.env.VITE_API_BASE||'';

async function api(path,opts={}){
  const r=await fetch(API+path,{
    credentials:'include',
    headers:{'Content-Type':'application/json',...(opts.headers||{})},
    ...opts
  });
  const d=await r.json().catch(()=>({}));
  if(!r.ok) throw new Error(d.error||d.detail||'Request failed');
  return d;
}

const roleLabel={
  super_admin:'Super Admin',
  admin:'Admin',
  department_admin:'Department Admin',
  editor:'Editor',
  employee:'Employee'
};

function Login({onLogin}){
  const[email,setEmail]=useState('');
  const[password,setPassword]=useState('');
  const[err,setErr]=useState('');
  const[busy,setBusy]=useState(false);

  async function submit(e){
    e.preventDefault();
    setErr('');
    setBusy(true);
    try{
      const x=await api('/api/login',{
        method:'POST',
        body:JSON.stringify({email,password})
      });
      onLogin(x.user);
    }catch(e){setErr(e.message)}
    finally{setBusy(false)}
  }

  return <div className="login-shell">
    <form className="login-card" onSubmit={submit}>
      <div className="logo">ক-ক</div>
      <h1>DU Employee ERP</h1>
      <p>স্বেচ্ছাসেবী ডিজিটাল সেবা প্ল্যাটফর্ম</p>

      <label>ইমেইল
        <input value={email} onChange={e=>setEmail(e.target.value)} type="email" required />
      </label>

      <label>পাসওয়ার্ড
        <input value={password} onChange={e=>setPassword(e.target.value)} type="password" required />
      </label>

      {err&&<div className="error">{err}</div>}

      <button disabled={busy}>{busy?'লগইন হচ্ছে...':'লগইন'}</button>
      <small>এটি কোনো অফিসিয়াল ঢাকা বিশ্ববিদ্যালয় ERP নয়।</small>
    </form>
  </div>
}

function Stat({label,value,icon:Icon}){
  return <article className="stat-card">
    <div className="stat-icon"><Icon size={19}/></div>
    <div><small>{label}</small><b>{value}</b></div>
  </article>
}

function DashboardHome({user}){
  return <>
    <section className="hero">
      <div>
        <span>PHASE 2</span>
        <h1>Employee ERP Foundation</h1>
        <p>Secure Login, D1 Database, Employee Management এবং Admin foundation এখন কার্যকর।</p>
      </div>
      <div className="hero-chip"><Activity size={16}/> System Active</div>
    </section>

    <section className="stats-grid">
      <Stat label="Role" value={roleLabel[user.role]||user.role} icon={ShieldCheck}/>
      <Stat label="Employee ID" value={user.employee_id||'—'} icon={IdCard}/>
      <Stat label="Account Status" value="Active" icon={Activity}/>
      <Stat label="Security" value="Session Protected" icon={LockKeyhole}/>
    </section>

    <section className="module-grid">
      <article className="module-card">
        <div className="module-icon"><TrendingUp/></div>
        <h3>পদোন্নতি কেন্দ্র</h3>
        <p>বর্তমান Promotion Calculator এখানে migrate করা হবে।</p>
        <button className="ghost-btn">শীঘ্রই <ChevronRight size={16}/></button>
      </article>

      <article className="module-card">
        <div className="module-icon green"><WalletCards/></div>
        <h3>বেতন ও পে-স্কেল ERP</h3>
        <p>বর্তমান Salary ERP এই workspace-এর মধ্যে integrate হবে।</p>
        <button className="ghost-btn">শীঘ্রই <ChevronRight size={16}/></button>
      </article>
    </section>

    <section className="notice">
      <b>দ্রষ্টব্য</b>
      <p>এটি ব্যক্তিগত ও স্বেচ্ছাসেবী উদ্যোগ। অফিসিয়াল সিদ্ধান্তে সংশ্লিষ্ট কর্তৃপক্ষের নোটিশ/বিধি/আদেশ অনুসরণ করতে হবে।</p>
    </section>
  </>
}

function EmployeeModal({open,onClose,onSaved,editing}){
  const [form,setForm]=useState({
    employee_id:'',name_bn:'',name_en:'',mobile:'',email:'',
    designation:'',department_id:'',grade:'',basic_salary:'',
    joining_date:'',current_position:'',current_position_joining_date:'',
    service_status:'active',employment_type:''
  });
  const[busy,setBusy]=useState(false);
  const[err,setErr]=useState('');

  useEffect(()=>{
    if(editing){
      setForm({
        employee_id:editing.employee_id||'',
        name_bn:editing.name_bn||'',
        name_en:editing.name_en||'',
        mobile:editing.mobile||'',
        email:editing.email||'',
        designation:editing.designation||'',
        department_id:editing.department_id||'',
        grade:editing.grade||'',
        basic_salary:editing.basic_salary||'',
        joining_date:editing.joining_date||'',
        current_position:editing.current_position||'',
        current_position_joining_date:editing.current_position_joining_date||'',
        service_status:editing.service_status||'active',
        employment_type:editing.employment_type||''
      });
    }
  },[editing]);

  if(!open)return null;

  function change(k,v){setForm(f=>({...f,[k]:v}))}

  async function save(e){
    e.preventDefault();
    setBusy(true);setErr('');
    try{
      const payload={...form,
        grade:form.grade?Number(form.grade):null,
        basic_salary:form.basic_salary?Number(form.basic_salary):null,
        department_id:form.department_id?Number(form.department_id):null
      };
      if(editing){
        await api('/api/employees/'+editing.id,{method:'PUT',body:JSON.stringify(payload)});
      }else{
        await api('/api/employees',{method:'POST',body:JSON.stringify(payload)});
      }
      onSaved();
      onClose();
    }catch(e){setErr(e.message)}
    finally{setBusy(false)}
  }

  return <div className="modal-backdrop">
    <div className="modal-card">
      <div className="modal-head">
        <div><h3>{editing?'Employee Edit':'নতুন Employee'}</h3><p>প্রয়োজনীয় চাকরি ও যোগাযোগের তথ্য দিন।</p></div>
        <button className="icon-btn" onClick={onClose}><X/></button>
      </div>

      <form onSubmit={save} className="form-grid">
        <label>Employee ID<input required value={form.employee_id} onChange={e=>change('employee_id',e.target.value)}/></label>
        <label>নাম (বাংলা)<input required value={form.name_bn} onChange={e=>change('name_bn',e.target.value)}/></label>
        <label>নাম (English)<input value={form.name_en} onChange={e=>change('name_en',e.target.value)}/></label>
        <label>মোবাইল<input value={form.mobile} onChange={e=>change('mobile',e.target.value)}/></label>
        <label>ইমেইল<input type="email" value={form.email} onChange={e=>change('email',e.target.value)}/></label>
        <label>পদবি<input value={form.designation} onChange={e=>change('designation',e.target.value)}/></label>
        <label>গ্রেড<input type="number" min="1" max="20" value={form.grade} onChange={e=>change('grade',e.target.value)}/></label>
        <label>বেসিক বেতন<input type="number" min="0" value={form.basic_salary} onChange={e=>change('basic_salary',e.target.value)}/></label>
        <label>প্রথম যোগদানের তারিখ<input type="date" value={form.joining_date} onChange={e=>change('joining_date',e.target.value)}/></label>
        <label>বর্তমান পদ<input value={form.current_position} onChange={e=>change('current_position',e.target.value)}/></label>
        <label>বর্তমান পদে যোগদানের তারিখ<input type="date" value={form.current_position_joining_date} onChange={e=>change('current_position_joining_date',e.target.value)}/></label>
        <label>Employment Type<input value={form.employment_type} onChange={e=>change('employment_type',e.target.value)}/></label>
        <label>Service Status
          <select value={form.service_status} onChange={e=>change('service_status',e.target.value)}>
            <option value="active">Active</option>
            <option value="retired">Retired</option>
            <option value="on_leave">On Leave</option>
            <option value="inactive">Inactive</option>
          </select>
        </label>

        {err&&<div className="error span-2">{err}</div>}

        <div className="modal-actions span-2">
          <button type="button" className="secondary" onClick={onClose}>বাতিল</button>
          <button disabled={busy}><Save size={16}/>{busy?'সংরক্ষণ হচ্ছে...':'সংরক্ষণ'}</button>
        </div>
      </form>
    </div>
  </div>
}

function EmployeeManagement(){
  const[list,setList]=useState([]);
  const[loading,setLoading]=useState(true);
  const[q,setQ]=useState('');
  const[modal,setModal]=useState(false);
  const[editing,setEditing]=useState(null);
  const[err,setErr]=useState('');

  async function load(){
    setLoading(true);setErr('');
    try{
      const x=await api('/api/employees');
      setList(x.employees||[]);
    }catch(e){setErr(e.message)}
    finally{setLoading(false)}
  }

  useEffect(()=>{load()},[]);

  const filtered=useMemo(()=>{
    const s=q.trim().toLowerCase();
    if(!s)return list;
    return list.filter(x=>
      [x.employee_id,x.name_bn,x.name_en,x.designation,x.email,x.mobile]
      .some(v=>String(v||'').toLowerCase().includes(s))
    )
  },[q,list]);

  async function remove(emp){
    if(!confirm(`${emp.name_bn||emp.employee_id} মুছে ফেলবেন?`))return;
    try{
      await api('/api/employees/'+emp.id,{method:'DELETE'});
      load();
    }catch(e){alert(e.message)}
  }

  return <>
    <div className="page-head">
      <div><h2>Employee Management</h2><p>কর্মকর্তা-কর্মচারীর মূল profile ও service information পরিচালনা করুন।</p></div>
      <button onClick={()=>{setEditing(null);setModal(true)}}><Plus size={17}/> নতুন Employee</button>
    </div>

    <div className="toolbar">
      <div className="search"><Search size={17}/><input placeholder="Employee ID, নাম, পদবি..." value={q} onChange={e=>setQ(e.target.value)}/></div>
      <button className="secondary" onClick={load}><RefreshCw size={16}/> Refresh</button>
    </div>

    {err&&<div className="error">{err}</div>}

    <div className="table-card">
      {loading?<div className="empty">Loading...</div>:
      filtered.length===0?<div className="empty">কোনো Employee record পাওয়া যায়নি।</div>:
      <div className="table-wrap"><table>
        <thead><tr><th>Employee</th><th>পদবি</th><th>গ্রেড</th><th>যোগদান</th><th>Status</th><th></th></tr></thead>
        <tbody>{filtered.map(emp=><tr key={emp.id}>
          <td><b>{emp.name_bn||'—'}</b><small>{emp.employee_id} · {emp.email||'ইমেইল নেই'}</small></td>
          <td>{emp.designation||emp.current_position||'—'}</td>
          <td>{emp.grade||'—'}</td>
          <td>{emp.joining_date||'—'}</td>
          <td><span className={'badge '+(emp.service_status||'active')}>{emp.service_status||'active'}</span></td>
          <td className="actions">
            <button className="icon-btn" onClick={()=>{setEditing(emp);setModal(true)}}><Settings size={16}/></button>
            <button className="icon-btn danger" onClick={()=>remove(emp)}><Trash2 size={16}/></button>
          </td>
        </tr>)}</tbody>
      </table></div>}
    </div>

    <EmployeeModal open={modal} editing={editing} onClose={()=>setModal(false)} onSaved={load}/>
  </>
}

function AdminPanel(){
  const[stats,setStats]=useState(null);
  const[err,setErr]=useState('');

  async function load(){
    try{setStats(await api('/api/admin/stats'))}
    catch(e){setErr(e.message)}
  }
  useEffect(()=>{load()},[]);

  return <>
    <div className="page-head">
      <div><h2>Admin Panel</h2><p>System health, database status এবং account overview.</p></div>
    </div>

    {err&&<div className="error">{err}</div>}

    <section className="stats-grid">
      <Stat label="Total Employees" value={stats?.employees??'—'} icon={Users}/>
      <Stat label="Active Employees" value={stats?.active_employees??'—'} icon={Activity}/>
      <Stat label="Total Users" value={stats?.users??'—'} icon={UserRound}/>
      <Stat label="Departments" value={stats?.departments??'—'} icon={Building2}/>
    </section>

    <section className="admin-grid">
      <article className="admin-card"><Database/><div><h3>D1 Database</h3><p>Connected এবং operational.</p></div></article>
      <article className="admin-card"><ShieldCheck/><div><h3>Role Security</h3><p>Admin-only API routes protected.</p></div></article>
      <article className="admin-card"><LockKeyhole/><div><h3>Session Security</h3><p>HttpOnly secure cookie session enabled.</p></div></article>
    </section>
  </>
}

function App(){
  const[user,setUser]=useState(null);
  const[loading,setLoading]=useState(true);
  const[page,setPage]=useState('dashboard');

  useEffect(()=>{
    api('/api/me').then(x=>setUser(x.user)).catch(()=>{}).finally(()=>setLoading(false))
  },[]);

  async function logout(){
    try{await api('/api/logout',{method:'POST'})}catch{}
    setUser(null);
  }

  if(loading)return <div className="loading">Loading...</div>;
  if(!user)return <Login onLogin={setUser}/>;

  const admin=['super_admin','admin','department_admin'].includes(user.role);

  return <div className="app">
    <aside className="side">
      <div className="brand">
        <div className="logo small">ক-ক</div>
        <div><b>DU Employee ERP</b><small>Zero-Cost Foundation</small></div>
      </div>

      <nav>
        <button className={page==='dashboard'?'active':''} onClick={()=>setPage('dashboard')}><LayoutDashboard size={18}/> আমার ড্যাশবোর্ড</button>
        <button><TrendingUp size={18}/> পদোন্নতি</button>
        <button><WalletCards size={18}/> বেতন ও পে-স্কেল</button>
        {admin&&<button className={page==='employees'?'active':''} onClick={()=>setPage('employees')}><Users size={18}/> Employee Management</button>}
        {admin&&<button className={page==='admin'?'active':''} onClick={()=>setPage('admin')}><ShieldCheck size={18}/> Admin Panel</button>}
      </nav>
    </aside>

    <main>
      <header>
        <div>
          <h2>স্বাগতম, {user.name}</h2>
          <p>{roleLabel[user.role]||user.role}</p>
        </div>
        <button className="logout" onClick={logout}><LogOut size={16}/> লগআউট</button>
      </header>

      {page==='dashboard'&&<DashboardHome user={user}/>}
      {page==='employees'&&admin&&<EmployeeManagement/>}
      {page==='admin'&&admin&&<AdminPanel/>}
    </main>
  </div>
}

createRoot(document.getElementById('root')).render(<App/>);
