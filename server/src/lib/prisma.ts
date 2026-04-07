import 'dotenv/config'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { PrismaClient } from '../../generated/prisma/client.js'

const url = process.env.DATABASE_URL
if (!url) throw new Error('DATABASE_URL is required')

export const prisma = new PrismaClient({
  adapter: new PrismaMariaDb(url),
})
