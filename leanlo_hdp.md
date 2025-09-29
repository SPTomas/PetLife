PetLife – Puesta en marcha rápida
1 Clonar y cambiar a tu rama

2 Variables de entorno (usar tus ejemplos)
# en /Backend
cp ./.env.example ./.env

# en /Frontend
cp ./.env.example ./.env


3 Backend
cd backend
npm ci
npx prisma migrate deploy   # aplica migraciones del repo a Neon
npm run dev                 # levanta API en http://localhost:3000


✔️ Probar: abrir http://localhost:3000/api/health → { ok: true }.

4 Frontend
cd ../frontend
npm ci   (es como un npm i pero fuerza / sobreescribe si tene ya un node_modules C: eso evidentemente esto no copien)
npm run dev                 # abre en http://localhost:5173