# Trabalho Acadêmico

- Disciplina: EC48B - Programação Web Back-End - C81 (2025_01)
- Alunos: Maria Julia Leal e Nathan Zavam
- Tema: Microblogging
- Entrega 2: Node.js, MongoDB e Express

# Funcionalidades

- Autenticação de Usuários: Registro de novas contas com senha criptografada (bcrypt)  e Login de usuários e gerenciamento de sessão.

- Gerenciamento de Posts (CRUD Completo)

- Gerenciamento de Comentários (CRUD Completo)

- Autorização: Lógica de negócio que garante que um usuário só pode modificar o conteúdo que lhe pertence.

# Instruções para execução

Pré-requisitos:
- Node.js instalado
- MongoDB rodando localmente na porta padrão

Passos para executar:
1. Certifique-se que o arquivo `.env` contém o seguinte conteúdo(URI onde rodei meu banco localmente):
   MONGO_URI=mongodb://localhost:27017

2. No terminal:
   npm install
   node src/app.js

3. Abra seu navegador e acesse http://localhost:3000.
