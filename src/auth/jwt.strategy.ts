import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './types/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Extract JWT from Authorization: Bearer <token>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Secret used to sign and verify JWT
      secretOrKey: 'secretKey2024_DevTrackr',
    });
  }
  validate(payload: JwtPayload) {
    return {
      userId: payload.userId,
      email: payload.email,
    };
  }
}
