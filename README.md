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

