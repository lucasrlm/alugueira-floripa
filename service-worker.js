'use strict';

const CACHE_NAME = 'alugueira-floripa';

const FILES_TO_CACHE = [
    'images/logo.png',
    'images/ps4.jpg',
    'images/icons/favicon.ico',
    'css/styles.css',
    'css/bootstrap.min.css',
    'css/bootstrap.min.css.map',
    'js/bootstrap.min.js',
    'js/bootstrap.min.js.map',
    'js/popper.min.js',
    'js/popper.min.js.map',
    'js/jquery-3.3.1.min.js',
    'offline.html'
];

self.addEventListener('install', (evt) => {

    console.log('[ServiceWorker] Instalando...');

    evt.waitUntil(

        caches.open(CACHE_NAME).then((cache) => {
            console.log('[ServiceWorker] Fazendo cache dos arquivos da aplicação');
            return cache.addAll(FILES_TO_CACHE); 
        })
    );
    self.skipWaiting();
});

//Gera o CACHE dos arquivos estáticos
self.addEventListener('activate', (evt) => {

    console.log('[ServiceWorker] Ativando...');

    evt.waitUntil(

        caches.keys().then((keylist) => {

            return Promise.all(keylist.map((key) => {

                console.log('[ServiceWorker] Removendo cache antigo...');
                if(key !== CACHE_NAME){
                    return caches.delete(key);
                }
            }));
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (evt) => {
    //console.log('[ServiceWorker] Recebendo', evt.request.url);

    if (evt.request.mode !== 'navigate') {
        return;
    }
    evt.respondWith(
        fetch(evt.request)
            .catch(() => {
                return caches.open(CACHE_NAME)
                    .then((cache) => {
                        console.log('cache: ' + cache);
                        return cache.match('offline.html');
                    });
            })
    );

});