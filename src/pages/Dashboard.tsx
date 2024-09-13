import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig"; 
import Despesas from "./Despesas"; 
import Receitas from "./Receitas";
import GraficoPage from "./GraficoPage";

import '../styles/dashboard.css'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true); 
  const [activeTab, setActiveTab] = useState("despesas"); 
  const [saldo, setSaldo] = useState(0); 
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser); 
        console.log("Usuário autenticado:", currentUser); 
        fetchSaldo(currentUser.uid);
      } else {
        console.log("Nenhum usuário autenticado, redirecionando para login.");
        navigate("/login");
      }
      setLoading(false); 
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  const fetchSaldo = (uid: string) => {
    const despesasRef = collection(db, "users", uid, "despesas");
    const receitasRef = collection(db, "users", uid, "receitas");

    let totalDespesas = 0;
    let totalReceitas = 0;

    onSnapshot(despesasRef, (despesasSnapshot) => {
      totalDespesas = despesasSnapshot.docs.reduce((acc, doc) => acc + doc.data().valor, 0);
      updateSaldo(totalReceitas, totalDespesas);
    });

    onSnapshot(receitasRef, (receitasSnapshot) => {
      totalReceitas = receitasSnapshot.docs.reduce((acc, doc) => acc + doc.data().valor, 0);
      updateSaldo(totalReceitas, totalDespesas);
    });
  };

  const updateSaldo = (totalReceitas: number, totalDespesas: number) => {
    const novoSaldo = totalReceitas - totalDespesas;
    setSaldo(novoSaldo);
  };

  if (loading) {
    return <div>Carregando...</div>; 
  }

  if (!user) {
    return null; 
  }

  return (
    <div className="dashboard-container">
      <div className="saldo">
        <h2>Saldo Total: R$ {saldo}</h2>
      </div>

      <nav className="dashboard-menu">
        <ul>
          <li className={activeTab === "despesas" ? "active" : ""} onClick={() => setActiveTab("despesas")}>
            Despesas
          </li>
          <li className={activeTab === "receitas" ? "active" : ""} onClick={() => setActiveTab("receitas")}>
            Receitas
          </li>
          <li className={activeTab === "graficos" ? "active" : ""} onClick={() => setActiveTab("graficos")}>
            Gráficos
          </li>
        </ul>
      </nav>

      {activeTab === "despesas" && user && <Despesas userId={user.uid} />}
      {activeTab === "receitas" && user && <Receitas userId={user.uid} />}
      {activeTab === "graficos" && user && <GraficoPage/>}
    </div>
  );
}
