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
  tamano: z.string().optional(),        // "pequeño" | "mediano" | "grande"
  raza: z.string().optional(),
  edadMeses: z.coerce.number().int().min(0).optional(),
  pesoKg: z.coerce.number().min(0).optional(),
  cumpleDia: z.coerce.number().int().min(1).max(31).optional(),
  cumpleMes: z.coerce.number().int().min(1).max(12).optional(),

  // ✅ NUEVOS CAMPOS: fecha completa y año
  fechaNacimiento: z.coerce.date().optional(),   // acepta ISO y Date
  nacAnio: z.coerce.number().int().optional(),   // ej. 2021
});

const mascotaUpdateSchema = mascotaCreateSchema.partial();

// Listado
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

// Obtener una mascota (DETALLE) ✅
app.get(['/api/me/mascotas/:id', '/api/me/dogs/:id'], requireAuth, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const mascota = await prisma.mascota.findUnique({ where: { id } });
    if (!mascota || mascota.duenioId !== req.user.id) {
      return res.status(404).json({ error: 'Mascota no encontrada' });
    }
    res.json(mascota);
  } catch (err) { next(err); }
});

// Crear
app.post(['/api/me/mascotas', '/api/me/dogs'], requireAuth, async (req, res, next) => {
  try {
    // Normalizar tamaño → tamano
    const raw = { ...req.body, tamano: req.body.tamano ?? req.body['tamaño'] };
    const parsed = mascotaCreateSchema.safeParse(raw);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Bad input', issues: parsed.error.issues });
    }
    const b = parsed.data;

    const mascota = await prisma.mascota.create({
      data: {
        duenioId:   req.user.id,
        nombre:     b.nombre,
        sexo:       b.sexo,
        tamano:     b.tamano ?? null,
        raza:       b.raza ?? null,
        edadMeses:  b.edadMeses ?? null,
        pesoKg:     b.pesoKg ?? null,
        cumpleDia:  b.cumpleDia ?? null,
        cumpleMes:  b.cumpleMes ?? null,

        // ✅ NUEVO: persistimos fecha/año
        fechaNacimiento: b.fechaNacimiento ?? null,
        nacAnio:         b.nacAnio ?? null,

        // Campos de foto (opcionales)
        fotoBucket:     raw.fotoBucket ?? null,
        fotoPath:       raw.fotoPath ?? null,
        fotoUrl:        raw.fotoUrl ?? null,
        fotoSizeBytes:  raw.fotoSizeBytes ?? null,
        fotoWidth:      raw.fotoWidth ?? null,
        fotoHeight:     raw.fotoHeight ?? null,
        fotoFormat:     raw.fotoFormat ?? null,
      }
    });

    res.status(201).json(mascota);
  } catch (err) { next(err); }
});

// Actualizar
app.put(['/api/me/mascotas/:id', '/api/me/dogs/:id'], requireAuth, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const raw = { ...req.body, tamano: req.body.tamano ?? req.body['tamaño'] };
    const parsed = mascotaUpdateSchema.safeParse(raw);
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
        nombre:     b.nombre ?? existing.nombre,
        sexo:       b.sexo ?? existing.sexo,
        tamano:     b.tamano ?? existing.tamano,
        raza:       b.raza ?? existing.raza,
        edadMeses:  b.edadMeses ?? existing.edadMeses,
        pesoKg:     b.pesoKg ?? existing.pesoKg,
        cumpleDia:  b.cumpleDia ?? existing.cumpleDia,
        cumpleMes:  b.cumpleMes ?? existing.cumpleMes,

        // ✅ NUEVO
        fechaNacimiento: b.fechaNacimiento ?? existing.fechaNacimiento,
        nacAnio:         b.nacAnio ?? existing.nacAnio,

        // Campos de foto (si vienen)
        fotoBucket:     raw.fotoBucket ?? existing.fotoBucket,
        fotoPath:       raw.fotoPath ?? existing.fotoPath,
        fotoUrl:        raw.fotoUrl ?? existing.fotoUrl,
        fotoSizeBytes:  raw.fotoSizeBytes ?? existing.fotoSizeBytes,
        fotoWidth:      raw.fotoWidth ?? existing.fotoWidth,
        fotoHeight:     raw.fotoHeight ?? existing.fotoHeight,
        fotoFormat:     raw.fotoFormat ?? existing.fotoFormat,
      }
    });

    res.json(mascota);
  } catch (err) { next(err); }
});

// Eliminar
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
