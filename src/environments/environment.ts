// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCo8LEeKO1p-EOkcVIjvDInF5o1lJfqV5Y",
  authDomain: "sam-customer.firebaseapp.com",
  projectId: "sam-customer",
  storageBucket: "sam-customer.appspot.com",
  messagingSenderId: "703282872233",
  appId: "1:703282872233:web:d685216c8f938b50a58eb8",
  measurementId: "G-58SJLGW3JD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const environment = {
  production: true,
  API_SERVER: " https://sam-be-mohit1996kumars-projects.vercel.app/",
};
