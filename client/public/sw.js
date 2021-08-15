/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */
self.addEventListener('push', (event) => {
  console.log('[Service Worker] : ', event.data);

  const title = 'Tx Chat blablabla';
  const options = {
    body: 'Ca maaaarche !!!',
  };

  event.waitUntil(self.registration.showNotification(title, options));

  /*event.waitUntil(
    self.registration.showNotification('Tx Chat', {
      body: data.message,
      icon: '../image/logo192.png',
      vibrate: [200, 100, 200],
      renotify: true,
      tag: 'txChatMessage',
      badge: '../image/logo72.png',
      lang: 'EN',
    })
  );*/
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(clients.openWindow('https://google.com'));
});
