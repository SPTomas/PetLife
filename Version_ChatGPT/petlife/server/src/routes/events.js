import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
const r = Router();

// Crear evento (calendario)
r.post('/', async (req, res) => {
  try {
    const event = await prisma.calendarEvent.create({ data: req.body });
    res.status(201).json(event);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

// Listar eventos por usuario
r.get('/owner/:ownerId', async (req, res) => {
  try {
    const events = await prisma.calendarEvent.findMany({
      where: { ownerId: Number(req.params.ownerId) },
      orderBy: { date: 'asc' }
    });
    res.json(events);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

export default r;
