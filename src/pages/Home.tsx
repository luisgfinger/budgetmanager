import { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Sobre from "./Sobre";
import HomeContent from "./HomeContent";
import Cadastro from "./Cadastro";
import Login from "./Login";
import Dashboard from "./Dashboard"; 
import { getAuth, onAuthStateChanged, signOut, User } from "firebase/auth";
import "../styles/home.css";
import Logo from '../assets/logo.svg'

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, [auth]);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
      })
      .catch((error) => {
        console.error("Erro ao fazer logout:", error);
      });
  };

  return (
    <main className="container">
      <header>
        <div className="header-logo">
          <Link to={"/"}>
          <img src={Logo} alt="Logo" />
          </Link>
        </div>

        <nav className="header-nav">
          <ul className="nav-links">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/sobre">Sobre</Link>
            </li>

            {!user && (
              <>
                <li>
                  <Link to="/cadastro">Cadastre-se</Link>
                </li>
                <li>
                  <Link to="/login">Login</Link>
                </li>
              </>
            )}
            {user && (
              <li>
                <Link to="#" onClick={handleLogout}>Sair</Link>
              </li>
            )}
          </ul>
        </nav>
      </header>

      <section className="content">
        <Routes>
          <Route path="/" element={<HomeContent />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/login" element={<Login />} />  
          <Route
            path="/dashboard"
            element={
                <Dashboard />
            }
          />
        </Routes>
      </section>
    </main>
  );
}
