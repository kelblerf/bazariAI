import { analyzeProduct } from '../../../../server/services/ai-service.js'
import { createAiOptionsResponse, createAiRoute } from '../_lib/create-ai-route'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const POST = createAiRoute({
  action: 'Analyze',
  errorMessage: 'Nepodarilo se provest analyzu produktu.',
  handler: analyzeProduct,
})

export const OPTIONS = createAiOptionsResponse
