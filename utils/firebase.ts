import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";

export function initFirebase() {
  const config = useRuntimeConfig();

  const firebaseConfig = {
    apiKey: config.public.apiKey,
    authDomain: config.public.authDomain,
    projectId: config.public.projectId,
    storageBucket: config.public.storageBucket,
    messagingSenderId: config.public.messagingSenderId,
    appId: config.public.appId,
    measurementId: config.public.measurementId,
  };

  initializeApp(firebaseConfig);

  logFirebase("init_firebase");
}

export function logFirebase(name: string, params?: Record<string, string>) {
  const analytics = getAnalytics();

  logEvent(analytics, name, params);
}
