import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "../styles/graficos.css";
import GraficoDespesasPorCategoria from "../components/GraficoDespesasPorCategoria";
import GraficoReceitasPorCategoria from "../components/GraficoReceitasPorCategoria";
import GraficoComparacaoReceitasDespesas from "../components/GraficoComparacaoReceitasDespesas";
import "../styles/graficopage.css";

export default function GraficoPage() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  if (!userId) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="pagina-graficos">
      <h1>Relatórios Financeiros</h1>

      <div className="grafico-row">
        <div className="grafico">
          <GraficoDespesasPorCategoria userId={userId} />
        </div>
        <div className="grafico">
          <GraficoReceitasPorCategoria userId={userId} />
        </div>
      </div>

      <div className="grafico-row">
        <div className="grafico">
          <GraficoComparacaoReceitasDespesas userId={userId} />
        </div>
        <div className="grafico">
          <GraficoComparacaoReceitasDespesas userId={userId} />
        </div>
      </div>
    </div>
  );
}
