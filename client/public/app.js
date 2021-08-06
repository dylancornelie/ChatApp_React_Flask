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
