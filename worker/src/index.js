
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
async function me(req,env){const t=cookies(req).du_session;if(!t)return null;const h=await sha(t);return env.DB.prepare(`SELECT u.id,u.employee_id,u.name,u.email,u.role FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>CURRENT_TIMESTAMP AND u.is_active=1`).bind(h).first()}
function canManage(user){return user&&['super_admin','admin','department_admin'].includes(user.role)}
function canDelete(user){return user&&['super_admin','admin'].includes(user.role)}
async function audit(env,user,action,type,id,metadata={}){try{await env.DB.prepare(`INSERT INTO audit_logs(user_id,action,entity_type,entity_id,metadata) VALUES(?,?,?,?,?)`).bind(user.id,action,type,String(id||''),JSON.stringify(metadata)).run()}catch{}}

export default{async fetch(req,env){
  const C=cors(req);if(req.method==='OPTIONS')return new Response(null,{status:204,headers:C});
  const u=new URL(req.url);
  try{
    if(u.pathname==='/api/health')return json({ok:true,service:'Employee Service ERP API',phase:6},200,C);

    if(u.pathname==='/api/bootstrap'&&req.method==='POST'){
      const c=await env.DB.prepare('SELECT COUNT(*) c FROM users').first();
      if(+c.c>0)return json({error:'Bootstrap already completed'},409,C);
      const b=await req.json();
      if(!b.name||!b.email||!b.password||b.password.length<10)return json({error:'Strong password required'},400,C);
      const p=await mkpass(b.password);
      await env.DB.prepare(`INSERT INTO users(name,email,password_hash,password_salt,role,is_active) VALUES(?,?,?,?,?,1)`).bind(b.name,b.email.toLowerCase(),p.hash,p.salt,'super_admin').run();
      return json({ok:true},201,C);
    }

    if(u.pathname==='/api/login'&&req.method==='POST'){
      const b=await req.json();
      const x=await env.DB.prepare('SELECT * FROM users WHERE email=? AND is_active=1').bind(String(b.email||'').toLowerCase()).first();
      if(!x||!(await ver(String(b.password||''),x.password_salt,x.password_hash)))return json({error:'ইমেইল বা পাসওয়ার্ড সঠিক নয়'},401,C);
      await env.DB.prepare('DELETE FROM sessions WHERE expires_at<=CURRENT_TIMESTAMP').run();
      const raw=b64(crypto.getRandomValues(new Uint8Array(32))),h=await sha(raw),exp=new Date(Date.now()+604800000).toISOString();
      await env.DB.prepare('INSERT INTO sessions(user_id,token_hash,expires_at) VALUES(?,?,?)').bind(x.id,h,exp).run();
      return json({user:{id:x.id,employee_id:x.employee_id,name:x.name,email:x.email,role:x.role}},200,{...C,'Set-Cookie':`du_session=${encodeURIComponent(raw)}; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=604800`});
    }

    if(u.pathname==='/api/logout'&&req.method==='POST'){
      const t=cookies(req).du_session;if(t)await env.DB.prepare('DELETE FROM sessions WHERE token_hash=?').bind(await sha(t)).run();
      return json({ok:true},200,{...C,'Set-Cookie':'du_session=; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=0'});
    }

    const user=await me(req,env);
    if(u.pathname==='/api/me'){if(!user)return json({error:'Unauthenticated'},401,C);return json({user},200,C)}

    if(u.pathname==='/api/departments'&&req.method==='GET'){
      if(!user)return json({error:'Unauthenticated'},401,C);
      const x=await env.DB.prepare(`SELECT id,name_bn,name_en,type,phone,email,website FROM departments ORDER BY name_bn COLLATE NOCASE`).all();
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
      const x=await env.DB.prepare(`SELECT id,name_bn,name_en,grade,is_active FROM designations WHERE is_active=1 ORDER BY name_bn COLLATE NOCASE`).all();
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

    if(u.pathname==='/api/admin/stats'&&req.method==='GET'){
      if(!canManage(user))return json({error:'Forbidden'},403,C);
      const[e,a,us,d,g]=await Promise.all([
        env.DB.prepare('SELECT COUNT(*) c FROM employees').first(),
        env.DB.prepare("SELECT COUNT(*) c FROM employees WHERE service_status='active'").first(),
        env.DB.prepare('SELECT COUNT(*) c FROM users').first(),
        env.DB.prepare('SELECT COUNT(*) c FROM departments').first(),
        env.DB.prepare('SELECT COUNT(*) c FROM designations WHERE is_active=1').first()
      ]);
      return json({employees:+e.c,active_employees:+a.c,users:+us.c,departments:+d.c,designations:+g.c},200,C);
    }

    return json({error:'Not found'},404,C);
  }catch(e){
    const msg=String(e.message||e);
    if(msg.includes('UNIQUE constraint failed: employees.employee_id'))return json({error:'এই Employee ID ইতোমধ্যে আছে'},409,C);
    return json({error:'Server error',detail:msg},500,C);
  }
}};
