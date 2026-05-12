import { NextResponse } from 'next/server'

import { prisma } from '../../../lib/prisma.js'

const requiredEnvNames = [
  'DATABASE_URL',
  'DIRECT_URL',
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'OPENAI_API_KEY',
  'OPENAI_PROFILE',
  'OPENAI_MODEL_FAST',
  'OPENAI_MODEL_SMART',
]

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const missingEnv = requiredEnvNames.filter((name) => !process.env[name])

  let database = { ok: false }

  try {
    await prisma.$queryRaw`SELECT 1`
    database = { ok: true }
  } catch (error) {
    database = {
      ok: false,
      error: error?.message || 'Unknown database error.',
    }
  }

  const response = {
    ok: missingEnv.length === 0 && database.ok,
    app: 'bazariai-next',
    checkedAt: new Date().toISOString(),
    services: {
      database,
      env: {
        ok: missingEnv.length === 0,
        missing: missingEnv,
      },
      storage: {
        bucket: process.env.SUPABASE_STORAGE_BUCKET || 'bazariai-photos',
      },
    },
  }

  return NextResponse.json(response, {
    status: response.ok ? 200 : 503,
  })
}
