import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import multer from 'multer';
import { processFatura } from './extractData';
import path from 'path';

const app = express();
const prisma = new PrismaClient();

app.use(cors({
    origin: 'http://localhost:3001',
}));


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

app.get('/faturas', async (req, res) => {
    try {
        const faturas = await prisma.fatura.findMany();
        res.json(faturas);
    } catch (error) {
        res.status(500).json({ error });
    }
});

app.post('/faturas/leitura', upload.single('file'), (req, res) => {
    const file = req.file as Express.Multer.File;;
    if (!file) {
        res.status(400).send({ error: 'Arquivo não encontrado.' });
    }
    try {
        console.log(file);
        const faturaData = processFatura(file.path);
        res.send(faturaData);
    } catch (error) {
        res.status(500).json({error});
    }  
});

interface CustomError extends Error {
    status?: number;
}

app.get('/faturas/download/:id', (req, res) => {
  const invoiceId = req.params.id;
  const filePath = path.join(__dirname, 'uploads/', `${invoiceId}`);
  console.log(filePath);
  
  res.download(filePath, (err: CustomError) => {
    if (err) {
      console.error("Erro ao baixar a fatura:", err);
      if (err.status === 404) {
        res.status(404).send('Fatura não encontrada');
      } else {
        res.status(500).send('Erro ao baixar a fatura');
      }
    } else {
      console.log(`Fatura ${invoiceId} baixada com sucesso.`);
    }
  });
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
