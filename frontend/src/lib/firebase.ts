
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence } from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// DEBUG: Verify config loading
if (typeof window !== 'undefined') {
    console.log("Firebase Config Check:", {
        apiKey: firebaseConfig.apiKey ? "Loaded " + firebaseConfig.apiKey.substring(0, 5) + "..." : "MISSING",
        authDomain: firebaseConfig.authDomain,
        projectId: firebaseConfig.projectId
    });
}

// Initialize Firebase (Singleton pattern)
let app;
let auth: any;
let googleProvider: any;

if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "undefined") {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();

    // Configure auth persistence to LOCAL (survives page reloads and browser restarts)
    if (typeof window !== 'undefined') {
        setPersistence(auth, browserLocalPersistence).catch((error) => {
            console.error("Failed to set auth persistence:", error);
        });
    }
} else {
    // During build/prerendering on Vercel, env vars might be missing.
    // We provide dummy objects to prevent the build from crashing.
    console.warn("Firebase config is incomplete. Firebase features will be disabled until environment variables are set.");
    app = {} as any;
    auth = {
        onAuthStateChanged: () => () => { },
        signOut: async () => { },
    } as any;
    googleProvider = {} as any;
}

export { app, auth, googleProvider };
