# Steps for converting an app to PWA

- Registering service worker to index.html
- [ ] Install service worker 

   ```js
    self.addEventListener("install", (event) => {
      event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
          console.log("Opened cache");
          return cache.addAll(URLS_TO_CACHE);
        })
      );
    });
   ```
   
- [ ] Listen for requests

    ```js
      self.addEventListener("fetch", (event) => {
        event.respondWith(
          caches.match(event.request).then(() => {
            return fetch(event.request).catch(() => caches.match("index.html"));
          })
        );
      });
    ```
    
- [ ] Activate the service worker

   ```js
      self.addEventListener("activate", (event) => {
      const cacheWhiteList = [];
      cacheWhiteList.push(CACHE_NAME);

      event.waitUntil(
        caches.keys().then((cacheNames) =>
          Promise.all(
            cacheNames.map((cacheName) => {
              if (!cacheWhiteList.includes(cacheName)) {
                return caches.delete(cacheName);
              }
            })
          )
        )
      );
     });
   ```
   
- [ ] Create manifest.json
 
```json
  {
    "short_name": "",
    "name": "",
    "icons": [
        {
            "src": "",
            "type": "",
            "sizes" : ""
        }
    ],
    "start_url": ".",
    "display": "",
    "theme_color": "",
    "background_color": ""
  }
```
