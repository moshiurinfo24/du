import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

function duBuildVersion(){
  const info={
    id:`du-${Date.now()}`,
    built_at:new Date().toISOString(),
    app:'Hisab Sahayika',
    channel:'production'
  };
  const payload=JSON.stringify(info,null,2);
  return {
    name:'du-build-version',
    configureServer(server){
      server.middlewares.use('/version.json',(req,res)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json; charset=utf-8');
        res.setHeader('Cache-Control','no-store, no-cache, must-revalidate');
        res.end(payload);
      });
    },
    generateBundle(){
      this.emitFile({type:'asset',fileName:'version.json',source:payload});
    }
  };
}

export default defineConfig({
  plugins:[react(),duBuildVersion()],
  build:{
    sourcemap:false
  }
});
