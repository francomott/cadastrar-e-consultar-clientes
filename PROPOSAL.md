**Proposta de Teste Prático para Desenvolvedor Pleno/Sênior**  
_(Focado em Clean Architecture, SOLID e boas práticas com Docker, Redis, Mensageria, etc.)_

---

### Escopo Geral

Você deverá implementar um **serviço de cadastro e consulta de clientes** que atenda aos seguintes requisitos:

1. **API (REST)** para:

   - **Cadastrar** um cliente.
   - **Atualizar** dados de um cliente.
   - **Consultar** detalhes de um cliente por ID.
   - **Listar** todos os clientes.

2. **Banco de Dados**:

   - Usar **MongoDB** para armazenar as informações de cliente:
     - A entidade **Cliente** deve conter ao menos:
       - `nome` (string)
       - `email` (string)
       - `telefone` (string)

3. **Cache**:

   - Usar **Redis** para cachear informações de cliente nas consultas (por exemplo, no endpoint de consulta por ID).

4. **Mensageria**:

   - Crie um fluxo (mesmo que simplificado) de produção e consumo de mensagens.
   - Exemplo: quando um novo cliente for cadastrado, envie uma mensagem para uma fila/tópico e crie um consumidor que processe essa mensagem (pode ser algo simples, como registrar um log ou persistir alguma informação adicional).

5. **Clean Architecture**:

   - **Obrigatório** utilizar uma estrutura de camadas, seguindo princípios de Clean Architecture e SOLID.
   - Deve conter **controllers**, **repositórios** e **entidades**, de forma clara e separada.
   - Criar uma entidade base (`BaseEntity`, por exemplo), que pode conter campos genéricos (ID, datas de criação/atualização, etc.).
   - Criar um repositório base (`BaseRepository`, por exemplo), que contenha métodos genéricos de CRUD.

6. **Docker**:

   - Crie um arquivo `Dockerfile` e/ou `docker-compose.yml` para executar a aplicação, o banco de dados, o Redis e a mensageria (Kafka, RabbitMQ etc.).

7. **Bônus (opcional, mas valorizado)**:
   - **Testes Unitários**: escreva testes unitários para os serviços e repositórios.
   - **CI/CD**: demonstre como configuraria, mesmo que de forma simplificada, um pipeline de build e testes.

---

### Requisitos Técnicos

- **Linguagem/Framework**:
  - **Node.js** (TypeScript + Express.js)
- **Banco de Dados**:
  - **MongoDB** (executado via Docker para facilitar testes locais).
- **Cache**:
  - **Redis**.
- **Mensageria**:
  - **Kafka**, **RabbitMQ** ou outro que domine.
- **Arquitetura**:
  - **Clean Architecture** (domínio, repositórios, use-cases, controllers),
  - Princípios **SOLID**,
  - Entidades base como `BaseEntity`
  - Repositórios base como `BaseRepository`.
- **Containerização**:
  - **Docker** e `docker-compose` para rodar a aplicação, banco, cache e mensageria.
- **Testes**:
  - Ao menos **testes unitários** nos serviços e repositórios.
- **Documentação**:
  - Um pequeno **README.md** explicando como rodar a aplicação, os testes e descrevendo a arquitetura.

---

### O que será Avaliado

1. **Estrutura de pastas** do projeto e aplicação de padrões arquiteturais (Clean Architecture).
2. **Qualidade e organização do código** (legibilidade, separação de responsabilidades, tratamento de erros, logs, etc.).
3. **Uso correto das tecnologias** (Node/Python, Redis, MongoDB, mensageria).
4. **Boas práticas** (SOLID, uso de entidades base, repositórios base, testes).
5. **Como lida com escalabilidade** (caching, mensageria).
6. **Facilidade de execução** (scripts, instruções de uso, Docker).
7. **Documentação** (README e clareza dos passos).

---

### Entrega

- **Repositório** (no GitHub) contendo:
  1. Código fonte da aplicação.
  2. `Dockerfile` e `docker-compose.yml`.
  3. Scripts de inicialização (se necessários).
  4. `README.md` explicando:
     - Como subir a aplicação e serviços via Docker.
     - Endpoints disponíveis e como chamá-los.
     - Como rodar os testes.

---

### Dicas e Observações

- **Foque na qualidade** do que for desenvolvido (estrutura e código limpo).