import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBC2-Qh9YgCYuw_00epd7pV-B2xNVMGHVg",
    authDomain: "d-design-app-database-e3ff6.firebaseapp.com",
    projectId: "d-design-app-database-e3ff6",
    storageBucket: "d-design-app-database-e3ff6.appspot.com",
    messagingSenderId: "250159572004",
    appId: "1:250159572004:web:cfd8ed8e4d890221cea4b1",
    measurementId: "G-PQ0N92QH37"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)

export {
    auth,
    db
}