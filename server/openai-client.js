import OpenAI from 'openai'

import { config } from './config.js'

let client

export const getOpenAIClient = () => {
  if (!config.openaiApiKey) {
    throw new Error('Missing OPENAI_API_KEY in server environment.')
  }

  if (!client) {
    client = new OpenAI({ apiKey: config.openaiApiKey })
  }

  return client
}
