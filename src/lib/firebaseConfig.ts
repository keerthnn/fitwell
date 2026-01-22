import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";


let app: ReturnType<typeof initializeApp> | undefined = undefined;
let auth: ReturnType<typeof getAuth> | undefined = undefined;
let googleProvider: GoogleAuthProvider | undefined = undefined;

if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTHDOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGE_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

  auth = getAuth(app);
}

if (app) {
  auth = getAuth(app);
  setPersistence(auth, browserLocalPersistence)
    .then(() => {})
    .catch((e) => {
      console.error("error", e);
    });
  googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({
    prompt: "select_account",
  });
}
export { auth, app, googleProvider };
