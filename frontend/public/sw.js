const CACHE_NAME='hisab-pwa-runtime-v67';
const CORE=[
  '/',
  '/manifest.webmanifest',
  '/icons/du-app-192.svg',
  '/icons/du-app-512.svg',
  '/icons/du-app-maskable.svg',
  '/illustrations/hisab-office-hero-v48.webp',
  '/illustrations/hisab-office-team-v48.webp',
  '/branding/smart-office-hisab-logo-v50.webp'
];

self.addEventListener('install',event=>{
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache=>cache.addAll(CORE.map(url=>new Request(url,{cache:'reload'}))))
      .catch(()=>{})
      .then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('message',event=>{
  if(event.data?.type==='SKIP_WAITING')self.skipWaiting();
  if(event.data?.type==='CLEAR_RUNTIME_CACHE'){
    event.waitUntil(
      caches.keys().then(keys=>Promise.all(keys.map(k=>caches.delete(k))))
    );
  }
});

self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET')return;
  const url=new URL(req.url);

  if(url.origin!==self.location.origin)return;
  if(url.pathname.startsWith('/api/'))return;
  if(url.pathname==='/version.json'){
    event.respondWith(fetch(req,{cache:'no-store'}));
    return;
  }

  if(req.mode==='navigate'){
    event.respondWith(
      fetch(req)
        .then(res=>{
          const copy=res.clone();
          caches.open(CACHE_NAME).then(cache=>cache.put('/',copy)).catch(()=>{});
          return res;
        })
        .catch(()=>caches.match(req).then(x=>x||caches.match('/')))
    );
    return;
  }

  const cacheFirst=
    url.pathname.startsWith('/assets/')||
    url.pathname.startsWith('/branding/')||
    url.pathname.startsWith('/illustrations/')||
    url.pathname.startsWith('/icons/');

  if(cacheFirst){
    event.respondWith(
      caches.match(req).then(cached=>{
        if(cached)return cached;
        return fetch(req).then(res=>{
          if(res&&res.ok){
            const copy=res.clone();
            caches.open(CACHE_NAME).then(cache=>cache.put(req,copy)).catch(()=>{});
          }
          return res;
        });
      })
    );
    return;
  }

  event.respondWith(
    fetch(req)
      .then(res=>{
        if(res && res.ok){
          const copy=res.clone();
          caches.open(CACHE_NAME).then(cache=>cache.put(req,copy)).catch(()=>{});
        }
        return res;
      })
      .catch(()=>caches.match(req))
  );
});
