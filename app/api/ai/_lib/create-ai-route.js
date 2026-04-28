import { requireAuthenticatedUser } from '../../_lib/auth'
import { withCorsEmpty, withCorsJson } from '../../_lib/cors'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const createAiRoute = ({ action, errorMessage, handler }) =>
  async function POST(request) {
    try {
      const auth = await requireAuthenticatedUser(request)
      if (auth.response) {
        return auth.response
      }

      const body = await request.json()
      const result = await handler(body)

      return withCorsJson(result)
    } catch (error) {
      console.error(`${action} failed`, error)

      return withCorsJson(
        {
          error: errorMessage,
          details: error?.message || 'Unknown server error.',
        },
        { status: 500 }
      )
    }
  }

export const createAiOptionsResponse = () => withCorsEmpty()
