import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
const r = Router();

// Crear nota para un perro
r.post('/dog/:dogId', async (req, res) => {
  try {
    const note = await prisma.note.create({
      data: { ...req.body, dogId: Number(req.params.dogId) }
    });
    res.status(201).json(note);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

// Listar notas de un perro
r.get('/dog/:dogId', async (req, res) => {
  try {
    const notes = await prisma.note.findMany({
      where: { dogId: Number(req.params.dogId) },
      orderBy: { date: 'desc' }
    });
    res.json(notes);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Modificar / Eliminar
r.put('/:id', async (req, res) => {
  try {
    const note = await prisma.note.update({
      where: { id: Number(req.params.id) },
      data: req.body
    });
    res.json(note);
  } catch (e) { res.status(400).json({ error: e.message }); }
});
r.delete('/:id', async (req, res) => {
  try {
    await prisma.note.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch (e) { res.status(400).json({ error: e.message }); }
});

export default r;
