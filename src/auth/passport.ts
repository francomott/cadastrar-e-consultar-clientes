import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import type { JwtPayload } from './types';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('.: JWT_SECRET nao encontrado no .env');
}

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET,
    },
    async (payload: JwtPayload, done) => {
      try {
        return done(null, payload);
      } catch (err) {
        return done(err as Error, false);
      }
    }
  )
);

// Middleware pronto para proteger rotas
export const requireAuth = passport.authenticate('jwt', { session: false });

// Exporta o próprio passport para app.ts
export default passport;
