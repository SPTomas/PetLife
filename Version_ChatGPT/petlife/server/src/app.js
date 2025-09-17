import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import health from './routes/health.js';
import dogs from './routes/dogs.js';
import notes from './routes/notes.js';
import events from './routes/events.js';

dotenv.config();
const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json());

app.use('/api', health);
app.use('/api/dogs', dogs);
app.use('/api/notes', notes);
app.use('/api/events', events);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
