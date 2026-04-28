import { NextResponse } from 'next/server'

const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000'

export const corsHeaders = {
  'Access-Control-Allow-Origin': corsOrigin,
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export const withCorsJson = (payload, init = {}) =>
  NextResponse.json(payload, {
    ...init,
    headers: {
      ...corsHeaders,
      ...(init.headers || {}),
    },
  })

export const withCorsEmpty = (status = 204) =>
  new NextResponse(null, {
    status,
    headers: corsHeaders,
  })
