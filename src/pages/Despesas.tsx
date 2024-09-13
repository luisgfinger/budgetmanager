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
import "../styles/despesas.css";
import GraficoDespesasPorCategoria from "../components/GraficoDespesasPorCategoria";

interface DespesasProps {
  userId: string;
}

export default function Despesas({ userId }: DespesasProps) {
  const [despesas, setDespesas] = useState<any[]>([]);
  const [totalDespesas, setTotalDespesas] = useState(0);
  const [categoriasDespesa, setCategoriasDespesa] = useState<any[]>([]);
  const [showDespesaForm, setShowDespesaForm] = useState(false);
  const [showCategoriaForm, setShowCategoriaForm] = useState(false);

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const [newDespesa, setNewDespesa] = useState({
    valor: "",
    descricao: "",
    data: getTodayDate(),
    categoria: "Despesa Padrão",
  });

  const [newCategoriaDespesa, setNewCategoriaDespesa] = useState("");

  useEffect(() => {
    if (userId) {
      initializeCategorias(userId);
      fetchDespesas(userId);
      fetchCategoriasDespesa(userId);
    }
  }, [userId]);

  const initializeCategorias = async (uid: string) => {
    const categoriasDespesaRef = collection(
      db,
      "users",
      uid,
      "categoriasDespesa"
    );
    await setDoc(doc(categoriasDespesaRef, "despesaPadrao"), {
      nome: "Despesa Padrão",
    });
  };

  const fetchDespesas = (uid: string) => {
    const despesasRef = collection(db, "users", uid, "despesas");
    onSnapshot(despesasRef, (snapshot) => {
      const despesasData = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setDespesas(despesasData);
      calculateTotalDespesas(despesasData);
    });
  };

  const fetchCategoriasDespesa = (uid: string) => {
    const categoriasDespesaRef = collection(
      db,
      "users",
      uid,
      "categoriasDespesa"
    );
    onSnapshot(categoriasDespesaRef, (snapshot) => {
      const categoriasData = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setCategoriasDespesa(categoriasData);
    });
  };

  const calculateTotalDespesas = (despesasData: any[]) => {
    const total = despesasData.reduce(
      (acc, despesa) => acc + parseFloat(despesa.valor),
      0
    );
    setTotalDespesas(total);
  };

  const handleAddDespesa = async () => {
    if (
      newDespesa.valor.trim() === "" ||
      newDespesa.descricao.trim() === "" ||
      newDespesa.data.trim() === ""
    )
      return;

    const despesasRef = collection(db, "users", userId, "despesas");
    await addDoc(despesasRef, {
      valor: parseFloat(newDespesa.valor),
      descricao: newDespesa.descricao,
      data: newDespesa.data,
      categoria: newDespesa.categoria,
    });

    setNewDespesa({
      valor: "",
      descricao: "",
      data: getTodayDate(),
      categoria: "Despesa Padrão",
    });
    setShowDespesaForm(false);
  };

  const handleAddCategoriaDespesa = async () => {
    if (newCategoriaDespesa.trim() === "") return;

    const categoriasDespesaRef = collection(
      db,
      "users",
      userId,
      "categoriasDespesa"
    );
    await addDoc(categoriasDespesaRef, { nome: newCategoriaDespesa });

    setNewCategoriaDespesa("");
    setShowCategoriaForm(false);
  };

  const handleDeleteDespesa = async (id: string) => {
    const despesaDoc = doc(db, "users", userId, "despesas", id);
    await deleteDoc(despesaDoc);
  };

  const handleDeleteCategoriaDespesa = async (id: string) => {
    const categoria = categoriasDespesa.find((cat) => cat.id === id);

    if (categoria && categoria.nome === "Despesa Padrão") return;

    const despesasRef = query(
      collection(db, "users", userId, "despesas"),
      where("categoria", "==", categoria?.nome)
    );

    const despesasSnap = await getDocs(despesasRef);
    if (!despesasSnap.empty) {
      alert(
        `Não é possível excluir a categoria ${categoria?.nome}, pois existem despesas associadas a ela.`
      );
      return;
    }

    const categoriaDoc = doc(db, "users", userId, "categoriasDespesa", id);
    await deleteDoc(categoriaDoc);
    alert(`Categoria ${categoria?.nome} excluída com sucesso.`);
  };

  return (
    <div className="despesas-container">
      <GraficoDespesasPorCategoria userId={userId} />
      <h2>Despesas - Total: R$ {totalDespesas.toFixed(2)}</h2>

      {despesas.length === 0 ? (
        <p>Não há despesas cadastradas. Adicione uma nova despesa abaixo.</p>
      ) : (
        <ul>
          {despesas.map((despesa) => (
            <li key={despesa.id}>
              {despesa.descricao} - R${despesa.valor} -{" "}
              {new Date(despesa.data).toLocaleDateString("pt-BR")} -{" "}
              {despesa.categoria}
              <button onClick={() => handleDeleteDespesa(despesa.id)}>
                Excluir
              </button>
            </li>
          ))}
        </ul>
      )}

      {!showDespesaForm && (
        <button onClick={() => setShowDespesaForm(true)}>
          Adicionar Nova Despesa
        </button>
      )}

      {showDespesaForm && (
        <div className="despesa-form">
          <button
            className="close-button"
            onClick={() => setShowDespesaForm(false)}
          >
            X
          </button>
          <input
            type="number"
            placeholder="Valor da Despesa"
            value={newDespesa.valor}
            onChange={(e) =>
              setNewDespesa({ ...newDespesa, valor: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Descrição"
            value={newDespesa.descricao}
            onChange={(e) =>
              setNewDespesa({ ...newDespesa, descricao: e.target.value })
            }
          />
          <input
            type="date"
            value={newDespesa.data}
            onChange={(e) =>
              setNewDespesa({ ...newDespesa, data: e.target.value })
            }
          />
          <select
            value={newDespesa.categoria}
            onChange={(e) =>
              setNewDespesa({ ...newDespesa, categoria: e.target.value })
            }
          >
            {categoriasDespesa.map((categoria) => (
              <option key={categoria.id} value={categoria.nome}>
                {categoria.nome}
              </option>
            ))}
          </select>
          <button onClick={handleAddDespesa}>Adicionar Despesa</button>
        </div>
      )}

      <h3>Categorias de Despesa</h3>

      <ul>
        {categoriasDespesa.map((categoria) => (
          <li key={categoria.id}>
            {categoria.nome}
            {categoria.nome !== "Despesa Padrão" && (
              <button
                onClick={() => handleDeleteCategoriaDespesa(categoria.id)}
              >
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
            placeholder="Nova Categoria de Despesa"
            value={newCategoriaDespesa}
            onChange={(e) => setNewCategoriaDespesa(e.target.value)}
          />
          <button onClick={handleAddCategoriaDespesa}>
            Adicionar Categoria
          </button>
        </div>
      )}
    </div>
  );
}
