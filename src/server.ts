import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import multer from 'multer';
import { processFatura } from './extractData';
import fs from 'fs';

const app = express();
const prisma = new PrismaClient();

// Configuração do CORS
app.use(cors({
    origin: 'http://localhost:3001',
}));

// Configuração do Multer para lidar com uploads de arquivos
const upload = multer({ dest: 'uploads/' }); // Os arquivos serão armazenados na pasta 'uploads'

// Rota inicial
app.get('/', (req, res) => {
    res.json({ message: 'Bem-vindo à API de Faturas!' });
});

// Rota para obter faturas
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
        const faturaData = processFatura(file.path);
        fs.unlinkSync(file.path);
        res.send(faturaData);
    } catch (error) {
        res.status(500).json({error});
    }  
});

// Iniciar o servidor
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
