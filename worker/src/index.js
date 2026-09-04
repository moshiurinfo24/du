
const json=(d,s=200,h={})=>new Response(JSON.stringify(d),{status:s,headers:{'content-type':'application/json; charset=utf-8',...h}});
const enc=new TextEncoder();

function cors(req){
  const o=req.headers.get('Origin')||'*';
  return{'Access-Control-Allow-Origin':o,'Access-Control-Allow-Credentials':'true','Access-Control-Allow-Headers':'Content-Type','Access-Control-Allow-Methods':'GET,POST,PUT,DELETE,OPTIONS','Vary':'Origin'};
}
function b64(b){return btoa(String.fromCharCode(...new Uint8Array(b)))}
function ub64(s){return Uint8Array.from(atob(s),c=>c.charCodeAt(0))}
async function sha(s){return b64(await crypto.subtle.digest('SHA-256',enc.encode(s)))}
async function derive(p,s){const k=await crypto.subtle.importKey('raw',enc.encode(p),'PBKDF2',false,['deriveBits']);return b64(await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt:s,iterations:100000},k,256))}
async function mkpass(p){const s=crypto.getRandomValues(new Uint8Array(16));return{salt:b64(s),hash:await derive(p,s)}}
async function ver(p,s,h){return(await derive(p,ub64(s)))===h}
function cookies(req){return Object.fromEntries((req.headers.get('Cookie')||'').split(';').map(x=>x.trim()).filter(Boolean).map(x=>{const i=x.indexOf('=');return[x.slice(0,i),decodeURIComponent(x.slice(i+1))]}))}
async function me(req,env){const t=cookies(req).du_session;if(!t)return null;const h=await sha(t);return env.DB.prepare(`SELECT u.id,u.employee_id,u.name,u.email,u.role,COALESCE(u.account_type,'employee') account_type,COALESCE(u.email_verified,1) email_verified FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>CURRENT_TIMESTAMP AND u.is_active=1`).bind(h).first()}
function canManage(user){return user&&['super_admin','admin','department_admin'].includes(user.role)}
function canDelete(user){return user&&['super_admin','admin'].includes(user.role)}
async function audit(env,user,action,type,id,metadata={}){try{await env.DB.prepare(`INSERT INTO audit_logs(user_id,action,entity_type,entity_id,metadata) VALUES(?,?,?,?,?)`).bind(user.id,action,type,String(id||''),JSON.stringify(metadata)).run()}catch{}}

const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function d1First(env,sql,binds=[]){
  let last=null;
  for(let i=0;i<2;i++){
    try{
      let q=env.DB.prepare(sql);
      if(binds.length)q=q.bind(...binds);
      return await q.first();
    }catch(e){last=e;if(i===0)await sleep(40)}
  }
  throw last;
}
async function d1All(env,sql,binds=[]){
  let last=null;
  for(let i=0;i<2;i++){
    try{
      let q=env.DB.prepare(sql);
      if(binds.length)q=q.bind(...binds);
      const x=await q.all();
      return x?.results||[];
    }catch(e){last=e;if(i===0)await sleep(40)}
  }
  throw last;
}
async function safeCount(env,sql,binds=[]){
  try{const x=await d1First(env,sql,binds);return +(x?.c||0)}catch{return 0}
}
async function safeRows(env,sql,binds=[]){
  try{return await d1All(env,sql,binds)}catch{return []}
}

function emailNorm(v){return String(v||'').trim().toLowerCase()}
function strongPassword(p){return typeof p==='string'&&p.length>=10&&/[A-Za-z]/.test(p)&&/\d/.test(p)}
function safeName(v){return String(v||'').trim().slice(0,120)}
function makeRecoveryCode(){
  const alphabet='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes=crypto.getRandomValues(new Uint8Array(16));
  let s=''; for(let i=0;i<16;i++)s+=alphabet[bytes[i]%alphabet.length];
  return `${s.slice(0,4)}-${s.slice(4,8)}-${s.slice(8,12)}-${s.slice(12,16)}`;
}
function normalizeRecoveryCode(v){return String(v||'').toUpperCase().replace(/[^A-Z0-9]/g,'')}
async function recoveryHash(code){return sha(normalizeRecoveryCode(code))}

export default{async fetch(req,env){
  const C=cors(req);
  if(req.method==='OPTIONS')return new Response(null,{status:204,headers:C});
  const u=new URL(req.url);
  try{
    if(u.pathname==='/api/health')return json({ok:true,service:'Employee Service ERP API',phase:'16.3.4-stable-admin-api'},200,C);

    // Phase 8 FREE: self-service registration and recovery code password reset
    if(u.pathname==='/api/register'&&req.method==='POST'){
      const b=await req.json(),name=safeName(b.name),email=emailNorm(b.email),password=String(b.password||''),accountType=['officer','employee'].includes(b.account_type)?b.account_type:'employee';
      if(!name||!email||!email.includes('@'))return json({error:'Valid name and email are required'},400,C);
      if(!strongPassword(password))return json({error:'Password must be at least 10 characters and include letters and numbers'},400,C);
      const exists=await env.DB.prepare('SELECT id FROM users WHERE email=?').bind(email).first();
      if(exists)return json({error:'An account already exists with this email'},409,C);
      const p=await mkpass(password),recoveryCode=makeRecoveryCode(),rh=await recoveryHash(recoveryCode);
      const r=await env.DB.prepare(`INSERT INTO users(name,email,password_hash,password_salt,role,is_active,account_type,email_verified,recovery_code_hash,registered_at) VALUES(?,?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP)`)
        .bind(name,email,p.hash,p.salt,'employee',1,accountType,1,rh).run();
      return json({ok:true,recoveryCode,message:'Account created. Save the recovery code now; it will not be shown again.'},201,C);
    }

    if(u.pathname==='/api/reset-password-recovery'&&req.method==='POST'){
      const b=await req.json(),email=emailNorm(b.email),password=String(b.password||''),rh=await recoveryHash(b.recovery_code);
      if(!strongPassword(password))return json({error:'Password must be at least 10 characters and include letters and numbers'},400,C);
      const x=await env.DB.prepare(`SELECT id FROM users WHERE email=? AND recovery_code_hash=? AND is_active=1`).bind(email,rh).first();
      if(!x)return json({error:'Email or recovery code is incorrect'},400,C);
      const p=await mkpass(password);
      await env.DB.prepare(`UPDATE users SET password_hash=?,password_salt=? WHERE id=?`).bind(p.hash,p.salt,x.id).run();
      await env.DB.prepare(`DELETE FROM sessions WHERE user_id=?`).bind(x.id).run();
      return json({ok:true,message:'Password reset completed'},200,C);
    }

    if(u.pathname==='/api/login'&&req.method==='POST'){
      const b=await req.json();
      const x=await env.DB.prepare('SELECT * FROM users WHERE email=? AND is_active=1').bind(String(b.email||'').toLowerCase()).first();
      if(!x||!(await ver(String(b.password||''),x.password_salt,x.password_hash))){
        try{await env.DB.prepare(`INSERT INTO login_events(user_id,email,success) VALUES(?,?,0)`).bind(x?.id||null,emailNorm(b.email)).run()}catch{}
        return json({error:'ইমেইল বা পাসওয়ার্ড সঠিক নয়'},401,C);
      }
      await env.DB.prepare('DELETE FROM sessions WHERE expires_at<=CURRENT_TIMESTAMP').run();
      const raw=b64(crypto.getRandomValues(new Uint8Array(32))),h=await sha(raw),exp=new Date(Date.now()+604800000).toISOString();
      await env.DB.prepare('INSERT INTO sessions(user_id,token_hash,expires_at) VALUES(?,?,?)').bind(x.id,h,exp).run();
      try{await env.DB.prepare(`INSERT INTO login_events(user_id,email,success) VALUES(?,?,1)`).bind(x.id,x.email).run()}catch{}
      return json({user:{id:x.id,employee_id:x.employee_id,name:x.name,email:x.email,role:x.role,account_type:x.account_type||'employee',email_verified:+x.email_verified===1}},200,{...C,'Set-Cookie':`du_session=${encodeURIComponent(raw)}; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=604800`});
    }

    if(u.pathname==='/api/logout'&&req.method==='POST'){
      const t=cookies(req).du_session;if(t)await env.DB.prepare('DELETE FROM sessions WHERE token_hash=?').bind(await sha(t)).run();
      return json({ok:true},200,{...C,'Set-Cookie':'du_session=; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=0'});
    }

    const user=await me(req,env);
    if(u.pathname==='/api/me'){if(!user)return json({error:'Unauthenticated'},401,C);return json({user},200,C)}

    if(u.pathname==='/api/my-security/logout-others'&&req.method==='POST'){
      if(!user)return json({error:'Unauthenticated'},401,C);
      const t=cookies(req).du_session;
      if(!t)return json({error:'Current session not found'},401,C);
      const currentHash=await sha(t);
      await env.DB.prepare(`DELETE FROM sessions WHERE user_id=? AND token_hash<>?`).bind(user.id,currentHash).run();
      await audit(env,user,'logout_other_sessions','session',user.id,{});
      return json({ok:true,message:'Other sessions signed out'},200,C);
    }

    if(u.pathname==='/api/change-password'&&req.method==='POST'){
      if(!user)return json({error:'Unauthenticated'},401,C);
      const b=await req.json(),current=String(b.current_password||''),next=String(b.new_password||'');
      if(!strongPassword(next))return json({error:'New password must be at least 10 characters and include letters and numbers'},400,C);
      const x=await env.DB.prepare(`SELECT password_hash,password_salt FROM users WHERE id=?`).bind(user.id).first();
      if(!x||!(await ver(current,x.password_salt,x.password_hash)))return json({error:'Current password is incorrect'},401,C);
      const p=await mkpass(next);
      await env.DB.prepare(`UPDATE users SET password_hash=?,password_salt=? WHERE id=?`).bind(p.hash,p.salt,user.id).run();
      const t=cookies(req).du_session;
      if(t)await env.DB.prepare(`DELETE FROM sessions WHERE user_id=? AND token_hash<>?`).bind(user.id,await sha(t)).run();
      await audit(env,user,'password_change','user',user.id,{});
      return json({ok:true,message:'Password changed successfully'},200,C);
    }

    // Phase 9: Personal Digital Service Book
    if(u.pathname==='/api/my-career'&&req.method==='GET'){
      if(!user)return json({error:'Unauthenticated'},401,C);
      const [profile,education,events]=await Promise.all([
        env.DB.prepare(`SELECT * FROM career_profiles WHERE user_id=?`).bind(user.id).first(),
        env.DB.prepare(`SELECT * FROM career_education WHERE user_id=? ORDER BY COALESCE(passing_year,0) DESC,id DESC`).bind(user.id).all(),
        env.DB.prepare(`SELECT * FROM career_events WHERE user_id=? ORDER BY event_date DESC,id DESC`).bind(user.id).all()
      ]);
      return json({profile:profile||null,education:education.results||[],events:events.results||[]},200,C);
    }
    if(u.pathname==='/api/my-career/profile'&&req.method==='PUT'){
      if(!user)return json({error:'Unauthenticated'},401,C);
      const b=await req.json();
      await env.DB.prepare(`INSERT INTO career_profiles(user_id,first_joining_date,current_post,current_grade,current_post_joining_date,employment_type,office_name,department_name,employee_reference,retirement_age,notes,updated_at)
        VALUES(?,?,?,?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP)
        ON CONFLICT(user_id) DO UPDATE SET first_joining_date=excluded.first_joining_date,current_post=excluded.current_post,current_grade=excluded.current_grade,current_post_joining_date=excluded.current_post_joining_date,employment_type=excluded.employment_type,office_name=excluded.office_name,department_name=excluded.department_name,employee_reference=excluded.employee_reference,retirement_age=excluded.retirement_age,notes=excluded.notes,updated_at=CURRENT_TIMESTAMP`)
        .bind(user.id,b.first_joining_date||null,b.current_post||null,b.current_grade?Number(b.current_grade):null,b.current_post_joining_date||null,b.employment_type||null,b.office_name||null,b.department_name||null,b.employee_reference||null,b.retirement_age?Number(b.retirement_age):null,b.notes||null).run();
      await audit(env,user,'career_profile_update','career_profile',user.id,{});
      return json({ok:true},200,C);
    }
    if(u.pathname==='/api/my-career/education'&&req.method==='POST'){
      if(!user)return json({error:'Unauthenticated'},401,C);
      const b=await req.json();if(!String(b.level||'').trim())return json({error:'Education level is required'},400,C);
      const r=await env.DB.prepare(`INSERT INTO career_education(user_id,level,institution,subject,passing_year,result,notes) VALUES(?,?,?,?,?,?,?)`)
        .bind(user.id,String(b.level).trim(),b.institution||null,b.subject||null,b.passing_year?Number(b.passing_year):null,b.result||null,b.notes||null).run();
      await audit(env,user,'career_education_create','career_education',r.meta?.last_row_id,{});
      return json({ok:true,id:r.meta?.last_row_id||null},201,C);
    }
    const ce=u.pathname.match(/^\/api\/my-career\/education\/(\d+)$/);
    if(ce&&req.method==='DELETE'){
      if(!user)return json({error:'Unauthenticated'},401,C);
      const id=Number(ce[1]);await env.DB.prepare(`DELETE FROM career_education WHERE id=? AND user_id=?`).bind(id,user.id).run();
      await audit(env,user,'career_education_delete','career_education',id,{});
      return json({ok:true},200,C);
    }
    if(u.pathname==='/api/my-career/events'&&req.method==='POST'){
      if(!user)return json({error:'Unauthenticated'},401,C);
      const b=await req.json();if(!b.event_type||!b.event_date||!String(b.title||'').trim())return json({error:'Event type, date and title are required'},400,C);
      const allowed=['appointment','promotion','transfer','increment','training','grade_change','other'];if(!allowed.includes(b.event_type))return json({error:'Invalid event type'},400,C);
      const r=await env.DB.prepare(`INSERT INTO career_events(user_id,event_type,event_date,title,post_name,grade,office_name,reference_no,notes) VALUES(?,?,?,?,?,?,?,?,?)`)
        .bind(user.id,b.event_type,b.event_date,String(b.title).trim(),b.post_name||null,b.grade?Number(b.grade):null,b.office_name||null,b.reference_no||null,b.notes||null).run();
      await audit(env,user,'career_event_create','career_event',r.meta?.last_row_id,{event_type:b.event_type});
      return json({ok:true,id:r.meta?.last_row_id||null},201,C);
    }
    const cev=u.pathname.match(/^\/api\/my-career\/events\/(\d+)$/);
    if(cev&&req.method==='DELETE'){
      if(!user)return json({error:'Unauthenticated'},401,C);
      const id=Number(cev[1]);await env.DB.prepare(`DELETE FROM career_events WHERE id=? AND user_id=?`).bind(id,user.id).run();
      await audit(env,user,'career_event_delete','career_event',id,{});
      return json({ok:true},200,C);
    }

    // Phase 11.1 analytics usage tracking
    if(u.pathname==='/api/usage'&&req.method==='POST'){
      if(!user)return json({error:'Unauthenticated'},401,C);
      const b=await req.json(),module=String(b.module||'').trim().slice(0,40);
      const allowed=['dashboard','career','promotion','salary','calculators','library','account','employees','directory','admin'];
      if(!allowed.includes(module))return json({ok:true},200,C);
      try{await env.DB.prepare(`INSERT INTO usage_events(user_id,module) VALUES(?,?)`).bind(user.id,module).run()}catch{}
      return json({ok:true},201,C);
    }

    if(u.pathname==='/api/admin/dashboard-analytics'&&req.method==='GET'){
      if(!canManage(user))return json({error:'Forbidden'},403,C);
      const now=new Date(),days=[];
      for(let i=6;i>=0;i--){const d=new Date(now);d.setDate(d.getDate()-i);days.push(d.toISOString().slice(0,10))}
      // Stability fix: avoid a large burst of concurrent D1 queries.
      // Each query retries once and optional analytics tables degrade to 0/[] instead of 500.
      const totalUsers=await safeCount(env,`SELECT COUNT(*) c FROM users`);
      const activeUsers=await safeCount(env,`SELECT COUNT(*) c FROM users WHERE is_active=1`);
      const officers=await safeCount(env,`SELECT COUNT(*) c FROM users WHERE account_type='officer'`);
      const employees=await safeCount(env,`SELECT COUNT(*) c FROM users WHERE COALESCE(account_type,'employee')='employee'`);
      const profiles=await safeCount(env,`SELECT COUNT(*) c FROM career_profiles`);
      const deps=await safeCount(env,`SELECT COUNT(*) c FROM departments`);
      const desigs=await safeCount(env,`SELECT COUNT(*) c FROM designations WHERE is_active=1`);
      const notices=await safeCount(env,`SELECT COUNT(*) c FROM notices WHERE is_active=1`);
      const policies=await safeCount(env,`SELECT COUNT(*) c FROM policies WHERE is_active=1`);
      const activeSessions=await safeCount(env,`SELECT COUNT(*) c FROM sessions WHERE expires_at>CURRENT_TIMESTAMP`);
      const expiredSessions=await safeCount(env,`SELECT COUNT(*) c FROM sessions WHERE expires_at<=CURRENT_TIMESTAMP`);
      const inactiveUsers=await safeCount(env,`SELECT COUNT(*) c FROM users WHERE is_active=0`);
      const recoveryUsers=await safeCount(env,`SELECT COUNT(*) c FROM users WHERE recovery_code_hash IS NOT NULL AND recovery_code_hash<>''`);
      const todayViews=await safeCount(env,`SELECT COUNT(*) c FROM public_events WHERE date(created_at,'localtime')=date('now','localtime')`);
      const todayUnique=await safeCount(env,`SELECT COUNT(DISTINCT visitor_hash) c FROM public_events WHERE date(created_at,'localtime')=date('now','localtime')`);
      const todayCalculatorViews=await safeCount(env,`SELECT COUNT(*) c FROM public_events WHERE date(created_at,'localtime')=date('now','localtime') AND section IN ('promotion_calculator','pay_scale_calculator')`);
      const returningToday=await safeCount(env,`SELECT COUNT(DISTINCT p.visitor_hash) c FROM public_events p WHERE date(p.created_at,'localtime')=date('now','localtime') AND EXISTS (SELECT 1 FROM public_events old WHERE old.visitor_hash=p.visitor_hash AND date(old.created_at,'localtime')<date('now','localtime'))`);
      const todayLoginSuccess=await safeCount(env,`SELECT COUNT(*) c FROM login_events WHERE success=1 AND date(created_at,'localtime')=date('now','localtime')`);
      const todayLoginFailed=await safeCount(env,`SELECT COUNT(*) c FROM login_events WHERE success=0 AND date(created_at,'localtime')=date('now','localtime')`);
      const todayLoginUnique=await safeCount(env,`SELECT COUNT(DISTINCT user_id) c FROM login_events WHERE success=1 AND user_id IS NOT NULL AND date(created_at,'localtime')=date('now','localtime')`);
      const todayLoginAttempts=await safeCount(env,`SELECT COUNT(*) c FROM login_events WHERE date(created_at,'localtime')=date('now','localtime')`);

      const usage=await safeRows(env,`SELECT module,COUNT(*) c FROM usage_events GROUP BY module ORDER BY c DESC LIMIT 7`);
      const recentUsers=await safeRows(env,`SELECT id,name,email,role,is_active,COALESCE(account_type,'employee') account_type FROM users ORDER BY id DESC LIMIT 6`);
      const recentAudit=await safeRows(env,`SELECT a.id,a.action,a.created_at,u.name user_name FROM audit_logs a LEFT JOIN users u ON u.id=a.user_id ORDER BY a.id DESC LIMIT 6`);
      const activity=await safeRows(env,`SELECT substr(created_at,1,10) day,COUNT(*) c FROM usage_events WHERE created_at>=datetime('now','-7 days') GROUP BY substr(created_at,1,10)`);
      const hourlyRows=await safeRows(env,`SELECT CAST(strftime('%H',created_at,'localtime') AS INTEGER) hour,COUNT(*) c FROM public_events WHERE date(created_at,'localtime')=date('now','localtime') GROUP BY hour ORDER BY hour`);
      const loginDaily=await safeRows(env,`SELECT date(created_at,'localtime') day,COUNT(*) c FROM login_events WHERE success=1 AND created_at>=datetime('now','-7 days') GROUP BY date(created_at,'localtime')`);
      const recentLogins=await safeRows(env,`SELECT l.id,l.email,l.success,l.created_at,u.name user_name FROM login_events l LEFT JOIN users u ON u.id=l.user_id ORDER BY l.id DESC LIMIT 10`);

      const amap=Object.fromEntries(activity.map(r=>[r.day,+r.c]));
      const lmap=Object.fromEntries(loginDaily.map(r=>[r.day,+r.c]));
      const hmap=Object.fromEntries(hourlyRows.map(r=>[+r.hour,+r.c]));
      const maxHour=Math.max(1,...Object.values(hmap));

      return json({
        kpis:{total_users:totalUsers,active_users:activeUsers,officers,employees,career_profiles:profiles,departments:deps,designations:desigs,notices,policies},
        health:{ok:true,active_sessions:activeSessions,expired_sessions:expiredSessions,inactive_users:inactiveUsers,recovery_ready_users:recoveryUsers},
        usage:usage.map(r=>({label:r.module,value:+r.c})),
        activity_trend:days.map(d=>({label:d.slice(5),value:amap[d]||0})),
        recent_users:recentUsers,
        recent_audit:recentAudit,
        traffic:{today_views:todayViews,today_unique:todayUnique,today_calculator_views:todayCalculatorViews,returning_today:returningToday},
        login:{today_success:todayLoginSuccess,today_failed:todayLoginFailed,today_unique_users:todayLoginUnique,today_attempts:todayLoginAttempts},
        hourly_traffic:Array.from({length:24},(_,hour)=>({hour,views:hmap[hour]||0,percent:Math.round(((hmap[hour]||0)/maxHour)*100)})),
        login_trend:days.map(d=>({label:d.slice(5),value:lmap[d]||0})),
        recent_logins:recentLogins
      },200,C);
    }

    if(u.pathname==='/api/phase-status'&&req.method==='GET'){
      return json({ok:true,phase:'15',routes:{my_career:true,admin_analytics:true,usage:true,recovery:true,login_analytics:true,public_traffic:true,salary_history:true,personal_leave_record:true}},200,C);
    }

    // Phase 12: Personal Salary & Pay History
    if(u.pathname==='/api/my-salary-history'&&req.method==='GET'){
      if(!user)return json({error:'Unauthenticated'},401,C);
      const x=await env.DB.prepare(`SELECT * FROM salary_history WHERE user_id=? ORDER BY effective_date DESC,id DESC`).bind(user.id).all();
      return json({items:x.results||[]},200,C);
    }
    if(u.pathname==='/api/my-salary-history'&&req.method==='POST'){
      if(!user)return json({error:'Unauthenticated'},401,C);
      const b=await req.json();
      if(!b.effective_date||!b.grade)return json({error:'Effective date and grade are required'},400,C);
      const r=await env.DB.prepare(`INSERT INTO salary_history(user_id,effective_date,grade,stage_2015,basic_2015,fixed_2026,payable_basic,gross_salary,total_deduction,net_salary,source,notes)
        VALUES(?,?,?,?,?,?,?,?,?,?,?,?)`)
        .bind(user.id,b.effective_date,Number(b.grade),Number(b.stage_2015||0),Number(b.basic_2015||0),Number(b.fixed_2026||0),Number(b.payable_basic||0),Number(b.gross_salary||0),Number(b.total_deduction||0),Number(b.net_salary||0),String(b.source||'manual').slice(0,30),b.notes||null).run();
      await audit(env,user,'salary_history_create','salary_history',r.meta?.last_row_id,{});
      return json({ok:true,id:r.meta?.last_row_id||null},201,C);
    }
    const salaryHistoryMatch=u.pathname.match(/^\/api\/my-salary-history\/(\d+)$/);
    if(salaryHistoryMatch&&req.method==='DELETE'){
      if(!user)return json({error:'Unauthenticated'},401,C);
      const id=Number(salaryHistoryMatch[1]);
      await env.DB.prepare(`DELETE FROM salary_history WHERE id=? AND user_id=?`).bind(id,user.id).run();
      await audit(env,user,'salary_history_delete','salary_history',id,{});
      return json({ok:true},200,C);
    }

    // Phase 14: Personal Leave Record
    if(u.pathname==='/api/my-leave-records'&&req.method==='GET'){
      if(!user)return json({error:'Unauthenticated'},401,C);
      const x=await env.DB.prepare(`SELECT * FROM personal_leave_records WHERE user_id=? ORDER BY start_date DESC,id DESC`).bind(user.id).all();
      return json({items:x.results||[]},200,C);
    }
    if(u.pathname==='/api/my-leave-records'&&req.method==='POST'){
      if(!user)return json({error:'Unauthenticated'},401,C);
      const b=await req.json();
      const allowed=['casual','earned','medical','maternity','paternity','study','special','other'];
      if(!allowed.includes(String(b.leave_type||'')))return json({error:'Invalid leave type'},400,C);
      if(!b.start_date||!b.end_date)return json({error:'Start and end dates are required'},400,C);
      const total=Number(b.total_days||0);
      if(!(total>0))return json({error:'Total days must be greater than zero'},400,C);
      const r=await env.DB.prepare(`INSERT INTO personal_leave_records(user_id,leave_type,start_date,end_date,day_mode,total_days,notes) VALUES(?,?,?,?,?,?,?)`)
        .bind(user.id,b.leave_type,b.start_date,b.end_date,b.day_mode==='half'?'half':'full',total,b.notes||null).run();
      await audit(env,user,'leave_record_create','personal_leave_record',r.meta?.last_row_id,{});
      return json({ok:true,id:r.meta?.last_row_id||null},201,C);
    }
    const lr=u.pathname.match(/^\/api\/my-leave-records\/(\d+)$/);
    if(lr&&req.method==='PUT'){
      if(!user)return json({error:'Unauthenticated'},401,C);
      const id=Number(lr[1]),b=await req.json();
      const allowed=['casual','earned','medical','maternity','paternity','study','special','other'];
      if(!allowed.includes(String(b.leave_type||'')))return json({error:'Invalid leave type'},400,C);
      const total=Number(b.total_days||0);
      if(!b.start_date||!b.end_date||!(total>0))return json({error:'Invalid leave record'},400,C);
      await env.DB.prepare(`UPDATE personal_leave_records SET leave_type=?,start_date=?,end_date=?,day_mode=?,total_days=?,notes=?,updated_at=CURRENT_TIMESTAMP WHERE id=? AND user_id=?`)
        .bind(b.leave_type,b.start_date,b.end_date,b.day_mode==='half'?'half':'full',total,b.notes||null,id,user.id).run();
      await audit(env,user,'leave_record_update','personal_leave_record',id,{});
      return json({ok:true},200,C);
    }
    if(lr&&req.method==='DELETE'){
      if(!user)return json({error:'Unauthenticated'},401,C);
      const id=Number(lr[1]);
      await env.DB.prepare(`DELETE FROM personal_leave_records WHERE id=? AND user_id=?`).bind(id,user.id).run();
      await audit(env,user,'leave_record_delete','personal_leave_record',id,{});
      return json({ok:true},200,C);
    }

    if(u.pathname==='/api/departments'&&req.method==='GET'){
      if(!user)return json({error:'Unauthenticated'},401,C);
      const x=await env.DB.prepare(`SELECT * FROM departments ORDER BY name_bn COLLATE NOCASE`).all();
      return json({departments:x.results||[]},200,C);
    }
    if(u.pathname==='/api/departments'&&req.method==='POST'){
      if(!canManage(user))return json({error:'Forbidden'},403,C);
      const b=await req.json();if(!b.name_bn)return json({error:'Department name required'},400,C);
      const r=await env.DB.prepare(`INSERT INTO departments(name_bn,name_en,type,phone,email,website) VALUES(?,?,?,?,?,?)`).bind(b.name_bn,b.name_en||null,b.type||'department',b.phone||null,b.email||null,b.website||null).run();
      await audit(env,user,'department_create','department',r.meta?.last_row_id,{name_bn:b.name_bn});
      return json({ok:true,id:r.meta?.last_row_id||null},201,C);
    }

    if(u.pathname==='/api/designations'&&req.method==='GET'){
      if(!user)return json({error:'Unauthenticated'},401,C);
      const x=await env.DB.prepare(`SELECT * FROM designations WHERE is_active=1 ORDER BY name_bn COLLATE NOCASE`).all();
      return json({designations:x.results||[]},200,C);
    }
    if(u.pathname==='/api/designations'&&req.method==='POST'){
      if(!canManage(user))return json({error:'Forbidden'},403,C);
      const b=await req.json();if(!b.name_bn)return json({error:'Designation name required'},400,C);
      const r=await env.DB.prepare(`INSERT INTO designations(name_bn,name_en,grade,is_active) VALUES(?,?,?,1)`).bind(b.name_bn,b.name_en||null,b.grade||null).run();
      await audit(env,user,'designation_create','designation',r.meta?.last_row_id,{name_bn:b.name_bn});
      return json({ok:true,id:r.meta?.last_row_id||null},201,C);
    }

    if(u.pathname==='/api/employees'&&req.method==='GET'){
      if(!canManage(user))return json({error:'Forbidden'},403,C);
      const x=await env.DB.prepare(`
        SELECT e.*,d.name_bn department_name_bn,d.name_en department_name_en,g.name_bn designation_name_bn,g.name_en designation_name_en
        FROM employees e
        LEFT JOIN departments d ON d.id=e.department_id
        LEFT JOIN designations g ON g.id=e.designation_id
        ORDER BY e.id DESC LIMIT 1000
      `).all();
      return json({employees:x.results||[]},200,C);
    }

    if(u.pathname==='/api/employees'&&req.method==='POST'){
      if(!canManage(user))return json({error:'Forbidden'},403,C);
      const b=await req.json();if(!b.employee_id||!b.name_bn)return json({error:'Employee ID এবং বাংলা নাম আবশ্যক'},400,C);
      if(b.photo_data&&b.photo_data.length>90000)return json({error:'Profile photo size too large'},400,C);
      const r=await env.DB.prepare(`
        INSERT INTO employees(employee_id,name_bn,name_en,father_name,mother_name,date_of_birth,nid_masked,mobile,email,blood_group,designation,designation_id,department_id,office_name,grade,basic_salary,joining_date,current_position,current_position_joining_date,service_status,employment_type,photo_data)
        VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
      `).bind(b.employee_id,b.name_bn,b.name_en||null,b.father_name||null,b.mother_name||null,b.date_of_birth||null,b.nid_masked||null,b.mobile||null,b.email||null,b.blood_group||null,b.designation||null,b.designation_id||null,b.department_id||null,b.office_name||null,b.grade||null,b.basic_salary||null,b.joining_date||null,b.current_position||null,b.current_position_joining_date||null,b.service_status||'active',b.employment_type||null,b.photo_data||null).run();
      await audit(env,user,'employee_create','employee',r.meta?.last_row_id,{employee_id:b.employee_id});
      return json({ok:true,id:r.meta?.last_row_id||null},201,C);
    }

    const emp=u.pathname.match(/^\/api\/employees\/(\d+)$/);
    if(emp&&req.method==='PUT'){
      if(!canManage(user))return json({error:'Forbidden'},403,C);
      const id=Number(emp[1]),b=await req.json();if(b.photo_data&&b.photo_data.length>90000)return json({error:'Profile photo size too large'},400,C);
      await env.DB.prepare(`
        UPDATE employees SET employee_id=?,name_bn=?,name_en=?,father_name=?,mother_name=?,date_of_birth=?,nid_masked=?,mobile=?,email=?,blood_group=?,designation=?,designation_id=?,department_id=?,office_name=?,grade=?,basic_salary=?,joining_date=?,current_position=?,current_position_joining_date=?,service_status=?,employment_type=?,photo_data=? WHERE id=?
      `).bind(b.employee_id,b.name_bn,b.name_en||null,b.father_name||null,b.mother_name||null,b.date_of_birth||null,b.nid_masked||null,b.mobile||null,b.email||null,b.blood_group||null,b.designation||null,b.designation_id||null,b.department_id||null,b.office_name||null,b.grade||null,b.basic_salary||null,b.joining_date||null,b.current_position||null,b.current_position_joining_date||null,b.service_status||'active',b.employment_type||null,b.photo_data||null,id).run();
      await audit(env,user,'employee_update','employee',id,{employee_id:b.employee_id});
      return json({ok:true},200,C);
    }

    if(emp&&req.method==='DELETE'){
      if(!canDelete(user))return json({error:'Forbidden'},403,C);
      const id=Number(emp[1]);await env.DB.prepare('DELETE FROM employees WHERE id=?').bind(id).run();
      await audit(env,user,'employee_delete','employee',id,{});
      return json({ok:true},200,C);
    }


    if(u.pathname==='/api/service-history'&&req.method==='GET'){
      if(!canManage(user))return json({error:'Forbidden'},403,C);
      const employeeId=Number(u.searchParams.get('employee_id')||0);
      if(!employeeId)return json({error:'employee_id required'},400,C);
      const x=await env.DB.prepare(`
        SELECT s.*,d.name_bn department_name_bn,
          CASE s.event_type
            WHEN 'appointment' THEN 'নিয়োগ'
            WHEN 'joining' THEN 'যোগদান'
            WHEN 'promotion' THEN 'পদোন্নতি'
            WHEN 'transfer' THEN 'বদলি/পোস্টিং'
            WHEN 'increment' THEN 'ইনক্রিমেন্ট'
            WHEN 'training' THEN 'প্রশিক্ষণ'
            WHEN 'grade_change' THEN 'গ্রেড পরিবর্তন'
            ELSE 'অন্যান্য'
          END event_type_label
        FROM service_history s
        LEFT JOIN departments d ON d.id=s.department_id
        WHERE s.employee_id=?
        ORDER BY s.event_date DESC,s.id DESC
      `).bind(employeeId).all();
      return json({events:x.results||[]},200,C);
    }

    if(u.pathname==='/api/service-history'&&req.method==='POST'){
      if(!canManage(user))return json({error:'Forbidden'},403,C);
      const b=await req.json();
      if(!b.employee_id||!b.event_type||!b.event_date||!b.title)return json({error:'Employee, event type, date এবং title আবশ্যক'},400,C);
      const r=await env.DB.prepare(`
        INSERT INTO service_history(employee_id,event_type,event_date,title,from_designation,to_designation,from_grade,to_grade,department_id,office_name,reference_no,notes,created_by)
        VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)
      `).bind(b.employee_id,b.event_type,b.event_date,b.title,b.from_designation||null,b.to_designation||null,b.from_grade||null,b.to_grade||null,b.department_id||null,b.office_name||null,b.reference_no||null,b.notes||null,user.id).run();
      await audit(env,user,'service_history_create','service_history',r.meta?.last_row_id,{employee_id:b.employee_id,event_type:b.event_type});
      return json({ok:true,id:r.meta?.last_row_id||null},201,C);
    }

    const sh=u.pathname.match(/^\/api\/service-history\/(\d+)$/);
    if(sh&&req.method==='PUT'){
      if(!canManage(user))return json({error:'Forbidden'},403,C);
      const id=Number(sh[1]),b=await req.json();
      await env.DB.prepare(`UPDATE service_history SET event_type=?,event_date=?,title=?,from_designation=?,to_designation=?,from_grade=?,to_grade=?,department_id=?,office_name=?,reference_no=?,notes=? WHERE id=?`)
        .bind(b.event_type,b.event_date,b.title,b.from_designation||null,b.to_designation||null,b.from_grade||null,b.to_grade||null,b.department_id||null,b.office_name||null,b.reference_no||null,b.notes||null,id).run();
      await audit(env,user,'service_history_update','service_history',id,{});
      return json({ok:true},200,C);
    }

    if(sh&&req.method==='DELETE'){
      if(!canDelete(user))return json({error:'Forbidden'},403,C);
      const id=Number(sh[1]);
      await env.DB.prepare('DELETE FROM service_history WHERE id=?').bind(id).run();
      await audit(env,user,'service_history_delete','service_history',id,{});
      return json({ok:true},200,C);
    }


    // Phase 6: public Notice Board + Policy Library
    if(u.pathname==='/api/public/notices'&&req.method==='GET'){
      const lim=Math.min(Math.max(Number(u.searchParams.get('limit')||6),1),50);
      const x=await env.DB.prepare(`SELECT id,title_bn,title_en,summary_bn,summary_en,category,publish_date,file_url,pinned,created_at
        FROM notices WHERE is_public=1 AND is_active=1 ORDER BY pinned DESC,COALESCE(publish_date,created_at) DESC,id DESC LIMIT ?`).bind(lim).all();
      return json({notices:x.results||[]},200,C);
    }
    if(u.pathname==='/api/public/policies'&&req.method==='GET'){
      const lim=Math.min(Math.max(Number(u.searchParams.get('limit')||6),1),50);
      const x=await env.DB.prepare(`SELECT id,title_bn,title_en,summary_bn,summary_en,category,reference_no,effective_date,publish_date,file_url,pinned,created_at
        FROM policies WHERE is_public=1 AND is_active=1 ORDER BY pinned DESC,COALESCE(publish_date,effective_date,created_at) DESC,id DESC LIMIT ?`).bind(lim).all();
      return json({policies:x.results||[]},200,C);
    }

    if(u.pathname==='/api/recovery-code/regenerate'&&req.method==='POST'){
      if(!user)return json({error:'Unauthenticated'},401,C);
      const b=await req.json(),current=String(b.current_password||'');
      const x=await env.DB.prepare(`SELECT password_hash,password_salt FROM users WHERE id=?`).bind(user.id).first();
      if(!x||!(await ver(current,x.password_salt,x.password_hash)))return json({error:'Current password is incorrect'},401,C);
      const recoveryCode=makeRecoveryCode(),rh=await recoveryHash(recoveryCode);
      await env.DB.prepare(`UPDATE users SET recovery_code_hash=? WHERE id=?`).bind(rh,user.id).run();
      await audit(env,user,'recovery_code_regenerate','user',user.id,{});
      return json({ok:true,recoveryCode,message:'New recovery code created. Save it now.'},200,C);
    }

    if(u.pathname==='/api/notices'&&req.method==='GET'){
      if(!user)return json({error:'Unauthenticated'},401,C);
      const x=await env.DB.prepare(`SELECT * FROM notices ORDER BY pinned DESC,COALESCE(publish_date,created_at) DESC,id DESC`).all();
      return json({notices:x.results||[]},200,C);
    }
    if(u.pathname==='/api/notices'&&req.method==='POST'){
      if(!canManage(user))return json({error:'Forbidden'},403,C);
      const b=await req.json(); if(!String(b.title_bn||'').trim())return json({error:'Bangla title required'},400,C);
      const r=await env.DB.prepare(`INSERT INTO notices(title_bn,title_en,summary_bn,summary_en,category,publish_date,file_url,is_public,is_active,pinned,created_by)
        VALUES(?,?,?,?,?,?,?,?,?,?,?)`).bind(b.title_bn.trim(),b.title_en||null,b.summary_bn||null,b.summary_en||null,b.category||'general',b.publish_date||null,b.file_url||null,b.is_public?1:0,b.is_active===false?0:1,b.pinned?1:0,user.id).run();
      await audit(env,user,'notice_create','notice',r.meta?.last_row_id,{title_bn:b.title_bn});
      return json({ok:true,id:r.meta?.last_row_id||null},201,C);
    }
    const notice=u.pathname.match(/^\/api\/notices\/(\d+)$/);
    if(notice&&req.method==='PUT'){
      if(!canManage(user))return json({error:'Forbidden'},403,C);
      const id=Number(notice[1]),b=await req.json(); if(!String(b.title_bn||'').trim())return json({error:'Bangla title required'},400,C);
      await env.DB.prepare(`UPDATE notices SET title_bn=?,title_en=?,summary_bn=?,summary_en=?,category=?,publish_date=?,file_url=?,is_public=?,is_active=?,pinned=?,updated_at=CURRENT_TIMESTAMP WHERE id=?`)
        .bind(b.title_bn.trim(),b.title_en||null,b.summary_bn||null,b.summary_en||null,b.category||'general',b.publish_date||null,b.file_url||null,b.is_public?1:0,b.is_active===false?0:1,b.pinned?1:0,id).run();
      await audit(env,user,'notice_update','notice',id,{});
      return json({ok:true},200,C);
    }
    if(notice&&req.method==='DELETE'){
      if(!canDelete(user))return json({error:'Forbidden'},403,C);
      const id=Number(notice[1]); await env.DB.prepare('DELETE FROM notices WHERE id=?').bind(id).run();
      await audit(env,user,'notice_delete','notice',id,{});
      return json({ok:true},200,C);
    }

    if(u.pathname==='/api/policies'&&req.method==='GET'){
      if(!user)return json({error:'Unauthenticated'},401,C);
      const x=await env.DB.prepare(`SELECT * FROM policies ORDER BY pinned DESC,COALESCE(publish_date,effective_date,created_at) DESC,id DESC`).all();
      return json({policies:x.results||[]},200,C);
    }
    if(u.pathname==='/api/policies'&&req.method==='POST'){
      if(!canManage(user))return json({error:'Forbidden'},403,C);
      const b=await req.json(); if(!String(b.title_bn||'').trim())return json({error:'Bangla title required'},400,C);
      const r=await env.DB.prepare(`INSERT INTO policies(title_bn,title_en,summary_bn,summary_en,category,reference_no,effective_date,publish_date,file_url,is_public,is_active,pinned,created_by)
        VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)`).bind(b.title_bn.trim(),b.title_en||null,b.summary_bn||null,b.summary_en||null,b.category||'general',b.reference_no||null,b.effective_date||null,b.publish_date||null,b.file_url||null,b.is_public?1:0,b.is_active===false?0:1,b.pinned?1:0,user.id).run();
      await audit(env,user,'policy_create','policy',r.meta?.last_row_id,{title_bn:b.title_bn});
      return json({ok:true,id:r.meta?.last_row_id||null},201,C);
    }
    const policy=u.pathname.match(/^\/api\/policies\/(\d+)$/);
    if(policy&&req.method==='PUT'){
      if(!canManage(user))return json({error:'Forbidden'},403,C);
      const id=Number(policy[1]),b=await req.json(); if(!String(b.title_bn||'').trim())return json({error:'Bangla title required'},400,C);
      await env.DB.prepare(`UPDATE policies SET title_bn=?,title_en=?,summary_bn=?,summary_en=?,category=?,reference_no=?,effective_date=?,publish_date=?,file_url=?,is_public=?,is_active=?,pinned=?,updated_at=CURRENT_TIMESTAMP WHERE id=?`)
        .bind(b.title_bn.trim(),b.title_en||null,b.summary_bn||null,b.summary_en||null,b.category||'general',b.reference_no||null,b.effective_date||null,b.publish_date||null,b.file_url||null,b.is_public?1:0,b.is_active===false?0:1,b.pinned?1:0,id).run();
      await audit(env,user,'policy_update','policy',id,{});
      return json({ok:true},200,C);
    }
    if(policy&&req.method==='DELETE'){
      if(!canDelete(user))return json({error:'Forbidden'},403,C);
      const id=Number(policy[1]); await env.DB.prepare('DELETE FROM policies WHERE id=?').bind(id).run();
      await audit(env,user,'policy_delete','policy',id,{});
      return json({ok:true},200,C);
    }

    if(u.pathname==='/api/admin/users'&&req.method==='GET'){
      if(!canManage(user))return json({error:'Forbidden'},403,C);
      const rows=await safeRows(env,`SELECT id,employee_id,name,email,role,is_active,COALESCE(account_type,'employee') account_type,COALESCE(email_verified,1) email_verified FROM users ORDER BY id DESC LIMIT 1000`);
      return json({users:rows},200,C);
    }
    const adminUserStatus=u.pathname.match(/^\/api\/admin\/users\/(\d+)\/status$/);
    if(adminUserStatus&&req.method==='PUT'){
      if(!user||!['super_admin','admin'].includes(user.role))return json({error:'Forbidden'},403,C);
      const id=Number(adminUserStatus[1]); if(id===user.id)return json({error:'You cannot deactivate your own active session account'},400,C);
      const b=await req.json(),active=b.is_active?1:0;
      await env.DB.prepare(`UPDATE users SET is_active=? WHERE id=?`).bind(active,id).run();
      if(!active)await env.DB.prepare(`DELETE FROM sessions WHERE user_id=?`).bind(id).run();
      await audit(env,user,'user_status_change','user',id,{is_active:active});
      return json({ok:true},200,C);
    }
    if(u.pathname==='/api/admin/audit'&&req.method==='GET'){
      if(!canManage(user))return json({error:'Forbidden'},403,C);
      const lim=Math.min(Math.max(Number(u.searchParams.get('limit')||80),1),200);
      const rows=await safeRows(env,`SELECT a.id,a.user_id,a.action,a.entity_type,a.entity_id,a.metadata,a.created_at,u.name user_name,u.email user_email
        FROM audit_logs a LEFT JOIN users u ON u.id=a.user_id ORDER BY a.id DESC LIMIT ?`,[lim]);
      return json({logs:rows},200,C);
    }
    if(u.pathname==='/api/admin/system-health'&&req.method==='GET'){
      if(!canManage(user))return json({error:'Forbidden'},403,C);
      const active=await safeCount(env,`SELECT COUNT(*) c FROM sessions WHERE expires_at>CURRENT_TIMESTAMP`);
      const expired=await safeCount(env,`SELECT COUNT(*) c FROM sessions WHERE expires_at<=CURRENT_TIMESTAMP`);
      const inactive=await safeCount(env,`SELECT COUNT(*) c FROM users WHERE is_active=0`);
      const recovery=await safeCount(env,`SELECT COUNT(*) c FROM users WHERE recovery_code_hash IS NOT NULL AND recovery_code_hash<>''`);
      const auditCount=await safeCount(env,`SELECT COUNT(*) c FROM audit_logs`);
      return json({ok:true,active_sessions:active,expired_sessions:expired,inactive_users:inactive,recovery_ready_users:recovery,audit_events:auditCount},200,C);
    }
    if(u.pathname==='/api/admin/settings'&&req.method==='GET'){
      if(!canManage(user))return json({error:'Forbidden'},403,C);
      const rows=await safeRows(env,`SELECT key,value FROM system_settings ORDER BY key`);
      return json({settings:Object.fromEntries(rows.map(r=>[r.key,r.value]))},200,C);
    }
    if(u.pathname==='/api/admin/settings'&&req.method==='PUT'){
      if(!user||!['super_admin','admin'].includes(user.role))return json({error:'Forbidden'},403,C);
      const b=await req.json(),allowed=['support_phone','whatsapp','calendar_enabled','calendar_source_url','maintenance_mode'];
      for(const key of allowed){
        if(Object.prototype.hasOwnProperty.call(b,key)){
          await env.DB.prepare(`INSERT INTO system_settings(key,value,updated_by,updated_at) VALUES(?,?,?,CURRENT_TIMESTAMP)
            ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_by=excluded.updated_by,updated_at=CURRENT_TIMESTAMP`).bind(key,String(b[key]??''),user.id).run();
        }
      }
      await audit(env,user,'system_settings_update','system_settings','global',{keys:allowed.filter(k=>Object.prototype.hasOwnProperty.call(b,k))});
      return json({ok:true},200,C);
    }


    // Phase 15: Fiscal Office Calendar (July 1 -> June 30)
    // Friday + Saturday are weekly holidays. Only stored OFFICE holidays are additionally closed.
    if(u.pathname==='/api/public/office-calendar'&&req.method==='GET'){
      const fy=String(u.searchParams.get('fy')||'2026-2027').trim(),m=fy.match(/^(\d{4})-(\d{4})$/);
      if(!m||Number(m[2])!==Number(m[1])+1)return json({error:'Invalid fiscal year'},400,C);
      const start=`${m[1]}-07-01`,end=`${m[2]}-06-30`;
      const x=await env.DB.prepare(`SELECT id,holiday_date,title_bn,title_en,notes_bn,notes_en,source_url FROM office_calendar_holidays WHERE fiscal_year=? AND is_active=1 AND holiday_date BETWEEN ? AND ? ORDER BY holiday_date,id`).bind(fy,start,end).all();
      return json({fiscal_year:fy,start_date:start,end_date:end,weekend_days:[5,6],source_url:'https://www.du.ac.bd/du_post_details/notice/27726',unofficial_reference:true,holidays:x.results||[]},200,C);
    }
    if(u.pathname==='/api/admin/office-calendar'&&req.method==='GET'){
      if(!canManage(user))return json({error:'Forbidden'},403,C);
      const fy=String(u.searchParams.get('fy')||'2026-2027').trim();
      const x=await env.DB.prepare(`SELECT * FROM office_calendar_holidays WHERE fiscal_year=? ORDER BY holiday_date,id`).bind(fy).all();
      return json({fiscal_year:fy,holidays:x.results||[]},200,C);
    }
    if(u.pathname==='/api/admin/office-calendar'&&req.method==='POST'){
      if(!user||!['super_admin','admin'].includes(user.role))return json({error:'Forbidden'},403,C);
      const b=await req.json(),fy=String(b.fiscal_year||'2026-2027').trim(),date=String(b.holiday_date||'').trim();
      if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!/^\d{4}-\d{4}$/.test(fy))return json({error:'Fiscal year and holiday date are required'},400,C);
      if(!String(b.title_bn||'').trim())return json({error:'Bangla holiday title is required'},400,C);
      const r=await env.DB.prepare(`INSERT INTO office_calendar_holidays(fiscal_year,holiday_date,title_bn,title_en,notes_bn,notes_en,source_url,is_active,created_by) VALUES(?,?,?,?,?,?,?,?,?)`).bind(fy,date,String(b.title_bn).trim(),b.title_en||null,b.notes_bn||null,b.notes_en||null,b.source_url||'https://www.du.ac.bd/du_post_details/notice/27726',b.is_active===false?0:1,user.id).run();
      await audit(env,user,'office_calendar_create','office_calendar',r.meta?.last_row_id,{fiscal_year:fy,holiday_date:date});
      return json({ok:true,id:r.meta?.last_row_id||null},201,C);
    }
    const officeCalendarMatch=u.pathname.match(/^\/api\/admin\/office-calendar\/(\d+)$/);
    if(officeCalendarMatch&&req.method==='PUT'){
      if(!user||!['super_admin','admin'].includes(user.role))return json({error:'Forbidden'},403,C);
      const id=Number(officeCalendarMatch[1]),b=await req.json();
      if(!String(b.title_bn||'').trim()||!/^\d{4}-\d{2}-\d{2}$/.test(String(b.holiday_date||'')))return json({error:'Holiday date and Bangla title are required'},400,C);
      await env.DB.prepare(`UPDATE office_calendar_holidays SET fiscal_year=?,holiday_date=?,title_bn=?,title_en=?,notes_bn=?,notes_en=?,source_url=?,is_active=?,updated_at=CURRENT_TIMESTAMP WHERE id=?`).bind(String(b.fiscal_year||'2026-2027'),String(b.holiday_date),String(b.title_bn).trim(),b.title_en||null,b.notes_bn||null,b.notes_en||null,b.source_url||'https://www.du.ac.bd/du_post_details/notice/27726',b.is_active===false?0:1,id).run();
      return json({ok:true},200,C);
    }
    if(officeCalendarMatch&&req.method==='DELETE'){
      if(!user||!['super_admin','admin'].includes(user.role))return json({error:'Forbidden'},403,C);
      await env.DB.prepare(`DELETE FROM office_calendar_holidays WHERE id=?`).bind(Number(officeCalendarMatch[1])).run();
      return json({ok:true},200,C);
    }

    if(u.pathname==='/api/admin/stats'&&req.method==='GET'){
      if(!canManage(user))return json({error:'Forbidden'},403,C);
      const employeesCount=await safeCount(env,'SELECT COUNT(*) c FROM employees');
      const activeEmployees=await safeCount(env,"SELECT COUNT(*) c FROM employees WHERE service_status='active'");
      const usersCount=await safeCount(env,'SELECT COUNT(*) c FROM users');
      const departmentsCount=await safeCount(env,'SELECT COUNT(*) c FROM departments');
      const designationsCount=await safeCount(env,'SELECT COUNT(*) c FROM designations WHERE is_active=1');
      return json({employees:employeesCount,active_employees:activeEmployees,users:usersCount,departments:departmentsCount,designations:designationsCount},200,C);
    }

    return json({error:'Not found'},404,C);
  }catch(e){
    const msg=String(e.message||e);
    if(msg.includes('UNIQUE constraint failed: employees.employee_id'))return json({error:'এই Employee ID ইতোমধ্যে আছে'},409,C);
    return json({error:'Server error',detail:msg},500,C);
  }
}};
