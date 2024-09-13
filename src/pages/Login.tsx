import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../firebaseConfig";
import '../styles/login.css';
import BotaoLoginGoogle from "../components/BotaoLoginGoogle";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (email === "" || password === "") {
      setError("Todos os campos são obrigatórios.");
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigate("/"); 
      })
      .catch((error) => {
        if (error.code === "auth/wrong-password") {
          setError("Senha incorreta.");
        } else if (error.code === "auth/user-not-found") {
          setError("Usuário não encontrado.");
        } else if (error.code === "auth/invalid-email") {
          setError("Email inválido.");
        } else {
          setError("Erro ao fazer login: " + error.message);
        }
      });
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
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
      <button onClick={handleLogin}>Login</button>

      <BotaoLoginGoogle />

      <p>
        Não tem uma conta? <Link to="/cadastro">Cadastre-se</Link>
      </p>
    </div>
  );
}
