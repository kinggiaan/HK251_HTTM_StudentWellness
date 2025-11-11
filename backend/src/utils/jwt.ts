import jwt, { type JwtPayload, type SignOptions, type Secret } from 'jsonwebtoken';

import env from '../config/env';

type AccessTokenPayload = JwtPayload & {
  sub: string;
  role: string;
};

export function signAccessToken(
  payload: AccessTokenPayload,
  options?: SignOptions
): string {
  const secret: Secret = env.JWT_SECRET;
  const signOptions: SignOptions = {
    expiresIn: env.JWT_EXPIRY as SignOptions['expiresIn'],
    ...options
  };

  return jwt.sign(payload, secret, signOptions);
}

export function verifyAccessToken<T extends JwtPayload>(
  token: string
): T {
  const secret: Secret = env.JWT_SECRET;
  return jwt.verify(token, secret) as T;
}

type RefreshTokenPayload = JwtPayload & {
  sub: string;
  tokenId: string;
};

export function signRefreshToken(
  payload: RefreshTokenPayload,
  options?: SignOptions
): string {
  const secret: Secret = env.REFRESH_TOKEN_SECRET;
  const signOptions: SignOptions = {
    expiresIn: env.REFRESH_TOKEN_EXPIRY as SignOptions['expiresIn'],
    ...options
  };

  return jwt.sign(payload, secret, signOptions);
}

export function verifyRefreshToken<T extends JwtPayload>(
  token: string
): T {
  const secret: Secret = env.REFRESH_TOKEN_SECRET;
  return jwt.verify(token, secret) as T;
}

