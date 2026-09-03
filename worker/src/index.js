
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
    if(u.pathname==='/api/health')return json({ok:true,service:'DU Employee ERP API',phase:4},200,C);

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
