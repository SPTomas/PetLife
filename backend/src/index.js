// backend/src/index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { prisma } from './lib/prisma.js';
import { requireAuth } from './middlewares/auth.js';
import { z, ZodError } from 'zod';

dotenv.config();

const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());

// Healthcheck
app.get('/api/health', (_req, res) =>
  res.json({ ok: true, time: new Date().toISOString() })
);

// ---- Perfil sombra (se crea/actualiza con el id de Supabase) ----
app.get('/api/me', requireAuth, async (req, res, next) => {
  try {
    const me = await prisma.usuario.upsert({
      where: { id: req.user.id },
      update: { correo: req.user.email ?? '' },
      create: { id: req.user.id, correo: req.user.email ?? '' },
    });
    res.json({
      id: me.id,
      email: me.correo,
      nombre: me.nombre,
      telefono: me.telefono,
    });
  } catch (err) {
    next(err);
  }
});

const perfilSchema = z.object({
  nombre: z.string().min(1).optional(),
  telefono: z.string().optional(),
});

app.put('/api/me', requireAuth, async (req, res, next) => {
  try {
    const data = perfilSchema.parse(req.body);
    const u = await prisma.usuario.update({
      where: { id: req.user.id },
      data,
    });
    res.json({
      id: u.id,
      email: u.correo,
      nombre: u.nombre,
      telefono: u.telefono,
    });
  } catch (err) {
    next(err);
  }
});

// ---- Mascotas (ABMC) ----
// Nota: Prisma requiere `sexo` y usa `tamano` (sin tilde).
const mascotaCreateSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  sexo: z.string().min(1, 'El sexo es obligatorio'),
  tamano: z.string().optional(), // "pequeño" | "mediano" | "grande"
  raza: z.string().optional(),
  edadMeses: z.coerce.number().int().min(0).optional(),
  pesoKg: z.coerce.number().min(0).optional(),
  cumpleDia: z.coerce.number().int().min(1).max(31).optional(),
  cumpleMes: z.coerce.number().int().min(1).max(12).optional(),
});

const mascotaUpdateSchema = mascotaCreateSchema.partial();

app.get(['/api/me/mascotas', '/api/me/dogs'], requireAuth, async (req, res, next) => {
  try {
    const mascotas = await prisma.mascota.findMany({
      where: { duenioId: req.user.id },
      orderBy: { creadoEn: 'desc' },
    });
    res.json(mascotas);
  } catch (err) {
    next(err);
  }
});

app.post(['/api/me/mascotas', '/api/me/dogs'], requireAuth, async (req, res, next) => {
  try {
    // Normalizar 'tamaño' → 'tamano' por si viene desde el front con tilde
    const body = { ...req.body, tamano: req.body.tamano ?? req.body['tamaño'] };
    const parsed = mascotaCreateSchema.safeParse(body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Bad input', issues: parsed.error.issues });
    }
    const b = parsed.data;

    const mascota = await prisma.mascota.create({
      data: {
        duenioId: req.user.id,
        nombre: b.nombre,
        sexo: b.sexo, // requerido por Prisma
        tamano: b.tamano ?? null,
        raza: b.raza ?? null,
        edadMeses: b.edadMeses ?? null,
        pesoKg: b.pesoKg ?? null,
        cumpleDia: b.cumpleDia ?? null,
        cumpleMes: b.cumpleMes ?? null,
        // Si luego usás campos de foto (fotoPath/Url/etc), agréguelos acá con los nombres correctos.
      },
    });
    res.status(201).json(mascota);
  } catch (err) {
    next(err);
  }
});

app.put(
  ['/api/me/mascotas/:id', '/api/me/dogs/:id'],
  requireAuth,
  async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const body = { ...req.body, tamano: req.body.tamano ?? req.body['tamaño'] };
      const parsed = mascotaUpdateSchema.safeParse(body);
      if (!parsed.success) {
        return res.status(400).json({ error: 'Bad input', issues: parsed.error.issues });
      }
      const b = parsed.data;

      const existing = await prisma.mascota.findUnique({ where: { id } });
      if (!existing || existing.duenioId !== req.user.id) {
        return res.status(404).json({ error: 'Mascota no encontrada' });
      }

      const mascota = await prisma.mascota.update({
        where: { id },
        data: {
          nombre: b.nombre ?? existing.nombre,
          sexo: b.sexo ?? existing.sexo,
          tamano: b.tamano ?? existing.tamano,
          raza: b.raza ?? existing.raza,
          edadMeses: b.edadMeses ?? existing.edadMeses,
          pesoKg: b.pesoKg ?? existing.pesoKg,
          cumpleDia: b.cumpleDia ?? existing.cumpleDia,
          cumpleMes: b.cumpleMes ?? existing.cumpleMes,
        },
      });
      res.json(mascota);
    } catch (err) {
      next(err);
    }
  }
);

app.delete(
  ['/api/me/mascotas/:id', '/api/me/dogs/:id'],
  requireAuth,
  async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const existing = await prisma.mascota.findUnique({ where: { id } });
      if (!existing || existing.duenioId !== req.user.id) {
        return res.status(404).json({ error: 'Mascota no encontrada' });
      }
      await prisma.mascota.delete({ where: { id } });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
);

// 404
app.use((_, res) => res.status(404).json({ error: 'Not Found' }));

// Manejador global de errores (incluye Zod)
app.use((err, _req, res, _next) => {
  if (err instanceof ZodError) {
    return res.status(400).json({ error: 'Bad input', issues: err.issues });
  }
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API http://localhost:${PORT}`));
