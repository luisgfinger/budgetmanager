import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import '../styles/graficos.css';

ChartJS.register(ArcElement, Tooltip, Legend);

interface GraficoDespesasPorCategoriaProps {
  userId: string;
}

export default function GraficoDespesasPorCategoria({ userId }: GraficoDespesasPorCategoriaProps) {
  const [despesas, setDespesas] = useState<any[]>([]);
  const [categoriasDespesa, setCategoriasDespesa] = useState<any[]>([]);

  useEffect(() => {
    if (userId) {
      fetchDespesas(userId);
      fetchCategoriasDespesa(userId);
    }
  }, [userId]);

  const fetchDespesas = (uid: string) => {
    const despesasRef = collection(db, 'users', uid, 'despesas');
    onSnapshot(despesasRef, (snapshot) => {
      const despesasData = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setDespesas(despesasData);
    });
  };

  const fetchCategoriasDespesa = (uid: string) => {
    const categoriasDespesaRef = collection(db, 'users', uid, 'categoriasDespesa');
    onSnapshot(categoriasDespesaRef, (snapshot) => {
      const categoriasData = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setCategoriasDespesa(categoriasData);
    });
  };

  const despesasPorCategoria = categoriasDespesa.map((categoria) => {
    const total = despesas
      .filter((despesa) => despesa.categoria === categoria.nome)
      .reduce((sum, despesa) => sum + despesa.valor, 0);
    return { categoria: categoria.nome, total };
  });

  const despesasData = {
    labels: despesasPorCategoria.map((cat) => cat.categoria),
    datasets: [
      {
        label: 'Despesas por Categoria',
        data: despesasPorCategoria.map((cat) => cat.total),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,  
    responsive: true,           
  };

  return (
    <div className='grafico-container'>
      <h2>Despesas por Categoria</h2>
      <Pie data={despesasData} />
    </div>
  );
}
