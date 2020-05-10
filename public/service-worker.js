 const cacheName = 'cache-v1';
 const chacheUrls = [
     './',
     'style.css',
     'https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js'
 ]

 self.addEventListener('install', function(event) {
     console.log('Event: Install');
    event.waitUntil(
        caches.open(cacheName)
        .then(function(cache) {
            console.log('Opened cache: ', cache);
            return cache.addAll(chacheUrls);
        })
    )
 });

 self.addEventListener('fetch', function(event) {
    if (event.request.method !== 'GET') {
        console.log('WORKER: fetch event ignored.', event.request.method, event.request.url);
        return;
    }
    console.log('Event: Fetch');
    event.respondWith(
        caches.match(event.request)
        .then(function(response) {
            // Cache hit - return response
            if (response) {
                return response;
            }
            var url = event.request.url;
            var newUrl = '';
            if (url.indexOf('pixel.gif') !== -1) {
                var fields = getQueryParams(event.request.url);
                fields = mapFieldToServer(fields);
                var urlArr = url.split('?');
                if (urlArr.length > 1) {
                    let query = '';
                    Object.keys(fields).forEach(field => {
                        query += `${field}=${fields[field]}&`;
                    });
                    query = query.substring(0, query.length - 1);
                    newUrl = `${urlArr[0]}?${query}`;
                }
            }
            
            var fetchRequest = newUrl ? fetch(new Request(newUrl), event.request) : fetch(event.request);
            return fetchRequest
            .then(function(response) {
                // Check if received a valid response
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }

                var responseToCache = response.clone();

                caches.open(cacheName)
                .then(function(cache) {
                    cache.put(event.request, responseToCache);
                });
                return response;
            })
        })
    )
 });

 self.addEventListener('activate', (event) => {
    console.info('Event: Activate');
    event.waitUntil(
        self.clients.claim(),
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== cacheName) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

 function getQueryParams(url) {
    url = decodeURIComponent(url);
    var result = {};
    var urlArr = url.split('?');
    if (urlArr.length > 1) {
        urlArr[1].split('&').forEach(element => {
            element = element.split('=');
            result[element[0]] = element[1];
        });
    }

  return result;
}

function mapFieldToServer(fields) {
    if (!fields) return;
    Object.keys(fields).forEach(field => {
        if (fieldMapToServer(field)) {
            fields[fieldMapToServer(field)] = fields[field];
            delete fields[field];
        }
    });

    return fields;
}

function fieldMapToServer(field) {
    switch(field) {
        case 'interaction':
            return 'event';
        case 'client':
            return 'customer';
        case 'os_name':
            return 'operating_system_name';
        case 'x1':
            return 'utm_source';
        case 'x2':
            return 'utm_medium';
        case 'x3':
            return 'utm_campaign';
        case 'landing_url':
            return 'campaign_url'
        default:
            return;
    }
}