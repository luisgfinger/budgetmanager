import '../styles/sobre.css'


export default function sobre(){
    return(
        <div className="sobre-container">
      <img
        src={require("../assets/fotoprogit.png")}
        alt="Meu Avatar"
        className="sobre-avatar"
      />

      <h1>Luis Gustavo Grando Finger</h1>
      <h2>Quase Engenheiro de Software</h2>
      <p>
        Estou começando minha jornada na área de desenvolvimento web, aprendendo
        cada dia mais sobre as tecnologias que moldam a web moderna. Tenho
        focado em aprimorar minhas habilidades em HTML, CSS, JavaScript e React,
        com o objetivo de criar aplicações funcionais e interativas.
      </p>
      <p>
        Além do desenvolvimento web, sou entusiasta em Java, explorando sua
        vasta aplicação no desenvolvimento de software corporativo e back-end.
        Estou sempre em busca de novos conhecimentos e desafios que me permitam
        evoluir como desenvolvedor.
      </p>
      <a
        href="https://github.com/luisgfinger"
        target="_blank"
        rel="noopener noreferrer"
        className="github-link"
      >
        Github: github.com/luisgfinger
      </a>
    </div>
    );
}


