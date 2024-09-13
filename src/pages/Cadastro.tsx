import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../firebaseConfig";
import '../styles/cadastro.css'
import BotaoLoginGoogle from "../components/BotaoLoginGoogle";

export default function Cadastro() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); 
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignUp = () => {
    if (email === "" || password === "" || confirmPassword === "") {
      setError("Todos os campos são obrigatórios.");
      return;
    }

    if (password.length < 8) {
      setError("A senha deve ter no mínimo 8 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigate("/"); 
      })
      .catch((error) => {
        setError("Erro ao criar conta: " + error.message);
      });
  };

  return (
    <div className="cadastro-container">
      <h1>Criar Conta</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Confirme sua senha"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <button onClick={handleSignUp}>Cadastrar</button>

      <BotaoLoginGoogle/>
      
      <p>
        Já tem uma conta? <Link to="/login">Faça login</Link>
      </p>
    </div>
  );
}
