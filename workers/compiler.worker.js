self.addEventListener('install', event => {
  console.log('V2 installing')
  event.waitUntil(self.skipWaiting())
})

self.addEventListener('activate', event => {
  console.log('V2 now ready to handle fetches!')
  event.waitUntil(self.clients.claim())
})

self.addEventListener('message', event => {
  console.log("SW2 Received", event.data)

  const { data, resolve, reject } = event.data
  
  resolve(data)
})