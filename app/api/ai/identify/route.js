import { identifyProduct } from '../../../../server/services/ai-service.js'
import { createAiOptionsResponse, createAiRoute } from '../_lib/create-ai-route'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const POST = createAiRoute({
  action: 'Identification',
  errorMessage: 'Nepodarilo se identifikovat produkt.',
  handler: identifyProduct,
})

export const OPTIONS = createAiOptionsResponse
