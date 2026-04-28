import { priceProduct } from '../../../../server/services/ai-service.js'
import { createAiOptionsResponse, createAiRoute } from '../_lib/create-ai-route'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const POST = createAiRoute({
  action: 'Pricing',
  errorMessage: 'Nepodarilo se navrhnout cenu produktu.',
  handler: priceProduct,
})

export const OPTIONS = createAiOptionsResponse
