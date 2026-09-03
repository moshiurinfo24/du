const json=(d,s=200,h={})=>new Response(JSON.stringify(d),{
  status:s,
  headers:{
    'content-type':'application/json; charset=utf-8',
    ...h
  }
});

const enc=new TextEncoder();

function cors(req){
  const o=req.headers.get('Origin')||'*';

  return{
    'Access-Control-Allow-Origin':o,
    'Access-Control-Allow-Credentials':'true',
    'Access-Control-Allow-Headers':'Content-Type',
    'Access-Control-Allow-Methods':'GET,POST,PUT,DELETE,OPTIONS',
    'Vary':'Origin'
  };
}

function b64(b){
  return btoa(
    String.fromCharCode(
      ...new Uint8Array(b)
    )
  );
}

function ub64(s){
  return Uint8Array.from(
    atob(s),
    c=>c.charCodeAt(0)
  );
}

async function sha(s){
  return b64(
    await crypto.subtle.digest(
      'SHA-256',
      enc.encode(s)
    )
  );
}

async function derive(p,s){
  const k=await crypto.subtle.importKey(
    'raw',
    enc.encode(p),
    'PBKDF2',
    false,
    ['deriveBits']
  );

  return b64(
    await crypto.subtle.deriveBits(
      {
        name:'PBKDF2',
        hash:'SHA-256',
        salt:s,
        iterations:100000
      },
      k,
      256
    )
  );
}

async function mkpass(p){
  const s=crypto.getRandomValues(
    new Uint8Array(16)
  );

  return{
    salt:b64(s),
    hash:await derive(p,s)
  };
}

async function ver(p,s,h){
  return(
    await derive(
      p,
      ub64(s)
    )
  )===h;
}

function cookies(req){
  return Object.fromEntries(
    (req.headers.get('Cookie')||'')
      .split(';')
      .map(x=>x.trim())
      .filter(Boolean)
      .map(x=>{
        const i=x.indexOf('=');

        return[
          x.slice(0,i),
          decodeURIComponent(
            x.slice(i+1)
          )
        ];
      })
  );
}

async function me(req,env){

  const t=cookies(req).du_session;

  if(!t){
    return null;
  }

  const h=await sha(t);

  return env.DB.prepare(`
    SELECT
      u.id,
      u.employee_id,
      u.name,
      u.email,
      u.role
    FROM sessions s
    JOIN users u
      ON u.id=s.user_id
    WHERE
      s.token_hash=?
      AND s.expires_at>CURRENT_TIMESTAMP
      AND u.is_active=1
  `)
  .bind(h)
  .first();
}

export default{

  async fetch(req,env){

    const C=cors(req);

    if(req.method==='OPTIONS'){

      return new Response(
        null,
        {
          status:204,
          headers:C
        }
      );
    }

    const u=new URL(req.url);

    try{

      // =========================
      // HEALTH CHECK
      // =========================
      if(u.pathname==='/api/health'){

        return json({
          ok:true,
          service:'DU Employee ERP API'
        },200,C);
      }

      // =========================
      // BOOTSTRAP SUPER ADMIN
      // Works only when users table is empty
      // =========================
      if(
        u.pathname==='/api/bootstrap' &&
        req.method==='POST'
      ){

        const c=await env.DB
          .prepare(`
            SELECT COUNT(*) c
            FROM users
          `)
          .first();

        if(+c.c>0){

          return json({
            error:'Bootstrap already completed'
          },409,C);
        }

        const b=await req.json();

        if(
          !b.name ||
          !b.email ||
          !b.password ||
          b.password.length<10
        ){

          return json({
            error:'Strong password required'
          },400,C);
        }

        const p=await mkpass(
          b.password
        );

        await env.DB.prepare(`
          INSERT INTO users(
            name,
            email,
            password_hash,
            password_salt,
            role,
            is_active
          )
          VALUES(
            ?,?,?,?,?,
            1
          )
        `)
        .bind(
          b.name,
          b.email.toLowerCase(),
          p.hash,
          p.salt,
          'super_admin'
        )
        .run();

        return json({
          ok:true
        },201,C);
      }

      // =========================
      // LOGIN
      // =========================
      if(
        u.pathname==='/api/login' &&
        req.method==='POST'
      ){

        const b=await req.json();

        const x=await env.DB.prepare(`
          SELECT *
          FROM users
          WHERE
            email=?
            AND is_active=1
        `)
        .bind(
          String(
            b.email||''
          ).toLowerCase()
        )
        .first();

        if(
          !x ||
          !(
            await ver(
              String(
                b.password||''
              ),
              x.password_salt,
              x.password_hash
            )
          )
        ){

          return json({
            error:
              'ইমেইল বা পাসওয়ার্ড সঠিক নয়'
          },401,C);
        }

        // Remove expired sessions
        await env.DB.prepare(`
          DELETE FROM sessions
          WHERE expires_at<=CURRENT_TIMESTAMP
        `)
        .run();

        const raw=b64(
          crypto.getRandomValues(
            new Uint8Array(32)
          )
        );

        const h=await sha(raw);

        const exp=new Date(
          Date.now()+
          1000*60*60*24*7
        ).toISOString();

        await env.DB.prepare(`
          INSERT INTO sessions(
            user_id,
            token_hash,
            expires_at
          )
          VALUES(?,?,?)
        `)
        .bind(
          x.id,
          h,
          exp
        )
        .run();

        return json({
          user:{
            id:x.id,
            employee_id:
              x.employee_id,
            name:x.name,
            email:x.email,
            role:x.role
          }
        },200,{
          ...C,
          'Set-Cookie':
            `du_session=${encodeURIComponent(raw)}; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=604800`
        });
      }

      // =========================
      // LOGOUT
      // =========================
      if(
        u.pathname==='/api/logout' &&
        req.method==='POST'
      ){

        const t=
          cookies(req).du_session;

        if(t){

          await env.DB.prepare(`
            DELETE FROM sessions
            WHERE token_hash=?
          `)
          .bind(
            await sha(t)
          )
          .run();
        }

        return json({
          ok:true
        },200,{
          ...C,
          'Set-Cookie':
            'du_session=; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=0'
        });
      }

      // =========================
      // CURRENT USER
      // =========================
      const user=
        await me(req,env);

      if(
        u.pathname==='/api/me'
      ){

        if(!user){

          return json({
            error:'Unauthenticated'
          },401,C);
        }

        return json({
          user
        },200,C);
      }

      // =========================
      // NOT FOUND
      // =========================
      return json({
        error:'Not found'
      },404,C);

    }catch(e){

      return json({
        error:'Server error',
        detail:String(
          e.message||e
        )
      },500,C);
    }
  }
};
