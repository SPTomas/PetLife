import jwt from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';

let jwksCache = null;

async function getJWKS() {
  if (jwksCache) return jwksCache;
  // JWKS para proyectos que usen RS256
  const url = `${process.env.SUPABASE_URL}/auth/v1/.well-known/jwks.json`;
  const res = await fetch(url);
  if (res.ok) {
    const json = await res.json();
    jwksCache = json.keys || [];
  } else {
    jwksCache = [];
  }
  return jwksCache;
}

export async function requireAuth(req, res, next) {
  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'No token' });

    // Mirar el header del JWT para saber algoritmo
    const decodedHeader = JSON.parse(
      Buffer.from(token.split('.')[0], 'base64url').toString()
    );
    const alg = decodedHeader.alg;

    let payload;

    if (alg === 'HS256') {
      // ✅ Ruta HS256 (tu caso): validar con el JWT secret del proyecto
      const secret = process.env.SUPABASE_JWT_SECRET;
      if (!secret) {
        return res.status(500).json({ error: 'Missing SUPABASE_JWT_SECRET' });
      }
      payload = jwt.verify(token, secret, { algorithms: ['HS256'] });
    } else if (alg === 'RS256') {
      // ✅ Ruta RS256: validar con JWKS públicas
      const kid = decodedHeader.kid;
      const keys = await getJWKS();
      const key = keys.find(k => k.kid === kid);
      if (!key) return res.status(401).json({ error: 'Invalid kid' });
      const pem = jwkToPem(key);
      payload = jwt.verify(token, pem, { algorithms: ['RS256'] });
    } else {
      return res.status(401).json({ error: `Unsupported alg: ${alg}` });
    }

    // OK → colgar user en la request
    req.user = { id: payload.sub, email: payload.email };
    return next();
  } catch (err) {
    console.error('Auth error:', err?.message);
    return res.status(401).json({ error: 'Invalid token' });
  }
}
