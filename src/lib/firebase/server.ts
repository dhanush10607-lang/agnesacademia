import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getMessaging, Messaging } from 'firebase-admin/messaging';

let adminApp: App | undefined;

export function getFirebaseAdmin(): { messaging: Messaging } | null {
  if (!getApps().length) {
    try {
      const privateKey = process.env.FIREBASE_PRIVATE_KEY
        ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
        : undefined;

      if (!privateKey || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PROJECT_ID) {
        console.warn("Firebase Admin missing credentials. Push notifications will fail silently.");
        return null;
      }

      adminApp = initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey,
        }),
      });
    } catch (error) {
      console.error('Firebase admin initialization error', error);
      return null;
    }
  } else {
    adminApp = getApps()[0];
  }
  
  return {
    messaging: getMessaging(adminApp)
  };
}

