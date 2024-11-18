# API Controle de Ponto <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People%20with%20professions/Man%20Technologist%20Light%20Skin%20Tone.png" alt="Man Technologist Light Skin Tone" width="25" height="25" />

![JavaScript](https://img.shields.io/badge/-JavaScript-05122A?style=flat&logo=javascript)&nbsp;
![SQLite](https://img.shields.io/badge/-SQLite-05122A?style=flat&logo=sqlite)&nbsp;
![Express](https://img.shields.io/badge/-Express-05122A?style=flat&logo=express)&nbsp;

## Descrição 📃
Este projeto foi desenvolvido como uma API para controle de ponto de funcionários, desenvolvida utilizando Node.js, Express e SQLite.
A API permite gerenciar colaboradores, registrar pontos, configurar jornadas de trabalho e gerenciar solicitações de edição de pontos, para banco foi escolhido o SQLite por sua simplicidade e facilidade de implementação.
Esta API está sendo utilizada juntamente com o projeto [Controle de Ponto](https://github.com/EdmirSoares/controle-de-ponto), o qual é uma plataforma web desenvolvida para facilitar o registro de ponto dos usuários, possibilitando o registro do mesmo de forma online, maiores detalhes podem ser encontrados no README do respectivo projeto.

## Instalação ⚙️
### Pré-requisitos

- Node.js e npm instalados na máquina.

### Passo a Passo

1. **Clone o Repositório:**
   ```sh
   git clone https://github.com/EdmirSoares/controle-de-ponto-api.git  
2. **Entre na Pasta do Projeto**
   ```sh
   cd controle-de-ponto-api
3. **Instale as dependências**
   ```sh
   npm install
4. **Inicie o Projeto**
   ```sh
   node index.js

## Funcionalidades 🖥️
- **Colaboradores**:
  - Criar, atualizar, listar e deletar colaboradores.
  - Atualizar o status de um colaborador (ativo/inativo).
  - Login de colaboradores.

- **Pontos**:
  - Registrar pontos de entrada e saída.
  - Listar todos os pontos ou pontos de um colaborador específico.
  - Atualizar o status de um ponto.
  - Solicitar edição de um ponto.
  - Deletar todos os pontos de um colaborador.

- **Configuração de Jornada**:
  - Configurar a jornada de trabalho de um colaborador.
  - Listar a configuração de jornada de um colaborador.

## Endpoints 📍
- **Colaboradores**:
  - GET /colaboradores: Lista todos os colaboradores.
  - GET /colaboradores/:idFuncionario: Obtém um colaborador pelo ID.
  - POST /colaboradores: Cria um novo colaborador.
  - PUT /colaboradores: Atualiza um colaborador existente.
  - PUT /colaboradores/ativo: Atualiza o status de um colaborador.
  - DELETE /colaboradores: Deleta um colaborador.
  - POST /colaboradores/login: Realiza o login de um colaborador.

- **Pontos**:
  - GET /pontos: Lista todos os pontos.
  - GET /pontos/:idFuncionario: Lista todos os pontos de um colaborador específico.
  - POST /pontos/status: Lista todos os pontos por status.
  - POST /pontos: Registra um novo ponto.
  - PUT /pontos/status/update: Atualiza o status de um ponto.
  - PUT /pontos/solicitacao: Solicita a edição de um ponto.
  - PUT /pontos: Atualiza um ponto.
  - DELETE /pontos: Deleta todos os pontos de um colaborador.

- **Configuração de Jornada**:
  - GET /jornada/:idFuncionario: Lista a configuração de jornada de um colaborador.
    (A inserção da jornada de trabalho é feita juntamente com o POST do Colaborador)

## Banco de Dados 🗃️
O projeto utiliza SQLite como banco de dados. As tabelas principais são:
  - colaboradores: Armazena informações dos colaboradores.
  - pontos: Armazena os registros de pontos dos colaboradores.
  - config_jornada: Armazena as configurações de jornada de trabalho dos colaboradores.

## Contribuição 📧
Se você deseja contribuir com este projeto, sinta-se à vontade para entrar em contato, abrir uma issue ou enviar um pull request!
