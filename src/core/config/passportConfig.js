import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

const secretKey = process.env.ACCESS_TOKEN_SECRET;

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secretKey,
    },
    (jwtPayload, done) => {
      if (jwtPayload) return done(null, jwtPayload);
      return done(null, false);
    },
  ),
);

export default passport;
