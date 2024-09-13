import { useState, useEffect } from "react";
import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
  setDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import "../styles/receitas.css";
import GraficoReceitasPorCategoria from "../components/GraficoReceitasPorCategoria";

interface ReceitasProps {
  userId: string;
}

export default function Receitas({ userId }: ReceitasProps) {
  const [receitas, setReceitas] = useState<any[]>([]);
  const [categoriasReceita, setCategoriasReceita] = useState<any[]>([]);
  const [totalReceitas, setTotalReceitas] = useState(0); // Estado para o total de receitas
  const [showReceitaForm, setShowReceitaForm] = useState(false);
  const [showCategoriaForm, setShowCategoriaForm] = useState(false);
  const [newReceita, setNewReceita] = useState({
    valor: "",
    descricao: "",
    data: "",
    categoria: "Receita Padrão",
  });
  const [newCategoriaReceita, setNewCategoriaReceita] = useState("");

  useEffect(() => {
    if (userId) {
      initializeCategorias(userId);
      fetchReceitas(userId);
      fetchCategoriasReceita(userId);
    }
  }, [userId]);

  const initializeCategorias = async (uid: string) => {
    const categoriasReceitaRef = collection(
      db,
      "users",
      uid,
      "categoriasReceita"
    );
    await setDoc(doc(categoriasReceitaRef, "receitaPadrao"), {
      nome: "Receita Padrão",
    });
  };

  const fetchReceitas = (uid: string) => {
    const receitasRef = collection(db, "users", uid, "receitas");
    onSnapshot(receitasRef, (snapshot) => {
      const receitasData = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setReceitas(receitasData);
      calculateTotalReceitas(receitasData); // Calcula o total de receitas
    });
  };

  const fetchCategoriasReceita = (uid: string) => {
    const categoriasReceitaRef = collection(
      db,
      "users",
      uid,
      "categoriasReceita"
    );
    onSnapshot(categoriasReceitaRef, (snapshot) => {
      const categoriasData = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setCategoriasReceita(categoriasData);
    });
  };

  const calculateTotalReceitas = (receitasData: any[]) => {
    const total = receitasData.reduce(
      (acc, receita) => acc + parseFloat(receita.valor),
      0
    );
    setTotalReceitas(total);
  };

  const handleAddReceita = async () => {
    if (
      newReceita.valor.trim() === "" ||
      newReceita.descricao.trim() === "" ||
      newReceita.data.trim() === ""
    )
      return;

    const receitasRef = collection(db, "users", userId, "receitas");
    await addDoc(receitasRef, {
      valor: parseFloat(newReceita.valor),
      descricao: newReceita.descricao,
      data: newReceita.data,
      categoria: newReceita.categoria,
    });

    setNewReceita({
      valor: "",
      descricao: "",
      data: "",
      categoria: "Receita Padrão",
    });
    setShowReceitaForm(false);
  };

  const handleAddCategoriaReceita = async () => {
    if (newCategoriaReceita.trim() === "") return;

    const categoriasReceitaRef = collection(
      db,
      "users",
      userId,
      "categoriasReceita"
    );
    await addDoc(categoriasReceitaRef, { nome: newCategoriaReceita });

    setNewCategoriaReceita("");
    setShowCategoriaForm(false);
  };

  const handleDeleteReceita = async (id: string) => {
    const receitaDoc = doc(db, "users", userId, "receitas", id);
    await deleteDoc(receitaDoc);
  };

  const handleDeleteCategoriaReceita = async (id: string) => {
    const categoria = categoriasReceita.find((cat) => cat.id === id);

    if (categoria && categoria.nome === "Receita Padrão") return;

    const receitasRef = query(
      collection(db, "users", userId, "receitas"),
      where("categoria", "==", categoria?.nome)
    );

    const receitasSnap = await getDocs(receitasRef);
    if (!receitasSnap.empty) {
      alert(
        `Não é possível excluir a categoria ${categoria?.nome}, pois existem receitas associadas a ela.`
      );
      return;
    }

    const categoriaDoc = doc(db, "users", userId, "categoriasReceita", id);
    await deleteDoc(categoriaDoc);
    alert(`Categoria ${categoria?.nome} excluída com sucesso.`);
  };

  return (
    <div className="receitas-container">
       <GraficoReceitasPorCategoria userId={userId} />
      <h2>Receitas - Total: R$ {totalReceitas.toFixed(2)}</h2>

      {receitas.length === 0 ? (
        <p>Não há receitas cadastradas. Adicione uma nova receita abaixo.</p>
      ) : (
        <ul>
          {receitas.map((receita) => (
            <li key={receita.id}>
              {receita.descricao} - R${receita.valor} - {receita.data} -{" "}
              {receita.categoria}
              <button onClick={() => handleDeleteReceita(receita.id)}>
                Excluir
              </button>
            </li>
          ))}
        </ul>
      )}

      {!showReceitaForm && (
        <button onClick={() => setShowReceitaForm(true)}>
          Adicionar Nova Receita
        </button>
      )}

      {showReceitaForm && (
        <div className="receita-form">
          <button
            className="close-button"
            onClick={() => setShowReceitaForm(false)}
          >
            X
          </button>
          <input
            type="number"
            placeholder="Valor da Receita"
            value={newReceita.valor}
            onChange={(e) =>
              setNewReceita({ ...newReceita, valor: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Descrição"
            value={newReceita.descricao}
            onChange={(e) =>
              setNewReceita({ ...newReceita, descricao: e.target.value })
            }
          />
          <input
            type="date"
            value={newReceita.data}
            onChange={(e) =>
              setNewReceita({ ...newReceita, data: e.target.value })
            }
          />
          <select
            value={newReceita.categoria}
            onChange={(e) =>
              setNewReceita({ ...newReceita, categoria: e.target.value })
            }
          >
            {categoriasReceita.map((categoria) => (
              <option key={categoria.id} value={categoria.nome}>
                {categoria.nome}
              </option>
            ))}
          </select>
          <button onClick={handleAddReceita}>Adicionar Receita</button>
        </div>
      )}

      <h3>Categorias de Receita</h3>

      <ul>
        {categoriasReceita.map((categoria) => (
          <li key={categoria.id}>
            {categoria.nome}
            {categoria.nome !== "Receita Padrão" && (
              <button onClick={() => handleDeleteCategoriaReceita(categoria.id)}>
                Excluir
              </button>
            )}
          </li>
        ))}
      </ul>

      {!showCategoriaForm && (
        <button onClick={() => setShowCategoriaForm(true)}>
          Adicionar Nova Categoria
        </button>
      )}

      {showCategoriaForm && (
        <div className="categoria-form">
          <button
            className="close-button"
            onClick={() => setShowCategoriaForm(false)}
          >
            X
          </button>
          <input
            type="text"
            placeholder="Nova Categoria de Receita"
            value={newCategoriaReceita}
            onChange={(e) => setNewCategoriaReceita(e.target.value)}
          />
          <button onClick={handleAddCategoriaReceita}>
            Adicionar Categoria
          </button>
        </div>
      )}
    </div>
  );
}
