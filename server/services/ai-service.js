import { config } from '../config.js'
import { getOpenAIClient } from '../openai-client.js'
import { buildAnalysisMessages, buildGenerationMessages, buildIdentificationMessages, buildPricingMessages } from '../prompt-builders.js'
import { analysisSchema, generationSchema, identificationSchema, pricingSchema } from '../schemas.js'

const parseStructuredResponse = (response) => {
  if (response.output_text) {
    return JSON.parse(response.output_text)
  }

  const textBlock = response.output
    ?.flatMap((item) => item.content || [])
    ?.find((item) => item.type === 'output_text')

  if (!textBlock?.text) {
    throw new Error('Model did not return structured output.')
  }

  return JSON.parse(textBlock.text)
}

const createStructuredResponse = async ({ model, messages, schemaName, schema, tools }) => {
  const client = getOpenAIClient()

  const response = await client.responses.create({
    model,
    input: messages,
    tools,
    text: {
      format: {
        type: 'json_schema',
        name: schemaName,
        schema,
        strict: true,
      },
    },
  })

  return parseStructuredResponse(response)
}

export const identifyProduct = async ({ product, photos }) =>
  createStructuredResponse({
    model: config.identificationModel,
    messages: buildIdentificationMessages({ product, photos }),
    schemaName: 'product_identification',
    schema: identificationSchema,
    tools: config.enableWebSearchForIdentification ? [{ type: 'web_search' }] : [],
  })

export const analyzeProduct = async ({ product, photos, identification }) =>
  createStructuredResponse({
    model: config.analysisModel,
    messages: buildAnalysisMessages({ product, photos, identification }),
    schemaName: 'product_analysis',
    schema: analysisSchema,
    tools: config.enableWebSearchForAnalysis ? [{ type: 'web_search' }] : [],
  })

export const priceProduct = async ({ product, analysis, identification }) =>
  createStructuredResponse({
    model: config.pricingModel,
    messages: buildPricingMessages({ product, analysis, identification }),
    schemaName: 'product_pricing',
    schema: pricingSchema,
    tools: config.enableWebSearchForPricing ? [{ type: 'web_search' }] : [],
  })

export const generateListingTexts = async ({ product, analysis, pricing, identification }) =>
  createStructuredResponse({
    model: config.generationModel,
    messages: buildGenerationMessages({ product, analysis, pricing, identification }),
    schemaName: 'listing_generation',
    schema: generationSchema,
    tools: [],
  })
