import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBRYHGT0oJcvVASqYrHbs5drseZvZ1BFcM",
  authDomain: "saint-xavier-convent-sch-7ba49.firebaseapp.com",
  projectId: "saint-xavier-convent-sch-7ba49",
  storageBucket: "saint-xavier-convent-sch-7ba49.firebasestorage.app",
  messagingSenderId: "1084074865025",
  appId: "1:1084074865025:web:e06a2b0dc97f5283843880",
  measurementId: "G-9QYNLZN1RP"
};

const app = initializeApp(firebaseConfig);

export default app;