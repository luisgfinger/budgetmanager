import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import '../styles/graficos.css';

ChartJS.register(ArcElement, Tooltip, Legend);

interface GraficoComparacaoProps {
  userId: string;
}

export default function GraficoComparacaoReceitasDespesas({ userId }: GraficoComparacaoProps) {
  const [despesas, setDespesas] = useState<any[]>([]);
  const [receitas, setReceitas] = useState<any[]>([]);

  useEffect(() => {
    if (userId) {
      fetchDespesas(userId);
      fetchReceitas(userId);
    }
  }, [userId]);

  const fetchDespesas = (uid: string) => {
    const despesasRef = collection(db, 'users', uid, 'despesas');
    onSnapshot(despesasRef, (snapshot) => {
      const despesasData = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setDespesas(despesasData);
    });
  };

  const fetchReceitas = (uid: string) => {
    const receitasRef = collection(db, 'users', uid, 'receitas');
    onSnapshot(receitasRef, (snapshot) => {
      const receitasData = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setReceitas(receitasData);
    });
  };

  const totalDespesas = despesas.reduce((sum, despesa) => sum + despesa.valor, 0);
  const totalReceitas = receitas.reduce((sum, receita) => sum + receita.valor, 0);

  const comparacaoData = {
    labels: ['Total de Receitas', 'Total de Despesas'],
    datasets: [
      {
        label: 'Receitas vs Despesas',
        data: [totalReceitas, totalDespesas],
        backgroundColor: ['#36A2EB', '#FF6384'],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className='grafico-container'>
      <h2>Receitas vs Despesas</h2>
      <Pie data={comparacaoData} />
    </div>
  );
}
