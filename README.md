**Faturas - Sistema de Upload e Download de Faturas**


Este projeto permite o upload, armazenamento e download de faturas de energia elétrica em formato PDF, além de apresentar um dashboard para visualização de dados extraídos das faturas, como consumo de energia, valores e contribuições.

**Funcionalidades**

Upload de Faturas: Faz o upload de arquivos PDF para uma pasta específica e salva o caminho no banco de dados.

Download de Faturas: Permite o download das faturas armazenadas com base no ID passado na URL.

Visualização de Dados: Exibe os dados extraídos das faturas em um dashboard, utilizando gráficos e resumos financeiros.

Dashboard: Visualização gráfica do consumo de energia, compensação de energia e valores financeiros, utilizando a biblioteca Chart.js com react-chartjs-2.

**Tecnologias Utilizadas**

Frontend: React.js com Bootstrap

Backend: Node.js com Express e Multer para upload de arquivos

Banco de Dados: PostgreSQL

ORM: Prisma

Bibliotecas para PDF: pdf-lib ou pdf-parse para extração de dados de PDFs

Gráficos: Chart.js e react-chartjs-2

**Requisitos**

Node.js

PostgreSQL

NPM

Sequelize ou Prisma para manipulação do banco de dados


**Instalação e Configuração**

**1. Clone o repositório para o seu ambiente local:**

Copiar código:

git clone https://github.com/seu-usuario/projeto-faturas.git

cd projeto-faturas


**2. Instale as dependências no diretório do backend:**

Copiar código:

npm install

**3. Instale as dependências no diretório do frontend:**

Copiar código:

cd ../faturas-frontend

npm install

**4. Configure o banco de dados no arquivo .env no diretório backend. Exemplo:**

Copiar código:

DATABASE_URL=postgresql://usuario:senha@localhost:5432/nome_do_banco

**5. Execute as migrações do banco de dados (caso esteja usando Prisma)**:

Copiar código:

npx prisma migrate dev

**6.Inicie o servidor backend**

Copiar código:

cd ..projeto-faturas

npm run dev

**7. Inicie o servidor frontend:**

Copiar código:

cd ../faturas-frontend

npm start


**Acesse a aplicação:**

**Frontend: http://localhost:3000**

**Backend: http://localhost:3001**


