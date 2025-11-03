import { Router } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('.: JWT_SECRET nao encontrado no .env');
}

const JWT_EXPIRES_IN = '1h';

router.get('/token', (_req, res) => {
  const now = Date.now();

  const payload = {
    emittedAt: now,
    expirationAt: now + 1000 * 60 * 60, 
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

  return res.status(200).json({
    token_type: 'Bearer',
    access_token: token,
  });
});

export default router;
