import firebase from "firebase/app";
import "firebase/database";
import "firebase/firestore";
import "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBAYqhN9sgq2TnVgPHUFx884ZMMl7BcfaM",
  authDomain: "wpp-clone-25331.firebaseapp.com",
  projectId: "wpp-clone-25331",
  storageBucket: "wpp-clone-25331.appspot.com",
  messagingSenderId: "237668288756",
  appId: "1:237668288756:web:63a838cba39867ed8836a1",
  measurementId: "G-G0F42XXYYX"
};
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const database = firebase.database();
const firestore = firebase.firestore();

export {firebase, auth, database, firestore}