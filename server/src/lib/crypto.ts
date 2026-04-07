import { createHash, randomBytes } from 'node:crypto'

function sha256(data: string): string {
  return createHash('sha256').update(data).digest('hex')
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex')
  return salt + '.' + sha256(salt + password)
}

export function verifyPassword(password: string, stored: string): boolean {
  const dot = stored.indexOf('.')
  const salt = stored.slice(0, dot)
  const hash = stored.slice(dot + 1)
  return sha256(salt + password) === hash
}

export function hashToken(token: string): string {
  return sha256(token)
}

export function generateToken(): string {
  return randomBytes(32).toString('hex')
}
