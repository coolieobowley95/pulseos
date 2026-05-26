import { defineConfig } from 'prisma/config'
import 'dotenv/config'

export default defineConfig({
  earlyAccess: true,
  schema: 'prisma/schema.prisma',

  datasource: {
    url: process.env.DIRECT_URL!,
  },

  migrate: {
    async adapter() {
      const { PrismaPg } = await import('@prisma/adapter-pg')
      const { default: pg } = await import('pg')
      const pool = new pg.Pool({
        connectionString: process.env.DIRECT_URL,
        ssl: { rejectUnauthorized: false }
      })
      return new PrismaPg(pool)
    }
  },

  async adapter() {
    const { PrismaPg } = await import('@prisma/adapter-pg')
    const { default: pg } = await import('pg')
    const pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    })
    return new PrismaPg(pool)
  }
})