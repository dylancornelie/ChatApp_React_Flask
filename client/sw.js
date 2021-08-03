/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js');
workbox.setConfig({ debug: false });

workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);
