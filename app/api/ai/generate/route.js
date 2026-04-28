import { generateListingTexts } from '../../../../server/services/ai-service.js'
import { createAiOptionsResponse, createAiRoute } from '../_lib/create-ai-route'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const POST = createAiRoute({
  action: 'Generation',
  errorMessage: 'Nepodarilo se vygenerovat texty inzeratu.',
  handler: generateListingTexts,
})

export const OPTIONS = createAiOptionsResponse
