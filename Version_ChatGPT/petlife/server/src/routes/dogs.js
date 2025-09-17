import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
const r = Router();

// Crear
r.post('/', async (req, res) => {
  try {
    const dog = await prisma.dog.create({ data: req.body });
    res.status(201).json(dog);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

// Listar por usuario
r.get('/owner/:ownerId', async (req, res) => {
  try {
    const dogs = await prisma.dog.findMany({
      where: { ownerId: Number(req.params.ownerId) },
      orderBy: { createdAt: 'desc' }
    });
    res.json(dogs);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Modificar
r.put('/:id', async (req, res) => {
  try {
    const dog = await prisma.dog.update({
      where: { id: Number(req.params.id) },
      data: req.body
    });
    res.json(dog);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

// Eliminar
r.delete('/:id', async (req, res) => {
  try {
    await prisma.dog.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch (e) { res.status(400).json({ error: e.message }); }
});

export default r;
