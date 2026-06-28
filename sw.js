/* Service Worker - Portal Sport Zone Vasco da Gama */
var CACHE='spz-portal-v1';
var ASSETS=['./','./index.html','./cofre.html','./lembretes.html','./aniversario.html','./limpeza.html','./config.js','./links.js','./manifest.json'];
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(ASSETS);}).then(function(){return self.skipWaiting();}));
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.map(function(k){if(k!==CACHE)return caches.delete(k);}));}).then(function(){return self.clients.claim();}));
});
self.addEventListener('fetch',function(e){
  var url=new URL(e.request.url);
  if(e.request.method!=='GET') return;            // nao mexer em POSTs (gravacoes na nuvem)
  if(url.origin!==location.origin) return;          // deixar a nuvem (Google) passar sempre pela rede
  e.respondWith(
    fetch(e.request).then(function(resp){
      var cp=resp.clone(); caches.open(CACHE).then(function(c){c.put(e.request,cp);});
      return resp;
    }).catch(function(){
      return caches.match(e.request).then(function(r){return r||caches.match('./index.html');});
    })
  );
});
