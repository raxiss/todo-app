import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthUser {
  id: number
  email: string
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser
    }
  }
}

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET is missing — set it in server/.env')
  }
  return secret
}

export function signToken(user: AuthUser): string {
  return jwt.sign({ email: user.email }, getJwtSecret(), {
    subject: String(user.id),
    expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as jwt.SignOptions['expiresIn']
  })
}

/** Verifies `Authorization: Bearer <token>` and attaches the user to the request. */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization
  const token = header && header.startsWith('Bearer ') ? header.slice('Bearer '.length) : undefined
  if (!token) {
    res.status(401).json({ status: 'error', message: 'Missing auth token — please log in' })
    return
  }
  try {
    const payload = jwt.verify(token, getJwtSecret())
    if (typeof payload === 'string' || payload.sub === undefined) {
      throw new Error('Malformed token payload')
    }
    const id = Number(payload.sub)
    if (!Number.isInteger(id)) {
      throw new Error('Malformed token subject')
    }
    req.user = { id, email: typeof payload.email === 'string' ? payload.email : '' }
    next()
  } catch {
    res.status(401).json({ status: 'error', message: 'Session expired — please log in again' })
  }
}
