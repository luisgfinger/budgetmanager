import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import '../styles/graficos.css';

ChartJS.register(ArcElement, Tooltip, Legend);

interface GraficoReceitasPorCategoriaProps {
  userId: string;
}

export default function GraficoReceitasPorCategoria({ userId }: GraficoReceitasPorCategoriaProps) {
  const [receitas, setReceitas] = useState<any[]>([]);
  const [categoriasReceita, setCategoriasReceita] = useState<any[]>([]);

  useEffect(() => {
    if (userId) {
      fetchReceitas(userId);
      fetchCategoriasReceita(userId);
    }
  }, [userId]);

  const fetchReceitas = (uid: string) => {
    const receitasRef = collection(db, 'users', uid, 'receitas');
    onSnapshot(receitasRef, (snapshot) => {
      const receitasData = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setReceitas(receitasData);
    });
  };

  const fetchCategoriasReceita = (uid: string) => {
    const categoriasReceitaRef = collection(db, 'users', uid, 'categoriasReceita');
    onSnapshot(categoriasReceitaRef, (snapshot) => {
      const categoriasData = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setCategoriasReceita(categoriasData);
    });
  };

  const receitasPorCategoria = categoriasReceita.map((categoria) => {
    const total = receitas
      .filter((receita) => receita.categoria === categoria.nome)
      .reduce((sum, receita) => sum + receita.valor, 0);
    return { categoria: categoria.nome, total };
  });

  const receitasData = {
    labels: receitasPorCategoria.map((cat) => cat.categoria),
    datasets: [
      {
        label: 'Receitas por Categoria',
        data: receitasPorCategoria.map((cat) => cat.total),
        backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384', '#4BC0C0', '#9966FF'],
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
      <h2>Receitas por Categoria</h2>
      <Pie data={receitasData} />
    </div>
  );
}
