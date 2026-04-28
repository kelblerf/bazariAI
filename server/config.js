import dotenv from 'dotenv'

dotenv.config()

const profile = process.env.OPENAI_PROFILE || 'balanced'

const asBoolean = (value, fallback = false) => {
  if (value === undefined) {
    return fallback
  }

  return value === 'true'
}

const pickRoleModel = ({ roleOverride, sharedOverride, fallback }) => roleOverride || sharedOverride || fallback

const balancedDefaults = {
  fastModel: 'gpt-5.4-mini',
  smartModel: 'gpt-5.4',
  webSearchIdentification: true,
  webSearchAnalysis: true,
  webSearchPricing: false,
}

const ecoDefaults = {
  fastModel: 'gpt-5.4-mini',
  smartModel: 'gpt-5.4-mini',
  webSearchIdentification: true,
  webSearchAnalysis: true,
  webSearchPricing: false,
}

const profileDefaults = profile === 'eco' ? ecoDefaults : balancedDefaults

export const config = {
  port: Number(process.env.PORT || 8787),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  profile,
  identificationModel: pickRoleModel({
    roleOverride: process.env.OPENAI_MODEL_IDENTIFICATION,
    sharedOverride: process.env.OPENAI_MODEL_FAST,
    fallback: profileDefaults.fastModel,
  }),
  analysisModel: pickRoleModel({
    roleOverride: process.env.OPENAI_MODEL_ANALYSIS,
    sharedOverride: process.env.OPENAI_MODEL_FAST,
    fallback: profileDefaults.fastModel,
  }),
  pricingModel: pickRoleModel({
    roleOverride: process.env.OPENAI_MODEL_PRICING,
    sharedOverride: process.env.OPENAI_MODEL_FAST,
    fallback: profileDefaults.fastModel,
  }),
  generationModel: pickRoleModel({
    roleOverride: process.env.OPENAI_MODEL_GENERATION,
    sharedOverride: process.env.OPENAI_MODEL_SMART,
    fallback: profileDefaults.smartModel,
  }),
  enableWebSearchForIdentification: asBoolean(
    process.env.OPENAI_ENABLE_WEB_SEARCH_IDENTIFICATION,
    profileDefaults.webSearchIdentification
  ),
  enableWebSearchForAnalysis: asBoolean(
    process.env.OPENAI_ENABLE_WEB_SEARCH_ANALYSIS,
    profileDefaults.webSearchAnalysis
  ),
  enableWebSearchForPricing: asBoolean(
    process.env.OPENAI_ENABLE_WEB_SEARCH_PRICING ?? process.env.OPENAI_ENABLE_WEB_SEARCH,
    profileDefaults.webSearchPricing
  ),
}
