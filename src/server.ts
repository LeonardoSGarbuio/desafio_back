import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import coursesRouter from './routes/courses.routes';
import modulesRouter from './routes/modules.routes';

const app = express();

app.use(cors());
app.use(express.json());

// Rotas da aplicação
app.use('/courses', coursesRouter);
app.use('/modules', modulesRouter);

// Rota de teste 
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API rodando!' });
});

const PORT = Number(process.env.PORT) || 3001;

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});