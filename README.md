Gerenciador de Orçamento Pessoal
Este é um sistema de Gerenciamento de Orçamento Pessoal desenvolvido em React com TypeScript e integração com o Firebase. O objetivo deste projeto é permitir que os usuários gerenciem suas finanças pessoais, adicionando e categorizando despesas e receitas, além de visualizar gráficos e acompanhar o saldo total.

Funcionalidades
Autenticação de usuários: Login com Google e email/senha utilizando o Firebase Authentication.
Gerenciamento de Despesas: Adicionar, editar e excluir despesas, além de categorizá-las.
Gerenciamento de Receitas: Adicionar, editar e excluir receitas, categorizando-as.
Visualização de Gráficos: Gráficos de pizza para visualizar despesas por categoria.
Dashboard Financeiro: Exibição de um resumo com total de despesas, receitas e saldo.
Responsividade: Layout adaptado para dispositivos móveis e desktops.
Tecnologias Utilizadas
React: Biblioteca para construção da interface do usuário.
TypeScript: Tipagem estática para o código JavaScript.
Firebase:
Firestore: Banco de dados em tempo real.
Authentication: Gerenciamento de autenticação de usuários.
React Router: Navegação entre páginas.
Chart.js: Exibição de gráficos de despesas por categoria.

Instalação
Siga os passos abaixo para configurar o projeto localmente:

Clone o repositório:

git clone https://github.com/seu-usuario/nome-do-repositorio.git

Entre no diretório do projeto:

cd nome-do-repositorio

Instale as dependências:

npm install

Configure o Firebase:

Crie um projeto no Firebase Console.
Adicione as configurações do Firebase no arquivo firebaseConfig.ts na pasta src.

Inicie o servidor de desenvolvimento:
npm start

Acesse o projeto no navegador:
http://localhost:3000

Deploy
Este projeto está configurado para deploy no Firebase Hosting. Para realizar o deploy:

Faça o build do projeto:
npm run build

Faça o deploy para o Firebase:
firebase deploy

Contribuição
Se você deseja contribuir com este projeto, siga os passos abaixo:

Faça um fork do repositório.
Crie uma branch para sua feature (git checkout -b feature/nova-feature).
Faça o commit de suas alterações (git commit -m 'Adiciona nova feature').
Envie para a branch principal (git push origin feature/nova-feature).
Abra um Pull Request.
