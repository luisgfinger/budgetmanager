import '../styles/homeContent.css'

export default function HomeContent() {
  return (
    <div id='homeContent-container'>
      <div id='homeContent-items'>
        <section className="intro">
          <h1>Bem-vindo ao Gerenciador de Orçamento Pessoal</h1>
          <p>
            Este aplicativo foi desenvolvido para ajudar você a organizar suas finanças de maneira simples, prática e eficiente. Acompanhe suas receitas e despesas e obtenha uma visão clara do seu saldo disponível.
          </p>

          <section className="features">
            <h2>Funcionalidades Principais</h2>
            <ul>
              <li><strong>Gerenciamento de Despesas:</strong> Adicione, edite ou exclua despesas e categorize-as para ter um controle melhor.</li>
              <li><strong>Gerenciamento de Receitas:</strong> Insira suas fontes de renda e acompanhe sua evolução financeira.</li>
              <li><strong>Visualização Gráfica:</strong> Veja um resumo das suas despesas por categoria com gráficos que facilitam o entendimento do seu orçamento.</li>
              <li><strong>Controle de Saldo:</strong> Obtenha uma visão clara do seu saldo atual com base nas receitas e despesas cadastradas.</li>
            </ul>
          </section>

          <section className="how-it-works">
            <h2>Como Funciona</h2>
            <p>
              O Gerenciador de Orçamento Pessoal permite que você:
            </p>
            <ol>
              <li>Cadastre suas despesas e receitas conforme elas acontecem.</li>
              <li>Acompanhe seu saldo atualizado automaticamente com base nas entradas e saídas financeiras.</li>
              <li>Utilize gráficos para visualizar o impacto de cada categoria no seu orçamento.</li>
              <li>Tenha o controle total da sua vida financeira de forma simples e prática.</li>
            </ol>
          </section>

          <section className="security">
            <h2>Segurança e Privacidade</h2>
            <p>
              Todos os seus dados são protegidos utilizando autenticação via Google e armazenados com segurança no Firebase, garantindo que apenas você tenha acesso às suas informações financeiras.
            </p>
          </section>

          <section className="get-started">
            <h2>Comece Agora</h2>
            <p>
              Pronto para começar a gerenciar suas finanças? Faça login ou crie uma conta e tenha total controle do seu orçamento pessoal.
            </p>
            <p><a href="/cadastro">Cadastre-se agora</a> ou <a href="/login">faça login</a> para começar!</p>
          </section>
        </section>
      </div>
    </div>
  );
}
