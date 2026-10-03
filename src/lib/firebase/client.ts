import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, getToken, onMessage, isSupported, deleteToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const requestForToken = async () => {
  try {
    const messagingSupported = await isSupported();
    if (!messagingSupported) {
      console.warn("Firebase Messaging is not supported in this browser.");
      return null;
    }

    const messaging = getMessaging(app);

    let swRegistration = null;
    if ("serviceWorker" in navigator) {
      const swUrl = `/firebase-messaging-sw.js?apiKey=${firebaseConfig.apiKey}&authDomain=${firebaseConfig.authDomain}&projectId=${firebaseConfig.projectId}&messagingSenderId=${firebaseConfig.messagingSenderId}&appId=${firebaseConfig.appId}`;
      await navigator.serviceWorker.register(swUrl);
      // Wait for the service worker to be fully ready before asking for a token
      swRegistration = await navigator.serviceWorker.ready;
    }

    const currentToken = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: swRegistration || undefined,
    });

    if (currentToken) {
      return currentToken;
    } else {
      console.warn("No registration token available. Request permission to generate one.");
      return null;
    }
  } catch (err) {
    console.error("An error occurred while retrieving token. ", err);
    return null;
  }
};

// Forces deletion of the locally cached token and grabs a completely fresh one from Google
export const refreshForToken = async () => {
  try {
    const messagingSupported = await isSupported();
    if (!messagingSupported) return null;

    const messaging = getMessaging(app);
    try {
      await deleteToken(messaging);
      console.log("Deleted old cached FCM token.");
    } catch (e) {
      console.warn("Could not delete old token (maybe it didn't exist)", e);
    }

    return await requestForToken();
  } catch (err) {
    console.error("An error occurred while refreshing token. ", err);
    return null;
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    isSupported().then((supported) => {
      if (supported) {
        const messaging = getMessaging(app);
        onMessage(messaging, (payload) => {
          resolve(payload);
        });
      }
    });
  });

export { app };
