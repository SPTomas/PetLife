import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// cargar variables de entorno (.env)
dotenv.config();

const app = express();

// middlewares
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

// rutas
app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    service: 'petlife-api',
    time: new Date().toISOString()
  });
});

// fallback si no matchea ninguna ruta
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// levantar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ API running on http://localhost:${PORT}`);
});
