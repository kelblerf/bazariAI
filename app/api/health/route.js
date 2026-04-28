import { NextResponse } from 'next/server'

export function GET() {
  return NextResponse.json({
    ok: true,
    app: 'bazariai-next',
    migrationPhase: 'step-1-skeleton',
  })
}
