import { prisma } from './lib/prisma.js'
import { hashPassword } from './lib/crypto.js'

export async function seed() {
  const userCount = await prisma.user.count()
  if (userCount === 0) {
    await prisma.user.create({
      data: {
        username: 'admin',
        email: 'admin@localhost',
        passwordHash: hashPassword('123456'),
        displayName: 'Admin',
        userType: 'ADMIN',
      },
    })
    console.log('Created default admin user (admin / 123456)')
  }
}
