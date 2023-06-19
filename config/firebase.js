import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  // apiKey: "AIzaSyD61Bn6DOPnDpuPUuBU43XoOR5gAkn0EmU",
  // authDomain: "pets-project-6e7c3.firebaseapp.com",
  // projectId: "pets-project-6e7c3",
  // storageBucket: "pets-project-6e7c3.appspot.com",
  // messagingSenderId: "407659943282",
  // appId: "1:407659943282:web:334b49e660db04bc19f9eb",

  apiKey: "AIzaSyAxBCjCMahItFZPqDqXI6seMsqogisDHVA",
  authDomain: "pets-bd125.firebaseapp.com",
  projectId: "pets-bd125",
  storageBucket: "pets-bd125.appspot.com",
  messagingSenderId: "1086672869372",
  appId: "1:1086672869372:web:76831414456f8d659b4479",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const firestore = getFirestore();
export const storage = getStorage();
