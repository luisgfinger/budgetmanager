import { initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import firebaseConfigData from "./firebaseConfig.json"; 
import { getFirestore } from "firebase/firestore";

const firebaseConfig = firebaseConfigData.firebaseConfig;

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

const auth = getAuth();
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Persistência configurada com sucesso");
  })
  .catch((error) => {
    console.error("Erro ao configurar a persistência:", error);
  });

export { auth };
