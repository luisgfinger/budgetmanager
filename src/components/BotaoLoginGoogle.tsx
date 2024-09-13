import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import '../styles/botaoLoginGoogle.css'

export default function BotaoLoginGoogle() {
  const navigate = useNavigate();
  const handleGoogleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(() => {
        navigate("/"); 
      })
      .catch((error) => {
        console.error("Erro ao fazer login com o Google: ", error);
      });
  };

  return (
    <button onClick={handleGoogleLogin} className="google-login-button">
      Login com Google
    </button>
  );
}
