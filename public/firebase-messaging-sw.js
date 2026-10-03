importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js");

// Try to grab config from URL params if passed (dynamic config)
const urlParams = new URLSearchParams(location.search);

// We need a way to pass config to the service worker.
// The easiest way is for the client to register the service worker with query params.
const firebaseConfig = {
  apiKey: urlParams.get('apiKey') === 'undefined' ? null : urlParams.get('apiKey'),
  authDomain: urlParams.get('authDomain') === 'undefined' ? null : urlParams.get('authDomain'),
  projectId: urlParams.get('projectId') === 'undefined' ? null : urlParams.get('projectId'),
  messagingSenderId: urlParams.get('messagingSenderId') === 'undefined' ? null : urlParams.get('messagingSenderId'),
  appId: urlParams.get('appId') === 'undefined' ? null : urlParams.get('appId'),
};

if (firebaseConfig.apiKey && firebaseConfig.projectId) {
  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    
    // If the payload contains a 'notification' object, the Firebase SDK automatically 
    // displays a system notification. We only need to manually show one if it's a data-only payload.
    if (payload.notification) {
      return;
    }

    const notificationTitle = payload.data?.title || 'New Notification';
    const notificationOptions = {
      body: payload.data?.body,
      icon: '/icon.png',
      data: payload.data
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  });
}

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const actionUrl = event.notification.data?.action_url || '/notifications';
  
  // This looks to see if the current is already open and focuses if it is
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.registration.scope) && 'focus' in client) {
          client.navigate(actionUrl);
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(actionUrl);
      }
    })
  );
});
