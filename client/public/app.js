if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./sw.js')

      .then((reg) =>
        console.log(`Service worker successfully registered : ${reg.scope}`)
      )
      .catch((err) =>
        console.log(`Failed to register service worker :  ${err}`)
      );
  });
}

if ('Notification' in window) {
  if (Notification.permission === 'granted') {
    new Notification('Youpi ça marche');
  } else if (
    Notification.permission !== 'denied' ||
    Notification.permission === 'default'
  ) {
    Notification.requestPermission((permission) => {
      if (permission === 'granted') {
        new Notification('Youpi ça marche');
      } else console.log('Notifications are disabled');
    });
  }
} else console.log('Notifications are not supported by your browser');
