import type { User } from '@prisma/client';

import type { ChangePasswordInput, LoginInput, RefreshInput } from './auth.schema';
import { prisma } from '../../config';
import env from '../../config/env';
import AppError from '../../utils/appError';
import { addDurationToNow, durationToSeconds } from '../../utils/duration';
import { HTTP_STATUS } from '../../utils/httpStatus';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/jwt';
import { comparePassword, hashPassword } from '../../utils/password';
import { hashToken } from '../../utils/token';
import { createAuditLog } from '../common';
import { toUserResponse } from '../common/mappers';

interface AuthContext {
  ip?: string;
  userAgent?: string;
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  refreshTokenId: string;
}

function buildAccessToken(user: User): string {
  return signAccessToken({
    sub: user.id,
    email: user.email,
    role: user.role
  });
}

async function buildRefreshToken(user: User): Promise<{ token: string; tokenId: string }> {
  const expiresAt = addDurationToNow(env.REFRESH_TOKEN_EXPIRY);
  const record = await prisma.refreshToken.create({
    data: {
      userId: user.id,
      expiresAt,
      token: ''
    }
  });

  const token = signRefreshToken({
    sub: user.id,
    tokenId: record.id
  });

  await prisma.refreshToken.update({
    where: { id: record.id },
    data: {
      token: hashToken(token)
    }
  });

  return { token, tokenId: record.id };
}

async function generateTokenPair(user: User): Promise<TokenPair> {
  const accessToken = buildAccessToken(user);
  const { token: refreshToken, tokenId } = await buildRefreshToken(user);
  const expiresIn = durationToSeconds(env.JWT_EXPIRY);

  return {
    accessToken,
    refreshToken,
    expiresIn,
    refreshTokenId: tokenId
  };
}

export async function login(input: LoginInput, context: AuthContext = {}) {
  const user = await prisma.user.findUnique({
    where: { email: input.email }
  });

  if (!user) {
    throw new AppError('Invalid credentials', HTTP_STATUS.UNAUTHORIZED);
  }

  const isValid = await comparePassword(input.password, user.password);
  if (!isValid) {
    throw new AppError('Invalid credentials', HTTP_STATUS.UNAUTHORIZED);
  }

  const tokens = await generateTokenPair(user);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      lastLogin: new Date()
    }
  });

  await createAuditLog({
    userId: user.id,
    action: 'auth.login',
    ip: context.ip,
    userAgent: context.userAgent
  });

  return {
    user: toUserResponse(user),
    tokens
  };
}

export async function refreshTokens(input: RefreshInput, context: AuthContext = {}) {
  const payload = verifyRefreshToken<{ sub: string; tokenId: string }>(input.refreshToken);

  const storedToken = await prisma.refreshToken.findUnique({
    where: { id: payload.tokenId }
  });

  if (!storedToken || storedToken.revoked) {
    throw new AppError('Invalid refresh token', HTTP_STATUS.UNAUTHORIZED);
  }

  if (storedToken.expiresAt < new Date()) {
    throw new AppError('Refresh token expired', HTTP_STATUS.UNAUTHORIZED);
  }

  if (storedToken.userId !== payload.sub) {
    throw new AppError('Invalid refresh token', HTTP_STATUS.UNAUTHORIZED);
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.sub }
  });

  if (!user) {
    throw new AppError('User not found', HTTP_STATUS.UNAUTHORIZED);
  }

  const tokens = await generateTokenPair(user);

  await prisma.refreshToken.update({
    where: { id: storedToken.id },
    data: {
      revoked: true,
      revokedAt: new Date(),
      replacedBy: tokens.refreshTokenId
    }
  });

  await createAuditLog({
    userId: user.id,
    action: 'auth.refresh',
    ip: context.ip,
    userAgent: context.userAgent
  });

  return {
    user: toUserResponse(user),
    tokens
  };
}

export async function logout(input: RefreshInput, context: AuthContext = {}) {
  const payload = verifyRefreshToken<{ sub: string; tokenId: string }>(input.refreshToken);

  await prisma.refreshToken.updateMany({
    where: {
      id: payload.tokenId,
      revoked: false
    },
    data: {
      revoked: true,
      revokedAt: new Date()
    }
  });

  await createAuditLog({
    userId: payload.sub,
    action: 'auth.logout',
    ip: context.ip,
    userAgent: context.userAgent
  });
}

export async function changePassword(
  userId: string,
  input: ChangePasswordInput,
  context: AuthContext = {}
) {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
  }

  const isValid = await comparePassword(input.currentPassword, user.password);
  if (!isValid) {
    throw new AppError('Current password is incorrect', HTTP_STATUS.UNAUTHORIZED);
  }

  const hashedPassword = await hashPassword(input.newPassword);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword
    }
  });

  await createAuditLog({
    userId: user.id,
    action: 'auth.change_password',
    ip: context.ip,
    userAgent: context.userAgent,
    metadata: { userId: user.id }
  });
}

