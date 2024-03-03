import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

export const firebaseConfig = {
    apiKey: "AIzaSyCTuhjmYm9DxwVXY0F_KgTodowtQaR1VsY",
    authDomain: "torobench-web.firebaseapp.com",
    databaseURL: "https://torobench-web-default-rtdb.firebaseio.com",
    projectId: "torobench-web",
    storageBucket: "torobench-web.appspot.com",
    messagingSenderId: "816961023178",
    appId: "1:816961023178:web:fffb21b24729d966551833",
    measurementId: "G-W09P1LW072"
};

export const fireBaseDB = getFirestore(initializeApp(firebaseConfig));