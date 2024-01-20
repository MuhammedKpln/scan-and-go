import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCmH5y9SuxaRCt9H4uIcQy3MdbbepSyv5Q",
  authDomain: "scango-7ccc8.firebaseapp.com",
  projectId: "scango-7ccc8",
  storageBucket: "scango-7ccc8.appspot.com",
  messagingSenderId: "494333650521",
  appId: "1:494333650521:web:e055a1d1046ffdee17b348",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
